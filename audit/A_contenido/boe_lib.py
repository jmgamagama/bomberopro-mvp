import re,unicodedata,xml.etree.ElementTree as ET,functools
def norm(s):
    s=unicodedata.normalize('NFKD',s or '').encode('ascii','ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+',' ',s).strip()
@functools.lru_cache(None)
def bloques(boeid):
    r=ET.parse(f'/tmp/boe/{boeid}.xml').getroot()
    out={}
    for b in r.iter('bloque'):
        vs=b.findall('version')
        if not vs: continue
        v=vs[-1]
        out[b.get('id')]={'titulo':b.get('titulo'),'texto':' '.join(''.join(p.itertext()) for p in v),'fv':v.get('fecha_vigencia')}
    return out
def full(boeid): return ' '.join(x['texto'] for x in bloques(boeid).values())
