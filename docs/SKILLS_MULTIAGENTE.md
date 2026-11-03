# Skills multiagente de BomberoPRO

Esta PR versiona una skill editorial común en `.agents/skills/verificar-banco-preguntas` (Codex/Antigravity) y `.claude/skills/verificar-banco-preguntas` (Claude Code). Es una base nueva, no una recuperación confirmada del kit local anterior. Antes de sustituir archivos en Windows, revisar si el kit local contiene reglas o recursos adicionales y reconciliarlos.

## Comprobación
`node scripts/check-editorial-skills.mjs` comprueba presencia e igualdad de contenido. Una igualdad de archivos no demuestra que el agente los haya cargado o que su evaluación editorial sea correcta: contrastar con un conjunto de preguntas etiquetado por humano.

## Skills externas — instalación local, pendiente
En una terminal Windows dentro del repo, inspeccionar primero diferencias locales, origen y versión de dependencias. Consultar las skills reales con `npx skills add supabase/agent-skills --list` y `npx skills add vercel-labs/agent-skills --list`. Instalar selectivamente, tras revisar las instrucciones descargadas:

```powershell
npx skills add supabase/agent-skills --skill supabase-postgres-best-practices -a claude-code codex antigravity --copy -y
npx skills add vercel-labs/agent-skills --skill react-best-practices -a claude-code codex antigravity --copy -y
```

Verificar la sintaxis aceptada por la versión instalada del CLI antes de ejecutarlos. Evitar sobrescribir skills propias y revisar `git diff`. No ejecutar `npx skills update -y` de forma automática: revisar cambios upstream, licencias, procedencia, hashes y diff; actualizar en rama, validar y fusionar mediante revisión.

## Control de calidad
- Conservación de fuente primaria oficial aplicable a cada convocatoria (no solo BOE).
- Revisión humana obligatoria antes de publicar.
- Pruebas con preguntas APTA, CORREGIR, DESCARTAR y sin fuente.
- Métrica principal: falsos APTA de cada agente frente a referencia humana; discrepancia implica bloqueo.
- El script solo verifica copias de la skill editorial versionada; no garantiza sincronización de paquetes externos ni ejecución efectiva en las tres IAs.
