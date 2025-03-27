import { ApiErrorCode, ErrorResponse, errorResponse, SuccessResponse, successResponse } from "@/lib/response";
import { BankAccount } from "@prisma/client";
import * as repository from "./ba-repository";

type Pagination = {
  page: number;
  limit: number;
};

const bankAccountService = {
  async createBankAccount(
    bankAccount: Pick<BankAccount, "userId" | "currency" | "name">,
  ): Promise<SuccessResponse<BankAccount> | ErrorResponse> {
    try {
      const result = await repository.createBankAccount(bankAccount);
      return successResponse("Bank account created successfully", result);
    } catch (error: any) {
      return errorResponse(error?.message || "Failed to create bank account", ApiErrorCode.INTERNAL_ERROR);
    }
  },

  async getBankAccountById(id: string, userId: string) {
    const bankAccount = await repository.getBankAccountByIdAndUserId(id, userId);

    if (!bankAccount) {
      return errorResponse("Bank account not found", ApiErrorCode.NOT_FOUND);
    }

    return successResponse("Bank account retrieved successfully", bankAccount);
  },

  async getMyBankAccounts(userId: string, pagination: Pagination) {
    if (pagination.page < 1 || pagination.limit < 1) {
      return errorResponse("Invalid pagination parameters", ApiErrorCode.VALIDATION_ERROR);
    }

    try {
      const bankAccounts = await repository.getBankAccountsByUserId(userId, pagination);
      return successResponse("Bank accounts retrieved successfully", bankAccounts);
    } catch (error: any) {
      return errorResponse(error?.message || "Failed to retrieve bank accounts", ApiErrorCode.INTERNAL_ERROR);
    }
  },

  async getAllBankAccounts(pagination: Pagination) {
    if (pagination.page < 1 || pagination.limit < 1) {
      return errorResponse("Invalid pagination parameters", ApiErrorCode.VALIDATION_ERROR);
    }

    const bankAccounts = await repository.getAllBankAccounts(pagination);
    return successResponse("Bank accounts retrieved successfully", bankAccounts);
  },

  async deleteBankAccount(id: string): Promise<SuccessResponse<BankAccount> | ErrorResponse> {
    try {
      const deletedBankAccount = await repository.deleteBankAccount(id);
      return successResponse("Bank account deleted successfully", deletedBankAccount);
    } catch (error: any) {
      return errorResponse(error?.message || "Failed to delete bank account", ApiErrorCode.INTERNAL_ERROR);
    }
  },

  async getBankAccountByNumber(bankNumber: string): Promise<SuccessResponse<BankAccount> | ErrorResponse> {
    try {
      const bankAccount = await repository.getBankAccountByNumber(bankNumber);
      if (!bankAccount) {
        return errorResponse("Bank account not found", ApiErrorCode.NOT_FOUND);
      }
      return successResponse("Bank account retrieved successfully", bankAccount);
    } catch (error: any) {
      return errorResponse(error?.message || "Bank account not found", ApiErrorCode.NOT_FOUND);
    }
  },
};

export default bankAccountService;
