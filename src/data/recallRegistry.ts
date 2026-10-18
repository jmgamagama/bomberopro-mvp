/**
 * Registro central de mazos de recuerdo (concepto → respuesta → fuente).
 *
 * Es la ÚNICA lista de temas/lotes de la app: la pantalla «Recuerdo», la Sesión
 * diaria, la bienvenida y la página de planes leen de aquí.
 *
 * El registro solo contiene METADATOS (título, nº de fichas…). Las fichas de cada
 * mazo viven en su propio módulo y se cargan BAJO DEMANDA con `loadRecallDeckCards`
 * (import dinámico → un fichero JS por mazo en el build). Así nunca se cargan los
 * 528 del tema 36 en un solo módulo, ni los 9.392 conceptos de MIRA, y no hay
 * preguntas tipo test.
 *
 * Para añadir un mazo nuevo:
 *   1. crea src/data/<mazo>Recall.ts con `<MAZO>_RECALL_META` y `<MAZO>_RECALL_CARDS`
 *      (mismo formato que los existentes);
 *   2. añade UNA entrada a DECK_SOURCES con sus metadatos y su `load` (import dinámico).
 *   Los tests comprueban que los metadatos coinciden con los del módulo.
 */

import { canAccessDeck, getPlan, type Plan } from '../utils/plan';
import { getDeckRevision, type RecallRevision } from './recallReview';
import { canSeePendingDecks } from '../utils/revisionAccess';

export type { RecallRevision } from './recallReview';

/** Ficha de recuerdo tal como viene de los JSON limpios de cada tema. */
export interface RecallSourceCard {
  id: string;
  orden: number;
  concepto: string;
  respuesta: string;
  fuente: string;
  localizacion: string;
  apartado: string;
}

interface RecallDeckMeta {
  tema: number;
  lote?: string;
  title: string;
  count: number;
  source: string;
}

interface DeckSource {
  meta: RecallDeckMeta;
  load: () => Promise<readonly RecallSourceCard[]>;
}

export interface RecallDeck {
  /** Identificador estable: `tema40`, `tema36-lote01`… */
  id: string;
  /** Tema al que pertenece (`tema36`): agrupa los lotes en la interfaz. */
  topicId: string;
  tema: number;
  lote?: string;
  /** Etiqueta corta: `T40`, `T36·1`… */
  shortLabel: string;
  /** Etiqueta corta dentro de su tema: `Lote 1` (o la de `shortLabel` si no hay lotes). */
  loteLabel: string;
  /** Nombre legible: `tema 40`, `tema 36 lote 01`. */
  label: string;
  title: string;
  /** Nombre sin el prefijo «Tema N · » (para listas y selectores). */
  name: string;
  /** Procedencia de los datos (uso interno; no se muestra al opositor). */
  source: string;
  count: number;
  /** Revisión humana: solo los 'revisado' se publican al alumno (src/data/recallReview.ts). */
  revision: RecallRevision;
}

/** Bloque del temario (BOP Badajoz n.º 135/2026, anexo I): temas 1-7 parte común, 8-40 parte específica. */
export type RecallBloqueId = 'comun' | 'especifica';

export interface RecallTopic {
  /** `tema35`, `tema36`… */
  id: string;
  tema: number;
  bloque: RecallBloqueId;
  shortLabel: string;
  /** «Tema 36 (todos los lotes)» si tiene lotes; si no, el título del mazo. */
  title: string;
  name: string;
  count: number;
  decks: readonly RecallDeck[];
}

/** Nombre de los temas que se cargan por lotes (bloque del temario, tema36_lotes.md). */
const TOPIC_NAMES: Record<number, string> = {
  34: 'Reglamento de seguridad contra incendios en los establecimientos industriales (RD 164/2025)',
  36: 'Territorio de la provincia de Badajoz: municipios, límites, orografía e hidrografía',
};

