import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Log request details for debugging
  console.log("=== CORS Debug ===");
  console.log("Request URL:", request.url);
  console.log("Request Method:", request.method);
  console.log("Origin:", request.headers.get("origin"));
  console.log("Authorization:", request.headers.get("authorization"));
  console.log("All Headers:", Object.fromEntries(request.headers.entries()));

  // Get the response
  const response = NextResponse.next();

  // Get the origin from the request
  const origin = request.headers.get("origin");

  // Set CORS headers for all requests
  if (origin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept");
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Max-Age", "86400"); // 24 hours

  // Log response headers for debugging
  console.log("Response Headers:", Object.fromEntries(response.headers.entries()));
  console.log("=== End CORS Debug ===");

  // Handle preflight requests
  if (request.method === "OPTIONS") {
    console.log("Handling OPTIONS request");
    return new NextResponse(null, {
      status: 204,
      headers: response.headers,
    });
  }

  return response;
}

// Configure which paths the middleware should run on
export const config = {
  matcher: ["/api/:path*", "/api/v1/:path*"],
};
