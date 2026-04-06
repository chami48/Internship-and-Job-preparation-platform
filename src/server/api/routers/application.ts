// smart-screening/src/server/api/routers/application.ts

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { Specialization } from "../../../../generated/prisma";

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
        specialization: z.nativeEnum(Specialization).optional(),
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
          specialization: input.specialization ?? Specialization.INFORMATION_TECHNOLOGY,
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

  // ============================
  // NOTIFICATIONS (APPLICATION + EXAM SUBMIT)
  // ============================
  notifications: protectedProcedure.query(async ({ ctx }) => {
    const applications = await ctx.db.application.findMany({
      where: { userId: ctx.session.user.id },
      include: {
        job: { select: { title: true } },
        examAnswers: {
          select: { createdAt: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const items = applications.map((app) => {
      const submittedAt = app.examAnswers[0]?.createdAt ?? app.createdAt;
      const status = app.examSubmitted
        ? "EXAM_SUBMITTED"
        : app.terminationReason
          ? "EXAM_TERMINATED"
          : "APPLIED";

      return {
        id: `apply-${app.id}`,
        status,
        jobId: app.jobId,
        jobTitle: app.job.title,
        createdAt: status === "EXAM_SUBMITTED" ? submittedAt : app.createdAt,
      } as const;
    });

    return items.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }),

});