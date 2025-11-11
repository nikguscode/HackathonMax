--liquibase formatted sql
--changeset nikguscode:015-recreate-table-queue-staff

DROP TABLE IF EXISTS queue_staff;

CREATE TABLE IF NOT EXISTS queue_staff (
    id UUID PRIMARY KEY,
    id_queue UUID NOT NULL,
    id_max BIGINT NOT NULL
);