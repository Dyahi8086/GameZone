import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const canvas = document.querySelector('#world');
const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:false});
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.65));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050713);
scene.fog = new THREE.FogExp2(0x050713, 0.025);
const camera = new THREE.PerspectiveCamera(48, window.innerWidth/window.innerHeight, .1, 220);
camera.position.set(0, 4.2, 13);
const clock = new THREE.Clock();

scene.add(new THREE.HemisphereLight(0x9abfff, 0x11101f, 1.35));
const keyLight = new THREE.DirectionalLight(0xb7f7ff, 3.1); keyLight.position.set(4,9,6); keyLight.castShadow=true; scene.add(keyLight);
const pinkLight = new THREE.PointLight(0xff218f, 42, 24); pinkLight.position.set(-5,2,0); scene.add(pinkLight);
const cyanLight = new THREE.PointLight(0x20eaff, 55, 28); cyanLight.position.set(5,3,1); scene.add(cyanLight);

const mat=(color,metalness=0,roughness=.5,emissive=0x000000,intensity=0)=>new THREE.MeshStandardMaterial({color,metalness,roughness,emissive,emissiveIntensity:intensity});
const cyan=mat(0x41f5ff,.45,.28,0x12dcea,2.2), pink=mat(0xff238e,.35,.3,0x7a063a,1.6), dark=mat(0x101827,.72,.25), glass= new THREE.MeshPhysicalMaterial({color:0x102b42,metalness:.65,roughness:.12,transparent:true,opacity:.9,clearcoat:1}), rubber=mat(0x05070b,.05,.86), white=mat(0xc7faff,.4,.24,0x52f6ff,.5);

function box(parent,w,h,d,material,x,y,z,rx=0,ry=0,rz=0){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);m.position.set(x,y,z);m.rotation.set(rx,ry,rz);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
function cyl(parent,r1,r2,h,material,x,y,z,segments=16,rx=0,ry=0,rz=0){const m=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,segments),material);m.position.set(x,y,z);m.rotation.set(rx,ry,rz);m.castShadow=true;parent.add(m);return m}
function line(parent,points,material,r=.025){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,Math.max(24,points.length*5),r,6,false),material);parent.add(mesh);return mesh}

// Procedural concept car: all geometry is built locally, no external model download required.
const car=new THREE.Group();scene.add(car);car.position.set(1.5,-.2,0);car.rotation.y=-.18;
box(car,3.35,.42,1.52,dark,0,.45,0);
const hood=box(car,1.18,.22,1.42,mat(0x12273a,.8,.2),.98,.62,0,0,0,-.04);
box(car,1.18,.16,1.4,mat(0x1d3448,.7,.22),-.8,.64,0,0,0,.03);
const cabin=new THREE.Mesh(new THREE.CapsuleGeometry(.55,.75,4,8),glass);cabin.scale.set(1.05,.48,.83);cabin.position.set(-.12,.92,0);cabin.rotation.z=-.05;car.add(cabin);
box(car,2.5,.08,1.65,cyan,0,.32,0);
box(car,.32,.11,1.7,pink,-1.42,.5,0);
box(car,.42,.09,1.68,cyan,1.4,.55,0);
for(const side of [-1,1]){
  box(car,.72,.07,.07,white,1.22,.59,side*.68);
  box(car,.65,.06,.06,pink,-1.28,.53,side*.69);
  for(const x of [-1.08,1.03]){
    const wheel=new THREE.Group();wheel.position.set(x,.25,side*.78);car.add(wheel);
    cyl(wheel,.38,.38,.22,rubber,0,0,0,24,Math.PI/2);
    cyl(wheel,.22,.22,.235,mat(0x26394b,.8,.2),0,0,0,12,Math.PI/2);
    cyl(wheel,.105,.105,.25,cyan,0,0,0,12,Math.PI/2);
    for(let j=0;j<6;j++){const a=j*Math.PI/3;box(wheel,.035,.31,.04,mat(0x6f8497,.75,.3),Math.cos(a)*.15,Math.sin(a)*.15,0,0,0,a)}
    wheel.userData.spin=true;
  }
}
box(car,.12,.18,1.3,cyan,-1.7,.42,0);
for(let s of [-1,1]){box(car,.32,.07,.28,pink,-1.65,.48,s*.45);box(car,.27,.06,.22,white,1.63,.52,s*.45)}
box(car,1.0,.1,.12,mat(0x05080f,.7,.2),-1.45,.83,0,0,0,.05);
line(car,[[-1.8,.4,-.7],[-1.3,.35,-.9],[0,.3,-.9],[1.4,.48,-.75]],cyan,.025);
line(car,[[-1.8,.4,.7],[-1.3,.35,.9],[0,.3,.9],[1.4,.48,.75]],cyan,.025);

