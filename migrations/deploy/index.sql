-- Deploy mylesson:index to pg

BEGIN;

CREATE INDEX "login_index" ON "user" USING hash ("login");

CREATE INDEX "email_index" ON "user" USING hash ("email");

CREATE INDEX "title_index" ON "lesson" USING hash ("title");

CREATE INDEX "slug_index" ON "lesson" USING hash ("slug");

COMMIT;
