# Protección del ciclo de Pull Requests (main)

## Problema detectado

La PR #295 superó las pruebas y se fusionó con observaciones de Codex pendientes;
el defecto de sesión tardía quedó registrado en #296. Un **Quality Gate verde**
solo certifica lint/build/tests: no certifica que las revisiones ni el E2E estén cerrados.

Un workflow de PR que consulta hilos no es una barrera segura para ello: el autor puede
modificar su definición en la propia rama y el estado no se invalida al reabrir
un hilo. Se descartó expresamente el workflow experimental en la PR #297.

## Configuración nativa requerida en GitHub

**Responsable:** propietario del repositorio o administrador de reglas.

1. Abrir **Settings → Rules → Rulesets** (o **Settings → Branches → Branch protection rules**).
2. Crear una regla activa para la rama exacta `main`, preservando cualquier
   protección existente.
3. Activar **Require a pull request before merging** y, cuando haya un revisor
   autorizado independiente, **Require approvals** (mínimo uno).
4. Activar **Require conversation resolution before merging**. Esta protección
   la aplica GitHub y se actualiza cuando se resuelve/reabre un hilo.
5. Activar **Require status checks to pass before merging**, seleccionando
   el Quality Gate real que ejecuta lint/build/tests; verificar el nombre
   exacto del job en GitHub antes de marcarlo.
6. Recomendada: **Dismiss stale pull request approvals when new commits are pushed**
   y bloquear bypass si las reglas del repositorio/plan lo permiten. Evitar
   habilitar bypass administrativo habitual.
7. Guardar la regla y verificarla con dos PR de prueba:
   - Con hilo de revisión sin resolver: GitHub impide fusionar.
   - Con hilo resuelto y revisiones/pruebas exigidas correctas: GitHub permite fusionar.
   - Reabrir el hilo: la fusión debe volver a bloquearse.
   - Nuevo commit tras una aprobación: verificar invalidación de aprobación si se activó.

**No marcar esta tarea como completada solo porque exista este documento o
la PR #297 esté fusionada.** La regla debe aparecer como ACTIVE en Settings y
las comprobaciones anteriores deben estar verificadas por el administrador.

## Protocolo operativo de cada PR

- Identificar issue, dueño técnico y revisor independiente.
- Si hay defectos de seguridad, datos personales, permisos, aprendizaje o
  contenido, realizar pruebas de regresión y revisión antes del merge.
- Resolver o justificar individualmente los comentarios y solicitar nueva
  revisión cuando el código cambie.
- Exigir Quality Gate, prueba funcional adecuada (staging/preview) y
  verificación de dependencias del backend. CI verde no prueba producción.
- Registrar decisión **MERGE / PEDIR CAMBIOS / NO FUSIONAR** y autorización
  específica para cambios de producción, migraciones o contenido.
- La fusión de una PR **no es autorización** para desplegar datos o activar flags.

Referencia oficial: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches
