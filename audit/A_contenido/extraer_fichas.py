import re,json,glob,os
out=[]
for f in sorted(glob.glob('src/data/*Recall.ts')):
    s=open(f).read()
    m=re.search(r'export const \w+_CARDS[^=]*=\s*(\[.*?\n\]);',s,re.S)
    if not m: print('NOPARSE',f); continue
    try: cards=json.loads(re.sub(r",\s*\]$","]",m.group(1)))
    except Exception as e: print('JSONERR',f,e); continue
    meta=re.search(r'_META\s*=\s*(\{.*?\n\})',s,re.S)
    deck=os.path.basename(f)[:-9]
    for c in cards: c['_file']=f; out.append(c)
print(len(out))
json.dump(out,open('/tmp/fichas_all.json','w'),ensure_ascii=False)
