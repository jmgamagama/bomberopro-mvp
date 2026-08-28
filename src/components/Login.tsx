import React, { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Lock, Mail, Loader2 } from 'lucide-react';

export default function Login() {
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

    // Single "Entrar" flow: try to sign in first. If the account doesn't
    // exist yet, create it automatically. The person never has to know or
    // choose whether this is their first visit — one field, one button.
    const signInResult = await supabase!.auth.signInWithPassword({ email, password });

    if (!signInResult.error) {
      // Session is set; the parent App component's onAuthStateChange
      // listener picks it up automatically and swaps this screen out.
      setLoading(false);
      return;
    }

    if (signInResult.error.status === 429) {
      setMessage({
        type: 'error',
        text: 'Demasiados intentos. Por favor, espera un momento antes de volver a intentarlo.',
      });
      focusEmail();
      setLoading(false);
      return;
    }

    // Sign-in failed for a reason other than rate limiting. Most likely this
    // is a first-time visitor with no account yet, so attempt to create one
    // with the same credentials they just typed.
    const signUpResult = await supabase!.auth.signUp({ email, password });

    if (signUpResult.error) {
      let errorMessage = 'Ocurrió un error. Inténtalo de nuevo.';
      if (signUpResult.error.status === 429) {
        errorMessage = 'Demasiados intentos. Por favor, espera un momento antes de volver a intentarlo.';
      } else if (signUpResult.error.message.toLowerCase().includes('password')) {
        errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
      } else if (signUpResult.error.message.toLowerCase().includes('email')) {
        errorMessage = 'El correo electrónico proporcionado no es válido.';
      } else {
        errorMessage = 'Correo o contraseña incorrectos.';
      }
      setMessage({ type: 'error', text: errorMessage });
      focusEmail();
    } else if (!signUpResult.data.session) {
      // Supabase returns no error and no session when the email is already
      // registered (to avoid leaking which emails exist). In practice this
      // means: existing account, wrong password.
      setMessage({ type: 'error', text: 'Correo o contraseña incorrectos.' });
      focusEmail();
    }
    // Otherwise a brand-new account was created and signed in automatically;
    // onAuthStateChange takes over from here.

    setLoading(false);
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
                autoComplete="current-password"
                minLength={6}
                required
                aria-invalid={message?.type === 'error'}
                aria-describedby={message ? 'login-message' : undefined}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-slate-800 font-medium"
              />
              <p className="mt-2 text-xs text-slate-500">
                Mínimo 6 caracteres. Si es tu primera vez, esto crea tu cuenta.
              </p>
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
                  Entrar
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
