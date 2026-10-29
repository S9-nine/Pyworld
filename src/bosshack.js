/* ───────── Boss Hack: a surprise review event ─────────
   Every few days, at a random time, a countdown appears on the map. At zero the world's boss "hacks
   in" (the glitch-breach takeover) and plants bugs in levels the player cleared a while ago: being
   tested on older material is what makes it stick. Beat 4 questions (one miss allowed) for bonus XP and
   a Firewall badge. State lives in the save as hero.bh = { due, last, fights, wins } and hero.badges. */
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
const BOSS_XP = { win: 40, try: 10 };
const BOSS_QUESTION_TYPES = ["mcq", "multi", "predict", "spot", "fill", "match", "trace", "order"];
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
const bhState = () => (S.hero.bh = S.hero.bh || { due: 0, last: "", fights: 0, wins: 0 });
const daysSince = (key) => (key ? Math.round((new Date(today()) - new Date(key)) / 864e5) : 999);

/* ── Which questions: from levels cleared a while ago ──
   Skips the newest cleared level and anything cleared in the last 2 days. Half the picks come from the
   weakest levels (few stars, wrong riddles, hints), half from the ones practised longest ago, and the
   last is a "boss round" (a predict / trace / spot-the-bug riddle when there is one). */
function bossPicks(n = 4, relaxed = false) {
  const cleared = LEVELS.filter((l) => levelClear(l.id) && (l.think || []).some((q) => BOSS_QUESTION_TYPES.includes(q.type)));
  const newest = cleared[cleared.length - 1];
  const pool = cleared.filter((l) => l !== newest && (relaxed || daysSince(lv(l.id).dt) >= 2));
  if (pool.length < 2) return null;
  const weak = (l) => { const s = lv(l.id); return (3 - ((s.c && s.c.s) || 1)) * 2 + (s.t || []).filter((x) => x === 2).length + ((s.cm && s.cm.h) | 0) + ((s.bm && s.bm.h) | 0); };
  const last = (l) => lv(l.id).bh || lv(l.id).dt || "";
  const byWeak = [...pool].sort((a, b) => weak(b) - weak(a)), byOld = [...pool].sort((a, b) => (last(a) < last(b) ? -1 : 1));
  const levels = [];
  for (let i = 0; levels.length < n && i < n * 4; i++) {
    const from = i % 2 === 0 ? byWeak : byOld, l = from[Math.floor(i / 2) % from.length];
    if (!levels.includes(l) || pool.length < n) levels.push(l);
  }
  const used = new Set();
  return levels.map((L, i) => {
    const boss = i === levels.length - 1;
    let qs = L.think.map((q, k) => ({ q, k })).filter(({ q, k }) => BOSS_QUESTION_TYPES.includes(q.type) && !used.has(L.id + k));
    if (boss && qs.some(({ q }) => ["predict", "trace", "spot"].includes(q.type))) qs = qs.filter(({ q }) => ["predict", "trace", "spot"].includes(q.type));
    const pick = qs[Math.floor(Math.random() * qs.length)] || { q: L.think[0], k: 0 };
    used.add(L.id + pick.k);
    return { L, q: pick.q, boss };
  });
}
function bhLines() {
  const h = S.hero, w = currentWorld();
  const done = LEVELS.filter((l) => levelClear(l.id)).length;
  return {
    boss: w.boss || "The Gatekeeper", place: w.name,
    taunt: `Heh. ${done || "A few"} level${done === 1 ? "" : "s"} cleared, ${h.name}… but do you still REMEMBER them?`,
    deal: `I've planted 4 bugs in levels you beat a while ago. Squash them (one miss allowed) for +${BOSS_XP.win} XP and the Firewall badge.`
  };
}

