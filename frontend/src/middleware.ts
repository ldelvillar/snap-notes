import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = process.env.AUTH_COOKIE_NAME || 'snapnotes_session';

export function middleware(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/notes/:path*', '/settings/:path*', '/upgrade/:path*', '/help'],
};