const DECK_SOURCES: readonly DeckSource[] = [
  {
    meta: {
      tema: 27,
      lote: 'lote02',
      title: "Tema 27 · lote 2: respuesta de los elementos constructivos al fuego (CTE DB SI: SI 6, SI 1 y anejo A; RD 842/2013)",
      count: 30,
      source: "Hueco «respuesta de los elementos constructivos al fuego» · CTE DB SI (codigotecnico.org, consolidado hasta RD 164/2025) y RD 842/2013 (BOE-A-2013-12323)",
    },
    load: () => import('./tema27Lote02Recall').then((m) => m.TEMA27_LOTE02_RECALL_CARDS),
  },
  {
    meta: {
      tema: 28,
      lote: 'lote02',
      title: "Tema 28 · lote 2: alumbrado público, puesta a tierra, contactos, alta tensión y efectos de la corriente (REBT, RD 337/2014, RD 614/2001 y NTP 400)",
      count: 74,
      source: "Huecos CEP 38 · REBT (ITC-BT-09, 18 y 24), RD 337/2014 (ITC-RAT 01, 14 y 15), RD 614/2001 y NTP 400 (INSST); boe.es e insst.es",
    },
    load: () => import('./tema28Lote02Recall').then((m) => m.TEMA28_LOTE02_RECALL_CARDS),
  },
  {
    meta: {
      tema: 21,
      lote: 'lote02',
      title: "Tema 21 · lote 2: técnicas de corte y vehículos eléctricos, híbridos y a gas (Manual básico de rescate, DGT)",
      count: 73,
      source: "Huecos CEP · Manual básico de rescate en accidentes de tráfico (DGT-APRAT, 2019), dgt.es",
    },
    load: () => import('./tema21Lote02Recall').then((m) => m.TEMA21_LOTE02_RECALL_CARDS),
  },
  {
    meta: {
      tema: 15,
      title: "Tema 15 · Material de rescate: eslingas y accesorios de elevación, máquinas y herramientas portátiles, generadores (fuentes oficiales gratuitas: INSST, RD 1644/2008, RD 1215/1997 e ITC-BT-40)",
      count: 92,
      source: "Huecos CEP · INSST (NTP 221, 841 y 842; Guía técnica de equipos de trabajo), RD 1644/2008, RD 1215/1997 y REBT ITC-BT-40; boe.es e insst.es",
    },
    load: () => import('./tema15Recall').then((m) => m.TEMA15_RECALL_CARDS),
  },
  {
    meta: {
      tema: 13,
      lote: 'lote02',
      title: "Tema 13 · lote 2: protección respiratoria y equipos autónomos (INSST: NTP 787, fichas de selección y uso y Guía técnica de EPI)",
      count: 47,
      source: "Huecos CEP · INSST (NTP 787, FSU Filtros, FSU Equipos respiratorios aislantes y Guía técnica de EPI), insst.es",
    },
    load: () => import('./tema13Lote02Recall').then((m) => m.TEMA13_LOTE02_RECALL_CARDS),
  },
  {
    meta: {
      tema: 10,
      lote: 'lote02',
      title: "Tema 10 · lote 2: abastecimiento de agua y uso de BIE (NTP 420 y NTP 1035 del INSST)",
      count: 13,
      source: "Fase 5 · INSST, NTP 420 (1996) y NTP 1035 (2015), insst.es",
    },
    load: () => import('./tema10Lote02Recall').then((m) => m.TEMA10_LOTE02_RECALL_CARDS),
  },
  {
    meta: {
      tema: 12,
      lote: 'lote02',
      title: "Tema 12 · lote 2: métodos de extinción y uso de extintores (NTP 99 y NTP 536 del INSST)",
      count: 23,
      source: "Fase 5 · INSST, NTP 99 (1984) y NTP 536 (1999), insst.es",
    },
    load: () => import('./tema12Lote02Recall').then((m) => m.TEMA12_LOTE02_RECALL_CARDS),
  },
  {
    meta: {
      tema: 22,
      lote: 'lote02',
      title: "Tema 22 · lote 2: anclajes, líneas de vida, factor de caída y sistemas anticaídas (NTP 809, 843, 1170 y 1218 del INSST)",
      count: 27,
      source: "Fase 5 · INSST, NTP 809 (2008), NTP 843 (2009), NTP 1170 (2022) y NTP 1218 (2025), insst.es",
    },
    load: () => import('./tema22Lote02Recall').then((m) => m.TEMA22_LOTE02_RECALL_CARDS),
  },
  {
    meta: {
      tema: 34,
      lote: 'lote03',
      title: "Tema 34 · RD 164/2025 (RSCIEI), lote 3: requisitos constructivos (anexo II), extinción automática y control de humos (anexo III, 7 y 8) y zonas particulares (anexo IV)",
      count: 35,
      source: "Fase 5 · texto consolidado BOE-A-2025-7190 (reglamento, anexos II, III apdos. 7-8 y IV; últ. act. 20/12/2025)",
    },
    load: () => import('./tema34Lote03Recall').then((m) => m.TEMA34_LOTE03_RECALL_CARDS),
  },
  {
    meta: {
      tema: 28,
      title: "Tema 28 · Electricidad: riesgo eléctrico, redes y procedimientos (RD 614/2001, REBT y RLAT)",
      count: 29,
      source: "Fase 4 · RD 614/2001 (BOE-A-2001-11881) y REBT (BOE-A-2002-18099), últ. act. 18/12/2025; RD 223/2008 (BOE-A-2008-5269), últ. act. 19/12/2025",
    },
    load: () => import('./tema28Recall').then((m) => m.TEMA28_RECALL_CARDS),
  },
  {
    meta: {
      tema: 12,
      title: "Tema 12 · Mecanismos de extinción, agentes y extintores (RIPCI e INSST)",
      count: 21,
      source: "Fase 4 · RD 513/2017, RIPCI (BOE-A-2017-6606), últ. act. 19/12/2025; INSST, tema «El riesgo de incendio (I)» (v. abril 2025)",
    },
    load: () => import('./tema12Recall').then((m) => m.TEMA12_RECALL_CARDS),
  },
  {
    meta: {
      tema: 10,
      title: "Tema 10 · Abastecimiento de agua, hidrantes, BIE y columnas secas (RIPCI)",
      count: 34,
      source: "Fase 4 · RD 513/2017, RIPCI (BOE-A-2017-6606), últ. act. 19/12/2025, anexo I sección 1.ª",
    },
    load: () => import('./tema10Recall').then((m) => m.TEMA10_RECALL_CARDS),
  },
  {
    meta: {
      tema: 8,
      title: "Tema 8 · Teoría del fuego y explosiones (documentos del INSST)",
      count: 25,
      source: "Fase 4 · INSST, temas oficiales del proceso selectivo: «El riesgo de incendio (I)» (v. abril 2025) y «Explosiones» (2026), insst.es",
    },
    load: () => import('./tema8Recall').then((m) => m.TEMA8_RECALL_CARDS),
  },
  {
    meta: {
      tema: 9,
      title: "Tema 9 · Hidráulica: fluidos, Bernoulli, descarga, pérdidas de carga y bombas centrífugas (BOE, INSST, IDAE/MITECO, CTE, UE)",
      count: 84,
      source: "Fase 2 · fuentes oficiales: RD 2032/2009, RD 709/2015 y RIPCI (BOE), NTP 362 (INSST), guía técnica de bombas del IDAE (documento reconocido del RITE, miteco.gob.es), CTE DB HS 4 (codigotecnico.org) y Reglamento (UE) 547/2012 (EUR-Lex)",
    },
    load: () => import('./tema9Recall').then((m) => m.TEMA9_RECALL_CARDS),
  },
  {
    meta: {
      tema: 14,
      title: "Tema 14 · Vehículos prioritarios y de servicios auxiliares: RGC, RGV y RD 159/2021",
      count: 24,
      source: "Fase 3 · RGC (BOE-A-2003-23514) y RGV (BOE-A-1999-1826), últ. act. 01/10/2026; RD 159/2021 (BOE-A-2021-4194), últ. act. 20/12/2025",
    },
    load: () => import('./tema14Recall').then((m) => m.TEMA14_RECALL_CARDS),
  },
  {
    meta: {
      tema: 16,
      lote: 'lote02',
      title: "Tema 16 · Comunicaciones, lote 2: fundamentos, servicios, estaciones y modalidades (RR UIT 2024)",
      count: 21,
      source: "Fase 3 · Reglamento de Radiocomunicaciones de la UIT, edición de 2024, vol. 1 (arts. 1 y 2), versión oficial en español",
    },
    load: () => import('./tema16Lote02Recall').then((m) => m.TEMA16_LOTE02_RECALL_CARDS),
  },
  {
    meta: {
      tema: 27,
      title: "Tema 27 · Edificación: acciones y estados límite (CTE DB SE y DB SE-AE)",
      count: 22,
      source: "Fase 3 · CTE DB SE (RD 732/2019) y DB SE-AE (Orden VIV/984/2009), textos consolidados del Ministerio en codigotecnico.org",
    },
    load: () => import('./tema27Recall').then((m) => m.TEMA27_RECALL_CARDS),
  },
  {
    meta: {
      tema: 23,
      title: "Tema 23 · Inundaciones: Plan Estatal de Protección Civil ante el Riesgo de Inundaciones",
      count: 21,
      source: "Fase 3 · texto consolidado BOE-A-2011-14277 (Plan Estatal de Inundaciones; últ. act. 19/12/2025)",
    },
    load: () => import('./tema23Recall').then((m) => m.TEMA23_RECALL_CARDS),
  },
  {
    meta: {
      tema: 24,
      title: "Tema 24 · Marco legal: RD 630/2013, Catálogo español de especies exóticas invasoras",
      count: 19,
      source: "Fase 3 · texto consolidado BOE-A-2013-8565 (RD 630/2013; últ. act. 19/12/2025)",
    },
    load: () => import('./tema24Recall').then((m) => m.TEMA24_RECALL_CARDS),
  },
  {
    meta: {
      tema: 20,
      title: "Tema 20 · Incendios forestales: Plan INFOEX (Decreto 132/2022, mod. 136/2024)",
      count: 24,
      source: "Fase 3 · Plan INFOEX: artículos 6, 7, 10-13 y 16 del Decreto 132/2022 en la redacción del Decreto 136/2024 (DOE nº 215, 05/11/2024)",
    },
    load: () => import('./tema20Recall').then((m) => m.TEMA20_RECALL_CARDS),
  },
  {
    meta: {
      tema: 5,
      title: "Tema 5 · Reglamento de Régimen Interno del CPEI de Badajoz",
      count: 28,
      source: "Fase 3 · Reglamento de Régimen Interno del CPEI, texto único vigente (BOP Badajoz nº 149, anuncio 5370/2012, 06/08/2012)",
    },
    load: () => import('./tema5Recall').then((m) => m.TEMA5_RECALL_CARDS),
  },
  {
    meta: {
      tema: 4,
      title: "Tema 4 · Estructura orgánica de la Diputación de Badajoz (acuerdo de 29/10/2025)",
      count: 28,
      source: "Fase 3 · acuerdo de reorganización de la estructura orgánica (BOP Badajoz nº 206, anuncio 4611/2025, 29/10/2025)",
    },
    load: () => import('./tema4Recall').then((m) => m.TEMA4_RECALL_CARDS),
  },
  {
    meta: {
      tema: 13,
      title: "Tema 13 · Equipos de protección individual: RD 773/1997 y Reglamento (UE) 2016/425",
      count: 25,
      source: "Fase 3 · RD 773/1997 (BOE-A-1997-12735, últ. act. 18/12/2025) y Reglamento (UE) 2016/425 (EUR-Lex)",
    },
    load: () => import('./tema13Recall').then((m) => m.TEMA13_RECALL_CARDS),
  },
  {
    meta: {
      tema: 17,
      title: "Tema 17 · Socorrismo: desfibriladores fuera del ámbito sanitario (RD 365/2009)",
      count: 14,
      source: "Fase 3 · RD 365/2009 (BOE-A-2009-5490, texto original sin modificaciones)",
    },
    load: () => import('./tema17Recall').then((m) => m.TEMA17_RECALL_CARDS),
  },
  {
    meta: {
      tema: 21,
      title: "Tema 21 · Accidentes de tráfico: Procedimiento Unificado de Rescate (Manual básico DGT)",
      count: 42,
      source: "Fase 3 · Manual básico de rescate en accidentes de tráfico (DGT-APRAT, 2019), PDF oficial en dgt.es",
    },
    load: () => import('./tema21Recall').then((m) => m.TEMA21_RECALL_CARDS),
  },
  {
    meta: {
      tema: 22,
      title: "Tema 22 · Trabajos temporales en altura: RD 1215/1997, anexo II.4",
      count: 33,
      source: "Fase 3 · texto consolidado BOE-A-1997-17824 (RD 1215/1997, anexo II.4; últ. act. 18/12/2025)",
    },
    load: () => import('./tema22Recall').then((m) => m.TEMA22_RECALL_CARDS),
  },
  {
    meta: {
      tema: 25,
      title: "Tema 25 · Mercancías peligrosas: ADR 2025 (conceptos, cisternas, panel naranja, placas-etiquetas y actuación)",
      count: 47,
      source: "Fase 3 · ADR 2025, Anejos A y B (BOE-A-2025-77, BOE nº 3 de 03/01/2025)",
    },
    load: () => import('./tema25Recall').then((m) => m.TEMA25_RECALL_CARDS),
  },
  {
    meta: {
      tema: 26,
      title: "Tema 26 · Guías INSARAG Vol. II, Manual B: Operaciones",
      count: 60,
      source: "Fase 3 · Guías INSARAG 2020, Vol. II, Manual B: Operaciones (ONU-OCHA, versión oficial en español)",
    },
    load: () => import('./tema26Recall').then((m) => m.TEMA26_RECALL_CARDS),
  },
  {
    meta: {
      tema: 34,
      lote: 'lote02',
      title: "Tema 34 · RD 164/2025 (RSCIEI), lote 2: instalaciones de protección activa (anexo III)",
      count: 39,
      source: "Fase 3 · texto consolidado BOE-A-2025-7190 (reglamento, anexo III; últ. act. 20/12/2025)",
    },
    load: () => import('./tema34Lote02Recall').then((m) => m.TEMA34_LOTE02_RECALL_CARDS),
  },
  {
    meta: {
      tema: 34,
      lote: 'lote01',
      title: "Tema 34 · RD 164/2025 (RSCIEI), lote 1: articulado y caracterización (anexo I)",
      count: 58,
      source: "Fase 3 · texto consolidado BOE-A-2025-7190 (reglamento, arts. 1-18 y anexo I; últ. act. 20/12/2025)",
    },
    load: () => import('./tema34Lote01Recall').then((m) => m.TEMA34_LOTE01_RECALL_CARDS),
  },
  {
    meta: {
      tema: 32,
      title: "Tema 32 · CTE: objeto, ámbito, exigencias básicas SI y SUA, DB SI (SI 4 y SI 5) y DB SUA (SUA 4 y SUA 7)",
      count: 91,
      source: "Fase 2-3 · CTE Parte I (BOE-A-2006-5515, últ. act. 15/06/2022) y DB SI / DB SUA consolidados del Ministerio (codigotecnico.org)",
    },
    load: () => import('./tema32Recall').then((m) => m.TEMA32_RECALL_CARDS),
  },
  {
    meta: {
      tema: 30,
      title: "Tema 30 · Planes especiales de Extremadura: INUNCAEX, TRANSCAEX, RADIOCAEX y PLASISMEX",
      count: 87,
      source: "Fase 3 · textos íntegros oficiales en juntaex.es de INUNCAEX (Decreto 39/2025), TRANSCAEX (Decreto 189/2019), RADIOCAEX (Decreto 200/2019) y PLASISMEX (Decreto 127/2009)",
    },
    load: () => import('./tema30Recall').then((m) => m.TEMA30_RECALL_CARDS),
  },
  {
    meta: {
      tema: 29,
      title: "Tema 29 · PLATERCAEX: objetivo, alcance, estructura y operatividad",
      count: 81,
      source: "Fase 3 · PLATERCAEX (Decreto 187/2019, DOE nº 247 de 26/12/2019), texto íntegro oficial en juntaex.es (PDF de 31/01/2020)",
    },
    load: () => import('./tema29Recall').then((m) => m.TEMA29_RECALL_CARDS),
  },
  {
    meta: {
      tema: 2,
      title: "Tema 2 · El Estatuto de Autonomía de Extremadura",
      count: 121,
      source: "Fase 2 · texto consolidado BOE-A-2011-1638 (Estatuto, arts. 1-48; sin modificaciones registradas desde 29/01/2011)",
    },
    load: () => import('./tema2Recall').then((m) => m.TEMA2_RECALL_CARDS),
  },
  {
    meta: {
      tema: 33,
      title: "Tema 33 · RIPCI (RD 513/2017): abastecimiento de agua, hidrantes, BIE y columna seca",
      count: 67,
      source: "Fase 2 · texto consolidado BOE-A-2017-6606 (arts. 1-2 y anexo I, apdos. 2, 3, 5 y 6; últ. act. 03/09/2025)",
    },
    load: () => import('./tema33Recall').then((m) => m.TEMA33_RECALL_CARDS),
  },
  {
    meta: {
      tema: 7,
      title: "Tema 7 · Ley 8/2011 de Igualdad y contra la violencia de género en Extremadura",
      count: 64,
      source: "Fase 2 · texto consolidado BOE-A-2011-6651 (Tít. Preliminar, Tít. II y Tít. IV cap. II; sin modificaciones registradas desde 25/03/2011)",
    },
    load: () => import('./tema7Recall').then((m) => m.TEMA7_RECALL_CARDS),
  },
  {
    meta: {
      tema: 1,
      title: "Tema 1 · La Constitución Española de 1978: Título Preliminar y Título I",
      count: 129,
      source: "Fase 2 · texto consolidado BOE-A-1978-31229 (arts. 1-55; últ. act. 20/05/2026)",
    },
    load: () => import('./tema1Recall').then((m) => m.TEMA1_RECALL_CARDS),
  },
  {
    meta: {
      tema: 6,
      title: "Tema 6 · Ley 31/1995 de Prevención de Riesgos Laborales",
      count: 94,
      source: "Fase 2 · texto consolidado BOE-A-1995-24292 (caps. I-IV, arts. 1-32 bis; últ. act. 09/04/2026)",
    },
    load: () => import('./tema6Recall').then((m) => m.TEMA6_RECALL_CARDS),
  },
  {
    meta: {
      tema: 31,
      title: "Tema 31 · RD 1215/1997: utilización de los equipos de trabajo",
      count: 83,
      source: "Fase 2 · texto consolidado BOE-A-1997-17824 (arts. 1-6, disposiciones y anexos I-II; últ. act. 13/11/2004)",
    },
    load: () => import('./tema31Recall').then((m) => m.TEMA31_RECALL_CARDS),
  },
  {
    meta: {
      tema: 3,
      title: "Tema 3 · LBRL: la Provincia (organización y competencias)",
      count: 66,
      source: "Fase 2 · texto consolidado BOE-A-1985-5392 (Título III, arts. 31-38; últ. act. 03/10/2026)",
    },
    load: () => import('./tema3Recall').then((m) => m.TEMA3_RECALL_CARDS),
  },
  {
    meta: {
      tema: 16,
      title: 'Tema 16 · El código ICAO (alfabeto radiotelefónico) y códigos Q de la UIT',
      count: 48,
      source: 'BASE MIRA tema 16, subconjunto OACI/UIT revisado ficha a ficha (RR UIT 2024 ap. 14 y art. 32/53, Rec. UIT-R M.1172, OACI Anexo 10 vol. II)',
    },
    load: () => import('./tema16Recall').then((m) => m.TEMA16_RECALL_CARDS),
  },
  {
    meta: {
      tema: 35,
      title: 'Tema 35 · Red de carreteras de Extremadura (provincia de Badajoz)',
      count: 150,
      source: 'Decreto 98/2008 + Extremadura en Cifras (JSON limpio score 100%)',
    },
    load: () => import('./tema35Recall').then((m) => m.TEMA35_RECALL_CARDS),
  },
  {
    meta: {
      tema: 36,
      lote: 'lote01',
      title: 'Tema 36 · Lote 01 — Núcleo de examen: marco, municipios clave, oro/hidro/embalses',
      count: 78,
      source: 'tema36_fichas.json + tema36_lotes.json',
    },
    load: () => import('./tema36Lote01Recall').then((m) => m.TEMA36_LOTE01_RECALL_CARDS),
  },
  {
    meta: {
      tema: 36,
      lote: 'lote02',
      title: 'Tema 36 · Lote 02 — Municipios restantes (INE + población ≤5.000): Acedera → Esparragosa de Lares',
      count: 79,
      source: 'tema36_fichas.json + tema36_lotes.json',
    },
    load: () => import('./tema36Lote02Recall').then((m) => m.TEMA36_LOTE02_RECALL_CARDS),
  },
  {
    meta: {
      tema: 36,
      lote: 'lote03',
      title: 'Tema 36 · Lote 03 — Municipios restantes (INE + población ≤5.000): Esparragosa de la Serena → Nogales',
      count: 78,
      source: 'tema36_fichas.json + tema36_lotes.json',
    },
    load: () => import('./tema36Lote03Recall').then((m) => m.TEMA36_LOTE03_RECALL_CARDS),
  },
  {
    meta: {
      tema: 36,
      lote: 'lote04',
      title: 'Tema 36 · Lote 04 — Municipios restantes (INE + población ≤5.000): Oliva de Mérida → Táliga',
      count: 78,
      source: 'tema36_fichas.json + tema36_lotes.json',
    },
    load: () => import('./tema36Lote04Recall').then((m) => m.TEMA36_LOTE04_RECALL_CARDS),
  },
  {
    meta: {
      tema: 36,
      lote: 'lote05',
      title: 'Tema 36 · Lote 05 — Municipios restantes (INE + población ≤5.000): Usagre → Zarza-Capilla',
      count: 50,
      source: 'tema36_fichas.json + tema36_lotes.json',
    },
    load: () => import('./tema36Lote05Recall').then((m) => m.TEMA36_LOTE05_RECALL_CARDS),
  },
  {
    meta: {
      tema: 36,
      lote: 'lote06',
      title: 'Tema 36 · Lote 06 — Límites administrativos: Acedera → Granja de Torrehermosa',
      count: 55,
      source: 'tema36_fichas.json + tema36_lotes.json',
    },
    load: () => import('./tema36Lote06Recall').then((m) => m.TEMA36_LOTE06_RECALL_CARDS),
  },
  {
    meta: {
      tema: 36,
      lote: 'lote07',
      title: 'Tema 36 · Lote 07 — Límites administrativos: Guadiana → Puebla de Sancho Pérez',
      count: 55,
      source: 'tema36_fichas.json + tema36_lotes.json',
    },
    load: () => import('./tema36Lote07Recall').then((m) => m.TEMA36_LOTE07_RECALL_CARDS),
  },
  {
    meta: {
      tema: 36,
      lote: 'lote08',
      title: 'Tema 36 · Lote 08 — Límites administrativos: Puebla del Maestre → Zarza-Capilla',
      count: 55,
      source: 'tema36_fichas.json + tema36_lotes.json',
    },
    load: () => import('./tema36Lote08Recall').then((m) => m.TEMA36_LOTE08_RECALL_CARDS),
  },
  {
    meta: {
      tema: 38,
      title: 'Tema 38 · ITF CPEI: horario, vestuario/EPIs, limpieza y gestión de EPIs colectivos',
      count: 198,
      source: 'ITF oficiales CPEI (Horario 2022, Vestuario/Limpieza/Gestión EPIs 2026) rebuild desde PDFs',
    },
    load: () => import('./tema38Recall').then((m) => m.TEMA38_RECALL_CARDS),
  },
  {
    meta: {
      tema: 39,
      title: 'Tema 39 · Protocolo de movilización CPEI + SOS operativo + SOS personal',
      count: 149,
      source: 'Protocolo movilización BOP 224/2025 + SOS operativo/personal (rebuild desde PDFs oficiales)',
    },
    load: () => import('./tema39Recall').then((m) => m.TEMA39_RECALL_CARDS),
  },
  {
    meta: {
      tema: 40,
      title: 'Tema 40 · Procedimientos de trabajo CPEI-Badajoz',
      count: 213,
      source: 'PT01 conducción (26) + PT03 amianto oficial (187)',
    },
    load: () => import('./tema40Recall').then((m) => m.TEMA40_RECALL_CARDS),
  },
];

