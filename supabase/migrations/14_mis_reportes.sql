-- 14: el alumno puede ver el estado de sus propios reportes (nada se pierde en silencio).
CREATE OR REPLACE FUNCTION public.get_my_reports()
RETURNS TABLE(id bigint, question_id bigint, enunciado text, categoria text, nota text,
              estado text, resolucion text, created_at timestamptz, revisado_at timestamptz)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501'; END IF;
  RETURN QUERY
    SELECT r.id, r.question_id, q.enunciado, r.categoria, r.nota,
           coalesce(r.estado, 'pendiente'), r.resolucion, r.created_at, r.revisado_at
      FROM question_reports r JOIN questions q ON q.id = r.question_id
     WHERE r.user_id = auth.uid()
     ORDER BY r.created_at DESC
     LIMIT 200;
END $$;
REVOKE ALL ON FUNCTION public.get_my_reports() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_my_reports() TO authenticated;
