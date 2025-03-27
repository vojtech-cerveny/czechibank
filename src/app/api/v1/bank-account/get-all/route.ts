import { checkUserAuthOrThrowError } from "@/app/api/v1/server-actions";
import bankAccountService from "@/domain/bankAccount-domain/ba-service";
import { ApiErrorCode, errorResponse, successResponse } from "@/lib/response";
import { ApiError, DELETE, HEAD, OPTIONS, PATCH, POST, PUT, handleErrors } from "../../routes";
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
    const user = await checkUserAuthOrThrowError(request);
    if ("error" in user) {
      return Response.json(user, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (page < 1 || limit < 1) {
      return Response.json(errorResponse("Invalid pagination parameters", ApiErrorCode.VALIDATION_ERROR), {
        status: 422,
      });
    }

    const result = await bankAccountService.getAllBankAccounts({ page, limit });

    if ("error" in result) {
      return Response.json(result);
    }

    return Response.json(successResponse("Bank accounts retrieved successfully", { bankAccounts: result.data.items }), {
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
