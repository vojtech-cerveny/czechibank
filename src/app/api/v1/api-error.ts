import { ApiErrorCode, ErrorDetail } from "@/lib/response";

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: ApiErrorCode,
    public details?: ErrorDetail[],
  ) {
    super(message);
    this.name = "ApiError";
  }
}