function defineDeck(meta: RecallDeckMeta): RecallDeck {
  const loteNumber = meta.lote ? meta.lote.replace(/^lote/i, '') : undefined;
  const shortLabel = `T${meta.tema}${loteNumber ? `·${Number(loteNumber)}` : ''}`;
  return {
    id: `tema${meta.tema}${meta.lote ? `-${meta.lote}` : ''}`,
    topicId: `tema${meta.tema}`,
    tema: meta.tema,
    lote: meta.lote,
    shortLabel,
    loteLabel: loteNumber ? `Lote ${Number(loteNumber)}` : shortLabel,
    label: `tema ${meta.tema}${loteNumber ? ` lote ${loteNumber}` : ''}`,
    title: meta.title,
    name: meta.title.replace(/^Tema\s+\d+\s*·\s*/, ''),
    source: meta.source,
    count: meta.count,
    revision: getDeckRevision(`tema${meta.tema}${meta.lote ? `-${meta.lote}` : ''}`),
  };
}

const LOADERS = new Map<string, DeckSource['load']>();

/** Todos los mazos registrados, ordenados por tema y lote (solo metadatos). */
export const RECALL_DECKS: readonly RecallDeck[] = DECK_SOURCES.map((src) => {
  const deck = defineDeck(src.meta);
  if (LOADERS.has(deck.id)) throw new Error(`Mazo de recuerdo duplicado: ${deck.id}`);
  LOADERS.set(deck.id, src.load);
  return deck;
}).sort((a, b) => a.tema - b.tema || (a.lote ?? '').localeCompare(b.lote ?? ''));

