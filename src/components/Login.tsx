import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { trackFunnel } from '../lib/funnel';
import { isRegistroAbierto, textoAlta } from '../config/features';
import {
  leerEnlaceInvitacion, mensajeErrorAcceso, mensajeErrorEnlace, SIN_CONEXION,
  type MensajeAcceso, type ModoAcceso,
} from '../lib/mensajesAcceso';
import { Lock, Loader2, Flame, ScrollText, Timer, Brain, ArrowRight, Eye, EyeOff, MailCheck } from 'lucide-react';

interface LoginProps {
  onStartDemo?: () => void;
  /** Pestaña inicial: «crear» cuando el alumno viene de la demo pulsando el botón de alta. */
  initialMode?: ModoAcceso;
}

// Vuelta desde el correo. Mismas URL que urlRetornoAuth() del hilo del enlace de confirmación:
// con ?acceso= la app muestra «Cuenta activada» (o «enlace caducado») al volver.
const retornoAuth = (tipo: 'registro' | 'enlace') => `${window.location.origin}/?acceso=${tipo}`;

type Aviso = (MensajeAcceso & { type: 'success' | 'error' }) | null;

const PUNTOS_CONFIANZA = [
  { Icon: ScrollText, text: 'Temario anclado al BOE y al DOE' },
  { Icon: Timer, text: 'Simulacros con el formato del examen' },
  { Icon: Brain, text: 'Repasos que vuelven sobre tus fallos' },
];

/**
 * Pantalla de entrada. Con el piloto cerrado (por defecto) el alta es «Activar invitación».
 * Enlace directo para invitados: /?invitacion=1&email=correo — abre esa pestaña con el correo escrito.
 */
