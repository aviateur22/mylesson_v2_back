-- Deploy mylesson:index to pg

BEGIN;

CREATE INDEX "user_index" ON "user" ("email", "login");

CREATE INDEX "lesson_index" ON "lesson" ("title", "slug");

COMMIT;
