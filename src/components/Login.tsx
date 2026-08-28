import React, { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Lock, Mail, Loader2 } from 'lucide-react';

type Mode = 'signup' | 'signin';

export default function Login() {
  const [mode, setMode] = useState<Mode>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const focusEmail = () => emailInputRef.current?.focus();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { data, error } =
      mode === 'signup'
        ? await supabase!.auth.signUp({ email, password })
        : await supabase!.auth.signInWithPassword({ email, password });

    if (error) {
      let errorMessage = 'Ocurrió un error. Inténtalo de nuevo.';
      if (error.status === 429) {
        errorMessage = 'Demasiados intentos. Por favor, espera un momento antes de volver a intentarlo.';
      } else if (error.message.toLowerCase().includes('already registered')) {
        errorMessage = 'Ese correo ya tiene una cuenta. Inicia sesión en su lugar.';
        setMode('signin');
      } else if (error.message.toLowerCase().includes('invalid login credentials')) {
        errorMessage = 'Correo o contraseña incorrectos.';
      } else if (error.message.toLowerCase().includes('password')) {
        errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
      } else if (error.message.toLowerCase().includes('email')) {
        errorMessage = 'El correo electrónico proporcionado no es válido.';
      } else {
        errorMessage = `Error: ${error.message}`;
      }
      setMessage({ type: 'error', text: errorMessage });
      focusEmail();
    } else if (mode === 'signup' && !data.session) {
      // Fallback in case email confirmation is ever re-enabled server-side.
      setMessage({
        type: 'success',
        text: 'Cuenta creada. Revisa tu correo para confirmar el acceso.',
      });
    }
    // If a session came back, the parent App component's onAuthStateChange
    // listener picks it up automatically and swaps this screen out — no
    // further action needed here.

    setLoading(false);
  };

  const toggleMode = () => {
    setMode(mode === 'signup' ? 'signin' : 'signup');
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
          <p className="text-indigo-200 mt-2 text-sm font-medium">
            {mode === 'signup' ? 'Crea tu cuenta de opositor' : 'Acceso Seguro de Opositor'}
          </p>
        </div>

        <div className="p-8">
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
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                minLength={6}
                required
                aria-invalid={message?.type === 'error'}
                aria-describedby={message ? 'login-message' : undefined}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-slate-800 font-medium"
              />
              {mode === 'signup' && (
                <p className="mt-2 text-xs text-slate-500">Mínimo 6 caracteres.</p>
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
                  {mode === 'signup' ? 'Creando cuenta...' : 'Entrando...'}
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" aria-hidden="true" />
                  {mode === 'signup' ? 'Crear cuenta y empezar' : 'Entrar'}
                </>
              )}
            </button>

            <button
              type="button"
              onClick={toggleMode}
              className="w-full text-center text-sm font-bold text-indigo-600 hover:text-indigo-700 transition"
            >
              {mode === 'signup' ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
