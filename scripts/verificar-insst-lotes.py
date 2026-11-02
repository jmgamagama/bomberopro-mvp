#!/usr/bin/env python3
"""Cotejo LITERAL de las fichas ocultas cuya única pega era citar un documento del INSST (feat/insst-lotes, 01/11/2026).

José aceptó el INSST en general como fuente oficial el 01/11/2026 (feat/fichas-insst). Este script aplica el mismo método
que scripts/verificar-fichas-literal.py a los mazos tema8, tema9 (NTP 362), tema12-lote02, tema13-lote02 y tema22-lote02:

  - Cada ficha enlaza a un PDF de insst.es. Se usa el PDF vigente descargado de insst.es (`--pdf-dir`, por defecto
    /workspace/fuentes_insst_lotes; sha256 en data/verificacion/insst-lotes.json).
  - La respuesta tiene que estar ENTERA y seguida en la página citada (o seguir en la siguiente) tras normalizar
    (minúsculas, sin tildes, comillas ni puntuación). Sin coincidencia difusa.
  - La página sale del enlace (#page=N, #pNN) o de la localización («pág. N»). Si la cita no da página (NTP 362 del T9,
    enlace a la versión web), se busca en todo el PDF; aun así, sin página la ficha no se abre.

Uso: python3 scripts/verificar-insst-lotes.py [--pdf-dir DIR] [--json SALIDA]   (solo lectura)
"""
from __future__ import annotations

import argparse
import hashlib
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

MAZOS = {
    'tema8': 'src/data/tema8Recall.ts',
    'tema9': 'src/data/tema9Recall.ts',
    'tema12-lote02': 'src/data/tema12Lote02Recall.ts',
    'tema13-lote02': 'src/data/tema13Lote02Recall.ts',
    'tema22-lote02': 'src/data/tema22Lote02Recall.ts',
}
# Fragmento del enlace de insst.es -> PDF local (nombre sin .pdf)
DOCS = {
    'ntp_099.pdf': 'NTP099',
    'ntp_536.pdf': 'NTP536',
    'ntp_362.pdf': 'NTP362',
    'ntp-362-fugas-en-recipientes-y-conducciones-emision-en-fase-liquida': 'NTP362',  # T9: enlace a la versión web
    '787a.pdf': 'NTP787',
    'Gu%C3%ADa+t%C3%A9cnica+para+la+utilizaci%C3%B3n+por+los+trabajadores+de+equipos+de+protecci%C3%B3n+individual.pdf': 'GUIA_EPI',
    'FSU+05+Filtros+%28rev.5%29.pdf': 'FSU05',
    'Equipos+respiratorios+aislantes+%28rev.3%29.pdf': 'FSU_ERA',
    'NTP+1170+Utilizaci%C3%B3n+de+EPI+en+trabajos+con+riesgo+de+ca%C3%ADda+de+altura.pdf': 'NTP1170',
    '843+web.pdf': 'NTP843',
    '809+web.pdf': 'NTP809',
    'ntp-1218-sistemas-de-proteccion-individual-contra-caidas-sistemas-anticaidas-ano-2025': 'NTP1218',
    'tema-33-el-riesgo-de-incendio-i-': 'INSST_T33',
    'tema-41-explosiones': 'INSST_T41',
}


def doc_y_pagina(c: dict) -> tuple[str | None, int | None]:
    f = c['fuente']
    if 'insst.es' not in f:
        return None, None
    doc = next((v for k, v in DOCS.items() if k in f), None)
    m = re.search(r'#p(?:age=)?0*(\d+)\s*$', f) or re.search(r'pág\.\s*(\d+)', c.get('localizacion', ''))
    return doc, int(m.group(1)) if m else None


def verificar(c: dict, d: pathlib.Path) -> dict:
    r = {'id': c['id'], 'concepto': c['concepto'], 'respuesta': c['respuesta'], 'fuente': c['fuente']}
    doc, n = doc_y_pagina(c)
    if doc is None:
        return r | {'estado': 'no_insst' if 'insst.es' not in c['fuente'] else 'doc_desconocido'}
    resp = norm(c['respuesta'])
    if n is None:  # la cita no da página: se busca en todo el PDF
        paginas = int(re.search(r'Pages:\s+(\d+)', subprocess.run(['pdfinfo', str(d / f'{doc}.pdf')], capture_output=True, text=True).stdout).group(1))
        en = [k for k in range(1, paginas + 1) if resp in norm(pagina(d, doc, k))]
        if en:
            return r | {'estado': 'sin_pagina', 'doc': doc, 'motivo': f'literal en la pág. {en[0]}, pero la cita no da página'}
        return r | {'estado': 'no_literal', 'doc': doc, 'motivo': 'la respuesta no está literal en ninguna página del documento'}
    if resp in norm(pagina(d, doc, n)):
        return r | {'estado': 'ok', 'doc': doc, 'pagina': n}
    try:
        sig = pagina(d, doc, n + 1)
    except Exception:  # última página
        sig = ''
    if resp in norm(pagina(d, doc, n) + '\n' + sig):
        return r | {'estado': 'ok', 'doc': doc, 'pagina': n, 'nota': f'sigue en la pág. {n + 1}'}
    return r | {'estado': 'no_literal', 'doc': doc, 'pagina': n, 'motivo': 'la respuesta no está literal en la página citada'}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--pdf-dir', default='/workspace/fuentes_insst_lotes')
    ap.add_argument('--json', default='', help='p. ej. data/verificacion/insst-lotes.json')
    a = ap.parse_args()
    d = pathlib.Path(a.pdf_dir)
    todo: dict[str, list[dict]] = {}
    fuentes: dict[str, dict] = {}
    for mazo, ts in MAZOS.items():
        cards = fichas(ROOT / ts)
        res = [verificar(c, d) for c in cards]
        todo[mazo] = res
        for c, x in zip(cards, res):
            if 'doc' in x and x['doc'] not in fuentes:
                pdf = d / f"{x['doc']}.pdf"
                fuentes[x['doc']] = {'url': re.sub(r'#.*$', '', c['fuente'].split(': ')[-1]).strip(),
                                     'sha256': hashlib.sha256(pdf.read_bytes()).hexdigest()}
        cuenta: dict[str, int] = {}
        for x in res:
            cuenta[x['estado']] = cuenta.get(x['estado'], 0) + 1
        print(mazo, len(res), json.dumps(cuenta, ensure_ascii=False))
    if a.json:
        out = {'fecha': '2026-11-02', 'script': 'scripts/verificar-insst-lotes.py',
               'criterio': 'respuesta entera y seguida en la página citada (o siguiendo en la siguiente) del PDF vigente de insst.es, '
                           'tras normalizar; sin página citada no se abre',
               'fuentes': dict(sorted(fuentes.items())), 'mazos': todo}
        pathlib.Path(a.json).write_text(json.dumps(out, ensure_ascii=False, indent=1) + '\n', encoding='utf8')
    return 0


if __name__ == '__main__':
    sys.exit(main())
