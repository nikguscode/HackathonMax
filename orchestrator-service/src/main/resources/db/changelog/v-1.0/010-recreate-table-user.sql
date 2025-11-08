--liquibase formatted sql
--changeset nikguscode:010-recreate-table-user

DROP TABLE IF EXISTS "user";

CREATE TABLE IF NOT EXISTS "user" (
  id_max BIGINT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  second_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL
);

--rollback DROP TABLE IF EXISTS "user";