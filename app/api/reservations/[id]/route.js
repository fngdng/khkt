import { NextResponse } from 'next/server';

import { hasStaffSession } from '../../../../src/server/auth.js';
import { getReservationStatus, updateReservationStatus } from '../../../../src/server/reservationRepository.js';

const TRANSITIONS = {
  pending: new Set(['confirmed', 'cancelled']),
  confirmed: new Set(['arrived', 'cancelled']),
  arrived: new Set(),
  cancelled: new Set(),
};

export async function PATCH(request, { params }) {
  const { id } = await params;
  if (!/^[1-9]\d*$/.test(id)) {
    return NextResponse.json({ message: 'MÃ£ Ä‘áº·t bÃ n khÃ´ng há»£p lá»‡.' }, { status: 400 });
  }

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
  if (!['confirmed', 'arrived', 'cancelled'].includes(status)) {
    return NextResponse.json({ message: 'Tráº¡ng thÃ¡i khÃ´ng há»£p lá»‡.' }, { status: 400 });
  }
  if (!staff && status !== 'cancelled') {
    return NextResponse.json({ message: 'Chá»‰ nhÃ¢n viÃªn Ä‘Æ°á»£c phÃ©p cáº­p nháº­t tráº¡ng thÃ¡i nÃ y.' }, { status: 401 });
  }

  const phone = typeof body.phone === 'string' ? body.phone.replace(/\D/g, '') : undefined;
  if (!staff && (!phone || !/^0\d{9}$/.test(phone))) {
    return NextResponse.json({ message: 'Cáº§n sá»‘ Ä‘iá»‡n thoáº¡i Ä‘Ã£ dÃ¹ng khi Ä‘áº·t bÃ n Ä‘á»ƒ xÃ¡c minh.' }, { status: 401 });
  }

  try {
    const numericId = Number(id);
    const currentStatus = await getReservationStatus(numericId);
    if (!currentStatus) return NextResponse.json({ message: 'KhÃ´ng tÃ¬m tháº¥y Ä‘áº·t bÃ n.' }, { status: 404 });
    if (!TRANSITIONS[currentStatus]?.has(status)) {
      return NextResponse.json({ message: 'KhÃ´ng thá»ƒ chuyá»ƒn tráº¡ng thÃ¡i theo quy trÃ¬nh Ä‘áº·t bÃ n.' }, { status: 409 });
    }

    const reservation = await updateReservationStatus({ id: numericId, status, phone: staff ? undefined : phone, expectedStatus: currentStatus });
    if (!reservation) return NextResponse.json({ message: 'Äáº·t bÃ n Ä‘Ã£ Ä‘Æ°á»£c cáº­p nháº­t bá»Ÿi yÃªu cáº§u khÃ¡c hoáº·c thÃ´ng tin xÃ¡c minh khÃ´ng khá»›p.' }, { status: 409 });
    return NextResponse.json({ ok: true, reservation });
  } catch (error) {
    console.error(`PATCH /api/reservations/${id} failed`, error);
    return NextResponse.json({ message: 'KhÃ´ng thá»ƒ cáº­p nháº­t tráº¡ng thÃ¡i Ä‘áº·t bÃ n.' }, { status: 500 });
  }
}
