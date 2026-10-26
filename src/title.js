/* Title screen, save files, hero creation and PIN lock. */

const SLOT_COUNT = 3;
const slotKey = (n) => "cq.slot." + n;
const pinKey = (n) => "cq.pin." + n;
const ssGet = (k) => { try { return sessionStorage.getItem(k); } catch (_) { return null; } };
const ssSet = (k, v) => { try { sessionStorage.setItem(k, v); } catch (_) {} };

async function hashPin(slot, pin) {
  const text = "codequest:" + slot + ":" + pin;
  try {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
  } catch (_) {
    let h = 7;
    for (const c of text) h = (h * 31 + c.charCodeAt(0)) | 0;
    return "x" + h;
  }
}
function migrateLegacy() {
  const old = lsGet("cq.hero.local");
  if (old && !lsGet(slotKey(1))) { lsSet(slotKey(1), old); try { localStorage.removeItem("cq.hero.local"); } catch (_) {} }
}

/* ── Pixel scene (canvas, drawn at low resolution and scaled up) ── */
let sceneRaf = null;
function startScene(canvas) {
  const W = 192, H = 108;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let seed = 11;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const stars = Array.from({ length: 70 }, () => ({ x: (rnd() * W) | 0, y: (rnd() * 58) | 0, p: rnd() * 6, big: rnd() > .9 }));
  const clouds = Array.from({ length: 4 }, (_, i) => ({ x: rnd() * W, y: 12 + i * 9 + rnd() * 6, w: 14 + (rnd() * 14) | 0, v: .05 + rnd() * .08 }));
  const flies = Array.from({ length: 10 }, () => ({ x: rnd() * W, y: 80 + rnd() * 14, p: rnd() * 6 }));
  const band = ["#1a1c2c", "#1f2340", "#252c55", "#29366f", "#30428a", "#3b5dc9"];
  const sp = SPRITES[(Date.now() / 86400000 | 0) % SPRITES.length];
  const spPal = Object.assign({}, PIX_BASE, sp.pal);
  let t = 0, shoot = null, last = 0;

  const ridge = (x, base, amp, f1, f2, off) => base - Math.round(amp * (Math.sin((x + off) * f1) * .6 + Math.sin((x + off) * f2 + 1.7) * .4));
  function draw() {
    // Sky bands with a dithered seam between each
    const bh = 64 / band.length;
    for (let i = 0; i < band.length; i++) {
      ctx.fillStyle = band[i]; ctx.fillRect(0, Math.round(i * bh), W, Math.ceil(bh) + 1);
      if (i > 0) { ctx.fillStyle = band[i - 1]; const y = Math.round(i * bh); for (let x = 0; x < W; x += 2) ctx.fillRect(x + (y % 2), y, 1, 1); }
    }
    ctx.fillStyle = band[band.length - 1]; ctx.fillRect(0, 64, W, H - 64);
    // Stars
    stars.forEach((s) => {
      const on = Math.sin(t * .05 + s.p * 3) > -.3;
      if (!on) return;
      ctx.fillStyle = s.big ? "#ffcd75" : "#f4f4f4";
      ctx.fillRect(s.x, s.y, 1, 1);
      if (s.big && Math.sin(t * .05 + s.p) > .5) { ctx.fillRect(s.x - 1, s.y, 3, 1); ctx.fillRect(s.x, s.y - 1, 1, 3); }
    });
    // Shooting star
    if (!shoot && !reduce && Math.random() < .004) shoot = { x: 40 + Math.random() * 120, y: 4 + Math.random() * 16, l: 0 };
    if (shoot) {
      ctx.fillStyle = "#f4f4f4";
      for (let i = 0; i < 6; i++) ctx.fillRect(shoot.x - i, shoot.y - (i >> 1), 1, 1);
      shoot.x += 2.4; shoot.y += 1.2; if (++shoot.l > 30) shoot = null;
    }
    // Moon
    ctx.fillStyle = "#f4f4f4";
    for (let y = -8; y <= 8; y++) for (let x = -8; x <= 8; x++) if (x * x + y * y <= 64) ctx.fillRect(158 + x, 20 + y, 1, 1);
    ctx.fillStyle = "#c2d1dc"; [[155, 17, 2], [161, 23, 2], [160, 15, 1]].forEach(([cx, cy, r]) => { for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) if (x * x + y * y <= r * r) ctx.fillRect(cx + x, cy + y, 1, 1); });
    // Clouds
    clouds.forEach((c) => {
      ctx.fillStyle = "#566c86";
      const x = Math.round(c.x);
      ctx.fillRect(x, c.y, c.w, 3); ctx.fillRect(x + 3, c.y - 2, c.w - 7, 2); ctx.fillRect(x + 6, c.y - 3, 5, 1);
      c.x += reduce ? 0 : c.v; if (c.x > W + 4) c.x = -c.w - 4;
    });
    // Far mountains
    ctx.fillStyle = "#333c57";
    for (let x = 0; x < W; x++) { const y = ridge(x, 70, 12, .045, .11, t * .02); ctx.fillRect(x, y, 1, H - y); }
    // Snow caps
    ctx.fillStyle = "#94b0c2";
    for (let x = 0; x < W; x++) { const y = ridge(x, 70, 12, .045, .11, t * .02); if (y < 62) ctx.fillRect(x, y, 1, 2); }
    // Castle on the hill
    const cx = 120, gy = 78;
    ctx.fillStyle = "#1a1c2c";
    ctx.fillRect(cx, gy - 18, 34, 18);
    ctx.fillRect(cx - 4, gy - 28, 9, 28); ctx.fillRect(cx + 29, gy - 28, 9, 28); ctx.fillRect(cx + 13, gy - 34, 8, 16);
    for (let i = 0; i < 3; i++) { ctx.fillRect(cx - 4 + i * 3, gy - 30, 2, 2); ctx.fillRect(cx + 29 + i * 3, gy - 30, 2, 2); }
    for (let i = 0; i < 2; i++) ctx.fillRect(cx + 13 + i * 5, gy - 36, 3, 2);
    for (let i = 0; i < 6; i++) ctx.fillRect(cx + 2 + i * 5, gy - 20, 3, 2);
    ctx.fillStyle = "#b13e53"; ctx.fillRect(cx + 17, gy - 42, 1, 8); ctx.fillRect(cx + 18, gy - 42 + ((t >> 3) % 2), 4, 3);
    const lit = (i) => Math.sin(t * .03 + i * 1.9) > -.6;
    ctx.fillStyle = "#ffcd75";
    [[cx - 1, gy - 22], [cx + 32, gy - 22], [cx + 16, gy - 28], [cx + 8, gy - 12], [cx + 24, gy - 12]].forEach(([x, y], i) => { if (lit(i)) ctx.fillRect(x, y, 2, 3); });
    ctx.fillStyle = "#5d275d"; ctx.fillRect(cx + 14, gy - 8, 6, 8);
    // Near hills
    ctx.fillStyle = "#257179";
    for (let x = 0; x < W; x++) { const y = ridge(x, 84, 5, .06, .15, 40); ctx.fillRect(x, y, 1, H - y); }
    // Ground
    ctx.fillStyle = "#38b764"; ctx.fillRect(0, 92, W, H - 92);
    ctx.fillStyle = "#a7f070"; ctx.fillRect(0, 92, W, 1);
    ctx.fillStyle = "#257179"; for (let x = 0; x < W; x += 7) ctx.fillRect((x + 3) % W, 96 + (x % 3) * 3, 2, 1);
    ctx.fillStyle = "#ef7d57"; for (let x = 0; x < W; x += 6) ctx.fillRect(x, 100, 4, 2);
    // Walking hero
    const hx = Math.round((t * .35) % (W + 24)) - 12, bob = (t >> 3) % 2;
    sp.rows.forEach((row, y) => { for (let x = 0; x < 12; x++) { const ch = row[x]; if (ch !== "." && spPal[ch]) { ctx.fillStyle = spPal[ch]; ctx.fillRect(hx + x, 80 + y - bob, 1, 1); } } });
    // Fireflies
    flies.forEach((f) => { if (Math.sin(t * .08 + f.p * 4) > .2) { ctx.fillStyle = "#ffcd75"; ctx.fillRect(Math.round(f.x + Math.sin(t * .02 + f.p) * 4), Math.round(f.y + Math.cos(t * .03 + f.p) * 2), 1, 1); } });
  }
  function loop(now) {
    if (now - last > 66) { last = now; t++; draw(); }
    sceneRaf = requestAnimationFrame(loop);
  }
  if (sceneRaf) cancelAnimationFrame(sceneRaf);
  if (reduce) { t = 40; draw(); } else sceneRaf = requestAnimationFrame(loop);
}

