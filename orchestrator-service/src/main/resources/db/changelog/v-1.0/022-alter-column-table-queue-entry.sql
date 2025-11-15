--liquibase formatted sql
--changeset nikguscode:022-alter-column-table-queue-entry

ALTER TABLE queue_entry
DROP CONSTRAINT uq_queue_user;