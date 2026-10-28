import { NextResponse } from 'next/server';

import { hasStaffSession } from '../../../../src/server/auth.js';
import { updateReservationStatus } from '../../../../src/server/reservationRepository.js';

const ALLOWED_STATUS = new Set(['pending', 'confirmed', 'arrived', 'cancelled']);

export async function PATCH(request, { params }) {
  const { id } = await params;
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Request body must be valid JSON.' }, { status: 400 });
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ message: 'Request body must be a JSON object.' }, { status: 400 });
  }

  const staff = hasStaffSession(request);
  const { status } = body;
  if (!ALLOWED_STATUS.has(status)) {
    return NextResponse.json({ message: 'Invalid reservation status.' }, { status: 400 });
  }
  if (!staff && status !== 'cancelled') {
    return NextResponse.json({ message: 'Only staff can make this status change.' }, { status: 401 });
  }
  const phone = typeof body.phone === 'string' ? body.phone.replace(/\D/g, '') : undefined;
  if (!staff && (!phone || !/^0\d{9}$/.test(phone))) {
    return NextResponse.json({ message: 'Enter the phone number used for this booking to verify ownership.' }, { status: 401 });
  }

  try {
    const reservation = await updateReservationStatus({ id: Number(id), status, phone: staff ? undefined : phone });
    if (!reservation) return NextResponse.json({ message: 'Reservation not found.' }, { status: 404 });
    return NextResponse.json({ ok: true, reservation });
  } catch (error) {
    console.error(`PATCH /api/reservations/${id} failed`, error);
    return NextResponse.json({ message: 'Unable to update reservation status.' }, { status: 500 });
  }
}
