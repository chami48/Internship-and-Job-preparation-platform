import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

    // ✅ Database is required
    DATABASE_URL: z.string().min(1),

    // ✅ Auth.js / NextAuth requires secret
    AUTH_SECRET: z.string().min(1),

    // ✅ Discord is OPTIONAL (so no error if you don't use it now)
    AUTH_DISCORD_ID: z.string().optional(),
    AUTH_DISCORD_SECRET: z.string().optional(),

    // ✅ Gemini API key for AI evaluation features
    GEMINI_API_KEY: z.string().min(1),
    NILUMI_API_KEY: z.string().optional(),
  },

  client: {},

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,

    DATABASE_URL: process.env.DATABASE_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,

    AUTH_DISCORD_ID: process.env.AUTH_DISCORD_ID,
    AUTH_DISCORD_SECRET: process.env.AUTH_DISCORD_SECRET,

    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    NILUMI_API_KEY: process.env.NILUMI_API_KEY,
  },
});