import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('tmv_token')?.value;
  const { pathname } = request.nextUrl;

  const protectedRoutes = ['/dashboard', '/admin'];
  const adminRoutes = ['/admin'];

  const isProtected = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  const isAdminRoute = adminRoutes.some(route =>
    pathname.startsWith(route)
  );

  // 🔐 BLOCK UNAUTHENTICATED USERS
  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 🔐 ADMIN GATE (TEMP BASIC VERSION)
  if (isAdminRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};