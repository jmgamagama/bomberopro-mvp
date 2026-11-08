#!/usr/bin/env python3
"""Deterministic CSV quality gate; passing is NOT semantic approval."""
import argparse
import csv
import hashlib
import json
import sys
from pathlib import Path

FIELDS = {'id_pregunta','id_origen','tema','epigrafe','fuente',
          'localizacion','enunciado','opcion_a','opcion_b','opcion_c',
          'correcta','explicacion','nivel','estado','version_fuente'}

def norm(text):
    return ' '.join((text or '').split()).casefold()

def lint(path):
    issues = []
    try:
        with path.open(encoding='utf-8-sig', newline='') as handle:
            reader = csv.DictReader(handle)
            missing = FIELDS - set(reader.fieldnames or [])
            if missing:
                return [{'row':0,'id':'','code':'MISSING_COLUMNS','message':','.join(sorted(missing))}]
            rows = list(reader)
    except (OSError, UnicodeError, csv.Error) as error:
        return [{'row':0,'id':'','code':'INVALID_CSV','message':str(error)}]
    if not 1 <= len(rows) <= 30:
        issues.append({'row':0,'id':'','code':'BATCH_SIZE','message':str(len(rows))})
    seen_ids, seen_signatures = set(), set()
    for row_number, row in enumerate(rows, start=2):
        ident = (row.get('id_pregunta') or '').strip()
        def issue(code, msg):
            issues.append({'row':row_number,'id':ident,'code':code,'message':msg})
        for field in sorted(FIELDS):
            if not (row.get(field) or '').strip():
                issue('EMPTY_FIELD',field)
        # Structural minimums apply to drafts as well as reviewed material.
        if len(norm(row.get('enunciado'))) < 15:
            issue('SHORT_STEM', 'enunciado must contain at least 15 characters')
        if len(norm(row.get('explicacion'))) < 20:
            issue('SHORT_EXPLANATION', 'explicacion must contain at least 20 characters')
        if not ident or ident in seen_ids:
            issue('DUPLICATE_ID',ident)
        seen_ids.add(ident)
        if (row.get('correcta') or '').strip().upper() not in ('A','B','C'):
            issue('BAD_ANSWER','correcta must be A/B/C')
        if (row.get('estado') or '').strip().lower() != 'borrador':
            issue('NOT_DRAFT','estado must be borrador')
        if (row.get('nivel') or '').strip() not in ('1','2','3'):
            issue('BAD_LEVEL','nivel must be 1,2,3')
        try:
            if not 1 <= int((row.get('tema') or '').strip()) <= 40:
                issue('OUTSIDE_SYLLABUS','CPEI has topics 1..40')
        except ValueError:
            issue('BAD_TOPIC','tema must be an integer')
        opts = [norm(row.get('opcion_'+x)) for x in ('a','b','c')]
        if not all(opts) or len(set(opts)) != 3:
            issue('DUPLICATE_OPTIONS','three different options are required')
        signature = hashlib.sha256(('\u241f'.join([norm(row.get('enunciado'))]+sorted(opts))).encode()).hexdigest()
        if signature in seen_signatures:
            issue('DUPLICATE_QUESTION','duplicate within batch')
        seen_signatures.add(signature)
    return issues

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('input_csv',type=Path)
    parser.add_argument('--report',type=Path,required=True)
    args = parser.parse_args()
    result = {'source':str(args.input_csv),'scope':'structure only, NOT factual approval','issues':lint(args.input_csv)}
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(result,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
    print(f"{args.input_csv}: {len(result['issues'])} structural findings")
    return 1 if result['issues'] else 0

if __name__ == '__main__':
    sys.exit(main())
