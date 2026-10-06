"""Genera los iconos PWA de BomberoPro (sin recursos externos).

Uso: python3 scripts/generate-pwa-icons.py
Salida: public/icons/{icon-192,icon-512,icon-maskable-512,apple-touch-icon}.png y public/favicon.png
Diseño: fondo índigo de la app (#4f46e5) y una llama blanca con núcleo ámbar.
"""
from pathlib import Path
from PIL import Image, ImageDraw

INDIGO = (79, 70, 229, 255)
WHITE = (255, 255, 255, 255)
AMBER = (251, 191, 36, 255)
OUT = Path(__file__).resolve().parent.parent / "public" / "icons"
SS = 4  # supersampling para bordes suaves


def flame(draw: ImageDraw.ImageDraw, cx: float, cy: float, h: float, fill) -> None:
    """Llama: cuerpo elíptico abajo + punta curva arriba (polígono suave)."""
    w = h * 0.62
    body_top = cy - h * 0.05
    draw.ellipse([cx - w / 2, body_top, cx + w / 2, cy + h / 2], fill=fill)
    # punta: curva de Bézier cuadrática a ambos lados
    pts = []
    tip = (cx + w * 0.08, cy - h / 2)
    left = (cx - w / 2, cy + h * 0.225)
    right = (cx + w / 2, cy + h * 0.225)
    ctrl_l = (cx - w * 0.55, cy - h * 0.15)
    ctrl_r = (cx + w * 0.55, cy - h * 0.05)
    n = 40
    for i in range(n + 1):
        t = i / n
        x = (1 - t) ** 2 * left[0] + 2 * (1 - t) * t * ctrl_l[0] + t ** 2 * tip[0]
        y = (1 - t) ** 2 * left[1] + 2 * (1 - t) * t * ctrl_l[1] + t ** 2 * tip[1]
        pts.append((x, y))
    for i in range(n + 1):
        t = i / n
        x = (1 - t) ** 2 * tip[0] + 2 * (1 - t) * t * ctrl_r[0] + t ** 2 * right[0]
        y = (1 - t) ** 2 * tip[1] + 2 * (1 - t) * t * ctrl_r[1] + t ** 2 * right[1]
        pts.append((x, y))
    draw.polygon(pts, fill=fill)


def render(size: int, *, maskable: bool, rounded: bool) -> Image.Image:
    s = size * SS
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    if maskable or not rounded:
        d.rectangle([0, 0, s, s], fill=INDIGO)
    else:
        d.rounded_rectangle([0, 0, s - 1, s - 1], radius=int(s * 0.22), fill=INDIGO)
    # Zona segura maskable: círculo del 80 %; la llama ocupa ~50 % del lado.
    h = s * (0.50 if maskable else 0.62)
    cx, cy = s / 2, s / 2 + h * 0.02
    flame(d, cx, cy, h, WHITE)
    flame(d, cx, cy + h * 0.17, h * 0.5, AMBER)
    return img.resize((size, size), Image.LANCZOS)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    render(192, maskable=False, rounded=True).save(OUT / "icon-192.png", optimize=True)
    render(512, maskable=False, rounded=True).save(OUT / "icon-512.png", optimize=True)
    render(512, maskable=True, rounded=False).save(OUT / "icon-maskable-512.png", optimize=True)
    # iOS aplica su propia máscara: fondo opaco a sangre, sin transparencia.
    render(180, maskable=False, rounded=False).convert("RGB").save(OUT / "apple-touch-icon.png", optimize=True)
    render(64, maskable=False, rounded=True).save(OUT.parent / "favicon.png", optimize=True)


if __name__ == "__main__":
    main()
