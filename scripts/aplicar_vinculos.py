#!/usr/bin/env python3
"""Genera el SQL que aplica en producción la revisión de preguntas existentes (vinculos-*.json).

Uso:  python3 scripts/aplicar_vinculos.py data/constitucion/vinculos-produccion-titulo-preliminar.json > vinculos.sql

Por cada pregunta, según su «accion»:
  vincular           concept_id y nivel
  corregir           concept_id, nivel y el cambio indicado (enunciado, una opción u opciones+correcta)
  retirar_duplicada  estado = 'duplicada'
  fuera_temario      estado = 'fuera_temario' (no es del temario de la convocatoria)
  reubicar           nada (se vinculará en otra fase)

Seguridad (protocolo de cambio seguro):
  * Antes de cada cambio se guarda el valor anterior en qa_changes_20260923 en la MISMA sentencia
    (CTE), para poder deshacer pregunta a pregunta.
  * Solo se toca una pregunta si sigue 'publicada' (si alguien la cambió después de la revisión, no se pisa).
  * Todo en una transacción; al final comprueba los recuentos esperados y, si no cuadran, aborta.
  * Exige que los conceptos existan (cárguelos antes con cargar_conceptos.py).
"""
from __future__ import annotations

import json
import pathlib
import sys

MOTIVO = "revisión arts. 1-9 CE contra BOE act. 20/05/2026 (17/10/2026)"


def q(s) -> str:
    return "NULL" if s is None else "'" + str(s).replace("'", "''") + "'"


def log_and_update(qid: int, campo: str, expr_anterior: str, set_sql: str, motivo: str) -> str:
    return (f"WITH prev AS (SELECT id, ({expr_anterior})::text AS v FROM public.questions WHERE id = {qid} AND estado = 'publicada'), "
            f"logged AS (INSERT INTO public.qa_changes_20260923 (question_id, campo, valor_anterior, motivo) "
            f"SELECT id, {q(campo)}, v, {q(motivo)} FROM prev RETURNING question_id) "
            f"UPDATE public.questions SET {set_sql} WHERE id IN (SELECT question_id FROM logged);")


def main() -> int:
    d = json.loads(pathlib.Path(sys.argv[1]).read_text(encoding="utf-8"))
    out = [f"-- Generado por scripts/aplicar_vinculos.py desde {sys.argv[1]}", "BEGIN;"]
    conceptos = sorted({e["concepto"] for e in d["preguntas"] if e["concepto"]})
    out.append("DO $$ BEGIN IF (SELECT count(*) FROM public.concepts WHERE id IN ("
               + ",".join(q(c) for c in conceptos) + f")) <> {len(conceptos)} THEN "
               "RAISE EXCEPTION 'faltan conceptos: cargue antes data/constitucion con cargar_conceptos.py'; END IF; END $$;")
    esperado = {"vinculo": 0, "estado": 0}
    for e in d["preguntas"]:
        qid, a = e["question_id"], e["accion"]
        mot = f"{MOTIVO}: {a}" + (f" — {e['motivo']}" if e.get("motivo") else "")
        if a in ("vincular", "corregir"):
            # El valor anterior guarda concept_id y nivel juntos; la marcha atrás los separa.
            out.append(log_and_update(qid, "concept_id|nivel", "coalesce(concept_id,'') || '|' || coalesce(nivel::text,'')",
                                      f"concept_id = {q(e['concepto'])}, nivel = {int(e['nivel'])}", mot))
            esperado["vinculo"] += 1
            c = e.get("cambios") or {}
            if "enunciado" in c:
                out.append(log_and_update(qid, "enunciado", "enunciado", f"enunciado = {q(c['enunciado'])}", mot))
            if "opcion" in c:
                o = c["opcion"]
                new = (f"opciones = (SELECT jsonb_agg(CASE WHEN x->>'letra' = {q(o['letra'])} "
                       f"THEN jsonb_build_object('letra', {q(o['letra'])}, 'texto', {q(o['texto'])}) ELSE x END "
                       "ORDER BY x->>'letra') FROM jsonb_array_elements(opciones) x)")
                out.append(log_and_update(qid, "opciones", "opciones", new, mot))
            if "opciones" in c:
                ops = json.dumps(c["opciones"], ensure_ascii=False)
                out.append(log_and_update(qid, "opciones", "opciones", f"opciones = {q(ops)}::jsonb", mot))
                out.append(log_and_update(qid, "correcta", "correcta", f"correcta = {q(c['correcta'])}", mot))
        elif a == "retirar_duplicada":
            out.append(log_and_update(qid, "estado", "estado", "estado = 'duplicada'", mot))
            esperado["estado"] += 1
        elif a == "fuera_temario":
            out.append(log_and_update(qid, "estado", "estado", "estado = 'fuera_temario'", mot))
            esperado["estado"] += 1
    ids_v = [e["question_id"] for e in d["preguntas"] if e["accion"] in ("vincular", "corregir")]
    out.append("DO $$ DECLARE n int; BEGIN SELECT count(*) INTO n FROM public.questions WHERE id IN ("
               + ",".join(map(str, ids_v)) + f") AND concept_id IS NOT NULL; IF n <> {esperado['vinculo']} THEN "
               f"RAISE EXCEPTION 'vinculadas % de {esperado['vinculo']}: alguna pregunta ya no estaba publicada; revisar', n; END IF; END $$;")
    out.append(f"-- {esperado['vinculo']} vinculadas, {esperado['estado']} despublicadas con registro.")
    out.append("COMMIT;")
    print("\n".join(out))
    return 0


if __name__ == "__main__":
    sys.exit(main())
