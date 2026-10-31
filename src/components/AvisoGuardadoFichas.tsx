/**
 * Aviso de dónde se guarda el repaso de fichas (100 % local, ver src/utils/recallSrs.ts).
 * En la demo: nada sale del navegador. Con cuenta: las fichas siguen en el dispositivo, pero el
 * estudio de «Estudiar», los temas y los simulacros sí se guardan en la cuenta; se dice así para no
 * dar a entender que se pierde todo el progreso.
 */
export function textoAvisoFichas(demo: boolean): string {
  return demo
    ? 'Modo prueba: lo que hagas aquí se guarda solo en este navegador.'
    : 'El repaso de estas fichas se guarda en este dispositivo. Lo que estudias en «Estudiar», en los temas y en los simulacros se guarda en tu cuenta.';
}

export default function AvisoGuardadoFichas({ demo }: { demo: boolean }) {
  return (
    <p id="aviso-guardado-fichas" className="rounded-xl bg-indigo-50 px-3 py-2 text-sm text-slate-700">
      {textoAvisoFichas(demo)}
    </p>
  );
}
