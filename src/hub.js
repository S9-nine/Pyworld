/* ───────── Main screen (the arcade) ─────────
   Where players land after picking their hero: the hero on a spotlit pedestal with their stats, a pixel
   TV on a console playing Bug Dash (a tiny endless runner), and one cartridge per course. Python's
   cartridge (or Continue) slides into the console and opens the game; future courses say "soon".
   Also here: a sample of the planned sign-in screen (Profile → DEV). */
const HS_PAL = { k: "#1a1c2c", g: "#38b764", y: "#a7f070", w: "#f4f4f4", r: "#b13e53", b: "#3b5dc9", B: "#41a6f6", t: "#257179", o: "#ef7d57", s: "#566c86" };
const HS_ART = {
  // A friendly pixel snake for Python (not the official Python logo).
  snake: ["....kkkkkk....", "...kggggggk...", "..kgwkggwkgk..", "..kggggggggk..", "..kggyyyyggk..", "...kggggggk.rr", "....kkggkk.r..",
          "..kkkggggkkk..", ".kgggggyyggggk", ".kgyyggggggyyk", "..kkggggggggk.", "....kkkkkkkk.."],
  barrel: ["..kkkkkkkk..", ".kbbbbbbbbk.", "kbBBBBBBBBbk", ".kbbbbbbbbk.", "kbkkkkkkkkbk", "kbBBBBBBBBbk", "kbkkkkkkkkbk", "kbBBBBBBBBbk", ".kbbbbbbbbk.", "..kkkkkkkk.."],
  globe: ["...kkkkkk...", "..kbbggbbk..", ".kbggggbbbk.", "kbbgggbbbbbk", "kbbbggbbgggk", "kbbbbbbggggk", "kbgggbbbgggk", "kbbggggbbbbk", ".kbbgggbbbk.", "..kbbbbbbk..", "...kkkkkk..."]
};
const hsArt = (name) => { const rows = HS_ART[name], w = rows[0].length; return `<svg viewBox="-1 -1 ${w + 2} ${rows.length + 2}" shape-rendering="crispEdges" aria-hidden="true">${PX.sprite(rows, 0, 0, 1, HS_PAL)}</svg>`; };
const HS_COURSES = [
  { id: "python", name: "Python", line: "From your first print() to interview practice", art: "snake", shell: "#38b764", live: true },
  { id: "sql", name: "SQL & Data", line: "Ask questions of real data", art: "barrel", shell: "#3b5dc9", live: false },
  { id: "web", name: "JavaScript & Web", line: "Build pages people can click", art: "globe", shell: "#8e4fc9", live: false }
];
function hsData() {
  const h = S.hero || blankHero("Asha", 0, 1);
  const cleared = LEVELS.filter((l) => levelClear(l.id)).length, nx = LEVELS.find((l) => !levelClear(l.id));
  const { r, next } = rankFor(h.xp);
  const xpPct = next ? Math.round(((h.xp - r.xp) / (next.xp - r.xp)) * 100) : 100;
  return { h, cleared, total: LEVELS.length, nx, rank: r.name, xpPct, streak: liveStreak(h), today: Math.min(100, Math.round(((h.days || {})[today()] || 0) / DAILY_GOAL * 100)) };
}
function hsOpen(kind, title, html) {
  hsClose();
  const o = document.createElement("div");
  o.className = "hs hs-" + kind;
  o.innerHTML = `<div class="hs-bar"><span>${esc(title)}</span><button class="hs-x" type="button" aria-label="Close sample">×</button></div>${html}`;
  document.body.appendChild(o);
  document.body.classList.add("hs-on");
  $(".hs-x", o).addEventListener("click", hsClose);
  return o;
}
function hsClose() {
  if ($(".hs .scene") && sceneRaf) { cancelAnimationFrame(sceneRaf); sceneRaf = null; }
  $$(".hs").forEach((x) => x.remove());
  document.body.classList.remove("hs-on");
}

/* ── Bug Dash: a tiny endless runner on the TV ──
   Your hero runs; jump over bugs (tap, click, Space or ↑). Until you tap, it plays itself as a demo.
   Drawn on a 160×72 canvas and scaled up, so every pixel stays crisp. Best score is kept on this device. */
