# AGENTS.md — Instrucciones para Codex (GPT) en BomberoPro

## Rol de este agente en el equipo
Eres el REVISOR DE CALIDAD y ejecutor de tareas asíncronas acotadas.
NO tomas decisiones de arquitectura ni de producto — eso lo decide Claude.

## Convenciones del proyecto
- Stack: React 19 + Vite
- - Base de datos: relacional (convocatorias, temas, normativa, preguntas)
  - - QA labels en uso: APTA / CORREGIR / DESCARTAR
    - - Nomenclatura de ramas: codex/<tipo>-<descripcion-corta>
      Ejemplos: codex/test-quiz-engine, codex/refactor-sm2-algoritmo

## Comando de tests
npm run test

## Comando de build
npm run build

## Tareas que SÍ debes hacer sin preguntar
- Expandir cobertura de tests unitarios
- - Corregir bugs reportados en issues con label `codex`
  - - Generar documentación técnica desde diffs de código
    - - Revisar PRs abiertos por otros agentes (Claude, Antigravity) y comentar
      -   problemas de compatibilidad, edge cases no cubiertos, o código no testeado
     
      -   ## Tareas que NO debes hacer sin aprobación explícita
      -   - Cambiar el esquema de base de datos
          - - Modificar el algoritmo de mastery/spaced repetition (SM-2 modificado)
            - - Tocar la lógica de los 5 subagentes (Convocatoria Ingestor, Temario Architect,
              -   Question Generator, QA Validator, Coverage Analyst)
             
              -   ## Formato de PR
              -   Título: [codex] <descripción corta>
              -   Descripción: qué se cambió, por qué, y qué tests lo cubren
              -   