// Floor / runway
const floor=new THREE.Mesh(new THREE.PlaneGeometry(200,200),mat(0x080d1a,.35,.65));floor.rotation.x=-Math.PI/2;floor.position.y=-.08;floor.receiveShadow=true;scene.add(floor);
const grid=new THREE.GridHelper(180,90,0x1a7c91,0x14223b);grid.position.y=-.055;scene.add(grid);
for(let i=0;i<22;i++){
  const z=-28+i*2.8;
  box(scene, .035,.025,1.1, i%2?cyan:pink,-2.8,-.035,z);
  box(scene, .035,.025,1.1, i%2?pink:cyan,2.8,-.035,z);
}
// Futuristic skyline
const buildings=new THREE.Group();scene.add(buildings);
for(let i=0;i<48;i++){
  const side=i%2?1:-1, z=-30+Math.random()*42, x=side*(6+Math.random()*13), h=1.8+Math.random()*9, w=.7+Math.random()*2.2, d=.8+Math.random()*2;
  const b=box(buildings,w,h,d,mat(i%3===0?0x10283c:0x0a1426,.55,.4),x,h/2-.05,z);
  for(let k=0;k<3;k++){box(buildings,w*.72,.025,.025,k%2?cyan:pink,x,h*(.2+k*.23),z+d/2+.02)}
  if(i%4===0){const antenna=cyl(buildings,.025,.025,1.2,cyan,x,h+.55,z,6);antenna.material=cyan}
}
const ringGroup=new THREE.Group();scene.add(ringGroup);
for(let i=0;i<4;i++){const ring=new THREE.Mesh(new THREE.TorusGeometry(5.8+i*.85,.025,8,100),i%2?pink:cyan);ring.rotation.x=Math.PI/2;ring.position.set(0,.04+i*.01,-12-i*5);ringGroup.add(ring)}

// Portal islands for the second world
const zones=[
 {name:'RACING ZONE',icon:'🏁',desc:'Push past the limit.',color:0x25eaff,detail:'Speed, precision, and pure adrenaline.',games:[['NEON SPRINT','Arcade racing'],['DRIFT CITY','Drift challenge'],['HIGHWAY RUSH','Endless driving'],['TURBO TRIAL','Time attack']]},
 {name:'ROBOT ZONE',icon:'🤖',desc:'Power up. Stand tall.',color:0xff398e,detail:'Enter a world of machines and mighty battles.',games:[['MECH ARENA','Robot battle'],['STEEL TITAN','Action adventure'],['ROBO DEFENCE','Defend the core'],['CYBER DUEL','One-on-one combat']]},
 {name:'ACTION ZONE',icon:'⚡',desc:'Make every move count.',color:0xffb74a,detail:'Quick reflexes. Big moments.',games:[['SHADOW RUN','Action runner'],['NIGHT OPS','Tactical challenge'],['SKY BREAKER','Arcade action'],['LASER RAID','Survival']]},
 {name:'PUZZLE ZONE',icon:'🧩',desc:'Outsmart the impossible.',color:0x8d7bff,detail:'Find the pattern. Crack the code.',games:[['MIND GRID','Logic puzzle'],['BLOCK SHIFT','Block puzzle'],['PORTAL 9','Spatial challenge'],['CODE BREAKER','Brain teaser']]},
 {name:'ARCADE ZONE',icon:'🕹️',desc:'Classic fun. New energy.',color:0x7cff80,detail:'Small games. Huge high scores.',games:[['SNAKE REBOOT','Classic arcade'],['PIXEL BLAST','Retro shooter'],['JUMP QUEST','Platformer'],['ORBIT BALL','Skill game']]}
];
const islands=new THREE.Group();scene.add(islands);
const zoneObjects=[];
zones.forEach((z,i)=>{
  const g=new THREE.Group();g.position.set((i-2)*5.1,0,-8-Math.abs(i-2)*1.2);g.rotation.y=(i-2)*-.12;islands.add(g);
  const platform=new THREE.Mesh(new THREE.CylinderGeometry(1.75,2.15,.3,8),mat(0x111d30,.6,.3));platform.position.y=.05;g.add(platform);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(1.9,.045,8,60),new THREE.MeshStandardMaterial({color:z.color,emissive:z.color,emissiveIntensity:2}));ring.rotation.x=Math.PI/2;ring.position.y=.23;g.add(ring);
  const pillar=box(g,.75,1.8,.75,mat(0x162a3e,.7,.22),0,1.08,0);
  const orb=new THREE.Mesh(new THREE.IcosahedronGeometry(.62,1),new THREE.MeshStandardMaterial({color:z.color,metalness:.55,roughness:.18,emissive:z.color,emissiveIntensity:1.8,wireframe:i%2===1}));orb.position.y=2.55;g.add(orb);
  const halo=new THREE.Mesh(new THREE.TorusGeometry(1.05,.025,8,60),new THREE.MeshStandardMaterial({color:z.color,emissive:z.color,emissiveIntensity:2}));halo.position.y=2.55;halo.rotation.x=Math.PI/2.7;g.add(halo);
  for(let j=0;j<4;j++){const shard=new THREE.Mesh(new THREE.OctahedronGeometry(.16),new THREE.MeshStandardMaterial({color:z.color,emissive:z.color,emissiveIntensity:1.5}));shard.position.set(Math.cos(j*Math.PI/2)*1.2,1.4+Math.sin(j*2)*.25,Math.sin(j*Math.PI/2)*1.2);g.add(shard)}
  zoneObjects.push({group:g,orb,halo,platform,zone:z,index:i});
});

