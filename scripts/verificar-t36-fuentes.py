#!/usr/bin/env python3
"""Coteja en directo las fichas de municipios del Tema 36 con sus fuentes oficiales.

Solo lee: descarga datos públicos y compara con data/tema36/fichas_lote0N_*.json.
No escribe en el repo, ni en Supabase, ni en ningún servicio.

- INE, tabla 2859 (padrón, cifras definitivas): población a 1/1 de cada municipio,
  su tramo del temario (hasta 5.000 / de 5.001 a 20.000 / más de 20.000) y su código.
- IGN, WFS de Unidades Administrativas (INSPIRE au): límites de cada municipio
  (relaciones au:boundary), con los vecinos de fuera de la provincia y Portugal.

Uso:  python3 scripts/verificar-t36-fuentes.py [--salida informe.json]
Sale con código 1 si alguna ficha no coincide.
"""
import argparse, glob, json, os, re, sys, urllib.parse, urllib.request
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INE = 'https://servicios.ine.es/wstempus/js/ES/DATOS_TABLA/2859?nult=1&tip=AM'
WFS = 'https://www.ign.es/wfs-inspire/unidades-administrativas'
PORTUGAL = '35999999002'


def leer(url, intentos=3):
    for i in range(intentos):
        try:
            with urllib.request.urlopen(url, timeout=180) as r:
                return r.read().decode('utf-8')
        except Exception:
            if i == intentos - 1:
                raise


def unidad(codigo):
    filtro = ('<Filter xmlns="http://www.opengis.net/fes/2.0"><PropertyIsEqualTo>'
              '<ValueReference>au:nationalCode</ValueReference>'
              f'<Literal>{codigo}</Literal></PropertyIsEqualTo></Filter>')
    q = urllib.parse.urlencode({'service': 'WFS', 'request': 'GetFeature', 'version': '2.0.0',
                                'typeNames': 'au:AdministrativeUnit', 'count': '1', 'FILTER': filtro})
    x = leer(f'{WFS}?{q}')
    nombre = re.search(r'<gn:text>(.*?)</gn:text>', x)
    lindes = re.findall(r'ID=AU_ADMINISTRATIVEBOUNDARY_([A-Z0-9]+)#', x)
    vecinos = set()
    for b in lindes:
        vecinos |= set(re.findall(r'\d{11}', b.split('T')[0]))
    vecinos.discard(codigo)
    return codigo, (nombre.group(1) if nombre else None), sorted(vecinos)


def articulo(nombre):
    """«Albuera, La» (INE) → «La Albuera» (fichas)."""
    m = re.match(r'^(.*), (La|El|Los|Las)$', nombre)
    return f'{m.group(2)} {m.group(1)}' if m else nombre


def tramo(p):
    return 'hasta 5.000 habitantes' if p <= 5000 else ('de 5.001 a 20.000 habitantes' if p <= 20000 else 'más de 20.000 habitantes')


def miles(n):
    return f'{n:,}'.replace(',', '.')


def fichas():
    out = []
    for f in sorted(glob.glob(os.path.join(RAIZ, 'data', 'tema36', 'fichas_lote0*_*.json'))):
        lote = re.search(r'lote(\d\d)', f).group(1)
        for c in json.load(open(f, encoding='utf-8'))['fichas']:
            out.append((f'tema36-lote{lote}', c))
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--salida')
    args = ap.parse_args()

    ine = json.loads(leer(INE))
    muni, anyo = {}, None
    for s in ine:
        md = {m['T3_Variable']: m for m in s['MetaData']}
        if 'Municipios' not in md or md['Sexo']['Nombre'] != 'Total':
            continue
        d = s['Data'][0]
        anyo = d['Anyo']
        dato = (md['Municipios']['Codigo'], int(d['Valor']), d.get('T3_TipoDato'))
        # Las fichas usan las dos formas: «Albuera, La» (INE) y «La Albuera».
        muni[md['Municipios']['Nombre']] = dato
        muni[articulo(md['Municipios']['Nombre'])] = dato

    codigos = sorted({'3411' + c[:2] + c for c, _, _ in muni.values()})
    with ThreadPoolExecutor(6) as ex:
        unidades = {c: (n, v) for c, n, v in ex.map(unidad, codigos)}
    externos = sorted({v for _, vs in unidades.values() for v in vs if v not in unidades and v != PORTUGAL})
    with ThreadPoolExecutor(4) as ex:
        nombres_ext = {c: n for c, n, _ in ex.map(unidad, externos)}

    def nombre(c):
        return unidades[c][0] if c in unidades else nombres_ext.get(c)

    res = {'consultado': datetime.now().isoformat(timespec='seconds'), 'ine_anyo': anyo,
           'municipios_ine': len(codigos), 'unidades_ign': len(unidades),
           'poblacion': [0, []], 'codigo_ine': [0, []], 'limites': [0, []], 'sin_cotejar': 0}
    for deck, c in fichas():
        q, r = c['concepto'], c['respuesta']
        m = re.search(r'población oficial tenía (.+) a 1 de enero de (\d{4})', q)
        if m:
            dato = muni.get(m.group(1))
            esperado = dato and f'{miles(dato[1])} habitantes; {tramo(dato[1])}.'
            ok = dato is not None and int(m.group(2)) == anyo and r == esperado
            res['poblacion'][0] += ok
            if not ok:
                res['poblacion'][1].append({'id': c['id'], 'ficha': r, 'ine': esperado})
            continue
        m = re.search(r'código INE del municipio de (.+)\?', q)
        if m:
            dato = muni.get(m.group(1))
            ok = dato is not None and dato[0] == r.strip()
            res['codigo_ine'][0] += ok
            if not ok:
                res['codigo_ine'][1].append({'id': c['id'], 'ficha': r, 'ine': dato and dato[0]})
            continue
        m = re.search(r'MUN-(\d{5})-LIM', c['id'])
        if m:
            cod = '3411' + m.group(1)[:2] + m.group(1)
            n, vs = unidades.get(cod, (None, []))
            dentro = sorted((nombre(v) for v in vs if v.startswith('341106')), key=str.casefold)
            fuera = sorted((nombre(v) for v in vs if not v.startswith('341106') and v != PORTUGAL), key=str.casefold)
            if PORTUGAL in vs:
                fuera = sorted(fuera + ['Portugal (límite internacional)'], key=str.casefold)
            fd = re.search(r'Dentro de la provincia de Badajoz: ([^.]*)\.', r)
            fe = re.search(r'Límite externo: ([^.]*)\.', r)
            f_dentro = sorted(fd.group(1).split(', ') if fd else [], key=str.casefold)
            f_fuera = sorted(fe.group(1).split(', ') if fe else [], key=str.casefold)
            ok = n is not None and n in q and f_dentro == dentro and f_fuera == fuera
            res['limites'][0] += ok
            if not ok:
                res['limites'][1].append({'id': c['id'], 'ficha': r, 'ign': {'dentro': dentro, 'fuera': fuera}})
            continue
        res['sin_cotejar'] += 1

    fallos = sum(len(res[k][1]) for k in ('poblacion', 'codigo_ine', 'limites'))
    for k in ('poblacion', 'codigo_ine', 'limites'):
        print(f'{k}: {res[k][0]} coinciden, {len(res[k][1])} no coinciden')
    print(f"INE {anyo}: {res['municipios_ine']} municipios; IGN: {res['unidades_ign']} unidades; otras fichas (no cotejadas aquí): {res['sin_cotejar']}")
    if args.salida:
        json.dump(res, open(args.salida, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    return 1 if fallos else 0


if __name__ == '__main__':
    sys.exit(main())
