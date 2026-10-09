import React, { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Lock, Mail, Loader2, BookOpen } from 'lucide-react';

interface LoginProps {
  onStartDemo?: () => void;
}

export default function Login({ onStartDemo }: LoginProps = {}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [mode, setMode] = useState<'entrar' | 'crear'>('entrar');
  const emailInputRef = useRef<HTMLInputElement>(null);

  const focusEmail = () => emailInputRef.current?.focus();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const result = mode === 'crear'
        ? await supabase!.auth.signUp({ email: email.trim(), password })
        : await supabase!.auth.signInWithPassword({ email: email.trim(), password });
      if (result.error) {
        setMessage({ type: 'error', text: result.error.status === 429
          ? 'Demasiados intentos. Espera un momento antes de volver a intentarlo.'
          : mode === 'crear' ? 'No hemos podido crear la cuenta. Revisa el correo y la contraseña.'
          : 'No hemos podido entrar. Revisa tus datos o solicita un enlace al correo.' });
        focusEmail();
      } else if (mode === 'crear' && !result.data.session) {
        setMessage({ type: 'success', text: 'Revisa tu correo para confirmar el acceso. Si ya tenías cuenta, inicia sesión o solicita un enlace.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'No hemos podido conectar. Comprueba tu conexión e inténtalo de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  // Acceso sin contraseña: enlace de un solo uso al correo. Sirve para "he olvidado la contraseña".
  const handleMagicLink = async () => {
    if (!email) {
      setMessage({ type: 'error', text: 'Escribe primero tu correo y vuelve a pulsar.' });
      focusEmail();
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase!.auth.signInWithOtp({
        email: email.trim(),
        options: { shouldCreateUser: false, emailRedirectTo: window.location.origin },
      });
      setMessage(error
        ? { type: 'error', text: error.status === 429 ? 'Demasiados intentos. Espera un minuto.' : 'No hemos podido enviar el enlace. Revisa el correo escrito.' }
        : { type: 'success', text: 'Revisa tu correo y abre el enlace para entrar.' });
    } catch {
      setMessage({ type: 'error', text: 'No hemos podido conectar. Comprueba tu conexión e inténtalo de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (next: 'entrar' | 'crear') => {
    setMode(next);
    setMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-800">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-indigo-600 p-8 text-center text-white">
          <div className="mx-auto w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tight uppercase">MIRA Bomberopro</h1>
          <p className="text-indigo-200 mt-2 text-sm font-medium">Acceso de Opositor</p>
        </div>

        <div className="p-8">
          <div role="group" aria-label="Tipo de acceso" className="grid grid-cols-2 gap-1 p-1 mb-6 bg-slate-100 rounded-xl">
            {(['entrar', 'crear'] as const).map(m => (
              <button
                key={m}
                type="button"
                aria-pressed={mode === m}
                disabled={loading}
                onClick={() => switchMode(m)}
                className={`py-2.5 rounded-lg text-sm font-bold transition ${mode === m ? 'bg-white text-indigo-700 shadow' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {m === 'entrar' ? 'Ya tengo cuenta' : 'Crear cuenta gratis'}
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">
                Correo Electrónico
              </label>
              <input
                ref={emailInputRef}
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                autoComplete="email"
                inputMode="email"
                autoFocus
                required
                aria-invalid={message?.type === 'error'}
                aria-describedby={message ? 'login-message' : undefined}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-slate-800 font-medium"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={mode === 'crear' ? 'new-password' : 'current-password'}
                minLength={6}
                required
                aria-invalid={message?.type === 'error'}
                aria-describedby={message ? 'login-message' : undefined}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-slate-800 font-medium"
              />
              <p className="mt-2 text-xs text-slate-500">
                {mode === 'crear' ? 'Elige una contraseña de al menos 6 caracteres.' : 'La que pusiste al crear tu cuenta.'}
              </p>
              {mode === 'entrar' && (
                <button
                  type="button"
                  onClick={handleMagicLink}
                  disabled={loading}
                  className="mt-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 underline underline-offset-2"
                >
                  ¿Has olvidado la contraseña? Entra con un enlace al correo
                </button>
              )}
            </div>

            {message && (
              <div
                id="login-message"
                role={message.type === 'error' ? 'alert' : 'status'}
                aria-live={message.type === 'error' ? 'assertive' : 'polite'}
                className={`p-4 rounded-xl text-sm font-bold ${
                  message.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                  Entrando...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" aria-hidden="true" />
                  {mode === 'crear' ? 'Crear mi cuenta' : 'Entrar'}
                </>
              )}
            </button>
          </form>

          {onStartDemo && (
            <div className="pt-6 mt-6 border-t border-slate-100 text-center space-y-2">
              <p className="text-xs text-slate-500">
                ¿Solo quieres echar un vistazo? (no se guarda nada)
              </p>
              <button
                type="button"
                id="btn-login-demo"
                onClick={onStartDemo}
                className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-indigo-600 border border-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-indigo-500" aria-hidden="true" />
                <span>Probar sin cuenta</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
