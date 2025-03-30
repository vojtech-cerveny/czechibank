import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Log request details for debugging
  console.log("=== Request Debug ===");
  console.log("Request URL:", request.url);
  console.log("Request Method:", request.method);
  console.log("Origin:", request.headers.get("origin"));
  console.log("Authorization:", request.headers.get("authorization"));
  console.log("All Headers:", Object.fromEntries(request.headers.entries()));
  console.log("=== End Request Debug ===");

  // Handle preflight requests
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-API-Key",
        "Access-Control-Max-Age": "86400", // 24 hours
      },
    });
  }

  // Add CORS headers to all responses
  const response = NextResponse.next();
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-API-Key");

  return response;
}

// Configure which paths the middleware should run on
export const config = {
  matcher: ["/api/:path*", "/api/v1/:path*"],
};
