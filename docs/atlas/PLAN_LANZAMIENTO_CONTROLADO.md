# BomberoPRO/MIRA: preparación de lanzamiento

Fecha de revisión: 17/10/2026. Propuesta operativa pendiente de gates; no autoriza merge ni producción.

## Alcance de salida
Priorizar una beta privada con un grupo pequeño de alumnos, una convocatoria identificada
y contenido revisado. Separar esa validación de la apertura comercial.
Mantener BomberoPRO y MIRA sobre Vite/React/Supabase. No reconstruir la plataforma,
ampliar temarios automáticamente ni incorporar herramientas sin una necesidad demostrada.
No anunciar eficacia pedagógica a partir de aciertos inmediatos.

## Configuración y evidencia
| Área | Estado comprobado / decisión |
|---|---|
| Código | jmgamagama/bomberopro-mvp; trabajar en ramas y PR revisables |
| PR #110 | draft; corrector de conceptos, migración 18; no equivale a seguridad de todas las rutas |
| CI | head f78a82ab: Quality Gate 39051509306 verde; 522 tests y 26 pruebas SQL |
| Staging | referencia autorizada fxhvgvehhekqeqpkxtrm; no copiar datos personales productivos |
| Producción | yndoaprnpkjqiggeyefz; no realizar pruebas de escritura |
| Preview | build guard exige staging; bundle servido y clave efectiva aún sin certificar |
| Vercel | lectura de Preview protegida devuelve 403; requiere resolver alcance del acceso |
| Herramientas locales | sandbox Windows falla al arrancar terminal; navegador falló en sesión anterior |
| Proyecto local | BomberoPRO no aparece entre los proyectos locales registrados; no asumir que no existe en disco |
| Ajustes de la app | capturas inspeccionadas; ningún cambio de modelo, permisos o velocidad aplicado |

## Ajustes de trabajo propuestos, no aplicados
- Mantener el modelo seleccionado en la captura; usar razonamiento alto para seguridad,
  migraciones y revisión, y medio para trabajo rutinario. Es una preferencia operativa,
  no una garantía de calidad ni una necesidad de cambiar de modelo.
- Mantener velocidad estándar y los controles de permisos existentes.
- Recuperar terminal y navegador antes de diagnosticar fallos de la aplicación.
- Registrar el checkout real como proyecto cuando sea accesible.
- No cambiar ajustes globales de seguridad ni conceder acceso total como reparación genérica.
- GitHub, Supabase y Vercel son las integraciones necesarias ahora; analítica y pagos
  se incorporarán cuando sus gates estén listos.

## Orden de ejecución
1. Resolver runtime local y permisos de Vercel. Recuperar una URL inmutable del SHA
   bajo prueba. No desactivar la protección de Preview para ocultar el problema.
2. Certificar el bundle y tráfico de staging antes de autenticar/escribir.
3. Completar E2E de #110: login ficticio, preguntas, corrección, reintentos concurrentes,
   reporte, errores, reconexión, cambio de cuenta, cierre/reapertura y PWA antigua/nueva.
4. Resolver #111: retirar soluciones anticipadas en Entrenar/Por Temas/Simulacro y
   verificar calificación remota. La migración 17 ya ignora p_acierto en record_attempt_v2;
   no confundir ese arreglo con ocultar soluciones ni con PR #110.
5. Resolver #112: excluir contenido pendiente del bundle público; un filtro visual
   no impide descargar los chunks.
6. Revisar cobertura #117 y fuentes. No convertir los 422 vínculos a conceptos
   borrador en publicados automáticamente.
7. Validar beta privada: onboarding, sesión completa, progreso persistente,
   recuperación de fallos, soporte y feedback de alumnos.
8. Preparar apertura comercial: derechos de acceso en servidor, cobros y webhooks
   idempotentes, términos aplicables, soporte y recuperación probada.
9. Presentar candidato concreto, evidencia y rollback para decisión de producción.

## Criterios de salida de beta
- Cero escrituras de ensayo dirigidas a producción.
- Ninguna solución de test antes del momento permitido por el modo de estudio.
- Un evento por respuesta idempotente y separación entre cuentas comprobada.
- Contenido distribuido aprobado, con fuentes y ámbito de convocatoria.
- Experiencia usable en móvil/teclado; fallos recuperables sin perder respuestas.
- Compatibilidad/actualización PWA y rollback probados.
- Evidencia de las pruebas asociada al SHA y URL realmente ensayados.
- Bloqueantes de #118, #111 y #112 cerrados con pruebas, no solo cambios de documentación.

## Horizonte orientativo
Objetivo de planificación, no fecha comprometida: 2–4 semanas para una beta privada
una vez recuperados los accesos, sujeto al alcance real de #111/#112 y al E2E.
Reestimar tras cerrar el primer recorrido completo. No fijar apertura comercial
hasta conocer fallos de la beta, contenido disponible y preparación de cobros/soporte.
No hay evidencia que permita afirmar cuándo lanzarán otros competidores.

## Trazabilidad
- #109: secuencia general por gates.
- #118: aislamiento efectivo de Preview.
- docs/atlas/QA_PREVIEW_2026-10-17.md: resultados y pendientes.
- PR #108: piloto finito apagado; no sincroniza fichas locales con conceptos remotos.
- PR #117: cobertura técnica; no certifica revisión pedagógica.
