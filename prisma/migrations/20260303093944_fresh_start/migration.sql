/*
  Warnings:

  - Added the required column `role` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Application" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "jobId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobile" TEXT,
    "linkedin" TEXT,
    "github" TEXT,
    "portfolio" TEXT,
    "university" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "specialization" TEXT,
    "cgpa" TEXT,
    "awards" TEXT,
    "programmingLanguages" TEXT NOT NULL,
    "frameworks" TEXT,
    "softwareProficiency" TEXT,
    "lockedQuestions" JSONB,
    "examSubmitted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Application_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Application" ("awards", "cgpa", "createdAt", "degree", "email", "examSubmitted", "frameworks", "fullName", "github", "id", "jobId", "linkedin", "lockedQuestions", "mobile", "portfolio", "programmingLanguages", "softwareProficiency", "specialization", "university") SELECT "awards", "cgpa", "createdAt", "degree", "email", "examSubmitted", "frameworks", "fullName", "github", "id", "jobId", "linkedin", "lockedQuestions", "mobile", "portfolio", "programmingLanguages", "softwareProficiency", "specialization", "university" FROM "Application";
DROP TABLE "Application";
ALTER TABLE "new_Application" RENAME TO "Application";
CREATE INDEX "Application_jobId_idx" ON "Application"("jobId");
CREATE TABLE "new_Job" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "salary" TEXT,
    "description" TEXT NOT NULL,
    "responsibilities" TEXT NOT NULL,
    "requirements" TEXT NOT NULL,
    "benefits" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Job" ("benefits", "company", "createdAt", "description", "id", "level", "location", "requirements", "responsibilities", "salary", "tags", "title", "type") SELECT "benefits", "company", "createdAt", "description", "id", "level", "location", "requirements", "responsibilities", "salary", "tags", "title", "type" FROM "Job";
DROP TABLE "Job";
ALTER TABLE "new_Job" RENAME TO "Job";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
