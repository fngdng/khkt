import { pool } from './db.js';

let tableReady;

async function ensureWaitlistTable() {
  if (!tableReady) {
    tableReady = pool.query(`
      CREATE TABLE IF NOT EXISTS waiting_list (
        id SERIAL PRIMARY KEY,
        customer_name TEXT NOT NULL,
        phone VARCHAR(10) NOT NULL,
        reservation_date DATE NOT NULL,
        reservation_time TIME NOT NULL,
        duration_minutes INTEGER NOT NULL CHECK (duration_minutes >= 30),
        party_size INTEGER NOT NULL CHECK (party_size > 0),
        status TEXT NOT NULL CHECK (status IN ('waiting', 'notified', 'converted', 'cancelled')),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_waiting_list_phone ON waiting_list(phone);
      CREATE INDEX IF NOT EXISTS idx_waiting_list_slot ON waiting_list(reservation_date, reservation_time);
    `).catch((error) => {
      tableReady = null;
      throw error;
    });
  }
  await tableReady;
}

function mapRow(row) {
  return {
    id: row.id,
    customerName: row.customer_name,
    phone: row.phone,
    date: row.reservation_date.toISOString().slice(0, 10),
    time: row.reservation_time.slice(0, 5),
    durationMinutes: Number(row.duration_minutes),
    partySize: Number(row.party_size),
    status: row.status,
  };
}

export async function getWaitlist({ phone } = {}) {
  await ensureWaitlistTable();
  const values = phone ? [phone] : [];
  const result = await pool.query(`
    SELECT id, customer_name, phone, reservation_date, reservation_time,
      duration_minutes, party_size, status
    FROM waiting_list
    ${phone ? 'WHERE phone = $1' : ''}
    ORDER BY reservation_date ASC, reservation_time ASC, id ASC
  `, values);
  return result.rows.map(mapRow);
}

export async function insertWaitlistEntry(entry) {
  await ensureWaitlistTable();
  const result = await pool.query(`
    INSERT INTO waiting_list (
      customer_name, phone, reservation_date, reservation_time,
      duration_minutes, party_size, status
    ) VALUES ($1, $2, $3, $4, $5, $6, 'waiting')
    RETURNING id, customer_name, phone, reservation_date, reservation_time,
      duration_minutes, party_size, status
  `, [entry.customerName, entry.phone, entry.date, entry.time, entry.durationMinutes, entry.partySize]);
  return mapRow(result.rows[0]);
}

export async function updateWaitlistStatus({ id, status }) {
  await ensureWaitlistTable();
  const result = await pool.query(`
    UPDATE waiting_list SET status = $2, updated_at = NOW()
    WHERE id = $1
    RETURNING id, customer_name, phone, reservation_date, reservation_time,
      duration_minutes, party_size, status
  `, [id, status]);
  return result.rowCount ? mapRow(result.rows[0]) : null;
}
