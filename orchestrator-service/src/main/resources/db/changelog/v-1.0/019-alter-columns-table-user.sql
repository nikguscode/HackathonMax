--liquibase formatted sql
--changeset nikguscode:019-alter-columns-table-user

ALTER TABLE IF EXISTS "user"
  ALTER COLUMN username DROP NOT NULL,
  ALTER COLUMN second_name DROP NOT NULL,
  ALTER COLUMN created_at DROP NOT NULL;

--rollback
--ALTER TABLE "user"
--ALTER COLUMN username SET NOT NULL,
--ALTER COLUMN second_name SET NOT NULL,
--ALTER COLUMN created_at SET NOT NULL;