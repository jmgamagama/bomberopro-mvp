#!/usr/bin/env python3
"""Genera el material de un tema a partir del texto consolidado del BOE descargado en data/fuentes/<BOE-A-…>/.

Solo copia texto literal del BOE (títulos de capítulo, rúbricas y párrafos de los artículos) y enlaza cada
artículo con su ancla en boe.es. No redacta nada: no hay capa «desarrollo» (esa capa la escribe una persona).

Uso:
  python3 scripts/generar_material_boe.py BOE-A-1995-24292 tema06 lprl 1,2,3,4
  (tema 6: el anexo I de las bases solo pide los capítulos I a IV)

Salida en public/material/<carpeta>/:
  <prefijo>-NN-1-esquema.md   un fichero por capítulo: rúbricas literales con enlace al artículo en el BOE
  <prefijo>-NN-3-completo.md  un fichero por capítulo: texto literal de cada artículo con su enlace
  <prefijo>-indice.json       capítulos y preceptos (para comprobar el registro de material)
  <prefijo>-texto-oficial.md copia de data/fuentes/<id>/texto.md (texto consolidado completo)
"""
from __future__ import annotations

import json
import pathlib
import shutil
import sys

PARRAFOS = ("parrafo", "parrafo_2", "sangrado_2")


def main() -> None:
    boe_id, carpeta, prefijo = sys.argv[1:4]
    # Opcional: números de bloque del epígrafe del temario (p. ej. «1,2,3,4»); los demás no se generan.
    solo = {int(x) for x in sys.argv[4].split(",")} if len(sys.argv) > 4 else None
    fuente = pathlib.Path("data/fuentes") / boe_id
    meta = json.loads((fuente / "meta.json").read_text(encoding="utf-8"))
    bloques = json.loads((fuente / "bloques.json").read_text(encoding="utf-8"))
    f = meta["fecha_actualizacion_boe"][:8]
    fecha = f"{f[6:8]}/{f[4:6]}/{f[0:4]}"
    url = meta["url"]
    titulo_norma = meta["titulo"].rstrip(".")

    # Capítulos en orden: cada «encabezado» abre uno; los preceptos que siguen le pertenecen.
    grupos: list[tuple[str, list[dict]]] = []
    for b in bloques:
        if b["tipo"] == "encabezado":
            ps = {p["clase"]: p["texto"] for p in b["parrafos"]}
            grupos.append((f"{ps.get('capitulo_num', b['titulo'])} · {ps.get('capitulo_tit', '')}".strip(" ·"), []))
        elif b["tipo"] == "precepto":
            if not grupos or b["id"].startswith("d"):
                if not grupos or grupos[-1][0] != "Disposiciones":
                    grupos.append(("Disposiciones", []))
            grupos[-1][1].append(b)

    def rubrica(b: dict) -> str:
        return next((p["texto"] for p in b["parrafos"] if p["clase"] == "articulo"), b["titulo"]).rstrip(".")

    cab = (f"Texto consolidado del BOE ({boe_id}, última actualización publicada el {fecha}). "
           f"Fuente oficial: [{titulo_norma}]({url}). Texto con carácter informativo; "
           "la versión con valor jurídico es la publicada en el BOE.")

    out = pathlib.Path("public/material") / carpeta
    out.mkdir(parents=True, exist_ok=True)
    indice = []
    for n, (nombre, ps) in enumerate(grupos, start=1):
        if solo is not None and n not in solo:
            continue
        slug = f"{prefijo}-{n:02d}"
        esq = [f"# {nombre} · Esquema", "", cab, "",
               f"{len(ps)} {'precepto' if len(ps) == 1 else 'preceptos'}. Cada rúbrica (literal) enlaza con su artículo en el BOE.", ""]
        com = [f"# {nombre} · Texto completo", "", cab, ""]
        for b in ps:
            enlace = f"{url}#{b['id']}"
            esq.append(f"- [{rubrica(b)}]({enlace})")
            com += [f"## {rubrica(b)}", "", f"[Ver en el BOE]({enlace})", ""]
            cuerpo = [f"> {p['texto']}" for p in b["parrafos"] if p["clase"] in PARRAFOS]
            for i, linea in enumerate(cuerpo):
                com.append(linea)
                if i < len(cuerpo) - 1:
                    com.append(">")
            com.append("")
        (out / f"{slug}-1-esquema.md").write_text("\n".join(esq).rstrip() + "\n", encoding="utf-8")
        (out / f"{slug}-3-completo.md").write_text("\n".join(com).rstrip() + "\n", encoding="utf-8")
        indice.append({"id": slug, "titulo": nombre, "preceptos": [b["id"] for b in ps]})
    (out / f"{prefijo}-indice.json").write_text(json.dumps(indice, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    shutil.copyfile(fuente / "texto.md", out / f"{prefijo}-texto-oficial.md")


if __name__ == "__main__":
    main()
