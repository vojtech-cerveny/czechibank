import { checkUserAuthOrThrowError } from "@/app/api/v1/server-actions";
import bankAccountService from "@/domain/bankAccount-domain/ba-service";
import { ApiErrorCode, successResponse, validateEventHandler } from "@/lib/response";
import { z } from "zod";
import { ApiError, handleErrors } from "../../routes";

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
 *       - ApiKeyAuth: []
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
 *       - ApiKeyAuth: []
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

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    console.log("GET /bank-account/[id]/route.ts");
    const schema = z.object({
      id: z.string().cuid(),
    });
    const parsedId = await validateEventHandler(schema, { id: (await context.params).id });
    if ("error" in parsedId) {
      return Response.json(parsedId, { status: 422 });
    }

    const user = await checkUserAuthOrThrowError(request);
    if ("error" in user) {
      return Response.json(user, { status: 401 });
    }
    const bankAccountResponse = await bankAccountService.getBankAccountById(parsedId.id, user.id);

    if ("error" in bankAccountResponse && bankAccountResponse.error.code === ApiErrorCode.NOT_FOUND) {
      return Response.json(bankAccountResponse, { status: 404 });
    }

    if ("error" in bankAccountResponse) {
      return Response.json(bankAccountResponse, { status: 500 });
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

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await checkUserAuthOrThrowError(request);
    if ("error" in user) {
      return Response.json(user, { status: 401 });
    }
    // First verify the user owns this account
    const bankAccountResponse = await bankAccountService.getBankAccountById((await context.params).id, user.id);
    if ("error" in bankAccountResponse) {
      return Response.json(bankAccountResponse, { status: 404 });
    }

    const bankAccount = bankAccountResponse.data;
    if (!bankAccount) {
      throw new ApiError("Bank account not found", 404, ApiErrorCode.NOT_FOUND, [
        {
          code: ApiErrorCode.NOT_FOUND,
          message: "Bank account not found",
        },
      ]);
    }

    const result = await bankAccountService.deleteBankAccount((await context.params).id);

    if ("error" in result) {
      return Response.json(result);
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