/* ── Title flow ── */
let titleKeyHandler = null;
function renderTitle(v, step) {
  document.body.classList.add("on-title");
  v.innerHTML = `<section class="title-screen">
    <canvas class="scene" id="scene" aria-hidden="true"></canvas>
    <div class="title-ui" id="titleUi"></div>
  </section>`;
  startScene($("#scene"));
  titleStep(step || "start");
}
function leaveTitle() {
  document.body.classList.remove("on-title");
  if (sceneRaf) cancelAnimationFrame(sceneRaf);
  sceneRaf = null;
  if (titleKeyHandler) document.removeEventListener("keydown", titleKeyHandler);
  titleKeyHandler = null;
}
function setTitleKeys(fn) {
  if (titleKeyHandler) document.removeEventListener("keydown", titleKeyHandler);
  titleKeyHandler = fn;
  if (fn) document.addEventListener("keydown", fn);
}
const logoHtml = `<h1 class="logo"><span>CODE</span><span>QUEST</span></h1><p class="tagline">An 8-week Python adventure</p>`;

function titleStep(step, arg) {
  const ui = $("#titleUi");
  if (!ui) return;
  if (step === "start") {
    ui.innerHTML = `${logoHtml}
      <button class="press" id="pressStart">Press start</button>
      <p class="tiny">${S.mode === "cloud" ? "Signed in with your Claude account" : netConfigured() ? "Saves back up online" : "Saves stay in this browser"} · v1.2</p>`;
    const go1 = () => titleStep("files");
    $("#pressStart").addEventListener("click", go1);
    $("#pressStart").focus();
    setTitleKeys((e) => { if (e.key === "Enter" && document.activeElement && document.activeElement.id !== "pressStart") { e.preventDefault(); go1(); } });
    return;
  }
  setTitleKeys(null);
  if (step === "files") return S.mode === "cloud" ? cloudFiles(ui) : localFiles(ui);
  if (step === "create") return createHero(ui, arg);
  if (step === "pin") return pinPad(ui, arg);
}

