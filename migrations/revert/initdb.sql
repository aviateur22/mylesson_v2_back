-- Revert mylesson:initdb from pg

BEGIN;

DROP TABLE "lesson_has_tag", "user_has_link", "link", "lesson", "user", "tag", "image", "role";

COMMIT;
