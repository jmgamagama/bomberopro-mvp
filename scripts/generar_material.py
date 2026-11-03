#!/usr/bin/env python3
"""Genera, a partir del texto oficial descargado del BOE, el material que no se redacta a mano:

  public/material/constitucion/constitucion-espanola-texto-oficial.md
      Texto consolidado completo de la Constitución. Descarga gratuita (texto oficial, de libre uso).
  public/material/constitucion/<bloque>-3-completo.md
      Extracto literal de los artículos incluidos en el temario. El estudio de conceptos se
      gestiona en la capa de estudio, por separado del texto normativo.

Uso:  python3 scripts/generar_material.py
Se ejecuta también en el workflow de fuentes BOE, para que el material siga al texto vigente.
"""
from __future__ import annotations

import datetime as dt
import json
import pathlib
import shutil

FUENTE = pathlib.Path("data/fuentes/BOE-A-1978-31229")
OUT = pathlib.Path("public/material/constitucion")
# (id del bloque, título del material, artículos en orden)
BLOQUES = [
    ("titulo-preliminar", "Título Preliminar (arts. 1–9)", range(1, 10)),
    ("dignidad-espanoles-extranjeros", "Dignidad, españoles y extranjeros (arts. 10–13)", range(10, 14)),
    ("derechos-fundamentales", "Igualdad y derechos fundamentales (arts. 14–29)", range(14, 30)),
    ("deberes-ciudadanos", "Derechos y deberes de los ciudadanos (arts. 30–38)", range(30, 39)),
    ("principios-rectores", "Principios rectores de la política social y económica (arts. 39–52)", range(39, 53)),
    ("garantias-suspension", "Garantías y suspensión de los derechos (arts. 53–55)", range(53, 56)),
]


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(FUENTE / "texto.md", OUT / "constitucion-espanola-texto-oficial.md")

    meta = json.loads((FUENTE / "meta.json").read_text(encoding="utf-8"))
    fecha_iso = meta.get("fecha_actualizacion_publicada")
    if not fecha_iso:
        raise SystemExit("Falta fecha_actualizacion_publicada; vuelve a descargar la fuente con scripts/fuente_boe.py")
    fecha = dt.date.fromisoformat(fecha_iso).strftime("%d/%m/%Y")
    bloques = {b["id"]: b for b in json.loads((FUENTE / "bloques.json").read_text(encoding="utf-8"))}
    for nombre, titulo, arts in BLOQUES:
        md = [f"# {titulo} · Texto oficial (extracto del temario)", "",
              f"Texto literal del BOE ({meta['id']}, actualización publicada el {fecha}). "
              "Este bloque contiene solo los artículos incluidos en el temario; el texto completo y vigente "
              "puede consultarse en la fuente oficial enlazada en la app.", ""]
        for n in arts:
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
        (OUT / f"{nombre}-3-completo.md").write_text("\n".join(md).rstrip() + "\n", encoding="utf-8")
    print("ok", OUT)


if __name__ == "__main__":
    main()
