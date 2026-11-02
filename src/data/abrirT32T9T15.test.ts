import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { TEMA32_RECALL_CARDS } from './tema32Recall';
import { TEMA9_RECALL_CARDS } from './tema9Recall';
import { TEMA15_RECALL_CARDS } from './tema15Recall';
import { TEMA16_LOTE02_RECALL_CARDS } from './tema16Lote02Recall';
import { getDeckRevision } from './recallReview';
import { isCardVisible } from './recallRegistry';

/** Comprobación literal del 01/11/2026 (scripts/verificar-fichas-literal.py): solo se ven las fichas «ok». */
const V = JSON.parse(readFileSync(resolve(__dirname, '../../data/verificacion/abrir-t32-t9-t15.json'), 'utf8')) as {
  mazos: Record<string, { id: string; estado: string }[]>;
};
const MAZOS = { tema32: TEMA32_RECALL_CARDS, tema9: TEMA9_RECALL_CARDS, tema15: TEMA15_RECALL_CARDS } as const;
const ACEPTADA = /https:\/\/(?:search\.itu\.int\/history\/HistoryDigitalCollectionDocLibrary\/1\.49\.48\.es\.301\.pdf#page=\d+|www\.(boe\.es\/buscar\/act\.php\?id=BOE-A-\d{4}-\d+#[\w-]+|codigotecnico\.org\/pdf\/Documentos\/\w+\/DB\w+\.pdf#page=\d+|insst\.es\/documents\/94886\/\d+\/(ntp_221|841\+web|842\+web|Gu%C3%ADa\+t%C3%A9cnica\+para\+la\+evaluaci%C3%B3n\+y\+prevenci%C3%B3n\+de\+los\+riesgos\+relativos\+a\+la\+utilizaci%C3%B3n\+de\+los\+equipos\+de\+trabajo)\.pdf#page=\d+))/;
// UIT aceptada como fuente oficial por José (02/11/2026, feat/t16-abrir-uit): solo el Reglamento de Radiocomunicaciones, ed. 2024, vol. 1.
// INSST aceptado como fuente oficial por el propietario (01/11/2026, feat/fichas-insst): solo NTP 221, 841 y 842 y Guía técnica de equipos de trabajo.

describe('T32, T9 y T15: se abren solo las fichas literales con fuente aceptada', () => {
  it.each(Object.keys(MAZOS))('%s: la verificación cubre todas sus fichas', (m) => {
    // T32 se publica entero; T9 y T15 siguen pendientes y solo viajan en el bundle sus fichas abiertas.
    expect(getDeckRevision(m)).toBe(m === 'tema32' ? 'revisado' : 'pendiente');
    expect(V.mazos[m].map((x) => x.id).sort()).toEqual(MAZOS[m as keyof typeof MAZOS].map((c) => c.id).sort());
  });
  it('cuántas se abren: T32 91 de 91, T9 17 de 84, T15 92 de 92', () => {
    const vistas = (m: keyof typeof MAZOS) => MAZOS[m].filter((c) => isCardVisible(m, c.id)).length;
    expect([vistas('tema32'), vistas('tema9'), vistas('tema15')]).toEqual([91, 17, 92]);
  });
  it.each(Object.keys(MAZOS))('%s: visible ⇔ «ok» en la comprobación literal, con cita y enlace a BOE, CTE o INSST aceptado', (m) => {
    const estado = new Map(V.mazos[m].map((x) => [x.id, x.estado]));
    for (const c of MAZOS[m as keyof typeof MAZOS]) {
      const visible = isCardVisible(m, c.id);
      expect(visible, c.id).toBe(estado.get(c.id) === 'ok');
      if (visible) expect(c.fuente, c.id).toMatch(ACEPTADA);
    }
  });
  it('ninguna ficha visible cita al IDAE/MITECO, a EUR-Lex ni a un documento del INSST no aceptado', () => {
    for (const [m, cards] of Object.entries(MAZOS)) {
      for (const c of cards.filter((x) => isCardVisible(m, x.id))) {
        expect(c.fuente).not.toMatch(/miteco|idae|eur-lex/i);
        if (/insst/i.test(c.fuente)) expect(c.fuente, c.id).toMatch(/^(NTP 221|NTP 841|NTP 842|Guía técnica de equipos de trabajo) \(INSST\)/);
      }
    }
  });
  it('tema16-lote02 (UIT): las 21 visibles, «abierta» en data/verificacion/t16-lote02.json y con enlace al RR 2024 de itu.int', () => {
    const T16 = JSON.parse(readFileSync(resolve(__dirname, '../../data/verificacion/t16-lote02.json'), 'utf8')) as { fichas: { id: string; estado: string }[] };
    const estado = new Map(T16.fichas.map((x) => [x.id, x.estado]));
    expect(TEMA16_LOTE02_RECALL_CARDS).toHaveLength(21);
    for (const c of TEMA16_LOTE02_RECALL_CARDS) {
      expect(isCardVisible('tema16-lote02', c.id), c.id).toBe(estado.get(c.id) === 'abierta');
      expect(c.fuente, c.id).toMatch(ACEPTADA);
      expect(c.fuente, c.id).toMatch(/^RR UIT 2024, (núm|cuadro|art)/);
    }
  });
});
