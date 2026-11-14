const { chromium } = require('playwright');
const base = 'http://127.0.0.1:4314';
const user = { id: '00000000-0000-4000-8000-00000000000a', email: 'alumno@example.test', aud: 'authenticated', role: 'authenticated', app_metadata: {}, user_metadata: {} };
const session = () => ({ access_token: 'e2e', refresh_token: 'r', token_type: 'bearer', expires_in: 3600, expires_at: Math.floor(Date.now()/1000)+3600, user });
const items = [
  ...Array.from({length:5},(_,i)=>({pos:i+1,concept_id:`C${i}`,formato:'ficha',motivo:'NUEVO',question_id:null,concept_pregunta:`Ficha ${i+1}`,concept_respuesta:'Dato ficticio',fuente:'Fuente ficticia'})),
  ...Array.from({length:4},(_,i)=>({pos:i+6,concept_id:`C${i}`,formato:'test',motivo:i===0?'NUEVO_RECUPERACION':'REPASO_VENCIDO',question_id:9000+i,question:`Pregunta ficticia ${i+1}`,options:['Opción A','Opción B','Opción C'],fuente:'Fuente ficticia'})),
  {pos:10,concept_id:'C4',formato:'recuerdo',motivo:'REPASO_VENCIDO',question_id:null,concept_pregunta:'Recuerda el dato ficticio',concept_respuesta:'Dato ficticio',fuente:'Fuente ficticia'},
];
async function run(browser,width,mode) {
  const ctx = await browser.newContext({viewport:{width,height:width===360?740:900},isMobile:width===360,hasTouch:width===360,serviceWorkers:'block'});
  await ctx.route('http://127.0.0.1:9/**', route=>{
    const url=route.request().url(); const fn=url.match(/\/rpc\/([a-z0-9_]+)/)?.[1];
    if(url.includes('/auth/v1/user')) return route.fulfill({json:user});
    if(url.includes('/auth/v1/token')) return route.fulfill({json:session()});
    if(fn==='get_concept_session_v2') return route.fulfill({json:items});
    if(fn==='get_concept_progress') return route.fulfill({json:{total:5,por_aprender:5,aprendiendo:0,debil:0,dominado:0,consolidado:0,vencidos:0,dominio_ponderado:null}});
    if(fn==='submit_concept_answer') return route.fulfill({json:{status:'saved',correct:true,correct_answer:'Opción A',explanation:null,concept_respuesta:'Dato ficticio'}});
    if(fn==='record_concept_event') return route.fulfill({json:{status:'saved'}});
    if(fn==='report_question') return route.fulfill({json:{status:'received'}});
    if(fn==='get_concept_calibration') return route.fulfill({json:null});
    return route.fulfill({json:[]});
  });
  const page=await ctx.newPage(); await page.goto(base);
  await page.evaluate(s=>{localStorage.setItem('mira_onboarding_v1',JSON.stringify({outcome:'started',at:new Date().toISOString()}));localStorage.setItem('sb-127-auth-token',JSON.stringify(s));},session());
  await page.reload();
  const nav=page.getByRole('navigation',{name:width===360?'Navegación móvil':'Navegación principal'});
  await nav.getByRole('button',{name:'Estudiar'}).click();
  await page.getByRole('button',{name:'Empezar',exact:true}).click();
  for(let i=0;i<5;i++){await page.getByRole('heading',{name:`Ficha ${i+1}`}).waitFor();await page.getByRole('button',{name:'Entendido'}).click();}
  await page.getByText('Primera recuperación del concepto recién estudiado').waitFor();
  for(let i=0;i<4;i++){
    await page.getByRole('heading',{name:`Pregunta ficticia ${i+1}`}).waitFor();
    if(i===0&&mode==='before'){
      await page.getByRole('button',{name:'Reportar pregunta'}).click();
      await page.getByRole('radio',{name:/Confusa o mal redactada/}).click();
      await page.getByRole('button',{name:'Enviar reporte'}).click();
      await page.getByRole('button',{name:'Seguir estudiando'}).click();
      continue;
    }
    await page.getByRole('radio',{name:/Opción A/}).click();
    await page.getByRole('button',{name:'Lo sé'}).click();
    await page.getByRole('button',{name:'Confirmar respuesta'}).click();
    await page.getByText('Correcto',{exact:true}).waitFor();
    if(i===0&&mode==='after'){
      await page.getByRole('button',{name:'Reportar pregunta'}).click();
      await page.getByRole('radio',{name:/Confusa o mal redactada/}).click();
      await page.getByRole('button',{name:'Enviar reporte'}).click();
      await page.getByRole('button',{name:'Seguir estudiando'}).click();
    } else await page.getByRole('button',{name:'Siguiente'}).click();
  }
  await page.getByRole('button',{name:'Mostrar respuesta'}).click();
  await page.getByRole('button',{name:'Lo sabía',exact:true}).click();
  const sum=page.getByTestId('desglose-sesion'); await sum.waitFor();
  const txt=await sum.innerText(); const expected=mode==='before'?'9 pasos':'10 pasos';
  const ok=txt.includes(expected)&&txt.includes('5 conceptos nuevos')&&txt.includes(mode==='before'?'3 preguntas de comprobación':'4 preguntas de comprobación')&&txt.includes('1 ejercicio de recuerdo')&&(mode==='before'?txt.includes('1 paso omitido'):!txt.includes('omitido'));
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  await page.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight));
  const actionReachable=await page.evaluate(()=>{
    const action=[...document.querySelectorAll('#session-celebration button')].find(b=>b.textContent?.trim()==='Otra sesión');
    const nav=document.querySelector('nav[aria-label="Navegación móvil"]');
    if(!action)return false;
    const r=action.getBoundingClientRect();
    return r.top>=0&&r.bottom<=innerHeight&&(innerWidth>1023||!nav||r.bottom<=nav.getBoundingClientRect().top);
  });
  await page.screenshot({path:`browser-evidence/visual300-${width}-${mode}.png`,fullPage:true});
  console.log(JSON.stringify({width,mode,ok,overflow,actionReachable,summary:txt.replace(/\s+/g,' ').slice(0,220)}));
  await ctx.close(); if(!ok||overflow||!actionReachable)throw Error(`visual check failed ${width}/${mode}`);
}
(async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});try{for(const width of [360,1280])for(const mode of ['normal','before','after'])await run(browser,width,mode)}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});
