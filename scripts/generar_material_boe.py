#!/usr/bin/env python3
"""Genera el material de un tema a partir del texto consolidado del BOE descargado en data/fuentes/<BOE-A-…>/.

Solo copia texto literal del BOE (rúbricas, encabezados y párrafos) y enlaza cada precepto con su ancla
en boe.es. No redacta nada: no genera la capa «desarrollo» (esa la escribe una persona).

Uso:
  python3 scripts/fuente_boe.py BOE-A-1995-24292            # antes: texto vigente
  python3 scripts/generar_material_boe.py scripts/material/tema06.json

La especificación (scripts/material/temaNN.json) fija la norma y los bloques del epígrafe del anexo I
(BOP de Badajoz n.º 135, 17/07/2026). Cada bloque es un tramo de ids de data/fuentes/<id>/bloques.json,
en orden del documento y ambos incluidos:
  {"boe": "BOE-A-…", "carpeta": "tema06", "prefijo": "lprl", "epigrafe": "…",
   "bloques": [{"titulo": "…", "desde": "ci", "hasta": "a4"}, …]}
Varias normas por tema (01/11/2026): un bloque puede llevar su propio "boe" (si no, el de la especificación) y,
en vez de "desde"/"hasta", una lista "ids" de bloques sueltos del BOE (p. ej. arts. 4, 8 y 15 del REBT). Cada bloque
del índice guarda su "boe"; el índice lista además todas las normas en "normas". El texto oficial completo que se
copia es el de la norma principal ("boe" de la especificación).
Opcional en un bloque: "apartados": ["2. ", "3. "] para quedarse solo con esos apartados de una sección, y
"subtitulo": clase de párrafo que abre cada apartado (por defecto «centro_redonda»; el anexo II del
RD 1215/1997 usa «centro_cursiva»).

Normas del DOE (01/11/2026): si data/fuentes/<id>/meta.json trae "origen": "doe" (la genera
scripts/fuente_doe.py a partir del PDF oficial), el campo "boe" de la especificación y de cada bloque es un
identificador genérico de norma («DOE-2019040203»). Cambia solo la cabecera (PDF de origen, publicación en el
DOE, fecha de la comprobación y lo que se buscó, porque el DOE no tiene API de vigencia) y los enlaces, que van
a la página del PDF oficial (url de cada precepto). Lo demás es la misma lógica.

Salida en public/material/<carpeta>/:
  <prefijo>-NN-1-esquema.md   por bloque: rúbricas literales con enlace a cada precepto en el BOE
  <prefijo>-NN-3-completo.md  por bloque: texto literal con su enlace (las tablas se remiten al BOE)
  <prefijo>-indice.json       bloques y preceptos generados (lo comprueban los tests)
  <prefijo>-texto-oficial.md  copia de data/fuentes/<id>/texto.md (texto consolidado completo)
"""
from __future__ import annotations

import datetime as dt
import json
import re
import pathlib
import shutil
import sys

TEXTO = {"parrafo", "parrafo_2", "parrafo_3", "sangrado", "sangrado_2", "sangrado_articulo", "cita", "cita_con_pleca", ""}
SUBTITULO = {"seccion", "centro_negrita", "centro_cursiva", "centro", "capitulo_num", "capitulo_tit",
             "titulo_num", "titulo_tit", "anexo_num", "anexo_tit", "anexo", "subseccion"}
TABLA = {"tabla", "tabla_ancha", "tabla_derecha"}


def rubrica(b: dict) -> str:
    art = next((p["texto"] for p in b["parrafos"] if p["clase"] == "articulo"), None)
    if art:
        return art.rstrip(".")
    cab = [p["texto"].rstrip(".") for p in b["parrafos"]
           if p["clase"] in ("capitulo_num", "capitulo_tit", "titulo_num", "titulo_tit", "anexo_num", "anexo_tit", "seccion", "anexo")]
    return " · ".join(cab[:2]) or (b.get("titulo") or b["id"])


