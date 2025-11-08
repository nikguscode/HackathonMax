--liquibase formatted sql
--changeset nikguscode:003-create-table-user-roles

CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY,
  id_user UUID NOT NULL,
  id_organization UUID NOT NULL,
  role user_role NOT NULL
);

--rollback DROP TABLE IF EXISTS user_roles;