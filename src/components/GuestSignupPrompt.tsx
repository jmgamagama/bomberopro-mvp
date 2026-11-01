import { Save } from 'lucide-react';
import { isRegistroAbierto } from '../config/features';

interface GuestSignupPromptProps {
  /** Qué acaba de terminar: «el simulacro», «la sesión»… */
  what: string;
  onSignup: () => void;
}

/**
 * Momento de valor: tras ver la nota, ofrecer guardar el progreso en una cuenta.
 * El texto sigue el modo de alta (config/features): con el piloto cerrado (por defecto) no se
 * promete una «cuenta gratis» que luego pide una invitación; se dice claro que es para quien la
 * tiene y que, sin ella, se puede seguir practicando en este dispositivo.
 */
export default function GuestSignupPrompt({ what, onSignup }: GuestSignupPromptProps) {
  const abierto = isRegistroAbierto();
  return (
    <aside aria-labelledby="guest-signup-title" id="guest-signup-prompt" className="mx-auto max-w-md space-y-2 rounded-2xl border border-indigo-200 bg-indigo-50 p-4 text-left">
      <h3 id="guest-signup-title" className="text-base font-bold text-slate-900">Guarda tu progreso</h3>
      <p className="text-sm text-slate-700">
        Has terminado {what} sin cuenta. Lo hecho se guarda solo en este dispositivo.{' '}
        {abierto
          ? 'Crea una cuenta gratis y lo pasamos a tu cuenta.'
          : 'Por ahora las cuentas son para el grupo piloto: si tienes invitación, actívala con tu correo y lo pasamos a tu cuenta.'}
      </p>
      {!abierto && (
        <p id="guest-signup-sin-invitacion" className="text-sm text-slate-700">
          ¿Sin invitación? Puedes seguir practicando sin cuenta: tu progreso sigue en este dispositivo.
        </p>
      )}
      <button type="button" id="btn-guest-save-progress" onClick={onSignup}
        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-700 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-800">
        <Save className="h-4 w-4" aria-hidden="true" /> {abierto ? 'Crear cuenta y guardar mi progreso' : 'Activar invitación y guardar mi progreso'}
      </button>
    </aside>
  );
}
