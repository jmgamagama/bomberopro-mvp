import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/** Evita que un error de renderizado deje la aplicación en una pantalla vacía. */
export class GlobalErrorBoundary extends Component<Props, State> {
  declare readonly props: Readonly<Props>;
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Diagnóstico local solo en desarrollo; nunca se envían errores ni datos al servidor.
    if (import.meta.env.DEV) {
      console.error('[GlobalErrorBoundary] Error de interfaz:', error, errorInfo);
    }
  }

  private reloadApp = (): void => {
    // No se limpian los almacenamientos: el progreso guardado debe permanecer intacto.
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main
        role="alert"
        aria-labelledby="global-error-title"
        className="min-h-dvh flex items-center justify-center bg-[#fbf9f4] p-4 font-sans text-slate-900"
      >
        <section className="w-full max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <div className="space-y-2">
            <h1 id="global-error-title" className="text-lg font-bold">
              No se ha podido mostrar esta pantalla
            </h1>
            <p className="text-sm leading-relaxed text-slate-600">
              Recarga la aplicación para intentarlo de nuevo. El progreso que ya se guardó en este
              dispositivo no se borra; una respuesta que aún no se hubiera guardado podría perderse.
            </p>
          </div>
          <button
            type="button"
            onClick={this.reloadApp}
            className="min-h-11 w-full rounded-xl bg-[#1b365d] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#152a4a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b365d]"
          >
            Recargar aplicación
          </button>
        </section>
      </main>
    );
  }
}