function fileCard(h, label, extra = "") {
  const pl = placeOf(h), rk = rankFor(h.xp).r;
  return `<span class="file-av">${avatarHtml(h, "xl")}</span>
    <span class="file-meta"><span class="file-label">${label}</span><b>${esc(h.name)}</b><span>${esc(rk.name)} · <span class="num">${h.xp}</span> XP · ${esc(pl.label)}</span></span>${extra}`;
}

function cloudFiles(ui) {
  const h = S.cloudHero;
  ui.innerHTML = `${logoHtml}
    <div class="pbox">
      <h2 class="ptitle">${h ? "Welcome back" : "A new hero arrives"}</h2>
      <p class="pnote">You're signed in with your Claude account, so your save follows you to any computer. Nobody else can play your file.</p>
      ${h ? `<button class="file" id="cont">${fileCard(h, "Your save", `<span class="file-go">Continue ▸</span>`)}</button>` : `<button class="file empty" id="newg"><span class="file-plus">+</span><span class="file-meta"><span class="file-label">No save yet</span><b>New game</b><span>Create your hero to begin</span></span></button>`}
      <div class="prow"><button class="pbtn alt" id="back">◂ Back</button></div>
    </div>`;
  const c = $("#cont"), n = $("#newg");
  if (c) { c.focus(); c.addEventListener("click", () => enterGame(S.cloudHero)); }
  if (n) { n.focus(); n.addEventListener("click", () => titleStep("create", { cloud: true })); }
  $("#back").addEventListener("click", () => titleStep("start"));
}