// Distant stars
const starGeo=new THREE.BufferGeometry(), starPos=[];
for(let i=0;i<850;i++)starPos.push((Math.random()-.5)*100,Math.random()*32-2,-Math.random()*100);
starGeo.setAttribute('position',new THREE.Float32BufferAttribute(starPos,3));
scene.add(new THREE.Points(starGeo,new THREE.PointsMaterial({color:0x93cfff,size:.055,transparent:true,opacity:.8})));

let mode='entry',selected=0,targetYaw=0,currentYaw=0,targetPitch=0,currentPitch=0,scrollOffset=0,dragging=false,lastX=0,lastY=0,startX=0,startY=0,moved=false;
const entry=document.querySelector('#entry'),universe=document.querySelector('#universe');
const enterBtn=document.querySelector('#enterBtn'), zoneCard=document.querySelector('#zoneCard');
function setMode(next){
 mode=next;entry.classList.toggle('active',next==='entry');universe.classList.toggle('active',next==='universe');
 if(next==='universe'){camera.position.set(0,5.3,16);targetYaw=0;targetPitch=0;scrollOffset=0;updateZone(0)}
}
function updateZone(i){
 selected=(i+zones.length)%zones.length;const z=zones[selected];
 document.querySelector('#zoneIndex').textContent=`ZONE ${String(selected+1).padStart(2,'0')}`;
 document.querySelector('#zoneIcon').textContent=z.icon;document.querySelector('#zoneTitle').textContent=z.name;document.querySelector('#zoneDesc').textContent=z.desc;
 document.querySelector('#zoneCount').textContent=`${String(selected+1).padStart(2,'0')} / ${String(zones.length).padStart(2,'0')}`;
 zoneObjects.forEach((o,j)=>{o.group.visible=true;o.group.scale.setScalar(j===selected?1.12:.82);o.group.position.x=(j-selected)*5.2;});
}
enterBtn.addEventListener('click',()=>{setMode('universe');camera.position.set(0,5.3,16)});
document.querySelector('#brand').addEventListener('click',e=>{e.preventDefault();setMode('entry')});
document.querySelector('#prevZone').addEventListener('click',()=>updateZone(selected-1));
document.querySelector('#nextZone').addEventListener('click',()=>updateZone(selected+1));
document.querySelector('#openZone').addEventListener('click',()=>{
 const z=zones[selected];document.querySelector('#modalTitle').textContent=z.name;document.querySelector('#modalDesc').textContent=z.detail;
 const list=document.querySelector('#gameList');list.innerHTML='';
 z.games.forEach(([name,desc])=>{const b=document.createElement('button');b.className='game-tile';b.innerHTML=`<b>${name}</b><span>${desc}</span>`;b.addEventListener('click',()=>{b.querySelector('span').textContent='Game slot ready — add a playable HTML5 game';b.style.borderColor='#52f6ff'});list.appendChild(b)});
 document.querySelector('#gameModal').classList.add('open');document.querySelector('#gameModal').setAttribute('aria-hidden','false');
});
function closeModal(){document.querySelector('#gameModal').classList.remove('open');document.querySelector('#gameModal').setAttribute('aria-hidden','true')}
document.querySelector('#closeModal').addEventListener('click',closeModal);
document.querySelector('#gameModal').addEventListener('click',e=>{if(e.target.id==='gameModal')closeModal()});
document.querySelector('#soundBtn').addEventListener('click',()=>{const b=document.querySelector('#soundBtn b');b.textContent=b.textContent==='OFF'?'ON':'OFF'});

