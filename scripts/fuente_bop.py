#!/usr/bin/env python3
"""Descarga un anuncio del BOP de Badajoz con el texto oficial de una norma y lo guarda versionado.

Uso:  python3 scripts/fuente_bop.py BOP-BA-2012-5370 [--html pagina.html]

  --html   trocea una copia ya descargada (p. ej. con curl) en lugar de descargarla.

Es el equivalente de scripts/fuente_boe.py para normas que solo se publican en el Boletín Oficial
de la Provincia (p. ej., el Reglamento de Régimen Interno del CPEI, tema 5). El BOP no tiene API de
legislación consolidada: se descarga la página HTML del anuncio y se trocea por artículos.

Escribe en data/fuentes/<ID>/ el mismo formato que fuente_boe.py, para que el validador, el
cargador y el generador de material funcionen igual:
  texto.html     página original del BOP (sin tocar), para auditoría
  bloques.json   un bloque por capítulo (encabezado), artículo (a1…a48) y disposición (df1…, dd)
  texto.md       texto legible
  meta.json      id, url, fecha de publicación, fecha de descarga, sha256 del HTML

Sin dependencias externas: solo biblioteca estándar.
"""
from __future__ import annotations

import datetime as dt
import hashlib
import html
import json
import pathlib
import re
import sys
import urllib.request

# Normas del BOP que usa BomberoPro. La fecha va en formato AAAAMMDD, como en meta.json del BOE.
NORMAS = {
    "BOP-BA-2012-5370": {
        "titulo": "Reglamento de Régimen Interno del Consorcio para la Prestación del Servicio de Prevención y "
                  "Extinción de Incendios en la Provincia de Badajoz (C.P.E.I.). Texto único vigente.",
        "boletin": "BOP de Badajoz n.º 149, de 6 de agosto de 2012, anuncio 5370/2012",
        "fecha": "20120806",
        "url": "https://www.dip-badajoz.es/bop/ventana_anuncio.php?id_anuncio=70559&FechaSolicitada=2012-08-06",
        "inicio": "CAPÍTULO PRIMERO",
        "fin": "Badajoz, a 13 de noviembre de 2006",
    },
}

ORDINALES = {"Primera": 1, "Segunda": 2, "Tercera": 3, "Cuarta": 4, "Quinta": 5}


def lineas(raw: str) -> list[str]:
    """Una línea por párrafo o salto de línea del HTML, sin etiquetas y con espacios normalizados."""
    s = re.sub(r"(?is)<(script|style).*?</\1>", "", raw)
    s = re.sub(r"(?i)<br\s*/?>|</p>|</div>|</h\d>|</li>|</tr>", "\n", s)
    s = html.unescape(re.sub(r"<[^>]+>", "", s))
    out = []
    for ln in s.split("\n"):
        ln = " ".join(ln.replace(" ", " ").split())
        if ln:
            out.append(ln)
    return out


def trocear(ls: list[str], cfg: dict) -> list[dict]:
    i0 = next(i for i, ln in enumerate(ls) if ln == cfg["inicio"])
    bloques: list[dict] = []
    cur: dict | None = None
    seccion = ""  # DISPOSICIONES FINALES / DEROGATORIAS
    n_cap = 0
    for ln in ls[i0:]:
        fin = cfg["fin"] in ln
        if fin:
            ln = ln.split("”")[0].strip() if "”" in ln else ln.split(cfg["fin"])[0].strip()
        m_art = re.match(r"^Art[íi]culo (\d+)\.?\s*(.*)$", ln)
        if ln.startswith("CAPÍTULO"):
            n_cap += 1
            cur = {"id": f"c{n_cap}", "tipo": "encabezado", "titulo": ln, "parrafos": [{"clase": "capitulo", "texto": ln}]}
            bloques.append(cur)
        elif m_art:
            n = m_art.group(1)
            cur = {"id": f"a{n}", "tipo": "precepto", "titulo": f"Artículo {n}",
                   "parrafos": [{"clase": "articulo", "texto": ln}]}
            bloques.append(cur)
        elif ln.startswith("DISPOSICIONES FINALES"):
            seccion, cur = "df", None
        elif ln.startswith("DISPOSICIONES DEROGATORIAS"):
            seccion = "dd"
            cur = {"id": "dd", "tipo": "precepto", "titulo": "Disposición derogatoria",
                   "parrafos": [{"clase": "articulo", "texto": ln}]}
            bloques.append(cur)
        elif seccion == "df" and ln.rstrip(".") in ORDINALES:
            k = ORDINALES[ln.rstrip(".")]
            cur = {"id": f"df{k}", "tipo": "precepto", "titulo": f"Disposición final {ln.rstrip('.').lower()}",
                   "parrafos": [{"clase": "articulo", "texto": ln}]}
            bloques.append(cur)
        elif cur is not None and cur["tipo"] == "encabezado" and ln.isupper():
            cur["titulo"] += f". {ln}"
            cur["parrafos"].append({"clase": "capitulo", "texto": ln})
        elif cur is not None and ln:
            cur["parrafos"].append({"clase": "parrafo", "texto": ln})
        if fin:
            break
    for b in bloques:
        b["version"] = {"id_norma": cfg["id"], "fecha_publicacion": cfg["fecha"], "fecha_vigencia": cfg["fecha"]}
        b["n_versiones"] = 1
    return bloques


def main() -> int:
    norma = sys.argv[1]
    cfg = dict(NORMAS[norma], id=norma)
    if "--html" in sys.argv:
        raw_b = pathlib.Path(sys.argv[sys.argv.index("--html") + 1]).read_bytes()
    else:
        req = urllib.request.Request(cfg["url"], headers={"User-Agent": "BomberoPro-fuentes/1.0 (+https://bomberopro.com)"})
        with urllib.request.urlopen(req, timeout=60) as r:
            raw_b = r.read()
    raw = raw_b.decode("utf-8")
    bloques = trocear(lineas(raw), cfg)
    arts = [b for b in bloques if b["id"].startswith("a")]
    nums = [int(b["id"][1:]) for b in arts]
    if nums != list(range(1, len(nums) + 1)):
        raise SystemExit(f"Numeración de artículos inesperada: {nums}")

    out = pathlib.Path("data/fuentes") / norma
    out.mkdir(parents=True, exist_ok=True)
    (out / "texto.html").write_bytes(raw_b)
    (out / "bloques.json").write_text(json.dumps(bloques, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    md = [f"# {cfg['titulo']}", "", f"Fuente: {cfg['boletin']}. {cfg['url']}", ""]
    for b in bloques:
        for p in b["parrafos"]:
            md.append(f"## {p['texto']}" if p["clase"] in ("capitulo",) else
                      f"### {p['texto']}" if p["clase"] == "articulo" else p["texto"])
            md.append("")
    (out / "texto.md").write_text("\n".join(md), encoding="utf-8")
    meta = {
        "id": norma,
        "titulo": cfg["titulo"],
        "boletin": cfg["boletin"],
        "url": cfg["url"],
        # Mismo nombre de campo que en las normas del BOE, para que el cargador lo lea igual.
        "fecha_actualizacion_boe": cfg["fecha"] + "T000000Z",
        "descargado": dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat(),
        "sha256_texto_xml": hashlib.sha256(raw_b).hexdigest(),
        "n_bloques": len(bloques),
    }
    (out / "meta.json").write_text(json.dumps(meta, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"{norma}: {len(bloques)} bloques ({len(arts)} artículos) → {out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
