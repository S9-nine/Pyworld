/* Code Quest — game app. */

/* ───────── Constants & helpers ───────── */
const HERO_COLORS = ["#DB4F3B", "#2A6FAD", "#23845A", "#8452C9", "#C9741E", "#BE3B78"];
const ICON = {
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  cross: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12-7.5z" fill="currentColor"/></svg>',
  stop: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/></svg>',
  reset: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v5h5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" fill="currentColor"/><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="2.4"/></svg>',
  star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6.2 6.8.8-5 4.6 1.4 6.7L12 17.5l-6.1 3.3 1.4-6.7-5-4.6 6.8-.8z" fill="currentColor"/></svg>',
  flame: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-3 2-4 2-7 2 1 3 3 3 5 1-2 0-6 0-9z" fill="currentColor"/></svg>',
  crown: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 18l1.5-10 5 4.5L12 5l2.5 7.5 5-4.5L21 18z" fill="currentColor"/></svg>',
  sage: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2 5 5 2-5 2-2 5-2-5-5-2 5-2zM19 15l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z" fill="currentColor"/></svg>',
  book: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zm0 0v16M8 7h7" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  brain: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a3 3 0 0 0-3-1zm6 0a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  hammer: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4l6 6-3 3-6-6zM11 7L3 15l3 3 8-8" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/></svg>',
  bug: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8a4 4 0 0 1 8 0v1H8zM7 10h10v4a5 5 0 0 1-10 0zM3 13h4M17 13h4M4 7l3 3M20 7l-3 3M4 19l3-2M20 19l-3-2M12 10v9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  talk: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/></svg>',
  globe: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
  map: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  cards: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="13" height="15" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 3h11a2 2 0 0 1 2 2v12" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
  people: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  help: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17.5v.01" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>'
};
const STAGES = [
  { id: "learn", label: "Learn", fun: "Scroll of Knowledge", icon: "book" },
  { id: "think", label: "Think", fun: "Oracle's Riddles", icon: "brain" },
  { id: "code", label: "Code", fun: "The Forge", icon: "hammer" },
  { id: "bug", label: "Debug", fun: "Bug Hunt", icon: "bug" },
  { id: "explain", label: "Explain", fun: "Tavern Talk", icon: "talk" }
];
const BOX_DAYS = [1, 3, 7, 14, 30];
const DAILY_GOAL = 100;

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = escapeHtml;
const today = () => dayKey(new Date());
function dayKey(d) { const z = (n) => String(n).padStart(2, "0"); return d.getFullYear() + "-" + z(d.getMonth() + 1) + "-" + z(d.getDate()); }
function addDays(key, n) { const [y, m, d] = key.split("-").map(Number); return dayKey(new Date(y, m - 1, d + n)); }
function stripTags(h) { const d = document.createElement("div"); d.innerHTML = h; return d.textContent || ""; }
function avatarHtml(h, cls = "") {
  const c = HERO_COLORS[(h && h.color) | 0] || HERO_COLORS[0];
  return `<span class="avatar ${cls}" style="background:${c}">${pixelSvg(h ? h.pix : 0)}</span>`;
}
function starsHtml(n, max = 3) {
  let s = "";
  for (let i = 0; i < max; i++) s += `<span class="${i < n ? "on" : "off"}">${ICON.star}</span>`;
  return `<span class="stars" aria-label="${n} of ${max} stars">${s}</span>`;
}
function rankFor(xp) {
  let r = RANKS[0], next = null;
  for (let i = 0; i < RANKS.length; i++) { if (xp >= RANKS[i].xp) { r = RANKS[i]; next = RANKS[i + 1] || null; } }
  return { r, next };
}
const levelById = (id) => LEVELS.find((l) => l.id === id);
const lsGet = (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch (_) { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (_) {} };

/* ───────── App state ───────── */
const S = {
  hero: null, uid: null, mode: "loading", db: null, user: null, sample: null,
  ref: null, others: {}, route: { name: "map" }, unsub: null, readOnlyCloud: false
};

function blankHero(name, pix, color) {
  return { v: 2, name, pix, color, motto: "", role: 0, xp: 0, streak: 0, best: 0, last: "", days: {}, cur: "1-1", stars: 0, done: 0,
    lv: {}, cards: {}, home: {}, ext: {}, created: today() };
}
function cleanHero(d) {
  if (!d || typeof d !== "object") return null;
  const pix = d.pix == null ? clampInt(d.sigil, 0, 5) * 2 : clampInt(d.pix, 0, SPRITES.length - 1);
  const h = blankHero(String(d.name || "Hero").slice(0, 24), pix, clampInt(d.color, 0, 5));
  h.motto = typeof d.motto === "string" ? d.motto.slice(0, 40) : "";
  h.role = clampInt(d.role, 0, 5);
  for (const k of ["xp", "streak", "best", "stars", "done"]) h[k] = clampInt(d[k], 0, 1e7);
  for (const k of ["last", "cur", "created"]) if (typeof d[k] === "string") h[k] = d[k].slice(0, 12);
  for (const k of ["days", "lv", "cards", "home", "ext"]) if (d[k] && typeof d[k] === "object") h[k] = JSON.parse(JSON.stringify(d[k]));
  return h;
}
function clampInt(v, lo, hi) { v = Math.round(Number(v)); return isFinite(v) ? Math.max(lo, Math.min(hi, v)) : lo; }

/* ───────── Saving ───────── */
let saveTimer = null, saving = false, savePending = false;
function save() {
  if (!S.hero) return;
  recompute();
  lsSet(localKey(), S.hero);
  if (S.mode === "cloud") {
    setSync("saving", "Saving…");
    clearTimeout(saveTimer);
    saveTimer = setTimeout(flush, 600);
  } else setSync("local", "Saved on this device");
}
async function flush() {
  if (S.mode !== "cloud" || !S.ref) return;
  if (saving) { savePending = true; return; }
  saving = true;
  try {
    await S.ref.set(JSON.parse(JSON.stringify(S.hero)));
    setSync("ok", "Saved");
  } catch (e) {
    if (e && e.code === "invalid_argument") {
      S.mode = "local"; S.readOnlyCloud = true;
      showBanner("You can see the Guild board, but your account can't save here yet. Your progress is kept in this browser. Ask the game's owner to give you Editor access.");
      setSync("local", "Saved on this device");
    } else if (e && e.code === "unavailable") {
      setSync("error", "Retrying save…");
      setTimeout(() => { saving = false; flush(); }, 1500 + Math.random() * 1500);
      return;
    } else setSync("error", "Couldn't save. Progress kept in this browser");
  }
  saving = false;
  if (savePending) { savePending = false; flush(); }
}
function localKey() { return S.mode === "cloud" ? "cq.hero." + S.uid : slotKey(S.slot || 1); }
function draftNS() { return "cq.draft." + (S.mode === "cloud" ? S.uid : "s" + (S.slot || 1)) + "."; }
function setSync(state, text) { const el = $("#sync"); if (el) { el.dataset.s = state; el.textContent = text; } }
function showBanner(html) { $("#bannerText").innerHTML = html; $("#banner").hidden = false; }

/* ───────── Progress logic ───────── */
function lv(id) { return (S.hero.lv[id] = S.hero.lv[id] || {}); }
function stageDone(id, stage) {
  const s = S.hero.lv[id] || {}, L = levelById(id);
  if (stage === "learn") return !!s.l;
  if (stage === "think") return !!s.t && L.think.every((_, i) => s.t[i]);
  if (stage === "code") return !!(s.c && s.c.ok);
  if (stage === "bug") return !!s.b;
  if (stage === "explain") return !!s.e;
}
const levelClear = (id) => STAGES.every((st) => stageDone(id, st.id));
function levelUnlocked(id) {
  const i = LEVELS.findIndex((l) => l.id === id);
  return i === 0 || stageDone(LEVELS[i - 1].id, "code");
}
function nextLevel() {
  for (const L of LEVELS) if (!levelClear(L.id) && levelUnlocked(L.id)) return L;
  return null;
}
function nextStageOf(id) { return (STAGES.find((st) => !stageDone(id, st.id)) || STAGES[0]).id; }
function recompute() {
  const h = S.hero;
  h.stars = LEVELS.reduce((a, L) => a + ((h.lv[L.id] && h.lv[L.id].c && h.lv[L.id].c.s) || 0), 0);
  h.done = LEVELS.filter((L) => levelClear(L.id)).length;
  const firstLocked = LEVELS.find((L) => !stageDone(L.id, "code"));
  h.cur = firstLocked ? firstLocked.id : "2-0";
}
function addXP(n, label) {
  const h = S.hero, t = today();
  const before = rankFor(h.xp).r;
  h.xp += n;
  h.days[t] = (h.days[t] || 0) + n;
  if (h.last !== t) {
    h.streak = h.last === addDays(t, -1) ? h.streak + 1 : 1;
    h.last = t;
    h.best = Math.max(h.best, h.streak);
  }
  const keys = Object.keys(h.days).sort();
  while (keys.length > 21) delete h.days[keys.shift()];
  toast(`<span class="x">+${n} XP</span> ${esc(label)}`);
  const after = rankFor(h.xp).r;
  if (after !== before) setTimeout(() => toast(`<span class="x">Rank up!</span> You're now a ${esc(after.name)}`), 600);
  save();
  renderChip();
}
function scheduleCards(id) {
  const L = levelById(id);
  L.cards.forEach((_, i) => {
    const k = id + ":" + i;
    if (!S.hero.cards[k]) S.hero.cards[k] = { b: 0, due: addDays(today(), 1) };
  });
}
function dueCards() {
  const t = today();
  return Object.entries(S.hero.cards).filter(([, c]) => c.due <= t).map(([k]) => k);
}
function skillScores() {
  const got = {};
  SKILLS.forEach((s) => (got[s.id] = 0));
  for (const L of LEVELS) {
    const share = STAGES.filter((st) => stageDone(L.id, st.id)).length / STAGES.length;
    for (const [k, v] of Object.entries(L.skills || {})) got[k] += v * share;
    if (L.homeQuest) {
      const done = S.hero.home[L.id] || [];
      L.homeQuest.tasks.forEach((t, i) => { if (done[i]) got[t.skill] = (got[t.skill] || 0) + 2; });
    }
  }
  return SKILLS.map((s) => ({ ...s, pct: Math.min(100, Math.round((got[s.id] / s.total) * 100)) }));
}
function readiness() {
  const sc = skillScores();
  const total = SKILLS.reduce((a, s) => a + s.total, 0);
  return Math.round(sc.reduce((a, s) => a + (s.pct / 100) * s.total, 0) / total * 100);
}

/* ───────── Toasts & modal ───────── */
function toast(html) {
  const el = document.createElement("div");
  el.className = "toast";
  el.innerHTML = html;
  $("#toasts").appendChild(el);
  setTimeout(() => el.remove(), 2600);
}
function openModal(html, { onOpen, dismiss = true } = {}) {
  const slot = $("#modalSlot");
  slot.innerHTML = `<div class="modal-bg" id="modalBg"><div class="modal card" role="dialog" aria-modal="true">${html}</div></div>`;
  const bg = $("#modalBg");
  if (dismiss) {
    bg.addEventListener("click", (e) => { if (e.target === bg) closeModal(); });
    const onKey = (e) => { if (e.key === "Escape") { closeModal(); document.removeEventListener("keydown", onKey); } };
    document.addEventListener("keydown", onKey);
  }
  $$("[data-close]", bg).forEach((b) => b.addEventListener("click", closeModal));
  if (onOpen) onOpen(bg);
  fixSvgVars(bg);
  const f = $("button, input, textarea", bg); if (f) f.focus();
}
function closeModal() { $("#modalSlot").innerHTML = ""; }

/* ───────── Confetti ───────── */
function confetti() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const c = $("#confetti"); c.hidden = false;
  const ctx = c.getContext("2d");
  const W = (c.width = innerWidth), H = (c.height = innerHeight);
  const cols = ["#F4B400", "#DB4F3B", "#2A6FAD", "#23845A", "#8452C9"];
  const ps = Array.from({ length: 120 }, () => ({ x: W / 2 + (Math.random() - .5) * 200, y: H * .35, vx: (Math.random() - .5) * 14, vy: -Math.random() * 14 - 4, s: 4 + Math.random() * 6, c: cols[(Math.random() * cols.length) | 0], r: Math.random() * 6 }));
  let f = 0;
  (function tick() {
    ctx.clearRect(0, 0, W, H);
    ps.forEach((p) => { p.vy += .45; p.x += p.vx; p.y += p.vy; p.r += .2; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * .6); ctx.restore(); });
    if (++f < 110) requestAnimationFrame(tick); else { ctx.clearRect(0, 0, W, H); c.hidden = true; }
  })();
}

