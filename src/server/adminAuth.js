import { createHmac, timingSafeEqual } from 'node:crypto';

export const ADMIN_COOKIE = 'restaurant_admin_session';
const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;

function secret() {
  return process.env.ADMIN_SESSION_SECRET || '';
}

function sign(value) {
  return createHmac('sha256', secret()).update(value).digest('base64url');
}

export function passwordsMatch(provided, expected) {
  if (typeof provided !== 'string' || !expected) return false;
  const providedBytes = Buffer.from(provided);
  const expectedBytes = Buffer.from(expected);
  return providedBytes.length === expectedBytes.length && timingSafeEqual(providedBytes, expectedBytes);
}

export function isAdminAuthConfigured() {
  return (process.env.ADMIN_PASSWORD?.length || 0) >= 12 && secret().length >= 32;
}

export function createAdminSession() {
  const payload = Buffer.from(
    JSON.stringify({ exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS }),
  ).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function hasAdminSession(request) {
  if (!secret()) return false;
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!token) return false;

  const [payload, signature, extra] = token.split('.');
  if (!payload || !signature || extra) return false;

  const expected = Buffer.from(sign(payload));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return false;

  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return Number.isInteger(session.exp) && session.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}