const DASH_FONT = {
  0: ["111", "101", "101", "101", "111"], 1: ["010", "110", "010", "010", "111"], 2: ["111", "001", "111", "100", "111"], 3: ["111", "001", "111", "001", "111"],
  4: ["101", "101", "111", "001", "001"], 5: ["111", "100", "111", "001", "111"], 6: ["111", "100", "111", "101", "111"], 7: ["111", "001", "010", "010", "010"],
  8: ["111", "101", "111", "101", "111"], 9: ["111", "101", "111", "001", "111"], A: ["010", "101", "111", "101", "101"], B: ["110", "101", "110", "101", "110"],
  C: ["011", "100", "100", "100", "011"], D: ["110", "101", "101", "101", "110"], E: ["111", "100", "110", "100", "111"], G: ["011", "100", "101", "101", "011"],
  H: ["101", "101", "111", "101", "101"], I: ["111", "010", "010", "010", "111"], L: ["100", "100", "100", "100", "111"], O: ["010", "101", "101", "101", "010"],
  P: ["110", "101", "110", "100", "100"], R: ["110", "101", "110", "101", "101"], S: ["011", "100", "010", "001", "110"], T: ["111", "010", "010", "010", "010"],
  U: ["101", "101", "101", "101", "111"], Y: ["101", "101", "010", "010", "010"], "!": ["010", "010", "010", "000", "010"], "·": ["000", "000", "010", "000", "000"]
};
const BUG_ROWS = [["..k..k..", "...kk...", ".krrrrk.", "krwkkwrk", "krrrrrrk", ".k.kk.k."], ["..k..k..", "...kk...", ".krrrrk.", "krwkkwrk", "krrrrrrk", "k.k..k.k"]];
function bugDash(canvas, pix, { onBest } = {}) {
  const W = 160, H = 72, GROUND = 58, ctx = canvas.getContext("2d");
  canvas.width = W; canvas.height = H; ctx.imageSmoothingEnabled = false;
  const sp = SPRITES[((pix | 0) % SPRITES.length + SPRITES.length) % SPRITES.length], pal = Object.assign({}, PIX_BASE, sp.pal);
  const paint = (rows, colors) => { const c = document.createElement("canvas"); c.width = rows[0].length; c.height = rows.length; const g = c.getContext("2d");
    rows.forEach((r, y) => [...r].forEach((ch, x) => { if (ch !== "." && colors[ch]) { g.fillStyle = colors[ch]; g.fillRect(x, y, 1, 1); } })); return c; };
  const hero = paint(sp.rows, pal);
  const bugs = [BUG_ROWS.map((r) => paint(r, { k: "#1a1c2c", r: "#b13e53", w: "#f4f4f4" })), BUG_ROWS.map((r) => paint(r, { k: "#1a1c2c", r: "#38b764", w: "#f4f4f4" }))];
  const stars = Array.from({ length: 14 }, () => [Math.random() * W, Math.random() * 40]);
  let best = +(lsGet("cq.bugdash.best") || 0), mode = "demo", raf = 0, t = 0, stopped = false;
  let y, vy, speed, dist, obs, nextGap;
  const reset = () => { y = GROUND; vy = 0; speed = 1.3; dist = 0; obs = []; nextGap = 60; };
  const jump = () => { if (y >= GROUND) vy = -3.4; };
  const press = () => { if (mode === "play") jump(); else { reset(); mode = "play"; jump(); } };
  canvas.addEventListener("pointerdown", (e) => { e.preventDefault(); press(); });
  canvas.addEventListener("keydown", (e) => { if ([" ", "ArrowUp", "Enter"].includes(e.key)) { e.preventDefault(); press(); } });
  // Text in a tiny 3×5 pixel font, so it stays as crisp as the sprites when the screen is scaled up.
  const text = (s, cx, top, color = "#ffcd75", k = 1) => {
    const w = s.length * 4 * k - k;
    for (const [dx, col] of [[k, "#1a1c2c"], [0, color]]) {
      ctx.fillStyle = col;
      [...s.toUpperCase()].forEach((ch, i) => (DASH_FONT[ch] || []).forEach((row, ry) => [...row].forEach((b, rx) => {
        if (b === "1") ctx.fillRect(Math.round(cx - w / 2) + (i * 4 + rx) * k + dx, top + ry * k + dx, k, k);
      })));
    }
  };
  const step = () => {
    if (stopped || !document.body.contains(canvas)) return;
    t++;
    if (mode !== "over") {
      dist += speed; speed = Math.min(3.2, 1.3 + dist / 2500);
      vy += 0.2; y = Math.min(GROUND, y + vy); if (y >= GROUND) vy = 0;
      nextGap -= speed;
      if (nextGap <= 0) { obs.push({ x: W + 4, kind: Math.random() < 0.5 ? 0 : 1 }); if (Math.random() < 0.2) obs.push({ x: W + 14, kind: 1 }); nextGap = 55 + Math.random() * 70 + speed * 10; }
      obs.forEach((o) => { o.x -= speed; }); obs = obs.filter((o) => o.x > -10);
      if (mode === "demo" && obs.some((o) => o.x > 26 && o.x < 26 + 10 + speed * 3)) jump();
      if (obs.some((o) => o.x < 32 && o.x + 8 > 22 && y > GROUND - 6)) {
        if (mode === "demo") { reset(); } else { mode = "over"; const sc = Math.floor(dist / 10); if (sc > best) { best = sc; lsSet("cq.bugdash.best", best); if (onBest) onBest(best); } }
      }
    }
    // Draw: night sky, stars, scrolling ground, hero, bugs, score.
    ctx.fillStyle = "#1a1c2c"; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#29366f"; ctx.fillRect(0, 40, W, GROUND - 40 + 1);
    stars.forEach(([sx, sy], i) => { ctx.fillStyle = (t / 20 + i) % 7 < 1 ? "#f4f4f4" : "#566c86"; ctx.fillRect(Math.floor((sx - dist * 0.05) % W + W) % W, sy, 1, 1); });
    ctx.fillStyle = "#38b764"; ctx.fillRect(0, GROUND + 1, W, 2);
    ctx.fillStyle = "#257179"; ctx.fillRect(0, GROUND + 3, W, H - GROUND);
    ctx.fillStyle = "#1a1c2c"; for (let gx = -(dist % 12); gx < W; gx += 12) ctx.fillRect(Math.floor(gx), GROUND + 6, 4, 1);
    const bob = y >= GROUND && mode !== "over" ? (Math.floor(t / 6) % 2) : 0;
    ctx.drawImage(hero, 22, Math.floor(y) - 12 + 1 - bob);
    obs.forEach((o) => ctx.drawImage(bugs[o.kind][Math.floor(t / 8) % 2], Math.floor(o.x), GROUND - 5));
    const score = Math.floor(dist / 10);
    text(String(score).padStart(4, "0"), W - 14, 4, "#f4f4f4"); text(`HI ${best}`, W - 44, 4, "#94b0c2");
    if (mode === "demo" && Math.floor(t / 30) % 2 === 0) text("TAP TO PLAY", W / 2, 24, "#ffcd75", 2);
    if (mode === "over") { text("BUGGED!", W / 2, 16, "#ff4a4a", 2); text(`SCORE ${score} · TAP TO RETRY`, W / 2, 32, "#ffcd75"); }
    raf = requestAnimationFrame(step);
  };
  reset(); raf = requestAnimationFrame(step);
  return { stop() { stopped = true; cancelAnimationFrame(raf); }, best: () => best };
}

