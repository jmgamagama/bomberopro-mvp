#!/usr/bin/env python3
"""Cotejo LITERAL de las fichas del Tema 37 con el Plan de prevención del CPEI (feat/t37-abrir, 01/11/2026).

Fuente: BOP de Badajoz nº 117, de 22/06/2026, anuncio 2242/2026 (aprobación definitiva del Plan de prevención de
riesgos laborales del CPEI), PDF oficial de dip-badajoz.es (copia en data/fuentes/BOP-BA-2026-2242/anuncio.pdf).

Uso:  python3 scripts/verificar-t37-bop.py [--online]

Solo lectura. Con --online descarga el PDF publicado y comprueba que es idéntico (SHA-256) a la copia del repo.
Para cada ficha de src/data/tema37Recall.ts lee la página N de su `localizacion` («página N de 77») y exige que la
respuesta aparezca ENTERA y seguida en el texto de esa página (pdftotext -layout, espacios normalizados; sin
coincidencia difusa ni quitar tildes). Sale con código 1 si alguna no cuadra.
"""
from __future__ import annotations

import hashlib
import json
import pathlib
import re
import subprocess
import sys
import unicodedata

ROOT = pathlib.Path(__file__).resolve().parent.parent
PDF = ROOT / 'data/fuentes/BOP-BA-2026-2242/anuncio.pdf'
URL = 'https://www.dip-badajoz.es/ficheros/bop/bopedictos/2026-06-22000000_2242.pdf'
SHA256 = '8fba567074ae6807d5ed0bdc673c41ef55762285d6b7f735ec890e56adfa30c2'
TS = ROOT / 'src/data/tema37Recall.ts'


def norm(s: str) -> str:
    s = unicodedata.normalize('NFC', s).replace('\u00ad', '')
    return re.sub(r'\s+', ' ', s).strip()


def fichas() -> list[dict]:
    src = TS.read_text(encoding='utf8')
    i = src.index('_CARDS')
    a = src.index('[', src.index('=', i))
    return json.loads(src[a:src.rindex('];') + 1])


def pagina(pdf: pathlib.Path, n: int) -> str:
    out = subprocess.run(['pdftotext', '-layout', '-f', str(n), '-l', str(n), str(pdf), '-'],
                         capture_output=True, text=True, check=True).stdout
    return norm(out)


def main() -> int:
    if hashlib.sha256(PDF.read_bytes()).hexdigest() != SHA256:
        print('ERROR: la copia del PDF no es la esperada'); return 1
    if '--online' in sys.argv:
        # curl: el servidor del BOP corta el TLS de urllib (UNEXPECTED_EOF).
        data = subprocess.run(['curl', '-sSfL', '-m', '60', URL], capture_output=True, check=True).stdout
        igual = hashlib.sha256(data).hexdigest() == SHA256
        print('PDF publicado:', 'idéntico a la copia' if igual else 'DISTINTO')
        if not igual:
            return 1
    malas = 0
    cards = fichas()
    for c in cards:
        m = re.search(r'página (\d+) de 77', c['localizacion'])
        ok = bool(m) and norm(c['respuesta']) in pagina(PDF, int(m.group(1)))
        if not ok:
            malas += 1
        print('OK ' if ok else 'NO ', c['id'], c['localizacion'].split(', ', 2)[-1])
    print(f'{len(cards) - malas} de {len(cards)} literales en la página citada')
    return 1 if malas else 0


if __name__ == '__main__':
    sys.exit(main())
