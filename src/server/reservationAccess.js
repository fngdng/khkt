import { createHash, randomBytes } from 'node:crypto';

export function createReservationAccessToken() {
  const token = randomBytes(32).toString('base64url');
  return { token, tokenHash: hashReservationAccessToken(token) };
}

export function hashReservationAccessToken(token) {
  if (typeof token !== 'string' || token.length < 32 || token.length > 128) return null;
  return createHash('sha256').update(token).digest('hex');
}

export function normalizePhoneLookup(phone) {
  if (typeof phone !== 'string') return null;
  const normalized = phone.replace(/[\s().-]/g, '');
  return /^0\d{9}$/.test(normalized) ? normalized : null;
}