const BLOQUE_LABELS: Record<RecallBloqueId, string> = { comun: 'Parte común', especifica: 'Parte específica' };

/** Bloque al que pertenece un tema del temario (1-7 común; 8-40 específica). */
export function bloqueDeTema(tema: number): RecallBloqueId {
  return tema <= 7 ? 'comun' : 'especifica';
}

/** Agrupa una lista de mazos por tema (los lotes de un mismo tema juntos). */
function buildTopics(deckList: readonly RecallDeck[]): RecallTopic[] {
  const byTema = new Map<number, RecallDeck[]>();
  for (const deck of deckList) {
    const list = byTema.get(deck.tema) ?? [];
    list.push(deck);
    byTema.set(deck.tema, list);
  }
  return [...byTema.entries()].map(([tema, decks]) => {
    const grouped = decks.some((d) => d.lote);
    return {
      id: `tema${tema}`,
      tema,
      bloque: bloqueDeTema(tema),
      shortLabel: `T${tema}`,
      title: grouped ? `Tema ${tema} (todos los lotes)` : decks[0].title,
      name: grouped ? TOPIC_NAMES[tema] ?? `Tema ${tema}` : decks[0].name,
      count: decks.reduce((n, d) => n + d.count, 0),
      decks,
    };
  });
}

