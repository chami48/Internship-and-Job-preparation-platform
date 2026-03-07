/*
  Warnings:

  - A unique constraint covering the columns `[userId,jobId]` on the table `Application` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Application_userId_idx";

-- DropIndex
DROP INDEX "Application_jobId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Application_userId_jobId_key" ON "Application"("userId", "jobId");
