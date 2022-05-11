-- Deploy mylesson:addLessonAdminCheck to pg

BEGIN;

ALTER  TABLE "lesson" ADD COLUMN "admin_request" BOOLEAN NOT NULL DEFAULT FALSE;

COMMIT;
