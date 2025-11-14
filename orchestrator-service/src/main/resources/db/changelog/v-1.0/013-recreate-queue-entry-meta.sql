--liquibase formatted sql
--changeset nikguscode:013-recreate-queue-entry-meta

DROP TABLE IF EXISTS queue_entry_meta;

CREATE TABLE IF NOT EXISTS queue_entry_meta (
    id UUID PRIMARY KEY,
    id_queue_entry UUID NOT NULL,
    joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
    called_at TIMESTAMP NULL,
    arrived_at TIMESTAMP NULL,
    missed_at TIMESTAMP NULL,
    started_at TIMESTAMP NULL,
    finished_at TIMESTAMP NULL,
    time_limit TIMESTAMP NULL
);

--rollback
--DROP TABLE IF EXISTS queue_entry_meta;
--
--CREATE TABLE IF NOT EXISTS queue_entry_meta (
--    id UUID PRIMARY KEY,
--    id_queue_entry UUID NOT NULL,
--    joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
--    called_at TIMESTAMP NOT NULL,
--    arrived_at TIMESTAMP NOT NULL,
--    missed_at TIMESTAMP NOT NULL,
--    started_at TIMESTAMP NOT NULL,
--    finished_at TIMESTAMP NOT NULL,
--    time_limit TIMESTAMP NOT NULL
--);