import { NextResponse } from 'next/server';

import { getReservations, getTables } from '../../../src/server/reservationRepository.js';
import { hasReservationConflict } from '../../../src/reservationService.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const time = searchParams.get('time');
    const durationMinutes = Number(searchParams.get('durationMinutes'));
    const hasSlot = date && time && Number.isInteger(durationMinutes) && durationMinutes >= 30;
    const tables = await getTables();

    if (!hasSlot) return NextResponse.json({ tables });

    const reservations = await getReservations();
    const activeReservations = reservations.filter(
      (reservation) => reservation.status !== 'cancelled',
    );
    const availableTables = tables.filter((table) =>
      !activeReservations.some(
        (reservation) =>
          reservation.tableId === table.id &&
          hasReservationConflict(reservation, { date, time, durationMinutes }),
      ),
    );
    return NextResponse.json({ tables: availableTables });
  } catch (error) {
    return NextResponse.json(
      { message: 'Không thể tải danh sách bàn.', details: error.message },
      { status: 500 }
    );
  }
}
