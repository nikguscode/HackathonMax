--liquibase formatted sql
--changeset nikguscode:006-create-table-queue

CREATE TABLE IF NOT EXISTS queue (
  id UUID PRIMARY KEY,
  id_organization UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL
);

--rollback DROP TABLE IF EXISTS queue;