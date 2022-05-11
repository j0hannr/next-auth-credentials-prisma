-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "telefon" TEXT,
    "newsletter" BOOLEAN DEFAULT false,
    "newsletterProperty" BOOLEAN DEFAULT false,
    "welcomeStatus" BOOLEAN DEFAULT false,
    "agbAccepted" TIMESTAMP(3),
    "personalCode" TEXT,
    "public" BOOLEAN NOT NULL DEFAULT false,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "isAdmin" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "password" TEXT,
    "street" TEXT,
    "streetNumber" TEXT,
    "city" TEXT,
    "postcode" TEXT,
    "region" TEXT,
    "country" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
