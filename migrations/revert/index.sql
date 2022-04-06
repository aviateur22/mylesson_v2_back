-- Revert mylesson:index from pg

BEGIN;

 DROP INDEX "lesson_index";

 DROP INDEX "user_index";

COMMIT;
