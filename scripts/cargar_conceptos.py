#!/usr/bin/env python3
"""Genera el SQL que carga un fichero de conceptos (data/constitucion/*.json) en Supabase.

Uso:
  python3 scripts/cargar_conceptos.py data/constitucion/titulo-preliminar.json \
      --estado borrador|publicado [--crear-tema] > carga.sql

  --estado publicado   conceptos 'publicado' y preguntas 'publicada' (staging, o producción tras revisión)
  --estado borrador    conceptos 'borrador' y preguntas 'borrador' (producción antes de la revisión de JM)
  --crear-tema         crea el tema 1 de la convocatoria 1 si no existe (solo staging: sus datos de prueba
                       no tienen el tema 1)

Reglas:
  * Antes de generar nada ejecuta el validador contra el texto del BOE; si falla, no genera SQL.
  * Idempotente: concepto por id; pregunta por hash_dedupe = 'CE:<concepto>:N<nivel>'. Volver a cargar
    actualiza el texto sin duplicar ni cambiar el id de la pregunta (los intentos ya hechos siguen ligados).
  * El tema se resuelve por (convocatoria_id = 1, numero = tema), nunca por id fijo.
  * La letra de la correcta se asigna con un barajado determinista (sha256), no siempre la «a».
"""
from __future__ import annotations

import hashlib
import json
import pathlib
import re
import subprocess
import sys

FUENTE_ID = "BOE-A-1978-31229"


def q(s: str | None) -> str:
    return "NULL" if s is None else "'" + s.replace("'", "''") + "'"


def arr(xs: list[str]) -> str:
    return "ARRAY[" + ",".join(q(x) for x in xs) + "]::text[]" if xs else "'{}'::text[]"


def etiqueta_bloque(bloque: dict | None, bid: str) -> str:
    """«Artículo 32 bis» → «32 bis». Los ids de bloque no siempre coinciden con el número (a2-3 = art. 21)."""
    t = ((bloque or {}).get("titulo") or "").strip()
    m = re.match(r"^Art[íi]culo\s+(.+?)\.?$", t, re.I)
    return m.group(1) if m else (t.lower() or bid)


