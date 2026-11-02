import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, KeyRound, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { RetornoAuth } from '../lib/authRetorno';

interface AccesoConfirmadoProps {
  retorno: RetornoAuth;
  /** true si el enlace ya dejó al alumno con la sesión iniciada. */
  conSesion: boolean;
  /** Cierra esta pantalla: entra en la app si hay sesión o vuelve a «Entrar» si no. */
  onContinuar: () => void;
}

/**
 * Pantalla que ve el alumno al abrir un enlace del correo: cuenta activada, invitación,
 * nueva contraseña o enlace caducado. Siempre deja claro el siguiente paso.
 */
export default function AccesoConfirmado({ retorno, conSesion, onContinuar }: AccesoConfirmadoProps) {
  const pideContrasena = conSesion && (retorno.tipo === 'invitacion' || retorno.tipo === 'recuperar');
  const esError = retorno.tipo === 'error';

  return (
    <div role="main" className="min-h-screen bg-fondo flex items-center justify-center p-4 font-sans text-slate-800">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className={`p-8 text-center text-white ${esError ? 'bg-slate-700' : 'bg-indigo-600'}`}>
          <div className="mx-auto w-14 h-14 bg-white/15 rounded-full flex items-center justify-center mb-4">
            {esError
              ? <AlertTriangle className="w-7 h-7 text-white" aria-hidden="true" />
              : pideContrasena
                ? <KeyRound className="w-7 h-7 text-white" aria-hidden="true" />
                : <CheckCircle2 className="w-7 h-7 text-white" aria-hidden="true" />}
          </div>
          <h1 className="text-2xl font-black tracking-tight">{titulo(retorno, conSesion)}</h1>
          <p className="text-indigo-50 mt-2 text-base font-medium">BomberoPro · CPEI Badajoz</p>
        </div>

        <div className="p-8 space-y-4">
          {pideContrasena
            ? <FormularioContrasena retorno={retorno} onHecho={onContinuar} />
            : <Mensaje retorno={retorno} conSesion={conSesion} onContinuar={onContinuar} />}
        </div>
      </div>
    </div>
  );
}

function titulo(retorno: RetornoAuth, conSesion: boolean): string {
  switch (retorno.tipo) {
    case 'error': return 'Este enlace ya no funciona';
    case 'invitacion': return conSesion ? '¡Bienvenido a BomberoPro!' : 'Invitación aceptada';
    case 'recuperar': return conSesion ? 'Elige tu nueva contraseña' : 'Enlace abierto';
    default: return '¡Cuenta activada!';
  }
}

function Mensaje({ retorno, conSesion, onContinuar }: AccesoConfirmadoProps) {
  const boton = conSesion ? 'Empezar a estudiar' : 'Ir a Entrar';
  return (
    <>
      {retorno.tipo === 'error' ? (
        <>
          <p className="text-base text-slate-700">
            Puede que ya lo hayas usado (por ejemplo, si ya activaste tu cuenta) o que haya caducado.
            Cada enlace sirve una sola vez y durante un tiempo limitado.
          </p>
          <p className="text-base text-slate-700">
            <strong>Si ya activaste tu cuenta</strong>, entra con tu correo y tu contraseña.
            <strong> Si no</strong>, en «Entrar» pide un enlace nuevo al correo.
          </p>
        </>
      ) : (
        <>
          <p className="text-base text-slate-700">
            Tu correo está confirmado y tu cuenta ya funciona. Ya formas parte del grupo que prepara el
            CPEI Badajoz con BomberoPro.
          </p>
          <p className="text-base text-slate-700">
            Cada día te preparamos una sesión corta con lo que más necesitas repasar. Constancia y
            método: así se gana una plaza.
          </p>
          {!conSesion && (
            <p className="text-sm text-slate-600">
              Entra con el correo y la contraseña que elegiste al crear la cuenta.
            </p>
          )}
        </>
      )}
      <button
        type="button"
        onClick={onContinuar}
        className="w-full min-h-12 py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-base font-bold transition cursor-pointer"
      >
        {boton}
      </button>
    </>
  );
}

function FormularioContrasena({ retorno, onHecho }: { retorno: RetornoAuth; onHecho: () => void }) {
  const [password, setPassword] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [guardada, setGuardada] = useState(false);
  const esInvitacion = retorno.tipo === 'invitacion';

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setGuardando(true);
    setError(null);
    try {
      const { error: fallo } = await supabase!.auth.updateUser({ password });
      if (fallo) setError('No hemos podido guardar la contraseña. Prueba con otra distinta.');
      else setGuardada(true);
    } catch {
      setError('No hemos podido conectar. Comprueba tu conexión e inténtalo de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  if (guardada) {
    return (
      <>
        <p role="status" className="text-base text-slate-700">
          Contraseña guardada. A partir de ahora entra con tu correo y esta contraseña.
        </p>
        <button
          type="button"
            onClick={onHecho}
          className="w-full min-h-12 py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-base font-bold transition cursor-pointer"
        >
          Empezar a estudiar
        </button>
      </>
    );
  }

  return (
    <form onSubmit={guardar} className="space-y-4">
      <p className="text-base text-slate-700">
        {esInvitacion
          ? 'Ya estás dentro. Elige una contraseña para entrar los próximos días desde cualquier dispositivo.'
          : 'Ya has entrado con el enlace. Escribe la contraseña que quieres usar a partir de ahora.'}
      </p>
      <div>
        <label htmlFor="nueva-contrasena" className="block text-sm font-bold text-slate-800 mb-1.5">
          Nueva contraseña
        </label>
        <input
          id="nueva-contrasena"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          aria-describedby="nueva-contrasena-ayuda"
          className="w-full min-h-12 px-4 py-3 rounded-xl border border-slate-400 text-base focus:border-indigo-600"
        />
        <p id="nueva-contrasena-ayuda" className="text-sm text-slate-600 mt-1.5">Al menos 6 caracteres.</p>
      </div>
      {error && <p role="alert" className="text-sm font-medium text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={guardando}
        className="w-full min-h-12 py-3 px-4 bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white rounded-xl text-base font-bold transition flex items-center justify-center gap-2 cursor-pointer"
      >
        {guardando && <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />}
        Guardar contraseña
      </button>
      <button
        type="button"
        onClick={onHecho}
        className="w-full min-h-11 py-2 text-sm font-bold text-slate-700 hover:text-slate-900 underline underline-offset-2"
      >
        Ahora no, ir a estudiar
      </button>
    </form>
  );
}
