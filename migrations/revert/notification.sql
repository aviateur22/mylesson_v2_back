-- Revert mylesson:notification from pg

BEGIN;

DROP TABLE "user_has_notification", "notification";

COMMIT;
