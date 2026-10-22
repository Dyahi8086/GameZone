(function () {
  "use strict";

  // All 12 original game links, unchanged.
  var GAMES = [
    { name: "Google Snake",    icon: "🐍", cat: "Arcade", tag: "Classic",   hue: 140, url: "https://www.google.com/fbx?fbx=snake_arcade" },
    { name: "2048",            icon: "🔢", cat: "Puzzle", tag: "Numbers",   hue: 35,  url: "https://play2048.co/" },
    { name: "Hextris",         icon: "🔷", cat: "Puzzle", tag: "Reflex",    hue: 190, url: "https://hextris.io/" },
    { name: "Quick Draw",      icon: "🎨", cat: "Casual", tag: "Drawing",   hue: 330, url: "https://quickdraw.withgoogle.com/" },
    { name: "Chrome Dino",     icon: "🦖", cat: "Arcade", tag: "Runner",    hue: 25,  url: "https://chromedino.com/" },
    { name: "Little Alchemy 2",icon: "🧪", cat: "Puzzle", tag: "Discovery", hue: 270, url: "https://littlealchemy2.com/" },
    { name: "Minesweeper",     icon: "💣", cat: "Puzzle", tag: "Strategy",  hue: 350, url: "https://minesweeper.online/" },
    { name: "Solitaire",       icon: "🃏", cat: "Casual", tag: "Cards",     hue: 155, url: "https://solitaired.com/" },
    { name: "Basketball Stars",icon: "🏀", cat: "Action", tag: "Sports",    hue: 20,  url: "https://www.basketballstars.com/" },
    { name: "Tetris",          icon: "🧱", cat: "Puzzle", tag: "Blocks",    hue: 210, url: "https://tetris.com/play-tetris" },
    { name: "Cut the Rope",    icon: "🍬", cat: "Puzzle", tag: "Physics",   hue: 100, url: "https://www.cuttherope.net/" },
    { name: "Pac-Man",         icon: "👾", cat: "Arcade", tag: "Classic",   hue: 55,  url: "https://www.google.com/logos/2010/pacman10-i.html" }
  ];
  var CATS = ["All", "Arcade", "Puzzle", "Casual", "Action"];

  var $ = function (id) { return document.getElementById(id); };
  var grid = $("grid"), chipsEl = $("chips"), search = $("search"), count = $("count"), empty = $("empty");
  var hero = $("hero"), stage = $("stage"), rig = $("rig"), hint = $("hint");
  var state = { cat: "All", q: "" };
  var M = window.Motion || null;                    // Motion (CDN). Site works without it.
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canAnimate = !!M && !reduce;
  if (!canAnimate) document.documentElement.classList.add("no-motion");

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* ---------- Games: render, search, filter ---------- */
  function renderChips() {
    chipsEl.innerHTML = CATS.map(function (c) {
      return '<button class="chip" type="button" data-cat="' + c + '" aria-pressed="' + (c === state.cat) + '">' + c + "</button>";
    }).join("");
  }
  function matches(g) {
    var q = state.q.trim().toLowerCase();
    return (state.cat === "All" || g.cat === state.cat) && (!q || (g.name + " " + g.cat + " " + g.tag).toLowerCase().indexOf(q) !== -1);
  }
  function renderGames(animateIn) {
    var list = GAMES.filter(matches);
    grid.innerHTML = list.map(function (g) {
      return '<a class="card" href="' + g.url + '" target="_blank" rel="noopener noreferrer" style="--h:' + g.hue + '" aria-label="Play ' + esc(g.name) + ', opens in a new tab">' +
        '<span class="icon" aria-hidden="true">' + g.icon + "</span><h3>" + esc(g.name) + "</h3>" +
        '<p class="meta">' + g.cat + " · " + g.tag + '</p><span class="play">Play now ↗</span></a>';
    }).join("");
    empty.hidden = list.length > 0;
    count.textContent = list.length + (list.length === 1 ? " game" : " games") +
      (state.cat !== "All" ? " in " + state.cat : "") + (state.q.trim() ? ' matching "' + state.q.trim() + '"' : "");
    if (canAnimate && animateIn && list.length) {
      M.animate(".card", { opacity: [0, 1], y: [18, 0] }, { delay: M.stagger(0.04), duration: 0.45, ease: "easeOut" });
    }
  }
  grid.addEventListener("pointermove", function (e) {
    if (e.pointerType === "touch") return;
    var card = e.target.closest(".card");
    if (!card) return;
    var r = card.getBoundingClientRect();
    card.style.setProperty("--mx", (e.clientX - r.left) + "px");
    card.style.setProperty("--my", (e.clientY - r.top) + "px");
  });
  chipsEl.addEventListener("click", function (e) {
    var b = e.target.closest(".chip");
    if (!b) return;
    state.cat = b.dataset.cat; renderChips(); renderGames(true);
  });
  search.addEventListener("input", function () { state.q = search.value; renderGames(true); });
  $("clearBtn").addEventListener("click", function () {
    state.cat = "All"; state.q = ""; search.value = ""; renderChips(); renderGames(true);
  });
  $("randomBtn").addEventListener("click", function () {
    window.open(GAMES[Math.floor(Math.random() * GAMES.length)].url, "_blank", "noopener,noreferrer");
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && document.activeElement !== search && document.activeElement.tagName !== "INPUT") {
      e.preventDefault(); search.focus(); search.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  /* ---------- Tap / press feedback (Motion) ---------- */
  var pressed = null;
  document.addEventListener("pointerdown", function (e) {
    if (!canAnimate) return;
    var t = e.target.closest(".btn,.chip,.card");
    if (t) { pressed = t; M.animate(t, { scale: 0.95 }, { duration: 0.12 }); }
  });
  function release() {
    if (pressed) { M.animate(pressed, { scale: 1 }, { type: "spring", stiffness: 500, damping: 18 }); pressed = null; }
  }
  document.addEventListener("pointerup", release);
  document.addEventListener("pointercancel", release);

  /* ---------- 3D robot (pure CSS 3D, built here) ---------- */
  // Parts in "units" (1u = --u). Format: class, w, h, d, x, y, z, optional front-face HTML.
  var VISOR = '<b class="visor"><s class="eye"></s><s class="eye"></s></b>';
  var CORE = '<b class="core"></b><b class="vents"></b>';
  var PARTS = [
    ["body",  12, 11, 8,   0,  6.5, 0, CORE, '<b class="stripe"></b>'],
    ["joint",  3, 1.5, 3,  0,  0,   0],
    ["head",  12,  9, 10,  0, -5,   0, VISOR, '<b class="vents" style="top:30%;bottom:30%;height:auto"></b>'],
    ["glow",  1.6, 4, 4,  -6.8, -5, 0],
    ["glow",  1.6, 4, 4,   6.8, -5, 0],
    ["joint", 0.8, 4, 0.8, 0, -11.5, 0],
    ["pink tip", 2, 2, 2,  0, -14,  0],
    ["joint", 3.4, 3.4, 3.4, -7.8, 2.5, 0],
    ["joint", 3.4, 3.4, 3.4,  7.8, 2.5, 0],
    ["limb",  3,  8, 3,   -7.8, 8,  0],
    ["limb",  3,  8, 3,    7.8, 8,  0],
    ["glow",  3.6, 3, 3.6, -7.8, 13.2, 0],
    ["glow",  3.6, 3, 3.6,  7.8, 13.2, 0],
    ["limb",  4,  5, 4,   -3, 14.5, 0],
    ["limb",  4,  5, 4,    3, 14.5, 0],
    ["joint", 5, 1.8, 6,  -3, 17.4, 0.8],
    ["joint", 5, 1.8, 6,   3, 17.4, 0.8]
  ];
  function u(n) { return "calc(var(--u)*" + n + ")"; }
  rig.innerHTML = PARTS.map(function (p) {
    var front = p[7] || "", back = p[8] || "";
    return '<div class="cube ' + p[0] + '" style="--w:' + u(p[1]) + ";--h:" + u(p[2]) + ";--d:" + u(p[3]) +
      ";transform:translate3d(" + u(p[4]) + "," + u(p[5] - 1) + "," + u(p[6]) + ')">' +
      '<i class="fr">' + front + '</i><i class="bk">' + back + '</i><i class="lf"></i><i class="rt"></i><i class="tp"></i><i class="bt"></i></div>';
  }).join("");

  var ry = -25, intro = 0, vel = 0, AUTO = reduce ? 0 : 16;   // degrees and degrees/second
  var dragging = false, lastX = 0, lastT = 0, last = 0, raf = 0, running = false;

  function apply() { rig.style.transform = "rotateX(-7deg) rotateY(" + (ry + intro).toFixed(2) + "deg)"; }
  function tick(t) {
    if (!running) return;
    var dt = Math.min((t - last) / 1000, 0.05); last = t;
    if (!dragging) { ry += (vel + AUTO) * dt; vel *= Math.pow(0.03, dt); }
    apply();
    raf = requestAnimationFrame(tick);
  }
  function setRunning(on) {
    if (on === running) return;
    running = on; hero.classList.toggle("paused", !on);
    if (on) { last = performance.now(); raf = requestAnimationFrame(tick); } else cancelAnimationFrame(raf);
  }
  var inView = true;
  function sync() { setRunning(inView && !document.hidden); }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { inView = en[0].isIntersecting; sync(); }, { threshold: 0.05 }).observe(hero);
  }
  document.addEventListener("visibilitychange", sync);

  function hideHint() { hint.classList.add("gone"); }
  stage.addEventListener("pointerdown", function (e) {
    dragging = true; lastX = e.clientX; lastT = e.timeStamp; vel = 0;
    try { stage.setPointerCapture(e.pointerId); } catch (_) {}
    stage.classList.add("grabbing"); hideHint();
  });
  stage.addEventListener("pointermove", function (e) {
    if (!dragging) return;
    var dx = e.clientX - lastX, dtm = Math.max(e.timeStamp - lastT, 1);
    ry += dx * 0.8;
    vel = reduce ? 0 : Math.max(-700, Math.min(700, vel * 0.5 + (dx * 0.8 / dtm * 1000) * 0.5));
    lastX = e.clientX; lastT = e.timeStamp;
  });
  function endDrag() { dragging = false; stage.classList.remove("grabbing"); }
  stage.addEventListener("pointerup", endDrag);
  stage.addEventListener("pointercancel", endDrag);
  stage.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") { ry -= 15; vel = 0; hideHint(); e.preventDefault(); }
    if (e.key === "ArrowRight") { ry += 15; vel = 0; hideHint(); e.preventDefault(); }
  });

  /* ---------- Floating particles ---------- */
  if (!reduce) {
    var P = $("particles"), cols = ["#22e4ff", "#8b5cff", "#ff3d9a"], html = "";
    for (var i = 0; i < 12; i++) {
      html += '<span style="--l:' + (Math.random() * 100).toFixed(1) + "%;--s:" + (2 + Math.random() * 3).toFixed(1) + "px;--c:" + cols[i % 3] +
        ";--t:" + (7 + Math.random() * 7).toFixed(1) + "s;--dl:-" + (Math.random() * 10).toFixed(1) + 's"></span>';
    }
    P.innerHTML = html;
  }

  /* ---------- Start ---------- */
  renderChips();
  renderGames(false);
  apply();
  sync();

  if (canAnimate) {
    M.animate(".reveal", { opacity: [0, 1], y: [24, 0] }, { delay: M.stagger(0.1, { startDelay: 0.1 }), duration: 0.7, ease: [0.2, 0.8, 0.2, 1] });
    M.animate("#stage", { opacity: [0, 1] }, { duration: 0.8, delay: 0.25 });
    M.animate("#scene", { scale: [0.6, 1] }, { type: "spring", stiffness: 90, damping: 14, delay: 0.2 });
    M.animate(-200, 0, { duration: 1.8, ease: [0.2, 0.8, 0.2, 1], onUpdate: function (v) { intro = v; } });
    renderGames(true);
  }
})();
