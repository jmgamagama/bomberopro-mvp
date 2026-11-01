// Uso: npm run material:preceptos (ver scripts/preceptosMaterial.ts).
import fs from 'node:fs';
import { calcularPreceptos, fuenteTs, indiceTs } from './preceptosMaterial';

const f = 'src/data/materialPreceptos.ts';
const d = calcularPreceptos();
fs.writeFileSync(f, fuenteTs(d));
console.log(`${f}: ${Object.keys(d).length} temas, ${Object.values(d).reduce((n, t) => n + Object.values(t).reduce((k, p) => k + p.preceptos.length, 0), 0)} preceptos`);
fs.writeFileSync('src/data/materialTemasIndice.ts', indiceTs());
console.log('src/data/materialTemasIndice.ts: temas con material');