/* ───────── Router ───────── */
function go(route) {
  S.route = route;
  render();
  window.scrollTo({ top: 0 });
}
function render() {
  renderNav();
  renderChip();
  const r = S.route, v = $("#view");
  if (!S.hero) return renderTitle(v);
  if (r.name === "map") renderHome(v);
  else if (r.name === "world") renderWorld(v, r.id);
  else if (r.name === "level") renderLevel(v, r.id, r.stage);
  else if (r.name === "review") renderReview(v);
  else if (r.name === "guild") renderGuild(v);
  else if (r.name === "profile") renderProfile(v);
  else renderHome(v);
  fixSvgVars(v);
}
/* Move CSS variables out of SVG presentation attributes into style, where every browser resolves them. */
function fixSvgVars(root) {
  $$("svg, svg *", root).forEach((el) => {
    for (const a of ["fill", "stroke", "font-family", "color"]) {
      const v = el.getAttribute(a);
      if (v && v.includes("var(")) { el.style.setProperty(a, v); el.removeAttribute(a); }
    }
  });
}
function liveStreak(p) { return p.last === today() || p.last === addDays(today(), -1) ? (p.streak | 0) : 0; }
function renderNav() {
  const nav = $("#nav");
  if (!S.hero) { nav.innerHTML = ""; return; }
  const due = dueCards().length;
  const cur = S.route.name === "level" || S.route.name === "world" ? "map" : S.route.name;
  nav.innerHTML = `
    <button data-nav="map" ${cur === "map" ? 'aria-current="page"' : ""}>Map</button>
    <button data-nav="review" ${cur === "review" ? 'aria-current="page"' : ""}>Memory Dungeon ${due ? `<span class="badge">${due}</span>` : ""}</button>
    <button data-nav="guild" ${cur === "guild" ? 'aria-current="page"' : ""}>Guild</button>
    <button data-nav="profile" ${cur === "profile" ? 'aria-current="page"' : ""}>Profile</button>
    <button data-nav="guide">How to play</button>`;
  $$("[data-nav]", nav).forEach((b) => b.addEventListener("click", () => {
    const n = b.dataset.nav;
    if (n === "guide") openGuide(); else go({ name: n });
  }));
}
function renderChip() {
  const slot = $("#chipSlot");
  if (!S.hero) { slot.innerHTML = ""; return; }
  const h = S.hero, { r, next } = rankFor(h.xp);
  const pct = next ? Math.round(((h.xp - r.xp) / (next.xp - r.xp)) * 100) : 100;
  slot.innerHTML = `
    <button class="hero-chip" id="heroChip" aria-label="Your profile">
      ${avatarHtml(h)}
      <span class="meta"><span class="nm">${esc(h.name)}</span><span class="rk">${esc(r.name)} · <span class="num">${h.xp}</span> XP</span><span class="xpbar"><i style="width:${pct}%"></i></span></span>
      <span class="streak" title="Day streak">${ICON.flame}<span class="num">${liveStreak(h)}</span></span>
    </button>`;
  $("#heroChip").addEventListener("click", () => go({ name: "profile" }));
  fixSvgVars(slot);
}

