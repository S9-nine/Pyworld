/* Profile page: hero card, edit form, PIN lock and account actions. */

const ROLES = ["Not sure yet", "Backend developer", "Data analyst", "Automation / QA engineer", "Full-stack developer", "AI / ML engineer"];

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
          <input type="password" id="newPin" inputmode="numeric" maxlength="4" placeholder="New 4-digit PIN" class="pin-field" autocomplete="off">
          <button class="btn sm" id="setPin">${hasPin ? "Change PIN" : "Set PIN"}</button>
          ${hasPin ? `<button class="btn sm ghost" id="rmPin">Remove PIN</button>` : ""}
        </div>`}

        <hr class="sep">
        <h3 class="sub">Account</h3>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn" id="pOut">${S.mode === "cloud" ? "Back to title screen" : "Switch player"}</button>
        </div>
        <div id="danger" style="margin-top:6px"><button class="btn ghost sm" id="pReset" style="color:var(--danger)">${S.mode === "cloud" ? "Reset all progress" : "Delete this save file"}</button></div>
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
  $("#pOut").addEventListener("click", logOut);
  $("#pReset").addEventListener("click", () => {
    const cloud = S.mode === "cloud";
    $("#danger").innerHTML = `<div class="notice">${cloud ? "This erases your XP, stars and streak." : "This deletes save file " + S.slot + " for good: XP, stars, streak and PIN."} It can't be undone.
      <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap"><button class="btn sm" id="rNo">Keep it</button><button class="btn sm" id="rYes" style="background:var(--danger);color:#fff;border-color:var(--danger)">${cloud ? "Erase everything" : "Delete file"}</button></div></div>`;
    $("#rNo").addEventListener("click", () => renderProfile(v));
    $("#rYes").addEventListener("click", () => {
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
