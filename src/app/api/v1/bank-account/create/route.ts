import { createBankAccount } from "@/domain/bankAccount-domain/ba-repository";
import { ApiErrorCode, successResponse } from "@/lib/response";
import { ApiError, checkUserAuthOrThrowError, handleErrors } from "../../routes";

/**
 * @swagger
 * /bank-account/create:
 *   post:
 *     summary: Create a new bank account
 *     description: Creates a new bank account for the authenticated user
 *     tags: [Bank Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BankAccountCreate'
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Bank account successfully created
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
 *                         bankAccount:
 *                           $ref: '#/components/schemas/BankAccount'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(request: Request) {
  try {
    const user = await checkUserAuthOrThrowError(request);

    const body = await request.json();
    const { currency } = body;

    if (!currency) {
      throw new ApiError("Missing required fields", 400, ApiErrorCode.VALIDATION_ERROR, [
        {
          code: ApiErrorCode.VALIDATION_ERROR,
          message: "Currency is required",
        },
      ]);
    }

    const result = await createBankAccount({
      userId: user.id,
      currency,
    });

    return Response.json(successResponse("Bank account created successfully", { bankAccount: result }), {
      status: 201,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return handleErrors(error);
    } else {
      throw new ApiError("Internal Server Error", 500, ApiErrorCode.INTERNAL_ERROR, [
        { code: ApiErrorCode.INTERNAL_ERROR, message: error instanceof Error ? error.message : "Unknown error" },
      ]);
    }
  }
}
