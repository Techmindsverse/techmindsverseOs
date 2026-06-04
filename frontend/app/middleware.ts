import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_ROUTES = ['/dashboard', '/admin'];
const ADMIN_ONLY = ['/admin'];
const AUTH_PAGES = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read and decode cookie value safely
  const rawToken = request.cookies.get('tmv_token')?.value;
  const rawRole = request.cookies.get('tmv_role')?.value;

  // Decode URI-encoded values set by auth store
  let token: string | undefined;
  let role: string | undefined;
  try {
    token = rawToken ? decodeURIComponent(rawToken) : undefined;
    role = rawRole ? decodeURIComponent(rawRole) : undefined;
  } catch {
    token = rawToken;
    role = rawRole;
  }

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  const isAdminOnly = ADMIN_ONLY.some((r) => pathname.startsWith(r));
  const isAuthPage = AUTH_PAGES.some((r) => pathname.startsWith(r));

  // No token — redirect to login with return URL
  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Non-admin trying to access admin routes
  if (isAdminOnly && role !== 'admin' && role !== 'super_admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Logged in user trying to access auth pages — redirect to correct home
  if (isAuthPage && token) {
    const dest =
      role === 'admin' || role === 'super_admin' ? '/admin' : '/dashboard';
    return NextResponse.redirect(new URL(dest, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|icons|images|og-image.png|sitemap.xml|robots.txt|_next/webpack-hmr).*)',
  ],
};