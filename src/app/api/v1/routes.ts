import { errorResponse } from "@/lib/response";
import { ApiError } from "./api-error";

export { ApiError };

export async function handleErrors(error: ApiError) {
  return Response.json(errorResponse(error.message, error.code, error.details), { status: error.statusCode });
}

export async function DELETE(request: Request) {
  return new Response("Method Not Allowed", { status: 405 });
}

export async function HEAD(request: Request) {
  return new Response("Method Not Allowed", { status: 405 });
}

export async function OPTIONS(request: Request) {
  return new Response("Method Not Allowed", { status: 405 });
}

export async function PATCH(request: Request) {
  return new Response("Method Not Allowed", { status: 405 });
}

export async function POST(request: Request) {
  return new Response("Method Not Allowed", { status: 405 });
}

export async function PUT(request: Request) {
  return new Response("Method Not Allowed", { status: 405 });
}
