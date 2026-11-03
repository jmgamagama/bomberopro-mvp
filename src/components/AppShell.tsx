import { CONVOCATORIA_CPEI_2026 as C } from '../data/convocatoria';

/**
 * Mismo shell que pinta index.html antes del JS (estilos .s-* en línea en index.html), usado como
 * esqueleto mientras se comprueba la sesión: la transición HTML → React no cambia nada en pantalla
 * y el elemento grande (el título) ya está pintado desde el primer fotograma.
 */
export default function AppShell({ label }: { label: string }) {
  return (
    <div id="app-shell" role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">{label}</span>
      <div aria-hidden="true">
        <div className="s-head"><span className="s-logo" /><span className="s-brand">BomberoPro</span></div>
        <div className="s-main">
          <p className="s-k">{`Convocatoria ${C.organismo} 2026`}</p>
          <p className="s-t">{`Prepara tu oposición a ${C.plaza} del ${C.organismo}`}</p>
          <div className="s-card" />
          <div className="s-line" />
          <div className="s-line s-short" />
        </div>
      </div>
    </div>
  );
}