/* ───────── Home ───────── */
function players() {
  const list = Object.entries(S.others).map(([id, h]) => ({ id, ...h }));
  if (S.hero && !list.find((p) => p.id === (S.uid || "me"))) list.push({ id: S.uid || "me", ...S.hero });
  return list.map((p) => (p.id === (S.uid || "me") ? { ...p, ...S.hero, me: true } : p)).sort((a, b) => b.xp - a.xp);
}
function placeOf(p) {
  const cur = p.cur || "1-1";
  if (cur === "2-0") return { world: 2, label: "Arrived at Loop Forest" };
  const L = levelById(cur);
  return { world: L ? L.world : 1, label: L ? `${L.world}-${L.n} ${L.title}` : "Basics Village" };
}
function greeting() { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening"; }

function renderHome(v) {
  const h = S.hero, nx = nextLevel(), due = dueCards().length;
  const todayXp = h.days[today()] || 0;
  const goalPct = Math.min(1, todayXp / DAILY_GOAL);
  const ready = readiness();
  v.innerHTML = `
  <div class="wrap home">
    <div class="home-main">
      <div class="hello">
        <div>
          <p class="eyebrow">Week 1 · Basics Village</p>
          <h1>${greeting()}, ${esc(h.name)}.</h1>
          <p>${h.xp === 0 ? "Your quest starts on the little island in the bottom-left. Each level takes about 30–45 minutes." : due ? `You have ${due} memory card${due > 1 ? "s" : ""} to review. Warm up with those first, then carry on.` : "Pick up where you left off. Small steps every day beat one long weekend."}</p>
        </div>
      </div>
      ${nx ? `<button class="card continue trail-card" id="contBtn">
        <span class="lvl-badge">${nx.world}-${nx.n}</span>
        <span style="flex:1;min-width:0"><span class="eyebrow">${levelClear(nx.id) ? "Replay" : stageDone(nx.id, "learn") ? "Continue" : "Next level"}</span><br><b style="font-size:17px">${esc(nx.title)}</b> <span class="muted">· ${esc(nx.concept)}</span></span>
        <span class="btn primary sm">${ICON.play} ${STAGES.find((s) => s.id === nextStageOf(nx.id)).label}</span>
      </button>` : `<div class="card continue"><span class="lvl-badge">${ICON.crown}</span><span><b>World 1 cleared!</b><br><span class="muted">Loop Forest is next. Ask Claude to forge World 2 into this game.</span></span></div>`}
      <div class="card map-card"><div class="map-scroll">${mapSvg()}</div><div class="map-legend">Click an island · tokens show where each player is</div></div>
      <div class="card loop">
        <div class="panel-h"><h2>Today's quest loop</h2><span class="muted" style="font-size:13px">about 3–4 hours</span></div>
        ${loopHtml(nx, due)}
      </div>
    </div>
    <aside class="home-side">
      <div class="card side-card goal">
        ${ringSvg(goalPct)}
        <div><div class="eyebrow">Daily goal</div><div class="pixel" style="font-size:24px"><span class="num">${todayXp}</span> / ${DAILY_GOAL} XP</div><div class="muted" style="font-size:13px">${liveStreak(h) ? `${liveStreak(h)}-day streak · best ${h.best}` : "Earn XP today to start a streak"}</div></div>
      </div>
      <div class="card side-card">
        <div class="panel-h"><h2>Guild board</h2><button class="btn ghost sm" data-go="guild">See all</button></div>
        <div class="board">${players().slice(0, 6).map(boardRow).join("")}</div>
        ${players().length < 2 ? `<p class="muted" style="font-size:13px;margin-top:10px">Playing solo for now. See <b>How to play</b> to add your sister or friends.</p>` : ""}
      </div>
      <div class="card side-card">
        <div class="panel-h"><h2>Job-ready meter</h2></div>
        <div class="ready-total"><b class="num">${ready}%</b><span class="muted">of the 8-week plan</span></div>
        <div class="skills">${skillScores().map((s) => `<div class="skill"><span>${s.name}</span><span class="pct num">${s.pct}%</span><span class="bar"><i style="width:${s.pct}%"></i></span></div>`).join("")}</div>
      </div>
    </aside>
  </div>`;
  const cb = $("#contBtn"); if (cb) cb.addEventListener("click", () => go({ name: "level", id: nx.id, stage: nextStageOf(nx.id) }));
  $$("[data-go]", v).forEach((b) => b.addEventListener("click", () => go({ name: b.dataset.go })));
  bindMap(v);
  $$("[data-loop]", v).forEach((b) => b.addEventListener("click", () => {
    const [kind, arg] = b.dataset.loop.split("|");
    if (kind === "review") go({ name: "review" });
    else if (kind === "stage") go({ name: "level", id: nx.id, stage: arg });
  }));
  const ext = $("#extBox");
  if (ext) ext.addEventListener("change", () => {
    const t = today();
    S.hero.ext.out = ext.checked ? t : "";
    if (ext.checked && S.hero.ext.outx !== t) { S.hero.ext.outx = t; addXP(15, "Outside practice"); } else save();
    render();
  });
}
function loopHtml(nx, due) {
  const st = (id) => (nx ? stageDone(nx.id, id) : true);
  const rows = [
    { ico: "cards", t: "Memory Dungeon", d: due ? `${due} card${due > 1 ? "s" : ""} due. Recalling old topics locks them in.` : "Nothing due. Cards come back on a growing schedule.", tm: "15 min", done: !due, act: "review|" },
    { ico: "book", t: "Learn + Think", d: nx ? `${nx.title}: lesson and logic riddles` : "World 1 complete", tm: "45 min", done: st("learn") && st("think"), act: "stage|" + (st("learn") ? "think" : "learn") },
    { ico: "hammer", t: "The Forge", d: "Write the code yourself. The game checks it.", tm: "60–90 min", done: st("code"), act: "stage|code" },
    { ico: "bug", t: "Bug Hunt", d: "Fix broken code. Read errors like a pro.", tm: "15 min", done: st("bug"), act: "stage|bug" },
    { ico: "talk", t: "Tavern Talk", d: "Explain your solution in your own words.", tm: "10 min", done: st("explain"), act: "stage|explain" }
  ];
  const extDone = S.hero.ext.out === today();
  return `<ol>${rows.map((r) => `<li class="${r.done ? "done" : ""}">
      <span class="ico">${r.done ? ICON.check : ICON[r.ico]}</span>
      <button class="trail-card" style="padding:0;background:none;border:0" data-loop="${r.act}" ${!nx && r.act.startsWith("stage") ? "disabled" : ""}><span><span class="t">${r.t}</span><br><span class="d">${r.d}</span></span></button>
      <span class="tm">${r.tm}</span></li>`).join("")}
    <li class="${extDone ? "done" : ""}"><span class="ico">${extDone ? ICON.check : ICON.globe}</span>
      <label style="display:flex;gap:10px;align-items:center;cursor:pointer"><input type="checkbox" id="extBox" ${extDone ? "checked" : ""} style="width:18px;height:18px;accent-color:var(--grass)"><span><span class="t">Outside practice</span><br><span class="d">One Exercism exercise or 30 min of CS50P</span></span></label>
      <span class="tm">30 min</span></li></ol>`;
}
function boardRow(p, i) {
  const pl = placeOf(p);
  return `<div class="board-row ${p.me ? "me" : ""}"><span class="pos">${i + 1}</span>${avatarHtml(p, "sm")}<span class="who"><b>${esc(p.name)}${p.me ? " (you)" : ""}</b><span>${p.motto ? "“" + esc(p.motto) + "” · " : ""}${esc(pl.label)}${liveStreak(p) ? ` · ${liveStreak(p)}-day streak` : ""}</span></span><span class="xp num">${p.xp}<small>XP</small></span></div>`;
}
function ringSvg(p) {
  const r = 30, c = 2 * Math.PI * r;
  return `<svg viewBox="0 0 74 74" aria-hidden="true"><circle cx="37" cy="37" r="${r}" fill="none" stroke="var(--sunk)" stroke-width="9"/>${p > 0 ? "" : "<!--"}<circle cx="37" cy="37" r="${r}" fill="none" stroke="var(--sun)" stroke-width="9" stroke-linecap="round" stroke-dasharray="${c * p} ${c}" transform="rotate(-90 37 37)"/>${p > 0 ? "" : "-->"}<text x="37" y="42" text-anchor="middle" font-family="var(--font-display)" font-size="16" fill="var(--ink)">${Math.round(p * 100)}%</text></svg>`;
}

/* ───────── Map ───────── */
function blob(cx, cy, r, seed) {
  const n = 9, pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const k = 1 + 0.16 * Math.sin(seed * 3.1 + i * 2.3) + 0.08 * Math.cos(seed * 1.7 + i * 4.1);
    pts.push([cx + Math.cos(a) * r * 1.35 * k, cy + Math.sin(a) * r * 0.85 * k]);
  }
  let d = "";
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    if (i === 0) d += `M${p1[0].toFixed(1)},${p1[1].toFixed(1)}`;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d + "Z";
}
function mapSvg() {
  const ps = players();
  const byWorld = {};
  ps.forEach((p) => { const w = placeOf(p).world; (byWorld[w] = byWorld[w] || []).push(p); });
  let route = `M${WORLDS[0].x},${WORLDS[0].y}`;
  for (let i = 1; i < WORLDS.length; i++) {
    const a = WORLDS[i - 1], b = WORLDS[i];
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2 + (i % 2 ? 40 : -40);
    route += ` Q${mx},${my} ${b.x},${b.y}`;
  }
  const waves = Array.from({ length: 14 }, (_, i) => {
    const x = (i * 157) % 960 + 20, y = (i * 89) % 470 + 20;
    return `<path d="M${x},${y} q8,-6 16,0 t16,0" fill="none" stroke="var(--water-line)" stroke-width="2.5" stroke-linecap="round"/>`;
  }).join("");
  const w1done = LEVELS.every((L) => stageDone(L.id, "code"));
  const nodes = WORLDS.map((w, i) => {
    const open = w.open || (w.id === 2 && w1done);
    const here = byWorld[w.id] || [];
    const tokens = here.slice(0, 6).map((p, j) => {
      const ang = -Math.PI / 2 - 0.9 + j * 0.62;
      const tx = w.x + Math.cos(ang) * 50, ty = w.y + Math.sin(ang) * 44 - 6;
      const col = HERO_COLORS[p.color | 0] || HERO_COLORS[0];
      const r = p.me ? 19 : 16;
      return `<g class="${p.me ? "token-me" : ""}"><title>${esc(p.name)} · ${esc(placeOf(p).label)}${p.motto ? " · " + esc(p.motto) : ""}</title>
        <rect x="${tx - r}" y="${ty - r}" width="${r * 2}" height="${r * 2}" rx="7" fill="${col}" stroke="${p.me ? "var(--sun)" : "var(--surface)"}" stroke-width="${p.me ? 4 : 3}"/>
        ${pixelSvg(p.pix).replace("<svg ", `<svg x="${tx - r + 4}" y="${ty - r + 3}" width="${r * 2 - 8}" height="${r * 2 - 8}" `)}</g>`;
    }).join("") + (here.length > 6 ? `<text x="${w.x + 60}" y="${w.y - 40}" font-size="16" fill="var(--ink)">+${here.length - 6}</text>` : "");
    return `<g class="world-node" data-world="${w.id}" tabindex="0" role="button" aria-label="World ${w.id}: ${w.name}${open ? "" : " (locked)"}">
      <path d="${blob(w.x, w.y, 46, i + 1)}" fill="var(--land)" stroke="var(--land-edge)" stroke-width="3" opacity="${open ? 1 : .75}"/>
      <circle class="node-ring" cx="${w.x}" cy="${w.y}" r="24" fill="${open ? "var(--sun)" : "var(--surface)"}" stroke="${open ? "var(--sun-ink)" : "var(--line)"}" stroke-width="3"/>
      ${open ? `<text x="${w.x}" y="${w.y + 8}" text-anchor="middle" font-family="var(--font-display)" font-size="24" fill="var(--sun-ink)">${w.id}</text>`
        : `<svg x="${w.x - 10}" y="${w.y - 11}" width="20" height="20" viewBox="0 0 24 24" color="var(--muted)">${ICON.lock.replace(/<\/?svg[^>]*>/g, "")}</svg>`}
      <text x="${w.x}" y="${w.y + 62}" text-anchor="middle" font-family="var(--font-display)" font-size="21" fill="var(--ink)">${esc(w.name)}</text>
      <text x="${w.x}" y="${w.y + 82}" text-anchor="middle" font-family="var(--font-body)" font-size="13" fill="var(--muted)">${esc(w.when)}</text>
      ${tokens}</g>`;
  }).join("");
  return `<svg viewBox="0 0 1000 520" role="group" aria-label="World map">
    <rect width="1000" height="520" fill="var(--water)"/>${waves}
    <path d="${route}" fill="none" stroke="var(--route)" stroke-width="4" stroke-dasharray="2 12" stroke-linecap="round" opacity=".8"/>
    <g transform="translate(60 70)" opacity=".7"><circle r="30" fill="none" stroke="var(--route)" stroke-width="2"/><path d="M0,-40 L7,0 L0,40 L-7,0Z" fill="var(--route)"/><path d="M-40,0 L0,6 L40,0 L0,-6Z" fill="var(--route)" opacity=".5"/><text y="-46" text-anchor="middle" font-family="var(--font-display)" font-size="14" fill="var(--route)">N</text></g>
    ${nodes}</svg>`;
}
function bindMap(root) {
  $$(".world-node", root).forEach((g) => {
    const open = () => {
      const id = +g.dataset.world;
      if (id === 1) go({ name: "world", id: 1 }); else openWorldInfo(id);
    };
    g.addEventListener("click", open);
    g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
  });
}
function openWorldInfo(id) {
  const w = WORLDS.find((x) => x.id === id);
  openModal(`<p class="eyebrow">World ${w.id} · ${esc(w.when)}</p><h2>${esc(w.name)}</h2>
    <div class="prose"><p><b>You'll learn:</b> ${esc(w.topics)}.</p><p><b>Boss project:</b> ${esc(w.boss)}.</p><p><b>Job skills:</b> ${esc(w.job)}.</p>
    <p class="muted">This world opens after the one before it. When you clear World ${w.id - 1}, ask Claude to forge World ${w.id} into the game. It'll be built around how you did.</p></div>
    <div class="row"><button class="btn primary" data-close>Got it</button></div>`);
}

