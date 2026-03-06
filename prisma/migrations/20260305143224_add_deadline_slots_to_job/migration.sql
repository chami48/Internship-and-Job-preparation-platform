/*
  Warnings:

  - Added the required column `password` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Job" ADD COLUMN "deadline" DATETIME;
ALTER TABLE "Job" ADD COLUMN "slots" INTEGER;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Company" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "otp" TEXT,
    "otpExpiry" DATETIME
);
INSERT INTO "new_Company" ("createdAt", "description", "email", "id", "isVerified", "name", "otp", "otpExpiry", "updatedAt") SELECT "createdAt", "description", "email", "id", "isVerified", "name", "otp", "otpExpiry", "updatedAt" FROM "Company";
DROP TABLE "Company";
ALTER TABLE "new_Company" RENAME TO "Company";
CREATE UNIQUE INDEX "Company_email_key" ON "Company"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
