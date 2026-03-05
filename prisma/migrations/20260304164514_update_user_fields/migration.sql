-- AlterTable
ALTER TABLE "User" ADD COLUMN "year" TEXT;

-- CreateIndex
CREATE INDEX "EmailOTP_email_idx" ON "EmailOTP"("email");
