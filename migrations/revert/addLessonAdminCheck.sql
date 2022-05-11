-- Revert mylesson:addLessonAdminCheck from pg

BEGIN;

ALTER  TABLE "lesson" DROP COLUMN "admin_request" ;

COMMIT;
