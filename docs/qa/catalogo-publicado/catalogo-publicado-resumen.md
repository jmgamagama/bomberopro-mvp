# Propuesta de agregado para Bienvenida (#330)

El cliente solicita por GET una fila con `conceptos_publicados` y
`temas_publicados`. El universo es la convocatoria CPEI (1). Un tema cuenta si
tiene al menos un concepto publicado. Con un catálogo vacío, ambos valores
son cero. Bienvenida vuelve a consultar al abrirse y usa «Fichas por temas»
cuando el agregado no está disponible. La cifra describe el catálogo publicado,
sin afirmar cobertura completa o revisión editorial.

SQL para revisión. Este archivo queda fuera del directorio de migraciones.

```sql
begin;
create function public.catalogo_publicado_resumen()
returns table (conceptos_publicados bigint, temas_publicados bigint)
language sql stable security definer
set search_path = ''
as $$
  select count(*), count(distinct c.topic_id)
  from public.concepts as c
  join public.topics as t on t.id = c.topic_id
  where c.estado = 'publicado' and t.convocatoria_id = 1
$$;
revoke all on function public.catalogo_publicado_resumen() from public;
grant execute on function public.catalogo_publicado_resumen() to anon, authenticated;
commit;
```

La exposición queda limitada a dos recuentos, sin argumentos ni SQL dinámico.
Antes de aplicar, revisar el propietario efectivo y su acceso a las dos tablas,
las ACL resultantes y la configuración de Data API. La prueba aislada usa el
propietario de las tablas como ejecutor y no representa el modelo de roles de
staging. Referencias: [PostgreSQL, CREATE FUNCTION](https://www.postgresql.org/docs/current/sql-createfunction.html)
y [Supabase, Database Functions](https://supabase.com/docs/guides/database/functions).

Reversión de una instalación autorizada de esta función nueva:

```sql
drop function public.catalogo_publicado_resumen();
```

En staging, comparar primero los totales con la consulta de referencia para
CPEI, verificar que la API entrega una sola fila con ambas claves para invitado
y cuenta ficticia autorizada, y comprobar que los permisos directos de las tablas
conservan su estado. Probar la vuelta a «Fichas por temas» si falta el RPC.
