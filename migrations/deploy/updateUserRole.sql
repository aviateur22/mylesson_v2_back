-- Deploy mylesson:updateUserRole to pg

BEGIN;

ALTER TABLE "user" DROP COLUMN "token";
ALTER  TABLE "user" ADD COLUMN "request_upgrade_role" BOOLEAN NOT NULL DEFAULT FALSE;
COMMIT;
