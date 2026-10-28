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
    return ['Yêu cầu đặt bàn phải là một đối tượng hợp lệ.'];
  }

  if (typeof request.customerName !== 'string' || request.customerName.trim().length < 2) {
    issues.push('Tên khách hàng phải có ít nhất 2 ký tự.');
  }

  if (typeof request.phone !== 'string' || !/^0\d{9}$/.test(request.phone)) {
    issues.push('Số điện thoại phải là số di động Việt Nam gồm 10 chữ số.');
  }

  if (typeof request.partySize !== 'number' || !Number.isInteger(request.partySize) || request.partySize < 1) {
    issues.push('Số lượng khách phải là số nguyên dương.');
  }

  if (typeof request.durationMinutes !== 'number' || !Number.isInteger(request.durationMinutes) || request.durationMinutes < 30) {
    issues.push('Thời lượng đặt bàn phải là số nguyên từ 30 phút trở lên.');
  }

  if (typeof request.date !== 'string' || Number.isNaN(Date.parse(request.date))) {
    issues.push('Ngày đặt bàn phải theo định dạng ngày hợp lệ (ISO).');
  }

  const time = parseTimeToMinutes(request.time);
  if (Number.isNaN(time)) {
    issues.push('Giờ đặt bàn phải theo định dạng HH:MM.');
  }

  return issues;
}

export function hasReservationConflict(existingReservation, candidateReservation) {
  const existingStart = parseTimeToMinutes(existingReservation.time);
  const candidateStart = parseTimeToMinutes(candidateReservation.time);
  const existingBase = Date.parse(`${existingReservation.date}T00:00:00Z`) / 60000;
  const candidateBase = Date.parse(`${candidateReservation.date}T00:00:00Z`) / 60000;
  const existingAbsoluteStart = existingBase + existingStart;
  const candidateAbsoluteStart = candidateBase + candidateStart;
  const existingEnd = existingAbsoluteStart + existingReservation.durationMinutes;
  const candidateEnd = candidateAbsoluteStart + candidateReservation.durationMinutes;

  return candidateAbsoluteStart < existingEnd && existingAbsoluteStart < candidateEnd;
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

  let table;
  if (request.tableId) {
    table = tables.find((candidate) => candidate.id === request.tableId);
    if (!table) {
      return { ok: false, errors: ['Bàn bạn chọn không tồn tại. Vui lòng tải lại danh sách bàn.'] };
    }
    if (table.capacity < request.partySize) {
      return { ok: false, errors: [`Bàn ${table.id} chỉ có ${table.capacity} chỗ, không đủ cho ${request.partySize} khách.`] };
    }
    const hasConflict = existingReservations
      .filter((reservation) => reservation.tableId === table.id)
      .some((reservation) => hasReservationConflict(reservation, request));
    if (hasConflict) {
      return { ok: false, errors: [`Bàn ${table.id} đã được đặt trong khung giờ này. Vui lòng chọn bàn khác hoặc giờ khác.`] };
    }
  } else {
    table = findAvailableTable(tables, existingReservations, request);
  }

  if (!table) {
    return {
      ok: false,
      errors: ['Không có bàn phù hợp cho khung giờ bạn yêu cầu.'],
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
