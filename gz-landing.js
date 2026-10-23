(function(){
const cv=document.getElementById('w'),x=cv.getContext('2d');
let W,H,dpr,p=0,sp=0,N=22,raf;
const stars=Array.from({length:70},()=>({a:Math.random()*6.28,r:Math.random(),z:Math.random()}));
function rs(){dpr=Math.min(devicePixelRatio||1,1.5);W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0)}
addEventListener('resize',()=>{rs();draw(0)});rs();
function sc(){const m=document.documentElement.scrollHeight-innerHeight;p=m>0?scrollY/m:0;if(GZ.rm)draw(0)}
addEventListener('scroll',sc,{passive:true});
const cube=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]],ed=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
function draw(t){
sp+=(p-sp)*(GZ.rm?1:.08);
const s=t/1000,hue=190+sp*140,m=Math.max(W,H),cx=W/2,cy=H/2;
x.fillStyle='#05060f';x.fillRect(0,0,W,H);
const g=x.createRadialGradient(cx,cy,0,cx,cy,m*.6);g.addColorStop(0,`hsla(${hue},90%,25%,.45)`);g.addColorStop(1,'transparent');x.fillStyle=g;x.fillRect(0,0,W,H);
for(let i=0;i<N;i++){const z=((i/N)+sp*3+(GZ.rm?0:s*.03))%1,r=z*z*m*.9+4,a=z*2+sp*6+i*.1;
x.beginPath();for(let k=0;k<=6;k++){const q=a+k*1.0472;x.lineTo(cx+Math.cos(q)*r,cy+Math.sin(q)*r)}
x.strokeStyle=`hsla(${hue+z*70},100%,60%,${z*.8})`;x.lineWidth=1+z*2.5;x.stroke()}
x.fillStyle='#fff';
for(const o of stars){o.z=(o.z+(GZ.rm?0:.002)+Math.abs(sp-p)*.1)%1;const r=o.z*o.z*m*.8*(.3+o.r);x.globalAlpha=o.z;x.fillRect(cx+Math.cos(o.a)*r,cy+Math.sin(o.a)*r,1.5,1.5)}
x.globalAlpha=1;
const ph=(sp*5)%1,sz=Math.min(W,H)*(.07+.14*Math.sin(ph*Math.PI)),ox=cx+Math.sin(sp*12)*W*.22,oy=cy+Math.cos(sp*7)*H*.12,ry=s*.6+sp*10,rx=s*.4+sp*6;
const pts=cube.map(([a,b,c])=>{const X=a*Math.cos(ry)+c*Math.sin(ry);let Z=-a*Math.sin(ry)+c*Math.cos(ry);const Y=b*Math.cos(rx)-Z*Math.sin(rx);Z=b*Math.sin(rx)+Z*Math.cos(rx);const f=1/(3.2-Z*.6);return[ox+X*sz*f*1.6,oy+Y*sz*f*1.6]});
x.strokeStyle=`hsl(${hue+120},100%,70%)`;x.lineWidth=2;x.beginPath();ed.forEach(([a,b])=>{x.moveTo(pts[a][0],pts[a][1]);x.lineTo(pts[b][0],pts[b][1])});x.stroke()}
let last=0,acc=0,n=0;
function loop(t){raf=requestAnimationFrame(loop);if(document.hidden)return;draw(t);if(last){acc+=t-last;if(++n==60){if(acc/n>26&&N>12){N-=5;dpr=1;rs()}acc=n=0}}last=t}
function go(){cancelAnimationFrame(raf);last=0;if(GZ.rm)draw(0);else raf=requestAnimationFrame(loop)}
GZ.onrm=go;GZ.controls(document.getElementById('ctl'));sc();go();
const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('in')),{threshold:.3});document.querySelectorAll('.dim').forEach(d=>io.observe(d));
document.getElementById('enter').onclick=()=>document.getElementById('d1').scrollIntoView({behavior:GZ.rm?'auto':'smooth'});
document.querySelectorAll('[data-go]').forEach(a=>a.onclick=e=>{e.preventDefault();GZ.go(a.dataset.go)});
})();
