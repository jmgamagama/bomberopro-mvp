#!/usr/bin/env python3
"""Carga en el Postgres local (schema audit) las fuentes que viven en TS/JSON: fichas de recuerdo,
preguntas del prototipo (initialData.ts) y data/questions/questions.export.json. Solo local."""
import json, subprocess, sys
src = json.load(open(sys.argv[1]))
exp = json.load(open('data/questions/questions.export.json'))
def q(s): return 'NULL' if s is None else "'" + str(s).replace("'", "''") + "'"
out = ["BEGIN;", "DROP SCHEMA IF EXISTS audit CASCADE; CREATE SCHEMA audit;",
 "CREATE TABLE audit.recall_cards (id text, deck text, tema int, revision text, concepto text, respuesta text, fuente text, localizacion text, apartado text);",
 "CREATE TABLE audit.preguntas_sueltas (origen text, id text, tema text, nivel text, concepto text, cita text, enunciado text, opciones jsonb, correcta int, estado text);"]
for f in src['fichas']:
    out.append(f"INSERT INTO audit.recall_cards VALUES ({q(f['id'])},{q(f['deck'])},{f['tema']},{q(f['revision'])},{q(f['concepto'])},{q(f['respuesta'])},{q(f.get('fuente'))},{q(f.get('localizacion'))},{q(f.get('apartado'))});")
for p in src['initialQuestions']:
    out.append(f"INSERT INTO audit.preguntas_sueltas VALUES ('src/data/initialData.ts',{q(p['id'])},'1 (prototipo art. 1 CE)',{q(p['level'])},{q(p['microconcept_id'])},NULL,{q(p['question'])},{q(json.dumps(p['options'],ensure_ascii=False))}::jsonb,{p['options'].index(p['correct_answer'])},'prototipo');")
for p in exp:
    out.append(f"INSERT INTO audit.preguntas_sueltas VALUES ('data/questions/questions.export.json',{q(p['id'])},{q(p['tema'])},{q(p['dificultad'])},NULL,{q(p.get('fuente'))},{q(p['pregunta'])},{q(json.dumps(p['opciones'],ensure_ascii=False))}::jsonb,{p['respuesta_correcta']},{q(p['estado_qa'])});")
out.append("COMMIT;")
subprocess.run(["psql","-h","/tmp","-p","55432","-U","postgres","-d","bomberopro_audit","-v","ON_ERROR_STOP=1","-q"], input="\n".join(out), text=True, check=True)
print(len(src['fichas']), len(src['initialQuestions']), len(exp))
