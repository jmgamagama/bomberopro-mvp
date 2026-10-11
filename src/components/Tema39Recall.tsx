import RecallDeck from './RecallDeck';
import { getRecallDeck } from '../data/recallRegistry';

interface Tema39RecallProps {
  onNavigateHome: () => void;
}

/**
 * Recuerdo del tema 39: flashcards locales (149), Protocolo movilización BOP 224/2025 + SOS.
 * Envoltorio del visor genérico: los datos salen del registro central (src/data/recallRegistry.ts).
 */
export default function Tema39Recall({ onNavigateHome }: Tema39RecallProps) {
  return <RecallDeck deck={getRecallDeck('tema39')} onNavigateHome={onNavigateHome} />;
}
