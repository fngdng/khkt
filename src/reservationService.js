export function parseTimeToMinutes(time) {
  if (typeof time !== 'string') {
    return NaN;
  }

  const match = time.match(/^(\d{2}):(\d{2})$/);
  if (!match) {
    return NaN;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return NaN;
  }

  return hours * 60 + minutes;
}

export function validateReservationRequest(request) {
  const issues = [];

  if (!request || typeof request !== 'object') {
    return ['Reservation request must be an object.'];
  }

  if (typeof request.customerName !== 'string' || request.customerName.trim().length < 2) {
    issues.push('customerName must contain at least 2 characters.');
  }

  if (typeof request.phone !== 'string' || !/^0\d{9}$/.test(request.phone)) {
    issues.push('phone must be a valid 10-digit Vietnamese mobile number.');
  }

  if (typeof request.partySize !== 'number' || !Number.isInteger(request.partySize) || request.partySize < 1) {
    issues.push('partySize must be a positive integer.');
  }

  if (typeof request.durationMinutes !== 'number' || !Number.isInteger(request.durationMinutes) || request.durationMinutes < 30) {
    issues.push('durationMinutes must be an integer of at least 30.');
  }

  if (typeof request.date !== 'string' || Number.isNaN(Date.parse(request.date))) {
    issues.push('date must be an ISO date string.');
  }

  const time = parseTimeToMinutes(request.time);
  if (Number.isNaN(time)) {
    issues.push('time must be in HH:MM format.');
  }

  return issues;
}

export function hasReservationConflict(existingReservation, candidateReservation) {
  if (existingReservation.date !== candidateReservation.date) {
    return false;
  }

  const existingStart = parseTimeToMinutes(existingReservation.time);
  const candidateStart = parseTimeToMinutes(candidateReservation.time);
  const existingEnd = existingStart + existingReservation.durationMinutes;
  const candidateEnd = candidateStart + candidateReservation.durationMinutes;

  return candidateStart < existingEnd && existingStart < candidateEnd;
}

export function findAvailableTable(tables, existingReservations, request) {
  const sortedTables = [...tables].sort((left, right) => left.capacity - right.capacity);

  for (const table of sortedTables) {
    if (table.capacity < request.partySize) {
      continue;
    }

    const tableReservations = existingReservations.filter((reservation) => reservation.tableId === table.id);
    const hasConflict = tableReservations.some((reservation) => hasReservationConflict(reservation, request));

    if (!hasConflict) {
      return table;
    }
  }

  return null;
}

export function createReservation({ tables, existingReservations = [], request }) {
  const issues = validateReservationRequest(request);
  if (issues.length > 0) {
    return {
      ok: false,
      errors: issues,
    };
  }

  const table = findAvailableTable(tables, existingReservations, request);
  if (!table) {
    return {
      ok: false,
      errors: ['No suitable table is available for the requested time slot.'],
    };
  }

  return {
    ok: true,
    reservation: {
      id: `res-${existingReservations.length + 1}`,
      customerName: request.customerName.trim(),
      phone: request.phone,
      date: request.date,
      time: request.time,
      durationMinutes: request.durationMinutes,
      partySize: request.partySize,
      tableId: table.id,
      status: 'confirmed',
    },
  };
}