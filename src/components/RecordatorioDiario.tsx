import { useId, useState } from 'react';
import { Bell, BellOff } from 'lucide-react';
import {
  activarRecordatorio, desactivarRecordatorio, loadRecordatorio, saveRecordatorio, soporteRecordatorio, horaValida,
  type ResultadoActivar,
} from '../lib/recordatorio';

/**
 * Recordatorio diario opcional. No pide nada al montarse: el permiso de notificaciones
 * solo se pide al pulsar «Activar recordatorio».
 */
export default function RecordatorioDiario({ idPrefix = 'recordatorio' }: { idPrefix?: string }) {
  const [cfg, setCfg] = useState(loadRecordatorio);
  const [hora, setHora] = useState(cfg.hora);
  const [mensaje, setMensaje] = useState<{ tipo: ResultadoActivar | 'off' | 'hora'; texto: string } | null>(null);
  const [ocupado, setOcupado] = useState(false);
  const tituloId = useId();
  const soporte = soporteRecordatorio();

  const activar = async () => {
    setOcupado(true);
    const r = await activarRecordatorio(hora);
    setOcupado(false);
    setCfg(loadRecordatorio());
    const textos: Record<ResultadoActivar, string> = {
      activado: soporte.segundoPlano
        ? `Listo: te avisaremos a partir de las ${hora} si aún no has hecho la sesión. Con la app cerrada, el navegador decide el momento exacto y puede tardar algo más.`
        : `Listo: te avisaremos a las ${hora} si aún no has hecho la sesión, mientras BomberoPro esté abierto en este dispositivo. Este navegador no permite avisar con la app cerrada.`,
      sin_soporte: 'Este navegador no permite notificaciones, así que no podemos recordártelo. No se ha activado nada.',
      denegado: 'No has dado permiso de notificaciones, así que no se ha activado nada. Si cambias de idea, permítelas en los ajustes del navegador para este sitio.',
      error: 'El navegador no ha dejado pedir el permiso. No se ha activado nada.',
    };
    setMensaje({ tipo: r, texto: textos[r] });
  };

  const desactivar = async () => {
    await desactivarRecordatorio();
    setCfg(loadRecordatorio());
    setMensaje({ tipo: 'off', texto: 'Recordatorio desactivado. No te avisaremos.' });
  };

  const cambiarHora = (h: string) => {
    setHora(h);
    if (cfg.activo && horaValida(h)) {
      saveRecordatorio({ ...cfg, hora: h, avisadoDia: null });
      setCfg(loadRecordatorio());
      setMensaje({ tipo: 'hora', texto: `Hora cambiada: te avisaremos a las ${h}.` });
    }
  };

  return (
    <section aria-labelledby={tituloId} id={idPrefix} className="mx-auto mb-4 max-w-md space-y-3 rounded-2xl border border-slate-200 bg-white p-4 text-left">
      <h3 id={tituloId} className="flex items-center gap-2 text-base font-bold text-[#1E3A5F]">
        <Bell className="h-4 w-4 text-[#C2410C]" aria-hidden="true" /> Recordatorio diario
      </h3>
      <p className="text-sm text-slate-700">
        {cfg.activo
          ? `Activado: aviso a las ${cfg.hora} si aún no has hecho tu sesión de hoy.`
          : 'Opcional. Un aviso al día, a la hora que elijas, solo si aún no has hecho tu sesión. Sin servidor: se guarda en este dispositivo.'}
      </p>
      {!soporte.notificaciones && (
        <p className="text-sm font-semibold text-[#C2410C]" id={`${idPrefix}-sin-soporte`}>
          Este navegador no permite notificaciones, así que no podemos recordártelo aquí.
        </p>
      )}
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col text-sm font-semibold text-slate-800" htmlFor={`${idPrefix}-hora`}>
          Hora del aviso
          <input id={`${idPrefix}-hora`} type="time" value={hora} onChange={(e) => cambiarHora(e.target.value)}
            className="mt-1 min-h-11 rounded-lg border border-slate-300 px-2 text-base" />
        </label>
        {cfg.activo ? (
          <button type="button" id={`${idPrefix}-desactivar`} onClick={desactivar}
            className="flex min-h-11 items-center gap-2 rounded-xl border border-[#1E3A5F] px-4 text-sm font-bold text-[#1E3A5F] hover:bg-slate-50">
            <BellOff className="h-4 w-4" aria-hidden="true" /> Desactivar
          </button>
        ) : (
          <button type="button" id={`${idPrefix}-activar`} onClick={activar} disabled={ocupado || !horaValida(hora)}
            className="flex min-h-11 items-center gap-2 rounded-xl bg-[#1E3A5F] px-4 text-sm font-bold text-white hover:bg-[#162c49] disabled:opacity-60">
            <Bell className="h-4 w-4" aria-hidden="true" /> Activar recordatorio
          </button>
        )}
      </div>
      <p aria-live="polite" id={`${idPrefix}-mensaje`} className={`text-sm ${mensaje && mensaje.tipo !== 'activado' && mensaje.tipo !== 'off' && mensaje.tipo !== 'hora' ? 'font-semibold text-[#C2410C]' : 'text-slate-700'}`}>
        {mensaje?.texto ?? ''}
      </p>
    </section>
  );
}
