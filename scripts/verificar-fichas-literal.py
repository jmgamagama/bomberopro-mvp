#!/usr/bin/env python3
"""Comprobación LITERAL de fichas ocultas contra su fuente oficial o aceptada (feat/abrir-t32-t9-t15, 01/11/2026).

Uso:  python3 scripts/verificar-fichas-literal.py [--pdf-dir DIR] [--json SALIDA]

Para cada ficha de los mazos configurados lee la URL de su campo `fuente` y:
  - BOE (boe.es/buscar/act.php?id=<ID>#<bloque>): busca la respuesta en el bloque VIGENTE de
    data/fuentes/<ID>/bloques.json (descargado con scripts/fuente_boe.py).
  - CTE (codigotecnico.org/pdf/Documentos/.../<DB>.pdf#page=N): busca la respuesta en el texto de la
    página N del PDF oficial (pdftotext, con y sin -layout); se admite que siga en la página N+1.
  - INSST (insst.es/documents/.../<pdf>#page=N), solo NTP 221, 841 y 842 y Guía técnica de equipos de trabajo,
    aceptadas como fuente oficial por el propietario (feat/fichas-insst, 01/11/2026): como el CTE, la respuesta
    en la página N del PDF oficial descargado de insst.es (se admite que siga en la N+1).
  - Cualquier otra fuente (otros documentos del INSST, IDAE/MITECO, EUR-Lex…): no aceptada, la ficha sigue oculta.
La respuesta tiene que aparecer ENTERA y seguida tras normalizar (minúsculas, sin tildes, comillas ni
puntuación). No hay coincidencia difusa: lo que no cuadra al pie de la letra queda oculto.
Además, si la pregunta cita un artículo («art. 11.2»), tiene que ser el del bloque enlazado.
"""
from __future__ import annotations

import argparse
import json
import pathlib
import re
import subprocess
import sys
import unicodedata

ROOT = pathlib.Path(__file__).resolve().parent.parent
MAZOS = {
    'tema32': 'src/data/tema32Recall.ts',
    'tema9': 'src/data/tema9Recall.ts',
    'tema15': 'src/data/tema15Recall.ts',
}
INSST = {'ntp_221.pdf': 'NTP221', '841+web.pdf': 'NTP841', '842+web.pdf': 'NTP842',
         'Gu%C3%ADa+t%C3%A9cnica+para+la+evaluaci%C3%B3n+y+prevenci%C3%B3n+de+los+riesgos+relativos+a+la+utilizaci%C3%B3n+de+los+equipos+de+trabajo.pdf': 'GUIA_ET'}
PDFS = {'DBSI': 'SI/DBSI.pdf', 'DBSUA': 'SUA/DBSUA.pdf', 'DBHS': 'HS/DBHS.pdf'}


def norm(s: str) -> str:
    s = unicodedata.normalize('NFKD', s)
    s = ''.join(c for c in s if not unicodedata.combining(c)).lower()
    s = re.sub('­\\s*', '', s)  # guion blando (también a fin de línea, PDF de las NTP)
    s = s.replace('­', '').replace('²', '2').replace('³', '3')
    s = re.sub(r'\biux\b', 'lux', s)  # capa de texto del PDF del DB SUA: «Iux» por «lux»
    s = re.sub(r'(\w)-\s*\n\s*(\w)', r'\1\2', s)  # guion de fin de línea
    s = re.sub(r'[^0-9a-zñ%²³°/,.=<>≥≤]+', ' ', s)
    s = re.sub(r'(?<=\d)[.,](?=\d)', 'DEC', s)
    s = re.sub(r'[.,]', ' ', s).replace('DEC', ',')
    s = re.sub(r'\s+', ' ', s).strip()
    return re.sub(r'\b(m|dm|cm) ([23])\b', r'\1\2', s)


def fichas(ts: pathlib.Path) -> list[dict]:
    src = ts.read_text(encoding='utf8')
    i = src.index('_CARDS')
    a = src.index('[', src.index('=', i))
    b = src.rindex('];')
    return json.loads(src[a:b + 1])


_bloques: dict[str, dict[str, str]] = {}


def bloque(norma: str, bid: str) -> str | None:
    if norma not in _bloques:
        p = ROOT / 'data' / 'fuentes' / norma / 'bloques.json'
        if not p.exists():
            return None
        _bloques[norma] = {b['id']: '\n'.join(x['texto'] for x in b['parrafos']) for b in json.loads(p.read_text(encoding='utf8'))}
    return _bloques[norma].get(bid)


