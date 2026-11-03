#!/usr/bin/env python3
"""Comprueba la vigencia API y la fecha publicada en la página consolidada oficial del BOE.

Para cada scripts/material/temaNN.json y para la Constitución del T1 comprueba el estado y la marca de
actualización de la API contra data/fuentes/<ID>/meta.json. Además, compara la fecha publicada que muestra
act.php con fecha_actualizacion_publicada. Si hay diferencias, hay que volver a descargar y regenerar el material.

Uso: python3 scripts/verificar_vigencia_boe.py [--md docs/VIGENCIA_MATERIAL_BOE.md]
"""
from __future__ import annotations

import datetime as dt
import json
import pathlib
import sys
import urllib.request
import xml.etree.ElementTree as ET

try:
    from .fuente_boe import consultar_fecha_actualizacion_publicada
except ImportError:
    from fuente_boe import consultar_fecha_actualizacion_publicada

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
    pares: list[tuple[int, str]] = [(1, "BOE-A-1978-31229")]
    for f in specs:
        spec = json.loads(f.read_text(encoding="utf-8"))
        for b in [spec["boe"], *[bl["boe"] for bl in spec["bloques"] if bl.get("boe")]]:
            if (spec["tema"], b) not in pares:
                pares.append((spec["tema"], b))
    pares.sort()
    vistos: dict[str, dict] = {}
    manuales: list[str] = []
    for tema, boe_id in pares:
        spec = {"tema": tema}
        meta = json.loads((pathlib.Path("data/fuentes") / boe_id / "meta.json").read_text(encoding="utf-8"))
        if meta.get("origen") == "doe":
            # El DOE no tiene API de vigencia: se lista la comprobación manual guardada en meta.json (scripts/fuente_doe.py).
            manuales.append(f"| {tema} | {boe_id} | {meta['publicacion']} | {meta['comprobado']} | {meta['busqueda']} |")
            print("DOE ", f"T{tema}", boe_id, "comprobado a mano el", meta["comprobado"])
            continue
        if boe_id not in vistos:
            vistos[boe_id] = {
                "api": metadatos(boe_id),
                "publicada": consultar_fecha_actualizacion_publicada(boe_id),
            }
        actual = vistos[boe_id]
        api = actual["api"]
        local_api = meta["fecha_actualizacion_boe"]
        local_publicada = meta.get("fecha_actualizacion_publicada")
        fecha_publicada = actual["publicada"]
        api_coincide = api["fecha_actualizacion"] == local_api
        boe_coincide = local_publicada == fecha_publicada
        ok = (
            api["vigencia_agotada"] == "N"
            and api["estado_consolidacion"] == "Finalizado"
            and api_coincide
            and boe_coincide
            and not api["fecha_derogacion"]
        )
        if not ok:
            errores.append(
                f"T{spec['tema']} {boe_id}: API {api} / local API {local_api}; "
                f"fecha publicada actual {fecha_publicada} / local {local_publicada}"
            )
        api_date = f"{local_api[6:8]}/{local_api[4:6]}/{local_api[:4]}"
        published_date = f"{fecha_publicada[8:10]}/{fecha_publicada[5:7]}/{fecha_publicada[:4]}"
        filas.append(
            f"| {spec['tema']} | {boe_id} | {api_date} | {published_date} | "
            f"{api['vigencia_agotada']} | {api['estado_consolidacion']} | "
            f"{'sí' if api_coincide else 'NO'} | {'sí' if boe_coincide else 'NO'} |"
        )
        print(("OK  " if ok else "FAIL"), f"T{spec['tema']}", boe_id, "API", api["fecha_actualizacion"], "BOE", fecha_publicada)
    if "--md" in sys.argv:
        out = pathlib.Path(sys.argv[sys.argv.index("--md") + 1])
        hoy = dt.datetime.now().strftime("%d/%m/%Y %H:%M")
        out.write_text("# Vigencia y fechas del material por tema (BOE)\n\n"
                       f"Comprobado el {hoy} con python3 scripts/verificar_vigencia_boe.py --md {out}. "
                       "La marca API procede de /metadatos; la fecha publicada se obtiene de la página oficial act.php. "
                       "Ambas comprobaciones se comparan con sus campos separados en data/fuentes/<ID>/meta.json.\n\n"
                       "| Tema | Norma | Marca de actualización API | Última actualización publicada en BOE | Vigencia agotada | Consolidación | API coincide | BOE coincide |\n|---|---|---|---|---|---|---|---|\n"
                       + "\n".join(filas) + "\n"
                       + ("\n## Normas del DOE (sin API de vigencia: comprobación manual)\n\n"
                          "| Tema | Norma | Publicación | Comprobado | Qué se buscó |\n|---|---|---|---|---|\n"
                          + "\n".join(manuales) + "\n" if manuales else ""), encoding="utf-8")
    if errores:
        print("\n".join(errores))
        raise SystemExit(1)


if __name__ == "__main__":
    main()