function localFiles(ui) {
  const slots = [];
  for (let i = 1; i <= SLOT_COUNT; i++) slots.push({ n: i, hero: cleanHero(lsGet(slotKey(i))), locked: !!lsGet(pinKey(i)) });
  ui.innerHTML = `${logoHtml}
    <div class="pbox">
      <h2 class="ptitle">Select a save file</h2>
      <p class="pnote">One file per player on this computer. Lock yours with a PIN so nobody else plays your save.</p>
      <div class="files">${slots.map((s) => s.hero
        ? `<button class="file" data-slot="${s.n}">${fileCard(s.hero, "File " + s.n, `<span class="file-go">${s.locked ? `<span class="lock-ico">${ICON.lock}</span>` : ""}Play ▸</span>`)}</button>`
        : `<button class="file empty" data-new="${s.n}"><span class="file-plus">+</span><span class="file-meta"><span class="file-label">File ${s.n}</span><b>Empty</b><span>Start a new game</span></span></button>`).join("")}</div>
      <div class="prow"><button class="pbtn alt" id="back">◂ Back</button></div>
    </div>`;
  $$("[data-slot]", ui).forEach((b) => b.addEventListener("click", () => {
    const n = +b.dataset.slot;
    if (lsGet(pinKey(n)) && ssGet("cq.unlocked") !== String(n)) titleStep("pin", n);
    else enterSlot(n);
  }));
  $$("[data-new]", ui).forEach((b) => b.addEventListener("click", () => titleStep("create", { slot: +b.dataset.new })));
  $("#back").addEventListener("click", () => titleStep("start"));
  const first = $(".file", ui); if (first) first.focus();
}

function enterSlot(n) {
  S.slot = n;
  ssSet("cq.unlocked", String(n));
  enterGame(cleanHero(lsGet(slotKey(n))));
}
function enterGame(hero) {
  S.hero = hero;
  leaveTitle();
  recompute();
  save();
  go({ name: "map" });
  netStart().then((ok) => { if (ok && S.hero) { save(); render(); } });
}

function createHero(ui, opt) {
  const pick = { name: "", pix: (Math.random() * SPRITES.length) | 0, color: 1, pin: "" };
  (async () => {
    try { const me = S.user ? await S.user.me() : null; if (me && me.name && !pick.name) { pick.name = me.name.split(" ")[0].slice(0, 16); const f = $("#cName"); if (f && !f.value) { f.value = pick.name; drawPrev(); } } } catch (_) {}
  })();
  ui.innerHTML = `
    <div class="pbox creator">
      <h2 class="ptitle">Create your hero</h2>
      <div class="creator-grid">
        <div class="pedestal" id="prev"></div>
        <div class="creator-form">
          <label class="plabel" for="cName">Hero name</label>
          <input class="pinput" id="cName" maxlength="16" autocomplete="off" placeholder="Type a name">
          <span class="plabel">Choose a character</span>
          <div class="char-grid" id="chars">${SPRITES.map((s, i) => `<button class="char" data-pix="${i}" aria-label="${s.name}" title="${s.name}">${pixelSvg(i)}</button>`).join("")}</div>
          <span class="plabel">Background</span>
          <div class="swatches" id="cols">${HERO_COLORS.map((c, i) => `<button class="swatch" data-col="${i}" aria-label="Colour ${i + 1}" style="background:${c}"></button>`).join("")}</div>
          ${opt.cloud ? "" : `<label class="plabel" for="cPin">PIN lock</label>
          <span class="pnote" style="font-size:12.5px">Optional. 4 digits so nobody else on this computer plays your file.</span>
          <input class="pinput pin" id="cPin" type="password" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="••••">`}
        </div>
      </div>
      <p class="perr" id="cErr" role="alert"></p>
      <div class="prow"><button class="pbtn alt" id="cBack">◂ Back</button><button class="pbtn" id="cGo">Start quest ▸</button></div>
    </div>`;
  const drawPrev = () => {
    $("#prev").innerHTML = `${avatarHtml(pick, "hero")}<b>${esc($("#cName").value.trim() || "???")}</b><span>${SPRITES[pick.pix].name}</span>`;
    $$(".char", ui).forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.pix === pick.pix)));
    $$(".swatch", ui).forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.col === pick.color)));
  };
  drawPrev();
  $("#cName").focus();
  $("#cName").addEventListener("input", drawPrev);
  $$(".char", ui).forEach((b) => b.addEventListener("click", () => { pick.pix = +b.dataset.pix; drawPrev(); }));
  $$(".swatch", ui).forEach((b) => b.addEventListener("click", () => { pick.color = +b.dataset.col; drawPrev(); }));
  const pinEl = $("#cPin");
  if (pinEl) pinEl.addEventListener("input", () => { pinEl.value = pinEl.value.replace(/\D/g, "").slice(0, 4); });
  $("#cBack").addEventListener("click", () => titleStep("files"));
  $("#cGo").addEventListener("click", async () => {
    const name = $("#cName").value.trim();
    const err = $("#cErr");
    if (!name) { err.textContent = "Every hero needs a name."; $("#cName").focus(); return; }
    const pin = pinEl ? pinEl.value : "";
    if (pin && pin.length !== 4) { err.textContent = "A PIN needs exactly 4 digits, or leave it empty."; pinEl.focus(); return; }
    const hero = blankHero(name.slice(0, 16), pick.pix, pick.color);
    if (opt.cloud) { S.cloudHero = hero; enterGame(hero); setTimeout(openWelcome, 400); return; }
    S.slot = opt.slot;
    if (pin) lsSet(pinKey(opt.slot), await hashPin(opt.slot, pin));
    else lsSet(pinKey(opt.slot), null);
    lsSet(slotKey(opt.slot), hero);
    enterSlot(opt.slot);
    setTimeout(openWelcome, 400);
  });
}

