-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('MASTER_ADMIN', 'TENANT_ADMIN', 'CUSTOMER');

-- AlterTable
ALTER TABLE "tenant_stores" ADD COLUMN     "themeConfig" JSONB;

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',
    "tenantId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenant_stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;
