-- #278 / PR #306 · SQL que acompaña a `e2e/aceptacion-staging-278.cjs` (aceptación con cliente real).
-- SOLO staging (fxhvgvehhekqeqpkxtrm) y solo sobre tandas de cuentas ficticias de prueba. Nunca en producción.
--
-- El guion imprime estas dos sentencias ya rellenadas con el identificador de la tanda que ESA ejecución acaba de
-- recibir. Aquí quedan versionadas para poder revisarlas antes de ejecutar nada. Sustituir :sid y :original.
--
-- Por qué se confirma la escritura (y no se usa ROLLBACK): la caducidad tiene que verla el navegador, que es otra
-- conexión. Una transacción sin confirmar no sería visible, así que se deshace con un UPDATE compensatorio.

-- 0) LECTURA PREVIA, sin escribir nada. Debe devolver filas = 1. El guion guarda el valor en su checkpoint
--    local (junto con el SQL de restauración ya rellenado) ANTES de imprimir la mutación.
select count(*) as filas, min(s.expires_at) as expires_at_original
  from private.question_delivery_sessions s
  join auth.users u on u.id = s.user_id
 where s.id = :'sid'
   and u.email like '%@bomberopro-test.invalid'
   and s.mode = 'study'
   and s.expires_at > now();

-- 1) CADUCAR esa tanda, solo si sigue exactamente como se leyó. Debe devolver filas = 1.
with cambio as (
  update private.question_delivery_sessions s
     set expires_at = now() - interval '1 second'
    from auth.users u
   where u.id = s.user_id
     and s.id = :'sid'
     and u.email like '%@bomberopro-test.invalid'
     and s.mode = 'study'
     and s.expires_at = :'original'::timestamptz
  returning s.id
)
select count(*) as filas from cambio;

-- 2) RESTAURAR. Idempotente: vale se haya aplicado o no el paso 1. Debe devolver filas 0 o 1 y restaurada = t.
--    `restaurada` describe la fila tal como queda (si no hubo que cambiar nada, se lee de la tabla).
with cambio as (
  update private.question_delivery_sessions
     set expires_at = :'original'::timestamptz
   where id = :'sid'
     and expires_at <> :'original'::timestamptz
  returning expires_at
)
select (select count(*) from cambio) as filas,
       coalesce((select bool_and(expires_at = :'original'::timestamptz) from cambio),
                (select expires_at = :'original'::timestamptz
                   from private.question_delivery_sessions where id = :'sid')) as restaurada;

-- 3) Comprobación posterior: ninguna tanda de las cuentas de prueba queda caducada por este arnés.
select count(*) as tandas_de_prueba_caducadas
  from private.question_delivery_sessions s
  join auth.users u on u.id = s.user_id
 where u.email like '%@bomberopro-test.invalid' and s.expires_at <= now();

-- 4) Registros ficticios que crea la ejecución (tandas, recibos, intentos y sesión de estudio). NO se borran por
--    cuenta completa. Se quedan como datos de prueba o, con el «sí» escrito de JM, se borran por los
--    identificadores exactos del manifiesto local que escribe el guion. Plantilla, comentada a propósito:
-- delete from private.question_delivery_receipts where session_id in ('<id-1>', '<id-2>');
-- delete from private.question_delivery_sessions where id in ('<id-1>', '<id-2>')
--   and user_id in (select id from auth.users where email like '%@bomberopro-test.invalid');
-- delete from public.attempts where client_attempt_id in ('<clave-1>', '<clave-2>')
--   and user_id in (select id from auth.users where email like '%@bomberopro-test.invalid');
