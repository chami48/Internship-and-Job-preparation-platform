//smart-screening\src\server\api\routers\job.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const jobRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.job.findMany({
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
});