import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { TEMA9_RECALL_CARDS } from './tema9Recall';
import { getDeckRevision } from './recallReview';
import { getVisibleTotalCards, isCardVisible } from './recallRegistry';

/**
 * feat/t9-ntp362 (02/11/2026): las 11 fichas del T9 que citan la NTP 362 del INSST, cotejadas al literal con el PDF vigente
 * de insst.es (scripts/verificar-t9-ntp362.py → data/verificacion/t9-ntp362.json). Se abren solo las «abierta».
 */
const V = JSON.parse(readFileSync(resolve(__dirname, '../../data/verificacion/t9-ntp362.json'), 'utf8')) as {
  script: string;
  fuente: { pdf: string; web: string; sha256: string };
  fichas: { id: string; estado: string; respuesta: string; fuente: string; pagina?: number; motivo?: string }[];
};
const PDF = 'https://www.insst.es/documents/94886/7875530/ntp_362.pdf';
const card = (id: string) => TEMA9_RECALL_CARDS.find((c) => c.id === id)!;

describe('T9 · NTP 362 (INSST): solo se abren las fichas literales con página del PDF vigente', () => {
  it('la verificación cubre las 11 fichas de la NTP 362, con la respuesta y la cita actuales', () => {
    expect(V.script).toBe('scripts/verificar-t9-ntp362.py');
    expect(V.fuente.pdf).toBe(PDF);
    expect(V.fuente.sha256).toMatch(/^[0-9a-f]{64}$/);
    const ntp362 = TEMA9_RECALL_CARDS.filter((c) => /NTP 362/.test(c.fuente));
    expect(V.fichas.map((x) => x.id).sort()).toEqual(ntp362.map((c) => c.id).sort());
    for (const x of V.fichas) {
      expect(x.respuesta, x.id).toBe(card(x.id).respuesta);
      expect(x.fuente, x.id).toBe(card(x.id).fuente);
    }
  });

  it('8 abiertas y 3 ocultas (fórmulas); visible ⇔ «abierta»', () => {
    expect(V.fichas.filter((x) => x.estado === 'abierta')).toHaveLength(8);
    expect(V.fichas.filter((x) => x.estado === 'oculta').map((x) => x.id).sort()).toEqual([
      'CPEI-T09-OF-0F2FD506', 'CPEI-T09-OF-B4A1C5E5', 'CPEI-T09-OF-D493D3E9',
    ]);
    for (const x of V.fichas) {
      expect(isCardVisible('tema9', x.id), x.id).toBe(x.estado === 'abierta');
      if (x.estado === 'oculta') expect(x.motivo, x.id).toBeTruthy();
    }
  });

  it('cada abierta cita el PDF de insst.es con #page=N y «pág. N» en la localización', () => {
    for (const x of V.fichas.filter((y) => y.estado === 'abierta')) {
      const c = card(x.id);
      expect(c.fuente, x.id).toBe(`${c.localizacion}. INSST-NTP362, PDF oficial de insst.es (1995): ${PDF}#page=${x.pagina}`);
      expect(c.localizacion, x.id).toMatch(new RegExp(`^NTP 362 \\(INSST\\), .*, pág\\. ${x.pagina}$`));
    }
  });

  it('respuestas reescritas al literal del PDF', () => {
    expect(card('CPEI-T09-OF-303FA8EC').respuesta).toBe('Es el producto de la velocidad v del fluido por el área A de la sección transversal del flujo');
    expect(card('CPEI-T09-OF-54865783').concepto).toBe('Según la NTP 362 del INSST, ¿para qué tipo de flujo es válida la ecuación de Bernoulli?');
    expect(card('CPEI-T09-OF-377EBBDC').respuesta).toMatch(/es decir Cd = Cv x Cc$/);
    expect(card('CPEI-T09-OF-0B46FCC3').respuesta).toBe('Aproximadamente 0,81');
    expect(card('CPEI-T09-OF-3869B3CE').respuesta).toBe('f = 64/Re');
  });

  it('T9 sigue pendiente (25 de 84 visibles); total visible 2.878 → 2.886', () => {
    expect(getDeckRevision('tema9')).toBe('pendiente');
    expect(TEMA9_RECALL_CARDS.filter((c) => isCardVisible('tema9', c.id))).toHaveLength(25);
    expect(getVisibleTotalCards()).toBe(2886);
  });
});
