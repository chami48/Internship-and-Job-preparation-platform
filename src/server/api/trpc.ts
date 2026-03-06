//smart-screening\src\server\api\trpc.ts
/**
 * tRPC Server Setup (App Router + NextAuth + Prisma)
 */

import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { auth } from "~/server/auth";
import { db } from "~/server/db";

import { headers } from "next/headers";


/**
 * 1️⃣ CONTEXT
 * Properly attach session using request headers
 */
/**
 * 1️⃣ CONTEXT (App Router Correct Version)
 */
export const createTRPCContext = async () => {
  const session = await auth();

  return {
    db,
    session,
  };
};

/**
 * 2️⃣ INITIALIZATION
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Create a server-side caller
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3️⃣ ROUTER
 */
export const createTRPCRouter = t.router;

/**
 * Dev timing middleware
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (t._config.isDev) {
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms`);

  return result;
});

/**
 * Public procedure
 */
export const publicProcedure = t.procedure.use(timingMiddleware);

/**
 * Protected procedure (Requires Login)
 */
export const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in.",
      });
    }

    return next({
      ctx: {
        ...ctx,
        session: ctx.session,
      },
    });
  });