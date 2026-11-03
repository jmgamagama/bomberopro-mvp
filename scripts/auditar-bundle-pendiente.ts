import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { REVIEWED_CARDS_IN_PENDING_DECKS } from '../src/data/recallCardReview';
import { getDeckRevision } from '../src/data/recallReview';
import { RECALL_DECKS } from '../src/data/recallRegistry';
import { deckModulesFromRegistry } from './excluir-mazos-pendientes';
import { findPendingCardLeaks, type RecallCardPayload } from './auditar-bundle-pendiente-lib';

interface PublicAsset {
  path: string;
  content: string;
}

const TEXT_ASSET_EXTENSIONS = new Set(['.css', '.html', '.js', '.json', '.txt', '.webmanifest', '.xml']);

async function collectFiles(directory: string, root: string): Promise<PublicAsset[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const found: PublicAsset[] = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      found.push(...await collectFiles(absolutePath, root));
    } else if (entry.isFile() && TEXT_ASSET_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      found.push({
        path: path.relative(root, absolutePath),
        content: await readFile(absolutePath, 'utf8'),
      });
    }
  }

  return found;
}

function parseCards(moduleSource: string, moduleName: string): RecallCardPayload[] {
  const exportStart = moduleSource.indexOf('_RECALL_CARDS');
  if (exportStart < 0) throw new Error(`No se pudo leer el catálogo del módulo ${moduleName}.`);
  const assignmentStart = moduleSource.indexOf('=', exportStart);
  if (assignmentStart < 0) throw new Error(`No se pudo leer el catálogo del módulo ${moduleName}.`);
  const arrayStart = moduleSource.indexOf('[', assignmentStart);
  if (arrayStart < 0) {
    throw new Error(`No se pudo leer el catálogo del módulo ${moduleName}.`);
  }

  let depth = 0;
  let inString = false;
  let escaped = false;
  let arrayEnd = -1;
  for (let index = arrayStart; index < moduleSource.length; index += 1) {
    const char = moduleSource[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === '"') inString = false;
      continue;
    }
    if (char === '"') inString = true;
    else if (char === '[') depth += 1;
    else if (char === ']') {
      depth -= 1;
      if (depth === 0) {
        arrayEnd = index;
        break;
      }
    }
  }
  if (arrayEnd < 0) throw new Error(`El catálogo del módulo ${moduleName} no tiene un cierre válido.`);

  try {
    return JSON.parse(moduleSource.slice(arrayStart, arrayEnd + 1)) as RecallCardPayload[];
  } catch {
    throw new Error(`El catálogo del módulo ${moduleName} no contiene JSON válido.`);
  }
}

async function main(): Promise<void> {
  const root = process.cwd();
  const dist = path.join(root, 'dist');
  const assets = await collectFiles(dist, root);
  if (assets.length === 0) throw new Error('No hay artefactos de texto en dist; ejecuta npm run build primero.');

  const registryPath = path.join(root, 'src', 'data', 'recallRegistry.ts');
  const registrySource = await readFile(registryPath, 'utf8');
  const deckModules = deckModulesFromRegistry(registrySource);
  if (deckModules.length === 0) throw new Error('No se encontraron mazos en recallRegistry.ts.');
  const pendingDecks = deckModules.filter(({ deckId }) => getDeckRevision(deckId) !== 'revisado');
  const deckCounts = new Map(RECALL_DECKS.map((deck) => [deck.id, deck.count]));
  const pendingCards: { deckId: string; card: RecallCardPayload }[] = [];

  for (const { deckId, module } of pendingDecks) {
    const modulePath = path.join(root, 'src', 'data', `${module}.ts`);
    const moduleSource = await readFile(modulePath, 'utf8');
    const approvedIds = new Set(REVIEWED_CARDS_IN_PENDING_DECKS[deckId] ?? []);
    const cards = parseCards(moduleSource, module);
    if (cards.length !== deckCounts.get(deckId)) {
      throw new Error(`El módulo ${module} tiene ${cards.length} fichas y el registro declara ${deckCounts.get(deckId) ?? 'ninguna'}.`);
    }
    for (const card of cards) {
      if (!approvedIds.has(card.id)) pendingCards.push({ deckId, card });
    }
  }

  const leaks = findPendingCardLeaks(pendingCards, assets);
  if (leaks.length > 0) {
    const examples = leaks.slice(0, 5).map(({ deckId, assetPath }) => `${deckId} → ${assetPath}`).join('\n');
    throw new Error(`${leaks.length} fichas pendientes completas aparecen en dist:\n${examples}`);
  }

  console.log(`Auditoría de bundle correcta: ${pendingCards.length} fichas de ${pendingDecks.length} mazos pendientes comprobadas; ninguna ficha completa aparece en dist.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Falló la auditoría del bundle.');
  process.exitCode = 1;
});
