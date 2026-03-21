-- Add missing column used by job listing and exam-termination flow
ALTER TABLE "Application" ADD COLUMN "terminationReason" TEXT;
