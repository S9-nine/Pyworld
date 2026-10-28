/* ───────── Boss Hack: a surprise review event ─────────
   At a random time a countdown appears; at zero the world's boss "hacks in" with a few questions from
   levels the player cleared a while ago (being tested on older material is what makes it stick).
   For now these are design previews, started from Profile → DEV: three takeover animations to choose
   from (A Pixel Swarm, B Glitch Breach, C Corruption Spread, D = A and B mixed) and the countdown banner. */
const BOSS_ROWS = [
  "....kkkk....",
  "...kppppk...",
  "..kppppppk..",
  ".kppkkkkppk.",
  ".kpkkkkkkpk.",
  ".kpkrkkrkpk.",
  ".kpkkkkkkpk.",
  ".kppkkkkppk.",
  "kppppkkppppk",
  "kpdppppppdpk",
  "kpdpprrppdpk",
  "kpdppppppdpk",
  ".kkkk..kkkk."
];
const BOSS_PAL = { k: "#1a1c2c", p: "#5d275d", d: "#b13e53", r: "#ff4a4a" };
function bossSvg(cls = "") {
  return `<svg class="bh-boss ${cls}" viewBox="-1 -1 14 15" shape-rendering="crispEdges" aria-hidden="true">${PX.sprite(BOSS_ROWS, 0, 0, 1, BOSS_PAL)}
    <rect class="bh-eye" x="4" y="5" width="1" height="1" fill="#ff4a4a"/><rect class="bh-eye" x="7" y="5" width="1" height="1" fill="#ff4a4a"/></svg>`;
}
const bhStill = () => !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
const bhWait = (ms) => new Promise((r) => setTimeout(r, bhStill() ? 0 : ms));
async function bhType(el, text, speed = 28) {
  if (bhStill()) { el.textContent = text; return; }
  el.textContent = "";
  for (const ch of text) { el.textContent += ch; await new Promise((r) => setTimeout(r, ch === "." || ch === "?" ? speed * 6 : speed)); }
}
/* What the boss says, using the player's real progress. */
function bhLines() {
  const h = S.hero, w = currentWorld();
  const done = LEVELS.filter((l) => levelClear(l.id)).length;
  return {
    boss: w.boss || "The Gatekeeper", place: w.name,
    taunt: `Heh. ${done || "A few"} level${done === 1 ? "" : "s"} cleared, ${h.name}… but do you still REMEMBER them?`,
    deal: "3 quick questions from levels you beat a while ago. Win, and you earn bonus XP and the Firewall badge."
  };
}
/* Shared ending: the boss's words and the two choices. */
function bhOffer(o, t, cls = "") {
  const box = document.createElement("div");
  box.className = "bh-offer " + cls;
  box.innerHTML = `<p class="bh-name">${esc(t.boss)}</p><p class="bh-say" id="bhSay"></p><p class="bh-deal" hidden>${esc(t.deal)}</p>
    <div class="bh-btns" hidden><button class="btn primary bh-go" type="button">Face the boss</button><button class="btn bh-later" type="button">Not now</button></div>`;
  o.appendChild(box);
  return (async () => {
    await bhType($("#bhSay", box), t.taunt);
    $(".bh-deal", box).hidden = false; $(".bh-btns", box).hidden = false;
    $(".bh-go", box).focus();
    // Close the whole takeover, not just the box the words sit in (in B that's the terminal).
    const close = () => bhEnd(box.closest(".bh"));
    $(".bh-go", box).addEventListener("click", () => { close(); toast("Preview: this is where the boss's questions start."); });
    $(".bh-later", box).addEventListener("click", () => { close(); toast("Preview: the boss waits, and the countdown keeps running."); });
  })();
}
function bhStart(variant) {
  bhEnd();
  const o = document.createElement("div");
  o.className = "bh bh-" + variant;
  o.setAttribute("role", "dialog"); o.setAttribute("aria-modal", "true"); o.setAttribute("aria-label", "Boss Hack");
  document.body.appendChild(o);
  document.body.classList.add("bh-on");
  o.addEventListener("keydown", (e) => { if (e.key === "Escape") bhEnd(o); });
  return o;
}
function bhEnd(o) {
  (o ? [o] : $$(".bh")).forEach((x) => x.remove());
  document.body.classList.remove("bh-on", "bh-shake");
}

