(()=>{
'serviceWorker'in navigator&&addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
window.revealAll=()=>document.querySelectorAll('.reveal:not(.in)').forEach(n=>io.observe(n));revealAll();
addEventListener('scroll',()=>document.documentElement.style.setProperty('--s',scrollY),{passive:true});
const c=document.getElementById('fx');if(!c)return;
const x=c.getContext('2d'),m=innerWidth<700,cols=['#00e5ff','#a855f7','#ff2fb3'];let W,H,P=[],run=1;
function rs(){W=c.width=innerWidth;H=c.height=innerHeight;P=Array.from({length:m?35:90},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*2+.5,v:Math.random()*.6+.2,c:cols[Math.random()*3|0]}))}
rs();addEventListener('resize',rs);
document.addEventListener('visibilitychange',()=>{run=!document.hidden;run&&f()});
function f(){if(!run)return;x.clearRect(0,0,W,H);P.forEach(p=>{p.y-=p.v;if(p.y<0){p.y=H;p.x=Math.random()*W}x.fillStyle=p.c;x.shadowColor=p.c;x.shadowBlur=m?0:8;x.beginPath();x.arc(p.x,p.y,p.r,0,6.3);x.fill()});requestAnimationFrame(f)}
f()})();
