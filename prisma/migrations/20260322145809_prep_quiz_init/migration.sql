-- CreateTable
CREATE TABLE "PrepQuizQuestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "role" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "explanation" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PrepQuizOption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questionId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    CONSTRAINT "PrepQuizOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "PrepQuizQuestion" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PrepQuizAttempt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PrepQuizAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PrepQuizAnswer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "attemptId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    CONSTRAINT "PrepQuizAnswer_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "PrepQuizAttempt" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PrepQuizAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "PrepQuizQuestion" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "PrepQuizOption_questionId_key_key" ON "PrepQuizOption"("questionId", "key");
