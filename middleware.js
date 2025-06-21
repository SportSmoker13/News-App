// middleware.js
import { NextResponse } from "next/server";

export function middleware(request) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-middleware-start", Date.now().toString());

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Add logging for API requests
  if (request.nextUrl.pathname.startsWith("/api")) {
    const start = parseInt(requestHeaders.get("x-middleware-start"));
    const end = Date.now();
    const duration = end - start;
    
    console.log(`${request.method} ${request.nextUrl.pathname} - ${duration}ms`);
  }

  return response;
}

// Apply middleware to all API routes
export const config = {
  matcher: "/api/:path*",
};