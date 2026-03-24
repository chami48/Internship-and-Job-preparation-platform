import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { evaluateApplication } from "~/server/ai/evaluationService";

export const aiRouter = createTRPCRouter({
  /**
   * Manually trigger AI evaluation for a submitted exam.
   * Core logic lives in evaluationService.ts (also called automatically after exam.submit).
   */
  evaluate: publicProcedure
    .input(z.object({ applicationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { applicationId } = input;

      // Validate application exists and exam is submitted
      const application = await ctx.db.application.findUnique({
        where: { id: applicationId },
      });

      if (!application) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Application not found." });
      }

      if (!application.examSubmitted) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Exam has not been submitted yet." });
      }

      // Check for existing completed/processing result
      const existing = await ctx.db.evaluationResult.findUnique({
        where: { applicationId },
      });

      if (existing && (existing.status === "COMPLETED" || existing.status === "PROCESSING")) {
        throw new TRPCError({ code: "CONFLICT", message: "This application has already been evaluated." });
      }

      // Delegate to shared service (awaited here for manual trigger — returns result)
      await evaluateApplication(ctx.db, applicationId);

      const result = await ctx.db.evaluationResult.findUnique({
        where: { applicationId },
      });

      if (!result || result.status === "FAILED") {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "AI evaluation failed. Please try again.",
        });
      }

      return {
        success: true,
        evaluationResultId: result.id,
        passed: result.passed,
        percentage: result.percentage,
      };
    }),

  /**
   * Student result page — overall evaluation summary.
   */
  getResult: publicProcedure
    .input(z.object({ applicationId: z.string() }))
    .query(async ({ ctx, input }) => {
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
  getEvaluationDetails: publicProcedure
    .input(z.object({ applicationId: z.string() }))
    .query(async ({ ctx, input }) => {
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
  getPermissionStatus: publicProcedure
    .input(z.object({ applicationId: z.string() }))
    .query(async ({ ctx, input }) => {
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
