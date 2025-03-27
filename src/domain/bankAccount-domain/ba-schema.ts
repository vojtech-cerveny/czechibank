import { Currency } from "@prisma/client";
import { z } from "zod";
export const BankAccountSchema = z.object({
  name: z.string().optional(),
  currency: z.nativeEnum(Currency),
});
