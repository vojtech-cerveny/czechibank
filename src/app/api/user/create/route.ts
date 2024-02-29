export { DELETE, GET, HEAD, OPTIONS, PATCH, PUT } from "../../routes";

import { isEmailUnique, registerUser } from "@/domain/user-domain/user-repository";
import { UserSchema } from "@/domain/user-domain/user-schema";
import { errorResponse } from "@/lib/response";
import { handleErrors } from "../../routes";

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

    const response = await registerUser(user);
    return Response.json(response, { status: response.success ? 201 : 400 });
  } catch (error) {
    handleErrors(error as Error);
  }
  return Response.json({ error: "Internal Server Error" }, { status: 500 });
}
