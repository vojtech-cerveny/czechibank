import { Currency } from "@prisma/client";
import { z } from "zod";

// Schema for the actual transaction creation logic in the service
export const CreateTransactionNumberToNumberSchema = z.object({
  amount: z
    .number()
    .positive("Amount should be positive, this incident was reported. Nice day!")
    .transform((val) => parseFloat(val.toFixed(1))),
  currency: z.custom<Currency>(),
  toBankNumber: z.string().endsWith("5555").length(17, "Bank number must be exactly in format 1111222233334444/5555"),
  userId: z.string(),
  fromBankNumber: z.string(),
});

// Schema specifically for validating the incoming API request body
export const ApiTransactionCreateSchema = z.object({
  amount: z.preprocess(
    (val) => {
      // Attempt to parse if it's a string, otherwise pass through
      if (typeof val === "string") {
        const parsed = parseFloat(val);
        return isNaN(parsed) ? val : parsed; // Return original string if parsing failed
      }
      return val;
    },
    // Apply number and positive validation after preprocessing
    z
      .number({
        invalid_type_error: "Amount must be a number or a string representing a number.",
      })
      .positive("Amount must be a positive number."),
  ),
  toBankNumber: z.string().endsWith("5555").length(17, "Bank number must be exactly in format 1111222233334444/5555"),
});

export const CreateTransactionUserIdToUserIdUserSchema = z.object({
  amount: z
    .number()
    .positive("Amount should be positive, this incident was reported. Nice try. Nice day!")
    .transform((val) => parseFloat(val.toFixed(1))),
  currency: z.custom<Currency>(),
  fromUserId: z.string(),
  toUserId: z.string(),
});
