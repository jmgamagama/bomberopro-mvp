import React from 'react';
import MaterialTema from './MaterialTema';

/** Piloto Constitución (tema 1): ahora es la pantalla general de material abierta en el tema 1. */
export default function MaterialConstitucion({ userId, onExit }: { userId: string; onExit: () => void }) {
  return <MaterialTema userId={userId} onExit={onExit} tema={1} />;
}