def main() -> int:
    args = sys.argv[1:]
    path = pathlib.Path(args[0])
    estado = args[args.index("--estado") + 1]
    if estado not in ("borrador", "publicado"):
        raise SystemExit("--estado debe ser borrador o publicado")
    crear_tema = "--crear-tema" in args

    v = subprocess.run([sys.executable, "scripts/validar_conceptos.py", str(path)], capture_output=True, text=True)
    if v.returncode != 0:
        sys.stderr.write(v.stdout + v.stderr)
        raise SystemExit("El validador ha fallado: no se genera SQL.")

    d = json.loads(path.read_text(encoding="utf-8"))
    # Norma del fichero (por defecto, la Constitución: así los ficheros antiguos generan el mismo SQL).
    fuente_id = d.get("norma", FUENTE_ID)
    doc = d.get("documento", "CE")
    nombre = d.get("nombre_norma", "Constitución Española")
    abrev = d.get("abreviatura", "CE")
    prefijo = d.get("hash_prefijo", "CE")
    meta = json.loads(pathlib.Path(f"data/fuentes/{fuente_id}/meta.json").read_text(encoding="utf-8"))
    bloques = {b["id"]: b for b in json.loads(pathlib.Path(f"data/fuentes/{fuente_id}/bloques.json").read_text(encoding="utf-8"))}
    fecha = meta["fecha_actualizacion_boe"][:8]
    fecha_txt = f"{fecha[6:8]}/{fecha[4:6]}/{fecha[0:4]}"
    tema = int(d["tema"])
    est_c = "publicado" if estado == "publicado" else "borrador"
    est_q = "publicada" if estado == "publicado" else "borrador"

    out = [f"-- Generado por scripts/cargar_conceptos.py desde {path} (estado {estado}).",
           f"-- Texto oficial: {fuente_id}, actualización BOE {fecha_txt}, sha256 {meta['sha256_texto_xml'][:12]}…",
           "BEGIN;"]
    if crear_tema:
        out.append(f"INSERT INTO public.topics (convocatoria_id, numero, nombre) SELECT 1, {tema}, " + q(d.get('tema_nombre', 'Constitución Española')) + " "
                   f"WHERE NOT EXISTS (SELECT 1 FROM public.topics WHERE convocatoria_id = 1 AND numero = {tema});")
    out.append("CREATE TEMP TABLE _tema ON COMMIT DROP AS SELECT id FROM public.topics "
               f"WHERE convocatoria_id = 1 AND numero = {tema};")
    out.append("DO $$ BEGIN IF (SELECT count(*) FROM _tema) <> 1 THEN "
               f"RAISE EXCEPTION 'tema {tema} de la convocatoria 1 no encontrado o duplicado'; END IF; END $$;")

    n_q = 0
    for c in d["conceptos"]:
        art = etiqueta_bloque(bloques.get(c["bloque"]), c["bloque"])
        ref = f"{art}.{c['apartado']}" if c["apartado"] else art
        apartado = f"{d['bloque_temario'].split(' (')[0]} · Art. {ref}"
        fuente = f"{nombre}, art. {ref} ({fuente_id}, texto consolidado, act. {fecha_txt})"
        out.append(
            "INSERT INTO public.concepts (id, topic_id, documento, apartado, orden, pregunta, respuesta, fuente, "
            "cita, tipo, prioridad, confundible_con, estado) "
            f"SELECT {q(c['id'])}, id, {q(doc)}, {q(apartado)}, {c['orden']}, {q(c['tarjeta']['pregunta'])}, "
            f"{q(c['tarjeta']['respuesta'])}, {q(fuente)}, {q(c['cita'])}, {q(c['tipo'])}, {c['prioridad']}, "
            f"{arr(c.get('confundible_con', []))}, {q(est_c)} FROM _tema "
            "ON CONFLICT (id) DO UPDATE SET topic_id = EXCLUDED.topic_id, documento = EXCLUDED.documento, "
            "apartado = EXCLUDED.apartado, orden = EXCLUDED.orden, pregunta = EXCLUDED.pregunta, "
            "respuesta = EXCLUDED.respuesta, fuente = EXCLUDED.fuente, cita = EXCLUDED.cita, tipo = EXCLUDED.tipo, "
            "prioridad = EXCLUDED.prioridad, confundible_con = EXCLUDED.confundible_con, estado = EXCLUDED.estado;")
        for p in c["preguntas"]:
            n_q += 1
            hd = f"{prefijo}:{c['id']}:N{p['nivel']}"
            orden = sorted(range(len(p["opciones"])), key=lambda i: hashlib.sha256(f"{hd}:{i}".encode()).hexdigest())
            letras = "abcd"
            opciones = [{"letra": letras[j], "texto": p["opciones"][i]} for j, i in enumerate(orden)]
            correcta = letras[orden.index(p["correcta"])]
            ops = json.dumps(opciones, ensure_ascii=False)
            fuente_n = f"Art. {ref} {abrev} (texto consolidado BOE {fuente_id}, act. {fecha_txt})" if abrev != "CE" else f"Art. {ref} CE (texto consolidado BOE, act. {fecha_txt})"
            out.append(
                "UPDATE public.questions SET enunciado = " + q(p["enunciado"]) + ", opciones = " + q(ops) + "::jsonb, "
                f"correcta = {q(correcta)}, explicacion = {q(p['explicacion'])}, fuente_normativa = {q(fuente_n)}, "
                f"nivel = {p['nivel']}, concept_id = {q(c['id'])}, estado = {q(est_q)}, topic_id = (SELECT id FROM _tema) "
                f"WHERE hash_dedupe = {q(hd)};")
            out.append(
                "INSERT INTO public.questions (topic_id, enunciado, opciones, correcta, explicacion, fuente_normativa, "
                "estado, nivel, origen_tipo, origen_archivo, concept_id, hash_dedupe) "
                f"SELECT id, {q(p['enunciado'])}, {q(ops)}::jsonb, {q(correcta)}, {q(p['explicacion'])}, {q(fuente_n)}, "
                f"{q(est_q)}, {p['nivel']}, 'propio', {q(str(path))}, {q(c['id'])}, {q(hd)} FROM _tema "
                f"WHERE NOT EXISTS (SELECT 1 FROM public.questions WHERE hash_dedupe = {q(hd)});")
    out.append(f"-- {len(d['conceptos'])} conceptos, {n_q} preguntas.")
    out.append("COMMIT;")
    print("\n".join(out))
    return 0


if __name__ == "__main__":
    sys.exit(main())