/* ───────── World view ───────── */
function renderWorld(v, wid) {
  const w = WORLDS.find((x) => x.id === wid);
  const levels = LEVELS.filter((L) => L.world === wid);
  const ps = players();
  const boss = levels.find((L) => L.homeQuest);
  const doneHome = (S.hero.home[boss.id] || []);
  v.innerHTML = `
  <div class="wrap">
    <div class="world-head">
      <button class="crumb" data-back>${ICON.back} World map</button>
      <p class="eyebrow">World ${w.id} · ${esc(w.when)}</p>
      <h1>${esc(w.name)}</h1>
      <p class="muted" style="max-width:62ch">The basics every program is built from: ${esc(w.topics)}. Clear each level's five stages to earn stars. The Gatekeeper waits at the end.</p>
    </div>
    <div class="world-grid">
      <div class="trail">${levels.map((L) => {
        const open = levelUnlocked(L.id), clear = levelClear(L.id), s = (S.hero.lv[L.id] || {}).c;
        const here = ps.filter((p) => p.cur === L.id);
        return `<div class="trail-item ${clear ? "clear" : open ? "open" : "locked"} ${L.boss ? "boss" : ""}">
          <div class="stone">${clear ? ICON.check : open ? (L.boss ? ICON.crown : L.n) : ICON.lock}</div>
          <button class="card trail-card" data-level="${L.id}" ${open ? "" : "disabled"}>
            <span style="min-width:0"><span class="eyebrow">${L.boss ? "Boss" : "Level " + L.world + "-" + L.n}</span><h3>${esc(L.title)}</h3><span class="c">${esc(L.concept)}</span></span>
            <span style="display:grid;gap:6px;justify-items:end">
              ${starsHtml(s && s.ok ? s.s : 0)}
              <span class="stage-dots" aria-label="Stages done">${STAGES.map((st) => `<i class="${stageDone(L.id, st.id) ? "on" : ""}"></i>`).join("")}</span>
              ${here.length ? `<span class="here" style="display:flex;padding-left:6px">${here.slice(0, 4).map((p) => avatarHtml(p, "sm")).join("")}</span>` : ""}
            </span>
          </button></div>`;
      }).join("")}</div>
      <aside style="display:grid;gap:20px;align-content:start">
        <div class="card side-card">
          <div class="panel-h"><h2>${esc(boss.homeQuest.title)}</h2><span class="muted num" style="font-size:13px">${doneHome.filter(Boolean).length}/${boss.homeQuest.tasks.length}</span></div>
          <p class="muted" style="font-size:13.5px;margin-bottom:12px">${boss.homeQuest.intro}</p>
          <div class="quest-list">${boss.homeQuest.tasks.map((t, i) => `<label class="quest-item"><input type="checkbox" data-home="${i}" ${doneHome[i] ? "checked" : ""}><span><b>${esc(t.t)}</b><span>${t.d}</span></span></label>`).join("")}</div>
        </div>
        <div class="card side-card">
          <div class="panel-h"><h2>Study alongside</h2></div>
          <div class="res">${(RESOURCES[wid] || []).map((r) => `<a href="${r.url}" target="_blank" rel="noopener"><b>${esc(r.name)}</b><span>${esc(r.what)}</span></a>`).join("")}</div>
        </div>
      </aside>
    </div>
  </div>`;
  $("[data-back]", v).addEventListener("click", () => go({ name: "map" }));
  $$("[data-level]", v).forEach((b) => b.addEventListener("click", () => go({ name: "level", id: b.dataset.level, stage: nextStageOf(b.dataset.level) })));
  $$("[data-home]", v).forEach((cb) => cb.addEventListener("change", () => {
    const i = +cb.dataset.home;
    const arr = (S.hero.home[boss.id] = S.hero.home[boss.id] || []);
    const first = cb.checked && !arr[i] && !(S.hero.home[boss.id + ":x"] || [])[i];
    arr[i] = cb.checked ? 1 : 0;
    if (first) {
      const x = (S.hero.home[boss.id + ":x"] = S.hero.home[boss.id + ":x"] || []);
      x[i] = 1;
      addXP(XP.homeTask, boss.homeQuest.tasks[i].t);
    } else save();
    const head = $(".panel-h .num", v); if (head) head.textContent = arr.filter(Boolean).length + "/" + boss.homeQuest.tasks.length;
  }));
}

