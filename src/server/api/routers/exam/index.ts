import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const examRouter = createTRPCRouter({
  start: protectedProcedure
    .input(
      z.object({
        applicationId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.examSession.create({
        data: {
          applicationId: input.applicationId,
          questionOrder: "[]", // you will generate later
        },
      });
    }),
});