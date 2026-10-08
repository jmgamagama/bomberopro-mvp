import { describe, expect, it } from 'vitest';
import { validateDeploymentEnv } from './check-deploy-env.mjs';

const publicConfig = { VITE_SUPABASE_URL: 'https://example.supabase.co', VITE_SUPABASE_ANON_KEY: 'sb_publishable_test_only' };
const jwt = (role: string) => `test.${Buffer.from(JSON.stringify({ role })).toString('base64url')}.test`;

describe('configuración antes de desplegar', () => {
  it('rechaza configuración ausente y enumera los nombres', () => {
    expect(() => validateDeploymentEnv({})).toThrow(/VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY/);
  });
  it('rechaza una clave vacía aunque exista la URL', () => {
    expect(() => validateDeploymentEnv({ ...publicConfig, VITE_SUPABASE_ANON_KEY: '  ' })).toThrow(/falta.*VITE_SUPABASE_ANON_KEY/);
  });
  it.each(['not-a-url', 'ftp://example.com', 'https://user:password@example.com'])('rechaza una URL incompatible: %s', url => {
    expect(() => validateDeploymentEnv({ ...publicConfig, VITE_SUPABASE_URL: url })).toThrow(/URL HTTP/);
  });
  it.each(['sb_secret_test_only', jwt('service_role')])('rechaza claves de servidor sin imprimirlas', key => {
    let message = '';
    try { validateDeploymentEnv({ ...publicConfig, VITE_SUPABASE_ANON_KEY: key }); } catch (error) { message = (error as Error).message; }
    expect(message).toMatch(/clave pública/);
    expect(message).not.toContain(key);
  });
  it.each([publicConfig.VITE_SUPABASE_ANON_KEY, jwt('anon')])('acepta configuración pública; la conectividad se verifica aparte', key => {
    expect(() => validateDeploymentEnv({ ...publicConfig, VITE_SUPABASE_ANON_KEY: key })).not.toThrow();
  });
});
