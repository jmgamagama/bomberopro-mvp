// Script de carga de supuestos privados: SIN red. El cliente de Supabase se simula siempre.
import { describe, expect, it, vi } from 'vitest';
import { copyFileSync, mkdtempSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  REPO_ROOT,
  comprobarRutaFueraDelRepo,
  ejecutar,
  parsearArgs,
  planificar,
  type ClienteAdmin,
} from './cargar-supuestos-privados-lib';

const EJEMPLO_REPO = join(REPO_ROOT, 'docs/ejemplos/supuestos-privados-EJEMPLO.json');
const copiaFuera = () => {
  const dir = mkdtempSync(join(tmpdir(), 'supuestos-'));
  const p = join(dir, 'supuestos.json');
  copyFileSync(EJEMPLO_REPO, p);
  return p;
};
const KEY = 'sb_secret_SOLO_PRUEBA_no_imprimir';
const UUID = '11111111-2222-4333-8444-555555555555';

function clienteFalso(existentes: { id: string; supuesto_id: string | null }[] = []) {
  const c = {
    buscarUsuarioPorEmail: vi.fn(async (email: string) => (email === 'jose@example.com' ? UUID : null)),
    filasDe: vi.fn(async () => existentes),
    insertar: vi.fn(async () => {}),
    actualizar: vi.fn(async () => {}),
    borrar: vi.fn(async () => {}),
  } satisfies ClienteAdmin;
  return c;
}

describe('argumentos', () => {
  it('exige archivo y exactamente uno de --email / --owner-id', () => {
    expect(parsearArgs(['/x.json', '--email', 'Jose@Example.com', '--dry-run'])).toEqual({ archivo: '/x.json', email: 'jose@example.com', dryRun: true, replace: false });
    expect(parsearArgs(['/x.json', '--owner-id', UUID, '--replace']).ownerId).toBe(UUID);
    expect(() => parsearArgs(['--email', 'a@b.es'])).toThrow(/Falta el archivo/);
    expect(() => parsearArgs(['/x.json'])).toThrow(/exactamente uno/);
    expect(() => parsearArgs(['/x.json', '--email', 'a@b.es', '--owner-id', UUID])).toThrow(/exactamente uno/);
    expect(() => parsearArgs(['/x.json', '--owner-id', 'no-uuid'])).toThrow(/UUID/);
    expect(() => parsearArgs(['/x.json', '--email', 'a@b.es', '--yes'])).toThrow(/desconocida/);
  });
});

describe('ruta del archivo', () => {
  it('rechaza archivos dentro del repo y acepta los de fuera', () => {
    expect(() => comprobarRutaFueraDelRepo(EJEMPLO_REPO)).toThrow(/DENTRO del repo/);
    expect(() => comprobarRutaFueraDelRepo(join(REPO_ROOT, 'package.json'))).toThrow(/DENTRO del repo/);
    expect(comprobarRutaFueraDelRepo(copiaFuera())).toMatch(/supuestos\.json$/);
    expect(() => comprobarRutaFueraDelRepo('/no/existe.json')).toThrow(/No existe/);
  });
});

