#!/usr/bin/env python3
"""Reproducible editorial fingerprints. This script never approves content."""
import argparse
import csv
import hashlib
import json
from pathlib import Path

FIELDS = ('id_pregunta','id_origen','tema','epigrafe','enunciado',
          'opcion_a','opcion_b','opcion_c','correcta','explicacion',
          'fuente','localizacion','version_fuente','nivel')

def fingerprint(row, evaluator_version):
    payload = {key: (row.get(key) or '').strip() for key in FIELDS}
    payload['version_evaluador'] = evaluator_version
    canon = json.dumps(payload, sort_keys=True, ensure_ascii=False, separators=(',', ':'))
    return hashlib.sha256(canon.encode('utf-8')).hexdigest()

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('input_csv', type=Path)
    parser.add_argument('--cache', type=Path, help='Trusted mapping from protected base; read-only')
    parser.add_argument('--evaluator-version', required=True)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    cached = {}
    if args.cache and args.cache.exists():
        cached = json.loads(args.cache.read_text(encoding='utf-8'))
        if not isinstance(cached, dict):
            raise ValueError('Trusted cache must map question IDs to SHA-256')
    with args.input_csv.open(newline='', encoding='utf-8-sig') as handle:
        reader = csv.DictReader(handle)
        if 'id_pregunta' not in (reader.fieldnames or []):
            raise ValueError('id_pregunta is required')
        rows = list(reader)
    seen, output = set(), []
    for row in rows:
        ident = (row.get('id_pregunta') or '').strip()
        if not ident or ident in seen:
            raise ValueError('Missing/duplicate id_pregunta')
        seen.add(ident)
        digest = fingerprint(row, args.evaluator_version)
        output.append({'id_pregunta': ident, 'sha256': digest,
                       'needs_review': cached.get(ident) != digest})
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(output, indent=2, ensure_ascii=False)+'\n', encoding='utf-8')
    print(json.dumps({'total': len(output),
                      'changed': sum(x['needs_review'] for x in output)}))

if __name__ == '__main__':
    main()