/* ───────── Editor ───────── */
const KW = new Set("False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield".split(" "));
const BI = new Set("print input int float str bool len range type round abs min max sum sorted list dict set tuple enumerate zip isinstance".split(" "));
function highlight(src) {
  const re = /(#[^\n]*)|([fFrRbB]?(?:"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\\n])*"?|'(?:\\.|[^'\\\n])*'?))|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)/g;
  let out = "", last = 0, m;
  while ((m = re.exec(src))) {
    out += esc(src.slice(last, m.index));
    if (m[1]) out += `<span class="tk-com">${esc(m[1])}</span>`;
    else if (m[2]) out += `<span class="tk-str">${esc(m[2])}</span>`;
    else if (m[3]) out += `<span class="tk-num">${esc(m[3])}</span>`;
    else if (m[4]) out += KW.has(m[4]) ? `<span class="tk-kw">${m[4]}</span>` : BI.has(m[4]) ? `<span class="tk-fn">${m[4]}</span>` : m[4];
    last = re.lastIndex;
  }
  return out + esc(src.slice(last));
}
function createEditor(host, code, { onChange, id } = {}) {
  host.innerHTML = `<div class="editor"><div class="gutter" aria-hidden="true"></div><div class="code-scroll"><div class="code-inner"><pre aria-hidden="true"><code></code></pre><textarea id="${id || ""}" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" aria-label="Python code editor. Press Escape then Tab to leave."></textarea></div></div></div>`;
  const ta = $("textarea", host), pre = $("code", host), gut = $(".gutter", host);
  let errLine = null, escaped = false;
  const paint = () => {
    pre.innerHTML = highlight(ta.value) + "\n";
    const n = ta.value.split("\n").length;
    let g = "";
    for (let i = 1; i <= n; i++) g += `<div class="${i === errLine ? "err" : ""}">${i}</div>`;
    gut.innerHTML = g;
  };
  const insert = (text) => {
    ta.focus();
    if (!document.execCommand || !document.execCommand("insertText", false, text)) {
      ta.setRangeText(text, ta.selectionStart, ta.selectionEnd, "end");
      ta.dispatchEvent(new Event("input"));
    }
  };
  ta.value = code;
  ta.addEventListener("input", () => { errLine = null; paint(); if (onChange) onChange(ta.value); });
  ta.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { escaped = true; return; }
    if (e.key === "Tab" && !escaped) {
      e.preventDefault();
      const v = ta.value, s = ta.selectionStart;
      if (e.shiftKey) {
        const ls = v.lastIndexOf("\n", s - 1) + 1;
        const m = /^ {1,4}/.exec(v.slice(ls));
        if (m) { ta.setSelectionRange(ls, ls + m[0].length); insert(""); }
      } else insert("    ");
      return;
    }
    escaped = false;
    if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      const v = ta.value, s = ta.selectionStart;
      const line = v.slice(v.lastIndexOf("\n", s - 1) + 1, s);
      let ind = /^\s*/.exec(line)[0];
      if (/:\s*(#.*)?$/.test(line)) ind += "    ";
      insert("\n" + ind);
      return;
    }
    if (e.key === "Backspace" && ta.selectionStart === ta.selectionEnd) {
      const v = ta.value, s = ta.selectionStart;
      const before = v.slice(v.lastIndexOf("\n", s - 1) + 1, s);
      if (before.length >= 4 && /^ +$/.test(before) && before.length % 4 === 0) { e.preventDefault(); ta.setSelectionRange(s - 4, s); insert(""); }
    }
  });
  paint();
  return {
    get: () => ta.value,
    set: (c) => { ta.value = c; errLine = null; paint(); if (onChange) onChange(c); },
    mark: (n) => { errLine = n; paint(); },
    focus: () => ta.focus()
  };
}
function createConsole(el) {
  let pendingAsk = null;
  return {
    clear() { el.innerHTML = ""; },
    hint(t) { el.innerHTML = `<span class="hint-line">${esc(t)}</span>`; },
    write(t) { el.appendChild(document.createTextNode(t)); el.scrollTop = el.scrollHeight; },
    error(err) {
      const s = document.createElement("span");
      s.className = "err";
      s.textContent = `${el.textContent && !el.textContent.endsWith("\n") ? "\n" : ""}${err.name}${err.msg ? ": " + err.msg : ""}${err.line ? "  (line " + err.line + ")" : ""}`;
      el.appendChild(s);
      const x = document.createElement("span");
      x.className = "explain";
      x.innerHTML = friendlyError(err);
      el.appendChild(x);
      el.scrollTop = el.scrollHeight;
    },
    ask() {
      return new Promise((resolve) => {
        const inp = document.createElement("input");
        inp.setAttribute("aria-label", "Type your answer and press Enter");
        el.appendChild(inp);
        inp.focus();
        pendingAsk = () => { inp.remove(); resolve(""); };
        inp.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            const v = inp.value;
            inp.remove();
            pendingAsk = null;
            resolve(v);
          }
        });
      });
    },
    cancel() { if (pendingAsk) { pendingAsk(); pendingAsk = null; } }
  };
}
/* Run button wiring shared by examples, forge and bug hunt. */
async function runInBench(ed, con, runBtn) {
  if (pyBusy) {
    stopPython(); con.cancel(); return;
  }
  con.clear();
  runBtn.innerHTML = ICON.stop + " Stop";
  const r = await runPython(ed.get(), { ask: () => con.ask(), onOut: (t) => con.write(t), limit: 6000 });
  runBtn.innerHTML = ICON.play + " Run";
  if (r.error) { con.error(r.error); if (r.error.line) ed.mark(r.error.line); }
  else if (!r.out) con.hint("(Your program ran but printed nothing.)");
  return r;
}

