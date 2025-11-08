--liquibase formatted sql
--changeset nikguscode:000-create-table-user

CREATE TABLE IF NOT EXISTS "user" (
  id_max UUID PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  second_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL
);

--rollback DROP TABLE IF EXISTS "user";