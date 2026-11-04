import { NextResponse } from 'next/server';

import { hasAdminSession } from '../../../../src/server/adminAuth.js';

export async function GET(request) {
  if (!hasAdminSession(request)) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true });
}
