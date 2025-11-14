--liquibase formatted sql
--changeset nikguscode:016-recreate-type-queue-entry-status

DROP TYPE IF EXISTS queue_status CASCADE;

CREATE TYPE queue_entry_status AS ENUM (
    'WAITING',
    'SERVING',
    'SERVED',
    'CANCELED',
    'CALLED',
    'MISSED'
);