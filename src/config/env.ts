import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:5000/api/v1"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

// Validate environment variables on startup
const parseEnv = () => {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NODE_ENV: process.env.NODE_ENV,
  });

  if (!parsed.success) {
    console.error("❌ Invalid environment variables:", parsed.error.format());
    // Safe fallback or throw error in production
    if (process.env.NODE_ENV === "production") {
      throw new Error("Invalid environment variables");
    }
    return {
      NEXT_PUBLIC_API_URL: "http://localhost:5000/api/v1",
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
      NODE_ENV: "development" as const,
    };
  }

  return parsed.data;
};

export const env = parseEnv();
export type EnvSchema = z.infer<typeof envSchema>;
