--liquibase formatted sql
--changeset nikguscode:004-create-table-user-queue

CREATE TABLE IF NOT EXISTS user_queue (
  id UUID PRIMARY KEY,
  id_user UUID NOT NULL,
  id_queue UUID NOT NULL
);

--rollback DROP TABLE IF EXISTS user_queue;