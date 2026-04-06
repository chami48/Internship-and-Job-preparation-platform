//smart-screening\src\server\api\routers\job.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";
import { JobRole, JobType, JobLevel } from "../../../../generated/prisma";
import { improveJobPostDraft } from "~/server/ai/gemini";

export const jobRouter = createTRPCRouter({
  improveDraft: publicProcedure
    .input(
      z.object({
        title: z.string(),
        location: z.string(),
        role: z.nativeEnum(JobRole),
        type: z.nativeEnum(JobType),
        level: z.nativeEnum(JobLevel),
        tags: z.string(),
        salary: z.string().optional(),
        description: z.string(),
        responsibilities: z.string(),
        requirements: z.string(),
        benefits: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      return improveJobPostDraft({
        title: input.title,
        location: input.location,
        role: input.role,
        type: input.type,
        level: input.level,
        tags: input.tags,
        salary: input.salary,
        description: input.description,
        responsibilities: input.responsibilities,
        requirements: input.requirements,
        benefits: input.benefits,
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        companyId: z.string(),
        title: z.string(),
        location: z.string(),
        role: z.nativeEnum(JobRole),
        type: z.nativeEnum(JobType),
        level: z.nativeEnum(JobLevel),
        tags: z.string(),
        salary: z.string().optional(),
        description: z.string(),
        responsibilities: z.string(),
        requirements: z.string(),
        benefits: z.string().optional(),
        deadline: z.string().optional(),
        slots: z.number().int().positive().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.job.create({
        data: {
          ...input,
          deadline: input.deadline ? new Date(input.deadline) : undefined,
        },
      });
    }),

 list: publicProcedure.query(async ({ ctx }) => {
  const userId = ctx.session?.user?.id;

  const jobs = await ctx.db.job.findMany({
    include: {
      company: true,
      applications: userId
        ? {
            where: {
              userId,
            },
            select: {
              id: true,
              examSubmitted: true,
              terminationReason: true,
            },
          }
        : false,
    },
    orderBy: { createdAt: "desc" },
  });

  return jobs.map((job) => {
    const app = job.applications?.[0];

    return {
      ...job,
      applied: !!app,
      examSubmitted: app?.examSubmitted ?? false,
      terminated: app?.terminationReason === "VIOLATION" && !app?.examSubmitted,
      terminationReason: app?.terminationReason ?? null,
      applicationId: app?.id ?? null,
    };
  });
}),

listByCompany: publicProcedure 
  .input(z.object({ companyId: z.string() }))
  .query(async ({ ctx, input }) => {
    return ctx.db.job.findMany({
      where: {
        companyId: input.companyId,
      },
      include: {
        company: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }),
  
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const job = await ctx.db.job.findUnique({
        where: { id: input.id },
        include: {
          company: true,
        },
      });

      if (!job) throw new Error("Job not found");
      return job;
    }),

  performance: publicProcedure
    .input(
      z.object({
        jobId: z.string(),
        companyId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const job = await ctx.db.job.findFirst({
        where: {
          id: input.jobId,
          companyId: input.companyId,
        },
        include: {
          applications: {
            include: {
              evaluationResult: true,
            },
          },
        },
      });

      if (!job) {
        throw new Error("Job not found or not authorized");
      }

      let applicants = job.applications.length;
      let examSubmitted = job.applications.filter((app) => app.examSubmitted).length;

      const completedEvals = job.applications
        .map((app) => app.evaluationResult)
        .filter(
          (result): result is NonNullable<typeof result> =>
            result !== null && result.status === "COMPLETED",
        );

      let passed = completedEvals.filter((result) => result.passed).length;
      let failed = completedEvals.filter((result) => !result.passed).length;
      let evaluated = passed + failed;

      // Demo fallback: keep real data when available, but prevent empty analytics cards in low-data demos.
      const usingDemoFallback = applicants < 3;
      if (usingDemoFallback) {
        const baseApplicants = Math.max(applicants, 6);
        applicants = baseApplicants;
        examSubmitted = Math.max(examSubmitted, Math.round(baseApplicants * 0.8));
        evaluated = Math.max(evaluated, Math.round(examSubmitted * 0.9));
        passed = Math.max(passed, Math.round(evaluated * 0.45));
        failed = Math.max(evaluated - passed, 0);
      }

      const passRate = evaluated > 0 ? Math.round((passed / evaluated) * 100) : 0;

      // Estimated visibility score from post completeness + response signals.
      let visibilityScore = 30;
      if (job.description.trim().length >= 120) visibilityScore += 15;
      if (job.tags.split(",").map((t) => t.trim()).filter(Boolean).length >= 3) visibilityScore += 10;
      if (job.salary && job.salary.trim().length > 0) visibilityScore += 15;
      if (job.benefits && job.benefits.trim().length > 0) visibilityScore += 10;
      visibilityScore += Math.min(applicants * 2, 20);

      if (visibilityScore > 100) visibilityScore = 100;

      const estimatedViews = 40 + applicants * 6 + Math.round(visibilityScore * 0.8);
      const estimatedViewRange = {
        min: Math.max(estimatedViews - 20, 0),
        max: estimatedViews + 20,
      };

      const submissionRate = applicants > 0 ? Math.round((examSubmitted / applicants) * 100) : 0;

      let healthScore = 40;
      healthScore += Math.min(applicants * 2, 20);
      healthScore += Math.round(passRate * 0.2);
      healthScore += Math.round(submissionRate * 0.2);
      if (job.salary && job.salary.trim().length > 0) healthScore += 10;
      if (job.benefits && job.benefits.trim().length > 0) healthScore += 10;
      if (healthScore > 100) healthScore = 100;

      const healthLevel =
        healthScore >= 80 ? "HIGH" : healthScore >= 60 ? "MEDIUM" : "LOW";

      const insights: string[] = [];
      if (passRate < 40 && evaluated >= 5) {
        insights.push("Low pass rate detected - exam may be too difficult for this role.");
      }
      if (applicants >= 20) {
        insights.push("Good applicant volume - this job post is attracting candidates.");
      } else if (applicants < 8) {
        insights.push("Low applicant volume - consider improving title clarity and benefits.");
      }
      if (!job.salary) {
        insights.push("No salary listed - adding a salary range may increase conversions.");
      }
      if (!job.benefits) {
        insights.push("Benefits are missing - adding 3 to 5 key benefits can improve visibility.");
      }
      if (insights.length === 0) {
        insights.push("Performance looks stable. Continue optimizing description and skills tags.");
      }

      return {
        jobId: job.id,
        jobTitle: job.title,
        usingDemoFallback,
        applicants,
        examSubmitted,
        passed,
        failed,
        evaluated,
        passRate,
        visibilityScore,
        estimatedViews,
        estimatedViewRange,
        healthScore,
        healthLevel,
        insights,
      };
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        location: z.string(),
        role: z.nativeEnum(JobRole),
        type: z.nativeEnum(JobType),
        level: z.nativeEnum(JobLevel),
        tags: z.string(),
        salary: z.string().optional(),
        description: z.string(),
        responsibilities: z.string(),
        requirements: z.string(),
        benefits: z.string().optional(),
        deadline: z.string().optional(),
        slots: z.number().int().positive().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.job.update({
        where: { id },
        data: {
          ...data,
          salary: data.salary ?? null,
          benefits: data.benefits ?? null,
          deadline: data.deadline ? new Date(data.deadline) : null,
          slots: data.slots ?? null,
        },
      });
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
        companyId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.job.deleteMany({
        where: {
          id: input.id,
          companyId: input.companyId,
        },
      });

      if (result.count === 0) {
        throw new Error("Job not found or not authorized");
      }

      return { success: true };
    }),
});