/** Temas (agrupan los lotes de un mismo tema), ordenados por número de tema. TODOS los mazos. */
export const RECALL_TOPICS: readonly RecallTopic[] = buildTopics(RECALL_DECKS);

export interface RecallBloque {
  id: RecallBloqueId;
  /** «Parte común» / «Parte específica». */
  label: string;
  topics: readonly RecallTopic[];
  count: number;
}

function buildBloques(topics: readonly RecallTopic[]): RecallBloque[] {
  return (['comun', 'especifica'] as const)
    .map((id) => {
      const list = topics.filter((t) => t.bloque === id);
      return { id, label: BLOQUE_LABELS[id], topics: list, count: list.reduce((n, t) => n + t.count, 0) };
    })
    .filter((b) => b.topics.length > 0);
}

/** Temas agrupados por bloque del temario (solo los bloques con algún tema cargado). TODOS los mazos. */
export const RECALL_BLOQUES: readonly RecallBloque[] = buildBloques(RECALL_TOPICS);

// ---------------------------------------------------------------------------
// Vista publicada (P1): el alumno solo ve los mazos con revisión completa.
// El propietario / admin de revisión ve también los «pendientes de revisión».
// ---------------------------------------------------------------------------

/** Mazos con revisión humana completa. */
export const REVIEWED_RECALL_DECKS: readonly RecallDeck[] = RECALL_DECKS.filter((d) => d.revision === 'revisado');
const REVIEWED_TOPICS = buildTopics(REVIEWED_RECALL_DECKS);
const REVIEWED_BLOQUES = buildBloques(REVIEWED_TOPICS);

