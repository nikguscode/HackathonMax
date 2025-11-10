--liquibase formatted sql
--changeset nikguscode:012-alter-column-max-id

ALTER TABLE public.user_roles RENAME COLUMN id_user TO id_max;
ALTER TABLE public.user_queue RENAME COLUMN id_user TO id_max;
ALTER TABLE public.queue_entry RENAME COLUMN id_user TO id_max;

--rollback
--ALTER TABLE public.user_roles RENAME COLUMN id_max TO id_user;
--ALTER TABLE public.user_queue RENAME COLUMN id_max TO id_user;
--ALTER TABLE public.queue_entry RENAME COLUMN id_max TO id_user;