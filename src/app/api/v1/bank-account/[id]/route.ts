import { deleteBankAccount, getBankAccountByIdAndUserId } from "@/domain/bankAccount-domain/ba-repository";
import { ApiErrorCode, successResponse } from "@/lib/response";
import { ApiError, checkUserAuthOrThrowError, handleErrors } from "../../routes";

/**
 * @swagger
 * /bank-account/{id}:
 *   get:
 *     summary: Get bank account details
 *     description: Retrieve details of a specific bank account
 *     tags: [Bank Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bank account ID
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Bank account details retrieved successfully
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
 *       404:
 *         description: Bank account not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Delete bank account
 *     description: Delete a bank account (only possible if balance is 0)
 *     tags: [Bank Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bank account ID
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Bank account deleted successfully
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
 *                         message:
 *                           type: string
 *                           example: "Bank account deleted successfully"
 *       400:
 *         description: Cannot delete account with non-zero balance
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

export async function GET(request: Request, context: { params: { id: string } }) {
  try {
    const user = await checkUserAuthOrThrowError(request);
    const bankAccountResponse = await getBankAccountByIdAndUserId(context.params.id, user.id);

    if (!bankAccountResponse.success) {
      throw new ApiError(bankAccountResponse.message, 404, ApiErrorCode.NOT_FOUND, [
        {
          code: ApiErrorCode.NOT_FOUND,
          message: bankAccountResponse.message,
        },
      ]);
    }

    return Response.json(
      successResponse("Bank account retrieved successfully", { bankAccount: bankAccountResponse.data }),
      { status: 200 },
    );
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

export async function DELETE(request: Request, context: { params: { id: string } }) {
  try {
    const user = await checkUserAuthOrThrowError(request);

    // First verify the user owns this account
    const bankAccount = await getBankAccountByIdAndUserId(context.params.id, user.id);
    if (!bankAccount) {
      throw new ApiError("Bank account not found", 404, ApiErrorCode.NOT_FOUND, [
        {
          code: ApiErrorCode.NOT_FOUND,
          message: "Bank account not found",
        },
      ]);
    }

    const result = await deleteBankAccount(context.params.id);

    if (!result) {
      throw new ApiError("Failed to delete bank account", 400, ApiErrorCode.OPERATION_FAILED, [
        {
          code: ApiErrorCode.OPERATION_FAILED,
          message: "Failed to delete bank account",
        },
      ]);
    }

    return Response.json(
      successResponse("Bank account deleted successfully", { message: "Bank account deleted successfully" }),
      { status: 200 },
    );
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
