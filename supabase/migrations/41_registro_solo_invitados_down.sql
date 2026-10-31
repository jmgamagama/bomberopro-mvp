-- Deshace la 41: el registro vuelve a estar abierto. Conserva las tablas por si se reactiva; para
-- borrarlas del todo, quita el comentario de los DROP TABLE.
DROP TRIGGER IF EXISTS a_exigir_invitacion_piloto ON auth.users;
DROP FUNCTION IF EXISTS public.exigir_invitacion_piloto();
-- DROP TABLE IF EXISTS public.piloto_invitados, public.piloto_config;
