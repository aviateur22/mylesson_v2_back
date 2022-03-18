-- Revert mylesson:initdb from pg

BEGIN;

DROP TABLE "lesson_has_tag", "lesson", "user", "tag", "image", "role";

COMMIT;
