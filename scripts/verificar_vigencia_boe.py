#!/usr/bin/env python3
"""Comprueba con la API de datos abiertos del BOE que el material de cada tema usa la versión vigente.

Para cada scripts/material/temaNN.json lee los metadatos de su norma en
  https://www.boe.es/datosabiertos/api/legislacion-consolidada/id/<ID>/metadatos
y exige: vigencia_agotada = N, estado_consolidacion = Finalizado y que la fecha_actualizacion del BOE
sea la misma que la de data/fuentes/<ID>/meta.json (la descargada con scripts/fuente_boe.py).
Si el BOE ha publicado una versión posterior, falla: hay que volver a descargarla y regenerar.

Uso: python3 scripts/verificar_vigencia_boe.py [--md docs/VIGENCIA_MATERIAL_BOE.md]
"""
from __future__ import annotations

import datetime as dt
import json
import pathlib
import sys
import urllib.request
import xml.etree.ElementTree as ET

API = "https://www.boe.es/datosabiertos/api/legislacion-consolidada/id/{id}/metadatos"


def metadatos(boe_id: str) -> dict:
    req = urllib.request.Request(API.format(id=boe_id), headers={"Accept": "application/xml", "User-Agent": "BomberoPro-fuentes/1.0"})
    with urllib.request.urlopen(req, timeout=60) as r:
        root = ET.fromstring(r.read())
    if (root.findtext("./status/code") or "").strip() != "200":
        raise SystemExit(f"{boe_id}: BOE status {root.findtext('./status/code')}")
    m = root.find("./data/metadatos")
    t = lambda k: (m.findtext(k) or "").strip()  # noqa: E731
    return {"titulo": t("titulo"), "fecha_actualizacion": t("fecha_actualizacion"), "vigencia_agotada": t("vigencia_agotada"),
            "estado_consolidacion": t("estado_consolidacion"), "fecha_derogacion": t("fecha_derogacion")}


def main() -> None:
    filas, errores = [], []
    specs = sorted(pathlib.Path("scripts/material").glob("tema*.json"))
    vistos: dict[str, dict] = {}
    for f in specs:
        spec = json.loads(f.read_text(encoding="utf-8"))
        boe_id = spec["boe"]
        meta = json.loads((pathlib.Path("data/fuentes") / boe_id / "meta.json").read_text(encoding="utf-8"))
        api = vistos.setdefault(boe_id, metadatos(boe_id))
        local = meta["fecha_actualizacion_boe"]
        ok = api["vigencia_agotada"] == "N" and api["estado_consolidacion"] == "Finalizado" and api["fecha_actualizacion"] == local and not api["fecha_derogacion"]
        if not ok:
            errores.append(f"T{spec['tema']} {boe_id}: API {api} / local {local}")
        d = local[:8]
        filas.append(f"| {spec['tema']} | {boe_id} | {d[6:8]}/{d[4:6]}/{d[:4]} | {api['vigencia_agotada']} | {api['estado_consolidacion']} | {'sí' if api['fecha_actualizacion'] == local else 'NO'} |")
        print(("OK  " if ok else "FAIL"), f"T{spec['tema']}", boe_id, api["fecha_actualizacion"])
    if "--md" in sys.argv:
        out = pathlib.Path(sys.argv[sys.argv.index("--md") + 1])
        hoy = dt.datetime.now().strftime("%d/%m/%Y %H:%M")
        out.write_text("# Vigencia del material por tema (API del BOE)\n\n"
                       f"Comprobado el {hoy} con `python3 scripts/verificar_vigencia_boe.py --md {out}` (API de datos abiertos, "
                       "legislación consolidada, `/metadatos`). «Igual a la descargada» compara `fecha_actualizacion` del BOE con "
                       "`data/fuentes/<ID>/meta.json`.\n\n"
                       "| Tema | Norma | Última actualización BOE | Vigencia agotada | Consolidación | Igual a la descargada |\n|---|---|---|---|---|---|\n"
                       + "\n".join(filas) + "\n", encoding="utf-8")
    if errores:
        print("\n".join(errores))
        raise SystemExit(1)


if __name__ == "__main__":
    main()
