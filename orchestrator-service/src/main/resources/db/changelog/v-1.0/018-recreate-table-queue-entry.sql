--liquibase formatted sql
--changeset nikguscode:018-recreate-table-queue-entry

DROP TABLE IF EXISTS queue_entry;

CREATE TABLE IF NOT EXISTS queue_entry (
  id UUID PRIMARY KEY,
  id_queue UUID NOT NULL,
  id_max BIGINT NOT NULL,
  status queue_entry_status NOT NULL
);

-- rollback DROP TABLE IF EXISTS queue_entry;