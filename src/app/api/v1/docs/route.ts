import { swaggerSpec } from "@/lib/swagger";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const headersList = await headers();
  const accept = headersList.get("accept") || "";

  // If accessed from a browser, redirect to the UI page
  if (accept.includes("text/html")) {
    return NextResponse.redirect(new URL("/api/v1/docs/page", request.url));
  }

  // Otherwise return the OpenAPI spec as JSON
  return NextResponse.json(swaggerSpec, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
