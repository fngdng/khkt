import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createReservation,
  findAvailableTable,
  hasReservationConflict,
  parseTimeToMinutes,
  validateReservationRequest,
} from '../src/reservationService.js';

test('parseTimeToMinutes converts valid time strings', () => {
  assert.equal(parseTimeToMinutes('08:30'), 510);
  assert.ok(Number.isNaN(parseTimeToMinutes('8:30')));
});

test('validateReservationRequest reports invalid fields', () => {
  const issues = validateReservationRequest({
    customerName: 'A',
    phone: '123',
    partySize: 0,
    durationMinutes: 15,
    date: 'invalid-date',
    time: '99:99',
  });

  assert.equal(issues.length, 6);
});

test('hasReservationConflict detects overlapping reservations on the same date', () => {
  const existingReservation = {
    date: '2026-10-03',
    time: '18:00',
    durationMinutes: 90,
  };

  const candidateReservation = {
    date: '2026-10-03',
    time: '19:00',
    durationMinutes: 45,
  };

  assert.equal(hasReservationConflict(existingReservation, candidateReservation), true);
});

test('findAvailableTable picks the smallest fitting free table', () => {
  const tables = [
    { id: 'T1', capacity: 2 },
    { id: 'T2', capacity: 4 },
    { id: 'T3', capacity: 6 },
  ];

  const reservations = [
    { tableId: 'T2', date: '2026-10-03', time: '18:00', durationMinutes: 90 },
  ];

  const table = findAvailableTable(tables, reservations, {
    date: '2026-10-03',
    time: '18:30',
    durationMinutes: 60,
    partySize: 4,
  });

  assert.equal(table.id, 'T3');
});

test('createReservation returns a confirmed booking when a table is available', () => {
  const result = createReservation({
    tables: [
      { id: 'T1', capacity: 2 },
      { id: 'T2', capacity: 4 },
    ],
    existingReservations: [],
    request: {
      customerName: 'Nguyen Van A',
      phone: '0912345678',
      date: '2026-10-03',
      time: '18:00',
      durationMinutes: 90,
      partySize: 4,
    },
  });

  assert.equal(result.ok, true);
  assert.equal(result.reservation.tableId, 'T2');
  assert.equal(result.reservation.status, 'confirmed');
});