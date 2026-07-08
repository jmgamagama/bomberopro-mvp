---
name: qa-mecanico-bomberopro
description: >
  Usar para tareas mecánicas de QA en BomberoPro: correr suites de test,
    detectar regresiones, hacer refactors acotados y documentación.
      No usar para decisiones sobre el algoritmo de mastery o arquitectura.
      ---

      # Skill: QA Mecánico BomberoPro

      ## Cuándo se activa
      - Issues etiquetados con `antigravity`
      - Tareas de testing, linting, refactor acotado, documentación

      ## Reglas
      1. Trabaja siempre en rama `antigravity/<tarea>`
      2. Nunca mergees directo a main — abre PR siempre
      3. Antes de cada PR corre: npm run lint && npm run test
      4. Si detectas un bug fuera del scope de tu tarea, ábrelo como issue nuevo,
         no lo arregles sin que se te asigne explícitamente

         ## Vigilancia en background (tarea programada semanal)
         Cada lunes 9:00, busca en BOE y diarios oficiales de Extremadura/Andalucía/Madrid
         nuevas convocatorias de bombero publicadas la semana anterior.
         Extrae: fecha límite, plazas, temario (si disponible), enlace oficial.
         Guarda resumen en Google Doc "BomberoPro - Convocatorias".
         
