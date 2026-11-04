import { NextResponse } from 'next/server';

import { hasAdminSession } from '../../../../src/server/adminAuth.js';
import { hashReservationAccessToken } from '../../../../src/server/reservationAccess.js';
import { updateReservationStatus } from '../../../../src/server/reservationRepository.js';

const ALLOWED_TARGET_STATUS = new Set(['confirmed', 'arrived', 'cancelled']);

export async function PATCH(request, { params }) {
  const { id } = await params;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Yêu cầu JSON không hợp lệ.' }, { status: 400 });
  }
  if (!body || typeof body !== 'object' || Array.isArray(body) || !ALLOWED_TARGET_STATUS.has(body.status)) {
    return NextResponse.json({ message: 'Trạng thái không hợp lệ.' }, { status: 400 });
  }

  const isAdmin = hasAdminSession(request);
  if (!isAdmin && body.status !== 'cancelled') {
    return NextResponse.json({ message: 'Cần đăng nhập nhân viên.' }, { status: 401 });
  }

  try {
    const result = await updateReservationStatus({
      id: Number(id),
      status: body.status,
      accessTokenHash: isAdmin ? null : hashReservationAccessToken(body.accessToken),
      isAdmin,
    });
    if (result.kind === 'not_found' || (result.kind === 'forbidden' && !isAdmin)) {
      return NextResponse.json({ message: 'Không tìm thấy lượt đặt phù hợp.' }, { status: 404 });
    }
    if (result.kind === 'forbidden') {
      return NextResponse.json({ message: 'Không có quyền cập nhật lượt đặt.' }, { status: 403 });
    }
    if (result.kind === 'invalid_transition') {
      return NextResponse.json({ message: 'Không thể chuyển lượt đặt sang trạng thái này.' }, { status: 409 });
    }
    return NextResponse.json({ ok: true, reservation: result.reservation });
  } catch (error) {
    console.error('Unable to update reservation status.', error);
    return NextResponse.json({ message: 'Không thể cập nhật trạng thái đặt bàn.' }, { status: 500 });
  }
}
