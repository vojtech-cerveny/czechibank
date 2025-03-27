import { NextResponse } from "next/server";

export function corsResponse(response: Response | NextResponse) {
  if (response instanceof NextResponse) {
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
    response.headers.set("Access-Control-Allow-Headers", "*");
    response.headers.set("Access-Control-Max-Age", "86400");
    return response;
  } else {
    const newResponse = new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
    newResponse.headers.set("Access-Control-Allow-Origin", "*");
    newResponse.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
    newResponse.headers.set("Access-Control-Allow-Headers", "*");
    newResponse.headers.set("Access-Control-Max-Age", "86400");
    return newResponse;
  }
}

export function corsOptionsResponse() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Max-Age": "86400",
    },
  });
}
