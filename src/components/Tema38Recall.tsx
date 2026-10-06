import RecallDeck from './RecallDeck';
import { getRecallDeck } from '../data/recallRegistry';

interface Tema38RecallProps {
  onNavigateHome: () => void;
}

/**
 * Recuerdo del tema 38: flashcards locales (198), rebuild desde PDFs ITF oficiales.
 * Envoltorio del visor genérico: los datos salen del registro central (src/data/recallRegistry.ts).
 */
export default function Tema38Recall({ onNavigateHome }: Tema38RecallProps) {
  return <RecallDeck deck={getRecallDeck('tema38')} onNavigateHome={onNavigateHome} />;
}
