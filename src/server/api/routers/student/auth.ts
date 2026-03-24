//smart-screening\src\server\api\routers\student\auth.ts
import bcrypt from "bcrypt";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { sendOTP } from "~/server/email/sendOtp";

export const studentAuthRouter = createTRPCRouter({
  sendOtp: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (existingUser) {
        throw new Error("An account with this email already exists");
      }

      await sendOTP(input.email);

      return { success: true, message: "OTP sent successfully" };
    }),

  requestPasswordReset: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (!existingUser) {
        throw new Error("No student account found for this email");
      }

      await sendOTP(input.email);

      return { success: true, message: "OTP sent successfully" };
    }),

  register: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        studentId: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(6),
        degree: z.string().optional(),
        year: z.string().optional(),
        otp: z.string().length(6).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (existingUser) {
        throw new Error("An account with this email already exists");
      }

      if (input.otp) {
        const latestOtp = await ctx.db.emailOTP.findFirst({
          where: { email: input.email },
          orderBy: { createdAt: "desc" },
        });

        const isOtpInvalid =
          !latestOtp ||
          latestOtp.otp !== input.otp ||
          latestOtp.expiresAt < new Date();

        if (isOtpInvalid) {
          throw new Error("Invalid or expired OTP");
        }
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);

      const user = await ctx.db.user.create({
        data: {
          name: input.name,
          email: input.email,
          studentId: input.studentId,
          degree: input.degree,
          specialization: input.year,
          password: hashedPassword,
          role: "STUDENT",
        },
      });

      return { success: true, userId: user.id };
    }),

  resetPassword: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        otp: z.string().length(6),
        newPassword: z.string().min(6),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (!user) {
        throw new Error("No student account found for this email");
      }

      const latestOtp = await ctx.db.emailOTP.findFirst({
        where: { email: input.email },
        orderBy: { createdAt: "desc" },
      });

      const isOtpInvalid =
        !latestOtp ||
        latestOtp.otp !== input.otp ||
        latestOtp.expiresAt < new Date();

      if (isOtpInvalid) {
        throw new Error("Invalid or expired OTP");
      }

      const hashedPassword = await bcrypt.hash(input.newPassword, 10);

      await ctx.db.user.update({
        where: { email: input.email },
        data: { password: hashedPassword },
      });

      return { success: true, message: "Password updated" };
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {

      const user = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      // Check if user exists
      if (!user) {
        throw new Error("User not found");
      }

      // Ensure user is a student
      if (user.role !== "STUDENT") {
        throw new Error("Unauthorized user role");
      }

      // Check password exists
      if (!user.password) {
        throw new Error("Password not set for this user");
      }

      // Compare passwords
      const passwordValid = await bcrypt.compare(
        input.password,
        user.password
      );

      if (!passwordValid) {
        throw new Error("Invalid password");
      }

      return {
        success: true,
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
    }),
});