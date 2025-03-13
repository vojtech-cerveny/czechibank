import { getUserByApiKey } from "@/domain/user-domain/user-repository";
import { ApiErrorCode, ErrorDetail, errorResponse } from "@/lib/response";
import { User } from "@prisma/client";
import { headers } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export class ApiError extends Error {
  status: number;
  code: ApiErrorCode;
  details?: ErrorDetail[];
  message: string;

  constructor(message: string, status: number, code: ApiErrorCode, details?: ErrorDetail[]) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
    this.message = message;
  }
}

// Helper to generate request metadata
function getRequestMeta() {
  const headersList = headers();
  return {
    timestamp: new Date().toISOString(),
    requestId: headersList.get("x-request-id") || uuidv4(),
  };
}

export async function HEAD(request: Request) {
  return Response.json(errorResponse("Method Not Allowed", ApiErrorCode.BAD_REQUEST, undefined, getRequestMeta()), {
    status: 405,
  });
}

export async function POST(request: Request) {
  return Response.json(errorResponse("Method Not Allowed", ApiErrorCode.BAD_REQUEST, undefined, getRequestMeta()), {
    status: 405,
  });
}

export async function PUT(request: Request) {
  return Response.json(errorResponse("Method Not Allowed", ApiErrorCode.BAD_REQUEST, undefined, getRequestMeta()), {
    status: 405,
  });
}

export async function DELETE(request: Request) {
  return Response.json(errorResponse("Method Not Allowed", ApiErrorCode.BAD_REQUEST, undefined, getRequestMeta()), {
    status: 405,
  });
}

export async function PATCH(request: Request) {
  return Response.json(errorResponse("Method Not Allowed", ApiErrorCode.BAD_REQUEST, undefined, getRequestMeta()), {
    status: 405,
  });
}

export async function OPTIONS(request: Request) {
  return Response.json(errorResponse("Method Not Allowed", ApiErrorCode.BAD_REQUEST, undefined, getRequestMeta()), {
    status: 405,
  });
}

export async function GET(request: Request) {
  return Response.json(errorResponse("Method Not Allowed", ApiErrorCode.BAD_REQUEST, undefined, getRequestMeta()), {
    status: 405,
  });
}

export async function handleErrors(err: ApiError) {
  const meta = getRequestMeta();

  if (err.status === 9400) {
    return Response.json(
      errorResponse(
        "Bad Request. Did you provide apiKey in the right format?",
        ApiErrorCode.BAD_REQUEST,
        undefined,
        meta,
      ),
      { status: 400 },
    );
  }

  if (err.status === 400) {
    return Response.json(
      errorResponse(
        "Bad Request. Did you provide all required fields?",
        ApiErrorCode.VALIDATION_ERROR,
        err.details,
        meta,
      ),
      { status: 400 },
    );
  }

  if (err.status === 401) {
    return Response.json(errorResponse("Unauthorized", ApiErrorCode.UNAUTHORIZED, undefined, meta), { status: 401 });
  }

  if (err.status === 404) {
    return Response.json(errorResponse("Not Found", ApiErrorCode.NOT_FOUND, undefined, meta), { status: 404 });
  }

  return Response.json(
    errorResponse(
      "Internal Server Error",
      ApiErrorCode.INTERNAL_ERROR,
      [{ code: ApiErrorCode.INTERNAL_ERROR, message: err.message }],
      meta,
    ),
    { status: 500 },
  );
}

/**
 * Check if the user is authenticated
 * @param request - The request object
 * @returns The user object
 * @throws {ApiError} With code BAD_REQUEST if no API key is provided
 * @throws {ApiError} With code UNAUTHORIZED if the API key is invalid
 */
export async function checkUserAuthOrThrowError(request: Request): Promise<User> {
  const apiKey = request.headers.get("Authorization")?.split("Bearer ")[1];
  if (!apiKey) {
    throw new ApiError("No Bearer token provided", 400, ApiErrorCode.BAD_REQUEST, [
      {
        code: ApiErrorCode.BAD_REQUEST,
        message: "Authorization header with Bearer token is required",
      },
    ]);
  }

  const user = await getUserByApiKey(apiKey);

  if (!user) {
    throw new ApiError("Invalid Bearer token", 401, ApiErrorCode.UNAUTHORIZED, [
      {
        code: ApiErrorCode.UNAUTHORIZED,
        message: "The provided Bearer token is invalid or expired",
      },
    ]);
  }

  return user;
}
