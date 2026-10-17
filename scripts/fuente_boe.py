#!/usr/bin/env python3
"""Descarga el texto consolidado vigente de una norma del BOE y lo guarda versionado.

Uso:  python3 scripts/fuente_boe.py BOE-A-1978-31229

Fuente: API de datos abiertos del BOE (legislación consolidada).
  https://www.boe.es/datosabiertos/api/legislacion-consolidada/id/<ID>/metadatos
  https://www.boe.es/datosabiertos/api/legislacion-consolidada/id/<ID>/texto

Escribe en data/fuentes/<ID>/:
  texto.xml        respuesta original del BOE (sin tocar), para auditoría
  bloques.json     cada bloque (encabezado o artículo) con su versión VIGENTE
  texto.md         texto legible para descargar (es texto oficial, de libre uso)
  meta.json        id, url, fecha de última actualización del BOE, fecha de descarga, sha256

Por qué así: el contenido de BomberoPro se ancla a este fichero, no a copias sueltas.
Si el BOE publica una actualización, cambia el sha256 y el workflow abre un PR.
Sin dependencias externas: solo biblioteca estándar.
"""
from __future__ import annotations

import datetime as dt
import hashlib
import json
import pathlib
import sys
import urllib.request
import xml.etree.ElementTree as ET

API = "https://www.boe.es/datosabiertos/api/legislacion-consolidada/id/{id}/{part}"


def get(norma: str, part: str) -> bytes:
    req = urllib.request.Request(API.format(id=norma, part=part), headers={
        "Accept": "application/xml",
        "User-Agent": "BomberoPro-fuentes/1.0 (+https://bomberopro.com)",
    })
    with urllib.request.urlopen(req, timeout=60) as r:
        if r.status != 200:
            raise SystemExit(f"BOE devolvió HTTP {r.status} para {part}")
        return r.read()


def text_of(el: ET.Element) -> str:
    return " ".join("".join(el.itertext()).split())


def check_status(root: ET.Element, part: str) -> None:
    code = root.findtext("./status/code")
    if code is not None and code.strip() != "200":
        raise SystemExit(f"BOE status {code} en {part}: {root.findtext('./status/text')}")


def pick_version(bloque: ET.Element) -> ET.Element | None:
    """La versión vigente es la de fecha de vigencia más reciente (AAAAMMDD)."""
    versions = bloque.findall("version")
    if not versions:
        return None
    return max(versions, key=lambda v: (v.get("fecha_vigencia") or "", v.get("fecha_publicacion") or ""))


def main() -> None:
    norma = sys.argv[1] if len(sys.argv) > 1 else "BOE-A-1978-31229"
    out = pathlib.Path("data/fuentes") / norma
    out.mkdir(parents=True, exist_ok=True)

    meta_xml = get(norma, "metadatos")
    meta_root = ET.fromstring(meta_xml)
    check_status(meta_root, "metadatos")
    m = meta_root.find("./data/metadatos")
    if m is None:
        m = meta_root.find(".//metadatos")
    if m is None:
        raise SystemExit("Respuesta de metadatos sin <metadatos>: revisar formato de la API")
    fecha_act = (m.findtext("fecha_actualizacion") or "").strip()
    titulo = (m.findtext("titulo") or "").strip()

    raw = get(norma, "texto")
    root = ET.fromstring(raw)
    check_status(root, "texto")
    texto = root.find("./data/texto")
    if texto is None:
        texto = root.find(".//texto")
    if texto is None:
        raise SystemExit("Respuesta de texto sin <texto>: revisar formato de la API")

    bloques = []
    for b in texto.findall("bloque"):
        v = pick_version(b)
        if v is None:
            continue
        parrafos = [{"clase": p.get("class") or "", "texto": text_of(p)} for p in v if text_of(p)]
        bloques.append({
            "id": b.get("id"),
            "tipo": b.get("tipo"),
            "titulo": b.get("titulo"),
            "version": {
                "id_norma": v.get("id_norma"),
                "fecha_publicacion": v.get("fecha_publicacion"),
                "fecha_vigencia": v.get("fecha_vigencia"),
            },
            "n_versiones": len(b.findall("version")),
            "parrafos": parrafos,
        })
    if not bloques:
        raise SystemExit("No se ha extraído ningún bloque: revisar formato de la API")

    # Comprobación mínima de integridad para la Constitución: arts. 1 a 169 presentes.
    if norma == "BOE-A-1978-31229":
        ids = {b["id"] for b in bloques}
        faltan = [n for n in range(1, 170) if f"a{n}" not in ids]
        if faltan:
            raise SystemExit(f"Faltan artículos en la respuesta del BOE: {faltan[:20]}")

    (out / "texto.xml").write_bytes(raw)
    (out / "bloques.json").write_text(json.dumps(bloques, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")

    fecha_txt = f"{fecha_act[6:8]}/{fecha_act[4:6]}/{fecha_act[0:4]}" if len(fecha_act) >= 8 else "desconocida"
    md = [f"# {titulo.rstrip('.') or norma}", "",
          f"Texto consolidado del BOE ({norma}). Última actualización publicada por el BOE: {fecha_txt}.",
          f"Fuente: https://www.boe.es/buscar/act.php?id={norma}",
          "Texto con carácter informativo; la versión con valor jurídico es la publicada en el BOE.", ""]
    for b in bloques:
        for p in b["parrafos"]:
            c = p["clase"]
            if c.startswith("titulo") or c in ("capitulo_num", "seccion"):
                md += ["", f"## {p['texto']}", ""]
            elif c in ("capitulo_tit", "titulo_tit", "seccion_tit") or c.startswith("capitulo"):
                md += [f"**{p['texto']}**", ""]
            elif c == "articulo":
                md += ["", f"### {p['texto']}", ""]
            elif c == "":
                md += [f"_Nota del BOE: {p['texto']}_", ""]
            else:
                md += [p["texto"], ""]
    (out / "texto.md").write_text("\n".join(md).rstrip() + "\n", encoding="utf-8")

    meta = {
        "id": norma,
        "titulo": titulo,
        "url": f"https://www.boe.es/buscar/act.php?id={norma}",
        "fecha_actualizacion_boe": fecha_act,
        "descargado": dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds"),
        "sha256_texto_xml": hashlib.sha256(raw).hexdigest(),
        "n_bloques": len(bloques),
    }
    (out / "meta.json").write_text(json.dumps(meta, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(json.dumps(meta, ensure_ascii=False))


if __name__ == "__main__":
    main()
