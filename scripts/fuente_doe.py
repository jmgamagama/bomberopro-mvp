#!/usr/bin/env python3
"""Extrae a data/fuentes/<id>/ el texto de una norma publicada en el DOE (o de un plan que el DOE publica por remisión).

El DOE no tiene API de texto consolidado ni de vigencia. Por eso el texto sale del PDF oficial y se deja escrito qué
se buscó para comprobar la vigencia y en qué fecha. El resultado tiene el mismo formato que scripts/fuente_boe.py
(meta.json, bloques.json y texto.md), para que scripts/generar_material_boe.py lo trate igual que una norma del BOE.

Uso:
  python3 scripts/fuente_doe.py scripts/fuentes_doe/DOE-2019040203.json [--pdf copia_local.pdf]
  python3 scripts/fuente_doe.py scripts/fuentes_doe/DOE-2019040203.json --titulos   # depuración: encabezados detectados

La configuración (scripts/fuentes_doe/<id>.json) fija:
  id, titulo, pdf (URL del texto), pdf_doe (URL del PDF del DOE), publicacion, version, comprobado, busqueda;
  "tramos": [{"paginas": [desde, hasta], "capitulo": "IV" (opcional, prefijo de los números que se repiten en
  cada capítulo), "secciones": ["IV.1", "IV.2", …] o ["Artículo 6", …], "fin": "V.6" (encabezado donde acaba el
  último precepto; si falta, acaba con la página)}].
Cada sección es un precepto, desde su encabezado literal hasta el encabezado siguiente. Se descartan las cabeceras y
los pies de página que se repiten. Las tablas y los gráficos no se copian: se sustituyen por un aviso que remite a su
página del PDF oficial.
"""
from __future__ import annotations

import difflib
import hashlib
import html
import json
import pathlib
import re
import statistics
import subprocess
import sys
import urllib.request
from collections import Counter
from datetime import date

VINETAS = set('\uf0b7\uf0d8\uf076\uf0a7\uf0fc\uf0e0') | {"•", "", "⇒", "▪", "➢", "", "o", "-", "–", "", "◦", "", "√", "✓", ">", "", "", "", "·"} - {""}


def descargar(url: str, destino: pathlib.Path) -> pathlib.Path:
    if not destino.exists():
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=600) as r, open(destino, "wb") as f:
            while chunk := r.read(1 << 20):
                f.write(chunk)
    return destino


def fragmentos(pdf: pathlib.Path, desde: int, hasta: int, margen: int = 0) -> dict[int, list[dict]]:
    xml = subprocess.run(["pdftohtml", "-xml", "-i", "-q", "-f", str(desde), "-l", str(hasta), "-stdout", str(pdf)],
                         capture_output=True, text=True, check=True).stdout
    paginas: dict[int, list[dict]] = {}
    tam = {f.group(1): int(f.group(2)) for f in re.finditer(r'<fontspec id="(\d+)" size="(-?\d+)"', xml)}
    for m in re.finditer(r'<page number="(\d+)"[^>]*height="(\d+)" width="(\d+)">(.*?)</page>', xml, re.S):
        n, alto, ancho = int(m.group(1)), int(m.group(2)), int(m.group(3))
        out, vistos = [], set()
        for t in re.finditer(r'<text top="(-?\d+)" left="(-?\d+)" width="(\d+)" height="(\d+)" font="(\d+)"[^>]*>(.*?)</text>', m.group(4), re.S):
            top, left, w, h, raw = int(t.group(1)), int(t.group(2)), int(t.group(3)), int(t.group(4)), t.group(6)
            h = tam.get(t.group(5), h)  # tamaño de letra (el alto de la caja varía con la fuente)
            txt = html.unescape(re.sub(r"<[^>]+>", "", raw))
            if not txt.strip() or left < margen or (top, left, txt) in vistos:  # el PDF repite el texto sombreado
                continue
            vistos.add((top, left, txt))
            out.append({"top": top, "left": left, "w": w, "h": h, "t": txt, "b": "<b>" in raw, "alto": alto, "ancho": ancho})
        paginas[n] = out
    return paginas


