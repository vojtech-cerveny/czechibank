import { checkUserAuthOrThrowError } from "@/app/api/v1/server-actions";
import transactionService from "@/domain/transaction-domain/transaction-service";
import { ApiErrorCode } from "@/lib/response";
import { ApiError, DELETE, HEAD, OPTIONS, PATCH, POST, PUT, handleErrors } from "../../routes";

/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Get transaction details
 *     description: Retrieves details of a specific transaction
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Transaction details successfully retrieved
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
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Transaction not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(request: Request, context: { params: { id: string } }) {
  try {
    const user = await checkUserAuthOrThrowError(request);
    if ("error" in user) {
      return Response.json(user, { status: 401 });
    }

    const transaction = await transactionService.getTransactionDetailByTransactionId(context.params.id, user.id);

    return Response.json(transaction);
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

export { DELETE, HEAD, OPTIONS, PATCH, POST, PUT };
