import RecallDeck from './RecallDeck';
import { getRecallDeck } from '../data/recallRegistry';

interface Tema36Lote01RecallProps {
  onNavigateHome: () => void;
}

/**
 * Recuerdo del tema 36 lote 01: flashcards locales (78). No carga los 528 del tema 36 ni lotes 02–08.
 * Envoltorio del visor genérico: los datos salen del registro central (src/data/recallRegistry.ts).
 */
export default function Tema36Lote01Recall({ onNavigateHome }: Tema36Lote01RecallProps) {
  return <RecallDeck deck={getRecallDeck('tema36-lote01')} onNavigateHome={onNavigateHome} />;
}
