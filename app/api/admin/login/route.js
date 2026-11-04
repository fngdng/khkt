import { NextResponse } from 'next/server';

import {
  ADMIN_COOKIE,
  adminCookieOptions,
  createAdminSession,
  isAdminAuthConfigured,
  passwordsMatch,
} from '../../../../src/server/adminAuth.js';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Yêu cầu JSON không hợp lệ.' }, { status: 400 });
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ message: 'Yêu cầu JSON không hợp lệ.' }, { status: 400 });
  }

  if (!isAdminAuthConfigured()) {
    return NextResponse.json(
      { message: 'Chưa cấu hình ADMIN_PASSWORD và ADMIN_SESSION_SECRET.' },
      { status: 503 },
    );
  }

  if (!passwordsMatch(body.password, process.env.ADMIN_PASSWORD)) {
    return NextResponse.json({ message: 'Mật khẩu nhân viên không đúng.' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, createAdminSession(), adminCookieOptions());
  return response;
}
