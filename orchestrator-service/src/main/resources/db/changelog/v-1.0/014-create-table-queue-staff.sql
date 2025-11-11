--liquibase formatted sql
--changeset nikguscode:014-create-table-queue-staff

CREATE TABLE IF NOT EXISTS queue_staff (
    id UUID PRIMARY KEY,
    id_queue UUID NOT NULL,
    id_max UUID NOT NULL
);

--rollback
--DROP TABLE IF EXISTS queue_staff;