-- #278 / PR #306 · SQL que acompaña a `e2e/aceptacion-staging-278.cjs` (aceptación con cliente real).
-- SOLO staging (fxhvgvehhekqeqpkxtrm) y solo sobre tandas de cuentas ficticias de prueba. Nunca en producción.
--
-- El guion imprime estas dos sentencias ya rellenadas con el identificador de la tanda que ESA ejecución acaba de
-- recibir. Aquí quedan versionadas para poder revisarlas antes de ejecutar nada. Sustituir :sid y :original.
--
-- Por qué se confirma la escritura (y no se usa ROLLBACK): la caducidad tiene que verla el navegador, que es otra
-- conexión. Una transacción sin confirmar no sería visible, así que se deshace con un UPDATE compensatorio.

-- 1) CADUCAR la tanda de esta ejecución. Precondiciones en el propio WHERE: esa tanda exacta, dueño del dominio
--    de pruebas, modo estudio y aún vigente. Devuelve cuántas filas cambió (debe ser 1) y el valor original.
with objetivo as (
  select s.id, s.expires_at
    from private.question_delivery_sessions s
    join auth.users u on u.id = s.user_id
   where s.id = :'sid'
     and u.email like '%@bomberopro-test.invalid'
     and s.mode = 'study'
     and s.expires_at > now()
), cambio as (
  update private.question_delivery_sessions s
     set expires_at = now() - interval '1 second'
    from objetivo o
   where s.id = o.id
  returning s.id
)
select (select count(*) from cambio) as filas,
       (select expires_at from objetivo) as expires_at_original;

-- 2) RESTAURAR el valor original en esa misma fila. Debe devolver filas = 1 y restaurada = t.
--    Se ejecuta en cuanto el navegador ha observado el rechazo, y también si el recorrido falla a medias.
with cambio as (
  update private.question_delivery_sessions
     set expires_at = :'original'::timestamptz
   where id = :'sid'
     and expires_at < now()
  returning expires_at
)
select (select count(*) from cambio) as filas,
       (select bool_and(expires_at = :'original'::timestamptz) from cambio) as restaurada;

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