/** ¿Lo ve el usuario actual? Revisados siempre; pendientes solo propietario/admin. */
export function isDeckVisible(deck: RecallDeck): boolean {
  return deck.revision === 'revisado' || canSeePendingDecks();
}

/** Mazos que ve el usuario actual. */
export function getVisibleDecks(): readonly RecallDeck[] {
  return canSeePendingDecks() ? RECALL_DECKS : REVIEWED_RECALL_DECKS;
}

/** Temas que ve el usuario actual (un tema con lotes solo muestra sus lotes visibles). */
export function getVisibleTopics(): readonly RecallTopic[] {
  return canSeePendingDecks() ? RECALL_TOPICS : REVIEWED_TOPICS;
}

/** Bloques del temario que ve el usuario actual. */
export function getVisibleBloques(): readonly RecallBloque[] {
  return canSeePendingDecks() ? RECALL_BLOQUES : REVIEWED_BLOQUES;
}

/** Tema visible por id (`tema36`) o `undefined` si no existe o no se publica. */
export function getVisibleTopic(id: string): RecallTopic | undefined {
  return getVisibleTopics().find((t) => t.id === id);
}

/** Fichas visibles para el usuario actual. */
export function getVisibleTotalCards(): number {
  return getVisibleDecks().reduce((sum, d) => sum + d.count, 0);
}

