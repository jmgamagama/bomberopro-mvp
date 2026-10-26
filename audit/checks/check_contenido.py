#!/usr/bin/env python3
"""Checks automáticos de contenido (auditor A, 26/10/2026). Solo lectura.
Uso: python3 audit/checks/check_contenido.py [--banco /workspace/audit_banco.jsonl]
Sale con código 1 si algún check supera su umbral. Umbrales en UMBRALES."""
import json,re,glob,os,sys,unicodedata,argparse
ROOT=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
UMBRALES={'derogadas_sin_aviso':0,'test_sin_cita_o_fuente':0,'fichas_sin_localizacion_numerica':0,'tema_invalido_o_fuera_anexo':0,
          'test_opciones_distintas_de_3':0,'test_cita_no_en_articulo_pct':2.0,'fuera_de_epigrafe':0}
# Normas derogadas -> sustituta. Ampliar aquí.
DEROGADAS={r'R(?:eal )?D(?:ecreto)?\.? ?407/1992':'RD 524/2023 (Norma Básica de Protección Civil)',
 r'R(?:eal )?D(?:ecreto)?\.? ?2060/2008':'RD 809/2021 (equipos a presión)',
 r'R(?:eal )?D(?:ecreto)?\.? ?1942/1993':'RD 513/2017 (RIPCI)',
 r'R(?:eal )?D(?:ecreto)?\.? ?2267/2004':'RD 164/2025 (RSCIEI)',
 r'Ley 2/1985':'Ley 17/2015 (SNPC)',
 r'(?:Directriz[^.]{0,80}inundaciones[^.]{0,80}1994|9 de diciembre de 1994)':'Directriz Básica de inundaciones 2026 (BOE-A-2026-9160)',
 r'ADR 20(?:1\d|2[0-3])\b':'ADR 2025'}
AVISO=re.compile(r'derog|sustitu|ya no vigente|vigente[^.]{0,40}(?:RD|Real Decreto) 524/2023|hoy (?:RD|Real Decreto)',re.I)
FUERA_EPIGRAFE=[('código INE (tema 36 no lo incluye)',lambda f:'código INE' in f['concepto']),
                ('SOS módulo de personal (tema 39 pide software de navegación)',lambda f:'Módulo de personal' in f['fuente'] or 'SOS_Personal' in f['fuente'])]
TEMAS_ANEXO=set(range(1,41))
def norm(s):
    s=unicodedata.normalize('NFKD',s or '').encode('ascii','ignore').decode().lower();return re.sub(r'[^a-z0-9]+',' ',s).strip()
def fichas():
    out=[]
    for f in sorted(glob.glob(os.path.join(ROOT,'src/data/*Recall.ts'))):
        s=open(f,encoding='utf-8').read()
        m=re.search(r'export const \w+_CARDS[^=]*=\s*(\[.*?\n\]);',s,re.S)
        if not m: continue
        mt=re.match(r'tema(\d+)',os.path.basename(f))
        for c in json.loads(re.sub(r',\s*\]$',']',m.group(1))): c['_file']=os.path.basename(f);c['_tema']=int(mt.group(1)) if mt else None;out.append(c)
    return out
def articulo(boe,num):
    p=os.path.join(ROOT,'data/fuentes',boe,'bloques.json')
    if not os.path.exists(p): return None
    for b in json.load(open(p,encoding='utf-8')):
        if b['id']==f'a{num}': return ' '.join(x.get('texto','') for x in b.get('parrafos',[]))
def main():
    ap=argparse.ArgumentParser();ap.add_argument('--banco',default='/workspace/audit_banco.jsonl');a=ap.parse_args()
    F=fichas();Q=[json.loads(l) for l in open(a.banco,encoding='utf-8')] if os.path.exists(a.banco) else []
    R={k:[] for k in UMBRALES}
    for f in F:
        txt=' '.join([f['concepto'],f['respuesta'],f['fuente'],f['localizacion']])
        for p,sus in DEROGADAS.items():
            if re.search(p,txt,re.I) and not AVISO.search(txt): R['derogadas_sin_aviso'].append((f['id'],p,sus))
        if not re.search(r'\d',f['localizacion']): R['fichas_sin_localizacion_numerica'].append((f['id'],f['localizacion']))
        if f['_tema'] not in TEMAS_ANEXO: R['tema_invalido_o_fuera_anexo'].append((f['id'],f['_tema']))
        for lab,fn in FUERA_EPIGRAFE:
            if fn(f): R['fuera_de_epigrafe'].append((f['id'],lab))
    nchk=0
    for q in Q:
        txt=json.dumps(q,ensure_ascii=False)
        for p,sus in DEROGADAS.items():
            if re.search(p,txt,re.I) and not AVISO.search(txt): R['derogadas_sin_aviso'].append((q['id'],p,sus))
        if not q.get('cita') or not q.get('fuente'): R['test_sin_cita_o_fuente'].append(q['id'])
        if not (isinstance(q.get('tema'),int) and q['tema'] in TEMAS_ANEXO): R['tema_invalido_o_fuera_anexo'].append((q['id'],q.get('tema')))
        if len(q.get('opciones',[]))!=3: R['test_opciones_distintas_de_3'].append((q['id'],len(q.get('opciones',[]))))
        m=re.search(r'[Aa]rt\.?\s*(\d+)(\s*bis)?',q.get('fuente') or '')
        if m and q.get('cita'):
            boe='BOE-A-1978-31229' if ' CE' in q['fuente'] else ('BOE-A-1995-24292' if 'LPRL' in q['fuente'] else None)
            t=articulo(boe,m.group(1)+('bis' if m.group(2) else '')) if boe else None
            if t is not None:
                nchk+=1
                if norm(q['cita']) not in norm(t): R['test_cita_no_en_articulo_pct'].append(q['id'])
    fallo=False
    print(f'fichas={len(F)} test={len(Q)}')
    for k,v in R.items():
        val=100*len(v)/nchk if k.endswith('_pct') and nchk else len(v)
        ok=val<=UMBRALES[k];fallo|=not ok
        print(f"[{'OK ' if ok else 'FALLA'}] {k}: {val:.1f}{'%' if k.endswith('_pct') else ''} (umbral {UMBRALES[k]}) ej={v[:3]}")
    sys.exit(1 if fallo else 0)
if __name__=='__main__': main()