def lineas(frs: list[dict]) -> list[dict]:
    frs = sorted(frs, key=lambda f: (f["top"], f["left"]))
    out: list[list[dict]] = []
    for f in frs:
        if out and abs(out[-1][-1]["top"] - f["top"]) <= 6:
            out[-1].append(f)
        else:
            out.append([f])
    res = []
    pend = False
    for g in out:
        g.sort(key=lambda f: f["left"])
        huecos = [g[i + 1]["left"] - (g[i]["left"] + g[i]["w"]) for i in range(len(g) - 1)]
        vineta = g[0]["t"].strip() in VINETAS and g[0]["w"] < 22
        # «2.1.-», «a)», «1.» seguidos de un hueco: es una lista numerada, no una tabla.
        numerada = bool(re.fullmatch(r"\s*(\d+(\.\d+)*\.?-?|[a-zñ]\)|[IVX]+\.)\s*", g[0]["t"])) and g[0]["w"] < 70
        cols = [h for i, h in enumerate(huecos) if h > 25 and not ((vineta or numerada) and i == 0)]
        partes = g[1:] if vineta else g
        texto = re.sub(r"\s+", " ", "".join((" " if i and partes[i]["left"] - (partes[i - 1]["left"] + partes[i - 1]["w"]) > 1 else "") + f["t"]
                                             for i, f in enumerate(partes))).strip()
        while texto and texto[0] in VINETAS and texto[0] not in "o-–":
            texto, vineta = texto[1:].lstrip(), True
        if not texto:
            pend = pend or vineta
            continue
        if pend:
            vineta, pend = True, False
        res.append({"top": (g[1] if vineta and len(g) > 1 else g[0])["top"], "left": g[0]["left"] if not vineta else g[1]["left"] if len(g) > 1 else g[0]["left"],
                    "der": max(f["left"] + f["w"] for f in g), "h": max(f["h"] for f in g), "texto": texto,
                    "negrita": all(f["b"] for f in g if f["t"].strip()), "vineta": vineta, "columnas": len(cols) > 0,
                    "alto": g[0]["alto"]})
    return res


def clave(t: str) -> str:
    return re.sub(r"\d+", "#", t.strip().lower())


def norm(t: str) -> str:
    return re.sub(r"\s+", " ", t).strip()


