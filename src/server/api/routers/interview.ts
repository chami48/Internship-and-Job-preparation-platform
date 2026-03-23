import nodemailer from "nodemailer";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const interviewRouter = createTRPCRouter({
  schedule: publicProcedure
    .input(
      z.object({
        jobId: z.string(),
        jobTitle: z.string(),
        candidateId: z.string(),
        candidateName: z.string(),
        candidateEmail: z.string().email(),
        date: z.string(),
        time: z.string(),
        mode: z.enum(["Remote", "Onsite"]),
        link: z.string(),
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
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

      const subject = `Interview for ${input.jobTitle}`;
      const html = `
        <h2>Interview Scheduled</h2>
        <p>Hi ${input.candidateName},</p>
        <p>You have been invited to interview for <strong>${input.jobTitle}</strong>.</p>
        <ul>
          <li><strong>Date:</strong> ${input.date}</li>
          <li><strong>Time:</strong> ${input.time}</li>
          <li><strong>Mode:</strong> ${input.mode}</li>
          <li><strong>Link / Location:</strong> ${input.link}</li>
        </ul>
        ${input.notes ? `<p><strong>Notes:</strong> ${input.notes}</p>` : ""}
        <p>Please reply to confirm or reschedule.</p>
      `;

      await transporter.sendMail({
        from: `HireSmart <${process.env.EMAIL_USER}>`,
        //to: input.candidateEmail,
        to: "nilumidakshika5@gmail.com", // For testing purposes
        subject,
        html,
      });

      return { success: true };
    }),
});
