import { z } from "zod";

export const UserSchema = z.object({
  email: z.string().email(),
  name: z.string().trim().min(1, "Name cannot be empty or contain only spaces"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  sex: z.enum(["MALE", "FEMALE"]), // Adjust based on your requirements
});
