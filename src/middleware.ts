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

  // Handle preflight requests
  if (request.method === "OPTIONS") {
    console.log("Handling OPTIONS request");
    const response = new NextResponse(null, {
      status: 204,
    });

    // Set CORS headers for preflight
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
    response.headers.set("Access-Control-Allow-Headers", "*");
    response.headers.set("Access-Control-Max-Age", "86400");

    console.log("Preflight Response Headers:", Object.fromEntries(response.headers.entries()));
    console.log("=== End CORS Debug ===");
    return response;
  }

  // Get the response for non-OPTIONS requests
  const response = NextResponse.next();

  // Set CORS headers for all requests
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
  response.headers.set("Access-Control-Allow-Headers", "*");
  response.headers.set("Access-Control-Max-Age", "86400");

  console.log("Response Headers:", Object.fromEntries(response.headers.entries()));
  console.log("=== End CORS Debug ===");

  return response;
}

// Configure which paths the middleware should run on
export const config = {
  matcher: ["/api/:path*", "/api/v1/:path*"],
};