export function getRecallDeck(id: string): RecallDeck {
  const deck = RECALL_DECKS.find((d) => d.id === id);
  if (!deck) throw new Error(`Mazo de recuerdo desconocido: ${id}`);
  return deck;
}

export function getRecallTopic(id: string): RecallTopic | undefined {
  return RECALL_TOPICS.find((t) => t.id === id);
}

/** Tema (`tema36`) de un id de tema o de mazo (`tema36-lote02` → `tema36`). */
export function toTopicId(id: string | null | undefined): string | null {
  if (!id) return null;
  if (getRecallTopic(id)) return id;
  return RECALL_DECKS.find((d) => d.id === id)?.topicId ?? null;
}

/** Total de fichas de recuerdo registradas en la app. */
export const RECALL_TOTAL_CARDS = RECALL_DECKS.reduce((sum, d) => sum + d.count, 0);

/** Mazos accesibles para el plan dado (por defecto, el plan actual). */
export function getAccessibleDecks(plan: Plan = getPlan()): readonly RecallDeck[] {
  return getVisibleDecks().filter((deck) => canAccessDeck(deck.id, plan));
}

/** Un tema es accesible si el plan incluye al menos uno de sus lotes. */
export function canAccessTopic(topic: RecallTopic, plan: Plan = getPlan()): boolean {
  return topic.decks.some((deck) => isDeckVisible(deck) && canAccessDeck(deck.id, plan));
}

