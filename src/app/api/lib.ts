import { ErrorResponse, SuccessResponse } from "@/lib/response";

export function isError(response: ErrorResponse | SuccessResponse<any>): response is ErrorResponse {
  return (response as ErrorResponse).success === false;
}
