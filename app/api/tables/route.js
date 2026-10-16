import { NextResponse } from 'next/server';

import { getTables } from '../../../src/server/reservationRepository.js';

export async function GET() {
  try {
    const tables = await getTables();
    return NextResponse.json({ tables });
  } catch (error) {
    return NextResponse.json(
      { message: 'Không thể tải danh sách bàn.', details: error.message },
      { status: 500 }
    );
  }
}