// Pointer controls: mouse drag and touch drag both rotate the camera/world.
canvas.addEventListener('pointerdown',e=>{dragging=true;moved=false;lastX=startX=e.clientX;lastY=startY=e.clientY;canvas.setPointerCapture?.(e.pointerId)});
canvas.addEventListener('pointermove',e=>{if(!dragging)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;if(Math.abs(e.clientX-startX)+Math.abs(e.clientY-startY)>5)moved=true;targetYaw+=dx*.004;targetPitch=Math.max(-.16,Math.min(.24,targetPitch+dy*.0015));lastX=e.clientX;lastY=e.clientY});
canvas.addEventListener('pointerup',()=>{dragging=false});
canvas.addEventListener('pointercancel',()=>{dragging=false});
window.addEventListener('wheel',e=>{if(mode==='universe'){scrollOffset+=Math.sign(e.deltaY)*.65;updateZone(Math.round(selected+Math.sign(e.deltaY)));}else{targetYaw+=e.deltaY*.0006}}, {passive:true});
let touchStart=0;
window.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();if(mode==='universe'&&e.key==='ArrowRight')updateZone(selected+1);if(mode==='universe'&&e.key==='ArrowLeft')updateZone(selected-1);if(e.key==='Enter'&&mode==='entry')setMode('universe')});

const boot=document.querySelector('#boot');
window.setTimeout(()=>boot.classList.add('done'),1350);
function animate(){
 requestAnimationFrame(animate);const t=clock.getElapsedTime();
 currentYaw+=(targetYaw-currentYaw)*.045;currentPitch+=(targetPitch-currentPitch)*.045;
 car.position.y=-.18+Math.sin(t*1.2)*.045;car.rotation.y=-.18+Math.sin(t*.24)*.05+currentYaw*.16;
 car.rotation.x=Math.sin(t*.5)*.012;
 car.children.forEach(c=>{if(c.userData.spin)c.rotation.x=t*2.8});
 pinkLight.intensity=36+Math.sin(t*2.2)*10;cyanLight.intensity=48+Math.sin(t*1.7+1)*12;
 ringGroup.rotation.z=Math.sin(t*.12)*.04;
 zoneObjects.forEach((o,i)=>{o.orb.rotation.y=t*(.25+i*.035);o.orb.rotation.x=Math.sin(t*.6+i)*.15;o.orb.position.y=2.55+Math.sin(t*1.3+i)*.12;o.halo.rotation.z=t*.25+i;o.group.position.y=Math.sin(t*.7+i)*.08});
 if(mode==='entry'){
   const desiredX=1.0+currentYaw*2.0, desiredY=4.0+currentPitch*4;
   camera.position.x+=(desiredX-camera.position.x)*.035;camera.position.y+=(desiredY-camera.position.y)*.035;
   camera.lookAt(.2,.65,-2.3);
 }else{
   const desiredX=currentYaw*3.2,desiredY=5.1+currentPitch*5;
   camera.position.x+=(desiredX-camera.position.x)*.035;camera.position.y+=(desiredY-camera.position.y)*.035;
   camera.position.z+= (15.5-camera.position.z)*.035;
   camera.lookAt(currentYaw*.45,1.1,-7.5);
 }
 renderer.render(scene,camera);
}
animate();
window.addEventListener('resize',()=>{camera.aspect=window.innerWidth/window.innerHeight;camera.updateProjectionMatrix();renderer.setSize(window.innerWidth,window.innerHeight);renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.65))});
