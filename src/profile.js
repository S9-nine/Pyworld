/* Profile page: hero card, edit form, PIN lock and account actions. */

const ROLES = ["Not sure yet", "Backend developer", "Data analyst", "Automation / QA engineer", "Full-stack developer", "AI / ML engineer"];

/* The DEV switches on the Profile page: one row per design in FEATURES (app.js). */
const DEV_SWITCHES = [
  ["learnCards", "Learn as cards", "One idea at a time: guess what it prints, run it, then change it. Level 1-1 only so far."],
  ["hiddenIdeas", "Hidden key ideas in Explain", "Key ideas stay hidden until you say them, with a hint button if you're stuck."]
];
function renderProfile(v) {
  const h = S.hero;
  const draft = { name: h.name, pix: h.pix, color: h.color, motto: h.motto || "", role: h.role | 0 };
  const cleared = LEVELS.filter((L) => levelClear(L.id)).length;
  const hasPin = S.mode !== "cloud" && !!lsGet(pinKey(S.slot));
  v.innerHTML = `
  <div class="wrap profile">
    <button class="crumb" data-back>${ICON.back} World map</button>
    <div class="profile-grid">
      <div class="card hero-card" id="heroCard"></div>
      <div class="card edit-card">
        <h2 class="pixel" style="font-size:24px">Edit profile</h2>
        <div class="field"><label for="pName">Hero name</label><input type="text" id="pName" maxlength="16" value="${esc(draft.name)}"></div>
        <div class="field"><label for="pMotto">Motto <span class="muted" style="font-weight:400">shown on the Guild board</span></label><input type="text" id="pMotto" maxlength="40" value="${esc(draft.motto)}" placeholder="e.g. One bug at a time"></div>
        <div class="field"><label for="pRole">Dream job</label><select id="pRole">${ROLES.map((r, i) => `<option value="${i}" ${i === draft.role ? "selected" : ""}>${r}</option>`).join("")}</select></div>
        <div class="field"><label>Character</label><div class="char-grid light" id="pChars">${SPRITES.map((s, i) => `<button class="char" data-pix="${i}" aria-label="${s.name}" title="${s.name}">${pixelSvg(i)}</button>`).join("")}</div></div>
        <div class="field"><label>Background</label><div class="swatches" id="pCols">${HERO_COLORS.map((c, i) => `<button class="swatch" data-col="${i}" aria-label="Colour ${i + 1}" style="background:${c}"></button>`).join("")}</div></div>
        <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><button class="btn primary" id="pSave">Save profile</button><span class="muted" id="pMsg" style="font-size:13px"></span></div>

        ${S.mode === "cloud" ? "" : `<hr class="sep">
        <h3 class="sub">PIN lock</h3>
        <p class="muted" style="font-size:13.5px">${hasPin ? "Your save file is locked with a PIN." : "Lock your save file so other people on this computer can't play it."} A PIN is a friendly lock for sharing a computer, not bank-level security.</p>
        <div id="pinArea" style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">
          <input type="password" id="newPin" inputmode="numeric" maxlength="4" placeholder="4-digit PIN" class="pin-field" autocomplete="off">
          <button class="btn sm" id="setPin">${hasPin ? "Change PIN" : "Set PIN"}</button>
          ${hasPin ? `<button class="btn sm ghost" id="rmPin">Remove PIN</button>` : ""}
        </div>`}

        <hr class="sep">
        <h3 class="sub">Sync with your other version</h3>
        <p class="muted" style="font-size:13.5px">Playing on another device or browser too? Copy your save code here, then paste it into Profile there. Progress is combined, so nothing from either side is lost.</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center"><button class="btn sm" id="copyCode">Copy my save code</button><span class="muted" id="copyMsg" style="font-size:13px"></span></div>
        <textarea id="codeOut" class="code-box" readonly hidden aria-label="Your save code"></textarea>
        <label class="sr" for="codeIn">Paste a save code</label>
        <textarea id="codeIn" class="code-box" placeholder="Paste a save code from your other version here"></textarea>
        <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center"><button class="btn sm primary" id="useCode">Combine progress</button><span class="muted" id="useMsg" style="font-size:13px"></span></div>

        <hr class="sep">
        <h3 class="sub">Account</h3>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn" id="pOut">${S.mode === "cloud" ? "Back to title screen" : "Switch player"}</button>
        </div>
        <div id="danger" style="margin-top:6px"><button class="btn ghost sm" id="pReset" style="color:var(--danger)">${S.mode === "cloud" ? "Reset all progress" : "Delete profile"}</button></div>

        <details class="dev-opts"><summary><span class="dev-tag">DEV</span> Try new designs</summary>
          <p class="muted">Designs we're testing. They only change this browser, and you can switch back any time.</p>
          ${DEV_SWITCHES.map(([k, name, what]) => `<label class="dev-row"><input type="checkbox" data-feat="${k}" ${FEATURES[k] ? "checked" : ""}><span><b>${name}</b><br><span class="muted">${what}</span></span></label>`).join("")}
          <div class="dev-row dev-bh"><span><b>Boss Hack previews</b><br><span class="muted">Plays over the map. Pick the takeover you like best.</span>
            <span class="dev-bh-btns"><button class="btn sm" data-bh="swarm">A · Pixel Swarm</button><button class="btn sm" data-bh="glitch">B · Glitch Breach</button><button class="btn sm" data-bh="corrupt">C · Corruption</button><button class="btn sm" data-bh="mix">D · A + B mix</button><button class="btn sm ghost" data-bh="banner">Countdown banner</button></span></span></div>
        </details>
      </div>
    </div>
  </div>`;

  const card = () => {
    const rk = rankFor(h.xp).r;
    $("#heroCard").innerHTML = `
      <div class="hero-banner" style="--hc:${HERO_COLORS[draft.color]}">${avatarHtml(draft, "hero")}</div>
      <div class="hero-info">
        <p class="eyebrow">${esc(rk.name)} · ${esc(SPRITES[draft.pix].name)}</p>
        <h1 class="pixel">${esc(draft.name || "???")}</h1>
        ${draft.motto ? `<p class="motto">“${esc(draft.motto)}”</p>` : `<p class="muted">No motto yet.</p>`}
        <span class="role-chip">Aiming for: ${esc(ROLES[draft.role])}</span>
      </div>
      <div class="stat-grid">
        <div><b class="num">${h.xp}</b><span>XP</span></div>
        <div><b class="num">${h.stars}</b><span>Stars</span></div>
        <div><b class="num">${cleared}/${LEVELS.length}</b><span>Levels cleared</span></div>
        <div><b class="num">${liveStreak(h)}</b><span>Day streak</span></div>
        <div><b class="num">${h.best}</b><span>Best streak</span></div>
        <div><b class="num">${readiness()}%</b><span>Job-ready</span></div>
      </div>
      <p class="muted" style="font-size:12.5px">Questing since ${esc(h.created)}. ${S.mode === "cloud" ? "Saved to your Claude account." : "Saved in this browser, file " + S.slot + "."}</p>`;
    $$("#pChars .char").forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.pix === draft.pix)));
    $$("#pCols .swatch").forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.col === draft.color)));
    fixSvgVars($("#heroCard"));
  };
  card();
  $("[data-back]", v).addEventListener("click", () => go({ name: "map" }));
  $("#pName").addEventListener("input", (e) => { draft.name = e.target.value; card(); });
  $("#pMotto").addEventListener("input", (e) => { draft.motto = e.target.value; card(); });
  $("#pRole").addEventListener("change", (e) => { draft.role = +e.target.value; card(); });
  $$("#pChars .char").forEach((b) => b.addEventListener("click", () => { draft.pix = +b.dataset.pix; card(); }));
  $$("#pCols .swatch").forEach((b) => b.addEventListener("click", () => { draft.color = +b.dataset.col; card(); }));
  $("#pSave").addEventListener("click", () => {
    const n = draft.name.trim();
    if (!n) { $("#pMsg").textContent = "Your hero needs a name."; $("#pName").focus(); return; }
    Object.assign(h, { name: n.slice(0, 16), pix: draft.pix, color: draft.color, motto: draft.motto.trim().slice(0, 40), role: draft.role });
    save();
    renderChip();
    $("#pMsg").textContent = "Saved.";
    toast("Profile saved");
  });

  const setPin = $("#setPin");
  if (setPin) {
    const f = $("#newPin");
    f.addEventListener("input", () => { f.value = f.value.replace(/\D/g, "").slice(0, 4); });
    setPin.addEventListener("click", async () => {
      if (f.value.length !== 4) { toast("A PIN needs exactly 4 digits"); f.focus(); return; }
      lsSet(pinKey(S.slot), await hashPin(S.slot, f.value));
      toast("PIN saved");
      renderProfile(v);
    });
    const rm = $("#rmPin");
    if (rm) rm.addEventListener("click", () => { lsSet(pinKey(S.slot), null); toast("PIN removed"); renderProfile(v); });
  }
  $("#copyCode").addEventListener("click", () => {
    const code = encodeSave(S.hero);
    const out = $("#codeOut");
    const showBox = () => { out.hidden = false; out.value = code; out.focus(); out.select(); $("#copyMsg").textContent = "Select all and copy this code."; };
    try {
      navigator.clipboard.writeText(code).then(() => { $("#copyMsg").textContent = "Copied! Paste it into Profile on your other version."; }, showBox);
    } catch (_) { showBox(); }
  });
  $("#useCode").addEventListener("click", () => {
    const other = decodeSave($("#codeIn").value);
    const msg = $("#useMsg");
    if (!other) { msg.textContent = "That doesn't look like a Code Quest save code. Copy the whole thing and try again."; return; }
    const lvls = () => { const n = LEVELS.filter((L) => levelClear(L.id)).length; return n + (n === 1 ? " level" : " levels"); };
    const before = { xp: h.xp, done: lvls() };
    mergeInto(h, other);
    save();
    toast(`<span class="x">Synced</span> ${h.xp} XP · ${lvls()} cleared`);
    renderChip();
    renderNav();
    renderProfile(v);
    $("#useMsg").textContent = `Combined. Was ${before.xp} XP and ${before.done}, now ${h.xp} XP and ${lvls()}.`;
  });
  $("#pOut").addEventListener("click", logOut);
  $$("[data-bh]", v).forEach((b) => b.addEventListener("click", () => {
    const run = { swarm: bossHackSwarm, glitch: bossHackGlitch, corrupt: bossHackCorrupt, mix: bossHackMix, banner: () => bossHackBanner() }[b.dataset.bh];
    go({ name: "map" });
    setTimeout(run, 350);
  }));
  $$("[data-feat]", v).forEach((box) => box.addEventListener("change", () => {
    FEATURES[box.dataset.feat] = box.checked;
    const on = Object.keys(FEATURES).filter((k) => FEATURES[k]);
    try { localStorage.setItem("cq.try", on.length ? on.join(",") : "off"); } catch (_) {}
    toast(`${DEV_SWITCHES.find(([k]) => k === box.dataset.feat)[1]} is ${box.checked ? "on" : "off"}`);
  }));
  $("#pReset").addEventListener("click", () => {
    const cloud = S.mode === "cloud";
    $("#danger").innerHTML = `<div class="notice">${cloud ? "This erases your XP, stars and streak." : `This deletes <b>${esc(h.name)}</b> for good, on this device${netConfigured() ? " and online" : ""}: XP, stars, streak, PIN${netConfigured() ? ", guild spot, play data and feedback" : ""}.`} It can't be undone.
      <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap"><button class="btn sm" id="rNo">Keep it</button><button class="btn sm" id="rYes" style="background:var(--danger);color:#fff;border-color:var(--danger)">${cloud ? "Erase everything" : "Delete " + esc(h.name)}</button></div><p class="fb-err" id="rErr" hidden></p></div>`;
    $("#rNo").addEventListener("click", () => renderProfile(v));
    $("#rYes").addEventListener("click", async () => {
      if (!cloud) {
        const yes = $("#rYes");
        yes.disabled = true; yes.textContent = "Deleting…";
        if (!(await netDeleteMe(S.slot))) {
          yes.disabled = false; yes.textContent = "Try again";
          $("#rErr").textContent = "Couldn't delete the online copy just now, so nothing was deleted. Check your internet and try again.";
          $("#rErr").hidden = false;
          return;
        }
      }
      const ns = draftNS();
      try { Object.keys(localStorage).filter((k) => k.startsWith(ns)).forEach((k) => localStorage.removeItem(k)); } catch (_) {}
      if (cloud) {
        S.hero = blankHero(h.name, h.pix, h.color);
        save();
        go({ name: "map" });
      } else {
        lsSet(slotKey(S.slot), null);
        lsSet(pinKey(S.slot), null);
        S.hero = null;
        logOut();
      }
    });
  });
}

