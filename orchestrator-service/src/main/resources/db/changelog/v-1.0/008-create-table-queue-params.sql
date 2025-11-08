--liquibase formatted sql
--changeset nikguscode:008-create-table-queue-params

CREATE TABLE IF NOT EXISTS queue_params (
  id UUID PRIMARY KEY,
  id_queue UUID NOT NULL,
  arrival_grace_period INT NOT NULL,
  max_queue_size INT NOT NULL,
  is_active BOOLEAN NOT NULL
);

--rollback DROP TABLE IF EXISTS queue_params;