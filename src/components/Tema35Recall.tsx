import RecallDeck from './RecallDeck';
import { getRecallDeck } from '../data/recallRegistry';

interface Tema35RecallProps {
  onNavigateHome: () => void;
}

/**
 * Recuerdo del tema 35: flashcards locales (150). No carga tema 36 (528) ni el banco completo MIRA (9392).
 * Envoltorio del visor genérico: los datos salen del registro central (src/data/recallRegistry.ts).
 */
export default function Tema35Recall({ onNavigateHome }: Tema35RecallProps) {
  return <RecallDeck deck={getRecallDeck('tema35')} onNavigateHome={onNavigateHome} />;
}
