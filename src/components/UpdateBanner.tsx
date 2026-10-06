import { useEffect, useState } from 'react';

/**
 * Avisa cuando hay una versión nueva publicada.
 *
 * Por qué: una pestaña abierta antes de un despliegue sigue ejecutando el código antiguo, así que
 * los arreglos no le llegan (pasó el 6-oct con el guardado de Por Temas). Se compara el script
 * principal de la página cargada con el de la página publicada ahora; si cambia, se ofrece recargar.
 * Las respuestas pendientes de guardar viven en el dispositivo, así que recargar no pierde nada.
 */
const CHECK_EVERY_MS = 5 * 60 * 1000;

function currentBundle(): string | null {
  const script = Array.from(document.scripts).find(s => /\/assets\/index-[^/]+\.js$/.test(s.src));
  return script ? new URL(script.src).pathname : null;
}

export async function publishedBundle(fetcher: typeof fetch = fetch): Promise<string | null> {
  const res = await fetcher(`/?v=${Date.now()}`, { cache: 'no-store' });
  if (!res.ok) return null;
  const html = await res.text();
  const match = html.match(/\/assets\/index-[^"']+\.js/);
  return match ? match[0] : null;
}

export default function UpdateBanner() {
  const [outdated, setOutdated] = useState(false);

  useEffect(() => {
    const loaded = currentBundle();
    if (!loaded || import.meta.env.DEV) return;
    let stopped = false;

    const check = async () => {
      try {
        const live = await publishedBundle();
        if (!stopped && live && live !== loaded) setOutdated(true);
      } catch {
        // Sin red: se volverá a comprobar más tarde.
      }
    };

    const timer = window.setInterval(check, CHECK_EVERY_MS);
    const onVisible = () => { if (document.visibilityState === 'visible') void check(); };
    document.addEventListener('visibilitychange', onVisible);
    void check();
    return () => {
      stopped = true;
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  if (!outdated) return null;

  return (
    <div
      role="status"
      className="sticky top-0 z-[61] flex items-center justify-between gap-3 border-b border-indigo-200 bg-indigo-50 px-4 py-2 text-sm text-indigo-900"
    >
      <span>Hay una versión nueva de BomberoPro con mejoras. Tus respuestas están a salvo.</span>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="shrink-0 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700"
      >
        Actualizar
      </button>
    </div>
  );
}