function pinPad(ui, n) {
  const h = cleanHero(lsGet(slotKey(n)));
  let entry = "";
  ui.innerHTML = `
    <div class="pbox pinbox">
      <h2 class="ptitle">File ${n} is locked</h2>
      <div class="pin-who">${avatarHtml(h, "xl")}<b>${esc(h.name)}</b></div>
      <div class="pin-dots" id="dots" aria-live="polite"></div>
      <div class="keypad">${[1, 2, 3, 4, 5, 6, 7, 8, 9, "◂", 0, "OK"].map((k) => `<button class="key" data-k="${k}" aria-label="${k === "◂" ? "Delete" : k}">${k}</button>`).join("")}</div>
      <p class="perr" id="pErr" role="alert"></p>
      <div class="prow"><button class="pbtn alt" id="pBack">◂ Back</button></div>
    </div>`;
  const dots = () => { $("#dots").innerHTML = [0, 1, 2, 3].map((i) => `<i class="${i < entry.length ? "on" : ""}"></i>`).join(""); };
  dots();
  const tryPin = async () => {
    if (entry.length !== 4) return;
    const ok = (await hashPin(n, entry)) === lsGet(pinKey(n));
    if (ok) { setTitleKeys(null); enterSlot(n); return; }
    entry = ""; dots();
    $("#pErr").textContent = "Wrong PIN. Try again.";
    const box = $(".pinbox"); box.classList.remove("shake"); void box.offsetWidth; box.classList.add("shake");
  };
  const press = (k) => {
    $("#pErr").textContent = "";
    if (k === "◂") entry = entry.slice(0, -1);
    else if (k === "OK") return tryPin();
    else if (entry.length < 4) entry += k;
    dots();
    if (entry.length === 4) tryPin();
  };
  $$(".key", ui).forEach((b) => b.addEventListener("click", () => press(b.dataset.k)));
  setTitleKeys((e) => {
    if (/^\d$/.test(e.key)) press(e.key);
    else if (e.key === "Backspace") press("◂");
    else if (e.key === "Enter") press("OK");
    else if (e.key === "Escape") titleStep("files");
  });
  $("#pBack").addEventListener("click", () => titleStep("files"));
  $(".key", ui).focus();
}

function logOut() {
  flush();
  if (S.mode === "cloud") S.cloudHero = S.hero;
  S.hero = null;
  S.slot = null;
  try { sessionStorage.removeItem("cq.unlocked"); } catch (_) {}
  S.route = { name: "map" };
  render();
  titleStep("files");
}
