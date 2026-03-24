-- CreateTable
CREATE TABLE "EvaluationResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "applicationId" TEXT NOT NULL,
    "totalScore" REAL NOT NULL,
    "maxScore" REAL NOT NULL,
    "percentage" REAL NOT NULL,
    "cutoff" REAL NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "aiFeedback" TEXT NOT NULL,
    "cvUploadGranted" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "evaluatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EvaluationResult_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "QuestionEvaluation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "evaluationResultId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "studentAnswer" TEXT,
    "expectedAnswer" TEXT,
    "scoreAwarded" REAL NOT NULL,
    "maxMarks" REAL NOT NULL,
    "aiFeedback" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "QuestionEvaluation_evaluationResultId_fkey" FOREIGN KEY ("evaluationResultId") REFERENCES "EvaluationResult" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "QuestionEvaluation_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Job" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
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
    "deadline" DATETIME,
    "slots" INTEGER,
    "cutoff" REAL NOT NULL DEFAULT 60,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Job_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Job" ("benefits", "companyId", "createdAt", "deadline", "description", "id", "level", "location", "requirements", "responsibilities", "role", "salary", "slots", "tags", "title", "type") SELECT "benefits", "companyId", "createdAt", "deadline", "description", "id", "level", "location", "requirements", "responsibilities", "role", "salary", "slots", "tags", "title", "type" FROM "Job";
DROP TABLE "Job";
ALTER TABLE "new_Job" RENAME TO "Job";
CREATE TABLE "new_Question" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "role" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "explanation" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "correctKey" TEXT,
    "rubric" TEXT,
    "maxMarks" REAL NOT NULL DEFAULT 10
);
INSERT INTO "new_Question" ("correctKey", "createdAt", "difficulty", "explanation", "id", "prompt", "role", "rubric", "topic", "type") SELECT "correctKey", "createdAt", "difficulty", "explanation", "id", "prompt", "role", "rubric", "topic", "type" FROM "Question";
DROP TABLE "Question";
ALTER TABLE "new_Question" RENAME TO "Question";
CREATE INDEX "Question_role_difficulty_topic_idx" ON "Question"("role", "difficulty", "topic");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "EvaluationResult_applicationId_key" ON "EvaluationResult"("applicationId");

-- CreateIndex
CREATE INDEX "EvaluationResult_applicationId_idx" ON "EvaluationResult"("applicationId");

-- CreateIndex
CREATE INDEX "QuestionEvaluation_evaluationResultId_idx" ON "QuestionEvaluation"("evaluationResultId");

-- CreateIndex
CREATE INDEX "QuestionEvaluation_applicationId_idx" ON "QuestionEvaluation"("applicationId");
