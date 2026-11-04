import { NextResponse } from 'next/server';

import { createReservation, validateReservationRequest } from '../../../src/reservationService.js';
import { hasAdminSession } from '../../../src/server/adminAuth.js';
import {
  createReservationAccessToken,
  hashReservationAccessToken,
} from '../../../src/server/reservationAccess.js';
import {
  getReservations,
  getReservationsForCustomer,
  getTables,
  insertReservation,
} from '../../../src/server/reservationRepository.js';

function isJsonObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone') || undefined;
    const reservationToken = request.headers.get('x-reservation-token');
    if (phone && reservationToken) {
      await new Promise((resolve) => setTimeout(resolve, 3200));
    }
    if (!hasAdminSession(request)) {
      const accessTokenHash = hashReservationAccessToken(
        request.headers.get('x-reservation-token'),
      );
      if (!phone || !accessTokenHash) {
        return NextResponse.json({ message: 'Cần mã truy cập đặt bàn hợp lệ.' }, { status: 401 });
      }
      const reservations = await getReservationsForCustomer({ phone, accessTokenHash });
      return NextResponse.json({ reservations });
    }
    const reservations = await getReservations({ phone });
    return NextResponse.json({ reservations });
  } catch (error) {
    console.error('Unable to load reservations.', error);
    return NextResponse.json({ message: 'Không thể tải danh sách đặt bàn.' }, { status: 500 });
  }
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, errors: ['Nội dung JSON không hợp lệ.'] }, { status: 400 });
  }
  if (!isJsonObject(body)) {
    return NextResponse.json({ ok: false, errors: ['Yêu cầu đặt bàn phải là một đối tượng JSON.'] }, { status: 400 });
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
  const issues = validateReservationRequest(payload);
  if (issues.length) {
    return NextResponse.json({ ok: false, errors: issues }, { status: 400 });
  }

  const { token, tokenHash } = createReservationAccessToken();
  try {
    const [tables, reservations] = await Promise.all([getTables(), getReservations()]);
    const result = createReservation({
      tables,
      existingReservations: reservations
        .filter((reservation) => reservation.status !== 'cancelled')
        .map((reservation) => ({
          date: reservation.date,
          time: reservation.time,
          durationMinutes: reservation.durationMinutes,
          tableId: reservation.tableId,
        })),
      request: payload,
    });
    if (!result.ok) {
      return NextResponse.json({ ok: false, errors: result.errors }, { status: 409 });
    }
    const reservation = await insertReservation(result.reservation, tokenHash);
    return NextResponse.json(
      { ok: true, reservation, accessToken: token },
      { status: 201 },
    );
  } catch (error) {
    console.error('Unable to create reservation.', error);
    return NextResponse.json({ message: 'Không thể tạo đặt bàn mới.' }, { status: 500 });
  }
}
