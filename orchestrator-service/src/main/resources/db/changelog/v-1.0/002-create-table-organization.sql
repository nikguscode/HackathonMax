--liquibase formatted sql
--changeset nikguscode:002-create-table-organization

CREATE TABLE IF NOT EXISTS organization (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  address TEXT NOT NULL,
  is_banned BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ NOT NULL
);

--rollback DROP TABLE IF EXISTS organization;