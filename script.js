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
  var grid = $("grid"), chipsEl = $("chips"), search = $("search"),
      count = $("count"), empty = $("empty");
  var state = { cat: "All", q: "" };
  var M = window.Motion || null;                 // Motion library (CDN); site works without it
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canAnimate = M && !reduce;

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function renderChips() {
    chipsEl.innerHTML = CATS.map(function (c) {
      return '<button class="chip" type="button" data-cat="' + c + '" aria-pressed="' + (c === state.cat) + '">' + c + "</button>";
    }).join("");
  }

  function matches(g) {
    var q = state.q.trim().toLowerCase();
    var okCat = state.cat === "All" || g.cat === state.cat;
    var okQ = !q || (g.name + " " + g.cat + " " + g.tag).toLowerCase().indexOf(q) !== -1;
    return okCat && okQ;
  }

  function renderGames(animateIn) {
    var list = GAMES.filter(matches);
    grid.innerHTML = list.map(function (g) {
      return '<a class="card" href="' + g.url + '" target="_blank" rel="noopener noreferrer" style="--h:' + g.hue + '" aria-label="Play ' + esc(g.name) + ', opens in a new tab">' +
        '<span class="icon" aria-hidden="true">' + g.icon + "</span>" +
        "<h3>" + esc(g.name) + "</h3>" +
        '<p class="meta">' + g.cat + " · " + g.tag + "</p>" +
        '<span class="play">Play now ↗</span></a>';
    }).join("");
    empty.hidden = list.length > 0;
    count.textContent = list.length + (list.length === 1 ? " game" : " games") +
      (state.cat !== "All" ? " in " + state.cat : "") + (state.q.trim() ? ' matching "' + state.q.trim() + '"' : "");
    if (canAnimate && animateIn && list.length) {
      M.animate(".card", { opacity: [0, 1], y: [18, 0] }, { delay: M.stagger(0.04), duration: 0.45, ease: "easeOut" });
    }
  }

  // Pointer spotlight on cards (mouse/pen only)
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
    state.cat = b.dataset.cat;
    renderChips();
    renderGames(true);
  });

  search.addEventListener("input", function () { state.q = search.value; renderGames(true); });

  $("clearBtn").addEventListener("click", function () {
    state.cat = "All"; state.q = ""; search.value = "";
    renderChips(); renderGames(true);
  });

  $("randomBtn").addEventListener("click", function () {
    var g = GAMES[Math.floor(Math.random() * GAMES.length)];
    window.open(g.url, "_blank", "noopener,noreferrer");
  });

  // Press "/" to jump to search (desktop)
  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && document.activeElement !== search) {
      e.preventDefault();
      search.focus();
      search.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  renderChips();
  renderGames(false);

  // One orchestrated entrance for the hero, then cards
  if (canAnimate) {
    M.animate(".pill", { opacity: [0, 1], y: [-12, 0] }, { duration: 0.5 });
    M.animate(".reveal", { opacity: [0, 1], y: [24, 0] }, { delay: M.stagger(0.12, { startDelay: 0.15 }), duration: 0.7, ease: [0.2, 0.8, 0.2, 1] });
    M.animate(".sun", { opacity: [0, 0.85], scale: [0.85, 1] }, { duration: 1.4, ease: "easeOut" });
    renderGames(true);
  }
})();
