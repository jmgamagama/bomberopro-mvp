#!/usr/bin/env python3
"""Cotejo LITERAL del mazo oculto `tema16-lote02` (feat/t16-lote02, 02/11/2026). Solo lectura.

Las 21 fichas citan el Reglamento de Radiocomunicaciones de la UIT (RR), edición de 2024, vol. 1 (PDF de search.itu.int).
La UIT NO está entre las fuentes aceptadas (BOE/DOE/BOP, INSST, INSARAG, codigotecnico.org): este script NO abre nada,
solo deja constancia de:

  1. si cada respuesta está ENTERA y seguida en la página citada del PDF oficial de la UIT (#page=N; se admite que siga en
     la N+1), con la misma normalización que scripts/verificar-fichas-literal.py (sin coincidencia difusa);
  2. si la misma respuesta aparece literal en una norma del BOE vigente que podría citarse en su lugar:
       - Orden TDF/732/2026, CNAF (BOE-A-2026-15661, BOE nº 173 de 17/07/2026), apartado de definiciones;
       - Ley 11/2022, General de Telecomunicaciones (BOE-A-2022-10757), anexo II.
     El texto se baja de la API de datos abiertos del BOE (legislación consolidada).

Uso: python3 scripts/verificar-t16-lote02.py [--dir /workspace/fuentes_t16_lote02] [--descargar] [--json data/verificacion/t16-lote02.json]
"""
from __future__ import annotations

import argparse
import hashlib
import html
import importlib.util
import json
import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
_spec = importlib.util.spec_from_file_location('vfl', ROOT / 'scripts' / 'verificar-fichas-literal.py')
vfl = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(vfl)  # type: ignore[union-attr]
norm, pagina, fichas = vfl.norm, vfl.pagina, vfl.fichas

TS = ROOT / 'src/data/tema16Lote02Recall.ts'
RR_URL = 'https://search.itu.int/history/HistoryDigitalCollectionDocLibrary/1.49.48.es.301.pdf'
BOE = {
    'BOE-A-2026-15661': 'Orden TDF/732/2026, de 10 de julio, Cuadro Nacional de Atribución de Frecuencias (BOE nº 173, 17/07/2026)',
    'BOE-A-2022-10757': 'Ley 11/2022, de 28 de junio, General de Telecomunicaciones',
}
API = 'https://www.boe.es/datosabiertos/api/legislacion-consolidada/id/{id}/texto'


def descargar(d: pathlib.Path) -> None:
    d.mkdir(parents=True, exist_ok=True)
    subprocess.run(['curl', '-sSfL', '-m', '120', '-o', str(d / 'RR2024_vol1.pdf'), RR_URL], check=True)
    for i in BOE:
        subprocess.run(['curl', '-sSfL', '-m', '120', '-H', 'Accept: application/xml', '-o', str(d / f'{i}.xml'),
                        API.format(id=i)], check=True)


def texto_boe(p: pathlib.Path) -> str:
    return html.unescape(re.sub(r'<[^>]+>', ' ', p.read_text(encoding='utf8')))


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--dir', default='/workspace/fuentes_t16_lote02')
    ap.add_argument('--descargar', action='store_true')
    ap.add_argument('--json', default='')
    a = ap.parse_args()
    d = pathlib.Path(a.dir)
    if a.descargar:
        descargar(d)
    boe = {i: norm(texto_boe(d / f'{i}.xml')) for i in BOE}
    res = []
    for c in fichas(TS):
        r = {'id': c['id'], 'concepto': c['concepto'], 'respuesta': c['respuesta']}
        m = re.search(r'#page=(\d+)\s*$', c['fuente'])
        n = int(m.group(1)) if m else None
        resp = norm(c['respuesta'])
        if n is None:
            r['rr'] = 'sin_pagina'
        elif resp in norm(pagina(d, 'RR2024_vol1', n)):
            r['rr'] = 'literal'
        elif resp in norm(pagina(d, 'RR2024_vol1', n) + '\n' + pagina(d, 'RR2024_vol1', n + 1)):
            r['rr'] = 'literal (sigue en la pág. siguiente)'
        else:
            r['rr'] = 'no_literal'
        r['pagina_rr'] = n
        r['boe_literal'] = [i for i, t in boe.items() if resp in t]
        r['fuente_aceptada'] = False
        r['estado'] = 'oculta: cita la UIT (fuente no aceptada)'
        res.append(r)
        print(f"{r['id']}  RR p.{n}: {r['rr']:<10}  BOE: {', '.join(r['boe_literal']) or '-'}")
    lit = sum(r['rr'].startswith('literal') for r in res)
    alt = sum(bool(r['boe_literal']) for r in res)
    print(f'{len(res)} fichas · literales en el RR: {lit} · con literal en el BOE: {alt} · abiertas: 0')
    if a.json:
        fuentes = {'RR2024_vol1': {'url': RR_URL, 'sha256': hashlib.sha256((d / 'RR2024_vol1.pdf').read_bytes()).hexdigest(),
                                   'aceptada': False}}
        for i, nombre in BOE.items():
            fuentes[i] = {'norma': nombre, 'url': f'https://www.boe.es/buscar/act.php?id={i}', 'aceptada': True,
                          'sha256_texto_xml': hashlib.sha256((d / f'{i}.xml').read_bytes()).hexdigest()}
        out = {'fecha': '2026-11-02', 'script': 'scripts/verificar-t16-lote02.py',
               'criterio': 'respuesta entera y seguida en la página citada del PDF de la UIT (o siguiendo en la siguiente), tras '
                           'normalizar; la UIT no es fuente aceptada, así que ninguna ficha se abre',
               'fuentes': fuentes, 'resumen': {'fichas': len(res), 'literal_rr': lit, 'literal_boe': alt, 'abiertas': 0},
               'fichas': res}
        pathlib.Path(a.json).write_text(json.dumps(out, ensure_ascii=False, indent=1) + '\n', encoding='utf8')
    return 0


if __name__ == '__main__':
    sys.exit(main())