def extraer(cfg: dict, pdf: pathlib.Path, depurar: bool = False) -> list[dict]:
    bloques: list[dict] = []
    # Cabeceras y pies: líneas del borde que se repiten (con los números normalizados) en muchas
    # páginas; se cuentan sobre todas las páginas extraídas, no por tramo (un tramo puede ser de 1 página).
    def borde(l: dict) -> bool:
        return l["top"] < 0.09 * l["alto"] or l["top"] > 0.91 * l["alto"]
    por_tramo = [{n: lineas(fr) for n, fr in fragmentos(pdf, *t["paginas"], cfg.get("margen_izquierdo", 0)).items()}
                 for t in cfg["tramos"]]
    unidas = {n: ls for pt in por_tramo for n, ls in pt.items()}
    cuenta = Counter(clave(l["texto"]) for ls in unidas.values() for l in {clave(x["texto"]): x for x in ls if borde(x)}.values())
    repetidas = {k for k, v in cuenta.items() if v >= max(3, 0.3 * len(unidas))}
    for tramo, pags in zip(cfg["tramos"], por_tramo):
        # Tablas: en cada página, la franja vertical que va de una línea con columnas a la siguiente (si están cerca).
        for ls in pags.values():
            cols = [l["top"] for l in ls if l["columnas"]]
            franjas: list[list[int]] = []
            for t in cols:
                if franjas and t - franjas[-1][1] <= 400:
                    franjas[-1][1] = t
                else:
                    franjas.append([t, t])
            for l in ls:
                l["tabla"] = any(a0 - 2 <= l["top"] <= b0 + 2 for a0, b0 in franjas)
        # Tablas grandes señaladas a mano tras mirar el PDF (página entera o desde una altura).
        for t in cfg.get("tablas", []):
            for l in pags.get(t["pagina"], []):
                if t.get("desde", 0) <= l["top"] <= t.get("hasta", 10**6):
                    l["tabla"] = True
        todas = [dict(l, pagina=n) for n, ls in sorted(pags.items()) for l in ls
                 if not (borde(l) and clave(l["texto"]) in repetidas) and l["left"] >= cfg.get("margen_izquierdo", 0)
                 and not re.fullmatch(r"\d{1,3}|\d+/\d+", l["texto"])]
        cuerpo_h = statistics.median([l["h"] for l in todas if len(l["texto"]) > 60] or [12])
        izq = Counter(l["left"] for l in todas if len(l["texto"]) > 60).most_common(1)[0][0]
        ancho = statistics.median([l["der"] - l["left"] for l in todas if len(l["texto"]) > 60 and l["left"] == izq])
        pasos = [y["top"] - x["top"] for x, y in zip(todas, todas[1:]) if x["pagina"] == y["pagina"] and 0 < y["top"] - x["top"] < 4 * cuerpo_h]
        interlinea = statistics.median(pasos or [cuerpo_h * 1.5])
        cap = tramo.get("capitulo")
        capitulo = cfg.get("capitulo")  # regex con un grupo: el número del capítulo
        ultimo_cap: dict | None = None

        def es_titulo(l: dict) -> bool:
            return (l["h"] >= cuerpo_h * cfg.get("titulo_mayor", 1.1) or l["negrita"]) and not l["vineta"] and not l["columnas"]

        def numero_de(l: dict) -> str | None:
            for s in tramo["secciones"] + ([tramo["fin"]] if tramo.get("fin") else []):
                if re.match(re.escape(s) + r"(?:\.-|\.|-)?(?:\s|$|(?=[^\d.\s]))", l["texto"]) and (l["h"] >= cuerpo_h * cfg.get("titulo_mayor", 1.1) or l["negrita"]) and not l["vineta"]:
                    return s
            return None

        if depurar:
            for l in todas:
                if es_titulo(l):
                    print(f"p{l['pagina']:>3} h{l['h']:>2} {'N' if l['negrita'] else ' '} {l['texto'][:110]}")
            continue

        pendientes = list(tramo["secciones"])
        actual: dict | None = None
        tabla_en: int | None = None
        prev: dict | None = None
        titulo_abierto: dict | None = None
        for l in todas:
            n = numero_de(l)
            if n and (pendientes and n == pendientes[0] or n == tramo.get("fin")):
                if n == tramo.get("fin"):
                    actual = None
                    break
                pendientes.pop(0)
                num = f"{cap}.{n}" if cap else n
                pid = ("a" + re.sub(r"\D", "", n)) if n.lower().startswith("artículo") else "s-" + num.lower().replace(".", "-")
                actual = {"id": pid, "tipo": "precepto", "numero": num, "titulo": l["texto"], "pagina": l["pagina"],
                          "url": f"{cfg['pdf']}#page={l['pagina']}", "parrafos": [{"clase": "articulo", "texto": l["texto"]}]}
                bloques.append(actual)
                tabla_en, prev = None, l
                titulo_abierto = l
                continue
            # Encabezado partido en dos líneas («3.2.-» / «CENTRO DE…», o un título largo que sigue debajo).
            if (titulo_abierto is not None and es_titulo(l) and l["pagina"] == titulo_abierto["pagina"]
                    and l["top"] - titulo_abierto["top"] <= 2.6 * interlinea and len(actual["parrafos"]) == 1
                    and (len(titulo_abierto["texto"]) <= 8 or titulo_abierto["der"] >= titulo_abierto["left"] + 0.8 * ancho)):
                actual["titulo"] = actual["parrafos"][0]["texto"] = f"{actual['titulo']} {l['texto']}"
                titulo_abierto, prev = l, l
                continue
            titulo_abierto = None
            # Capítulos: encabezado propio (sin texto), con su título en la línea siguiente si va aparte.
            if capitulo and re.match(capitulo, l["texto"]) or (ultimo_cap and prev is ultimo_cap["_linea"] and es_titulo(l)
                                                                                and not l["vineta"] and l["pagina"] == prev["pagina"]):
                if ultimo_cap and prev is ultimo_cap["_linea"] and not re.match(capitulo, l["texto"]):
                    ultimo_cap["parrafos"].append({"clase": "capitulo_tit", "texto": l["texto"]})
                    ultimo_cap["titulo"] += " · " + l["texto"]
                    ultimo_cap["_linea"] = None
                    prev = l
                    continue
                num = re.match(capitulo, l["texto"]).group(1)
                ultimo_cap = {"id": f"cap-{num.lower()}", "tipo": "encabezado", "titulo": l["texto"], "pagina": l["pagina"],
                              "parrafos": [{"clase": "capitulo_num", "texto": l["texto"]}], "_linea": l}
                bloques.append(ultimo_cap)
                actual, prev = None, l
                continue
            if actual is None:
                prev = l
                continue
            ps = actual["parrafos"]
            corta = (l["der"] - l["left"]) < 0.6 * ancho
            # Rótulos de gráficos (organigramas…): letra más pequeña que el texto, si la letra pequeña no son notas.
            fuera = not cfg.get("notas") and l["h"] < cuerpo_h * cfg.get("rotulo_menor", 0.7) and not l["vineta"]
            if l["tabla"] or (fuera and corta):
                if ps[-1]["clase"] == "tabla":
                    ps[-1]["hasta"] = l["pagina"]
                else:
                    ps.append({"clase": "tabla", "texto": "", "pagina": l["pagina"], "hasta": l["pagina"], "url": f"{cfg['pdf']}#page={l['pagina']}"})
                tabla_en, prev = l["pagina"], l
                continue
            tabla_en = None
            if cfg.get("notas") and l["h"] <= cuerpo_h * 0.75:
                clase = "nota"
            elif es_titulo(l) and corta:
                clase = "centro_negrita"
            else:
                clase = "parrafo"
            seguir = (prev is not None and ps and ps[-1]["clase"] == clase and clase != "centro_negrita" and not l["vineta"]
                      and prev["pagina"] in (l["pagina"], l["pagina"] - 1)
                      and (l["pagina"] != prev["pagina"] or l["top"] - prev["top"] <= interlinea * 1.12)
                      and not re.match(r"^([a-zñ]\)|\d+\.\s|[a-z]\.\s)", l["texto"])
                      and not (prev["texto"].endswith((".", ":")) and (prev["der"] - prev["left"]) < 0.85 * ancho))
            if seguir:
                t = ps[-1]["texto"]
                ps[-1]["texto"] = (t[:-1] + l["texto"]) if re.search(r"[a-záéíóúñ]-$", t) and l["texto"][:1].islower() else f"{t} {l['texto']}"
            else:
                texto = re.sub(r"^\.\s+", "", l["texto"]) if clase == "nota" else l["texto"]
                ps.append({"clase": clase, "texto": ("• " if l["vineta"] else "") + texto, "pagina": l["pagina"]})
            prev = l
        # Un capítulo sin ningún precepto del tramo detrás (fuera del recorte) no se queda.
        while bloques and bloques[-1]["tipo"] == "encabezado":
            bloques.pop()
        bloques[:] = [b for i, b in enumerate(bloques) if b["tipo"] != "encabezado" or bloques[i + 1]["tipo"] != "encabezado"]
        if pendientes and not depurar:
            sys.exit(f"Secciones no encontradas en {cfg['id']}: {pendientes}")
    return bloques


