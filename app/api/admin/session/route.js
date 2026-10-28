import { NextResponse } from 'next/server';

import { createStaffSession, hasStaffSession, STAFF_COOKIE, verifyAdminPassword } from '../../../../src/server/auth.js';

export async function GET(request) {
  return NextResponse.json({ authenticated: hasStaffSession(request) }, { status: hasStaffSession(request) ? 200 : 401 });
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'YÃªu cáº§u khÃ´ng há»£p lá»‡.' }, { status: 400 });
  }

  if (!verifyAdminPassword(body?.password)) {
    return NextResponse.json({ message: 'Máº­t kháº©u nhÃ¢n viÃªn khÃ´ng Ä‘Ãºng.' }, { status: 401 });
  }

  const session = createStaffSession();
  const response = NextResponse.json({ authenticated: true });
  response.cookies.set(STAFF_COOKIE, session.value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: session.maxAge,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set(STAFF_COOKIE, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 0 });
  return response;
}
