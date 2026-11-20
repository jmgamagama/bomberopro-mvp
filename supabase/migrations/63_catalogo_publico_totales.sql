-- 63: totales públicos del catálogo (solo dos números, sin contenido) para el titular de la bienvenida.
-- Cuenta preguntas publicadas y temas distintos de la convocatoria 1 (CPEI Badajoz). SECURITY DEFINER: anon no lee `questions`.
-- Deshacer: 63_catalogo_publico_totales_down.sql
CREATE OR REPLACE FUNCTION public.get_catalogo_publico()
RETURNS TABLE (preguntas integer, temas integer)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT count(*)::int, count(DISTINCT t.numero)::int
  FROM questions q JOIN topics t ON t.id = q.topic_id
  WHERE q.estado = 'publicada' AND t.convocatoria_id = 1;
$$;
REVOKE ALL ON FUNCTION public.get_catalogo_publico() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_catalogo_publico() TO anon, authenticated;
