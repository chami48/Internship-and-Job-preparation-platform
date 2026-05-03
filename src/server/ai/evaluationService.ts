import type { PrismaClient } from "../../../generated/prisma";
import {
  evaluateScenarioAnswer,
  generateOverallFeedback,
} from "~/server/ai/gemini";

/**
 * Core AI evaluation logic extracted as a standalone service function.
 * Accepts a Prisma client directly so it can be called from anywhere on the server
 * (tRPC mutations, fire-and-forget after exam submit, etc.).
 *
 * This function NEVER throws — on error it marks the EvaluationResult as FAILED
 * and logs the error, making it safe to call with `void` (fire-and-forget).
 */
export async function evaluateApplication(
  db: PrismaClient,
  applicationId: string,
): Promise<void> {
  // 1. Fetch application + job (for cutoff)
  const application = await db.application.findUnique({
    where: { id: applicationId },
    include: { job: true },
  });

  if (!application || !application.examSubmitted) {
    console.error(
      `[AI Eval] Skipped ${applicationId}: application not found or exam not submitted`,
    );
    return;
  }

  // 2. Prevent double evaluation — allow retry if previous attempt FAILED/PENDING
  const existing = await db.evaluationResult.findUnique({
    where: { applicationId },
  });

  if (existing) {
    if (existing.status === "COMPLETED" || existing.status === "PROCESSING") {
      // Already evaluated or in progress — skip silently
      return;
    }
    // Delete failed/pending result so we can retry fresh
    await db.questionEvaluation.deleteMany({
      where: { evaluationResultId: existing.id },
    });
    await db.evaluationResult.delete({ where: { id: existing.id } });
  }

  // 3. Fetch exam answers with their questions
  const examAnswers = await db.examAnswer.findMany({
    where: { applicationId },
    include: {
      question: { include: { options: true } },
    },
  });

  if (examAnswers.length === 0) {
    console.error(`[AI Eval] Skipped ${applicationId}: no exam answers found`);
    return;
  }

  // 4. Create EvaluationResult with PROCESSING status
  const evalResult = await db.evaluationResult.create({
    data: {
      applicationId,
      totalScore: 0,
      maxScore: 0,
      percentage: 0,
      cutoff: application.job.cutoff,
      passed: false,
      aiFeedback: "",
      cvUploadGranted: false,
      status: "PROCESSING",
    },
  });

  try {
    const questionResults: {
      questionPrompt: string;
      score: number;
      maxMarks: number;
    }[] = [];

    // 5. Evaluate each answer
    for (const ea of examAnswers) {
      const q = ea.question;

      const maxMarks = q.maxMarks ?? 10;

      let scoreAwarded: number;
      let feedback: string;
      let expectedAnswer: string;

      if (q.type === "MCQ") {
        expectedAnswer = q.correctKey ?? "";

        const isCorrect =
          ea.answer?.trim().toUpperCase() ===
          expectedAnswer.trim().toUpperCase();

        scoreAwarded = isCorrect ? maxMarks : 0;

        feedback = isCorrect
          ? "Correct answer."
          : `Incorrect. The correct answer was ${expectedAnswer}.`;
      } else {
        expectedAnswer = q.rubric ?? "";

        const aiResult = await evaluateScenarioAnswer({
          questionPrompt: q.prompt,
          rubric: expectedAnswer,
          studentAnswer: ea.answer ?? "",
          maxMarks,
        });

        scoreAwarded = aiResult.score;
        feedback = aiResult.feedback;
      }

      // 6. Save per-question evaluation record
      await db.questionEvaluation.create({
        data: {
          evaluationResultId: evalResult.id,
          questionId: q.id,
          applicationId,
          studentAnswer: ea.answer,
          expectedAnswer,
          scoreAwarded,
          maxMarks,
          aiFeedback: feedback,
        },
      });

      questionResults.push({
        questionPrompt: q.prompt,
        score: scoreAwarded ?? 0,
        maxMarks: maxMarks ?? 0,
      });
    }

    // 7. Calculate totals
    const totalScore = questionResults.reduce((sum, r) => sum + r.score, 0);
    const maxScore = questionResults.reduce((sum, r) => sum + r.maxMarks, 0);
    const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
    const passed = percentage >= application.job.cutoff;

    // 8. Generate overall AI feedback paragraph
    const aiFeedback = await generateOverallFeedback({
      questionResults,
      percentage,
      passed,
    });

    // 9. Update EvaluationResult with final data
    await db.evaluationResult.update({
      where: { id: evalResult.id },
      data: {
        totalScore,
        maxScore,
        percentage,
        passed,
        aiFeedback,
        cvUploadGranted: passed,
        status: "COMPLETED",
      },
    });

    console.log(
      `[AI Eval] Completed ${applicationId}: ${percentage.toFixed(1)}% — ${passed ? "PASSED" : "FAILED"}`,
    );
  } catch (error) {
    // Mark as FAILED — never rethrow (fire-and-forget safe)
    await db.evaluationResult
      .update({ where: { id: evalResult.id }, data: { status: "FAILED" } })
      .catch(() => undefined);
    console.error(`[AI Eval] Failed for ${applicationId}:`, error);
  }
}
