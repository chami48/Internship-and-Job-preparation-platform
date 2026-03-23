//smart-screening\src\server\api\routers\job.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";
import { JobRole, JobType, JobLevel } from "../../../../generated/prisma";

export const jobRouter = createTRPCRouter({
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
      terminated: app?.terminationReason === "VIOLATION",
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
});