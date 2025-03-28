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

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: ["/api/:path*", "/api/v1/:path*"],
};