/* ── Save codes: move progress between the claude.ai and desktop versions ── */
function encodeSave(hero) {
  const json = JSON.stringify(hero);
  const bytes = new TextEncoder().encode(json);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return "CQ1." + btoa(bin);
}
function decodeSave(text) {
  const m = /CQ1\.([A-Za-z0-9+/=\s]+)/.exec(String(text || ""));
  if (!m) return null;
  try {
    const bin = atob(m[1].replace(/\s+/g, ""));
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return cleanHero(JSON.parse(new TextDecoder().decode(bytes)));
  } catch (_) { return null; }
}
/* Combine another save into this one, keeping the best of both for every level.
   Name, character and colour stay as they are on this version. */
function mergeInto(h, o) {
  h.xp = Math.max(h.xp, o.xp);
  h.spent = Math.max(h.spent | 0, o.spent | 0);
  h.best = Math.max(h.best, o.best);
  if ((o.last || "") > (h.last || "")) { h.last = o.last; h.streak = o.streak; }
  else if (o.last === h.last) h.streak = Math.max(h.streak, o.streak);
  if (o.created && (!h.created || o.created < h.created)) h.created = o.created;
  for (const [d, x] of Object.entries(o.days || {})) h.days[d] = Math.max(h.days[d] || 0, x);
  for (const [id, b] of Object.entries(o.lv || {})) {
    const a = (h.lv[id] = h.lv[id] || {});
    if (b.l) a.l = 1;
    if (b.b) a.b = 1;
    if (b.d) a.d = 1;
    if (Array.isArray(b.t)) { a.t = a.t || []; b.t.forEach((v, i) => { if (v && (!a.t[i] || v < a.t[i])) a.t[i] = v; }); }
    if (b.c && b.c.ok) a.c = { ok: 1, s: Math.max((a.c && a.c.ok && a.c.s) || 0, b.c.s || 1) };
    if (typeof b.e === "string" && b.e.length > (a.e || "").length) a.e = b.e;
    if (b.lc && typeof b.lc === "object") {   // Learn cards: keep every guess, run and "your turn" done
      a.lc = a.lc || {};
      for (const [k, x] of Object.entries(b.lc)) {
        if (k === "at") { a.lc.at = Math.max(a.lc.at | 0, x | 0); continue; }
        const y = (a.lc[k] = a.lc[k] || {});
        if (y.g == null && x.g != null) y.g = x.g;
        if (x.r) y.r = 1;
        if (x.t) y.t = 1;
      }
    }
  }
  for (const [k, c] of Object.entries(o.cards || {})) {
    const a = h.cards[k];
    if (!a || c.b > a.b || (c.b === a.b && c.due > a.due)) h.cards[k] = { b: c.b | 0, due: String(c.due) };
  }
  for (const [k, arr] of Object.entries(o.home || {})) {
    if (!Array.isArray(arr)) continue;
    const a = (h.home[k] = h.home[k] || []);
    arr.forEach((v, i) => { if (v) a[i] = 1; });
  }
  if (!h.motto && o.motto) h.motto = o.motto;
  if (!h.role && o.role) h.role = o.role;
  recompute();
}
