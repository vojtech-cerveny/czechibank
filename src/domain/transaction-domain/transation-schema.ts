import { Currency } from "@prisma/client";
import { z } from "zod";

export const CreateTransactionNumberToNumberSchema = z.object({
  amount: z
    .number()
    .positive("Amount should be positive, this incident was reported. Nice day!")
    .transform((val) => parseFloat(val.toFixed(1))),
  currency: z.custom<Currency>(),
  to: z.string().endsWith("5555").length(16),
  userId: z.string(),
  fromBankNumber: z.string().optional(),
  toBankNumber: z.string(),
});

export const CreateTransactionUserIdToUserIdUserSchema = z.object({
  amount: z
    .number()
    .positive("Amount should be positive, this incident was reported. Nice day!")
    .transform((val) => parseFloat(val.toFixed(1))),
  currency: z.custom<Currency>(),
  fromUserId: z.string(),
  toUserId: z.string(),
});