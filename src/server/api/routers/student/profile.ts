import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

export const profileRouter = createTRPCRouter({

  // --------------------------------------------------
  // Get Logged-in Student Profile
  // --------------------------------------------------
  getProfile: protectedProcedure.query(async ({ ctx }) => {

    const userId = ctx.session.user.id;

    const user = await ctx.db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        studentId: true,
        degree: true,
        year: true,
        specialization: true,
        skills: true,
        github: true,
        linkedin: true,
        portfolio: true,
        bio: true,
        image: true,
      },
    });

    return user;
  }),

  // --------------------------------------------------
  // Update Student Profile
  // --------------------------------------------------
  updateProfile: protectedProcedure
    .input(
      z.object({
        image: z.string().optional(),
        name: z.string().optional(),
        studentId: z.string().optional(),
        degree: z.string().optional(),
        year: z.string().optional(),
        specialization: z.string().optional(),
        skills: z.string().optional(),
        github: z.string().optional(),
        linkedin: z.string().optional(),
        portfolio: z.string().optional(),
        bio: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {

      const userId = ctx.session.user.id;

      const updatedUser = await ctx.db.user.update({
        where: { id: userId },
        data: {
          image: input.image, 
          name: input.name,
          studentId: input.studentId,
          degree: input.degree,
          year: input.year,
          specialization: input.specialization,
          skills: input.skills,
          github: input.github,
          linkedin: input.linkedin,
          portfolio: input.portfolio,
          bio: input.bio,
        },
      });

      return updatedUser;
    }),
});