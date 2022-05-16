-- Revert mylesson:resetMailToken from pg

BEGIN;

ALTER TABLE "user" DROP COLUMN "reset_email_token";

COMMIT;
