#!/usr/bin/env python3
"""Genera, a partir del texto oficial descargado del BOE, el material que no se redacta a mano:

  public/material/constitucion/constitucion-espanola-texto-oficial.md
      Texto consolidado completo de la Constitución. Descarga gratuita (texto oficial, de libre uso).
  public/material/constitucion/titulo-preliminar-3-completo.md
      Tercera capa del Título Preliminar: texto literal de cada artículo y, debajo, los conceptos
      que se estudian de él (tarjetas de data/constitucion/titulo-preliminar.json).

Uso:  python3 scripts/generar_material.py
Se ejecuta también en el workflow de fuentes BOE, para que el material siga al texto vigente.
"""
from __future__ import annotations

import json
import pathlib
import shutil

FUENTE = pathlib.Path("data/fuentes/BOE-A-1978-31229")
OUT = pathlib.Path("public/material/constitucion")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(FUENTE / "texto.md", OUT / "constitucion-espanola-texto-oficial.md")

    meta = json.loads((FUENTE / "meta.json").read_text(encoding="utf-8"))
    f = meta["fecha_actualizacion_boe"][:8]
    fecha = f"{f[6:8]}/{f[4:6]}/{f[0:4]}"
    bloques = {b["id"]: b for b in json.loads((FUENTE / "bloques.json").read_text(encoding="utf-8"))}
    conceptos = json.loads(pathlib.Path("data/constitucion/titulo-preliminar.json").read_text(encoding="utf-8"))["conceptos"]

    md = ["# Título Preliminar (arts. 1–9) · Texto completo y conceptos", "",
          f"Texto literal del BOE ({meta['id']}, actualización publicada el {fecha}). Debajo de cada artículo, "
          "los conceptos que BomberoPro te pregunta de él.", ""]
    for n in range(1, 10):
        b = bloques[f"a{n}"]
        md.append(f"## {b['titulo']}")
        md.append("")
        for p in b["parrafos"]:
            if p["clase"] in ("parrafo", "parrafo_2"):
                md.append(f"> {p['texto']}")
                md.append(">")
        if md[-1] == ">":
            md.pop()
        md.append("")
        cs = [c for c in conceptos if c["bloque"] == f"a{n}"]
        if cs:
            md.append(f"**Conceptos del artículo {n} ({len(cs)}):**")
            md.append("")
            for c in cs:
                md.append(f"- **{c['tarjeta']['pregunta']}** {c['tarjeta']['respuesta']}")
            md.append("")
    (OUT / "titulo-preliminar-3-completo.md").write_text("\n".join(md).rstrip() + "\n", encoding="utf-8")
    print("ok", OUT)


if __name__ == "__main__":
    main()
