/**
 * Contexto para abrir «Material por tema» encima de la pantalla actual (rendimiento-2, 01/11/2026).
 * Va aparte de VerEnEsquema para que App lo use sin arrastrar al JS inicial el registro del material
 * (materialTemas, materialPreceptos y materialEnContexto), que solo hace falta al pintar una ficha o un fallo.
 */
import { createContext, useContext } from 'react';
import type { DestinoMaterial } from '../utils/materialEnContexto';

/** Lo da App: abre «Material por tema» encima de la pantalla actual (que no se desmonta) con el destino. */
export type AbrirMaterial = (d: DestinoMaterial, origen: string) => void;
export const AbrirMaterialContext = createContext<AbrirMaterial | null>(null);
export const useAbrirMaterial = () => useContext(AbrirMaterialContext);
