// smart-screening/src/server/api/routers/application.ts

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const applicationRouter = createTRPCRouter({

  // ============================
  // CREATE APPLICATION
  // ============================

  create: protectedProcedure
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

      const userId = ctx.session.user.id;

      // Check user role
      const user = await ctx.db.user.findUnique({
        where: { id: userId },
      });

      if (!user || user.role !== "STUDENT") {
        throw new Error("Only students can apply.");
      }

      // Find job
      const job = await ctx.db.job.findUnique({
        where: { id: input.jobId },
      });

      if (!job) {
        throw new Error("Job not found");
      }

      // Create application
      return ctx.db.application.create({
        data: {
          userId: userId,
          jobId: input.jobId,
          role: job.role,

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


  // ============================
  // TERMINATE APPLICATION (FACE MISMATCH / CHEATING)
  // ============================

  terminate: protectedProcedure
    .input(
      z.object({
        applicationId: z.string(),
        reason: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {

      return ctx.db.application.update({
        where: { id: input.applicationId },
        data: {
          terminationReason: input.reason,
          examSubmitted: false,
        },
      });

    }),

});