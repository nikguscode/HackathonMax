--liquibase formatted sql
--changeset nikguscode:023-alter-column-table-user-roles

ALTER TABLE IF EXISTS queue_staff
ADD CONSTRAINT uq_queue_staff_user UNIQUE (id_max, id_queue);