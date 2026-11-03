#!/usr/bin/env python3
"""Generate the BomberoPro 1200x630 OG share card (issue #229).

Brand: navy #1E3A5F, white droplet with gold inner droplet (from favicon).
Classic teardrop parametric curve: x=sin(t), y=(cos(t)+1)/2 (point at top).
Deterministic PIL render, no network. RGB mode with pre-blended alphas.
"""
import math
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
NAVY = (30, 58, 95)          # #1E3A5F
NAVY_DARK = (20, 42, 72)
WHITE = (255, 255, 255)
GOLD = (255, 193, 7)         # #FFC107
MUTED = (203, 213, 225)


def blend(a, b, t):
    """Blend color b over a with opacity t (0..1)."""
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


img = Image.new("RGB", (W, H), NAVY)
d = ImageDraw.Draw(img)

# Soft vertical vignette
for y in range(H):
    t = y / H
    base = tuple(int(NAVY[i] + (NAVY_DARK[i] - NAVY[i]) * t * 0.55) for i in range(3))
    d.line([(0, y), (W, y)], fill=base)


def teardrop(cx, top_y, half_w, color):
    pts = []
    for a in range(0, 361, 3):
        rad = math.radians(a)
        x = cx + half_w * math.sin(rad)
        y = top_y + half_w * 2 * (math.cos(rad) + 1) / 2
        pts.append((x, y))
    d.polygon(pts, fill=color)


# --- Logo tile (rounded square) ---
tile_x, tile_y, tile_s = 110, 118, 192
tile_fill = blend(NAVY, WHITE, 54 / 255)
tile_edge = blend(NAVY, WHITE, 46 / 255)
d.rounded_rectangle([(tile_x, tile_y), (tile_x + tile_s, tile_y + tile_s)],
                    radius=40, fill=tile_fill, outline=tile_edge, width=3)

cx = tile_x + tile_s / 2
ty = tile_y + tile_s / 2 - 16
teardrop(cx, ty, 52, WHITE)
teardrop(cx - 6, ty + 14, 20, GOLD)


def load_font(size, bold=True):
    path = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
    return ImageFont.truetype(path, size)


def fit(text, max_w, start=40, bold=True):
    size = start
    while size > 18:
        f = load_font(size, bold)
        if f.getlength(text) <= max_w:
            return f
        size -= 2
    return load_font(18, bold)


text_x = 356
max_w = W - text_x - 40  # 804px safe zone

f_brand = fit("BomberoPro", max_w, start=96)
f_sub1 = fit("Oposiciones bombero Badajoz 2026", max_w, start=40)
f_sub2 = fit("Fichas con fuente oficial y simulacro gratis", max_w, start=40)
f_domain = fit("bomberopro.com", max_w, start=34)

d.text((text_x, 138), "BomberoPro", font=f_brand, fill=WHITE)
d.text((text_x, 252), "Oposiciones bombero Badajoz 2026", font=f_sub1, fill=MUTED)
d.text((text_x, 314), "Fichas con fuente oficial y simulacro gratis", font=f_sub2, fill=WHITE)
d.rounded_rectangle([(text_x, 428), (text_x + 240, 436)], radius=4, fill=GOLD)
d.text((text_x, 458), "bomberopro.com", font=f_domain, fill=GOLD)

out = "/mnt/HC_Volume_106549717/work-bombero/public/og-image.png"
img.save(out, "PNG", optimize=True)
import os
print("saved", out, img.size, os.path.getsize(out), "bytes")
