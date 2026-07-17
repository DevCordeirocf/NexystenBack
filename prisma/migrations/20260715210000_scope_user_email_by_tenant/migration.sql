
DROP INDEX IF EXISTS "users_email_key";

CREATE UNIQUE INDEX "users_tenantId_email_key" ON "users"("tenantId", "email");

CREATE UNIQUE INDEX "users_master_email_key" ON "users"("email") WHERE "tenantId" IS NULL;
