/*
  Warnings:

  - You are about to drop the column `role` on the `ApplicantVerification` table. All the data in the column will be lost.
  - Made the column `specialization` on table `Application` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ApplicantVerification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "studentIdNumber" TEXT NOT NULL,
    "idImageUrl" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ApplicantVerification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ApplicantVerification" ("createdAt", "fullName", "id", "idImageUrl", "studentIdNumber", "userId") SELECT "createdAt", "fullName", "id", "idImageUrl", "studentIdNumber", "userId" FROM "ApplicantVerification";
DROP TABLE "ApplicantVerification";
ALTER TABLE "new_ApplicantVerification" RENAME TO "ApplicantVerification";
CREATE UNIQUE INDEX "ApplicantVerification_userId_key" ON "ApplicantVerification"("userId");
CREATE TABLE "new_Application" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "jobId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobile" TEXT,
    "linkedin" TEXT,
    "github" TEXT,
    "portfolio" TEXT,
    "university" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "cgpa" TEXT,
    "awards" TEXT,
    "programmingLanguages" TEXT NOT NULL,
    "frameworks" TEXT,
    "softwareProficiency" TEXT,
    "lockedQuestions" JSONB,
    "examSubmitted" BOOLEAN NOT NULL DEFAULT false,
    "terminationReason" TEXT,
    CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Application_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Application" ("awards", "cgpa", "createdAt", "degree", "email", "examSubmitted", "frameworks", "fullName", "github", "id", "jobId", "linkedin", "lockedQuestions", "mobile", "portfolio", "programmingLanguages", "role", "softwareProficiency", "specialization", "university", "userId") SELECT "awards", "cgpa", "createdAt", "degree", "email", "examSubmitted", "frameworks", "fullName", "github", "id", "jobId", "linkedin", "lockedQuestions", "mobile", "portfolio", "programmingLanguages", "role", "softwareProficiency", "specialization", "university", "userId" FROM "Application";
DROP TABLE "Application";
ALTER TABLE "new_Application" RENAME TO "Application";
CREATE UNIQUE INDEX "Application_userId_jobId_key" ON "Application"("userId", "jobId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
