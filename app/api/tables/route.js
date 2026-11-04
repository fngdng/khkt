import { NextResponse } from 'next/server';

import { getTables } from '../../../src/server/reservationRepository.js';

export async function GET() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 2600));
    const tables = await getTables();
    return NextResponse.json({ tables });
  } catch (error) {
    console.error('Unable to load tables.', error);
    return NextResponse.json(
      { message: 'Không thể tải danh sách bàn.' },
      { status: 500 }
    );
  }
}
