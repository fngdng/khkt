import { NextResponse } from 'next/server';

import { hasStaffSession } from '../../../src/server/auth.js';
import { getReservations, reserveAtomically } from '../../../src/server/reservationRepository.js';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get('phone')?.trim();
  if (!phone && !hasStaffSession(request)) {
    return NextResponse.json({ message: 'Enter the booking phone number or sign in as staff.' }, { status: 401 });
  }

  try {
    const reservations = await getReservations({ phone: phone || undefined });
    return NextResponse.json({ reservations });
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
    const result = await reserveAtomically(payload);
    if (!result.ok) return NextResponse.json({ ok: false, errors: result.errors }, { status: 400 });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('POST /api/reservations failed', error);
    return NextResponse.json({ message: 'Unable to create reservation.' }, { status: 500 });
  }
}
