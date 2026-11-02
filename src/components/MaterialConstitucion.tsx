import React from 'react';
import MaterialTema from './MaterialTema';

/** Pantalla «Material por tema» (nació como piloto de la Constitución, tema 1). */
export default function MaterialConstitucion({ userId, onExit, tema = 1, volverLabel }: { userId: string; onExit: () => void; tema?: number; volverLabel?: string }) {
  return <MaterialTema userId={userId} onExit={onExit} tema={tema} volverLabel={volverLabel} />;
}
