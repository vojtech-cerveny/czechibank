import transactionService from "@/domain/transaction-domain/transaction-service";
import { ApiErrorCode, errorResponse } from "@/lib/response";
import { NextRequest, NextResponse } from "next/server";
import { checkUserAuthOrThrowError } from "../server-actions";
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
 *       - ApiKeyAuth: []
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
 *         description: Unauthorized - API key is missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(request: NextRequest) {
  try {
    const user = await checkUserAuthOrThrowError(request);
    if ("error" in user) {
      return NextResponse.json(errorResponse(user.error.message, user.error.code), { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";

    // Validate pagination parameters
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
      return NextResponse.json(
        errorResponse("Invalid pagination parameters", "400", [
          {
            code: ApiErrorCode.VALIDATION_ERROR,
            message: "Page and limit must be positive numbers",
          },
        ]),
        { status: 400 },
      );
    }

    const result = await transactionService.getAllTransactionsByIdFromAPI(user.id, sortBy, sortOrder, page, limit);

    if ("error" in result) {
      if (result.error.code === "VALIDATION_ERROR") {
        return NextResponse.json(errorResponse(result.error.message, "400"), { status: 400 });
      }
      return NextResponse.json(errorResponse(result.error.message, "500"), { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        transactions: result.data.transactions,
      },
      meta: {
        pagination: result.data.pagination,
      },
    });
  } catch (error) {
    console.error("Error in GET /api/v1/transactions:", error);
    return NextResponse.json(errorResponse("Internal server error", "500"), { status: 500 });
  }
}
