// Falla si dos migraciones (sin contar las _down) comparten número, o si una _down no tiene su migración.
// Evita lo ocurrido el 17/10/2026: dos agentes crearon a la vez una «migración 18».
import { readdirSync } from 'node:fs';

const dir = new URL('../supabase/migrations/', import.meta.url);
const files = readdirSync(dir).filter(f => f.endsWith('.sql'));
const up = files.filter(f => !f.endsWith('_down.sql'));
const errors = [];
const byNum = new Map();
for (const f of up) {
  const m = f.match(/^(\d+)[a-z]?_/);
  if (!m) { errors.push(`${f}: el nombre debe empezar por un número`); continue; }
  const key = f.match(/^\d+[a-z]?/)[0];
  if (byNum.has(key)) errors.push(`número ${key} repetido: ${byNum.get(key)} y ${f}`);
  else byNum.set(key, f);
}
for (const f of files.filter(f => f.endsWith('_down.sql'))) {
  if (!files.includes(f.replace(/_down\.sql$/, '.sql'))) errors.push(`${f}: no existe la migración que deshace`);
}
if (errors.length) {
  console.error('Migraciones con problemas:\n- ' + errors.join('\n- '));
  console.error('Usa el siguiente número libre (mira supabase/migrations en main) y nombra la marcha atrás <nombre>_down.sql.');
  process.exit(1);
}
console.log(`Migraciones OK: ${up.length} archivos, sin números repetidos.`);
