import { errorResponse } from "@/lib/response";
import { ApiError } from "./api-error";

export { ApiError };

export async function handleErrors(error: ApiError) {
  return Response.json(errorResponse(error.message, error.code, error.details), { status: error.statusCode });
}

export const DELETE = "DELETE";
export const HEAD = "HEAD";
export const OPTIONS = "OPTIONS";
export const PATCH = "PATCH";
export const POST = "POST";
export const PUT = "PUT";
