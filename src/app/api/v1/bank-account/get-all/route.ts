import { getAllBankAccounts } from "@/domain/bankAccount-domain/ba-repository";
import { ApiErrorCode, successResponse } from "@/lib/response";
import {
  ApiError,
  DELETE,
  HEAD,
  OPTIONS,
  PATCH,
  POST,
  PUT,
  checkUserAuthOrThrowError,
  handleErrors,
} from "../../routes";

/**
 * @swagger
 * /bank-account/get-all:
 *   get:
 *     summary: Get all bank accounts
 *     description: Retrieve a paginated list of bank accounts
 *     tags: [Bank Accounts]
 *     security:
 *       - BearerAuth: []
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
 *     responses:
 *       200:
 *         description: Bank accounts retrieved successfully
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
 *                         bankAccounts:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/BankAccount'
 *       400:
 *         description: Invalid pagination parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Bearer token is missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(request: Request) {
  try {
    // this returns ApiError if the user is not authenticated
    await checkUserAuthOrThrowError(request);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (page < 1 || limit < 1) {
      throw new ApiError("Invalid pagination parameters", 400, ApiErrorCode.VALIDATION_ERROR, [
        {
          code: ApiErrorCode.VALIDATION_ERROR,
          message: "Page and limit must be positive numbers",
        },
      ]);
    }

    const result = await getAllBankAccounts({ page, limit });

    return Response.json(successResponse("Bank accounts retrieved successfully", { bankAccounts: result.items }), {
      status: 200,
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

export { DELETE, HEAD, OPTIONS, PATCH, POST, PUT };
