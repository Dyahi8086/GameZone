(function(){
const $=s=>document.querySelector(s);let cat='All',q='';const mood=new Set();
GZ.controls($('#ctl'));
const d=new Date(),seed=((d.getFullYear()*372+d.getMonth()*31+d.getDate())*2654435761)>>>0;
function tile(g){const b=GZ.stats().best[g.id],a=document.createElement('article');a.className='tile';a.style.setProperty('--h',g.h);
a.innerHTML='<div class=art>'+(g.o?'<i class=org>ORIGINAL</i>':'')+'<span>'+g.e+'</span></div><div class=tb><h3>'+g.n+'</h3><div class=tag>'+g.c.join(' · ')+(g.o&&b?' · Best '+b:'')+'</div><p class=tag>'+g.d+'</p></div>';
const l=document.createElement('a');l.className='btn';l.textContent=g.o?'Play Now':'Play Now ↗';l.href=g.u;l.setAttribute('aria-label','Play '+g.n);
if(g.o)l.onclick=e=>{e.preventDefault();GZ.go(g.u)};else{l.target='_blank';l.rel='noopener noreferrer';l.onclick=()=>{GZ.S.set('last',{id:g.id,t:Date.now()});setTimeout(cont,300)}}
a.querySelector('.tb').append(l);return a}
function render(){const r=GAMES.filter(g=>(cat=='All'||g.c.includes(cat))&&(g.n+' '+g.c.join(' ')).toLowerCase().includes(q));
$('#grid').replaceChildren(...r.map(tile));$('#cnt').textContent=r.length+' of '+GAMES.length+' games';$('#none').hidden=!!r.length}
function chip(el,t,fn,on){const b=document.createElement('button');b.className='chip'+(on?' on':'');b.textContent=t;b.onclick=()=>fn(b);el.append(b)}
['All',...CATS].forEach(c=>chip($('#fc'),c,b=>{cat=c;$('#fc').querySelectorAll('.chip').forEach(x=>x.classList.toggle('on',x==b));render()},c=='All'));
CATS.forEach(c=>chip($('#mc'),c,b=>{mood.has(c)?mood.delete(c):mood.add(c);b.classList.toggle('on');rec()}));
$('#q').oninput=e=>{q=e.target.value.trim().toLowerCase();render()};
function rec(){const pl=GZ.stats().plays;const r=GAMES.map((g,i)=>({g,s:g.c.filter(c=>mood.has(c)).length,i})).filter(x=>x.s).sort((a,b)=>b.s-a.s||(pl[a.g.id]||0)-(pl[b.g.id]||0)||((seed+a.i*7)%13)-((seed+b.i*7)%13)).slice(0,3).map(x=>x.g);
$('#rec').replaceChildren(...r.map(tile))}
$('#daily').replaceChildren(tile(GAMES[seed%GAMES.length]));
function cont(){const l=GZ.S.get('last',null),g=l&&GAMES.find(x=>x.id==l.id);if(!g)return;const a=document.createElement('a');a.className='btn';a.href=g.u;a.textContent=(g.o?'Resume ':'Reopen ')+g.n;
if(g.o)a.onclick=e=>{e.preventDefault();GZ.go(g.u)};else{a.target='_blank';a.rel='noopener noreferrer'}
$('#cont').replaceChildren(a)}
function side(){const have=GZ.badges();$('#bd').replaceChildren(...GZ.BADGES.map(b=>{const e=document.createElement('div');e.className='bg'+(have.includes(b.id)?' on':'');e.textContent=(have.includes(b.id)?'🏅 ':'🔒 ')+b.n+' — '+b.d;return e}));
const cur=GZ.S.get('theme','cyan');$('#th').replaceChildren();GZ.themes().forEach(t=>chip($('#th'),t,()=>{GZ.theme(t);side()},t==cur));
const s=GZ.stats().best;$('#sc').textContent='High scores — Space Shooter: '+(s.shooter||0)+' · Neon Racer: '+(s.racer||0)+' · Adventure Quest: '+(s.quest||0)+' (saved on this device only)'}
render();cont();side();
})();