/* ───────── Level view ───────── */
function renderLevel(v, id, stage) {
  const L = levelById(id);
  if (!L || !levelUnlocked(id)) return go({ name: "world", id: 1 });
  stage = stage || nextStageOf(id);
  S.route.stage = stage;
  const s = lv(id), c = s.c;
  v.innerHTML = `
  <div class="wrap">
    <div class="level-head">
      <button class="crumb" data-back>${ICON.back} ${esc(WORLDS[L.world - 1].name)}</button>
      <div class="level-title">
        <div><p class="eyebrow">${L.boss ? "Boss level" : "Level " + L.world + "-" + L.n} · ${esc(L.concept)}</p><h1>${esc(L.title)}</h1></div>
        ${starsHtml(c && c.ok ? c.s : 0)}
      </div>
      <nav class="stepper" aria-label="Stages">${STAGES.map((st) => `<button class="step" data-stage="${st.id}" ${st.id === stage ? 'aria-current="step"' : ""}><span class="k">${st.fun}</span><span class="v">${stageDone(id, st.id) ? ICON.check : ""}${st.label}</span></button>`).join("")}</nav>
    </div>
    <section class="stage" id="stage"></section>
  </div>`;
  $("[data-back]", v).addEventListener("click", () => go({ name: "world", id: L.world }));
  $$("[data-stage]", v).forEach((b) => b.addEventListener("click", () => go({ name: "level", id, stage: b.dataset.stage })));
  const host = $("#stage");
  ({ learn: stageLearn, think: stageThink, code: stageCode, bug: stageBug, explain: stageExplain })[stage](host, L);
}
function nextStageBtn(L, cur) {
  const i = STAGES.findIndex((s) => s.id === cur);
  const nx = STAGES[i + 1];
  return nx ? `<button class="btn primary" data-next="${nx.id}">Next: ${nx.label} ${ICON.play}</button>` : "";
}
function bindNext(host, L) {
  $$("[data-next]", host).forEach((b) => b.addEventListener("click", () => go({ name: "level", id: L.id, stage: b.dataset.next })));
}
function afterStage(L) {
  if (levelClear(L.id) && !lv(L.id).d) {
    lv(L.id).d = 1;
    save();
    celebrate(L);
  }
}
function celebrate(L) {
  const c = lv(L.id).c || { s: 1 };
  const idx = LEVELS.indexOf(L), nx = LEVELS[idx + 1];
  confetti();
  openModal(`<div class="celebrate" style="display:grid;gap:14px">
    <p class="eyebrow">${L.boss ? "Boss defeated" : "Level cleared"}</p>
    <h2>${esc(L.title)}</h2>
    <div class="big-stars">${starsHtml(c.s)}</div>
    <p class="muted">${c.s === 3 ? "Three stars, no hints. That's real understanding." : "Replay the Forge without hints any time to raise your stars."} Its memory cards will show up in the Memory Dungeon tomorrow.</p>
    ${L.boss ? `<p><b>World 1 complete.</b> Now do the <i>Take it home</i> quests on the World page. That's where your portfolio starts.</p>` : ""}
    <div class="row" style="justify-content:center">${nx ? `<button class="btn primary" id="cNext">Next: ${esc(nx.title)}</button>` : `<button class="btn primary" id="cWorld">Back to the world</button>`}<button class="btn" data-close>Stay here</button></div></div>`,
    { onOpen: (bg) => {
      const n = $("#cNext", bg); if (n) n.addEventListener("click", () => { closeModal(); go({ name: "level", id: nx.id, stage: "learn" }); });
      const w = $("#cWorld", bg); if (w) w.addEventListener("click", () => { closeModal(); go({ name: "world", id: L.world }); });
    } });
}

function stageLearn(host, L) {
  host.innerHTML = `
    <div class="stage-intro"><h2>Scroll of Knowledge</h2><span class="muted">Read, run, then change the code and run it again.</span></div>
    <div class="learn-grid">${L.learn.map((c, i) => `
      <article class="card lcard"><h3>${esc(c.h)}</h3><p>${c.p}</p>
        <div class="bench mini"><div class="bench-bar"><span class="file"><i></i>example_${i + 1}.py</span><button class="btn sm ghost" data-reset="${i}" style="color:var(--code-muted)">${ICON.reset} Reset</button><button class="btn sm go" data-run="${i}">${ICON.play} Run</button></div>
        <div data-ed="${i}"></div><div class="console" data-con="${i}"></div></div>
      </article>`).join("")}
    </div>
    <div class="next-row">${nextStageBtn(L, "learn")}</div>`;
  L.learn.forEach((c, i) => {
    const ed = createEditor($(`[data-ed="${i}"]`, host), c.code);
    const con = createConsole($(`[data-con="${i}"]`, host));
    $(`[data-run="${i}"]`, host).addEventListener("click", (e) => runInBench(ed, con, e.currentTarget));
    $(`[data-reset="${i}"]`, host).addEventListener("click", () => { ed.set(c.code); con.clear(); });
  });
  $("[data-next]", host).addEventListener("click", () => {
    if (!lv(L.id).l) { lv(L.id).l = 1; addXP(XP.learn, "Lesson read"); }
    go({ name: "level", id: L.id, stage: "think" });
  });
}

function stageThink(host, L) {
  const s = lv(L.id);
  s.t = s.t || [];
  let qi = Math.max(0, L.think.findIndex((_, i) => !s.t[i]));
  if (qi === -1 || s.t.length >= L.think.length && L.think.every((_, i) => s.t[i])) qi = 0;
  const show = () => {
    const q = L.think[qi];
    const prog = L.think.map((_, i) => `<i class="${s.t[i] === 1 ? "ok" : s.t[i] ? "on" : i === qi ? "on" : ""}"></i>`).join("");
    host.innerHTML = `
      <div class="stage-intro"><h2>Oracle's Riddles</h2><span class="muted">No coding, just thinking. Predict before you peek.</span></div>
      <div class="card q">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px"><span class="eyebrow">Riddle ${qi + 1} of ${L.think.length}</span><span class="qprog">${prog}</span></div>
        <h3>${q.q}</h3>
        ${q.code ? `<pre class="sample">${highlight(q.code)}</pre>` : ""}
        <div id="qBody"></div>
        <div id="qWhy"></div>
        <div class="row" style="display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap" id="qNav"></div>
      </div>`;
    const body = $("#qBody"), why = $("#qWhy"), nav = $("#qNav");
    const answered = (correct) => {
      const first = !s.t[qi];
      if (first) { s.t[qi] = correct ? 1 : 2; addXP(correct ? XP.think : XP.thinkRetry, correct ? "Riddle solved" : "Learned from a miss"); }
      why.innerHTML = `<div class="why ${correct ? "good" : ""}"><b>${correct ? "Correct!" : "Not quite."}</b>${q.why}</div>`;
      const last = qi === L.think.length - 1;
      nav.innerHTML = last ? nextStageBtn(L, "think") : `<button class="btn primary" id="qNext">Next riddle</button>`;
      if (last) { bindNext(host, L); afterStage(L); }
      else $("#qNext").addEventListener("click", () => { qi++; show(); });
    };
    if (q.type === "mcq") {
      body.innerHTML = `<div class="opts">${q.options.map((o, i) => `<button class="opt" data-o="${i}"><span class="l">${"ABCD"[i]}</span><span class="tx">${q.options[i].includes("<") ? o : esc(o)}</span></button>`).join("")}</div>`;
      $$("[data-o]", body).forEach((b) => b.addEventListener("click", () => {
        const pick = +b.dataset.o, ok = pick === q.answer;
        $$("[data-o]", body).forEach((x) => { x.disabled = true; if (+x.dataset.o === q.answer) x.classList.add("right"); });
        if (!ok) b.classList.add("wrong");
        answered(ok);
      }));
    } else if (q.type === "order") {
      const order = q.lines.map((_, i) => i);
      do { order.sort(() => Math.random() - .5); } while (order.every((v, i) => v === i));
      let picked = [];
      const draw = () => {
        body.innerHTML = `<p class="muted" style="font-size:13px;margin-bottom:8px">Tap lines in the order they should run. Tap a placed line to remove it.</p>
          <div class="order-answer" aria-label="Your order">${picked.map((i, k) => `<button class="chip" data-un="${k}"><i>${k + 1}</i><span>${esc(q.lines[i])}</span></button>`).join("") || '<span class="muted" style="font-size:13px">Your program builds here</span>'}</div>
          <div class="order-pool" style="margin-top:10px">${order.filter((i) => !picked.includes(i)).map((i) => `<button class="chip" data-pk="${i}">${esc(q.lines[i])}</button>`).join("")}</div>`;
        $$("[data-pk]", body).forEach((b) => b.addEventListener("click", () => { picked.push(+b.dataset.pk); draw(); }));
        $$("[data-un]", body).forEach((b) => b.addEventListener("click", () => { picked.splice(+b.dataset.un, 1); draw(); }));
        nav.innerHTML = picked.length === q.lines.length ? `<button class="btn primary" id="qCheck">Check order</button>` : "";
        const ck = $("#qCheck");
        if (ck) ck.addEventListener("click", () => {
          const ok = picked.every((v, i) => v === i);
          $$(".chip", body).forEach((x) => (x.disabled = true));
          if (!ok) body.insertAdjacentHTML("beforeend", `<div class="sample" style="margin-top:10px">${q.lines.map((l, i) => `${i + 1}  ${esc(l)}`).join("\n")}</div>`);
          answered(ok);
        });
      };
      draw();
    }
    if (s.t[qi]) {
      // Already answered before: show review mode
      if (q.type === "mcq") {
        $$("[data-o]", body).forEach((x) => { x.disabled = true; if (+x.dataset.o === q.answer) x.classList.add("right"); });
        answered(s.t[qi] === 1);
      }
    }
  };
  show();
}

function challengeStage(host, L, kind) {
  const isBug = kind === "bug";
  const task = isBug ? L.bug : L.code;
  const s = lv(L.id);
  const draftKey = draftNS() + L.id + "." + kind;
  const startCode = lsGet(draftKey) || (isBug ? task.code : task.starter);
  const meta = isBug ? (s.bm = s.bm || { h: 0 }) : (s.cm = s.cm || { h: 0, sage: 0, fails: 0, rev: 0 });
  const hints = isBug ? [task.hint] : task.hints;
  host.innerHTML = `
    <div class="stage-intro"><h2>${isBug ? "Bug Hunt" : "The Forge"}</h2><span class="muted">${isBug ? "Run it, read the error, fix it, check it." : "Plan in comments, write the code, run it, then check it."}</span></div>
    <div class="forge">
      <div class="card brief">
        <div class="eyebrow">${isBug ? "The bug report" : "Your quest"}</div>
        <div class="task">${task.brief}</div>
        ${task.sample ? `<div><div class="sample-label">Example run</div><pre class="sample">${esc(task.sample)}</pre></div>` : ""}
        <div><div class="sample-label">The checker will try</div><div class="tests" id="tests">${task.tests.map((t, i) => `<div class="test"><span class="s">${i + 1}</span><span class="msg">${t.in.length ? "Typing: " + t.in.map((x) => `<code>${esc(x)}</code>`).join(" then ") : "Running your program"}</span></div>`).join("")}</div></div>
        <div id="codeMsg"></div>
        <div class="hints" id="hints"></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap" id="helpRow"></div>
        <div id="sageBox"></div>
      </div>
      <div class="bench">
        <div class="bench-bar"><span class="file"><i></i>${isBug ? "bug_hunt" : "quest"}_${L.id.replace("-", "_")}.py</span>
          <button class="btn sm" id="resetBtn">${ICON.reset} Reset</button>
          <button class="btn sm go" id="runBtn">${ICON.play} Run</button>
          <button class="btn sm primary" id="checkBtn">${ICON.check} Check</button></div>
        <div id="ed"></div>
        <div class="console" id="con"></div>
      </div>
    </div>
    <div class="next-row" id="stageNext" style="max-width:none">${(isBug ? s.b : s.c && s.c.ok) ? nextStageBtn(L, kind) : ""}</div>`;
  const ed = createEditor($("#ed", host), startCode, { onChange: (c) => lsSet(draftKey, c), id: "code-" + kind });
  const con = createConsole($("#con", host));
  con.hint(isBug ? "Press Run to see what goes wrong." : "Press Run to try your code. Press Check when you think it's right.");
  bindNext(host, L);

  const drawHints = () => {
    const shown = isBug ? meta.h : meta.h;
    $("#hints", host).innerHTML = hints.slice(0, shown).map((h, i) => `<div class="hint"><b>Hint ${i + 1}</b>${h}</div>`).join("");
    const row = $("#helpRow", host);
    let html = "";
    if (shown < hints.length) html += `<button class="btn sm" id="hintBtn">Show hint ${shown + 1}${isBug ? "" : " (costs a star)"}</button>`;
    if (S.sample) html += `<button class="btn sm" id="sageBtn">${ICON.sage} Ask the Sage</button>`;
    if (!isBug && !(s.c && s.c.ok) && (meta.h >= hints.length || meta.fails >= 4)) html += `<button class="btn sm ghost" id="revealBtn">Show a solution</button>`;
    row.innerHTML = html;
    const hb = $("#hintBtn", host); if (hb) hb.addEventListener("click", () => { meta.h++; save(); drawHints(); });
    const sb = $("#sageBtn", host); if (sb) sb.addEventListener("click", () => askSage(sb));
    const rb = $("#revealBtn", host); if (rb) rb.addEventListener("click", () => {
      meta.rev = 1; save();
      $("#hints", host).insertAdjacentHTML("beforeend", `<div class="hint"><b>One solution</b>Read it, then close it and type it yourself from memory. Typing it beats pasting it.<pre class="sample" style="margin-top:8px">${highlight(task.solution)}</pre></div>`);
      rb.remove();
    });
  };
  drawHints();

  const askSage = async (btn) => {
    btn.disabled = true;
    const box = $("#sageBox", host);
    box.innerHTML = `<div class="sage"><b>${ICON.sage} The Sage</b><span>Thinking…</span></div>`;
    const r = await runPython(ed.get(), { inputs: (task.tests[0] || { in: [] }).in, limit: 2000 });
    const prompt = `You are the Sage, a warm coding mentor inside a beginner Python learning game. The learner is stuck.
Task: ${stripTags(task.brief)}
${task.sample ? "Expected example run:\n" + task.sample + "\n" : ""}Their code:
\`\`\`python
${ed.get()}
\`\`\`
What happened when it ran${(task.tests[0] || { in: [] }).in.length ? " with inputs " + JSON.stringify(task.tests[0].in) : ""}: ${r.error ? r.error.name + ": " + r.error.msg + (r.error.line ? " on line " + r.error.line : "") : "Output was:\n" + r.out}
Give ONE short Socratic hint (at most 60 words) that points them toward the problem. Do NOT write the corrected code or the full solution. You may name a line number or a concept. Plain text, no markdown headings.`;
    try {
      const res = await S.sample(prompt, { modelTier: "quick", cache: false, onText: ({ text }) => { const sp = $(".sage span", box); if (sp) sp.textContent = text; } });
      $(".sage span", box).textContent = res.text;
      if (!isBug) { meta.sage = (meta.sage || 0) + 1; save(); }
    } catch (e) {
      if (e && e.code === "not_granted") { S.sample = null; box.innerHTML = ""; drawHints(); return; }
      $(".sage span", box).textContent = e && e.code === "rate_limited" ? "The Sage needs a short rest. Try a hint, or ask again in a minute." : "The Sage couldn't answer just now. Try a hint instead.";
    }
    btn.disabled = false;
  };

  const runBtn = $("#runBtn", host), checkBtn = $("#checkBtn", host);
  runBtn.addEventListener("click", () => runInBench(ed, con, runBtn));
  $("#resetBtn", host).addEventListener("click", () => {
    ed.set(isBug ? task.code : task.starter);
    lsSet(draftKey, null);
    con.hint("Code reset.");
  });
  checkBtn.addEventListener("click", async () => {
    if (pyBusy) return;
    checkBtn.disabled = true; runBtn.disabled = true;
    con.hint("Checking…");
    const res = await runTests(task, ed.get());
    checkBtn.disabled = false; runBtn.disabled = false;
    const box = $("#tests", host);
    $("#codeMsg", host).innerHTML = res.codeMsg ? `<div class="notice">${res.codeMsg}</div>` : "";
    if (res.results.length) {
      box.innerHTML = res.results.map((r, i) => `<div class="test ${r.pass ? "pass" : "fail"}"><span class="s">${r.pass ? ICON.check : ICON.cross}</span><span class="msg">${r.input.length ? "Typing " + r.input.map((x) => `<code>${esc(x)}</code>`).join(" then ") + ": " : ""}${r.pass ? "passed" : r.msg}</span></div>`).join("");
      const firstFail = res.results.find((r) => !r.pass);
      con.clear();
      if (firstFail) {
        con.write(firstFail.out || "");
        if (firstFail.error) { con.error(firstFail.error); if (firstFail.error.line) ed.mark(firstFail.error.line); }
      } else con.write(res.results[res.results.length - 1].out);
    } else con.hint("Fix the note on the left, then check again.");
    if (!res.pass) {
      if (!isBug) { meta.fails = (meta.fails || 0) + 1; save(); drawHints(); }
      return;
    }
    if (isBug) {
      if (!s.b) { s.b = 1; addXP(XP.bug, "Bug squashed"); }
      $("#codeMsg", host).innerHTML = `<div class="notice good"><b>Bug squashed.</b> Reading the error message first is the habit that makes debugging fast.</div>`;
    } else {
      const used = (meta.h || 0) + (meta.sage || 0);
      const stars = meta.rev ? 1 : Math.max(1, 3 - used);
      const prev = s.c && s.c.ok ? s.c.s : 0;
      s.c = { ok: 1, s: Math.max(prev, stars) };
      scheduleCards(L.id);
      if (!prev) addXP(XP.codeBase + XP.codeStar * stars, `Forge cleared · ${stars} star${stars > 1 ? "s" : ""}`);
      else if (stars > prev) addXP(XP.codeStar * (stars - prev), "More stars");
      else save();
      $("#codeMsg", host).innerHTML = `<div class="notice good"><b>All tests passed!</b> ${starsHtml(stars)}${stars < 3 ? "<br>Replay later without hints for three stars." : ""}</div>`;
      meta.h = 0; meta.sage = 0; meta.fails = 0; meta.rev = 0;
      save();
    }
    $("#stageNext", host).innerHTML = nextStageBtn(L, kind);
    bindNext(host, L);
    const step = $(`[data-stage="${kind}"] .v`); if (step && !step.querySelector("svg")) step.insertAdjacentHTML("afterbegin", ICON.check);
    afterStage(L);
  });
}
const stageCode = (h, L) => challengeStage(h, L, "code");
const stageBug = (h, L) => challengeStage(h, L, "bug");

