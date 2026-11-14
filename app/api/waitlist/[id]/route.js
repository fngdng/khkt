import { NextResponse } from 'next/server';
import { updateWaitlistStatus } from '../../../../src/server/waitlistRepository.js';

const ALLOWED_STATUS = new Set(['waiting', 'notified', 'converted', 'cancelled']);

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const { status } = await request.json();
    if (!ALLOWED_STATUS.has(status)) {
      return NextResponse.json({ message: 'Trạng thái danh sách chờ không hợp lệ.' }, { status: 400 });
    }
    const entry = await updateWaitlistStatus({ id: Number(id), status });
    if (!entry) return NextResponse.json({ message: 'Không tìm thấy lượt trong danh sách chờ.' }, { status: 404 });
    return NextResponse.json({ ok: true, waitlist: entry });
  } catch (error) {
    return NextResponse.json({ message: 'Không thể cập nhật danh sách chờ.', details: error.message }, { status: 500 });
  }
}
