/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `ApplicantVerification` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ApplicantVerification_email_key" ON "ApplicantVerification"("email");
