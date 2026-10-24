# audit/checks — comprobaciones automáticas

Nacen de la auditoría del 24/10/2026 (`audit/2026-10-24.md`). Cada `.sql` devuelve filas `check | tipo | valor | umbral | ok`:

- **bloqueante**: debe cumplirse siempre. Si falla, la Action falla.
- **trinquete**: umbral = valor medido el 24/10. Solo falla si **empeora**. Cuando algo mejore, baja el umbral en el `.sql` (nunca lo subas) y explica el cambio en el PR.

## Ejecutar a mano

```bash
AUDIT_DATABASE_URL="postgresql://audit_ro:CLAVE@db.yndoaprnpkjqiggeyefz.supabase.co:5432/postgres" bash audit/checks/run.sh
npx vitest run --config audit/checks/vitest.audit.config.ts
```

Los `*.audit.ts` no se ejecutan con `npm test` (pueden estar en rojo a propósito mientras un problema siga abierto).

## Activar la Action semanal (una vez, con aprobación de JM)

1. Crear en Supabase un rol de **solo lectura** (SQL editor de producción):
   ```sql
   create role audit_ro login password '<generar-una-larga>';
   grant usage on schema public, auth to audit_ro;
   grant select on all tables in schema public to audit_ro;
   grant select (id, created_at, email_confirmed_at) on auth.users to audit_ro;
   alter role audit_ro set default_transaction_read_only = on;
   ```
   La lectura de `auth.users` se limita a fechas: el check solo cuenta altas, no lee emails.
2. En GitHub → Settings → Secrets → Actions, crear `AUDIT_DATABASE_URL` con la cadena de conexión de `audit_ro`. Nunca usar `service_role`.
3. Copiar `audit/checks/audit-semanal.yml` a `.github/workflows/audit-semanal.yml`.

## Qué no está aquí

La **tasa de error de contenido** necesita juicio: se mide repitiendo la muestra estratificada de 200 (consulta en `audit/2026-10-24-anexos/auditor_A_contenido.md`, cambiando la semilla) tras cada lote de correcciones.