let hubGame = null;
function renderHub(v) {
  if (hubGame) hubGame.stop();
  const d = hsData();
  v.innerHTML = `<section class="hub"><div class="b2">
    <aside class="b2-hero">
      <div class="b2-stage"><span class="b2-spot"></span><div class="b2-actor">${heroActorSvg(d.h.pix)}</div><span class="b2-pedestal"></span></div>
      <div class="b2-plate"><b>${esc(d.h.name)}</b><span>${esc(d.rank)} · ${d.h.xp} XP</span><span class="b2-xp"><i style="width:${d.xpPct}%"></i></span></div>
      <div class="b2-leds"><span>${ICON.flame}<b>${String(d.streak).padStart(2, "0")}</b><small>streak</small></span><span>${ICON.star}<b>${String(d.h.stars | 0).padStart(2, "0")}</b><small>stars</small></span><span><b>${d.today}%</b><small>today</small></span></div>
    </aside>
    <section class="b2-arcade">
      <div class="b2-tv"><div class="b2-bezel"><canvas class="b2-screen" tabindex="0" aria-label="Bug Dash mini-game. Press Space or tap to jump."></canvas><span class="b2-glare"></span><span class="b2-flash"></span></div>
        <div class="b2-tv-foot"><span class="b2-knob"></span><span class="b2-tv-name">BUG DASH · <span class="b2-best">HI ${+(lsGet("cq.bugdash.best") || 0)}</span></span><span class="b2-knob"></span></div></div>
      <div class="b2-console"><span class="b2-led" id="b2Led"></span><span class="b2-slot" id="b2Slot"></span><span class="b2-brand">CQ·ONE</span></div>
      <h2 class="b2-h">Pick a cartridge</h2>
      <div class="b2-shelf">${HS_COURSES.map((c) => `<button class="b2-cart ${c.live ? "live" : "soon"}" type="button" data-course="${c.id}" style="--shell:${c.shell}">
          <span class="b2-ridges"></span><span class="b2-label"><span class="b2-art">${hsArt(c.art)}</span><b>${esc(c.name)}</b><small>${esc(c.line)}</small></span>
          <span class="b2-foot">${c.live ? `<span class="b2-prog"><i style="width:${Math.round(d.cleared / d.total * 100)}%"></i></span><span>${d.cleared}/${d.total} levels · PLAY ▸</span>` : `<span>${ICON.lock} COMING SOON</span>`}</span>
          ${c.live ? "" : `<span class="b2-wrap"></span><span class="b2-sticker">SOON</span>`}</button>`).join("")}</div>
      ${d.nx ? `<button class="hs-cont" type="button" data-course="python" data-continue="1">${ICON.play}<span><small>Continue Python</small>${esc(d.nx.world + "-" + d.nx.n)} ${esc(d.nx.title)}</span></button>` : ""}
    </section></div></section>`;
  const root = $(".hub", v);
  hubGame = bugDash($(".b2-screen", root), d.h.pix, { onBest: (b) => { $(".b2-best", root).textContent = "HI " + b; } });
  $$("[data-course]", root).forEach((b) => b.addEventListener("click", () => {
    if (b.dataset.course !== "python") return toast("That course is coming soon. Want it sooner? Tell us with Feedback!");
    const open = () => (b.dataset.continue && d.nx ? go({ name: "level", id: d.nx.id, stage: nextStageOf(d.nx.id) }) : go({ name: "map" }));
    hubInsert(root, $('.b2-cart[data-course="python"]', root), open);
  }));
}
/* The cartridge flies to the console, slides into the slot, the LED lights and the TV flickers on. */
function hubInsert(o, cart, done) {
  if (o.classList.contains("loading")) return;
  o.classList.add("loading");
  const slot = $("#b2Slot", o).getBoundingClientRect(), r = cart.getBoundingClientRect();
  const ghost = cart.cloneNode(true);
  ghost.classList.add("b2-ghost");
  Object.assign(ghost.style, { left: r.left + "px", top: r.top + "px", width: r.width + "px", height: r.height + "px" });
  document.body.appendChild(ghost);
  cart.style.visibility = "hidden";
  const dx = slot.left + slot.width / 2 - (r.left + r.width / 2), dy = slot.top - (r.top + r.height * 0.15), s = Math.min(1, (slot.width * 0.9) / r.width);
  const still = bhStill();
  const fly = ghost.animate([
    { transform: "translate(0, 0) scale(1) rotate(0)" },
    { transform: `translate(${dx}px, ${dy - 60}px) scale(${s}) rotate(-4deg)`, offset: 0.55 },
    { transform: `translate(${dx}px, ${dy - 40}px) scale(${s}) rotate(0)`, offset: 0.7 },
    { transform: `translate(${dx}px, ${dy + r.height * s * 0.7}px) scale(${s})`, clipPath: "inset(0 0 75% 0)" }
  ], { duration: still ? 1 : 1100, easing: "cubic-bezier(.3,.7,.3,1)", fill: "forwards" });
  fly.onfinish = () => {
    ghost.remove();
    $("#b2Led", o).classList.add("on");
    $(".b2-bezel", o).classList.add("power");
    setTimeout(done, still ? 0 : 650);
  };
}

