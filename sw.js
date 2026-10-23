const N='gz-v1',F=['./','index.html','games.html','main.css','fx.js','library.js','space-shooter.html','neon-racer.html','adventure.html'];
self.addEventListener('install',e=>e.waitUntil(caches.open(N).then(c=>c.addAll(F))));
self.addEventListener('fetch',e=>{if(e.request.method!='GET')return;e.respondWith(fetch(e.request).then(r=>{const k=r.clone();caches.open(N).then(c=>c.put(e.request,k)).catch(()=>{});return r}).catch(()=>caches.match(e.request)))});
