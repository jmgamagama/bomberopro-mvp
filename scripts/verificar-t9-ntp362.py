#!/usr/bin/env python3
"""Cotejo LITERAL de las 11 fichas del T9 que citan la NTP 362 del INSST (feat/t9-ntp362, 02/11/2026).

José aceptó el INSST (todas sus NTP) como fuente oficial. Hasta ahora estas 11 fichas enlazaban a la versión web de la
NTP 362, sin página (docs/REVISION_INSST_LOTES_2026-11-02.md). Este script usa el mismo método que
scripts/verificar-fichas-literal.py sobre el PDF vigente enlazado desde esa página web:

  - PDF: https://www.insst.es/documents/94886/7875530/ntp_362.pdf (descargado en --pdf-dir, por defecto
    /workspace/fuentes_t9_ntp362; sha256 comprobado contra SHA256 de abajo).
  - Abierta  = la cita enlaza al PDF con #page=N y la respuesta está ENTERA y seguida en la pág. N (o sigue en la N+1)
    tras normalizar (minúsculas, sin tildes, comillas ni puntuación). Sin coincidencia difusa.
  - Oculta   = cualquier otro caso, con motivo.

Uso: python3 scripts/verificar-t9-ntp362.py [--pdf-dir DIR] [--json data/verificacion/t9-ntp362.json]   (solo lectura)
"""
from __future__ import annotations

import argparse
import hashlib
import importlib.util
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
_spec = importlib.util.spec_from_file_location('vfl', ROOT / 'scripts' / 'verificar-fichas-literal.py')
vfl = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(vfl)  # type: ignore[union-attr]

PDF_URL = 'https://www.insst.es/documents/94886/7875530/ntp_362.pdf'
WEB_URL = ('https://www.insst.es/documentacion/colecciones-tecnicas/ntp-notas-tecnicas-de-prevencion/'
           '10-serie-ntp-numeros-331-a-365-ano-1995/ntp-362-fugas-en-recipientes-y-conducciones-emision-en-fase-liquida')
SHA256 = 'eb02abf209abbbc8fde4aae47d52b3766deaa646d4b8fafb9980f3bfba4de2e0'
IDS = ['CPEI-T09-OF-303FA8EC', 'CPEI-T09-OF-598D0A9D', 'CPEI-T09-OF-54865783', 'CPEI-T09-OF-0F2FD506',
       'CPEI-T09-OF-D493D3E9', 'CPEI-T09-OF-377EBBDC', 'CPEI-T09-OF-76FBE0B0', 'CPEI-T09-OF-0B46FCC3',
       'CPEI-T09-OF-B4A1C5E5', 'CPEI-T09-OF-0725F93D', 'CPEI-T09-OF-3869B3CE']
# Fichas que siguen ocultas: en el PDF solo aparecen como fórmula con exponentes aplanados en la capa de texto.
FORMULAS = {
    'CPEI-T09-OF-0F2FD506': 'pág. 3: la velocidad teórica solo está como fórmula «v2 = [2 (ph - pa) ρ -1 + 2 gh]1/2»; '
                            'el subíndice 2, el exponente -1 y la raíz (1/2) salen como texto plano y la forma (2gh)^1/2 '
                            'para ph = pa no está escrita para la velocidad',
    'CPEI-T09-OF-D493D3E9': 'pág. 3: la expresión solo está como fórmula «Qm = Cd Aρ(2gh)1/2»; el exponente 1/2 sale como '
                            'texto plano («(2gh)1/2») y no es un literal fiable para el alumno',
    'CPEI-T09-OF-B4A1C5E5': 'págs. 6-7: el alcance solo está como fórmula «x = v (2y/g)1/2» (exponente 1/2 aplanado) y la '
                            'fórmula de y está como «y = gt2/2» (t al cuadrado aplanado); no hay literal fiable',
}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--pdf-dir', default='/workspace/fuentes_t9_ntp362')
    ap.add_argument('--json', default='')
    a = ap.parse_args()
    d = pathlib.Path(a.pdf_dir)
    sha = hashlib.sha256((d / 'NTP362.pdf').read_bytes()).hexdigest()
    if sha != SHA256:
        print(f'sha256 distinto: {sha} (esperado {SHA256}); el PDF ha cambiado, hay que volver a cotejar', file=sys.stderr)
        return 1
    cards = {c['id']: c for c in vfl.fichas(ROOT / 'src/data/tema9Recall.ts')}
    res = []
    for cid in IDS:
        c = cards[cid]
        r = {'id': cid, 'concepto': c['concepto'], 'respuesta': c['respuesta'], 'fuente': c['fuente']}
        m = re.search(re.escape(PDF_URL) + r'#page=(\d+)$', c['fuente'])
        if not m:
            res.append(r | {'estado': 'oculta', 'motivo': FORMULAS.get(cid, 'la cita no enlaza al PDF con página')})
            continue
        n = int(m.group(1))
        resp = vfl.norm(c['respuesta'])
        p1 = vfl.pagina(d, 'NTP362', n)
        if resp in vfl.norm(p1):
            res.append(r | {'estado': 'abierta', 'pagina': n})
        elif resp in vfl.norm(p1 + '\n' + vfl.pagina(d, 'NTP362', n + 1)):
            res.append(r | {'estado': 'abierta', 'pagina': n, 'nota': f'sigue en la pág. {n + 1}'})
        else:
            res.append(r | {'estado': 'oculta', 'pagina': n, 'motivo': 'la respuesta no está literal en la página citada'})
    cuenta: dict[str, int] = {}
    for x in res:
        cuenta[x['estado']] = cuenta.get(x['estado'], 0) + 1
    print('tema9 NTP 362', len(res), json.dumps(cuenta, ensure_ascii=False))
    if a.json:
        out = {'fecha': '2026-11-02', 'script': 'scripts/verificar-t9-ntp362.py',
               'fuente': {'doc': 'NTP362', 'titulo': 'NTP 362: Fugas en recipientes y conducciones: emisión en fase líquida',
                          'pdf': PDF_URL, 'web': WEB_URL, 'sha256': sha, 'paginas': 10,
                          'descargado': '2026-11-02T10:59+01:00'},
               'criterio': 'respuesta entera y seguida en la página citada (o siguiendo en la siguiente) del PDF vigente de insst.es, '
                           'tras normalizar; las fórmulas con exponentes aplanados en la capa de texto no se abren',
               'fichas': res}
        pathlib.Path(a.json).write_text(json.dumps(out, ensure_ascii=False, indent=1) + '\n', encoding='utf8')
    return 0


if __name__ == '__main__':
    sys.exit(main())
