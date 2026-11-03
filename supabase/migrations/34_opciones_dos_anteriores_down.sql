-- Deshace 34_opciones_dos_anteriores.sql: devuelve `opciones` al valor registrado antes del cambio.
UPDATE public.questions q
   SET opciones = c.valor_anterior::jsonb
  FROM public.qa_changes_20260923 c
 WHERE c.motivo = '34_dos_anteriores' AND c.campo = 'opciones' AND c.question_id = q.id;
