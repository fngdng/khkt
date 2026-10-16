import { pool } from './db.js';

export async function getTables() {
  const result = await pool.query('SELECT id, capacity FROM tables ORDER BY capacity ASC');
  return result.rows.map((row) => ({
    id: row.id,
    capacity: Number(row.capacity),
  }));
}

export async function getReservations({ phone } = {}) {
  const values = [];
  let whereClause = '';

  if (phone) {
    values.push(phone);
    whereClause = 'WHERE phone = $1';
  }

  const query = `
    SELECT
      id,
      customer_name,
      phone,
      reservation_date,
      reservation_time,
      duration_minutes,
      party_size,
      table_id,
      status
    FROM reservations
    ${whereClause}
    ORDER BY reservation_date ASC, reservation_time ASC, id ASC
  `;

  const result = await pool.query(query, values);

  return result.rows.map((row) => ({
    id: row.id,
    customerName: row.customer_name,
    phone: row.phone,
    date: row.reservation_date.toISOString().slice(0, 10),
    time: row.reservation_time.slice(0, 5),
    durationMinutes: Number(row.duration_minutes),
    partySize: Number(row.party_size),
    tableId: row.table_id,
    status: row.status,
  }));
}

export async function insertReservation(reservation) {
  const result = await pool.query(
    `
      INSERT INTO reservations (
        customer_name,
        phone,
        reservation_date,
        reservation_time,
        duration_minutes,
        party_size,
        table_id,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING
        id,
        customer_name,
        phone,
        reservation_date,
        reservation_time,
        duration_minutes,
        party_size,
        table_id,
        status
    `,
    [
      reservation.customerName,
      reservation.phone,
      reservation.date,
      reservation.time,
      reservation.durationMinutes,
      reservation.partySize,
      reservation.tableId,
      reservation.status,
    ]
  );

  const row = result.rows[0];

  return {
    id: row.id,
    customerName: row.customer_name,
    phone: row.phone,
    date: row.reservation_date.toISOString().slice(0, 10),
    time: row.reservation_time.slice(0, 5),
    durationMinutes: Number(row.duration_minutes),
    partySize: Number(row.party_size),
    tableId: row.table_id,
    status: row.status,
  };
}

export async function updateReservationStatus({ id, status }) {
  const result = await pool.query(
    `
      UPDATE reservations
      SET status = $2, updated_at = NOW()
      WHERE id = $1
      RETURNING
        id,
        customer_name,
        phone,
        reservation_date,
        reservation_time,
        duration_minutes,
        party_size,
        table_id,
        status
    `,
    [id, status]
  );

  if (result.rowCount === 0) {
    return null;
  }

  const row = result.rows[0];

  return {
    id: row.id,
    customerName: row.customer_name,
    phone: row.phone,
    date: row.reservation_date.toISOString().slice(0, 10),
    time: row.reservation_time.slice(0, 5),
    durationMinutes: Number(row.duration_minutes),
    partySize: Number(row.party_size),
    tableId: row.table_id,
    status: row.status,
  };
}
