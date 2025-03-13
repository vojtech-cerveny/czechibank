import { getAllTransactionsByUserIdForAPI } from "@/domain/transaction-domain/transaction-repository";
import { ApiErrorCode, successResponse } from "@/lib/response";
import { ApiError, checkUserAuthOrThrowError, handleErrors } from "../routes";
export { DELETE, HEAD, OPTIONS, PATCH, PUT } from "../routes";

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get user's transactions
 *     description: Retrieves a paginated list of transactions for the authenticated user
 *     tags: [Transactions]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, amount]
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved transactions
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
 *                         transactions:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Invalid parameters
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
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const order = searchParams.get("sortOrder") || (sortBy === "createdAt" ? "desc" : "asc");

    if (page < 1 || limit < 1) {
      throw new ApiError("Invalid pagination parameters", 400, ApiErrorCode.VALIDATION_ERROR, [
        {
          code: ApiErrorCode.VALIDATION_ERROR,
          message: "Page and limit must be positive numbers",
        },
      ]);
    }

    const user = await checkUserAuthOrThrowError(request);
    const result = await getAllTransactionsByUserIdForAPI(user.id, sortBy, order as "asc" | "desc");

    return Response.json(
      successResponse(
        "Transactions retrieved successfully",
        { transactions: result },
        {
          timestamp: new Date().toISOString(),
          requestId: request.headers.get("x-request-id") || undefined,
        },
      ),
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
