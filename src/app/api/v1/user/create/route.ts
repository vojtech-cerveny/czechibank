export { DELETE, GET, HEAD, OPTIONS, PATCH, PUT } from "../../routes";

import { isEmailUnique, registerUserAPI } from "@/domain/user-domain/user-repository";
import { UserSchema } from "@/domain/user-domain/user-schema";
import { ApiErrorCode, errorResponse } from "@/lib/response";
import { ApiError, handleErrors } from "../../routes";

/**
 * @swagger
 * /user/create:
 *   post:
 *     summary: Create a new user
 *     description: Creates a new user account with the provided details
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreate'
 *     responses:
 *       201:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         user:
 *                           $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input or email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedUser = UserSchema.safeParse(body);

    if (!parsedUser.success) {
      return Response.json(errorResponse("Invalid user data", ApiErrorCode.VALIDATION_ERROR));
    }

    const user = parsedUser.data;

    if (!(await isEmailUnique(user.email))) {
      return Response.json(errorResponse("Email already exists", ApiErrorCode.VALIDATION_ERROR));
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