export default function Login({ onStartDemo, initialMode = 'entrar' }: LoginProps = {}) {
  const abierto = isRegistroAbierto();
  const [enlace] = useState(() => leerEnlaceInvitacion(typeof window === 'undefined' ? '' : window.location.search));
  const [email, setEmail] = useState(enlace.email);
  const [password, setPassword] = useState('');
  const [verPassword, setVerPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<Aviso>(null);
  const [mode, setMode] = useState<ModoAcceso>(enlace.invitacion ? 'crear' : initialMode);
  // Correo al que se ha enviado la confirmación: se cambia el formulario por «Revisa tu correo».
  const [enviadoA, setEnviadoA] = useState<string | null>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  // El enlace de invitación ya se ha leído: se limpia de la barra para que recargar no lo repita.
  useEffect(() => {
    if (!enlace.invitacion && !enlace.email) return;
    const url = new URL(window.location.href);
    ['invitacion', 'invitación', 'email'].forEach(k => url.searchParams.delete(k));
    window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
    if (enlace.email) passwordInputRef.current?.focus();
  }, [enlace]);

  const focusEmail = () => emailInputRef.current?.focus();
  const correo = () => email.trim().toLowerCase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (mode === 'crear') trackFunnel('signup_submit');
    try {
      if (mode === 'crear') {
        const result = await supabase!.auth.signUp({
          email: correo(),
          password,
          options: { emailRedirectTo: retornoAuth('registro') },
        });
        if (result.error) {
          setMessage({ type: 'error', ...mensajeErrorAcceso('crear', result.error, abierto) });
          focusEmail();
        } else if (!result.data.session && result.data.user && result.data.user.identities?.length === 0) {
          // Supabase no da error si el correo ya tiene cuenta: devuelve un usuario sin identidades.
          setMode('entrar');
          setPassword('');
          setMessage({ type: 'success', text: 'Ya tienes cuenta con este correo. Escribe tu contraseña y pulsa «Entrar».' });
          passwordInputRef.current?.focus();
        } else if (!result.data.session) {
          setEnviadoA(correo());
          setMessage({
            type: 'success',
            text: `Te hemos enviado un correo a ${correo()}. Ábrelo en este mismo dispositivo y pulsa el botón del correo: entrarás directamente. Si en 2 minutos no está, mira en Spam o Promociones.`,
            accion: 'reenviar',
          });
        }
        // Con sesión, la app pasa sola al inicio.
      } else {
        const result = await supabase!.auth.signInWithPassword({ email: correo(), password });
        if (result.error) {
          setMessage({ type: 'error', ...mensajeErrorAcceso('entrar', result.error, abierto) });
          focusEmail();
        }
      }
    } catch {
      setMessage({ type: 'error', text: SIN_CONEXION });
    } finally {
      setLoading(false);
    }
  };

  // Acceso sin contraseña: enlace de un solo uso al correo. Sirve para "he olvidado la contraseña".
  const handleMagicLink = async () => {
    if (!email.trim()) {
      setMessage({ type: 'error', text: 'Escribe primero tu correo y vuelve a pulsar.' });
      focusEmail();
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase!.auth.signInWithOtp({
        email: correo(),
        options: { shouldCreateUser: false, emailRedirectTo: retornoAuth('enlace') },
      });
      setMessage(error
        ? { type: 'error', ...mensajeErrorEnlace(error, abierto) }
        : { type: 'success', text: `Te hemos enviado un enlace a ${correo()}. Ábrelo desde este móvil para entrar sin contraseña.` });
    } catch {
      setMessage({ type: 'error', text: SIN_CONEXION });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      const { error } = await supabase!.auth.resend({
        type: 'signup',
        email: correo(),
        options: { emailRedirectTo: retornoAuth('registro') },
      });
      // El botón de reenviar se mantiene también tras un fallo (límite, sin conexión) para reintentar.
      setMessage(error
        ? { type: 'error', ...mensajeErrorAcceso('crear', error, abierto), accion: 'reenviar' }
        : { type: 'success', text: `Te hemos vuelto a enviar el correo a ${correo()}. Mira también en Spam o Promociones.`, accion: 'reenviar' });
    } catch {
      setMessage({ type: 'error', text: SIN_CONEXION, accion: 'reenviar' });
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (next: ModoAcceso) => {
    setMode(next);
    setMessage(null);
    setEnviadoA(null);
  };

  const accionBoton = message?.accion === 'reenviar'
    ? { label: 'Reenviar el correo', onClick: handleResend }
    : message?.accion === 'ir_a_crear' && mode === 'entrar'
      ? { label: textoAlta(), onClick: () => switchMode('crear') }
      : message?.accion === 'ir_a_entrar' && mode === 'crear'
        ? { label: 'Ir a «Entrar»', onClick: () => switchMode('entrar') }
        : null;

  const avisoEl = message && (
            <div
              id="login-message"
              role={message.type === 'error' ? 'alert' : 'status'}
              aria-live={message.type === 'error' ? 'assertive' : 'polite'}
              className={`p-4 rounded-xl text-sm font-semibold ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              <p className="flex gap-2">
                {message.type === 'success' && <MailCheck className="w-5 h-5 shrink-0" aria-hidden="true" />}
                <span>{message.text}</span>
              </p>
              {accionBoton && (
                <button
                  type="button"
                  onClick={accionBoton.onClick}
                  disabled={loading}
                  className="mt-2 min-h-11 font-bold underline underline-offset-2"
                >
                  {accionBoton.label}
                </button>
              )}
            </div>
          );

  const inputClass = 'w-full px-4 py-3 rounded-xl border border-slate-500 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-slate-800 font-medium';

  return (
    <div className="min-h-screen bg-fondo font-sans text-slate-800">
      <header className="bg-indigo-600 pt-[calc(1rem+env(safe-area-inset-top))] pb-5 text-white">
        <div className="max-w-md mx-auto px-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center">
                <Flame className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <h1 className="text-xl font-black tracking-tight">BomberoPro</h1>
            </div>
            {!abierto && <span className="text-xs font-bold bg-white/15 rounded-full px-3 py-1">Grupo piloto</span>}
          </div>
          <h2 className="mt-4 text-[22px] font-black leading-tight">Tu preparación para Bombero del CPEI Badajoz</h2>
          <p className="mt-1.5 text-indigo-100 text-base">
            {abierto
              ? 'Preguntas del temario que se adaptan a lo que te cuesta.'
              : mode === 'crear'
                ? 'Actívala en un minuto con el correo al que te llegó.'
                : 'Entra con el correo al que te llegó la invitación.'}
          </p>
        </div>
      </header>

      <main className="max-w-md mx-auto px-5 pt-4 pb-[calc(2rem+env(safe-area-inset-bottom))]">
        <div role="group" aria-label="Tipo de acceso" className="grid grid-cols-2 gap-1 p-1 mb-5 bg-slate-100 rounded-xl">
          {(['entrar', 'crear'] as const).map(m => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              disabled={loading}
              onClick={() => switchMode(m)}
              className={`min-h-11 py-2.5 rounded-lg text-sm font-bold transition ${mode === m ? 'bg-white text-indigo-700 shadow' : 'text-slate-700 hover:text-slate-900'}`}
            >
              {m === 'entrar' ? 'Ya tengo cuenta' : textoAlta()}
            </button>
          ))}
        </div>

        {enviadoA ? (
          <section aria-labelledby="titulo-revisa" className="space-y-4">
            <h3 id="titulo-revisa" className="text-lg font-black text-slate-800">Revisa tu correo</h3>
            {avisoEl}
            <button
              type="button"
              onClick={() => { setEnviadoA(null); setMessage(null); focusEmail(); }}
              className="w-full min-h-11 text-sm font-bold text-indigo-600 hover:text-indigo-800 underline underline-offset-2"
            >
              Me he equivocado de correo
            </button>
          </section>
        ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-1.5">
              Correo electrónico
            </label>
            <input
              ref={emailInputRef}
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              inputMode="email"
              autoFocus={!enlace.email && (!onStartDemo || initialMode === 'crear')}
              required
              aria-invalid={message?.type === 'error'}
              aria-describedby={message ? 'login-message' : undefined}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <input
                ref={passwordInputRef}
                id="password"
                type={verPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'crear' ? 'Mínimo 6 caracteres' : '••••••••'}
                autoComplete={mode === 'crear' ? 'new-password' : 'current-password'}
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                minLength={6}
                required
                aria-invalid={message?.type === 'error'}
                aria-describedby={message ? 'login-message' : undefined}
                className={`${inputClass} pr-12`}
              />
              <button
                type="button"
                onClick={() => setVerPassword(v => !v)}
                aria-label={verPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                aria-pressed={verPassword}
                className="absolute inset-y-0 right-0 w-12 flex items-center justify-center text-slate-600 hover:text-slate-900"
              >
                {verPassword ? <EyeOff className="w-5 h-5" aria-hidden="true" /> : <Eye className="w-5 h-5" aria-hidden="true" />}
              </button>
            </div>
          </div>

          {avisoEl}

          <button
            type="submit"
            disabled={loading || !email.trim() || !password}
            className="w-full min-h-12 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                {mode === 'crear' ? 'Activando…' : 'Entrando…'}
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" aria-hidden="true" />
                {mode === 'crear' ? (abierto ? 'Crear mi cuenta' : 'Activar mi cuenta') : 'Entrar'}
              </>
            )}
          </button>

          {mode === 'entrar' && (
            <button
              type="button"
              onClick={handleMagicLink}
              disabled={loading}
              className="w-full min-h-11 text-sm font-bold text-indigo-600 hover:text-indigo-800 underline underline-offset-2"
            >
              He olvidado la contraseña
            </button>
          )}
        </form>
        )}

        <ul className="mt-6 space-y-3 border-t border-slate-200 pt-6" aria-label="Qué encontrarás">
          {PUNTOS_CONFIANZA.map(({ Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-sm font-semibold text-slate-700">
              <span className="w-8 h-8 shrink-0 rounded-lg bg-indigo-50 flex items-center justify-center">
                <Icon className="w-4 h-4 text-indigo-600" aria-hidden="true" />
              </span>
              {text}
            </li>
          ))}
        </ul>

        {onStartDemo && (
          <button
            type="button"
            id="btn-login-demo"
            onClick={onStartDemo}
            className="mt-6 w-full min-h-11 flex items-center justify-center gap-1.5 text-sm font-bold text-orange-700 hover:text-orange-800 cursor-pointer"
          >
            {abierto ? 'Prueba 15 preguntas sin registrarte' : '¿Aún sin invitación? Prueba 15 preguntas'}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </main>
    </div>
  );
}
