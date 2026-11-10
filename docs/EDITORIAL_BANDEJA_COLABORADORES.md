# Bandeja editorial compartida — BomberoPRO CPEI (protocolo v1)
 
## Objetivo
Eliminar el envío manual de lotes al propietario: agentes proponen contenido en un sitio compartido, una revisión periódica lee los cambios y la decisión queda trazada. **El repositorio GitHub y sus PR constituyen la evidencia**, no un Site independiente.

## Entrada y privacidad (bloqueante)
- El repositorio `jmgamagama/bomberopro-mvp` es público. **Una PR, incluso en borrador, puede exponer inmediatamente nuevos ítems, fuentes o materiales internos**. No depositar aquí preguntas inéditas del CPEI, PDFs restringidos, alumnos o CSV de intentos.
- Para contenido editorial confidencial, crear primero un **repositorio GitHub privado de revisión** bajo control de JM, o cambiar la visibilidad de este repositorio después de valorar el efecto sobre la web y los colaboradores. El agente usará una identidad propia con permiso mínimo sobre ese repositorio, nunca tokens de administrador compartidos.
- Hasta configurar ese espacio privado, la bandeja de este repositorio solo recoge **plantillas, metadatos no sensibles y propuestas técnicas inocuas**. El acceso de lectura al código público ya existe; no se ha concedido acceso a producción.

## Convención para las entregas del colaborador (una PR por lote)
1. Rama `editorial/deepseek/cpei-tNN-loteNN` en repositorio **privado de revisión**.
2. PR **borrador** con título `[editorial][CPEI] TNN lote NN — 30 preguntas`. En la descripción incluir fecha, convocatoria, tema(s), epígrafes, cantidad, commit SHA, fuentes primarias, enlace a reporte de linter, recuentos de duplicados y cambios desde anterior revisión.
3. Lote hasta **30 preguntas**, exactamente tres opciones A/B/C, nivel, referencia por epígrafe, fuente y localización verificable, respuesta y explicación, ID de origen de cada ficha/concepto, estado `borrador`. No mezclar otros concursos.
4. Exportación estructurada y versionada (`lotes/cpei/tNN/loteNN.csv`): `id_origen,tema,epigrafe,fuente,localizacion,enunciado,opcion_a,opcion_b,opcion_c,correcta,explicacion,nivel,estado,hash_dedupe`. No incluir datos de usuarios.
5. Incluir evidencia de QA de **las 30**: fuente cotejada, respuesta única, distractores plausibles y mutuamente excluyentes, ausencia de doble interpretación, norma vigente, duplicación contra banco existente.
6. Al encontrar un problema, reabrir o actualizar la **misma PR**; no producir un segundo lote mientras el anterior esté pendiente o rechazado.

## Revisión periódica automática y decisión
- Un monitor revisa PR abiertas de título `[editorial][CPEI]`, lista los archivos y, cuando estén accesibles, revisa los ítems y evidencia del lote. Produce por PR un informe: `aceptable / requiere correcciones / bloqueado`, problemas por ID, norma citada, tipo de defecto, severidad y acción. No aprobar en bloque sin leer los 30.
- Distinguir resultados de lint/test de la **revisión editorial humana**, que exige comprobación independiente. La IA puede facilitar la revisión y marcar defectos, no autoconceder aprobación editorial.
- JM valida el resultado editorial final y autoriza explícitamente cualquier `merge`, despliegue, migración o publicación. **Una PR verde no habilita publicación.**
- Incidencias del mismo lote van en los comentarios de la PR; todas las decisiones se conservan allí con fecha y evidencia. Si no hay nuevos lotes o cambios, no enviar notificación innecesaria.

## Panel editorial existente
Site de control: https://bomberopro-revision-temas.jmgama.chatgpt.site/
El Site actual sirve como **panel de revisión y decisiones**, pero **no se ha verificado conexión bidireccional ni sincronización automática con GitHub/Supabase**. No tratar lo mostrado por el Site como prueba de que ha recibido un lote ni como estado de producción.
Fase siguiente: conectar el Site a un backend privado de lectura de PR/estados, con acceso controlado por usuario, sin service_role en cliente, mostrando fuente, commit SHA y enlace a cada evidencia. Ninguna decisión del Site desplegará material por sí sola.

## Primer hito y criterios de cierre
- JM y DeepSeek comparten un repositorio de revisión **privado** o un servicio privado equivalente: lectura y propuesta según rol. No proporcionar credenciales administrativas ni datos personales.
- DeepSeek sube primer lote de 30 y el monitor encuentra automáticamente su PR.
- Revisión completa de 30/30 con informe, comentarios y decisión reproducible; cero duplicados y cero errores críticos. Todas las preguntas siguen en borrador.
- **Solo entonces** se permite iniciar el lote siguiente; la integración en la app requiere su propio gate, prueba y autorización.

Cómo se validan los lotes sin hacerlos públicos: `docs/EDITORIAL_GATEKEEPER_V1.md`, apartado «Decisión (10/11/2026)».

Estado de este archivo: **protocolo propuesto**, aún no conectado al Site ni activo sobre un repositorio privado de lotes.
