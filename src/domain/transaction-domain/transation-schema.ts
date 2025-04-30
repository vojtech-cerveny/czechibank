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
      // Only accept strings that are valid numbers (integer or decimal)
      if (typeof val === "string") {
        // Regex matches optional leading +/-, digits, optional decimal, optional exponent
        const validNumberPattern = /^[-+]?\d*(\.\d+)?([eE][-+]?\d+)?$/;
        if (validNumberPattern.test(val.trim()) && val.trim() !== "") {
          const parsed = parseFloat(val);
          return isNaN(parsed) ? undefined : parsed;
        }
        return undefined; // Invalid string, will fail number validation
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
