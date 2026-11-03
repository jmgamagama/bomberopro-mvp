# Recuperación y opciones referenciales · 24/10/2026

La revisión detectó dos regresiones: ConceptStudy barajaba «A y B»/«anteriores» y el último fallo podía finalizar la sesión antes de añadir su recuperación. Se reutiliza shuffleQuestionOptions, se espera la recuperación, se bloquea Siguiente mientras está pendiente y se limita la espera a8s. Error/sin variante/timeout permiten continuar tras confirmar guardado; una respuesta tardía o de otro tema no se inserta en la nueva sesión. La etiqueta pasa a «Vuelve a practicar este concepto»: no garantiza una dificultad inferior inexistente.

Se aclara también que la demo de fichas persiste repaso en el dispositivo; el test de muestra no guarda intentos. No se cambia almacenamiento ni se añade telemetría.

## Pruebas

Seis regresiones de componente: orden referencial; último fallo con RPC lenta; ausencia de variante; rechazo de RPC; timeout y respuesta tardía; cambio de tema con recuperación pendiente. Las dos regresiones originales de auditoría también pasan. npm ci, TypeScript, build y suite completa local:730 pasan,2 omitidos (incluye5 pruebas del directorio de auditoría local, no publicado en este PR). No es E2E móvil ni demuestra eficacia pedagógica.

Revisión React: actualizaciones funcionales en cola; recuperación ligada a época de sesión; cleanup invalida peticiones anteriores; temporizador se libera al terminar; opción elegida y clave idempotente se conservan; estado de espera accesible con role=status y botón disabled. Salir sigue disponible. No se cambian el motor FSRS, los intervalos ni las respuestas del banco.

## Pendientes de la auditoría

El lanzamiento continúa bloqueado por contenido:5 defectos confirmados en la muestra200 con195 sin dictamen. No hay IC95% global válido. Solo24/727 conceptos publicados tienen3 niveles; esta corrección no los fabrica. Retirada editorial y cierre de RPC heredada van en PR separados. Requiere revisión antes de merge conforme AGENTS.md.
