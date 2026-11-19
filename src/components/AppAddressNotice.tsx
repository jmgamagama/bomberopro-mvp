/** Una instalación conserva el origen donde se creó, aunque cambie el dominio principal. */
export default function AppAddressNotice({ hostname = window.location.hostname }: { hostname?: string }) {
  // Solo avisamos en direcciones de Vercel: no inferimos el entorno ni el backend por el nombre.
  if (!hostname.endsWith('.vercel.app')) return null;

  return (
    <aside aria-label="Dirección de esta instalación" className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-slate-800">
      <div className="mx-auto max-w-4xl space-y-2">
        <p>Esta app se abre desde <span className="break-all font-semibold">{hostname}</span>.</p>
        <p>La dirección principal es bomberopro.com. Allí tendrás que iniciar sesión de nuevo.</p>
        <p>Conserva esta instalación si tienes fichas guardadas solo aquí: no se trasladan automáticamente al cambiar de dirección.</p>
        <a href="https://bomberopro.com/" target="_blank" rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center rounded-lg border border-slate-400 bg-white px-3 font-semibold text-indigo-700 underline underline-offset-2">
          Abrir bomberopro.com en otra ventana
        </a>
      </div>
    </aside>
  );
}
