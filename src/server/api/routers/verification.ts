//smart-screening\src\server\api\routers\verification.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const verificationRouter = createTRPCRouter({

  create: publicProcedure
    .input(
      z.object({
        fullName: z.string(),
        email: z.string(),
        studentIdNumber: z.string(),
        role: z.string(),
        idImageUrl: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {

      return ctx.db.applicantVerification.create({
        data: {
          fullName: input.fullName,
          email: input.email,
          studentIdNumber: input.studentIdNumber,
          role: input.role,
          idImageUrl: input.idImageUrl,
        },
      });

    }),

    getByEmail: publicProcedure
  .input(z.object({ email: z.string() }))
  .query(async ({ ctx, input }) => {
    return ctx.db.applicantVerification.findFirst({
      where: { email: input.email },
    });
  }),

});