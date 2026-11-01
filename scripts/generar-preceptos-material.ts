// Uso: npm run material:preceptos (ver scripts/preceptosMaterial.ts).
import fs from 'node:fs';
import { calcularPreceptos, fuenteTs } from './preceptosMaterial';

const f = 'src/data/materialPreceptos.ts';
const d = calcularPreceptos();
fs.writeFileSync(f, fuenteTs(d));
console.log(`${f}: ${Object.keys(d).length} temas, ${Object.values(d).reduce((n, t) => n + Object.values(t).reduce((k, p) => k + p.length, 0), 0)} preceptos`);
