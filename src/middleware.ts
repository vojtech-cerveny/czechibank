import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  console.log("Middleware called for:", request.url);
  console.log("Request method:", request.method);
  console.log("Request headers:", Object.fromEntries(request.headers.entries()));

  // Get the response
  const response = NextResponse.next();

  // Add CORS headers
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept");
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Max-Age", "86400"); // 24 hours

  // Handle preflight requests
  if (request.method === "OPTIONS") {
    console.log("Handling OPTIONS request");
    return new NextResponse(null, {
      status: 200, // Changed from 204 to 200
      headers: response.headers,
    });
  }

  console.log("Response headers:", Object.fromEntries(response.headers.entries()));
  return response;
}

export const config = {
  matcher: ["/api/:path*", "/api/v1/:path*"],
};
