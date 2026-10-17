import { useState } from 'react';
import { Download, Trash2 } from 'lucide-react';
import { deleteLocalStudyData, downloadLocalDataExport } from '../utils/localData';

/** Exportar o borrar los datos de estudio guardados en este dispositivo (sin enviar nada). */
export default function LocalDataPanel({ onDeleted }: { onDeleted?: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="space-y-2 rounded-xl border border-slate-100 p-3" id="local-data-panel">
      <h3 className="text-sm font-bold text-slate-800">Tus datos en este dispositivo</h3>
      <p className="text-xs text-slate-600">
        Puedes descargar una copia o borrar tu progreso de fichas guardado en este navegador. No se envía nada. Lo guardado en
        tu cuenta en el servidor no cambia, y las respuestas pendientes de enviar se conservan.
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            downloadLocalDataExport();
            setMessage('Copia descargada.');
          }}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <Download className="h-4 w-4" aria-hidden="true" /> Descargar mis datos
        </button>
        {!confirming ? (
          <button
            type="button"
            onClick={() => {
              setConfirming(true);
              setMessage(null);
            }}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" /> Borrar mis datos locales
          </button>
        ) : (
          <div role="group" aria-label="Confirmar borrado" className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-rose-700">¿Seguro? Perderás tu progreso de fichas en este navegador.</span>
            <button
              type="button"
              onClick={() => {
                const removed = deleteLocalStudyData();
                setConfirming(false);
                setMessage(removed.length > 0 ? 'Datos locales borrados.' : 'No había datos que borrar.');
                onDeleted?.();
              }}
              className="min-h-11 rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-700"
            >
              Sí, borrar
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="min-h-11 rounded-lg border px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
      {message && (
        <p role="status" className="text-xs text-slate-600">
          {message}
        </p>
      )}
    </div>
  );
}