/* Red squares fly in and snap together into the boss, one square per pixel of the sprite. They start at
   the screen edges (A) or scattered across the screen like static (D). Resolves once the boss is formed. */
async function bhFormBoss(o, x0, y0, px, from = "edges", hold = 250) {
  const host = document.createElement("div"); host.className = "bh-swarm-host"; o.appendChild(host);
  const bits = [];
  BOSS_ROWS.forEach((row, j) => [...row].forEach((ch, i) => {
    if (ch === ".") return;
    const b = document.createElement("i");
    const side = Math.floor(Math.random() * 4);
    const sx = from === "scatter" ? Math.random() * innerWidth : side === 0 ? -40 : side === 1 ? innerWidth + 40 : Math.random() * innerWidth;
    const sy = from === "scatter" ? Math.random() * innerHeight : side === 2 ? -40 : side === 3 ? innerHeight + 40 : Math.random() * innerHeight;
    const tx = x0 + i * px, ty = y0 + j * px;
    b.style.cssText = `left:${tx}px;top:${ty}px;width:${px}px;height:${px}px;transform:translate(${sx - tx}px,${sy - ty}px) rotate(${Math.random() * 180 - 90}deg);transition-delay:${(Math.random() * 0.7).toFixed(2)}s`;
    b.dataset.c = BOSS_PAL[ch];
    host.appendChild(b); bits.push(b);
  }));
  if (from === "scatter") host.classList.add("static");
  await bhWait(hold);
  host.classList.remove("static");
  bits.forEach((b) => { b.style.transform = "none"; });
  await bhWait(1500);
  bits.forEach((b) => { b.style.background = b.dataset.c; });
  host.classList.add("formed");
  const eyes = document.createElement("div"); eyes.className = "bh-swarm-eyes";
  eyes.style.cssText = `left:${x0 + 4 * px}px;top:${y0 + 5 * px}px;--px:${px}px`;
  o.appendChild(eyes);
}
const bhPx = () => Math.max(9, Math.min(16, Math.floor(Math.min(innerWidth, innerHeight) / 34)));

/* A · Pixel Swarm: red squares fly in from every edge and snap together into the boss. */
async function bossHackSwarm() {
  const o = bhStart("swarm"), t = bhLines();
  const px = bhPx(), x0 = (innerWidth - 12 * px) / 2, y0 = Math.max(70, innerHeight * 0.2);
  await bhFormBoss(o, x0, y0, px, "edges");
  await bhWait(500);
  const offer = bhOffer(o, t, "swarm");
  $(".bh-offer", o).style.top = (y0 + 14 * px) + "px";
  return offer;
}

/* B · Glitch Breach: the screen glitches and shakes, red static flickers, and a hacked terminal drops in. */
async function bossHackGlitch() {
  const o = bhStart("glitch"), t = bhLines();
  o.innerHTML = `<div class="bh-scan"></div>${Array.from({ length: 6 }, (_, i) => `<div class="bh-slice" style="top:${8 + i * 15 + Math.random() * 6}%;height:${2 + Math.random() * 6}%;animation-delay:${(Math.random() * 0.4).toFixed(2)}s"></div>`).join("")}
    <div class="bh-static">${Array.from({ length: 70 }, () => { const s = 4 + Math.floor(Math.random() * 16); return `<i style="left:${Math.random() * 100}%;top:${Math.random() * 100}%;width:${s}px;height:${s}px;animation-delay:${(Math.random() * 1.2).toFixed(2)}s"></i>`; }).join("")}</div>`;
  document.body.classList.add("bh-shake");
  await bhWait(1300);
  document.body.classList.remove("bh-shake");
  const term = document.createElement("div");
  term.className = "bh-term";
  term.innerHTML = `<div class="bh-term-bar"><i></i><i></i><i></i><span>boss.exe</span></div>
    <div class="bh-term-body"><div class="bh-term-boss">${bossSvg()}</div><pre class="bh-term-log" id="bhLog"></pre></div>`;
  o.appendChild(term);
  await bhWait(450);
  await bhType($("#bhLog", term), `> WARNING: intrusion detected\n> ${t.boss.toUpperCase()} has hacked ${t.place}\n> planting bugs in your old levels...`, 22);
  await bhWait(300);
  return bhOffer(term, t, "glitch");
}

