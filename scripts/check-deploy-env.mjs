import { pathToFileURL } from 'node:url';
import { loadEnv } from 'vite';

export function validateDeploymentEnv(env) {
  const url = env.VITE_SUPABASE_URL?.trim();
  const key = env.VITE_SUPABASE_ANON_KEY?.trim();
  const missing = [];
  if (!url) missing.push('VITE_SUPABASE_URL');
  if (!key) missing.push('VITE_SUPABASE_ANON_KEY');
  if (missing.length) throw new Error(`Despliegue detenido: faltan ${missing.join(', ')}.`);

  try {
    const parsed = new URL(url);
    if (!['https:', 'http:'].includes(parsed.protocol) || parsed.username || parsed.password) throw new Error();
  } catch {
    throw new Error('Despliegue detenido: VITE_SUPABASE_URL debe ser una URL HTTP(S) sin credenciales.');
  }

  let role;
  try { role = JSON.parse(Buffer.from(key.split('.')[1], 'base64url').toString()).role; } catch { /* Puede ser una clave publicable, no JWT. */ }
  if (key.startsWith('sb_secret_') || role === 'service_role') {
    throw new Error('Despliegue detenido: VITE_SUPABASE_ANON_KEY requiere una clave pública; no una clave de servidor.');
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    // Igual que vite build: .env, .env.local, .env.production y variables del proceso.
    validateDeploymentEnv(loadEnv('production', process.cwd(), 'VITE_'));
  } catch (error) {
    console.error(error.message); // Solo nombres y descripción; nunca los valores.
    process.exitCode = 1;
  }
}
