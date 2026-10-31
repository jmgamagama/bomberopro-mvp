import { Save } from 'lucide-react';

interface GuestSignupPromptProps {
  /** Qué acaba de terminar: «el simulacro», «la sesión»… */
  what: string;
  onSignup: () => void;
}

/** Momento de valor: tras ver la nota, ofrecer guardar el progreso creando una cuenta. */
export default function GuestSignupPrompt({ what, onSignup }: GuestSignupPromptProps) {
  return (
    <aside aria-labelledby="guest-signup-title" id="guest-signup-prompt" className="mx-auto max-w-md space-y-2 rounded-2xl border border-indigo-200 bg-indigo-50 p-4 text-left">
      <h3 id="guest-signup-title" className="text-base font-bold text-slate-900">Guarda tu progreso</h3>
      <p className="text-sm text-slate-700">
        Has terminado {what} sin cuenta. Lo hecho se guarda solo en este dispositivo. Crea una cuenta gratis y lo pasamos a tu cuenta.
      </p>
      <button type="button" id="btn-guest-save-progress" onClick={onSignup}
        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-700 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-800">
        <Save className="h-4 w-4" aria-hidden="true" /> Crear cuenta y guardar mi progreso
      </button>
    </aside>
  );
}
