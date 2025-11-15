--liquibase formatted sql
--changeset nikguscode:020-alter-columns-table-queue-entry

ALTER TABLE queue_entry
ADD CONSTRAINT uq_queue_user UNIQUE (id_queue, id_max);

--rollback