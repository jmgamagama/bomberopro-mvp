# Corrector seguro para las rutas tradicionales

## Estado y alcance

Implementación coordinada para entrenamiento, temas y simulacro. No sustituye FSRS ni completa las variantes que faltan. No valida semánticamente el banco ni permite declarar resuelto el umbral editorial del2%. Las nueve preguntas retiradas siguen fuera del conjunto publicado.

- `27_secure_assessments.sql`: fase de expansión. Crea sesiones/ítems/opciones opacas, receipts y acceso explícito administrado en servidor. No revoca contratos antiguos. Ningún acceso se activa por defecto; no se fía de user_metadata ni de un flag del navegador. No hay integración automática con cobros.
- `29_activate_secure_assessments.sql`: fase de contracción. Exige confirmación persistida de cliente listo y al menos una autorización activa. Exige cierre de la exportación26. Revoca los tres selectores tradicionales y el escritor v2; protege también los endpoints y tabla de conceptos. Las funciones SQL de índices se envuelven en PL/pgSQL para aplicar el mismo control, sin suponer que RLS limita SECURITY DEFINER.
- Frontend `VITE_SECURE_ASSESSMENTS=false` por defecto. Solo activar en el entorno comprobado después de expansión y acceso de prueba. Un flag no concede permisos de DB.

## Invariantes

Cada pregunta/opción tiene un identificador emitido por el servidor y vinculado al usuario/sesión. El payload inicial no contiene respuesta ni explicación. El servidor calcula el resultado y reutiliza record_attempt_v2 internamente para conservar la memoria/counters existentes; el booleano de cliente no se acepta. Se mantienen IDs y agrupaciones previas del selector: este PR no migra el algoritmo local ni su histórico.

Se fija snapshot y versión de contenido: pregunta, opciones, clave, explicación, fuente, concepto y tema. No incluye nivel estadístico que puede cambiar automáticamente con los intentos. Una pregunta retirada o modificada no se corrige como si fuera la antigua. Los cambios entre lectura del selector y emisión también se rechazan. El escritor usa el nivel servido.

Los reintentos conservan evento/ítem/opción/confianza/duración y son idempotentes por usuario/evento e ítem. Una segunda opción con el mismo prefijo de texto no puede aprovechar el truncado del escritor v2. El examen exige todos sus ítems (blancos incluidos) y libera feedback solo al cierre atómico.

Locks exclusivos para pregunta antes de actualizar counters; los exámenes bloquean todas sus preguntas por ID ascendente antes de corregir, independientemente del orden del alumno. La cuota se serializa por usuario. No afirmar concurrencia por pruebas de una sola conexión: se añade un job real PostgreSQL17 con dos conexiones y una pausa de prueba para reproducir contención.

## Recuperación del alumno

Antes de enviar se conserva la elección propia en `bomberopro:assessment-pending:v1:<owner>:<id>`. Una recarga puede recuperar el receipt de la operación original desde el inicio, sin generar otro intento. Si el almacenamiento falla no se presenta la elección como guardada. La copia local/exportación incluye solo el propietario y conserva pendientes al borrar otros datos locales.

Errores de red permiten reintento; versión retirada/cambiada, sesión vencida o conflicto llevan al inicio para una sesión actualizada. Los pendientes terminales quedan para revisión, no se reintentan automáticamente. El acceso de otra cuenta no recupera la respuesta de la anterior.

La cola antigua queda **pausada e intacta**, sin moverla a un archivo limitado a50 ni borrar entradas si no cabe una copia. Un fallo al pedir sesión nueva deja error recuperable y no recicla ítems ya corregidos.

## Secuencia de despliegue (sin atajos)

1. Revisar y fusionar el PR. Aplicar solo27 en staging; comprobar firmas, RLS y ausencia de accesos automáticos.
2. Activar una autorización de prueba elegida por el operador, en staging; configurar el cliente de preview con VITE_SECURE_ASSESSMENTS=true y destino staging verificado. No copiar ni mostrar claves.
3. Verificar usuario propio/ajeno, preguntas retiradas, cambios, errores, recarga y examen. Ejecutar el job PostgreSQL17 y los tests de interfaz. No declarar E2E de navegador autenticado a partir de jsdom o SQL.
4. Solo tras verificar el cliente, registrar `assessment_rollout.client_ready_at` y la evidencia en note; aplicar29. Sin ese registro29 falla cerrado. Verificar que ninguna RPC/tabla secundaria evita el acceso.
5. Repetir la secuencia revisada en producción, conservando el despliegue anterior y una ventana coordinada para PWA antiguas. No aplicar29 porque27 haya compilado. No activar accesos ni adjudicar planes comerciales sin una decisión explícita del operador.

## Reversión y evidencia

Deshacer29 antes de27. Down29 restaura las definiciones capturadas y el acceso tradicional: reabre la exposición anterior y requiere decisión expresa. Down27 retira el API nuevo pero retiene intentos, receipts, autorizaciones y snapshots; up27 admite re-aplicación conservando evidencia. No borra datos de alumnos para recuperar una versión.

Tests: PGlite con el escritor17 real; API/Train/MockExam con red simulada; pausa de70 pendientes incluso con quota; job PostgreSQL17 de respuestas simultáneas a la misma pregunta, cambio estadístico de nivel y dos exámenes en orden inverso. El job usa un contenedor desechable llamado audit; el SQL de fixtures se niega a correr en otra DB. Los límites y permisos reales deben revisarse después en Supabase.

Retención/coste de snapshots y activación de cuentas comerciales requieren definición operativa antes de escalar. No se estima €/alumno LLM sin facturación/MAU. No se incluyen manuales privados en este PR.
