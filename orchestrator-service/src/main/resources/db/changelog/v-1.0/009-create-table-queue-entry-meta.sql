--liquibase formatted sql
--changeset nikguscode:009-create-table-queue-entry-meta

CREATE TABLE IF NOT EXISTS queue_entry_meta (
  id UUID PRIMARY KEY,
  id_queue_entry UUID NOT NULL,
  joined_at TIMESTAMPTZ NOT NULL,
  called_at TIMESTAMPTZ NOT NULL,
  arrived_at TIMESTAMPTZ NOT NULL,
  missed_at TIMESTAMPTZ NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  finished_at TIMESTAMPTZ NOT NULL,
  time_limit TIMESTAMPTZ NOT NULL
);

--rollback DROP TABLE IF EXISTS queue_entry_meta;