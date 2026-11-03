# Paleta «Brasa y Noche» (variante A) — tokens, contraste y daltonismo

Estado: **propuesta, sin conectar a la app.** Archivos: `tokens.css`, `mockup.html` (abrir en el navegador; `?` no hace falta; para oscuro, `<html data-theme="dark">` o el modo del sistema).

## Contraste WCAG (ratio)
| Par | Claro | Oscuro |
|---|---|---|
| Texto / fondo | 16,5 | 14,8 |
| Texto secundario / fondo | 7,2 | 7,1 |
| Texto botón / botón | 5,18 | 7,73 |
| Botón hover / pressed (texto) | 6,85 / 8,77 | 10,4 / 6,2 |
| Texto cabecera / cabecera | 11,5 | 9,8 (con #22385A) |
| Acento como texto / fondo | 4,89 | 7,93 |
| Correcto / error / pendiente sobre superficie | 5,5 / 6,5 / 5,0 | 8,1 / 5,6 / 9,3 |
| Borde de campo / fondo | 4,5 (#78716C) | 4,1 (#7A8494) |
| Anillo de foco / fondo | 10,9 | 7,9 |

Cambios respecto a la maqueta original: borde de campos más fuerte (antes 1,2–1,6:1, por debajo de 3:1), cabecera oscura aclarada a #22385A + borde (antes 1,29:1 contra el fondo), mínimo de texto 13 px.
Deshabilitado: 3,8:1 claro y 2,8:1 oscuro (WCAG exime a los controles deshabilitados); se refuerza con cursor y sin hover.

## Daltonismo (ΔE2000; <10 = fácil de confundir)
| Par (claro) | Normal | Protan | Deutan | Tritan | Gris |
|---|---|---|---|---|---|
| primario ↔ error | 10,2 | 8,8 | 6,1 | 5,7 | 5,6 |
| aviso ↔ primario | 6,9 | 2,3 | **0,5** | 4,2 | 0,8 |
| correcto ↔ error | 60,6 | 15,2 | 17,8 | 57,7 | **4,1** |

Conclusión: el color solo no basta (primario/error/aviso se confunden en deuteranopía; correcto/error en escala de grises). Regla adoptada: **todo estado lleva icono + texto + contorno** (✓ Correcta, ✕ Incorrecta, ● Sin responder); relleno sólido solo para acciones.

## Cifras del examen (fuente: bases BOP Badajoz nº 135, `data/temario/cpei-badajoz-2026-anexo1.md`)
50 preguntas + 5 de reserva, 3 opciones (A/B/C), 60 min, +0,200 / −0,066 / 0. Nota de la maqueta: 39 aciertos, 7 errores, 4 en blanco = 7,338 → **7,3** (`calculateExamScore` + `scoreOutOfTen`). Aprobado: ≥ 5,0 (`isExamPassed`). Los datos de pregunta y calibración de la maqueta son ficticios.
