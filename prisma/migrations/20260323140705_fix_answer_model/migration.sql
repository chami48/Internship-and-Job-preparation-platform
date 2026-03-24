/*
  Warnings:

  - You are about to drop the column `answer` on the `PrepQuizAnswer` table. All the data in the column will be lost.
  - Added the required column `selectedKey` to the `PrepQuizAnswer` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PrepQuizAnswer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "attemptId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "selectedKey" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    CONSTRAINT "PrepQuizAnswer_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "PrepQuizAttempt" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PrepQuizAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "PrepQuizQuestion" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PrepQuizAnswer" ("attemptId", "id", "isCorrect", "questionId") SELECT "attemptId", "id", "isCorrect", "questionId" FROM "PrepQuizAnswer";
DROP TABLE "PrepQuizAnswer";
ALTER TABLE "new_PrepQuizAnswer" RENAME TO "PrepQuizAnswer";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
