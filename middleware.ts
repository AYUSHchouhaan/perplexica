import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  // Only validate session for API routes
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Skip auth routes (they handle their own validation)
  if (request.nextUrl.pathname.startsWith('/api/auth/')) {
    return NextResponse.next();
  }

  try {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET 
    });

    if (token?.id) {
      // Clone request and add headers
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', token.id as string);
      requestHeaders.set('x-user-email', token.email as string);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    return NextResponse.next();
  } catch (error) {
    console.error('[Middleware] Session validation error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: '/api/:path*',
};