def cuerpo(b: dict, url: str, doe: bool = False) -> list[str]:
    out: list[str] = []
    cab_hechos = 0
    for p in b["parrafos"]:
        c, t = p["clase"], p["texto"].strip()
        if (not t and not (doe and c in TABLA)) or c == "articulo":
            continue
        # Apartado numerado centrado («2. Sistemas de…») = subtítulo; el resto de centrados es texto.
        if c in SUBTITULO or (c.startswith("centro_redonda") and re.match(r"^\d+\.\s", t)):
            if b["tipo"] == "encabezado" and cab_hechos < 2 and c in ("capitulo_num", "capitulo_tit", "titulo_num", "titulo_tit", "anexo_num", "anexo_tit", "anexo", "seccion"):
                cab_hechos += 1  # ya va en la rúbrica
                continue
            out += [f"**{t}**", ""]
        elif c in TABLA and doe:
            pag = f"{url.split('#')[0]}#page={p['pagina']}" if p.get("pagina") else url
            # Sin cursiva: el renderizador no anida un enlace dentro de «_…_» (y las URL de la Junta llevan «_»).
            out += [f"Tabla o figura: consúltala en el [PDF oficial, pág. {p.get('pagina', '')}]({pag}).", ""]
        elif c in TABLA:
            out += [f"_Tabla: consúltala en el [texto oficial del BOE]({url})._", ""]
        elif c == "nota" and doe:
            out += [f"> _{t}_" if "_" not in t else f"> {t}", ""]
        else:
            out += [f"> {t}", ""]
    return out


def recortar(b: dict, apartados: list[str], subtitulo: str = "centro_redonda") -> dict:
    """Deja de un bloque largo (p. ej. una sección de anexo) solo los apartados pedidos por el epígrafe.

    Un apartado empieza en un subtítulo centrado cuyo texto empieza por uno de los prefijos dados
    («2. », «3. »…) y termina en el siguiente subtítulo centrado. Se conserva la cabecera del bloque.
    """
    if b["tipo"] != "encabezado":
        return b
    ps, dentro, out = b["parrafos"], False, []
    for p in ps:
        if p["clase"] in ("seccion", "anexo_num", "anexo_tit") and not out:
            out.append(p)
            continue
        if p["clase"].startswith(subtitulo):
            dentro = any(p["texto"].startswith(a) for a in apartados)
        if dentro:
            out.append(p)
    return {**b, "parrafos": out}