/* ── The takeover (design B: glitch breach) ── */
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
  if (S.hero && S.route.name === "map") bossHackBanner();
}
async function bossHackTakeover({ preview = false } = {}) {
  const picks = preview ? null : bossPicks(4, true);
  if (!preview && !picks) return toast("Clear a few more levels first: the boss only tests older ones.");
  const o = bhStart("glitch"), t = bhLines();
  o.innerHTML = `<div class="bh-scan"></div>${Array.from({ length: 6 }, (_, i) => `<div class="bh-slice" style="top:${8 + i * 15 + Math.random() * 6}%;height:${2 + Math.random() * 6}%;animation-delay:${(Math.random() * 0.4).toFixed(2)}s"></div>`).join("")}
    <div class="bh-static">${Array.from({ length: 70 }, () => { const s = 4 + Math.floor(Math.random() * 16); return `<i style="left:${Math.random() * 100}%;top:${Math.random() * 100}%;width:${s}px;height:${s}px;animation-delay:${(Math.random() * 1.2).toFixed(2)}s"></i>`; }).join("")}</div>`;
  document.body.classList.add("bh-shake");
  await bhWait(1300);
  document.body.classList.remove("bh-shake");
  const term = document.createElement("div");
  term.className = "bh-term";
  term.innerHTML = `<div class="bh-term-bar"><i></i><i></i><i></i><span>boss.exe</span></div>
    <div class="bh-term-body"><div class="bh-term-boss">${bossSvg()}</div><pre class="bh-term-log"></pre></div><div class="bh-term-main"></div>`;
  o.appendChild(term);
  await bhWait(450);
  await bhType($(".bh-term-log", term), `> WARNING: intrusion detected\n> ${t.boss.toUpperCase()} has hacked ${t.place}\n> planting bugs in your old levels...`, 22);
  await bhWait(300);
  const main = $(".bh-term-main", term);
  main.innerHTML = `<div class="bh-offer"><p class="bh-name">${esc(t.boss)}</p><p class="bh-say"></p><p class="bh-deal" hidden>${esc(t.deal)}</p>
    <div class="bh-btns" hidden><button class="btn primary bh-go" type="button">Face the boss</button><button class="btn bh-later" type="button">Not now</button></div></div>`;
  await bhType($(".bh-say", main), t.taunt);
  $(".bh-deal", main).hidden = false; $(".bh-btns", main).hidden = false;
  $(".bh-go", main).focus();
  $(".bh-go", main).addEventListener("click", () => (preview ? (bhEnd(o), toast("Preview: this is where the boss's questions start.")) : bossHackFight(o, main, picks)));
  $(".bh-later", main).addEventListener("click", () => { bhEnd(o); if (!preview) toast(`${t.boss} is waiting on the map. Face him when you're ready.`); });
}

/* ── The fight: 4 questions inside the hacked terminal ── */
function bossHackFight(o, main, picks) {
  const t = bhLines();
  let i = 0, right = 0;
  const missed = [];
  netLog("bosshack", null, null, null, { start: true, levels: picks.map((p) => p.L.id) });
  const show = () => {
    const { L, q, boss } = picks[i];
    main.innerHTML = `<div class="bh-q">
      <p class="bh-q-head"><span>&gt; ${boss ? "BOSS ROUND" : `bug ${i + 1} of ${picks.length}`}</span><span>planted in ${esc(L.world + "-" + L.n)} ${esc(L.title)}</span></p>
      <div class="bh-q-dots">${picks.map((_, k) => `<i class="${k < i ? (missed.includes(k) ? "miss" : "ok") : k === i ? "on" : ""}"></i>`).join("")}</div>
      <h3>${q.q}</h3>
      ${q.code && !["spot", "fill"].includes(q.type) ? `<pre class="sample">${highlightFor(q.lang)(q.code)}</pre>` : ""}
      <div class="bh-q-body"></div><div class="bh-q-why"></div><div class="bh-q-nav"></div></div>`;
    const body = $(".bh-q-body", main), why = $(".bh-q-why", main), nav = $(".bh-q-nav", main);
    const k = {
      done: false, was: 0, nav,
      checkBtn: (label, fn) => { nav.innerHTML = `<button class="btn primary">${label}</button>`; $("button", nav).addEventListener("click", fn); },
      answered: (correct) => {
        netLog("bosshack", L.id, "think", correct, { q: L.think.indexOf(q), boss });
        if (correct) right++; else missed.push(i);
        why.innerHTML = `<div class="why ${correct ? "good" : ""}"><b>${correct ? "Bug squashed!" : "The bug survives."}</b>${q.why}</div>`;
        const last = i === picks.length - 1;
        nav.innerHTML = `<button class="btn primary">${last ? "See the result" : "Next bug"}</button>`;
        $("button", nav).addEventListener("click", () => { if (last) finish(); else { i++; show(); main.scrollTop = 0; } });
      }
    };
    (THINK[q.type] || THINK.mcq)(q, body, k);
    fixSvgVars(main);
  };
  const finish = () => {
    const won = right >= picks.length - 1, b = bhState();
    b.due = 0; b.last = today(); b.fights = (b.fights | 0) + 1;
    picks.forEach(({ L }) => { lv(L.id).bh = today(); });
    if (won) { b.wins = (b.wins | 0) + 1; S.hero.badges = S.hero.badges || {}; S.hero.badges.firewall = (S.hero.badges.firewall | 0) + 1; }
    addXP(won ? BOSS_XP.win : BOSS_XP.try, won ? "Boss Hack defeated" : "Fought the Boss Hack");
    netLog("bosshack", null, null, won, { right, of: picks.length, levels: picks.map((p) => p.L.id) });
    const review = [...new Set(missed.map((k) => picks[k].L))];
    main.innerHTML = `<div class="bh-result ${won ? "won" : ""}">
      <pre class="bh-term-log">${won ? `> FIREWALL RESTORED\n> ${esc(t.boss.toUpperCase())} retreats from ${esc(t.place)}` : `> ${esc(t.boss.toUpperCase())} escaped... for now`}</pre>
      <p class="bh-score">${right} of ${picks.length} bugs squashed</p>
      ${won ? `<p class="bh-badge"><span class="dev-tag">BADGE</span> Firewall${S.hero.badges.firewall > 1 ? ` ×${S.hero.badges.firewall}` : ""} · +${BOSS_XP.win} XP</p>` : `<p class="bh-deal">+${BOSS_XP.try} XP for fighting. These levels deserve a quick look:</p>`}
      ${review.length ? `<div class="bh-review">${review.map((L) => `<button class="btn sm" data-review="${esc(L.id)}">Review ${esc(L.world + "-" + L.n)} ${esc(L.title)}</button>`).join("")}</div>` : ""}
      <div class="bh-btns"><button class="btn primary bh-done" type="button">Back to the map</button></div></div>`;
    if (won) confetti();
    $(".bh-done", main).addEventListener("click", () => bhEnd(o));
    $$("[data-review]", main).forEach((x) => x.addEventListener("click", () => { bhEnd(o); go({ name: "level", id: x.dataset.review, stage: "learn" }); }));
    save();
  };
  show();
}

