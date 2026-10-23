const G=[
{t:'Space Shooter',c:'Shooting',e:'🚀',d:'Blast waves of neon invaders. Drag to move, your ship auto-fires.',u:'space-shooter.html',o:1},
{t:'Neon Racer',c:'Racing',e:'🏎️',d:'Dodge traffic on a glowing highway. Tap left or right to change lanes.',u:'neon-racer.html',o:1},
{t:'Adventure Quest',c:'Adventure',e:'🗝️',d:'Find three keys, dodge the guardians and escape through the vault door.',u:'adventure.html',o:1},
{t:'Google Snake',c:'Arcade',e:'🐍',d:'The classic snake game, eat and grow.',u:'https://www.google.com/fbx?fbx=snake_arcade'},
{t:'2048',c:'Puzzle',e:'🔢',d:'Slide and merge tiles to reach 2048.',u:'https://play2048.co/'},
{t:'Hextris',c:'Puzzle',e:'🔷',d:'Fast hexagon puzzle that tests your reflexes.',u:'https://hextris.io/'},
{t:'Quick Draw',c:'Casual',e:'🎨',d:'Draw and see if the AI can guess it.',u:'https://quickdraw.withgoogle.com/'},
{t:'Chrome Dino',c:'Arcade',e:'🦖',d:'Run and jump over cacti as far as you can.',u:'https://chromedino.com/'},
{t:'Little Alchemy 2',c:'Puzzle',e:'🧪',d:'Combine elements to discover new things.',u:'https://littlealchemy2.com/'},
{t:'Minesweeper',c:'Puzzle',e:'💣',d:'Clear the board without hitting a mine.',u:'https://minesweeper.online/'},
{t:'Solitaire',c:'Casual',e:'🃏',d:'Classic card solitaire.',u:'https://solitaired.com/'},
{t:'Basketball Stars',c:'Action',e:'🏀',d:'One-on-one basketball action.',u:'https://www.basketballstars.com/'},
{t:'Tetris',c:'Puzzle',e:'🧱',d:'Stack falling blocks and clear lines.',u:'https://tetris.com/play-tetris'},
{t:'Cut the Rope',c:'Puzzle',e:'🍬',d:'Physics puzzle: feed candy to Om Nom.',u:'https://www.cuttherope.net/'},
{t:'Pac-Man',c:'Arcade',e:'👾',d:'Eat the dots and escape the ghosts.',u:'https://www.google.com/logos/2010/pacman10-i.html'}];
const $=i=>document.getElementById(i),grid=$('grid'),q=$('q'),chips=$('chips');let cat='All';
const cats=['All',...['Action','Shooting','Racing','Adventure','Puzzle','Arcade','Casual'].filter(c=>G.some(g=>g.c==c))];
chips.innerHTML=cats.map(c=>`<button class="chip${c=='All'?' on':''}" data-c="${c}">${c}</button>`).join('');
function mark(){chips.querySelectorAll('.chip').forEach(n=>n.classList.toggle('on',n.dataset.c==cat))}
function draw(){const s=q.value.trim().toLowerCase(),L=G.filter(g=>(cat=='All'||g.c==cat)&&(g.t+' '+g.d+' '+g.c).toLowerCase().includes(s));
grid.innerHTML=L.map((g,i)=>`<article class="card reveal"><div class="th" style="background:linear-gradient(135deg,hsl(${[190,270,320][i%3]} 80% 28%),#0d1030)">${g.e}</div><span class="tag">${g.c}${g.o?' · Plays offline':''}</span><h3>${g.t}</h3><p>${g.d}</p><a class="btn" href="${g.u}"${g.o?'':' target="_blank" rel="noopener"'}>Play Now</a></article>`).join('');
$('count').textContent=L.length+' of '+G.length+' games';$('empty').hidden=!!L.length;revealAll()}
chips.onclick=e=>{const b=e.target.closest('.chip');if(b){cat=b.dataset.c;mark();draw()}};
q.oninput=draw;$('clear').onclick=()=>{q.value='';cat='All';mark();draw()};draw();
