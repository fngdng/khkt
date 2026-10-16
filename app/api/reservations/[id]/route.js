import { NextResponse } from 'next/server';

import { updateReservationStatus } from '../../../../src/server/reservationRepository.js';

const ALLOWED_STATUS = new Set(['pending', 'confirmed', 'arrived', 'cancelled']);

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!ALLOWED_STATUS.has(status)) {
      return NextResponse.json(
        { message: 'Trạng thái không hợp lệ.' },
        { status: 400 }
      );
    }

    const reservation = await updateReservationStatus({
      id: Number(id),
      status,
    });

    if (!reservation) {
      return NextResponse.json(
        { message: 'Không tìm thấy đặt bàn cần cập nhật.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, reservation });
  } catch (error) {
    return NextResponse.json(
      { message: 'Không thể cập nhật trạng thái đặt bàn.', details: error.message },
      { status: 500 }
    );
  }
}