/* ── When it happens ──
   After clearing a level (or opening the game), if there are older levels to test and the last fight was
   3+ days ago, there's a chance a countdown of 6–24 hours starts. */
function bossHackMaybeSchedule(chance = 0.35) {
  if (!S.hero || S.mode === "cloud") return;
  const b = bhState();
  if (b.due || daysSince(b.last) < 3 || !bossPicks()) return;
  if (Math.random() >= chance) return;
  b.due = Date.now() + (6 + Math.random() * 18) * 3600e3;
  save();
}
let bhAutoShown = false, bhClock = null;
/* The countdown banner over the map, then the takeover when it reaches zero (once per visit on its own;
   after "Not now" the banner offers the fight). */
function bossHackBanner() {
  clearInterval(bhClock);
  $$(".bh-banner").forEach((x) => x.remove());
  if (!S.hero || S.route.name !== "map" || $(".bh")) return;
  const b = bhState();
  if (!b.due) return;
  const t = bhLines(), el = document.createElement("div");
  el.className = "bh-banner";
  el.innerHTML = `<div class="wrap bh-banner-in"><span class="bh-mini">${bossSvg()}</span>
    <span class="bh-banner-txt"><b data-glitch="SIGNAL DETECTED">SIGNAL DETECTED</b><span></span></span>
    <span class="bh-clock" aria-live="off"></span></div>`;
  const view = $("#view"); view.parentNode.insertBefore(el, view);
  const txt = $(".bh-banner-txt span", el), clock = $(".bh-clock", el);
  const tick = () => {
    if (!document.body.contains(el)) return clearInterval(bhClock);
    const s = Math.max(0, Math.round((b.due - Date.now()) / 1000));
    if (s > 0) {
      txt.textContent = `${t.boss} is breaking into ${t.place}`;
      clock.textContent = [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60].map((n) => String(n).padStart(2, "0")).join(":");
      return;
    }
    clearInterval(bhClock);
    txt.textContent = `${t.boss} has broken in and is waiting for you`;
    clock.innerHTML = `<button class="btn sm bh-fight" type="button">Face him</button>`;
    $(".bh-fight", el).addEventListener("click", () => bossHackTakeover());
    if (!bhAutoShown) { bhAutoShown = true; setTimeout(() => { if (S.route.name === "map" && !$(".bh") && !$("#modalBg")) bossHackTakeover(); }, 900); }
  };
  bhClock = setInterval(tick, 1000); tick();
}
