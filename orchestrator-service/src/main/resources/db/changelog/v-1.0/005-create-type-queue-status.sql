--liquibase formatted sql
--changeset nikguscode:005-create-type-queue-status splitStatements:false stripComments:false

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'queue_status') THEN
        CREATE TYPE queue_status AS ENUM ('WAITING', 'SERVING', 'SERVED', 'CANCELED', 'MISSED');
    END IF;
END
$$;

--rollback DROP TYPE IF EXISTS queue_status;