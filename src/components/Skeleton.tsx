/**
 * Esqueleto de carga discreto y accesible: bloques grises (sin animación si el sistema pide
 * menos movimiento) y el texto de estado solo para lectores de pantalla, anunciado con role=status.
 */
interface SkeletonProps {
  label: string;
  /** Número de barras de texto. */
  lines?: number;
  /** Bloque alto inicial (tarjeta o título). */
  block?: boolean;
  className?: string;
}

const WIDTHS = ['w-11/12', 'w-4/5', 'w-2/3', 'w-3/4', 'w-1/2'];

export default function Skeleton({ label, lines = 3, block = true, className = '' }: SkeletonProps) {
  return (
    <div role="status" aria-live="polite" aria-busy="true" className={`mx-auto w-full max-w-2xl ${className}`}>
      <span className="sr-only">{label}</span>
      <div aria-hidden="true" className="space-y-3 animate-pulse motion-reduce:animate-none">
        {block && <div className="h-7 w-3/4 rounded-lg bg-slate-200" />}
        {Array.from({ length: lines }, (_, i) => (
          <div key={i} className={`h-4 rounded bg-slate-200 ${WIDTHS[i % WIDTHS.length]}`} />
        ))}
      </div>
    </div>
  );
}
