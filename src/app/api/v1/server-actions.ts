"use server";

import userService from "@/domain/user-domain/user.service";
import { ApiErrorCode, errorResponse, type ErrorResponse } from "@/lib/response";
import { User } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

export async function checkUserAuthOrThrowError(request: Request): Promise<User | ErrorResponse> {
  const headersList = request.headers;
  const bearerToken = headersList.get("Authorization");
  console.log(bearerToken);

  if (!bearerToken) {
    return errorResponse("Bearer token is required", ApiErrorCode.UNAUTHORIZED);
  }

  const token = bearerToken.split(" ")[1];

  const user = await userService.getUserByBearerToken(token);

  if ("error" in user) {
    return errorResponse("Invalid bearer token", ApiErrorCode.UNAUTHORIZED);
  }

  return user.data;
}

export async function generateRequestId(): Promise<string> {
  return Promise.resolve(uuidv4());
}