def main() -> None:
    spec = json.loads(pathlib.Path(sys.argv[1]).read_text(encoding="utf-8"))
    boe_id = spec["boe"]
    fuente = pathlib.Path("data/fuentes") / boe_id
    normas: dict[str, dict] = {}

    def norma(nid: str) -> dict:
        if nid not in normas:
            d = pathlib.Path("data/fuentes") / nid
            meta = json.loads((d / "meta.json").read_text(encoding="utf-8"))
            bl = json.loads((d / "bloques.json").read_text(encoding="utf-8"))
            doe = meta.get("origen") == "doe"
            if doe:
                fecha = meta["comprobado"]
                cab = (f"Texto extraído del PDF oficial: [{meta['titulo'].rstrip('.')}]({meta['pdf']}) ({meta['version']}). "
                       f"{meta['publicacion']}: [PDF del DOE]({meta['pdf_doe']}). El DOE no tiene API de vigencia: comprobado a mano el {fecha}. "
                       f"Qué se buscó: {meta['busqueda']} Texto con carácter informativo; la versión con valor jurídico es la publicada en el DOE.")
            else:
                fecha_iso = meta.get("fecha_actualizacion_publicada")
                if not fecha_iso:
                    raise SystemExit(f"{nid}: falta fecha_actualizacion_publicada; vuelve a descargar la fuente con scripts/fuente_boe.py")
                fecha = dt.date.fromisoformat(fecha_iso).strftime("%d/%m/%Y")
                cab = (f"Texto consolidado del BOE ({nid}, última actualización publicada el {fecha}). "
                       f"Fuente oficial: [{meta['titulo'].rstrip('.')}]({meta['url']}). Texto con carácter informativo; "
                       "la versión con valor jurídico es la publicada en el BOE.")
            normas[nid] = {"bloques": bl, "ids": [b["id"] for b in bl], "fecha": fecha, "url": meta["url"], "cab": cab, "doe": doe}
        return normas[nid]

    fecha = norma(boe_id)["fecha"]

    out = pathlib.Path("public/material") / spec["carpeta"]
    if out.exists():
        shutil.rmtree(out)
    out.mkdir(parents=True)
    indice = []
    for n, bl in enumerate(spec["bloques"], start=1):
        bid = bl.get("boe", boe_id)
        nm = norma(bid)
        bloques, ids, url, cab, doe = nm["bloques"], nm["ids"], nm["url"], nm["cab"], nm["doe"]
        donde = "el PDF oficial" if doe else "el BOE"
        if bl.get("ids"):
            tramo = [bloques[ids.index(i)] for i in bl["ids"]]
        else:
            tramo = bloques[ids.index(bl["desde"]): ids.index(bl["hasta"]) + 1]
        if bl.get("apartados"):
            tramo = [recortar(b, bl["apartados"], bl.get("subtitulo", "centro_redonda")) for b in tramo]
        # Encabezados sin texto propio (títulos, capítulos, secciones) son subtítulos; lo demás, preceptos.
        preceptos = [b for b in tramo if b["tipo"] == "precepto" or any(p["clase"] in TEXTO | TABLA for p in b["parrafos"])]
        slug = f"{spec['prefijo']}-{n:02d}"
        esq = [f"# {bl['titulo']} · Esquema", "", cab, "",
               f"{len(preceptos)} {'precepto' if len(preceptos) == 1 else 'preceptos'}. Cada rúbrica (literal) enlaza con {donde}.", ""]
        com = [f"# {bl['titulo']} · Texto oficial", "", cab, ""]
        for b in tramo:
            if b not in preceptos:
                esq += [f"**{rubrica(b)}**", ""]
                com += [f"## {rubrica(b)}", ""]
                continue
            enlace = b["url"] if doe else f"{url}#{b['id']}"
            esq.append(f"- [{rubrica(b)}]({enlace})")
            if b["tipo"] == "encabezado":  # anexo: sus apartados (subtítulos literales) como subnivel
                subs = [t for t in cuerpo(b, url, doe) if t.startswith("**") and not t.strip("*").startswith(("Figura", "Tabla", "Gráfico", "Fórmula"))]
                esq += [f"  - {t.strip('*')}" for t in subs]
            com += [f"### {rubrica(b)}", "", f"[Ver en {'el PDF oficial' if doe else 'el BOE'}]({enlace})", ""]
            com += cuerpo(b, enlace if doe else url, doe)
        # Listas separadas por subtítulos: una línea en blanco al final de cada lista.
        esq_txt = "\n".join(esq).replace("\n**", "\n\n**").replace("\n\n\n", "\n\n")
        (out / f"{slug}-1-esquema.md").write_text(esq_txt.rstrip() + "\n", encoding="utf-8")
        (out / f"{slug}-3-completo.md").write_text("\n".join(com).rstrip() + "\n", encoding="utf-8")
        indice.append({"id": slug, "titulo": bl["titulo"], "boe": bid, "preceptos": [b["id"] for b in preceptos]})
    (out / f"{spec['prefijo']}-indice.json").write_text(
        json.dumps({"boe": boe_id, "version": fecha, "epigrafe": spec.get("epigrafe", ""),
                    "normas": [{"boe": k, "version": v["fecha"]} for k, v in normas.items()], "bloques": indice},
                   ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    shutil.copyfile(fuente / "texto.md", out / f"{spec['prefijo']}-texto-oficial.md")


if __name__ == "__main__":
    main()
