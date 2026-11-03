import { test } from 'vitest';
import assert from 'node:assert/strict';
import { validateDeploymentEnv } from './check-deploy-env.mjs';

const staging = {
  VITE_SUPABASE_URL: 'https://fxhvgvehhekqeqpkxtrm.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'sb_publishable_fixture_not_a_real_key',
};
const preview = { VERCEL_ENV: 'preview' };

test('Preview permite el host exacto de staging', () => {
  assert.doesNotThrow(() => validateDeploymentEnv(staging, preview));
});
test('Preview rechaza producción y otros destinos antes de compilar', () => {
  for (const url of [
    'https://yndoaprnpkjqiggeyefz.supabase.co',
    'https://another-project.supabase.co',
    'http://fxhvgvehhekqeqpkxtrm.supabase.co',
    'https://fxhvgvehhekqeqpkxtrm.supabase.co.evil.example',
    'https://fxhvgvehhekqeqpkxtrm.supabase.co/rest/v1',
    'https://fxhvgvehhekqeqpkxtrm.supabase.co?override=production',
    'https://fxhvgvehhekqeqpkxtrm.supabase.co#override',
  ]) {
    assert.throws(() => validateDeploymentEnv({ ...staging, VITE_SUPABASE_URL: url }, preview),
      /Preview requiere exclusivamente Supabase staging/);
  }
});
test('el guard de Preview no altera la validación de Production', () => {
  assert.doesNotThrow(() => validateDeploymentEnv({
    ...staging, VITE_SUPABASE_URL: 'https://yndoaprnpkjqiggeyefz.supabase.co',
  }, { VERCEL_ENV: 'production' }));
});
test('Preview sigue rechazando variables ausentes y claves de servidor', () => {
  assert.throws(() => validateDeploymentEnv({}, preview), /faltan/);
  assert.throws(() => validateDeploymentEnv({
    ...staging, VITE_SUPABASE_ANON_KEY: 'sb_secret_fixture',
  }, preview), /clave pública/);
  const jwt = ['fixture', Buffer.from(JSON.stringify({ role: 'service_role' })).toString('base64url'), 'fixture'].join('.');
  assert.throws(() => validateDeploymentEnv({
    ...staging, VITE_SUPABASE_ANON_KEY: jwt,
  }, preview), /clave pública/);
});
test('los errores no revelan claves', () => {
  const secret = 'sb_secret_fixture_never_log';
  assert.throws(() => validateDeploymentEnv({
    ...staging, VITE_SUPABASE_ANON_KEY: secret,
  }, preview), error => !error.message.includes(secret));
});
