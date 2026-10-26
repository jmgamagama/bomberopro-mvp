import json,math,sys,collections
sys.path.insert(0,'audit/A_contenido');from clasificacion import C
B=json.load(open('audit/A_contenido/muestra.json'))
Z=1.959964
def wilson(k,n):
    if n==0: return (float('nan'),)*2
    p=k/n;d=1+Z*Z/n;c=(p+Z*Z/(2*n))/d;h=Z*math.sqrt(p*(1-p)/n+Z*Z/(4*n*n))/d
    return max(0,c-h),min(1,c+h)
def strat(items,es_err,excl_nv=True):
    S=collections.defaultdict(list);NH={}
    for m in items:
        cl=C[m['mid']][0]
        if excl_nv and cl=='NO VERIFICABLE': continue
        S[m['_pop']+m['estrato']].append(es_err(cl));NH[m['_pop']+m['estrato']]=m['N_estrato']
    N=sum(NH.values());p=0;var=0;n=0
    for h,v in S.items():
        w=NH[h]/N;ph=sum(v)/len(v);p+=w*ph;n+=len(v)
        if len(v)>1: var+=w*w*ph*(1-ph)/(len(v)-0)
    neff=p*(1-p)/var if var>0 else n
    lo,hi=wilson(p*neff,neff)
    return p,lo,hi,n,N
G=lambda c:c=='ERROR GRAVE'; GL=lambda c:c in('ERROR GRAVE','ERROR LEVE')
GLNV=lambda c:c!='OK'
M=B['muestra']
for m in M: m['_pop']=m['tipo']
out={}
for nombre,sub in [('test',[m for m in M if m['tipo']=='test']),('fichas',[m for m in M if m['tipo']=='ficha']),('conjunto',M)]:
    r={}
    for lab,f,ex in [('grave',G,True),('grave+leve',GL,True),('grave+leve (NV=error)',GLNV,False)]:
        k=sum(1 for m in sub if f(C[m['mid']][0]) and (not ex or C[m['mid']][0]!='NO VERIFICABLE'))
        n=sum(1 for m in sub if (not ex or C[m['mid']][0]!='NO VERIFICABLE'))
        lo,hi=wilson(k,n); p,plo,phi,_,N=strat(sub,f,ex)
        r[lab]=dict(k=k,n=n,p_bruta=k/n,wilson=(lo,hi),p_ponderada=p,ic_ponderado=(plo,phi),N=N)
    out[nombre]=r
json.dump(out,open('audit/A_contenido/estadistica.json','w'),indent=1)
for a,r in out.items():
    for l,v in r.items(): print(f"{a:9s} {l:24s} {v['k']}/{v['n']} bruta={v['p_bruta']:.1%} Wilson=[{v['wilson'][0]:.1%},{v['wilson'][1]:.1%}] pond={v['p_ponderada']:.1%} IC=[{v['ic_ponderado'][0]:.1%},{v['ic_ponderado'][1]:.1%}] N={v['N']}")
