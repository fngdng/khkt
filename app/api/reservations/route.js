import { NextResponse } from 'next/server';

import { hasStaffSession } from '../../../src/server/auth.js';
import { createReservation } from '../../../src/reservationService.js';
import { getReservations, getTables, insertReservation } from '../../../src/server/reservationRepository.js';

function activeReservations(rows) {
  return rows.filter((row) => row.status !== 'cancelled').map((row) => ({
    date: row.date, time: row.time, durationMinutes: row.durationMinutes, tableId: row.tableId,
  }));
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get('phone')?.trim();
  if (!phone && !hasStaffSession(request)) {
    return NextResponse.json({ message: 'Enter the booking phone number or sign in as staff.' }, { status: 401 });
  }
  try {
    return NextResponse.json({ reservations: await getReservations({ phone: phone || undefined }) });
  } catch (error) {
    console.error('GET /api/reservations failed', error);
    return NextResponse.json({ message: 'Unable to load reservations.' }, { status: 500 });
  }
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, errors: ['Request body must be valid JSON.'] }, { status: 400 });
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ ok: false, errors: ['Request body must be a JSON object.'] }, { status: 400 });
  }

  const payload = {
    customerName: body.customerName,
    phone: body.phone,
    date: body.date,
    time: body.time,
    durationMinutes: Number(body.durationMinutes),
    partySize: Number(body.partySize),
    tableId: body.tableId || undefined,
  };

  try {
    const [tables, reservations] = await Promise.all([getTables(), getReservations()]);
    const result = createReservation({ tables, existingReservations: activeReservations(reservations), request: payload });
    if (!result.ok) return NextResponse.json({ ok: false, errors: result.errors }, { status: 400 });

    // Deliberate race window for the UI defect demonstration in BUG-04.
    await new Promise((resolve) => setTimeout(resolve, 400));
    const reservation = await insertReservation({ ...result.reservation, status: 'pending' });
    return NextResponse.json({ ok: true, reservation }, { status: 201 });
  } catch (error) {
    console.error('POST /api/reservations failed', error);
    return NextResponse.json({ message: 'Unable to create reservation.' }, { status: 500 });
  }
}
