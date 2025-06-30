import transactionService from "@/domain/transaction-domain/transaction-service";
import { ApiErrorCode, errorResponse } from "@/lib/response";
import { NextRequest, NextResponse } from "next/server";
import { DELETE, HEAD, OPTIONS, PATCH, POST, PUT } from "../../routes";
import { checkUserAuthOrThrowError } from "../../server-actions";

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
 *       - ApiKeyAuth: []
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
 *         description: Unauthorized - API key is missing or invalid
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
export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const user = await checkUserAuthOrThrowError(request);
    if ("error" in user) {
      return NextResponse.json(errorResponse(user.error.message, user.error.code), { status: 401 });
    }

    const result = await transactionService.getTransactionDetailByTransactionId(params.id, user.id);

    if ("error" in result) {
      const error = result.error as { code: ApiErrorCode; message: string };
      if (error.code === "NOT_FOUND") {
        return NextResponse.json(errorResponse("Transaction not found", "404"), { status: 404 });
      }
      return NextResponse.json(errorResponse(error.message, "500"), { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        transaction: result.data,
      },
    });
  } catch (error) {
    console.error("Error in GET /api/v1/transactions/[id]:", error);
    return NextResponse.json(errorResponse("Internal server error", "500"), { status: 500 });
  }
}

export { DELETE, HEAD, OPTIONS, PATCH, POST, PUT };
