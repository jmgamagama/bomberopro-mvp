-- 21_private_supuestos_down.sql
-- Deshace 21: borra la tabla de supuestos privados con sus filas, su política y su índice.
-- OJO: elimina el contenido cargado; el original sigue fuera del repo (JSON local del propietario).

DROP TABLE IF EXISTS public.private_supuestos;
