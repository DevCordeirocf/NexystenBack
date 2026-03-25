-- AlterTable
ALTER TABLE "contact_requests" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "name" TEXT,
ADD COLUMN     "phone" TEXT;

-- CreateIndex
CREATE INDEX "contact_requests_userId_idx" ON "contact_requests"("userId");

-- AddForeignKey
ALTER TABLE "contact_requests" ADD CONSTRAINT "contact_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