describe('ejecución', () => {
  it('--dry-run valida y muestra el plan sin crear cliente ni leer la clave', async () => {
    const crearCliente = vi.fn();
    const log: string[] = [];
    const r = await ejecutar(parsearArgs([copiaFuera(), '--email', 'jose@example.com', '--dry-run']), {
      env: { SUPABASE_URL: 'https://x.supabase.co', SUPABASE_SERVICE_ROLE_KEY: KEY },
      crearCliente,
      log: (m) => log.push(m),
    });
    expect(r.escrito).toBe(false);
    expect(crearCliente).not.toHaveBeenCalled();
    expect(log.join('\n')).toMatch(/\[dry-run\] Se cargarían 1 supuestos para email jose@example\.com/);
    expect(log.join('\n')).not.toContain(KEY);
  });

  it('sin --dry-run y sin variables, falla antes de conectarse', async () => {
    const crearCliente = vi.fn();
    await expect(ejecutar(parsearArgs([copiaFuera(), '--email', 'jose@example.com']), { env: {}, crearCliente, log: () => {} })).rejects.toThrow(/SUPABASE_SERVICE_ROLE_KEY/);
    expect(crearCliente).not.toHaveBeenCalled();
  });

  it('un archivo inválido no carga nada', async () => {
    const crearCliente = vi.fn();
    await expect(ejecutar(parsearArgs([join(tmpdir(), 'nada.json'), '--email', 'a@b.es', '--dry-run']), { env: {}, crearCliente, log: () => {} })).rejects.toThrow(/No existe/);
  });

  it('con el cliente simulado: resuelve el email, inserta los nuevos y no imprime la clave', async () => {
    const c = clienteFalso();
    const log: string[] = [];
    const r = await ejecutar(parsearArgs([copiaFuera(), '--email', 'jose@example.com']), {
      env: { VITE_SUPABASE_URL: 'https://x.supabase.co', SUPABASE_SERVICE_ROLE_KEY: KEY },
      crearCliente: (url, key) => {
        expect(url).toBe('https://x.supabase.co');
        expect(key).toBe(KEY);
        return c;
      },
      log: (m) => log.push(m),
    });
    expect(r).toMatchObject({ ownerId: UUID, escrito: true });
    expect(c.insertar).toHaveBeenCalledTimes(1);
    const filas = (c.insertar.mock.calls[0] as unknown as [{ owner_id: string; payload: Record<string, unknown> }[]])[0];
    expect(filas).toHaveLength(1);
    expect(filas[0].owner_id).toBe(UUID);
    expect(filas[0].payload).toMatchObject({ id: 'EJEMPLO-01' });
    expect(filas[0].payload).not.toHaveProperty('autoria');
    expect(log.join('\n')).not.toContain(KEY);
  });

  it('email desconocido: no escribe nada', async () => {
    const c = clienteFalso();
    await expect(
      ejecutar(parsearArgs([copiaFuera(), '--email', 'otro@example.com']), { env: { SUPABASE_URL: 'u', SUPABASE_SERVICE_ROLE_KEY: KEY }, crearCliente: () => c, log: () => {} })
    ).rejects.toThrow(/No hay ningún usuario/);
    expect(c.insertar).not.toHaveBeenCalled();
  });

  it('actualiza los que ya existen y --replace borra sobrantes y duplicados', async () => {
    const c = clienteFalso([
      { id: 'r1', supuesto_id: 'EJEMPLO-01' },
      { id: 'r2', supuesto_id: 'EJEMPLO-01' },
      { id: 'r3', supuesto_id: 'VIEJO' },
    ]);
    await ejecutar(parsearArgs([copiaFuera(), '--owner-id', UUID, '--replace']), { env: { SUPABASE_URL: 'u', SUPABASE_SERVICE_ROLE_KEY: KEY }, crearCliente: () => c, log: () => {} });
    expect(c.buscarUsuarioPorEmail).not.toHaveBeenCalled();
    expect(c.insertar).not.toHaveBeenCalled();
    expect(c.actualizar).toHaveBeenCalledWith('r1', expect.objectContaining({ id: 'EJEMPLO-01' }));
    expect(c.borrar).toHaveBeenCalledWith(['r2', 'r3']);
  });

  it('sin --replace no borra nada', () => {
    const s = [{ id: 'A' }] as never[];
    expect(planificar(s, [{ id: 'r9', supuesto_id: 'B' }], false)).toEqual({ insertar: s, actualizar: [], borrar: [] });
  });
});

describe('aislamiento', () => {
  it('la app no importa el script (no entra en el build)', () => {
    const archivos: string[] = [];
    const recorrer = (d: string) => {
      for (const n of readdirSync(d)) {
        const p = join(d, n);
        if (statSync(p).isDirectory()) recorrer(p);
        else if (/\.(tsx?|jsx?)$/.test(n)) archivos.push(p);
      }
    };
    recorrer(join(REPO_ROOT, 'src'));
    for (const f of archivos) expect(readFileSync(f, 'utf8'), f).not.toMatch(/cargar-supuestos-privados|SERVICE_ROLE/);
  });

  it('la CLI en --dry-run termina bien sin variables de Supabase, y sin --dry-run falla sin conectarse', () => {
    const archivo = copiaFuera();
    const env = { PATH: process.env.PATH ?? '', HOME: process.env.HOME ?? '' };
    const cli = (extra: string[]) =>
      spawnSync(process.execPath, [join(REPO_ROOT, 'node_modules/vite-node/vite-node.mjs'), 'scripts/cargar-supuestos-privados.ts', archivo, '--email', 'jose@example.com', ...extra], {
        cwd: REPO_ROOT,
        env,
        encoding: 'utf8',
        timeout: 60_000,
      });
    const seco = cli(['--dry-run']);
    expect(seco.status, seco.stderr).toBe(0);
    expect(seco.stdout).toMatch(/No se ha contactado con Supabase/);
    const real = cli([]);
    expect(real.status).toBe(1);
    expect(real.stderr).toMatch(/SUPABASE_SERVICE_ROLE_KEY/);
  }, 90_000);
});
