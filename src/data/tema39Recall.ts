/**
 * Tema 39 recall cards — local subset (149). Do not invent cards or load tema 36/37.
 * Las fichas están repartidas en dos módulos: ./tema39PublicoRecall (protocolo del BOP 224/2025, 107)
 * y ./tema39SosRecall (plataforma SOS, material interno, 42). Este módulo las une en el orden original.
 */
import { TEMA39_PUBLICO_RECALL_CARDS } from './tema39PublicoRecall';
import { TEMA39_SOS_RECALL_CARDS } from './tema39SosRecall';

export type Tema39RecallCard = {
  id: string;
  orden: number;
  concepto: string;
  respuesta: string;
  fuente: string;
  localizacion: string;
  apartado: string;
};

export const TEMA39_RECALL_META = {
  tema: 39,
  title: "Tema 39 · Protocolo de movilización CPEI + SOS operativo + SOS personal",
  count: 149,
  source: "Protocolo movilización BOP 224/2025 + SOS operativo/personal (rebuild desde PDFs oficiales)",
} as const;

export const TEMA39_RECALL_CARDS: Tema39RecallCard[] = [...TEMA39_PUBLICO_RECALL_CARDS, ...TEMA39_SOS_RECALL_CARDS];
