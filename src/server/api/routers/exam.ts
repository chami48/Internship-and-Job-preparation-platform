import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

// Fisher–Yates shuffle
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    const temp = arr[i]!;
    arr[i] = arr[j]!;
    arr[j] = temp;
  }

  return arr;
}

export const examRouter = createTRPCRouter({

  // =====================================
  // GET QUESTIONS (LOCKED PER APPLICATION)
  // =====================================
  getQuestions: publicProcedure
    .input(
      z.object({
        role: z.enum([
          "SOFTWARE_ENGINEER",
          "UX_ENGINEER",
          "PROJECT_MANAGER",
        ]),
        applicationId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {

      const app = await ctx.db.application.findUnique({
        where: { id: input.applicationId },
      });

      if (!app) {
        throw new Error("Application not found");
      }

      // 🔒 If already locked → return same questions
      if (app.lockedQuestions) {
        return app.lockedQuestions;
      }

      // Get all questions for role
      const all = await ctx.db.question.findMany({
        where: { role: input.role },
        include: { options: true },
      });

      if (!all.length) {
        throw new Error("No questions found");
      }

      // 🎲 Random question order
      const shuffledQuestions = shuffle(all).slice(0, 10);

      // 🎲 Random MCQ option order
      const finalQuestions = shuffledQuestions.map((q) => ({
        ...q,
        options: q.type === "MCQ"
          ? shuffle(q.options)
          : q.options,
      }));

      // 🔒 Lock for this student
      await ctx.db.application.update({
        where: { id: input.applicationId },
        data: {
          lockedQuestions: finalQuestions,
        },
      });

      return finalQuestions;
    }),

  // =====================================
  // SUBMIT (PREVENT DOUBLE SUBMIT)
  // =====================================
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

      const app = await ctx.db.application.findUnique({
        where: { id: input.applicationId },
      });

      if (!app) {
        throw new Error("Application not found");
      }

      // 🚫 Prevent double submit
      if (app.examSubmitted) {
        throw new Error("Exam already submitted.");
      }

      await ctx.db.examAnswer.createMany({
        data: input.answers.map((a) => ({
          questionId: a.questionId,
          applicationId: input.applicationId,
          answer: a.answer,
        })),
      });

      await ctx.db.application.update({
        where: { id: input.applicationId },
        data: {
          examSubmitted: true,
        },
      });

      return { success: true };
    }),
});