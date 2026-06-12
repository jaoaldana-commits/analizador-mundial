// ============================================================
// MODELO ESTADÍSTICO — Analizador Mundial 2026
// Poisson independiente sobre diferencial de ratings tipo Elo
// ============================================================

const TEAMS = {
  "México":          {r:1865, f:"🇲🇽", c:"CONCACAF", host:true},
  "Sudáfrica":       {r:1680, f:"🇿🇦", c:"CAF"},
  "Corea del Sur":   {r:1775, f:"🇰🇷", c:"AFC"},
  "Chequia":         {r:1745, f:"🇨🇿", c:"UEFA"},
  "Canadá":          {r:1795, f:"🇨🇦", c:"CONCACAF", host:true},
  "Bosnia":          {r:1705, f:"🇧🇦", c:"UEFA"},
  "Qatar":           {r:1645, f:"🇶🇦", c:"AFC"},
  "Suiza":           {r:1845, f:"🇨🇭", c:"UEFA"},
  "Brasil":          {r:2035, f:"🇧🇷", c:"CONMEBOL"},
  "Marruecos":       {r:1925, f:"🇲🇦", c:"CAF"},
  "Escocia":         {r:1740, f:"🏴󠁧󠁢󠁳󠁣󠁴󠁿", c:"UEFA"},
  "Haití":           {r:1545, f:"🇭🇹", c:"CONCACAF"},
  "Estados Unidos":  {r:1815, f:"🇺🇸", c:"CONCACAF", host:true},
  "Paraguay":        {r:1810, f:"🇵🇾", c:"CONMEBOL"},
  "Australia":       {r:1745, f:"🇦🇺", c:"AFC"},
  "Turquía":         {r:1815, f:"🇹🇷", c:"UEFA"},
  "Alemania":        {r:1985, f:"🇩🇪", c:"UEFA"},
  "Ecuador":         {r:1900, f:"🇪🇨", c:"CONMEBOL"},
  "Costa de Marfil": {r:1755, f:"🇨🇮", c:"CAF"},
  "Curazao":         {r:1545, f:"🇨🇼", c:"CONCACAF"},
  "Países Bajos":    {r:2005, f:"🇳🇱", c:"UEFA"},
  "Japón":           {r:1885, f:"🇯🇵", c:"AFC"},
  "Suecia":          {r:1785, f:"🇸🇪", c:"UEFA"},
  "Túnez":           {r:1715, f:"🇹🇳", c:"CAF"},
  "Bélgica":         {r:1885, f:"🇧🇪", c:"UEFA"},
  "Egipto":          {r:1765, f:"🇪🇬", c:"CAF"},
  "Irán":            {r:1780, f:"🇮🇷", c:"AFC"},
  "Nueva Zelanda":   {r:1590, f:"🇳🇿", c:"OFC"},
  "España":          {r:2185, f:"🇪🇸", c:"UEFA"},
  "Uruguay":         {r:1905, f:"🇺🇾", c:"CONMEBOL"},
  "Arabia Saudita":  {r:1655, f:"🇸🇦", c:"AFC"},
  "Cabo Verde":      {r:1605, f:"🇨🇻", c:"CAF"},
  "Francia":         {r:2075, f:"🇫🇷", c:"UEFA"},
  "Senegal":         {r:1825, f:"🇸🇳", c:"CAF"},
  "Noruega":         {r:1855, f:"🇳🇴", c:"UEFA"},
  "Irak":            {r:1605, f:"🇮🇶", c:"AFC"},
  "Argentina":       {r:2155, f:"🇦🇷", c:"CONMEBOL"},
  "Austria":         {r:1835, f:"🇦🇹", c:"UEFA"},
  "Argelia":         {r:1785, f:"🇩🇿", c:"CAF"},
  "Jordania":        {r:1645, f:"🇯🇴", c:"AFC"},
  "Portugal":        {r:2045, f:"🇵🇹", c:"UEFA"},
  "Colombia":        {r:1945, f:"🇨🇴", c:"CONMEBOL"},
  "Uzbekistán":      {r:1675, f:"🇺🇿", c:"AFC"},
  "RD Congo":        {r:1645, f:"🇨🇩", c:"CAF"},
  "Inglaterra":      {r:2095, f:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", c:"UEFA"},
  "Croacia":         {r:1855, f:"🇭🇷", c:"UEFA"},
  "Panamá":          {r:1705, f:"🇵🇦", c:"CONCACAF"},
  "Ghana":           {r:1705, f:"🇬🇭", c:"CAF"},
};

const GROUPS = {
  A:["México","Sudáfrica","Corea del Sur","Chequia"],
  B:["Canadá","Bosnia","Qatar","Suiza"],
  C:["Brasil","Marruecos","Escocia","Haití"],
  D:["Estados Unidos","Paraguay","Australia","Turquía"],
  E:["Alemania","Ecuador","Costa de Marfil","Curazao"],
  F:["Países Bajos","Japón","Suecia","Túnez"],
  G:["Bélgica","Egipto","Irán","Nueva Zelanda"],
  H:["España","Uruguay","Arabia Saudita","Cabo Verde"],
  I:["Francia","Senegal","Noruega","Irak"],
  J:["Argentina","Austria","Argelia","Jordania"],
  K:["Portugal","Colombia","Uzbekistán","RD Congo"],
  L:["Inglaterra","Croacia","Panamá","Ghana"],
};

function factorial(n){let f=1;for(let i=2;i<=n;i++)f*=i;return f}
function poisson(k,lam){return Math.pow(lam,k)*Math.exp(-lam)/factorial(k)}

// ============================================================
// RATINGS VIVOS — recalibración Elo con resultados reales
// (lee RESULTADOS de js/resultados.js si está cargado)
// ============================================================
const K_ELO = 40;
function computeLiveRatings(){
  const R = Object.fromEntries(Object.entries(TEAMS).map(([k,v])=>[k,v.r]));
  const played = (typeof RESULTADOS!=="undefined" ? RESULTADOS : [])
    .filter(m=>m.ga!==null && m.gb!==null);
  const koPlayed = (typeof RESULTADOS_KO!=="undefined" ? RESULTADOS_KO : [])
    .filter(m=>m.ga!==null && m.gb!==null);
  for(const m of [...played, ...koPlayed]){
    if(!(m.A in R) || !(m.B in R)) continue;
    const ha = TEAMS[m.A].host?60:0, hb = TEAMS[m.B].host?60:0;
    const expA = 1/(1+Math.pow(10, -((R[m.A]+ha)-(R[m.B]+hb))/400));
    const sA = m.ga>m.gb?1 : m.ga<m.gb?0 : 0.5;
    const margin = Math.sqrt(Math.max(1, Math.abs(m.ga-m.gb)));
    const delta = K_ELO * margin * (sA - expA);
    R[m.A]+=delta; R[m.B]-=delta;
  }
  return R;
}
let RATINGS = computeLiveRatings();
function realResult(A,B){
  if(typeof RESULTADOS==="undefined") return null;
  for(const m of RESULTADOS){
    if(m.ga===null||m.gb===null) continue;
    if(m.A===A&&m.B===B) return {a:m.ga,b:m.gb};
    if(m.A===B&&m.B===A) return {a:m.gb,b:m.ga};
  }
  return null;
}
function countPlayed(){
  const g=(typeof RESULTADOS!=="undefined"?RESULTADOS:[]).filter(m=>m.ga!==null&&m.gb!==null).length;
  const k=(typeof RESULTADOS_KO!=="undefined"?RESULTADOS_KO:[]).filter(m=>m.ga!==null&&m.gb!==null).length;
  return g+k;
}

function expectedGoals(A,B){
  const a=TEAMS[A], b=TEAMS[B];
  const ra=RATINGS[A]+(a.host?60:0), rb=RATINGS[B]+(b.host?60:0);
  const d=ra-rb;
  let xa=1.32*Math.exp(d/430), xb=1.32*Math.exp(-d/430);
  return [Math.min(4.6,Math.max(0.18,xa)), Math.min(4.6,Math.max(0.18,xb))];
}

function predictMatch(A,B){
  const [xa,xb]=expectedGoals(A,B);
  const MAX=8; let pW=0,pD=0,pL=0,over25=0,btts=0;
  let best={p:-1,a:0,b:0}; const scores=[];
  for(let a=0;a<=MAX;a++)for(let b=0;b<=MAX;b++){
    const p=poisson(a,xa)*poisson(b,xb);
    if(a>b)pW+=p; else if(a===b)pD+=p; else pL+=p;
    if(a+b>2.5)over25+=p;
    if(a>0&&b>0)btts+=p;
    scores.push({a,b,p});
    if(p>best.p)best={p,a,b};
  }
  scores.sort((x,y)=>y.p-x.p);
  return {xa,xb,pW,pD,pL,best,top:scores.slice(0,5),over25,btts};
}

function simulateGroup(g){
  const teams=GROUPS[g];
  const t=Object.fromEntries(teams.map(x=>[x,{pts:0,gf:0,gc:0}]));
  const results=[];
  for(let i=0;i<teams.length;i++)for(let j=i+1;j<teams.length;j++){
    const A=teams[i],B=teams[j];
    const real=realResult(A,B);
    let a,b,conf,isReal=false;
    if(real){ a=real.a; b=real.b; conf=1; isReal=true; }
    else { const pr=predictMatch(A,B); a=pr.best.a; b=pr.best.b; conf=Math.max(pr.pW,pr.pD,pr.pL); }
    results.push({A,B,a,b,conf,real:isReal});
    t[A].gf+=a;t[A].gc+=b;t[B].gf+=b;t[B].gc+=a;
    if(a>b)t[A].pts+=3; else if(b>a)t[B].pts+=3; else {t[A].pts++;t[B].pts++;}
  }
  const standings=teams.map(x=>({team:x,...t[x],dg:t[x].gf-t[x].gc}))
    .sort((p,q)=>q.pts-p.pts||q.dg-p.dg||q.gf-p.gf);
  return {results,standings};
}

// -------- Renderizadores --------
function renderGroupTable(g, el){
  const sim=simulateGroup(g);
  let html='<table><thead><tr><th>Equipo</th><th>Pts</th><th>GF</th><th>GC</th><th>DG</th></tr></thead><tbody>';
  sim.standings.forEach((r,i)=>{
    const cls=i<2?'q1':''; const pc=i<2?'green':(i===2?'gold':'dim');
    html+=`<tr class="${cls}"><td><span class="pos ${pc}">${i+1}</span>${TEAMS[r.team].f} ${r.team}</td><td><b>${r.pts}</b></td><td style="color:var(--dim)">${r.gf}</td><td style="color:var(--dim)">${r.gc}</td><td style="color:${r.dg>=0?'var(--green)':'var(--red)'}">${r.dg>0?'+':''}${r.dg}</td></tr>`;
  });
  html+='</tbody></table><p class="muted" style="margin-top:10px">Verde: clasificación directa a 16avos · Dorado: posible mejor tercero (8 de 12 avanzan).</p>';
  el.innerHTML=html;
  return sim;
}

function renderGroupMatches(sim, el){
  el.innerHTML=sim.results.map(m=>
    `<div class="matchrow"><div class="home">${m.A} ${TEAMS[m.A].f}</div><div class="score" style="${m.real?'color:var(--green)':''}">${m.a} – ${m.b}</div><div class="away">${TEAMS[m.B].f} ${m.B}</div><div class="muted" style="width:80px;text-align:right">${m.real?'✓ jugado':(m.conf*100).toFixed(0)+'%'}</div></div>`
  ).join('');
}

// -------- Cookies (requisito AdSense/UE) --------
document.addEventListener('DOMContentLoaded',()=>{
  const st=document.getElementById('live-status');
  if(st){
    const n=countPlayed();
    st.textContent = n>0
      ? `📡 ${n} resultados reales cargados · ratings y probabilidades recalibrados`
      : '📊 Proyección base (aún sin resultados reales cargados)';
  }
  const b=document.getElementById('cookie-banner');
  if(b && !localStorage.getItem('cookies-ok')){
    b.style.display='block';
    document.getElementById('cookie-accept').addEventListener('click',()=>{
      localStorage.setItem('cookies-ok','1'); b.style.display='none';
    });
  }
});

// ============================================================
// FASE ELIMINATORIA — cuadro oficial FIFA (partidos 73–104)
// ============================================================

// Slots de 16avos: [id, local, visita] donde 1X/2X = posición de grupo,
// T# = mejor tercero asignado (con grupos elegibles según tabla FIFA)
const R32_SLOTS = [
  {id:73, h:"2A", a:"2B"},
  {id:74, h:"1E", a:{third:["A","B","C","D","F"]}},
  {id:75, h:"1F", a:"2C"},
  {id:76, h:"1C", a:"2F"},
  {id:77, h:"1I", a:{third:["C","D","F","G","H"]}},
  {id:78, h:"2E", a:"2I"},
  {id:79, h:"1A", a:{third:["C","E","F","H","I"]}},
  {id:80, h:"1L", a:{third:["E","H","I","J","K"]}},
  {id:81, h:"1D", a:{third:["B","E","F","I","J"]}},
  {id:82, h:"1G", a:{third:["A","E","H","I","J"]}},
  {id:83, h:"2K", a:"2L"},
  {id:84, h:"1H", a:"2J"},
  {id:85, h:"1B", a:{third:["E","F","G","I","J"]}},
  {id:86, h:"1J", a:"2H"},
  {id:87, h:"1K", a:{third:["D","E","I","J","L"]}},
  {id:88, h:"2D", a:"2G"},
];
const R16_SLOTS=[{id:89,h:74,a:77},{id:90,h:73,a:75},{id:91,h:76,a:78},{id:92,h:79,a:80},{id:93,h:83,a:84},{id:94,h:81,a:82},{id:95,h:86,a:88},{id:96,h:85,a:87}];
const QF_SLOTS=[{id:97,h:89,a:90},{id:98,h:93,a:94},{id:99,h:91,a:92},{id:100,h:95,a:96}];
const SF_SLOTS=[{id:101,h:97,a:98},{id:102,h:99,a:100}];

function qualifyAll(){
  // simula los 12 grupos, devuelve posiciones y los 8 mejores terceros
  const pos={}; const thirds=[];
  for(const g of Object.keys(GROUPS)){
    const s=simulateGroup(g).standings;
    pos["1"+g]=s[0].team; pos["2"+g]=s[1].team;
    thirds.push({g, team:s[2].team, pts:s[2].pts, dg:s[2].dg, gf:s[2].gf});
  }
  thirds.sort((a,b)=>b.pts-a.pts||b.dg-a.dg||b.gf-a.gf||TEAMS[b.team].r-TEAMS[a.team].r);
  const best8=thirds.slice(0,8);
  return {pos, best8, eliminatedThirds:thirds.slice(8)};
}

// Asigna los 8 terceros a los 8 slots respetando los grupos elegibles (backtracking)
function assignThirds(best8){
  const slots=R32_SLOTS.filter(s=>typeof s.a==="object");
  const assignment={};
  const used=new Set();
  function bt(i){
    if(i===slots.length)return true;
    const slot=slots[i];
    for(const t of best8){
      if(used.has(t.g))continue;
      if(!slot.a.third.includes(t.g))continue;
      used.add(t.g); assignment[slot.id]=t;
      if(bt(i+1))return true;
      used.delete(t.g); delete assignment[slot.id];
    }
    return false;
  }
  if(!bt(0)){ // fallback: asignación libre si la combinación no calza con la tabla
    let i=0; for(const slot of slots){ assignment[slot.id]=best8[i++]; }
  }
  return assignment;
}

function knockoutWinner(A,B,id){
  // ¿hay resultado real para este partido del cuadro?
  if(typeof RESULTADOS_KO!=="undefined"){
    const r=RESULTADOS_KO.find(m=>m.id===id&&m.ga!==null&&m.gb!==null);
    if(r){
      const winner=r.ga>r.gb?r.A : r.gb>r.ga?r.B : (r.winner||r.A);
      return {A:r.A,B:r.B,a:r.ga,b:r.gb,winner,pens:r.ga===r.gb,conf:1,real:true};
    }
  }
  const p=predictMatch(A,B);
  const isDraw=p.best.a===p.best.b;
  const winner=p.pW>=p.pL?A:B;
  return {A,B,a:p.best.a,b:p.best.b,winner,pens:isDraw,
          conf:Math.max(p.pW/(p.pW+p.pL),p.pL/(p.pW+p.pL))};
}

function simulateKnockout(){
  const {pos,best8}=qualifyAll();
  const thirdAssign=assignThirds(best8);
  const results={};
  const r32=R32_SLOTS.map(s=>{
    const H=pos[s.h];
    const A=(typeof s.a==="object")?thirdAssign[s.id].team:pos[s.a];
    const m=knockoutWinner(H,A,s.id); m.id=s.id;
    m.tagH=s.h; m.tagA=(typeof s.a==="object")?("3°"+thirdAssign[s.id].g):s.a;
    results[s.id]=m.winner; return m;
  });
  const play=(slots)=>slots.map(s=>{
    const m=knockoutWinner(results[s.h],results[s.a],s.id); m.id=s.id;
    results[s.id]=m.winner; return m;
  });
  const r16=play(R16_SLOTS), qf=play(QF_SLOTS), sf=play(SF_SLOTS);
  const fin=knockoutWinner(results[101],results[102],104); fin.id=104;
  const l101=sf[0].winner===sf[0].A?sf[0].B:sf[0].A;
  const l102=sf[1].winner===sf[1].A?sf[1].B:sf[1].A;
  const third=knockoutWinner(l101,l102,103); third.id=103;
  return {r32,r16,qf,sf,fin,third,best8,champion:fin.winner};
}

function koRow(m,labels){
  const f=t=>TEAMS[t].f;
  const aW=m.winner===m.A, sc=`${m.a} – ${m.b}${m.pens?' <span class="muted">(pen.)</span>':''}`;
  return `<div class="matchrow">
    <div class="home" style="${aW?'font-weight:800':'color:var(--dim)'}">${labels&&m.tagH?`<span class="muted">${m.tagH} </span>`:''}${m.A} ${f(m.A)}</div>
    <div class="score">${sc}</div>
    <div class="away" style="${!aW?'font-weight:800':'color:var(--dim)'}">${f(m.B)} ${m.B}${labels&&m.tagA?` <span class="muted">${m.tagA}</span>`:''}</div>
    <div class="muted" style="width:64px;text-align:right">${m.real?'✓ jugado':(m.conf*100).toFixed(0)+'%'}</div>
  </div>`;
}

function renderKnockout(el){
  const k=simulateKnockout();
  const sec=(title,ms,labels)=>`<div class="card"><h2>${title}</h2>${ms.map(m=>koRow(m,labels)).join('')}</div>`;
  el.innerHTML=
    `<div class="card" style="border-color:var(--gold);text-align:center">
      <h2 style="margin-bottom:6px">🏆 Campeón proyectado</h2>
      <div style="font-size:52px">${TEAMS[k.champion].f}</div>
      <div class="display" style="font-size:26px;font-weight:900;color:var(--gold)">${k.champion}</div>
      <p class="muted" style="margin-top:8px">Resultado de simular los 104 partidos con el marcador más probable de cada cruce. En fútbol, lo más probable también es que algo improbable ocurra.</p>
    </div>`
    +sec("Dieciseisavos de final (16avos)",k.r32,true)
    +sec("Octavos de final",k.r16)
    +sec("Cuartos de final",k.qf)
    +sec("Semifinales",k.sf)
    +sec("Tercer puesto",[k.third])
    +sec("Gran Final · 19 de julio · Nueva York/Nueva Jersey",[k.fin])
    +`<div class="card"><h2>Mejores terceros clasificados</h2><p class="muted">${k.best8.map(t=>`${TEAMS[t.team].f} ${t.team} (3°${t.g}, ${t.pts} pts)`).join(' · ')}</p></div>`;
}

// ============================================================
// PÁGINA DE RESULTADOS REALES
// ============================================================
function renderResultados(el){
  const played=(typeof RESULTADOS!=="undefined"?RESULTADOS:[]).filter(m=>m.ga!==null&&m.gb!==null);
  const koPlayed=(typeof RESULTADOS_KO!=="undefined"?RESULTADOS_KO:[]).filter(m=>m.ga!==null&&m.gb!==null);
  if(played.length===0&&koPlayed.length===0){
    el.innerHTML='<div class="card"><p>Aún no hay resultados oficiales cargados. Vuelve después de los primeros partidos: aquí aparecerá cada marcador real y cómo mueve las probabilidades del torneo.</p></div>';
    return;
  }
  let html='';
  // Resultados por jornada y grupo
  for(let j=1;j<=3;j++){
    const ms=played.filter(m=>m.j===j);
    if(ms.length===0)continue;
    html+=`<div class="card"><h2>Jornada ${j} — Fase de grupos</h2>`;
    html+=ms.map(m=>
      `<div class="matchrow"><div class="muted" style="width:60px">Grupo ${m.g}</div>
       <div class="home">${m.A} ${TEAMS[m.A].f}</div>
       <div class="score" style="color:var(--green)">${m.ga} – ${m.gb}</div>
       <div class="away">${TEAMS[m.B].f} ${m.B}</div></div>`).join('');
    html+='</div>';
  }
  if(koPlayed.length>0){
    html+='<div class="card"><h2>Fase eliminatoria</h2>';
    html+=koPlayed.map(m=>
      `<div class="matchrow"><div class="muted" style="width:60px">P. ${m.id}</div>
       <div class="home">${m.A} ${TEAMS[m.A]?TEAMS[m.A].f:''}</div>
       <div class="score" style="color:var(--green)">${m.ga} – ${m.gb}${m.winner&&m.ga===m.gb?' <span class="muted">(pen. '+m.winner+')</span>':''}</div>
       <div class="away">${TEAMS[m.B]?TEAMS[m.B].f:''} ${m.B}</div></div>`).join('');
    html+='</div>';
  }
  // Movimiento de ratings: actual vs base
  const moved=Object.keys(TEAMS)
    .map(t=>({t, base:TEAMS[t].r, now:RATINGS[t], d:RATINGS[t]-TEAMS[t].r}))
    .filter(x=>Math.abs(x.d)>=1)
    .sort((a,b)=>b.d-a.d);
  if(moved.length>0){
    html+='<div class="card"><h2>Movimiento de ratings (Elo)</h2><p class="muted" style="margin-bottom:12px">Cómo han cambiado los ratings de fuerza respecto al inicio del torneo, según los resultados reales. Estos valores alimentan todas las predicciones del sitio.</p>';
    html+=moved.map(x=>{
      const up=x.d>0;
      return `<div class="matchrow">
        <div style="width:30px;font-size:18px">${TEAMS[x.t].f}</div>
        <div class="home" style="text-align:left;flex:1">${x.t}</div>
        <div class="muted" style="width:110px;text-align:right">${x.base.toFixed(0)} → <b style="color:var(--chalk)">${x.now.toFixed(0)}</b></div>
        <div style="width:70px;text-align:right;font-weight:800;color:${up?'var(--green)':'var(--red)'}">${up?'▲ +':'▼ '}${x.d.toFixed(0)}</div>
      </div>`;
    }).join('');
    html+='</div>';
  }
  el.innerHTML=html;
}
