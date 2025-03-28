import { checkUserAuthOrThrowError } from "@/app/api/v1/server-actions";
import transactionService from "@/domain/transaction-domain/transaction-service";
import { ApiErrorCode } from "@/lib/response";
import { ApiError, handleErrors } from "../../routes";
/**
 * @swagger
 * /transactions/create:
 *   post:
 *     summary: Create a new transaction
 *     description: Creates a new transaction between bank accounts
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransactionCreate'
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Transaction successfully created
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
 *                         transaction:
 *                           $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Invalid input or insufficient funds
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
 *       404:
 *         description: Bank account not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(request: Request) {
  try {
    const user = await checkUserAuthOrThrowError(request);

    const body = await request.json();
    console.log("body", body);
    const { amount, toBankNumber, fromBankNumber }: { amount: number; toBankNumber: string; fromBankNumber: string } =
      body;

    if (!amount || !toBankNumber) {
      throw new ApiError("Missing required fields", 400, ApiErrorCode.VALIDATION_ERROR, [
        {
          code: ApiErrorCode.VALIDATION_ERROR,
          message: "Amount and recipient bank account number are required",
        },
      ]);
    }

    if (!(amount > 0)) {
      throw new ApiError("Invalid amount", 400, ApiErrorCode.VALIDATION_ERROR, [
        {
          code: ApiErrorCode.VALIDATION_ERROR,
          field: "amount",
          message: "Amount must be greater than 0",
        },
      ]);
    }

    if ("error" in user) {
      throw new ApiError("User not found", 404, ApiErrorCode.NOT_FOUND, [
        {
          code: ApiErrorCode.NOT_FOUND,
          message: "User not found",
        },
      ]);
    }

    const result = await transactionService.sendMoneyToBankNumber({
      amount,
      fromBankNumber,
      toBankNumber,
      userId: user.id,
      currency: "CZECHITOKEN",
      applicationType: "api",
    });

    if (!result.success) {
      console.log(result);
      console.log(result.error.details);
      return Response.json(result, { status: result.error.code === ApiErrorCode.NOT_FOUND ? 404 : 400 });
    }

    return Response.json(result, { status: 201 });
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
