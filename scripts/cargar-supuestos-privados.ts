/**
 * Carga los supuestos privados de un usuario en Supabase (tabla public.private_supuestos,
 * migración supabase/migrations/21_private_supuestos.sql) con la SERVICE ROLE.
 *
 * SOLO USO LOCAL Y MANUAL. No lo importa la app (no entra en el build) y no contiene ningún dato:
 * lee un JSON en formato «bomberopro-supuestos» que debe estar FUERA del repo (p. ej.
 * /workspace/privado/supuestos_jose.json). La clave de servicio nunca se imprime.
 *
 *   # Comprobar sin tocar Supabase:
 *   npx vite-node scripts/cargar-supuestos-privados.ts /workspace/privado/supuestos_jose.json --email jose@example.com --dry-run
 *   # Cargar de verdad (solo cuando la migración 21 esté aplicada y se haya aprobado):
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx vite-node scripts/cargar-supuestos-privados.ts <archivo> --email <email>
 *
 * Ver docs/SUPUESTOS_PRIVADOS_SERVIDOR.md.
 */
import { USO, crearClienteSupabase, ejecutar, parsearArgs, type ClienteAdmin } from './cargar-supuestos-privados-lib';

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  if (argv.includes('--help') || argv.includes('-h')) {
    console.log(USO);
    return;
  }
  let opciones;
  try {
    opciones = parsearArgs(argv);
  } catch (e) {
    console.error(`${(e as Error).message}\n\n${USO}`);
    process.exit(2);
  }
  // El cliente se crea de forma perezosa: con --dry-run nunca se llega a importar supabase-js.
  let cliente: ClienteAdmin | null = null;
  const perezoso = (url: string, key: string): ClienteAdmin => {
    const listo = crearClienteSupabase(url, key).then((c) => (cliente = c));
    const llamar =
      <K extends keyof ClienteAdmin>(k: K) =>
      async (...a: Parameters<ClienteAdmin[K]>) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ((cliente ?? (await listo))[k] as any)(...a);
    return {
      buscarUsuarioPorEmail: llamar('buscarUsuarioPorEmail'),
      filasDe: llamar('filasDe'),
      insertar: llamar('insertar'),
      actualizar: llamar('actualizar'),
      borrar: llamar('borrar'),
    };
  };
  try {
    await ejecutar(opciones, { env: process.env, crearCliente: perezoso });
  } catch (e) {
    // Nunca se imprime la clave: los mensajes no la incluyen.
    console.error(`Error: ${(e as Error).message}`);
    process.exit(1);
  }
}

void main();
