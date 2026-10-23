(function(){
const P='gz:',S={get(k,d){try{const v=localStorage.getItem(P+k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(P+k,JSON.stringify(v))}catch(e){}}};
const GZ=window.GZ={S};
GZ.rm=S.get('rm',matchMedia('(prefers-reduced-motion:reduce)').matches);
GZ.mute=S.get('mute',false);
const R=document.documentElement;R.classList.toggle('rm',GZ.rm);
let ac;
GZ.beep=(f=440,d=.08,t='square',v=.05)=>{if(GZ.mute)return;try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();if(ac.state=='suspended')ac.resume();const o=ac.createOscillator(),g=ac.createGain();o.type=t;o.frequency.value=f;g.gain.setValueAtTime(v,ac.currentTime);g.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+d);o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+d)}catch(e){}};
GZ.toast=m=>{const t=document.createElement('div');t.className='toast';t.textContent=m;document.body.append(t);setTimeout(()=>t.remove(),4000)};
const st=()=>S.get('stats',{plays:{},best:{}});
GZ.stats=st;
GZ.BADGES=[
{id:'boot',n:'Boot Sequence',d:'Play any original game',ok:s=>Object.keys(s.plays).length>0},
{id:'ace',n:'Ace Pilot',d:'Score 300 in Space Shooter',theme:'magenta',ok:s=>(s.best.shooter||0)>=300},
{id:'speed',n:'Neon Legend',d:'Score 1000 in Neon Racer',theme:'violet',ok:s=>(s.best.racer||0)>=1000},
{id:'hero',n:'Shard Hunter',d:'Score 800 in Adventure Quest',theme:'gold',ok:s=>(s.best.quest||0)>=800},
{id:'triple',n:'Triple Threat',d:'Play all three original games',theme:'aurora',ok:s=>['shooter','racer','quest'].every(g=>s.plays[g])},
{id:'ghost',n:'Ghost in the Logo',d:'Find the hidden secret',theme:'ghost'}];
GZ.badges=()=>S.get('badges',[]);
GZ.unlock=id=>{const b=GZ.badges();if(b.includes(id))return false;b.push(id);S.set('badges',b);const B=GZ.BADGES.find(x=>x.id==id);GZ.toast('Badge unlocked: '+B.n+(B.theme?' — new theme!':''));return true};
GZ.themes=()=>['cyan',...GZ.BADGES.filter(b=>b.theme&&GZ.badges().includes(b.id)).map(b=>b.theme)];
GZ.theme=n=>{if(!GZ.themes().includes(n))n='cyan';S.set('theme',n);n=='cyan'?delete R.dataset.theme:R.dataset.theme=n};
GZ.theme(S.get('theme','cyan'));
GZ.played=id=>{const s=st();s.plays[id]=(s.plays[id]||0)+1;S.set('stats',s);S.set('last',{id,t:Date.now()})};
GZ.finish=(id,sc)=>{const s=st();sc=Math.floor(sc);const nw=sc>(s.best[id]||0);if(nw)s.best[id]=sc;S.set('stats',s);const nb=[];GZ.BADGES.forEach(b=>b.ok&&b.ok(s)&&GZ.unlock(b.id)&&nb.push(b.n));return{best:s.best[id]||0,nw,nb}};
GZ.egg=()=>{GZ.unlock('ghost')&&GZ.beep(880,.3,'sine')};
GZ.go=u=>{const f=document.getElementById('fade')||document.body.appendChild(Object.assign(document.createElement('div'),{id:'fade'}));f.classList.add('on');setTimeout(()=>location.href=u,GZ.rm?0:450)};
GZ.controls=el=>{const m=document.createElement('button'),r=document.createElement('button');m.className=r.className='ib';
const up=()=>{m.textContent=GZ.mute?'🔇':'🔊';m.setAttribute('aria-label',GZ.mute?'Unmute sound':'Mute sound');r.textContent=GZ.rm?'🐢':'✨';r.title='Reduced motion: '+(GZ.rm?'on':'off');r.setAttribute('aria-label',r.title)};
m.onclick=()=>{GZ.mute=!GZ.mute;S.set('mute',GZ.mute);up()};
r.onclick=()=>{GZ.rm=!GZ.rm;S.set('rm',GZ.rm);R.classList.toggle('rm',GZ.rm);up();GZ.onrm&&GZ.onrm()};up();el.append(m,r)};
const SV='<svg viewBox="0 0 40 40" fill="none" stroke="var(--a)" stroke-width="2.5"><polygon points="20,2 37,11 37,29 20,38 3,29 3,11"/><path d="M27 15h-9a5 5 0 0 0 0 10h8v-5h-5" stroke="var(--c)"/></svg>';
let taps=0,tt;document.querySelectorAll('.logo').forEach(l=>{l.innerHTML=SV+'<span>GAMEZONE</span>';l.addEventListener('click',()=>{taps++;clearTimeout(tt);tt=setTimeout(()=>taps=0,3000);if(taps>=7){taps=0;GZ.egg()}})});
const kk='ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightba';let buf='';
addEventListener('keydown',e=>{buf=(buf+e.key).slice(-kk.length);if(buf==kk)GZ.egg()});
GZ.run=cfg=>{
document.title=cfg.name+' · GameZone';
const cv=document.getElementById('c'),x=cv.getContext('2d'),root=document.createElement('div');
root.innerHTML='<div id=hud><a href="library.html" class=ib aria-label="Back to library">←</a><b id=sc>0</b><span id=hi></span><span id=ctl></span></div><div id=ov><div><h1></h1><p>'+cfg.desc+'</p><p class=d2>'+cfg.keys+'</p><p id=res></p><button id=go class=btn>Start</button></div></div><div id=pad></div>';
document.body.append(root);GZ.controls(root.querySelector('#ctl'));
const $=s=>root.querySelector(s),G=window.G={k:{left:0,right:0,up:0,down:0,fire:0},score:0,w:0,h:0,ptr:null,state:'ready',t:0,paused:false};
let last=0;
const rs=()=>{const d=Math.min(devicePixelRatio||1,1.5);G.w=innerWidth;G.h=innerHeight;cv.width=G.w*d;cv.height=G.h*d;cv.style.width=G.w+'px';cv.style.height=G.h+'px';x.setTransform(d,0,0,d,0,0)};
addEventListener('resize',rs);rs();
const show=(t,m,b)=>{$('#ov h1').textContent=t;$('#res').textContent=m||'';$('#go').textContent=b;$('#ov').style.display='flex'};
const hi=()=>$('#hi').textContent='Best '+(st().best[cfg.id]||0);hi();
const km={ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right',ArrowUp:'up',w:'up',ArrowDown:'down',s:'down',' ':'fire'};
const kn=e=>km[e.key.length>1?e.key:e.key.toLowerCase()];
const pause=()=>{if(G.state=='play'&&!G.paused){G.paused=true;show('Paused','','Resume')}};
const start=()=>{if(G.state=='play'&&G.paused){G.paused=false;$('#ov').style.display='none';last=performance.now();return}
G.score=0;G.t=0;G.paused=false;G.ptr=null;Object.keys(G.k).forEach(k=>G.k[k]=0);cfg.init();G.state='play';$('#ov').style.display='none';GZ.played(cfg.id);last=performance.now()};
addEventListener('keydown',e=>{const k=kn(e);
if((e.key=='Enter'||e.key==' ')&&(G.state!='play'||G.paused)){e.preventDefault();return start()}
if(k){G.k[k]=1;e.preventDefault()}if(e.key=='p')pause();if(e.key=='m'){GZ.mute=!GZ.mute;S.set('mute',GZ.mute)}});
addEventListener('keyup',e=>{const k=kn(e);if(k)G.k[k]=0});
document.addEventListener('visibilitychange',()=>document.hidden&&pause());
$('#go').onclick=start;
const pd=$('#pad'),B={lr:[['left','◀'],['right','▶']],dp:[['up','▲','u'],['left','◀','l'],['down','▼','d'],['right','▶','r']]}[cfg.pad]||[];
if(cfg.pad=='dp')pd.className='dp';
B.forEach(([k,t,a])=>{const b=document.createElement('button');b.className='pb';b.textContent=t;b.setAttribute('aria-label',k);if(a)b.style.gridArea=a;
b.onpointerdown=e=>{e.preventDefault();G.k[k]=1;try{b.setPointerCapture(e.pointerId)}catch(_){}};
const u=()=>G.k[k]=0;b.onpointerup=b.onpointercancel=b.onlostpointercapture=u;b.oncontextmenu=e=>e.preventDefault();pd.append(b)});
if(cfg.drag){const pp=e=>G.ptr={x:e.clientX,y:e.clientY};cv.onpointerdown=e=>{pp(e);try{cv.setPointerCapture(e.pointerId)}catch(_){}};cv.onpointermove=e=>G.ptr&&pp(e);cv.onpointerup=cv.onpointercancel=()=>G.ptr=null}
G.end=()=>{if(G.state!='play')return;G.state='over';const r=GZ.finish(cfg.id,G.score);hi();show('Game Over','Score '+Math.floor(G.score)+' · Best '+r.best+(r.nw?' — new best!':'')+(r.nb.length?' · Unlocked: '+r.nb.join(', '):''),'Play again');GZ.beep(120,.4,'sawtooth')};
const loop=t=>{requestAnimationFrame(loop);const dt=Math.min((t-last)/1000,.05);last=t;if(G.state=='play'&&!G.paused){G.t+=dt;cfg.update(dt)}cfg.draw(x,G.w,G.h);$('#sc').textContent=Math.floor(G.score)};
cfg.init();show(cfg.name,'','Start');requestAnimationFrame(loop)};
})();
