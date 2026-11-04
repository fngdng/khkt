import { pool } from './db.js';
import { createReservation } from '../reservationService.js';

let schemaReady;

async function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS tables (
          id TEXT PRIMARY KEY,
          capacity INTEGER NOT NULL CHECK (capacity > 0)
        )
      `);
      await pool.query(`
        CREATE TABLE IF NOT EXISTS reservations (
          id SERIAL PRIMARY KEY,
          customer_name TEXT NOT NULL,
          phone VARCHAR(10) NOT NULL,
          reservation_date DATE NOT NULL,
          reservation_time TIME NOT NULL,
          duration_minutes INTEGER NOT NULL CHECK (duration_minutes >= 30),
          party_size INTEGER NOT NULL CHECK (party_size > 0),
          table_id TEXT NOT NULL REFERENCES tables(id),
          status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'arrived', 'cancelled')),
          access_token_hash TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);
      await pool.query('ALTER TABLE reservations ADD COLUMN IF NOT EXISTS access_token_hash TEXT');
      await pool.query('CREATE INDEX IF NOT EXISTS idx_reservations_phone ON reservations(phone)');
      await pool.query('CREATE INDEX IF NOT EXISTS idx_reservations_slot ON reservations(reservation_date, reservation_time)');
      await pool.query(`
        INSERT INTO tables (id, capacity)
        VALUES ('T1', 2), ('T2', 4), ('T3', 6), ('T4', 8)
        ON CONFLICT (id) DO NOTHING
      `);
    })().catch((error) => {
        schemaReady = undefined;
        throw error;
      });
  }
  await schemaReady;
}

function mapReservation(row) {
  const date = row.reservation_date instanceof Date
    ? row.reservation_date.toISOString().slice(0, 10)
    : String(row.reservation_date).slice(0, 10);
  return {
    id: row.id,
    customerName: row.customer_name,
    phone: row.phone,
    date,
    time: String(row.reservation_time).slice(0, 5),
    durationMinutes: Number(row.duration_minutes),
    partySize: Number(row.party_size),
    tableId: row.table_id,
    status: row.status,
  };
}

const RESERVATION_COLUMNS = `
  id, customer_name, phone, reservation_date::text AS reservation_date,
  reservation_time, duration_minutes, party_size, table_id, status
`;

export async function getTables() {
  await ensureSchema();
  const result = await pool.query('SELECT id, capacity FROM tables ORDER BY capacity ASC');
  return result.rows.map((row) => ({ id: row.id, capacity: Number(row.capacity) }));
}

export async function getReservations({ phone } = {}) {
  await ensureSchema();
  const values = [];
  let whereClause = '';
  if (phone) {
    values.push(phone);
    whereClause = 'WHERE phone = $1';
  }
  const result = await pool.query(
    `SELECT ${RESERVATION_COLUMNS} FROM reservations ${whereClause}
     ORDER BY reservation_date ASC, reservation_time ASC, id ASC`,
    values,
  );
  return result.rows.map(mapReservation);
}

export async function getReservationsForCustomer({ phone, accessTokenHash }) {
  await ensureSchema();
  const result = await pool.query(
    `SELECT ${RESERVATION_COLUMNS} FROM reservations
     WHERE phone = $1 AND access_token_hash = $2
     ORDER BY reservation_date ASC, reservation_time ASC, id ASC`,
    [phone, accessTokenHash],
  );
  return result.rows.map(mapReservation);
}

export async function insertReservation(reservation, accessTokenHash) {
  await ensureSchema();
  const result = await pool.query(
    `INSERT INTO reservations (
       customer_name, phone, reservation_date, reservation_time,
       duration_minutes, party_size, table_id, status, access_token_hash
     ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', $8)
     RETURNING ${RESERVATION_COLUMNS}`,
    [
      reservation.customerName,
      reservation.phone,
      reservation.date,
      reservation.time,
      reservation.durationMinutes,
      reservation.partySize,
      reservation.tableId,
      accessTokenHash,
    ],
  );
  return mapReservation(result.rows[0]);
}

export async function createReservationAtomically({ request, accessTokenHash }) {
  await ensureSchema();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const tableResult = await client.query('SELECT id, capacity FROM tables ORDER BY id ASC');
    const tables = tableResult.rows.map((row) => ({ id: row.id, capacity: Number(row.capacity) }));

    // Lock every table in stable order so concurrent requests cannot both pass
    // the availability check before inserting an overlapping booking.
    for (const table of tables) {
      await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [table.id]);
    }

    const existingResult = await client.query(
      `SELECT reservation_date::text AS reservation_date, reservation_time,
              duration_minutes, table_id, status
       FROM reservations WHERE status <> 'cancelled'`,
    );
    const existingReservations = existingResult.rows.map((row) => ({
      date: row.reservation_date,
      time: String(row.reservation_time).slice(0, 5),
      durationMinutes: Number(row.duration_minutes),
      tableId: row.table_id,
      status: row.status,
    }));

    const result = createReservation({ tables, existingReservations, request });
    if (!result.ok) {
      await client.query('ROLLBACK');
      return result;
    }

    const reservation = result.reservation;
    const inserted = await client.query(
      `INSERT INTO reservations (
         customer_name, phone, reservation_date, reservation_time,
         duration_minutes, party_size, table_id, status, access_token_hash
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', $8)
       RETURNING ${RESERVATION_COLUMNS}`,
      [
        reservation.customerName,
        reservation.phone,
        reservation.date,
        reservation.time,
        reservation.durationMinutes,
        reservation.partySize,
        reservation.tableId,
        accessTokenHash,
      ],
    );
    await client.query('COMMIT');
    return { ok: true, reservation: mapReservation(inserted.rows[0]) };
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    throw error;
  } finally {
    client.release();
  }
}

export async function updateReservationStatus({ id, status, accessTokenHash, isAdmin }) {
  await ensureSchema();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const currentResult = await client.query(
      `SELECT ${RESERVATION_COLUMNS}, access_token_hash FROM reservations WHERE id = $1 FOR UPDATE`,
      [id],
    );
    if (currentResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return { kind: 'not_found' };
    }

    const current = currentResult.rows[0];
    if (!isAdmin && (!accessTokenHash || current.access_token_hash !== accessTokenHash)) {
      await client.query('ROLLBACK');
      return { kind: 'forbidden' };
    }
    const updated = await client.query(
      `UPDATE reservations SET status = $2, updated_at = NOW()
       WHERE id = $1 RETURNING ${RESERVATION_COLUMNS}`,
      [id, status],
    );
    await client.query('COMMIT');
    return { kind: 'ok', reservation: mapReservation(updated.rows[0]) };
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    throw error;
  } finally {
    client.release();
  }
}
