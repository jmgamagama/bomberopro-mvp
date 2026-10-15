# Seguimiento de aceptación — 15 octubre 2026

PR #99 integrado tras revisión del código, Quality Gate correcto y ensayo de aceptación correcto. El ensayo verificó conservación al usar dos pestañas, cerrar/reabrir una pestaña, responder sin conexión y reconectar sin duplicar registros. No equivale a dos dispositivos físicos.

PR #100 ya superó por separado su control de calidad y ensayo de aceptación: fallo de lectura visible con reintento, progreso del panel coherente al volver de estudiar y recuperación en otro contexto de navegador con tamaño móvil. Se valida de nuevo junto a la corrección entre pestañas antes de integrarlo. Los checks y el cuerpo del PR conservarán el resultado final.

PR #105 de estudio v2 sigue separado. Requiere revisión de contenido y compatibilidad; no se incorpora por este seguimiento. No se ha ejecutado ninguna migración SQL en esta revisión.

Quedan pendientes la aceptación de JM en dispositivos físicos y la evidencia de aprendizaje prolongado. No declarar la plataforma cerrada únicamente con pruebas automatizadas.
