import { createContext, useContext } from 'react';
import { FileText } from 'lucide-react';
import { destinoMaterial, type DestinoMaterial } from '../utils/materialEnContexto';

/** Lo da App: abre «Material por tema» encima de la pantalla actual (que no se desmonta) con el destino. */
export type AbrirMaterial = (d: DestinoMaterial, origen: string) => void;
export const AbrirMaterialContext = createContext<AbrirMaterial | null>(null);
export const useAbrirMaterial = () => useContext(AbrirMaterialContext);

/**
 * «Ver en el esquema del tema» bajo una ficha o un fallo (01/11/2026). Solo aparece si el tema tiene
 * material; el artículo se resalta solo si la coincidencia es verificable (src/utils/materialEnContexto.ts).
 */
export default function VerEnEsquema({ tema, fuente, origen, className = '' }: {
  tema: number | null | undefined;
  fuente?: string | null;
  /** «esta ficha», «este fallo»: se dice arriba del material. */
  origen: string;
  className?: string;
}) {
  const abrir = useAbrirMaterial();
  const d = destinoMaterial(tema, fuente);
  if (!abrir || !d) return null;
  return (
    <button type="button" onClick={() => abrir(d, origen)} data-ver-esquema={d.precepto ?? 'tema'}
      aria-label={`Ver en el esquema del tema ${d.tema}${d.etiqueta ? ` (${d.etiqueta})` : ''}`}
      className={`inline-flex min-h-11 items-center gap-1 rounded-lg border border-[#1E3A5F] bg-white px-3 py-1.5 text-xs font-semibold text-[#1E3A5F] hover:bg-slate-100 ${className}`}>
      <FileText className="h-3.5 w-3.5" aria-hidden="true" /> Ver en el esquema del tema
    </button>
  );
}
