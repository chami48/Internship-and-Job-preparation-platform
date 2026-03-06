import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

export const companyRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiry = new Date(Date.now() + 5 * 60 * 1000);
      const hashedPassword = await bcrypt.hash(input.password, 10);
      
      await ctx.db.company.create({
        data: {
          name: input.name,
          email: input.email,
          password: hashedPassword,
          description: input.description,
          otp,
          otpExpiry: expiry,
          isVerified: false,
        },
      });

      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error("Email credentials missing in .env");
      }

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: input.email,
        subject: "Company Verification OTP",
        text: `Your OTP is: ${otp}`,
      });

      return { message: "Company registered. OTP sent to email." };
    }),

  verifyOtp: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        otp: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const company = await ctx.db.company.findUnique({
        where: { email: input.email },
      });

      if (!company) {
        throw new Error("Company not found");
      }

      if (company.otpExpiry && new Date() > company.otpExpiry) {
        throw new Error("OTP expired");
      }

      if (company.otp !== input.otp) {
        throw new Error("Invalid OTP");
      }

      await ctx.db.company.update({
        where: { email: input.email },
        data: {
          isVerified: true,
          otp: null,
          otpExpiry: null,
        },
      });

      return { message: "Company verified successfully" };
    }),

    login: publicProcedure
  .input(
    z.object({
      email: z.string().email(),
      password: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const company = await ctx.db.company.findUnique({
      where: { email: input.email },
    });

    if (!company) {
      throw new Error("Company not found");
    }

    if (!company.isVerified) {
      throw new Error("Email not verified");
    }

    const valid = await bcrypt.compare(input.password, company.password);

    if (!valid) {
      throw new Error("Invalid password");
    }

    return { message: "Login successful", companyId: company.id };
  }),

  getProfile: publicProcedure
    .input(z.object({ companyId: z.string() }))
    .query(async ({ ctx, input }) => {
      const company = await ctx.db.company.findUnique({
        where: { id: input.companyId },
        include: { _count: { select: { jobs: true } } },
      });
      if (!company) throw new Error("Company not found");
      return company;
    }),

  updateProfile: publicProcedure
    .input(z.object({
      companyId: z.string(),
      name: z.string().min(1),
      description: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.company.update({
        where: { id: input.companyId },
        data: { name: input.name, description: input.description ?? null },
      });
    }),
});
