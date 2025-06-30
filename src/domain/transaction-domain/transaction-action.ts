"use server";

import { Currency } from "@prisma/client";
import transactionService from "./transaction-service";

export async function sendMoneyToBankNumberAction({
  amount,
  currency,
  fromBankNumber,
  toBankNumber,
  userId,
  applicationType,
}: {
  amount: number;
  currency: Currency;
  fromBankNumber: string;
  toBankNumber: string;
  userId: string;
  applicationType: "api" | "web";
}) {
  return transactionService.sendMoneyToBankNumber({
    amount,
    currency,
    fromBankNumber,
    toBankNumber,
    userId,
    applicationType,
  });
}
