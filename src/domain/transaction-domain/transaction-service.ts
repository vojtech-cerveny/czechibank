import { ApiError } from "@/app/api/v1/routes";
import { ApiErrorCode, errorResponse, successResponse } from "@/lib/response";
import { Currency } from "@prisma/client";
import bankAccountService from "../bankAccount-domain/ba-service";
import { sendDiscordMessage } from "../social-reporting-domain/discord-action";
import * as repository from "./transaction-repository";
import { CreateTransactionNumberToNumberSchema } from "./transation-schema";

function parseTransactionData(
  userId: string,
  fromBankNumber: string,
  toBankNumber: string,
  amount: number,
  currency: Currency,
) {
  const parsedTransaction = CreateTransactionNumberToNumberSchema.safeParse({
    userId,
    fromBankNumber,
    toBankNumber,
    amount,
    currency,
  });

  if (!parsedTransaction.success) {
    return errorResponse(
      "Invalid transaction data",
      ApiErrorCode.VALIDATION_ERROR,
      parsedTransaction.error.errors.map((error) => ({
        code: ApiErrorCode.VALIDATION_ERROR,
        field: error.path.join("."),
        message: error.message,
      })),
    );
  }

  return parsedTransaction.data;
}

const transactionService = {
  async sendMoneyToBankNumber({
    userId,
    fromBankNumber,
    toBankNumber,
    amount,
    currency,
    applicationType,
  }: {
    userId: string;
    fromBankNumber: string;
    toBankNumber: string;
    amount: number;
    currency: Currency;
    applicationType: "api" | "web";
  }) {
    try {
      const parsedTransaction = parseTransactionData(userId, fromBankNumber, toBankNumber, amount, currency);

      if ("error" in parsedTransaction) {
        return parsedTransaction;
      }

      const fromBankAccount = await bankAccountService.getBankAccountByNumber(parsedTransaction.fromBankNumber);
      if (!fromBankAccount.success) {
        return fromBankAccount;
      }
      if (parsedTransaction.userId !== fromBankAccount.data.userId) {
        return errorResponse("You are not allowed to send money from this bank account", ApiErrorCode.FORBIDDEN);
      }
      const toBankAccount = await bankAccountService.getBankAccountByNumber(parsedTransaction.toBankNumber);

      if ("error" in fromBankAccount || "error" in toBankAccount) {
        return "error" in fromBankAccount ? fromBankAccount : toBankAccount;
      }

      const result = await repository.sendMoney({
        fromBankId: fromBankAccount.data.id,
        toBankId: toBankAccount.data.id,
        amount,
        currency,
      });

      // HARD-CODED DONATION NUMBER, who cares
      if (result.data.message.to.number == "555555555555/5555") {
        await sendDiscordMessage({
          text: `Money sent from account \`${result.data.message.from.number}\` - **${result.data.message.amount} ${result.data.message.currency}** :tada:`,
          message: "Money sent successfully!",
          sender: `${result.data.message.from.user.name}`,
          applicationType: applicationType,
          city: "prague",
        });
      }
      // if (applicationType === "web") {
      //   revalidatePath("/bankAccount");
      // }
      return successResponse("Transaction successful", result);
    } catch (error: any) {
      return errorResponse(error?.message || "Failed to send money to bank number", ApiErrorCode.INTERNAL_ERROR);
    }
  },

  async getAllTransactionsByUserId(userId: string) {
    return await repository.getAllTransactionsByUserId(userId);
  },

  async getAllTransactionsByIdFromAPI(
    userId: string,
    orderBy: string,
    order: "asc" | "desc",
    page: number = 1,
    limit: number = 10,
  ) {
    if (page < 1 || limit < 1) {
      throw new ApiError("Invalid pagination parameters", 400, ApiErrorCode.VALIDATION_ERROR, [
        {
          code: ApiErrorCode.VALIDATION_ERROR,
          message: "Page and limit must be positive numbers",
        },
      ]);
    }

    const result = await repository.getAllTransactionsByUserIdForAPI(userId, orderBy, order, page, limit);

    if ("error" in result) {
      return errorResponse("Failed to retrieve transactions", ApiErrorCode.INTERNAL_ERROR, [
        {
          code: ApiErrorCode.INTERNAL_ERROR,
          message: "Failed to retrieve transactions",
        },
      ]);
    }

    return successResponse("Transactions retrieved successfully", result);
  },

  async getTransactionDetailByTransactionId(transactionId: string, userId: string) {
    const transaction = await repository.getTransactionDetailByTransactionId(transactionId, userId);

    if (!transaction) {
      throw new ApiError("Transaction not found", 404, ApiErrorCode.NOT_FOUND, [
        {
          code: ApiErrorCode.NOT_FOUND,
          message: "Transaction not found",
        },
      ]);
    }

    return successResponse("Transaction details retrieved successfully", transaction);
  },

  async getAllTransactionsByUserAndBankAccountId(bankAccountId: string) {
    return await repository.getAllTransactionsByUserAndBankAccountId(bankAccountId);
  },
};

export default transactionService;
