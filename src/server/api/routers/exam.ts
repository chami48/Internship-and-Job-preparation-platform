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
      applicationId: z.string(),
    }),
  )
  .query(async ({ ctx, input }) => {

    const app = await ctx.db.application.findUnique({
      where: { id: input.applicationId },
      include: { job: true },
    });

    if (!app) {
      throw new Error("Application not found");
    }

    // 🔒 If already locked
    if (app.lockedQuestions) {
      return app.lockedQuestions;
    }

    const all = await ctx.db.question.findMany({
      where: { role: app.job.role }, // ✅ use job role
      include: { options: true },
    });

    if (!all.length) {
      throw new Error("No questions found for this role");
    }

    const shuffledQuestions = shuffle(all).slice(0, 10);

    const finalQuestions = shuffledQuestions.map((q) => ({
      ...q,
      options: q.type === "MCQ"
        ? shuffle(q.options)
        : q.options,
    }));

    await ctx.db.application.update({
      where: { id: input.applicationId },
      data: { lockedQuestions: finalQuestions },
    });

    return finalQuestions;
  }),
  // =====================================
// LOG VIOLATION
// =====================================
// =====================================
// LOG VIOLATION (DEDUPLICATED)
// =====================================
logViolation: publicProcedure
  .input(
    z.object({
      applicationId: z.string(),
      type: z.enum([
        "FULLSCREEN_EXIT",
        "TAB_SWITCH",
        "COPY_PASTE_RIGHTCLICK",
        "SCREENSHOT_ATTEMPT",
        "DEV_TOOLS",
        "FACE_NOT_DETECTED",
        "MULTIPLE_FACES",
      ]),
      message: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {

    // 🔎 Check last same-type violation
    const last = await ctx.db.examViolation.findFirst({
      where: {
        applicationId: input.applicationId,
        type: input.type,
      },
      orderBy: { createdAt: "desc" },
    });

    if (last) {
      const diff =
        new Date().getTime() - new Date(last.createdAt).getTime();

      // ⛔ Ignore if triggered within 2 seconds
      if (diff < 2000) {
        const total = await ctx.db.examViolation.count({
          where: { applicationId: input.applicationId },
        });

        return {
          totalViolations: total,
          terminated: total >= 3,
          ignored: true,
        };
      }
    }

    // ✅ Save violation
    await ctx.db.examViolation.create({
      data: {
        applicationId: input.applicationId,
        type: input.type,
        message: input.message,
      },
    });

    const count = await ctx.db.examViolation.count({
      where: { applicationId: input.applicationId },
    });

    return {
      totalViolations: count,
      terminated: count >= 3,
    };
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

    // 🚫 Prevent submission if terminated
    const violationCount = await ctx.db.examViolation.count({
      where: { applicationId: input.applicationId },
    });

    if (violationCount >= 3) {
      throw new Error("Exam terminated due to violations.");
    }

    if (app.examSubmitted) {
      throw new Error("Exam already submitted.");
    }

    // 🔒 Get locked questions
    const locked = app.lockedQuestions as any[];

    if (!locked) {
      throw new Error("No locked questions found.");
    }

    // Map answers into object for quick lookup
    const answerMap = new Map(
      input.answers.map((a) => [a.questionId, a.answer])
    );

    // Build complete answer set (including nulls)
    const completeAnswers = locked.map((q) => ({
      questionId: q.id,
      applicationId: input.applicationId,
      answer: answerMap.get(q.id) ?? null, // ✅ null if not answered
    }));

    await ctx.db.examAnswer.createMany({
      data: completeAnswers,
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