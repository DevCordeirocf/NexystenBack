/*
  Warnings:

  - You are about to drop the column `stock` on the `products` table. All the data in the column will be lost.
  - You are about to drop the `orders` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `description` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_tenantId_fkey";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "stock",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "specifications" JSONB;

-- DropTable
DROP TABLE "orders";

-- CreateTable
CREATE TABLE "contact_requests" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "contact_requests_tenantId_idx" ON "contact_requests"("tenantId");

-- CreateIndex
CREATE INDEX "contact_requests_productId_idx" ON "contact_requests"("productId");

-- AddForeignKey
ALTER TABLE "contact_requests" ADD CONSTRAINT "contact_requests_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenant_stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_requests" ADD CONSTRAINT "contact_requests_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
