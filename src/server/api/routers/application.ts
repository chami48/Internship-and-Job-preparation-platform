import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const applicationRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        jobId: z.string(),
        fullName: z.string(),
        email: z.string(),
        mobile: z.string().optional(),
        linkedin: z.string().optional(),
        github: z.string().optional(),
        portfolio: z.string().optional(),
        university: z.string(),
        degree: z.string(),
        specialization: z.string().optional(),
        cgpa: z.string().optional(),
        awards: z.string().optional(),
        programmingLanguages: z.string(),
        frameworks: z.string().optional(),
        softwareProficiency: z.string().optional(),
        projects: z.array(
          z.object({
            name: z.string(),
            details: z.string(),
          })
        ),
        scenarios: z.array(
          z.object({
            questionKey: z.string(),
            answer: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {

      // ✅ 1. Find the job first
      const job = await ctx.db.job.findUnique({
        where: { id: input.jobId },
      });

      if (!job) {
        throw new Error("Job not found");
      }

      // ✅ 2. Create application with role from job
      return ctx.db.application.create({
        data: {
          jobId: input.jobId,
          role: job.role, // ⭐ IMPORTANT FIX

          fullName: input.fullName,
          email: input.email,
          mobile: input.mobile,
          linkedin: input.linkedin,
          github: input.github,
          portfolio: input.portfolio,

          university: input.university,
          degree: input.degree,
          specialization: input.specialization,
          cgpa: input.cgpa,
          awards: input.awards,

          programmingLanguages: input.programmingLanguages,
          frameworks: input.frameworks,
          softwareProficiency: input.softwareProficiency,

          projects: {
            create: input.projects,
          },
          scenarios: {
            create: input.scenarios,
          },
        },
      });
    }),
});