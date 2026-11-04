import { NextResponse } from 'next/server';

import { hashReservationAccessToken } from '../../../../src/server/reservationAccess.js';
import { getReservationsForCustomer } from '../../../../src/server/reservationRepository.js';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Yêu cầu JSON không hợp lệ.' }, { status: 400 });
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ message: 'Yêu cầu JSON không hợp lệ.' }, { status: 400 });
  }
  const accessTokenHash = hashReservationAccessToken(body.accessToken);
  const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
  if (!phone || phone.length > 32 || !accessTokenHash) {
    return NextResponse.json({ message: 'Thông tin tra cứu không hợp lệ.' }, { status: 400 });
  }

  try {
    const reservations = await getReservationsForCustomer({ phone, accessTokenHash });
    if (!reservations.length) {
      return NextResponse.json({ message: 'Không tìm thấy lượt đặt phù hợp.' }, { status: 404 });
    }
    return NextResponse.json({ reservations });
  } catch (error) {
    console.error('Unable to look up customer reservations.', error);
    return NextResponse.json({ message: 'Không thể tra cứu đặt bàn.' }, { status: 500 });
  }
}
