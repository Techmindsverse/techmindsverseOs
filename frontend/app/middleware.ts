import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_ROUTES = ['/admin'];
const PROTECTED_ROUTES = ['/dashboard', '/admin', '/academy/dashboard'];
const PUBLIC_AUTH = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('tmv_token')?.value;
  const role = request.cookies.get('tmv_role')?.value;

  const isProtected = PROTECTED_ROUTES.some((r) =>
    pathname.startsWith(r),
  );
  const isAdminRoute = ADMIN_ROUTES.some((r) =>
    pathname.startsWith(r),
  );
  const isPublicAuth = PUBLIC_AUTH.some((r) =>
    pathname.startsWith(r),
  );

  // Not logged in — redirect to login
  if (isProtected && !token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Non-admin trying to access admin routes
  if (
    isAdminRoute &&
    role !== 'admin' &&
    role !== 'super_admin'
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Logged in user trying to access auth pages
  if (isPublicAuth && token) {
    const dest =
      role === 'admin' || role === 'super_admin'
        ? '/admin'
        : '/dashboard';
    return NextResponse.redirect(new URL(dest, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|icons|images|og-image.png|sitemap.xml|robots.txt).*)',
  ],
};