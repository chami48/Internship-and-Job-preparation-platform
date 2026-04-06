import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

// ✅ ALL ROLES
const PrepQuizRoleEnum = z.enum([
  "SOFTWARE_ENGINEER",
  "FRONTEND_DEVELOPER",
  "BACKEND_DEVELOPER",
  "FULLSTACK_DEVELOPER",
  "QA_ENGINEER",
  "DEVOPS_ENGINEER",
  "DATA_ANALYST",
  "UI_UX_DESIGNER",
  "PROJECT_MANAGER",
  "BUSINESS_ANALYST",
]);

export const prepQuizRouter = createTRPCRouter({

  // =========================================================
  // ✅ GET RANDOM QUESTIONS
  // =========================================================
  getQuestions: protectedProcedure
    .input(z.object({ role: PrepQuizRoleEnum }))
    .query(async ({ ctx, input }) => {

      const questions = await ctx.db.prepQuizQuestion.findMany({
        where: { role: input.role },
        include: { options: true },
      });

      const shuffled = [...questions].sort(() => Math.random() - 0.5);

      return shuffled.slice(0, 20);
    }),

  // =========================================================
  // ✅ SUBMIT QUIZ
  
  submitQuiz: protectedProcedure
  .input(
    z.object({
      role: PrepQuizRoleEnum,
      answers: z.array(
        z.object({
          questionId: z.string(),
          selectedKey: z.string(),
        })
      ),
      allQuestionIds: z.array(z.string()), // ✅ All 20 question IDs
    })
  )
  .mutation(async ({ ctx, input }) => {

    let score = 0;

    // ✅ FETCH ALL QUESTIONS (not just answered)
    const questions = await ctx.db.prepQuizQuestion.findMany({
      where: {
        id: {
          in: input.allQuestionIds,
        },
      },
      include: { options: true },
    });

    const answerMap = new Map(
      input.answers.map((a) => [a.questionId, a.selectedKey])
    );

    const answersToSave = [];

    for (const q of questions) {
      const correct = q.options.find((o) => o.isCorrect);
      const selected = answerMap.get(q.id);

      const isCorrect = correct?.key === selected;

      if (isCorrect) score++;

      answersToSave.push({
        questionId: q.id,
        selectedKey: selected ?? "",
        isCorrect: !!isCorrect,
      });
    }

    const attempt = await ctx.db.prepQuizAttempt.create({
      data: {
        userId: ctx.session.user.id, // ✅ REAL USER
        role: input.role,
        score,
        answers: {
          create: answersToSave,
        },
      },
    });

    return {
      score,
      total: input.allQuestionIds.length, // ✅ Show total of all 20
      attemptId: attempt.id,
    };
  }),


  // =========================================================
  // ✅ GET ATTEMPT
  // =========================================================
  getAttempt: protectedProcedure
    .input(z.object({ attemptId: z.string() }))
    .query(async ({ ctx, input }) => {

      const attempt = await ctx.db.prepQuizAttempt.findUnique({
        where: { id: input.attemptId },
        include: {
          answers: true,
        },
      });

      if (!attempt) return null;

      // ✅ FETCH ALL QUESTIONS (not just answered)
      const questions = await ctx.db.prepQuizQuestion.findMany({
        where: {
          id: {
            in: attempt.answers.map((a) => a.questionId),
          },
        },
        include: {
          options: true,
        },
      });

      const formattedQuestions = questions.map((q) => {
        const userAnswer = attempt.answers.find(
          (a) => a.questionId === q.id
        );

        return {
          ...q,
          userAnswer: userAnswer?.selectedKey || null, // ✅ null for unanswered
          isAnswered: !!userAnswer?.selectedKey,
        };
      });

      return {
        attempt,
        questions: formattedQuestions,
      };
    }),

});