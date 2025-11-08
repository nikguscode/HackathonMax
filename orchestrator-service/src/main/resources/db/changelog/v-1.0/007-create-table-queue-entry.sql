--liquibase formatted sql
--changeset nikguscode:007-create-table-queue-entry

CREATE TABLE IF NOT EXISTS queue_entry (
  id UUID PRIMARY KEY,
  id_queue UUID NOT NULL,
  id_user UUID NOT NULL,
  status queue_status NOT NULL
);

--rollback DROP TABLE IF EXISTS queue_entry;