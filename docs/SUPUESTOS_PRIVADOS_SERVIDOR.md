# Supuestos privados en la cuenta (servidor)

Los supuestos privados de José (material de formación del CPEI y de la academia) se pueden ver en la app
**en su cuenta, sin importarlos**, en «Supuestos prácticos → Mis supuestos (privado)», marcados
«En tu cuenta · solo tú». Nadie más puede leerlos.

> Estado: **preparado, no activado.** La migración 21 no está aplicada y el script no se ha ejecutado
> contra Supabase. Hasta que se haga, la app funciona igual que antes (si la tabla no existe, la lectura
> falla en silencio y no se muestra nada).

## Cómo funciona

| Pieza | Dónde | Qué hace |
|---|---|---|
| Tabla `public.private_supuestos` | `supabase/migrations/21_private_supuestos.sql` (+ `_down`) | `id`, `owner_id` → `auth.users`, `payload jsonb` (un supuesto por fila), `created_at`, `updated_at`. RLS activada, **una sola política: SELECT con `owner_id = auth.uid()`**. Sin INSERT/UPDATE/DELETE para `anon` ni `authenticated`; todo revocado a `anon`. |
| Lectura en la app | `src/lib/privateSupuestos.ts` | Con sesión, lee sus filas, valida cada `payload` con el mismo esquema que la importación local (`validarDatosSupuestos`) y descarta las inválidas. Se guardan **solo en memoria** (no en localStorage) y se descartan al cambiar de cuenta. Cualquier error (tabla inexistente, red…) → lista vacía, sin avisos. |
| Pantalla | `src/components/SupuestosPracticos.tsx` | Los muestra junto a los importados en el dispositivo. No se pueden borrar desde la app. Si hay alguno, aparece la entrada «Supuestos» / «Casos» del menú. |
| Carga | `scripts/cargar-supuestos-privados.ts` | Script local con la **service role**. Lee un JSON de **fuera del repo**, lo valida y lo inserta/actualiza para un `owner_id` o un email. No lo importa la app (no entra en el build). |

¿Por qué 21 y no 18? En `origin/main` la última es la 17 (#114/#115), pero 18, 19 y 20 ya están usados en
ramas sin fusionar (`claude/piloto-constitucion`, `codex/fix-mira-server-graded-concepts`). 21 evita el choque.
Si al fusionar alguna de ellas cambia la numeración, renombrar el archivo antes de aplicarlo.

## Pasos (José o Grok Bot, solo cuando se apruebe)

1. **Aplicar la migración 21** en el proyecto de Supabase (SQL Editor o `supabase db push`), con
   `supabase/migrations/21_private_supuestos.sql`. Comprobar en *Table editor → private_supuestos* que RLS
   está activada y que la única política es `private_supuestos_select_own`.
2. **Generar o revisar el JSON privado** fuera del repo (ya existe `/workspace/privado/supuestos_jose.json`,
   26 supuestos; se regenera con `scripts/convertir-base-casos.ts`).
3. **Probar sin tocar nada**:
   ```bash
   npx vite-node scripts/cargar-supuestos-privados.ts /workspace/privado/supuestos_jose.json --email <email de José> --dry-run
   ```
4. **Cargar** (la clave de servicio solo en la terminal, nunca en `.env` del repo ni en Vercel con prefijo `VITE_`):
   ```bash
   SUPABASE_URL=https://<proyecto>.supabase.co \
   SUPABASE_SERVICE_ROLE_KEY=<service role> \
   npx vite-node scripts/cargar-supuestos-privados.ts /workspace/privado/supuestos_jose.json --email <email de José>
   ```
   Es idempotente: si se repite, actualiza los supuestos con el mismo `id`. Con `--replace` además borra los
   de ese usuario que ya no estén en el archivo. También acepta `--owner-id <uuid>` en lugar de `--email`.
5. José entra con su cuenta → «Casos» → «Mis supuestos (privado)».

Para retirarlo todo: borrar sus filas (o ejecutar `21_private_supuestos_down.sql`, que elimina la tabla y su contenido).

## Por qué el contenido no está en el repo ni en el bundle

- Es material con **derechos de terceros** (formación interna del CPEI/Diputación y de una academia), cedido
  para uso personal de José. Publicarlo en el repo o en el JavaScript de la app lo haría accesible a cualquiera.
- El estado «pendiente de revisión» de la app solo **oculta** contenido en la interfaz: lo que va en el bundle
  se puede leer igualmente. Por eso no sirve para material privado.
- Con la tabla y RLS, el contenido solo viaja desde Supabase al navegador de su dueño autenticado. El repo
  solo contiene la estructura (migración), el lector y el script, sin ningún dato real; el JSON vive en
  `/workspace/privado/` (fuera del repo, en `.gitignore` de facto por estar fuera).

## Seguridad

- La service role **solo** se usa en el script, en local. El script nunca la imprime y rechaza archivos dentro del repo.
- Los clientes (`anon`/`authenticated`) no pueden escribir: no hay políticas ni permisos de INSERT/UPDATE/DELETE.
- La importación local («Importar archivo JSON») sigue existiendo y es independiente: ver `docs/SUPUESTOS_IMPORT_PRIVADO.md`.
