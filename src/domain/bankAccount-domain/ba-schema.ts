import { z } from "zod";

export const BankAccountSchema = z.object({
  name: z.string().optional(),
});
