export { DELETE, GET, HEAD, OPTIONS, PATCH, PUT } from "../../routes";

import { isEmailUnique, registerUserAPI } from "@/domain/user-domain/user-repository";
import { UserSchema } from "@/domain/user-domain/user-schema";
import { errorResponse } from "@/lib/response";
import { ApiError, handleErrors } from "../../routes";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedUser = UserSchema.safeParse(body);

    if (!parsedUser.success) {
      return Response.json(errorResponse("Invalid user data", parsedUser.error));
    }

    const user = parsedUser.data;

    if (!(await isEmailUnique(user.email))) {
      return Response.json(errorResponse("Email already exists"));
    }

    const response = await registerUserAPI(user);
    return Response.json(response, { status: response.success ? 201 : 400 });
  } catch (error) {
    if (error instanceof ApiError) {
      return handleErrors(error);
    } else {
      return Response.json({ error: "Internal Server Error", message: error }, { status: 500 });
    }
  }
}
