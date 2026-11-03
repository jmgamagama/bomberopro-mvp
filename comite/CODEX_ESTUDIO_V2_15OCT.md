# Seguimiento tras estudio v2 — 15 octubre 2026

Se verificó la fusión de #105 y el estado correcto de su despliegue. El cambio incorpora los recorridos Recuerdo y Sesión diaria.

Hallazgo confirmado por código: src/utils/recallSrs.ts escribe mediante readOwned/writeOwned; src/utils/localOwner.ts usa claves de navegador separadas por cuenta o demo. No hay envío remoto del repaso de fichas. docs/INTEGRACION_ESTUDIO_V2.md documenta la unificación con conceptos como propuesta pendiente, no implementada.

El progreso remoto aceptado en los ensayos anteriores corresponde a Estudiar hoy y al motor de conceptos. No trasladar esa aceptación a Recuerdo/Sesión diaria. La separación por cuenta del progreso local no implica sincronización entre dispositivos.

Este PR añade una nota visible en ambos recorridos para que el alumno conozca esa limitación. No cambia el algoritmo, almacenamiento, contenido ni SQL. La migración 16 sigue pendiente según la documentación del cambio anterior: no se ejecutó en esta revisión.

Siguiente trabajo de persistencia: acordar la identidad ficha-concepto, preservar el progreso local existente y definir una importación remota idempotente con pruebas de cuenta, dos dispositivos y desconexión. No inventar equivalencia automática entre fichas y conceptos.
