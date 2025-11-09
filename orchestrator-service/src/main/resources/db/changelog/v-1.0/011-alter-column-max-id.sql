--liquibase formatted sql
--changeset nikguscode:011-alter-column-max-id

ALTER TABLE IF EXISTS public.user_roles DROP COLUMN IF EXISTS id_user;
ALTER TABLE IF EXISTS public.user_roles ADD COLUMN id_user BIGINT;

ALTER TABLE IF EXISTS public.user_queue DROP COLUMN IF EXISTS id_user;
ALTER TABLE IF EXISTS public.user_queue ADD COLUMN id_user BIGINT;

ALTER TABLE IF EXISTS public.queue_entry DROP COLUMN IF EXISTS id_user;
ALTER TABLE IF EXISTS public.queue_entry ADD COLUMN id_user BIGINT;

--rollback
-- ALTER TABLE IF EXISTS public.user_roles DROP COLUMN IF EXISTS id_user;
-- ALTER TABLE IF EXISTS public.user_roles ADD COLUMN id_user UUID;
--
-- ALTER TABLE IF EXISTS public.user_queue DROP COLUMN IF EXISTS id_user;
-- ALTER TABLE IF EXISTS public.user_queue ADD COLUMN id_user UUID;
--
-- ALTER TABLE IF EXISTS public.queue_entry DROP COLUMN IF EXISTS id_user;
-- ALTER TABLE IF EXISTS public.queue_entry ADD COLUMN id_user UUID;