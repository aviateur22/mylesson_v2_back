-- Revert mylesson:updateUserRole from pg

BEGIN;

ALTER TABLE "user" DROP COLUMN "request_upgrade_role";
ALTER  TABLE "user" ADD COLUMN "token" TEXT;

COMMIT;
