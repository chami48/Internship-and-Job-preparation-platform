-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ExamAnswer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questionId" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "answer" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ExamAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ExamAnswer_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ExamAnswer" ("answer", "applicationId", "createdAt", "id", "questionId") SELECT "answer", "applicationId", "createdAt", "id", "questionId" FROM "ExamAnswer";
DROP TABLE "ExamAnswer";
ALTER TABLE "new_ExamAnswer" RENAME TO "ExamAnswer";
CREATE INDEX "ExamAnswer_questionId_idx" ON "ExamAnswer"("questionId");
CREATE INDEX "ExamAnswer_applicationId_idx" ON "ExamAnswer"("applicationId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
