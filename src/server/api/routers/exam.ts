import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const examRouter = createTRPCRouter({
  // 🔹 Get Questions
  getQuestions: publicProcedure
    .input(
      z.object({
        role: z.enum([
          "SOFTWARE_ENGINEER",
          "UX_ENGINEER",
          "PROJECT_MANAGER",
        ]),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.question.findMany({
        where: { role: input.role },
        include: { options: true },
      });
    }),

  // 🔹 Submit Answers
  submit: publicProcedure
    .input(
      z.object({
        applicationId: z.string(),
        answers: z.array(
          z.object({
            questionId: z.string(),
            answer: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.examAnswer.createMany({
        data: input.answers.map((a) => ({
          questionId: a.questionId,
          applicationId: input.applicationId,
          answer: a.answer,
        })),
      });
    }),
});