/* Sign-in sample: the real title-screen scene behind it. One account per person, quick to switch on a
   shared phone, and a guest start. */
function signInSample() {
  const d = hsData();
  const o = hsOpen("l", "Sample · Sign in", `<section class="title-screen hsl-screen"><canvas class="scene" aria-hidden="true"></canvas>
    <div class="title-ui hsl">${logoHtml}
    <div class="pbox hsl-box">
      <h2 class="ptitle">Welcome back</h2>
      <button class="hsl-me" type="button">${avatarHtml(d.h, "hero")}<span><b>${esc(d.h.name)}</b><span>${esc(d.rank)} · ${d.h.xp} XP</span></span><span class="file-go">Continue ▸</span></button>
      <p class="pnote">Not you? Sign in with your own account:</p>
      <div class="hsl-opts">
        <button class="pbtn alt hsl-opt" type="button"><span class="hsl-g">G</span> Continue with Google</button>
        <button class="pbtn alt hsl-opt" type="button">✉ Email me a sign-in code</button>
        <button class="pbtn hsl-opt" type="button">▸ Try it first (no account)</button>
      </div>
      <p class="pnote hsl-small">Under 18? We'll ask a parent or guardian to confirm by email. <a href="#" data-open-legal="privacy">Privacy</a> · <a href="#" data-open-legal="terms">Terms</a></p>
    </div></div></section>`);
  startScene($(".scene", o));
  $$("[data-open-legal]", o).forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); openLegal(a.dataset.openLegal); }));
  $$(".hsl-me, .hsl-opt", o).forEach((b) => b.addEventListener("click", () => toast("Sample: sign-in isn't wired up yet.")));
}
