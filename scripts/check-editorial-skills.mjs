import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';

const files = [
  '.agents/skills/verificar-banco-preguntas/SKILL.md',
  '.claude/skills/verificar-banco-preguntas/SKILL.md',
];
const fail = (message) => { console.error(message); process.exitCode = 1; };
for (const f of files) if (!existsSync(f)) fail('Missing required skill: ' + f);
if (!process.exitCode) {
  const data = files.map(f => readFileSync(f, 'utf8').replace(/\r\n/g, '\n'));
  const hashes = data.map(v => createHash('sha256').update(v).digest('hex'));
  if (hashes[0] !== hashes[1]) fail('Editorial skills have diverged: ' + files.join(' vs '));
  else console.log('Shared editorial skill identical: ' + hashes[0]);
  for (const field of ['name: verificar-banco-preguntas', 'APTA', 'CORREGIR', 'DESCARTAR', 'revisión humana', 'fuente']) {
    if (!data[0].includes(field)) fail('Required editorial rule missing: ' + field);
  }
}
