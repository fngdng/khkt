import { NextResponse } from 'next/server';

import { createReservation } from '../../../src/reservationService.js';
import {
  getReservations,
  getTables,
  insertReservation,
} from '../../../src/server/reservationRepository.js';

function sanitizeExistingReservations(rows) {
  return rows
    .filter((reservation) => reservation.status !== 'cancelled')
    .map((reservation) => ({
      date: reservation.date,
      time: reservation.time,
      durationMinutes: reservation.durationMinutes,
      tableId: reservation.tableId,
    }));
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone') || undefined;

    const reservations = await getReservations({ phone });
    return NextResponse.json({ reservations });
  } catch (error) {
    return NextResponse.json(
      { message: 'Không thể tải danh sách đặt bàn.', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const payload = {
      customerName: body.customerName,
      phone: body.phone,
      date: body.date,
      time: body.time,
      durationMinutes: Number(body.durationMinutes),
      partySize: Number(body.partySize),
      tableId: body.tableId || undefined,
    };

    const [tables, reservations] = await Promise.all([
      getTables(),
      getReservations(),
    ]);

    const result = createReservation({
      tables,
      existingReservations: sanitizeExistingReservations(reservations),
      request: payload,
    });

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, errors: result.errors },
        { status: 400 }
      );
    }

    const stored = await insertReservation({
      ...result.reservation,
      status: 'pending',
    });

    return NextResponse.json({ ok: true, reservation: stored }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Không thể tạo đặt bàn mới.', details: error.message },
      { status: 500 }
    );
  }
}
