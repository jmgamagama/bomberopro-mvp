# Mis supuestos (privado): importación en el dispositivo

Sirve para estudiar material propio con derechos de terceros (por ejemplo, los casos de formación
interna del CPEI) **sin publicarlo**. El archivo:

- se lee en el navegador y se guarda solo en `localStorage`, con clave por cuenta
  (`mira_supuestos_privados_v1:<userId|demo>`, ver `src/utils/localOwner.ts`);
- **no se envía a ningún servidor**, no se sincroniza y no lo ven otros usuarios ni otras cuentas del mismo navegador;
- no está en el repo ni en el build (el repo solo tiene el código y un ejemplo ficticio);
- se puede borrar uno a uno o todos desde la pantalla de Supuestos.

La entrada «Supuestos» del menú («Casos» en el móvil) aparece si hay supuestos revisados visibles **o** supuestos
privados importados en la cuenta actual. La primera vez se llega con el enlace directo **`/#supuestos`**.

## Esquema del archivo (versión 1)

```json
{
  "formato": "bomberopro-supuestos",
  "version": 1,
  "supuestos": [ /* uno o más supuestos */ ]
}
```

También se admite directamente la lista `[ … ]` de supuestos. Máximo 2 MB y 500 supuestos por archivo.

### Supuesto

| Campo | Tipo | Obligatorio | Notas |
|---|---|---|---|
| `id` | texto | sí | Letras sin tilde, números, `-`, `_`, `.` (máx. 80). Único en el archivo. Si ya existe uno con ese id, se sustituye. |
| `titulo` | texto | sí | Máx. 300 caracteres. |
| `enunciado` | texto | sí | Admite saltos de línea (`\n`). |
| `temas` | lista de números | no | Temas del anexo I, del 1 al 40. |
| `fuentes` | lista de textos | no | De dónde sale el caso. |
| `preguntas` | lista | sí | Al menos 1, máx. 100. Ids únicos dentro del supuesto. |

### Pregunta (campos comunes)

| Campo | Tipo | Obligatorio | Notas |
|---|---|---|---|
| `id` | texto | sí | Mismo formato que el id del supuesto. |
| `tipo` | `"test"`, `"calculo"` o `"desarrollo"` | sí | |
| `enunciado` | texto | sí | |
| `explicacion` | texto | no | Se muestra al corregir. |
| `fuente`, `localizacion` | texto | no | Se muestran al corregir; un enlace `https://` se puede abrir. |

- **test**: `opciones` (lista de 2 a 6 textos distintos) y `correcta` (posición de la buena, **empezando en 0**).
- **calculo**: `resultado` (número **sin comillas**, punto decimal: `2.5`), `unidad` (texto), `tolerancia`
  (margen admitido, ≥ 0; por defecto 0), y opcionales `formula` y `pasos`
  (`[{ "descripcion", "operacion", "resultado", "unidad" }]`). El alumno puede escribir `19.200`, `2,5` o `25 m`.
- **desarrollo**: `respuestaModelo` (texto). Al corregir, el alumno ve la respuesta modelo y se autoevalúa
  («La tenía bien» / «La tenía mal»), y eso cuenta en el resultado.

Si el archivo tiene errores no se importa nada, y la pantalla dice dónde está cada uno, por ejemplo:
`supuestos[0].preguntas[2].correcta: debe ser la posición de la opción correcta, empezando en 0 (entre 0 y 3)`.

Ejemplo completo con datos ficticios marcados como EJEMPLO: [`docs/ejemplos/supuestos-privados-EJEMPLO.json`](ejemplos/supuestos-privados-EJEMPLO.json).

## Convertir la base de casos del Drive (solo local)

`scripts/convertir-base-casos.ts` convierte `BASE_CASOS_PRACTICOS_CPEI_2026.json` a este formato. No contiene
datos reales y no entra en el build. Se niega a escribir dentro del repo:

```bash
npx vite-node scripts/convertir-base-casos.ts <BASE_CASOS.json> /workspace/privado/supuestos_jose.json
```

Toma los casos aptos para autocorrección y los que tienen solución (salvo las rechazadas). Una solución numérica
limpia pasa a preguntas de cálculo (tolerancia: media unidad de la última cifra; ±2 % si la base pone «≈»); el
resto, a una pregunta de desarrollo. El texto viene de OCR: se limpia lo evidente y cada enunciado avisa de que
hay que cotejarlo con el PDF. Las soluciones «pendiente de recálculo» lo indican en la explicación.