def literal(t: str) -> str:
    return re.sub(r"[^0-9a-záéíóúüñ]+", "", t.lower())


def en_orden(t: str, texto: str) -> bool:
    """t está en texto, letra a letra y en orden; el PDF solo puede intercalar trozos cortos (número de página, pie)."""
    pos = texto.find(t[:20])
    while pos >= 0:
        ventana = texto[pos:pos + len(t) + 240]
        m = difflib.SequenceMatcher(None, t, ventana, autojunk=False)
        bloques = [b for b in m.get_matching_blocks() if b.size]
        if sum(b.size for b in bloques) == len(t) and bloques[-1].b + bloques[-1].size - bloques[0].b - len(t) <= 220:
            return True
        pos = texto.find(t[:20], pos + 1)
    return False


def comprobar(bloques: list[dict], pdf: pathlib.Path) -> dict:
    """Cada párrafo copiado tiene que estar, letra a letra (sin espacios ni signos), en el texto del PDF (pdftotext)."""
    cache: dict[tuple[int, str], str] = {}

    def pagina(n: int, modo: str = "") -> str:
        if (n, modo) not in cache:
            cache[(n, modo)] = literal(subprocess.run(["pdftotext", *([modo] if modo else []), "-f", str(n), "-l", str(n), str(pdf), "-"],
                                                      capture_output=True, text=True).stdout)
        return cache[(n, modo)]
    total, fallan = 0, []
    for b in bloques:
        for p in b["parrafos"]:
            if p["clase"] == "tabla":
                continue
            total += 1
            t = literal(p["texto"])
            n0 = p.get("pagina", b["pagina"])
            texto = "".join(pagina(n) for n in range(n0, n0 + 2))
            # pdftotext ordena a veces mal las líneas justificadas; entonces se mira el orden del propio PDF (-raw).
            if not en_orden(t, texto) and not en_orden(t, "".join(pagina(n, "-raw") for n in range(n0, n0 + 2))):
                fallan.append(f"{b['id']}: {p['texto'][:80]}")
    return {"parrafos": total, "no_literales": fallan}


