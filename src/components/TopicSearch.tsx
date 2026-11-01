import { Search, X } from 'lucide-react';

interface TopicSearchProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  /** Temas que quedan tras filtrar y total, para el anuncio a lectores de pantalla. */
  shown: number;
  total: number;
}

/** Buscador de temas, igual en todas las listas de temas. */
export default function TopicSearch({ id, value, onChange, shown, total }: TopicSearchProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-xs font-semibold text-slate-700">
        Buscar tema por número o palabra
      </label>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
        <input
          id={id}
          type="search"
          inputMode="search"
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ej.: 25 o mercancías"
          className="min-h-11 w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-11 text-base text-slate-900 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="Borrar búsqueda"
            className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center rounded-xl text-slate-600 hover:text-slate-900"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
      <p role="status" aria-live="polite" className="text-xs text-slate-600">
        {value.trim()
          ? shown === 0
            ? 'Ningún tema coincide. Prueba con el número del tema.'
            : `${shown} de ${total} temas`
          : null}
      </p>
    </div>
  );
}
