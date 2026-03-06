-- CreateTable
CREATE TABLE "ApplicantVerification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "studentIdNumber" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "idImageUrl" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
