-- Revert mylesson:index from pg

BEGIN;

 DROP INDEX "title_index";

 DROP INDEX "slug_sindex";

 DROP INDEX "email_index";

 DROP INDEX "login_index";

COMMIT;
