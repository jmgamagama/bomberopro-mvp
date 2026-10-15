import RecallDeck from './RecallDeck';
import { getRecallDeck } from '../data/recallRegistry';

interface Tema36Lote02RecallProps {
  onNavigateHome: () => void;
}

/**
 * Recuerdo del tema 36 lote 02: flashcards locales (79). No carga los 528 del tema 36, ni el lote 01 ni los lotes 03–08.
 * Envoltorio del visor genérico: los datos salen del registro central (src/data/recallRegistry.ts).
 */
export default function Tema36Lote02Recall({ onNavigateHome }: Tema36Lote02RecallProps) {
  return <RecallDeck deck={getRecallDeck('tema36-lote02')} onNavigateHome={onNavigateHome} />;
}
