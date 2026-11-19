# Material interno del CPEI servido desde el servidor (fase C, paso 4)

Estado: **código preparado, bandera APAGADA**. Con la bandera apagada la app se comporta exactamente
igual que antes. Rama `grok/mazos-internos-servidor` (19/11/2026).

## Qué es material interno

| Mazo | Fichas | Fuente | Tratamiento con la bandera |
|---|---|---|---|
| T38 | 198 | ITF del CPEI (Horario, Vestuario/EPIs, Limpieza de EPIs, Gestión de EPIs colectivos) | entero desde el servidor |
| T39 | 42 de 149 | Manuales de la plataforma SOS (módulo operativo y de personal) | parte SOS desde el servidor |
| T39 | 107 de 149 | Protocolo de movilización, BOP Badajoz n.º 224/2025 (público) | **sigue en el bundle** |
| T40 | 213 | PT01 Conducción y PT03 Amianto | entero desde el servidor |

Restos fuera de los mazos, tratados con la misma bandera: 6 preguntas de la muestra de invitado
(`src/data/initialDataInterno.ts`: T38 ×2, SOS ×1, T40 ×3; la muestra pasa de 15 a 9) y los pasos de
«Ordena los pasos» (`src/data/procedimientoPasos.ts`, todo ITF/PT03; muestra su aviso de «sin fichas»).
El T37 (BOP n.º 117/2026) es público y no cambia.

## Banderas (build de Vite)

- `VITE_INTERNAL_DECKS_FROM_SERVER=true`: solo el material interno sale del bundle. Es la activación
  mínima: basta cargar 453 fichas en `recall_cards`.
- `VITE_PRO_DECKS_FROM_SERVER=true` (existente, fase C completa): todos los mazos Pro desde el servidor;
  **implica** la anterior. El T39 se pide entero (cargar sus 149 fichas). El mazo gratis (`tema1`)
  sigue en local (antes de esta rama, con esta bandera el tema 1 fallaba al cargar).

Vite sustituye la bandera por una constante y Rollup elimina los `import()` de los módulos internos.
Comprobado con `VITE_INTERNAL_DECKS_FROM_SERVER=true npm run build`: ningún fichero de `dist/` contiene
textos de las ITF, la plataforma SOS, PT01 ni PT03 (solo los títulos de los temas, que están en el
anexo I del BOP 135/2026).

## Cómo carga el cliente

- T38 y T40: `get_recall_deck_cards(p_deck_id)`; el servidor exige sesión y plan `pro` (migraciones 38 y 53).
- T39: une las 107 públicas del bundle con lo que devuelva el servidor para `tema39`, sin duplicados y por
  `orden`. Sin cuenta, sin plan o sin red (y sin copia) el alumno estudia las 107 públicas; no se guarda
  en memoria y se reintenta en la siguiente carga.
- Copia offline: cada respuesta correcta del servidor se guarda en localStorage con la clave
  `mira_mazo_servidor_v1:<mazo>:<userId>`. Solo se usa si la RPC falla y solo para la misma cuenta. Sin
  sesión no se guarda nada. Para estudiar sin conexión hay que haber abierto el mazo una vez con red.

## Qué falta para activarlo (cada paso requiere permiso escrito de JM)

1. **Cargar `recall_cards`** en staging y después en producción con el SQL generado fuera del repo
   (453 filas, idempotente, comprueba recuentos y que ningún mazo interno esté en `recall_free_decks`).
   Precondición: migraciones 38, 53 y 54 aplicadas en ese entorno. Las filas nunca van a un repositorio.
2. **Comprobar con una cuenta beta** (staging) que `get_recall_deck_cards` devuelve 198 / 42 / 213.
3. **Activar `VITE_INTERNAL_DECKS_FROM_SERVER=true` en Vercel** (Preview primero, después Production).
4. **Desplegar** y verificar en el `dist/` publicado que no hay texto interno.
5. **PR posterior** que retire `tema38Recall.ts`, `tema39SosRecall.ts`, `tema40Recall.ts`,
   `initialDataInterno.ts` y los pasos de `procedimientoPasos.ts` del repositorio (y adapte sus tests).
   Ojo: retirarlos de `main` no los borra del historial de git.

Consecuencias de activar: las personas sin cuenta dejan de ver T38, T40 y la parte SOS del T39 (el
servidor exige sesión); las cuentas `free` del servidor también (exige plan `pro`). Los revisores dejan
de ver fichas que el servidor no tenga marcadas como `revisado`.

Marcha atrás: quitar la bandera en Vercel y volver a desplegar (las fichas siguen en el repo hasta el paso 5).
