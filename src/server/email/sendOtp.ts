import nodemailer from "nodemailer";
import { db } from "~/server/db";

export async function sendOTP(email: string) {

  // Generate 6 digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // OTP expires in 5 minutes
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  // Save OTP in database
  await db.emailOTP.create({
    data: {
      email,
      otp,
      expiresAt,
    },
  });

  // Create mail transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Send OTP email
  await transporter.sendMail({
    from: `"HireSmart Platform" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "HireSmart Email Verification OTP",
    html: `
      <h2>HireSmart Email Verification</h2>
      <p>Your OTP code is:</p>
      <h1>${otp}</h1>
      <p>This OTP will expire in 5 minutes.</p>
    `,
  });

  return otp;
}