import { z } from "zod";

const envSchema = z.object({
  DISCORD_WEBHOOK_URL: z.string().url(),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error("Invalid environment variables:", env.error.flatten().fieldErrors);
  process.exit(1);
}

export default env.data;