def pagina(pdf_dir: pathlib.Path, db: str, n: int) -> str:
    out = []
    for layout in (True, False):
        args = ['pdftotext', '-f', str(n), '-l', str(n)] + (['-layout'] if layout else []) + [str(pdf_dir / f'{db}.pdf'), '-']
        out.append(subprocess.run(args, capture_output=True, text=True, check=True).stdout)
    return '\n'.join(out)


def verificar(c: dict, pdf_dir: pathlib.Path, insst_dir: pathlib.Path = pathlib.Path('/workspace/fuentes_insst')) -> dict:
    f = c['fuente']
    r = {'id': c['id'], 'concepto': c['concepto'], 'respuesta': c['respuesta'], 'fuente': f}
    resp = norm(c['respuesta'])
    m = re.search(r'https://www\.boe\.es/buscar/act\.php\?id=(BOE-A-\d{4}-\d+)#([\w-]+)', f)
    if m:
        norma, bid = m.groups()
        texto = bloque(norma, bid)
        if texto is None:
            return r | {'estado': 'sin_bloque', 'motivo': f'{norma}#{bid} no existe en el texto vigente'}
        q = re.search(r'\bart(?:ículo|\.)\s*(\d+)', c['concepto'])
        if q and bid.startswith('a') and bid[1:].isdigit() and q.group(1) != bid[1:]:
            return r | {'estado': 'articulo_distinto', 'motivo': f'la pregunta cita el art. {q.group(1)} y el enlace es #{bid}'}
        ok = resp in norm(texto)
        return r | {'estado': 'ok' if ok else 'no_literal', 'origen': 'BOE', 'norma': norma, 'bloque': bid,
                    'motivo': '' if ok else 'la respuesta no está literal en el bloque citado'}
    m = re.search(r'https://www\.codigotecnico\.org/pdf/Documentos/\w+/(DB\w+)\.pdf#page=(\d+)', f)
    if m:
        db, n = m.group(1), int(m.group(2))
        if db not in PDFS:
            return r | {'estado': 'sin_pdf', 'motivo': f'{db} no configurado'}
        p1 = norm(pagina(pdf_dir, db, n))
        if resp in p1:
            return r | {'estado': 'ok', 'origen': 'CTE', 'db': db, 'pagina': n}
        p12 = norm(pagina(pdf_dir, db, n) + '\n' + pagina(pdf_dir, db, n + 1))
        if resp in p12:
            return r | {'estado': 'ok', 'origen': 'CTE', 'db': db, 'pagina': n, 'nota': f'sigue en la pág. {n + 1}'}
        return r | {'estado': 'no_literal', 'origen': 'CTE', 'db': db, 'pagina': n, 'motivo': 'la respuesta no está literal en la página citada'}
    m = re.search(r'https://www\.insst\.es/documents/94886/\d+/([^/#\s]+\.pdf)#page=(\d+)', f)
    if m and m.group(1) in INSST:
        db, n = INSST[m.group(1)], int(m.group(2))
        d = insst_dir
        if resp in norm(pagina(d, db, n)):
            return r | {'estado': 'ok', 'origen': 'INSST', 'doc': db, 'pagina': n}
        if resp in norm(pagina(d, db, n) + '\n' + pagina(d, db, n + 1)):
            return r | {'estado': 'ok', 'origen': 'INSST', 'doc': db, 'pagina': n, 'nota': f'sigue en la pág. {n + 1}'}
        return r | {'estado': 'no_literal', 'origen': 'INSST', 'doc': db, 'pagina': n, 'motivo': 'la respuesta no está literal en la página citada'}
    return r | {'estado': 'fuente_no_aceptada', 'motivo': 'fuente fuera de BOE/DOE/BOP/CTE/INSARAG'}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--pdf-dir', default='/workspace/fuentes_abrir')
    ap.add_argument('--insst-dir', default='/workspace/fuentes_insst')
    ap.add_argument('--json', default='')
    a = ap.parse_args()
    pdf_dir = pathlib.Path(a.pdf_dir)
    todo = {}
    for mazo, ts in MAZOS.items():
        res = [verificar(c, pdf_dir, pathlib.Path(a.insst_dir)) for c in fichas(ROOT / ts)]
        todo[mazo] = res
        cuenta: dict[str, int] = {}
        for x in res:
            cuenta[x['estado']] = cuenta.get(x['estado'], 0) + 1
        print(mazo, len(res), json.dumps(cuenta, ensure_ascii=False))
    if a.json:
        pathlib.Path(a.json).write_text(json.dumps(todo, ensure_ascii=False, indent=1), encoding='utf8')
    return 0


if __name__ == '__main__':
    sys.exit(main())
