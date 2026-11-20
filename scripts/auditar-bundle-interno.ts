/**
 * npm run auditar:bundle-interno            → comprueba dist/ (construido con VITE_INTERNAL_DECKS_FROM_SERVER=true)
 * npm run auditar:bundle-interno -- --generar → regenera scripts/centinelas-mazos-internos.json (solo huellas)
 *
 * Falla si en dist/ aparece una frase de los módulos internos (huellas en centinelas-mazos-internos.json)
 * o un id de ficha interna que no esté en recallCardReview.ts (los de OUT_OF_SYLLABUS_CARDS son ids sin
 * texto, hallazgo conocido de #333: se informan pero no rompen). Ver docs/QA_BANDERA_MAZOS_INTERNOS_2026-11-20.md.
 */
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { buscarFugas, fuentes, generarCentinelas, idsInternos, MODULOS_INTERNOS, walk, type Centinelas } from './auditar-bundle-interno-lib';

const root = process.cwd();
const dataDir = path.join(root, 'src', 'data');
const CENTINELAS = path.join(root, 'scripts', 'centinelas-mazos-internos.json');
const TEXTO = new Set(['.css', '.html', '.js', '.json', '.map', '.mjs', '.svg', '.txt', '.webmanifest', '.xml']);

async function main(): Promise<void> {
  if (process.argv.includes('--generar')) {
    const { internos, publicos } = await fuentes(root);
    if (internos.length !== MODULOS_INTERNOS.length) throw new Error('Faltan módulos internos: no se puede regenerar.');
    const c = generarCentinelas(internos, publicos);
    await writeFile(CENTINELAS, `${JSON.stringify(c, null, 0).replace(/","/g, '",\n"')}\n`);
    console.log(`Centinelas: ${c.huellas.length} huellas (ventana ${c.ventana}).`);
    return;
  }
  const c = JSON.parse(await readFile(CENTINELAS, 'utf8')) as Centinelas;
  const dist = path.join(root, 'dist');
  if (!existsSync(dist)) throw new Error('No hay dist/: ejecuta VITE_INTERNAL_DECKS_FROM_SERVER=true npm run build.');
  const files = await walk(dist, (p) => TEXTO.has(path.extname(p).toLowerCase()));
  const ficheros = await Promise.all(files.map(async (p) => ({ path: path.relative(root, p), content: await readFile(p, 'utf8') })));
  const fugas = buscarFugas(ficheros, c);

  const toleradas = idsInternos(await readFile(path.join(dataDir, 'recallCardReview.ts'), 'utf8'));
  const ids = new Set<string>();
  for (const f of ficheros) for (const id of idsInternos(f.content)) ids.add(id);
  const idsNuevos = [...ids].filter((id) => !toleradas.has(id));
  const idsTolerados = [...ids].filter((id) => toleradas.has(id));

  console.log(`dist/: ${ficheros.length} ficheros de texto; ${c.huellas.length} huellas centinela.`);
  if (idsTolerados.length) {
    console.log(`Aviso: ${idsTolerados.length} ids internos sin texto (OUT_OF_SYLLABUS_CARDS de recallCardReview.ts).`);
  }
  if (fugas.length || idsNuevos.length) {
    for (const f of fugas) console.error(`FUGA: ${f.fichero}: ${f.coincidencias} frases de material interno.`);
    if (idsNuevos.length) console.error(`FUGA: ${idsNuevos.length} ids de fichas internas (p. ej. ${idsNuevos.slice(0, 3).join(', ')}).`);
    process.exitCode = 1;
    return;
  }
  console.log('OK: el bundle no contiene material interno de T38, SOS del T39 ni T40.');
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
