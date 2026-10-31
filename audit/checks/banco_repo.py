#!/usr/bin/env python3
"""Extrae el banco tipo test del repo (data/constitucion, data/ley31-1995 y src/data/initialData.ts)
al formato que usa check_contenido.py: una pregunta por línea JSON. Solo lectura."""
import json, glob, os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def conceptos():
    out = []
    for f in sorted(glob.glob(os.path.join(ROOT, 'data/constitucion/*.json')) + glob.glob(os.path.join(ROOT, 'data/ley31-1995/capitulo-*.json'))):
        d = json.load(open(f, encoding='utf-8'))
        if not isinstance(d, dict) or 'conceptos' not in d: continue
        abrev = d.get('abreviatura') or ('CE' if 'constitucion' in f else '')
        for c in d['conceptos']:
            art = c['bloque'][1:]
            for q in c['preguntas']:
                out.append({'id': f"{c['id']}:N{q['nivel']}", 'origen': os.path.relpath(f, ROOT), 'tema': d['tema'],
                            'nivel': q['nivel'], 'concepto': c['id'],
                            'cita': q.get('cita') or c['cita'],
                            'fuente': f"Art. {art}{'.' + c['apartado'] if c.get('apartado') else ''} {abrev}",
                            'enunciado': q['enunciado'], 'opciones': q['opciones'], 'correcta': q['correcta']})
    return out

def initial():
    import subprocess
    raw = subprocess.run(['npx', 'vite-node', os.path.join(ROOT, 'audit/checks/dump_initial.ts')], cwd=ROOT,
                         capture_output=True, text=True, check=True).stdout
    out = []
    for q in json.loads(raw.strip().splitlines()[-1]):
        ops = q['options']
        out.append({'id': q['id'], 'origen': 'src/data/initialData.ts', 'tema': (q.get('tema') or {}).get('numero'),
                    'nivel': int(q['level'][1:]) if str(q.get('level', '')).startswith('N') else None,
                    'cita': q.get('fuente', ''), 'fuente': q.get('fuente', ''), 'enunciado': q['question'],
                    'opciones': ops, 'correcta': ops.index(q['correct_answer']) if q['correct_answer'] in ops else -1})
    return out

def banco():
    return conceptos() + initial()

if __name__ == '__main__':
    for q in banco(): print(json.dumps(q, ensure_ascii=False))
