import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import {
  evaluateScenarioAnswer,
  generateOverallFeedback,
} from "~/server/ai/gemini";

export const aiRouter = createTRPCRouter({
  /**
   * Trigger AI evaluation for a submitted exam.
   * Creates EvaluationResult + QuestionEvaluation rows.
   */
  evaluate: publicProcedure
    .input(z.object({ applicationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { applicationId } = input;

      // 1. Fetch application and verify exam is submitted
      const application = await ctx.db.application.findUnique({
        where: { id: applicationId },
        include: { job: true },
      });

      if (!application) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Application not found.",
        });
      }

      if (!application.examSubmitted) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Exam has not been submitted yet.",
        });
      }

      // 2. Prevent double evaluation
      const existing = await ctx.db.evaluationResult.findUnique({
        where: { applicationId },
      });

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "This application has already been evaluated.",
        });
      }

      // 3. Get job cutoff
      const jobCutoff = application.job.cutoff;

      // 4. Fetch all exam answers with their questions
      const examAnswers = await ctx.db.examAnswer.findMany({
        where: { applicationId },
        include: {
          question: {
            include: { options: true },
          },
        },
      });

      if (examAnswers.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No exam answers found for this application.",
        });
      }

      // 5. Create EvaluationResult with PROCESSING status
      const evalResult = await ctx.db.evaluationResult.create({
        data: {
          applicationId,
          totalScore: 0,
          maxScore: 0,
          percentage: 0,
          cutoff: jobCutoff,
          passed: false,
          aiFeedback: "",
          cvUploadGranted: false,
          status: "PROCESSING",
        },
      });

      try {
        // 6. Evaluate each answer
        const questionResults: {
          questionPrompt: string;
          score: number;
          maxMarks: number;
        }[] = [];

        for (const ea of examAnswers) {
          const q = ea.question;
          const maxMarks = q.maxMarks;
          let scoreAwarded: number;
          let feedback: string;
          let expectedAnswer: string;

          if (q.type === "MCQ") {
            // Direct comparison — no AI needed
            expectedAnswer = q.correctKey ?? "";
            const isCorrect =
              ea.answer?.trim().toUpperCase() === expectedAnswer.trim().toUpperCase();
            scoreAwarded = isCorrect ? maxMarks : 0;
            feedback = isCorrect
              ? "Correct answer."
              : `Incorrect. The correct answer was ${expectedAnswer}.`;
          } else {
            // SCENARIO — use Gemini API
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

          // Create QuestionEvaluation record
          await ctx.db.questionEvaluation.create({
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
            score: scoreAwarded,
            maxMarks,
          });
        }

        // 7. Calculate totals
        const totalScore = questionResults.reduce((sum, r) => sum + r.score, 0);
        const maxScore = questionResults.reduce((sum, r) => sum + r.maxMarks, 0);
        const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
        const passed = percentage >= jobCutoff;

        // 8. Generate overall AI feedback
        const aiFeedback = await generateOverallFeedback({
          questionResults,
          percentage,
          passed,
        });

        // 9. Update EvaluationResult with final data
        await ctx.db.evaluationResult.update({
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

        return {
          success: true,
          evaluationResultId: evalResult.id,
          passed,
          percentage,
        };
      } catch (error) {
        // Mark as FAILED if something goes wrong
        await ctx.db.evaluationResult.update({
          where: { id: evalResult.id },
          data: { status: "FAILED" },
        });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "AI evaluation failed. Please try again.",
          cause: error,
        });
      }
    }),

  /**
   * Student result page — overall evaluation summary.
   */
  getResult: protectedProcedure
    .input(z.object({ applicationId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Verify student owns this application
      const application = await ctx.db.application.findUnique({
        where: { id: input.applicationId },
      });

      if (!application || application.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Application not found.",
        });
      }

      const result = await ctx.db.evaluationResult.findUnique({
        where: { applicationId: input.applicationId },
      });

      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Evaluation result not found. The exam may not have been evaluated yet.",
        });
      }

      // Get student name and job title for display
      const app = await ctx.db.application.findUnique({
        where: { id: input.applicationId },
        include: { job: true },
      });

      return {
        studentName: app?.fullName ?? "",
        examTitle: app?.job.title ?? "",
        totalScore: result.totalScore,
        maxScore: result.maxScore,
        percentage: result.percentage,
        cutoff: result.cutoff,
        status: result.passed ? ("PASS" as const) : ("FAIL" as const),
        date: result.evaluatedAt.toISOString().split("T")[0] ?? "",
        aiFeedback: result.aiFeedback,
        cvUploadUnlocked: result.cvUploadGranted,
      };
    }),

  /**
   * Per-question breakdown for student evaluation details page.
   */
  getEvaluationDetails: protectedProcedure
    .input(z.object({ applicationId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Verify student owns this application
      const application = await ctx.db.application.findUnique({
        where: { id: input.applicationId },
      });

      if (!application || application.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Application not found.",
        });
      }

      const evals = await ctx.db.questionEvaluation.findMany({
        where: { applicationId: input.applicationId },
        include: { question: true },
        orderBy: { createdAt: "asc" },
      });

      return evals.map((e, index) => ({
        id: e.id,
        questionNumber: index + 1,
        questionText: e.question.prompt,
        studentAnswer: e.studentAnswer ?? "",
        expectedAnswer: e.expectedAnswer ?? "",
        score: e.scoreAwarded,
        maxMarks: e.maxMarks,
        aiFeedback: e.aiFeedback,
      }));
    }),

  /**
   * Student permission / CV upload status.
   */
  getPermissionStatus: protectedProcedure
    .input(z.object({ applicationId: z.string() }))
    .query(async ({ ctx, input }) => {
      const application = await ctx.db.application.findUnique({
        where: { id: input.applicationId },
      });

      if (!application || application.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Application not found.",
        });
      }

      const result = await ctx.db.evaluationResult.findUnique({
        where: { applicationId: input.applicationId },
      });

      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Evaluation result not found.",
        });
      }

      return {
        passed: result.passed,
        score: result.percentage,
        cutoff: result.cutoff,
        percentage: result.percentage,
        cvUploadUnlocked: result.cvUploadGranted,
        status: result.status,
        message: result.passed
          ? "Congratulations! You have successfully passed the AI evaluation. Your CV upload is now unlocked."
          : "Unfortunately, you did not meet the minimum cutoff score. Please review the feedback and try again.",
        nextSteps: result.passed
          ? [
              "Upload your CV/Resume to complete your profile",
              "Browse and apply to matching job positions",
              "Prepare for upcoming interviews",
              "Review your detailed evaluation feedback",
            ]
          : [
              "Review detailed evaluation feedback",
              "Study the recommended topics",
              "Practice with sample questions",
              "Retake the assessment when ready",
            ],
      };
    }),

  /**
   * Recruiter filtered candidates list for a specific job.
   */
  getFilteredCandidates: publicProcedure
    .input(
      z.object({
        jobId: z.string(),
        statusFilter: z.enum(["PASS", "FAIL", "ALL"]).optional().default("ALL"),
        minScore: z.number().optional(),
        search: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // Find all submitted applications for this job that have been evaluated
      const applications = await ctx.db.application.findMany({
        where: {
          jobId: input.jobId,
          examSubmitted: true,
          evaluationResult: {
            status: "COMPLETED",
          },
        },
        include: {
          evaluationResult: true,
          job: true,
        },
      });

      let candidates = applications
        .filter((app) => app.evaluationResult !== null)
        .map((app) => ({
          id: app.id,
          name: app.fullName,
          email: app.email,
          appliedRole: app.job.title,
          score: app.evaluationResult!.totalScore,
          maxScore: app.evaluationResult!.maxScore,
          percentage: app.evaluationResult!.percentage,
          status: app.evaluationResult!.passed
            ? ("PASS" as const)
            : ("FAIL" as const),
          evaluatedAt: app.evaluationResult!.evaluatedAt
            .toISOString()
            .split("T")[0] ?? "",
        }));

      // Apply status filter
      if (input.statusFilter && input.statusFilter !== "ALL") {
        candidates = candidates.filter(
          (c) => c.status === input.statusFilter,
        );
      }

      // Apply minimum score filter
      if (input.minScore !== undefined) {
        candidates = candidates.filter(
          (c) => c.percentage >= input.minScore!,
        );
      }

      // Apply search filter
      if (input.search) {
        const q = input.search.toLowerCase();
        candidates = candidates.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q),
        );
      }

      return candidates;
    }),

  /**
   * Full candidate detail for recruiter view.
   */
  getCandidateDetail: publicProcedure
    .input(z.object({ applicationId: z.string() }))
    .query(async ({ ctx, input }) => {
      const application = await ctx.db.application.findUnique({
        where: { id: input.applicationId },
        include: {
          job: true,
          evaluationResult: {
            include: {
              questionEvals: {
                include: { question: true },
                orderBy: { createdAt: "asc" },
              },
            },
          },
        },
      });

      if (!application) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Application not found.",
        });
      }

      const evalResult = application.evaluationResult;

      if (!evalResult) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Evaluation result not found for this candidate.",
        });
      }

      return {
        id: application.id,
        name: application.fullName,
        email: application.email,
        phone: application.mobile ?? "",
        appliedRole: application.job.title,
        university: application.university,
        degree: application.degree,
        specialization: application.specialization,
        cgpa: application.cgpa,
        programmingLanguages: application.programmingLanguages,
        frameworks: application.frameworks,
        softwareProficiency: application.softwareProficiency,
        linkedin: application.linkedin,
        github: application.github,
        portfolio: application.portfolio,
        totalScore: evalResult.totalScore,
        maxScore: evalResult.maxScore,
        percentage: evalResult.percentage,
        cutoff: evalResult.cutoff,
        status: evalResult.passed ? ("PASS" as const) : ("FAIL" as const),
        aiFeedback: evalResult.aiFeedback,
        cvUploadGranted: evalResult.cvUploadGranted,
        evaluationDate:
          evalResult.evaluatedAt.toISOString().split("T")[0] ?? "",
        answers: evalResult.questionEvals.map((qe, index) => ({
          id: qe.id,
          questionNumber: index + 1,
          questionText: qe.question.prompt,
          studentAnswer: qe.studentAnswer ?? "",
          expectedAnswer: qe.expectedAnswer ?? "",
          score: qe.scoreAwarded,
          maxMarks: qe.maxMarks,
          aiFeedback: qe.aiFeedback,
        })),
      };
    }),
});