const cardCache = new Map<string, readonly RecallSourceCard[]>();
const pending = new Map<string, Promise<readonly RecallSourceCard[]>>();

/** Fichas de un mazo ya cargado (o `undefined` si aún no se ha pedido). */
export function getLoadedDeckCards(id: string): readonly RecallSourceCard[] | undefined {
  return cardCache.get(id);
}

/** Carga (una sola vez) las fichas de un mazo: import dinámico de su módulo. */
export function loadRecallDeckCards(id: string): Promise<readonly RecallSourceCard[]> {
  const cached = cardCache.get(id);
  if (cached) return Promise.resolve(cached);
  const inFlight = pending.get(id);
  if (inFlight) return inFlight;
  const load = LOADERS.get(id);
  if (!load) return Promise.reject(new Error(`Mazo de recuerdo desconocido: ${id}`));
  const deck = getRecallDeck(id);
  const promise = load()
    .then((cards) => {
      if (cards.length !== deck.count) {
        throw new Error(`Mazo ${deck.label}: se esperaban ${deck.count} fichas y hay ${cards.length}`);
      }
      cardCache.set(id, cards);
      return cards;
    })
    .finally(() => pending.delete(id));
  pending.set(id, promise);
  return promise;
}

function joinEs(items: readonly string[]): string {
  return items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}`;
}

/** Resumen legible de los temas cargados: «16, 35, 36 (lotes 01 a 08), 38, 39 y 40». */
export function describeRecallCoverage(decks: readonly RecallDeck[] = RECALL_DECKS): string {
  const byTema = new Map<number, string[]>();
  for (const deck of decks) {
    const lotes = byTema.get(deck.tema) ?? [];
    if (deck.lote) lotes.push(deck.lote.replace(/^lote/i, ''));
    byTema.set(deck.tema, lotes);
  }
  const parts = [...byTema.entries()]
    .sort(([a], [b]) => a - b)
    .map(([tema, lotes]) => {
      if (lotes.length === 0) return String(tema);
      if (lotes.length === 1) return `${tema} (lote ${lotes[0]})`;
      const nums = lotes.map(Number).sort((a, b) => a - b);
      const consecutive = nums.every((n, i) => i === 0 || n === nums[i - 1] + 1);
      const sorted = [...lotes].sort();
      return consecutive
        ? `${tema} (lotes ${sorted[0]} a ${sorted[sorted.length - 1]})`
        : `${tema} (lotes ${joinEs(sorted)})`;
    });
  return joinEs(parts);
}
