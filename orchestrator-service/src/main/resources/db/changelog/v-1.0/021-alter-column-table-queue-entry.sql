--liquibase formatted sql
--changeset nikguscode:021-alter-column-table-queue-entry

CREATE UNIQUE INDEX uq_queue_user_active_status
ON queue_entry (id_queue, id_max)
WHERE status IN ('WAITING', 'SERVING', 'CALLED');

--rollback DROP INDEX uq_queue_user_active_status;