-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Application" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "jobId" TEXT NOT NULL,
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
INSERT INTO "new_Application" ("awards", "cgpa", "createdAt", "degree", "email", "frameworks", "fullName", "github", "id", "jobId", "linkedin", "lockedQuestions", "mobile", "portfolio", "programmingLanguages", "softwareProficiency", "specialization", "university") SELECT "awards", "cgpa", "createdAt", "degree", "email", "frameworks", "fullName", "github", "id", "jobId", "linkedin", "lockedQuestions", "mobile", "portfolio", "programmingLanguages", "softwareProficiency", "specialization", "university" FROM "Application";
DROP TABLE "Application";
ALTER TABLE "new_Application" RENAME TO "Application";
CREATE INDEX "Application_jobId_idx" ON "Application"("jobId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
