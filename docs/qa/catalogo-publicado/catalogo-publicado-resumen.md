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
### Contrato de la prueba propuesta en staging

La inspección de solo lectura del 26/11/2026 identificó a `postgres` como
ejecutor y propietario de ambas tablas, con `BYPASSRLS`. La propuesta presupone
ese ejecutor y conserva la ACL predeterminada de funciones de ese rol en
`public`, incluida la concesión directa a `service_role`, igual que el RPC
existente de catálogo. Se espera `EXECUTE` para el propietario, `anon`,
`authenticated` y `service_role`. Revocar a `PUBLIC` impide la concesión
general. El filtro de publicación y convocatoria se aplica en la propia
función.

Antes de una prueba autorizada, volver a comprobar ejecutor y ACL por defecto.
Si difieren de lo observado, detener la aplicación y revisar el contrato.
Comprobar propietario y ACL de la función instalada antes de probar la
Data API. El arnés aislado reproduce las concesiones observadas. Referencias: [PostgreSQL, CREATE FUNCTION](https://www.postgresql.org/docs/current/sql-createfunction.html)
y [Supabase, Database Functions](https://supabase.com/docs/guides/database/functions).

Reversión de una instalación autorizada de esta función nueva:

```sql
drop function public.catalogo_publicado_resumen();
```

En staging, comparar primero los totales con la consulta de referencia para
CPEI, verificar que la API entrega una sola fila con ambas claves para invitado
y cuenta ficticia autorizada, y comprobar que los permisos directos de las tablas
conservan su estado. Probar la vuelta a «Fichas por temas» si falta el RPC.
