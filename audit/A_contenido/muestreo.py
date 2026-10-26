"""Muestreo estratificado reproducible. SEMILLA=20261026 (random.Random, Python 3)."""
import json,random,re,collections,math
SEED=20261026
rng=random.Random(SEED)
Q=[json.loads(l) for l in open('/workspace/audit_banco.jsonl')]
def qstr(q):
    t=1 if str(q['tema']).startswith('1') or q['tema']=='Constitucion' else int(q['tema'])
    n=str(q['nivel']); n={'facil':'1'}.get(n,n).lstrip('N')
    return f"T{t}-N{n}"
def alloc(strata,total,minimo):
    N=sum(len(v) for v in strata.values())
    a={k:max(minimo,round(total*len(v)/N)) for k,v in strata.items()}
    a={k:min(a[k],len(strata[k])) for k in a}
    while sum(a.values())>total:
        k=max([k for k in a if a[k]>minimo],key=lambda k:a[k]-total*len(strata[k])/N); a[k]-=1
    while sum(a.values())<total:
        k=max(a,key=lambda k:total*len(strata[k])/N-a[k]); a[k]+=1
    return a
sq=collections.defaultdict(list)
for i,q in enumerate(Q): q['_idx']=i; sq[qstr(q)].append(q)
aq=alloc(dict(sorted(sq.items())),80,6)
F=json.load(open('/tmp/fichas_all.json'))
inv=json.load(open('audit/fichas_por_mazo.json'))['decks']
def deckof(f):
    b=f.split('/')[-1][:-9]; m=re.match(r'tema(\d+)(Lote(\d+))?',b)
    return f"tema{m.group(1)}"+(f"-lote{m.group(3)}" if m.group(3) else "")
rev={d['deck']:(d['tema'],d['revision']) for d in inv}
rev.update({'tema34-lote01':rev.get('tema34-lote01'),'tema36-lote01':rev.get('tema36-lote01')})
sf=collections.defaultdict(list)
for f in F:
    d=deckof(f['_file'])
    if d not in rev or rev[d] is None: d=d+'-lote01' if d+'-lote01' in rev else d
    t,r=rev[d]; f['_deck']=d; f['_tema']=t; f['_rev']=r
    sf[f"T{t}-{r}"].append(f)
af=alloc(dict(sorted(sf.items())),120,1)
muestra=[]
for k,n in sorted(aq.items()):
    for q in rng.sample(sq[k],n): muestra.append({'tipo':'test','estrato':k,'N_estrato':len(sq[k]),'n_estrato':n,'item':q})
for k,n in sorted(af.items()):
    for f in rng.sample(sf[k],n): muestra.append({'tipo':'ficha','estrato':k,'N_estrato':len(sf[k]),'n_estrato':n,'item':f})
for i,m in enumerate(muestra): m['mid']=f"M{i+1:03d}"
json.dump({'semilla':SEED,'metodo':'random.Random(SEED).sample por estrato, en orden alfabético de estrato; test primero','asignacion_test':aq,'asignacion_fichas':af,'muestra':muestra},open('/tmp/muestra_base.json','w'),ensure_ascii=False,indent=1)
print(aq);print(af)
