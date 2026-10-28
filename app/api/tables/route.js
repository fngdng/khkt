import { NextResponse } from 'next/server';

import { getTables } from '../../../src/server/reservationRepository.js';

export async function GET() {
  try {
    const tables = await getTables();
    return NextResponse.json({ tables });
  } catch (error) {
    console.error('GET /api/tables failed', error);
    return NextResponse.json({ message: 'Unable to load tables.' }, { status: 500 });
  }
}
