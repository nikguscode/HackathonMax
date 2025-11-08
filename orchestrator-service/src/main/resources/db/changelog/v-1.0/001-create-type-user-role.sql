--liquibase formatted sql
--changeset nikguscode:001-create-type-user-role splitStatements:false stripComments:false

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('CLIENT', 'EMPLOYEE', 'MODERATOR', 'ADMIN');
    END IF;
END
$$;

--rollback DROP TYPE IF EXISTS user_role;
