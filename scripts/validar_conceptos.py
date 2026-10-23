#!/usr/bin/env python3
"""Valida un fichero de conceptos (data/constitucion/*.json) contra el texto oficial del BOE.

Uso:  python3 scripts/validar_conceptos.py data/constitucion/titulo-preliminar.json [--desde a1 --hasta a9]

Errores (bloquean):
  - la cita no aparece literal en el artículo del BOE que dice citar
  - algún apartado del rango no tiene ningún concepto
  - un concepto no tiene exactamente una pregunta de cada nivel (1, 2, 3)
  - nivel 1 sin 2 opciones; niveles 2 y 3 sin 3 opciones (el examen tiene 3)
  - opciones repetidas, índice de correcta fuera de rango, explicación vacía
  - la opción correcta aparece literal dentro del enunciado
  - id repetido o confundible_con que apunta a un id inexistente
Avisos (no bloquean, se revisan a mano):
  - la opción correcta es la más larga (pista para el alumno)
Salida: resumen legible + código 1 si hay errores.
"""
from __future__ import annotations

import json
import pathlib
import re
import sys
import unicodedata

FUENTE = pathlib.Path("data/fuentes/BOE-A-1978-31229/bloques.json")


def norm(s: str) -> str:
    s = unicodedata.normalize("NFC", s)
    s = s.replace("«", '"').replace("»", '"').replace("“", '"').replace("”", '"')
    return " ".join(s.split()).strip()


def low(s: str) -> str:
    s = unicodedata.normalize("NFD", norm(s).lower())
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return re.sub(r"[^\w ]+", "", s).strip()


def apartados(bloque: dict) -> dict[str, str]:
    """{'1': texto, '2': texto} o {'': texto} si el artículo no tiene apartados numerados."""
    body = [p["texto"] for p in bloque["parrafos"] if p["clase"] in ("parrafo", "parrafo_2")]
    out: dict[str, str] = {}
    cur = None
    for t in body:
        m = re.match(r"^(\d+)\.\s+(.*)$", t)
        if m:
            cur = m.group(1)
            out[cur] = m.group(2)
        elif cur is not None:
            out[cur] += " " + t  # letras a), b)… u otros párrafos del mismo apartado
        else:
            out[""] = (out.get("", "") + " " + t).strip()
    return out


def main() -> int:
    args = sys.argv[1:]
    path = pathlib.Path(args[0])
    desde = args[args.index("--desde") + 1] if "--desde" in args else None
    hasta = args[args.index("--hasta") + 1] if "--hasta" in args else None

    data = json.loads(path.read_text(encoding="utf-8"))
    # La fuente es la norma del propio fichero (por defecto, la Constitución).
    fuente = pathlib.Path(f"data/fuentes/{data['norma']}/bloques.json") if data.get("norma") else FUENTE
    boe = {b["id"]: b for b in json.loads(fuente.read_text(encoding="utf-8"))}
    conceptos = data["conceptos"]
    errores: list[str] = []
    avisos: list[str] = []

    ids = [c["id"] for c in conceptos]
    for i in {x for x in ids if ids.count(x) > 1}:
        errores.append(f"id repetido: {i}")
    idset = set(ids)

    cubiertos: set[tuple[str, str]] = set()
    n_preg = 0
    for c in conceptos:
        cid = c["id"]
        b = boe.get(c["bloque"])
        if not b:
            errores.append(f"{cid}: bloque {c['bloque']} no existe en el BOE")
            continue
        aps = apartados(b)
        ap = c.get("apartado", "")
        if ap not in aps:
            errores.append(f"{cid}: el art. {c['bloque']} no tiene apartado '{ap}' (tiene {list(aps)})")
            continue
        cubiertos.add((c["bloque"], ap))
        if norm(c["cita"]) not in norm(aps[ap]):
            errores.append(f"{cid}: la cita no es literal del art. {c['bloque'][1:]}.{ap}")
        t = c["tarjeta"]
        if low(t["respuesta"]) and low(t["respuesta"]) in low(t["pregunta"]):
            errores.append(f"{cid}: la respuesta de la tarjeta está dentro de su pregunta")
        for r in c.get("confundible_con", []):
            if r not in idset and not r.startswith(("CE-", "LPRL-")):
                errores.append(f"{cid}: confundible_con '{r}' no existe")
            elif r not in idset:
                avisos.append(f"{cid}: confundible_con '{r}' es de otro fichero (comprobar al cargar)")

        niveles = sorted(q["nivel"] for q in c["preguntas"])
        if niveles != [1, 2, 3]:
            errores.append(f"{cid}: niveles {niveles}, se esperaba [1, 2, 3]")
        for q in c["preguntas"]:
            n_preg += 1
            tag = f"{cid} N{q['nivel']}"
            ops = q["opciones"]
            want = 2 if q["nivel"] == 1 else 3
            if len(ops) != want:
                errores.append(f"{tag}: {len(ops)} opciones, se esperaban {want}")
            if len({low(o) for o in ops}) != len(ops):
                errores.append(f"{tag}: opciones repetidas")
            if not (0 <= q["correcta"] < len(ops)):
                errores.append(f"{tag}: índice de correcta fuera de rango")
                continue
            ok = ops[q["correcta"]]
            if len(low(ok)) > 12 and low(ok) in low(q["enunciado"]):
                errores.append(f"{tag}: la opción correcta aparece dentro del enunciado")
            if not q.get("explicacion", "").strip():
                errores.append(f"{tag}: explicación vacía")
            if len(ops) == 3:
                lens = [len(o) for o in ops]
                if lens[q["correcta"]] == max(lens) and lens.count(max(lens)) == 1 and max(lens) > 1.25 * sorted(lens)[-2]:
                    avisos.append(f"{tag}: la correcta es claramente la más larga")

    # Cobertura: todos los apartados del rango deben tener al menos un concepto.
    orden = list(boe)
    rango = [k for k in orden if re.fullmatch(r"a\d+", k)]
    if desde and hasta:
        rango = rango[rango.index(desde): rango.index(hasta) + 1]
    else:
        usados = {c["bloque"] for c in conceptos}
        rango = [k for k in rango if k in usados]
    def vigente(texto: str) -> bool:  # «4. (Suprimido).» o «(Derogado)» no se pueden examinar
        return not re.fullmatch(r"\(?(suprimido|derogado|sin contenido)\)?\.?", low(texto) or "", re.I) and low(texto) not in ("suprimido", "derogado")
    sin = [f"{k[1:]}.{ap}" if ap else k[1:] for k in rango for ap, tx in apartados(boe[k]).items() if (k, ap) not in cubiertos and vigente(tx)]
    if sin:
        errores.append(f"apartados sin concepto: {', '.join(sin)}")

    print(f"{path}: {len(conceptos)} conceptos, {n_preg} preguntas, {len(cubiertos)} apartados cubiertos")
    for a in avisos:
        print("  AVISO", a)
    for e in errores:
        print("  ERROR", e)
    print("OK" if not errores else f"{len(errores)} errores")
    return 1 if errores else 0


if __name__ == "__main__":
    sys.exit(main())