/* C · Corruption Spread: dark tiles infect the screen from a corner, then a red portal opens and the boss rises. */
async function bossHackCorrupt() {
  const o = bhStart("corrupt"), t = bhLines();
  const size = innerWidth < 640 ? 30 : 40, cols = Math.ceil(innerWidth / size), rows = Math.ceil(innerHeight / size);
  const grid = document.createElement("div"); grid.className = "bh-grid";
  grid.style.gridTemplateColumns = `repeat(${cols}, ${size}px)`;
  const far = Math.hypot(cols, rows);
  let html = "";
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
    const d = Math.hypot(cols - x, y) / far;
    html += `<i style="animation-delay:${(d * 1.3 + Math.random() * 0.25).toFixed(2)}s"></i>`;
  }
  grid.innerHTML = html;
  o.appendChild(grid);
  await bhWait(1800);
  const portal = document.createElement("div");
  portal.className = "bh-portal";
  portal.innerHTML = `<div class="bh-ring"></div><div class="bh-rise">${bossSvg()}</div>`;
  o.appendChild(portal);
  await bhWait(1300);
  return bhOffer(o, t, "corrupt");
}

/* D · Breach + Swarm (A and B mixed): the screen glitches and red static flickers, the static flies
   together into the boss, then the hacked terminal slams in underneath and types its warning. */
async function bossHackMix() {
  const o = bhStart("mix"), t = bhLines();
  o.innerHTML = `<div class="bh-scan"></div>${Array.from({ length: 6 }, (_, i) => `<div class="bh-slice" style="top:${8 + i * 15 + Math.random() * 6}%;height:${2 + Math.random() * 6}%;animation-delay:${(Math.random() * 0.4).toFixed(2)}s"></div>`).join("")}`;
  document.body.classList.add("bh-shake");
  const px = Math.max(8, Math.min(14, Math.floor(Math.min(innerWidth, innerHeight) / 40)));
  const x0 = (innerWidth - 12 * px) / 2, y0 = Math.max(56, innerHeight * 0.08);
  await bhWait(200);
  const formed = bhFormBoss(o, x0, y0, px, "scatter", 1300);   // static flickers, then flies together
  await bhWait(1500);
  document.body.classList.remove("bh-shake");
  await formed;
  const term = document.createElement("div");
  term.className = "bh-term";
  term.style.top = (y0 + 13 * px + 22) + "px";
  term.innerHTML = `<div class="bh-term-bar"><i></i><i></i><i></i><span>boss.exe</span></div><pre class="bh-term-log" id="bhLog"></pre>`;
  o.appendChild(term);
  await bhWait(400);
  await bhType($("#bhLog", term), `> WARNING: intrusion detected\n> ${t.boss.toUpperCase()} has hacked ${t.place}\n> planting bugs in your old levels...`, 22);
  await bhWait(300);
  return bhOffer(term, t, "glitch");
}

/* The countdown banner shown before the boss arrives (it starts at a random time). */
function bossHackBanner(seconds = 23 * 3600 + 59 * 60 + 41) {
  $$(".bh-banner").forEach((x) => x.remove());
  const t = bhLines(), end = Date.now() + seconds * 1000;
  const el = document.createElement("div");
  el.className = "bh-banner";
  el.innerHTML = `<div class="wrap bh-banner-in"><span class="bh-mini">${bossSvg()}</span>
    <span class="bh-banner-txt"><b data-glitch="SIGNAL DETECTED">SIGNAL DETECTED</b><span>${esc(t.boss)} is breaking into ${esc(t.place)}</span></span>
    <span class="bh-clock" aria-live="off">--:--:--</span><button class="bh-x" type="button" aria-label="Hide">×</button></div>`;
  const view = $("#view"); view.parentNode.insertBefore(el, view);
  const clock = $(".bh-clock", el);
  const tick = () => {
    if (!document.body.contains(el)) return clearInterval(timer);
    const s = Math.max(0, Math.round((end - Date.now()) / 1000));
    clock.textContent = [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60].map((n) => String(n).padStart(2, "0")).join(":");
  };
  const timer = setInterval(tick, 1000); tick();
  $(".bh-x", el).addEventListener("click", () => el.remove());
}
