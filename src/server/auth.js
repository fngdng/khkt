import { createHmac, timingSafeEqual } from 'node:crypto';

export const STAFF_COOKIE = 'staff_session';
const SESSION_SECONDS = 8 * 60 * 60;

function configuredPassword() {
  return process.env.ADMIN_PASSWORD;
}

export function verifyAdminPassword(password) {
  const expected = configuredPassword();
  return Boolean(expected && typeof password === 'string' && password === expected);
}

function signature(expiresAt) {
  return createHmac('sha256', configuredPassword() || 'missing-admin-password')
    .update(String(expiresAt))
    .digest('base64url');
}

export function createStaffSession() {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  return { value: `${expiresAt}.${signature(expiresAt)}`, maxAge: SESSION_SECONDS };
}

export function hasStaffSession(request) {
  const value = request.cookies?.get(STAFF_COOKIE)?.value;
  const [expiresAt, suppliedSignature, extra] = value?.split('.') || [];
  if (!expiresAt || !suppliedSignature || extra || Number(expiresAt) <= Math.floor(Date.now() / 1000)) return false;
  const expected = signature(expiresAt);
  const suppliedBuffer = Buffer.from(suppliedSignature);
  const expectedBuffer = Buffer.from(expected);
  return suppliedBuffer.length === expectedBuffer.length && timingSafeEqual(suppliedBuffer, expectedBuffer);
}
