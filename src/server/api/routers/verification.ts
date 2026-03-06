import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const verificationRouter = createTRPCRouter({

  // ✅ CREATE OR UPDATE VERIFICATION
  create: protectedProcedure
    .input(
      z.object({
        fullName: z.string(),
        studentIdNumber: z.string(),
        role: z.string(),
        idImageUrl: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {

      if (ctx.session.user.role !== "STUDENT") {
  throw new Error("Only students can verify.");
}

      return ctx.db.applicantVerification.upsert({
        where: { userId: ctx.session.user.id },
        update: {
          fullName: input.fullName,
          studentIdNumber: input.studentIdNumber,
          role: input.role,
          idImageUrl: input.idImageUrl,
        },
        create: {
          userId: ctx.session.user.id,
          fullName: input.fullName,
          studentIdNumber: input.studentIdNumber,
          role: input.role,
          idImageUrl: input.idImageUrl,
        },
      });
    }),

  // ✅ GET CURRENT USER VERIFICATION
  getMyVerification: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.applicantVerification.findUnique({
      where: { userId: ctx.session.user.id },
    });
  }),

});