-- Deploy mylesson:resetMailToken to pg

BEGIN;

ALTER  TABLE "user" ADD COLUMN "reset_email_token" TEXT;

COMMIT;