def paginas(p: dict) -> str:
    return f"la pág. {p['pagina']}" if p["hasta"] == p["pagina"] else f"las págs. {p['pagina']}–{p['hasta']}"


def main() -> None:
    cfg_path = pathlib.Path(sys.argv[1])
    cfg = json.loads(cfg_path.read_text(encoding="utf-8"))
    pdf = pathlib.Path(sys.argv[sys.argv.index("--pdf") + 1]) if "--pdf" in sys.argv else descargar(cfg["pdf"], pathlib.Path("/tmp") / f"{cfg['id']}.pdf")
    if "--titulos" in sys.argv:
        extraer(cfg, pdf, depurar=True)
        return
    sha = hashlib.sha256(pdf.read_bytes()).hexdigest()
    if cfg.get("sha256_pdf") and cfg["sha256_pdf"] != sha:
        print(f"AVISO: el PDF ha cambiado (sha256 {sha}, esperado {cfg['sha256_pdf']}): revisa el texto y la vigencia.")
    bloques = extraer(cfg, pdf)
    comp = comprobar(bloques, pdf)
    print(f"Comprobación literal: {comp['parrafos'] - len(comp['no_literales'])}/{comp['parrafos']} párrafos están tal cual en el PDF")
    for f in comp["no_literales"][:20]:
        print("  NO LITERAL", f)
    if comp["no_literales"]:
        sys.exit("Hay párrafos que no están tal cual en el PDF: revisa la extracción.")
    out = pathlib.Path("data/fuentes") / cfg["id"]
    out.mkdir(parents=True, exist_ok=True)
    meta = {k: cfg[k] for k in ("id", "titulo", "pdf", "pdf_doe", "publicacion", "version", "comprobado", "busqueda") if k in cfg}
    meta |= {"identificador": cfg["id"], "origen": "doe", "url": cfg["pdf"], "sha256_pdf": sha, "n_bloques": len(bloques),
             "extraido": date.today().isoformat()}
    (out / "meta.json").write_text(json.dumps(meta, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    for b in bloques:
        b.pop("_linea", None)
    (out / "bloques.json").write_text(json.dumps(bloques, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    md = [f"# {cfg['titulo']}", "", f"Texto extraído del PDF oficial: {cfg['pdf']}", f"Publicación: {cfg['publicacion']}. PDF del DOE: {cfg['pdf_doe']}",
          f"Versión: {cfg['version']}. Sin API de vigencia; comprobado el {cfg['comprobado']}: {cfg['busqueda']}",
          "Extracto limitado al epígrafe del temario. Las tablas y los gráficos no se copian: se remite a su página del PDF.", ""]
    for b in bloques:
        md += [f"## {b['titulo']}", "", f"(pág. {b['pagina']} del PDF)", ""]
        for p in b["parrafos"][1:]:
            md += [f"[Tabla o gráfico: ver {paginas(p)} del PDF]" if p["clase"] == "tabla" else p["texto"], ""]
    (out / "texto.md").write_text("\n".join(md).rstrip() + "\n", encoding="utf-8")
    print(f"{out}: {len(bloques)} preceptos, sha256 {sha[:12]}…")


if __name__ == "__main__":
    main()