function stageExplain(host, L) {
  const s = lv(L.id);
  const draftKey = draftNS() + L.id + ".explain";
  const val = s.e || lsGet(draftKey) || "";
  host.innerHTML = `
    <div class="stage-intro"><h2>Tavern Talk</h2><span class="muted">Explaining code out loud is half of every interview. Practise it here.</span></div>
    <div class="card explain-box">
      <div class="eyebrow">The innkeeper asks</div>
      <h3 style="font-size:18px;font-weight:600">${L.explain}</h3>
      <p class="muted" style="font-size:14px">Write 2–4 sentences as if you're explaining it to a friend. Saying it out loud first helps.</p>
      <label class="sr" for="expl">Your explanation</label>
      <textarea id="expl" placeholder="In my own words…">${esc(val)}</textarea>
      <div class="row"><span class="wc" id="wc"></span>${S.sample ? `<button class="btn" id="fbBtn">${ICON.sage} Get interviewer feedback</button>` : ""}<button class="btn primary" id="saveExpl">${s.e ? "Update answer" : "Save answer"}</button></div>
      <div id="fb"></div>
    </div>
    <div class="next-row" style="max-width:760px">${levelClear(L.id) ? `<button class="btn" data-world>Back to ${esc(WORLDS[L.world - 1].name)}</button>` : ""}</div>`;
  const ta = $("#expl"), wc = $("#wc");
  const count = () => { const n = (ta.value.trim().match(/\S+/g) || []).length; wc.textContent = `${n} words${n < 12 ? " · aim for at least 12" : ""}`; return n; };
  count();
  ta.addEventListener("input", () => { count(); lsSet(draftKey, ta.value); });
  $("#saveExpl").addEventListener("click", () => {
    if (count() < 12) { wc.textContent = "A little more, please. Aim for at least 12 words."; ta.focus(); return; }
    const first = !s.e;
    s.e = ta.value.trim().slice(0, 2000);
    if (first) addXP(XP.explain, "Explained it"); else save();
    $("#saveExpl").textContent = "Update answer";
    toast("Answer saved");
    afterStage(L);
    if (levelClear(L.id)) render();
  });
  const fb = $("#fbBtn");
  if (fb) fb.addEventListener("click", async () => {
    if (count() < 6) { wc.textContent = "Write a bit first, then ask for feedback."; return; }
    fb.disabled = true;
    const box = $("#fb");
    box.innerHTML = `<div class="sage"><b>${ICON.sage} Interviewer feedback</b><span>Reading…</span></div>`;
    const prompt = `You are a kind but honest junior-developer interviewer. A beginner learning Python was asked: "${stripTags(L.explain)}"
Their answer: "${ta.value.trim()}"
In at most 70 words: say whether it's correct, name one thing they did well, and one specific way to make it clearer or more precise. Plain text, no headings, no bullet points.`;
    try {
      const res = await S.sample(prompt, { modelTier: "quick", cache: false, onText: ({ text }) => { const sp = $(".sage span", box); if (sp) sp.textContent = text; } });
      $(".sage span", box).textContent = res.text;
    } catch (e) {
      if (e && e.code === "not_granted") { S.sample = null; box.innerHTML = ""; fb.remove(); return; }
      $(".sage span", box).textContent = "Feedback isn't available right now. Try again in a minute.";
    }
    fb.disabled = false;
  });
  const wb = $("[data-world]", host); if (wb) wb.addEventListener("click", () => go({ name: "world", id: L.world }));
}

