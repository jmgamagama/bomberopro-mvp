import RecallDeck from './RecallDeck';
import { getRecallDeck } from '../data/recallRegistry';

interface Tema40RecallProps {
  onNavigateHome: () => void;
}

/**
 * Recuerdo del tema 40: flashcards locales (213 = 26 PT01 + 187 PT03). No carga el banco completo MIRA (9392).
 * Envoltorio del visor genérico: los datos salen del registro central (src/data/recallRegistry.ts).
 */
export default function Tema40Recall({ onNavigateHome }: Tema40RecallProps) {
  return <RecallDeck deck={getRecallDeck('tema40')} onNavigateHome={onNavigateHome} />;
}