/* ───────── Memory Dungeon ───────── */
function renderReview(v) {
  const due = dueCards();
  const all = Object.keys(S.hero.cards);
  const nextDue = all.length ? Object.values(S.hero.cards).map((c) => c.due).sort()[0] : null;
  v.innerHTML = `
  <div class="wrap"><div class="review">
    <div><p class="eyebrow">Spaced review</p><h1>Memory Dungeon</h1>
    <p class="muted" style="max-width:60ch;margin-top:8px">Pulling an answer out of memory makes it stick far better than re-reading. Cards you get right come back later and later (1, 3, 7, 14, then 30 days). Cards you miss come back tomorrow.</p></div>
    <div id="dz"></div>
  </div></div>`;
  const dz = $("#dz");
  if (!all.length) {
    dz.innerHTML = `<div class="card flash"><h3>The dungeon is empty, for now.</h3><p class="muted">Clear a level's Forge and its memory cards will appear here the next day.</p><div><button class="btn primary" id="toMap">Go to the map</button></div></div>`;
    $("#toMap").addEventListener("click", () => go({ name: "map" }));
    return;
  }
  if (!due.length) {
    dz.innerHTML = `<div class="card flash"><h3>All clear.</h3><p class="muted">Next cards are due ${nextDue === addDays(today(), 1) ? "tomorrow" : "on " + esc(nextDue)}. Want extra practice? It won't change your schedule or give XP.</p><div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn primary" id="practice">Practise anyway</button><button class="btn" id="toMap">Back to the map</button></div>${boxesHtml()}</div>`;
    $("#toMap").addEventListener("click", () => go({ name: "map" }));
    $("#practice").addEventListener("click", () => runDeck(dz, all.sort(() => Math.random() - .5).slice(0, 6), false));
    return;
  }
  runDeck(dz, due.sort(() => Math.random() - .5), true);
}
function boxesHtml() {
  const counts = [0, 0, 0, 0, 0];
  Object.values(S.hero.cards).forEach((c) => counts[Math.min(4, c.b)]++);
  return `<div class="boxes">${counts.map((n, i) => `<span>${["New", "3-day", "Week", "2-week", "Mastered"][i]}: <b class="num">${n}</b></span>`).join("")}</div>`;
}
function runDeck(dz, keys, counts) {
  let i = 0, right = 0;
  const queue = keys.slice();
  const show = () => {
    if (i >= queue.length) {
      dz.innerHTML = `<div class="card flash"><h3>Dungeon cleared!</h3><p>${right} of ${queue.length} recalled${counts ? `, +${right * XP.card} XP` : ""}.</p>${boxesHtml()}<div><button class="btn primary" id="toMap">Back to the map</button></div></div>`;
      $("#toMap").addEventListener("click", () => go({ name: "map" }));
      if (counts) { S.hero.ext.rev = today(); save(); renderNav(); }
      return;
    }
    const key = queue[i], [lid, ci] = key.split(":"), L = levelById(lid), card = L.cards[+ci];
    dz.innerHTML = `<div class="card flash">
      <div style="display:flex;justify-content:space-between;gap:10px"><span class="from">From ${L.world}-${L.n} ${esc(L.title)}</span><span class="from num">${i + 1} / ${queue.length}</span></div>
      <h3>${card.q}</h3>
      <div class="opts">${card.options.map((o, k) => `<button class="opt" data-o="${k}"><span class="l">${"ABCD"[k]}</span><span class="tx">${esc(o)}</span></button>`).join("")}</div>
      <div id="fx"></div></div>`;
    $$("[data-o]", dz).forEach((b) => b.addEventListener("click", () => {
      const ok = +b.dataset.o === card.answer;
      $$("[data-o]", dz).forEach((x) => { x.disabled = true; if (+x.dataset.o === card.answer) x.classList.add("right"); });
      if (!ok) b.classList.add("wrong");
      if (counts) {
        const c = S.hero.cards[key];
        if (ok) { c.b = Math.min(4, c.b + 1); c.due = addDays(today(), BOX_DAYS[c.b]); right++; addXP(XP.card, "Memory recalled"); }
        else { c.b = 0; c.due = addDays(today(), 1); save(); }
      } else if (ok) right++;
      $("#fx").innerHTML = `<div class="why ${ok ? "good" : ""}" style="margin-top:4px"><b>${ok ? "Remembered!" : "This one comes back tomorrow."}</b>${counts && ok ? "Next review in " + BOX_DAYS[S.hero.cards[key].b] + " days." : ""}</div><div style="display:flex;justify-content:flex-end;margin-top:10px"><button class="btn primary" id="nx">${i + 1 < queue.length ? "Next card" : "Finish"}</button></div>`;
      $("#nx").addEventListener("click", () => { i++; show(); });
      $("#nx").focus();
    }));
  };
  show();
}

/* ───────── Guild ───────── */
function renderGuild(v) {
  const ps = players();
  v.innerHTML = `
  <div class="wrap"><div class="guild">
    <div><p class="eyebrow">Everyone on this quest</p><h1>Guild board</h1>
    <p class="muted" style="max-width:62ch;margin-top:8px">Each player has their own save. This board updates live as people play. Healthy rivalry helps, but your real opponent is yesterday's you.</p></div>
    <div class="card" style="padding:6px 0"><div class="table-scroll"><table class="lb">
      <thead><tr><th>#</th><th>Hero</th><th>Where</th><th class="n">Stars</th><th class="n">Streak</th><th class="n">XP</th></tr></thead>
      <tbody>${ps.map((p, i) => `<tr class="${p.me ? "me" : ""}"><td class="r">${i + 1}</td><td><span class="who">${avatarHtml(p, "sm")}<span>${esc(p.name)}${p.me ? " (you)" : ""}<br><span class="muted" style="font-weight:400;font-size:12px">${esc(rankFor(p.xp).r.name)}${p.motto ? " · “" + esc(p.motto) + "”" : ""}</span></span></span></td><td>${esc(placeOf(p).label)}</td><td class="n">${p.stars | 0}</td><td class="n">${liveStreak(p)}</td><td class="n pixel" style="font-size:17px">${p.xp | 0}</td></tr>`).join("")}</tbody>
    </table></div></div>
    <div class="card side-card prose">${inviteHtml()}</div>
  </div></div>`;
}
function inviteHtml() {
  return `<h3 style="margin-top:0">Add another player</h3>
    <ol>
      <li>The person who owns this game opens the <b>Share</b> menu at the top of this page.</li>
      <li>Invite the new player by email and give them <b>Editor</b> access. Keep the page off public links, because players invited from outside need that to save.</li>
      <li>They sign in to claude.ai on their own computer, open the link, and create their own hero.</li>
    </ol>
    <p><b>Sharing one computer?</b> When the game runs outside claude.ai, the title screen has 3 save files. Each player picks their own file and can lock it with a PIN.</p>
    <p class="muted">On claude.ai, each player's progress is stored under their own account, so nobody can overwrite anyone else's save.${S.mode !== "cloud" ? " <b>Right now this page is saving in this browser only</b>, so it needs to be opened from claude.ai while signed in for the Guild board to work." : ""}</p>`;
}

/* ───────── Guide & settings ───────── */
function openGuide() {
  openModal(`<p class="eyebrow">How to play</p><h2>Your 8-week quest</h2>
    <div class="prose">
      <p>You're learning Python to be confident applying for junior developer jobs in 8 weeks. Each week is a world on the map. Each level has five stages:</p>
      <ul>
        <li><b>Learn</b>: a short lesson with examples you can run and change.</li>
        <li><b>Think</b>: logic riddles with no code. Predict, order, spot the trap.</li>
        <li><b>Code</b>: write the program yourself. The checker tests it with different inputs.</li>
        <li><b>Debug</b>: fix broken code, sometimes code an AI wrote.</li>
        <li><b>Explain</b>: put the idea into words, the way you will in interviews.</li>
      </ul>
      <h3>The daily loop (3–4 hours)</h3>
      <p>Start with the <b>Memory Dungeon</b> to review old topics, do the next level, then spend 30 minutes on Exercism or CS50P. Aim for ${DAILY_GOAL} XP a day and keep your streak alive.</p>
      <h3>Stars and hints</h3>
      <p>Clear the Forge with no hints for 3 stars. Each hint or Sage question costs a star, with a minimum of 1. You can replay any time.</p>
      <h3>The AI sidekick rule</h3>
      <p>Write first, then ask for help. The Sage gives nudges, never answers. Employers now test whether you can catch AI mistakes, so the Bug Hunts train exactly that.</p>
      ${inviteHtml()}
    </div>
    <div class="row"><button class="btn primary" data-close>Let's go</button></div>`);
}
/* ───────── Boot ───────── */
async function boot(hot) {
  if (hot && hot.route) S.route = hot.route;
  setSync("local", "Connecting…");
  const use = (n) => (window.claude && window.claude.use ? window.claude.use(n).catch(() => null) : Promise.resolve(null));
  const [db, user, sample] = await Promise.all([use("db"), use("user"), use("sample")]);
  S.db = db; S.user = user; S.sample = sample;
  try { S.uid = user ? await user.id() : null; } catch (_) { S.uid = null; }
  let hero = null;
  migrateLegacy();
  if (db && S.uid) {
    S.mode = "cloud";
    S.ref = db.doc("heroes/" + S.uid);
    try {
      let snap;
      try { snap = await S.ref.get(); } catch (e) { await new Promise((r) => setTimeout(r, 800)); snap = await S.ref.get(); }
      hero = snap.exists ? cleanHero(snap.data()) : null;
    } catch (_) { S.mode = "local"; }
    if (S.mode === "cloud") {
      S.unsub = db.collection("heroes").limit(200).onSnapshot((qs) => {
        const o = {};
        qs.docs.forEach((d) => { if (d.id !== S.uid) { const h = cleanHero(d.data()); if (h) o[d.id] = h; } });
        S.others = o;
        if (S.hero && ["map", "guild", "world"].includes(S.route.name)) render();
      }, () => {});
    }
  } else S.mode = "local";
  if (S.mode === "cloud" && !hero) hero = cleanHero(lsGet(localKey()));
  S.cloudHero = S.mode === "cloud" ? hero : null;
  S.hero = null;
  if (S.mode === "cloud") setSync("ok", "Saved");
  else {
    setSync("local", "Saved on this device");
    showBanner("Playing offline: your progress saves in this browser. Open the claude.ai version while signed in to join the shared Guild board.");
  }
  render();
}
function loadScript(src) {
  return new Promise((res, rej) => { const el = document.createElement("script"); el.src = src; el.onload = res; el.onerror = rej; document.head.appendChild(el); });
}
(function start() {
  fixSvgVars(document.querySelector(".topbar"));
  loadScript("https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt.min.js")
    .then(() => loadScript("https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt-stdlib.js"))
    .catch(() => toast("The Python engine could not load. Check your connection and reload."));
  const hot = window.claude && window.claude.hot;
  if (hot && hot.snapshot) hot.snapshot(() => ({ route: S.route }));
  $("#brand").addEventListener("click", () => S.hero && go({ name: "map" }));
  if (hot && hot.ready) hot.ready(boot); else boot(hot && hot.data ? hot.data : {});
})();
