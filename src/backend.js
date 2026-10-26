/* ───────── Online backend (Supabase) ─────────
   For the GitHub Pages version (S.mode "local"). The browser save stays the source of truth, so the
   game still works offline. Each save slot also gets its own anonymous online identity (no email):
   • its save is backed up online and merged level by level (mergeInto), so nothing is lost;
   • its summary shows on its guild's board;
   • attempts, mistakes and hints are logged to help improve the game;
   • players can send feedback from any screen.
   Tables and security rules live in supabase/schema.sql. */
const NET = { sb: null, uid: null, slot: null, queue: [], timer: null, saveTimer: null, boardTimer: null, lib: null };
const netConfigured = () => !!(CQ_BACKEND.url && CQ_BACKEND.key);
const netOn = () => netConfigured() && S.mode === "local";
const NET_PRIVACY = "Online, the game stores your hero name, progress and attempts (including code you check) to improve the game. No email or real name is needed, so please don't type personal details.";

function netLoad() {
  if (!NET.lib) NET.lib = (window.supabase ? Promise.resolve() : loadScript("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js")).then(() => window.supabase);
  return NET.lib;
}

/* Called when a hero enters the game: sign in (anonymously, once per save slot), merge the online save
   in, and push the result back up. */
async function netStart() {
  if (!netOn() || !S.hero) return false;
  const slot = S.slot || 1;
  try {
    const lib = await netLoad();
    if (NET.slot !== slot || !NET.sb) {
      NET.sb = lib.createClient(CQ_BACKEND.url, CQ_BACKEND.key, { auth: { storageKey: "cq.net.slot" + slot, persistSession: true, autoRefreshToken: true } });
      NET.slot = slot; NET.uid = null; S.others = {};
    }
    let { data: { session } } = await NET.sb.auth.getSession();
    if (!session) {
      const r = await NET.sb.auth.signInAnonymously();
      if (r.error) throw r.error;
      session = r.data.session;
    }
    NET.uid = session.user.id;
    const { data: row, error } = await NET.sb.from("saves").select("data").eq("user_id", NET.uid).maybeSingle();
    if (error) throw error;
    const online = row && cleanHero(row.data);
    if (online) { mergeInto(S.hero, online); recompute(); lsSet(localKey(), S.hero); }
    await netPush();
    setSync("ok", "Saved online");
    netFlushEvents();
    netRefreshBoard();
    return true;
  } catch (e) {
    console.warn("Online save unavailable:", (e && e.message) || e);
    setSync("local", "Saved on this device");
    return false;
  }
}

async function netPush() {
  if (!NET.uid || !S.hero) return;
  const h = S.hero, now = new Date().toISOString();
  const r1 = await NET.sb.from("saves").upsert({ user_id: NET.uid, data: JSON.parse(JSON.stringify(h)), updated_at: now });
  if (r1.error) throw r1.error;
  const r2 = await NET.sb.from("profiles").upsert({
    id: NET.uid, nickname: String(h.name || "Hero").slice(0, 24), pix: h.pix | 0, color: h.color | 0,
    xp: h.xp | 0, stars: h.stars | 0, streak: liveStreak(h) | 0, cur: h.cur || null, levels_done: h.done | 0,
    last_played: /^\d{4}-\d{2}-\d{2}$/.test(h.last || "") ? h.last : null, updated_at: now
  });
  if (r2.error) throw r2.error;
}

/* save() calls this after every local save; uploads are batched to one every couple of seconds. */
function netSave() {
  if (!netOn() || !NET.uid) return;
  clearTimeout(NET.saveTimer);
  NET.saveTimer = setTimeout(() => netPush().then(() => setSync("ok", "Saved online")).catch(() => setSync("local", "Saved on this device · will sync later")), 2000);
}

/* Play data: what players try, get wrong and need help with. Sent in small batches. */
function netLog(kind, level, stage, ok, detail) {
  if (!netOn()) return;
  if (NET.queue.length < 300) NET.queue.push({ kind, level: level || null, stage: stage || null, ok: ok == null ? null : !!ok, detail: detail || null });
  if (NET.queue.length >= 20) netFlushEvents();
  else if (!NET.timer) NET.timer = setTimeout(netFlushEvents, 15000);
}
async function netFlushEvents() {
  clearTimeout(NET.timer); NET.timer = null;
  if (!NET.uid || !NET.queue.length) return;
  const batch = NET.queue.splice(0, 50);
  try { const { error } = await NET.sb.from("events").insert(batch); if (error) throw error; }
  catch (_) { NET.queue.unshift(...batch); }
}
document.addEventListener("visibilitychange", () => { if (document.hidden) { netFlushEvents(); if (NET.saveTimer) { clearTimeout(NET.saveTimer); netPush().catch(() => {}); } } });

/* ───────── Guild (online) ───────── */
async function netGuild() {
  const { data, error } = await NET.sb.rpc("my_guild");
  if (error) throw error;
  return (data && data[0]) || null;
}
/* Fills S.others with guild mates, so the map's side board and the Guild page show them. */
async function netRefreshBoard() {
  if (!NET.uid) return [];
  const { data, error } = await NET.sb.rpc("guild_board");
  if (error) return [];
  const o = {};
  (data || []).forEach((p, i) => { if (!p.is_me) o["g" + i] = { name: p.nickname, pix: p.pix, color: p.color, xp: p.xp, stars: p.stars, streak: p.streak, cur: p.cur, done: p.levels_done, last: p.last_played || "" }; });
  S.others = o;
  return data || [];
}
function netGuildMsg(e) { return esc(String((e && e.message) || e || "Something went wrong").replace(/^.*?: /, "")); }

async function renderNetGuild(v) {
  clearInterval(NET.boardTimer);
  v.innerHTML = `<div class="wrap"><div class="guild"><div><p class="eyebrow">Play together</p><h1>Guild</h1><p class="muted" id="gStatus">Connecting to the guild hall…</p></div><div id="gBody"></div></div></div>`;
  if (!NET.uid && !(await netStart())) {
    $("#gStatus").innerHTML = `Couldn't reach the guild hall. Check your internet connection. <button class="btn sm" id="gRetry">Try again</button>`;
    $("#gRetry").addEventListener("click", () => renderNetGuild(v));
    return;
  }
  let g;
  try { g = await netGuild(); } catch (e) { $("#gStatus").textContent = "Couldn't load your guild. Try again in a minute."; return; }
  const body = $("#gBody"), status = $("#gStatus");
  if (!g) {
    status.textContent = "Join your friends' guild with their code, or start a new one and share yours.";
    body.innerHTML = `<div class="guild-forms">
      <div class="card"><h3>Join a guild</h3><label class="sr" for="gCode">Guild code</label><input id="gCode" class="pinput" maxlength="8" placeholder="ABC123" autocomplete="off" style="text-transform:uppercase"><p class="fb-err" id="gJoinErr" hidden></p><button class="btn primary" id="gJoin">Join</button></div>
      <div class="card"><h3>Start a guild</h3><label class="sr" for="gName">Guild name</label><input id="gName" class="pinput" maxlength="32" placeholder="The Debug Dragons" autocomplete="off"><p class="fb-err" id="gMakeErr" hidden></p><button class="btn" id="gMake">Create</button></div>
    </div><p class="muted" style="font-size:12.5px">${NET_PRIVACY}</p>`;
    const err = (id, msg) => { const el = $(id); el.innerHTML = msg; el.hidden = !msg; };
    $("#gCode").addEventListener("input", () => err("#gJoinErr", ""));
    $("#gName").addEventListener("input", () => err("#gMakeErr", ""));
    $("#gJoin").addEventListener("click", async () => {
      const code = $("#gCode").value.trim();
      if (!/^[A-Za-z0-9]{6}$/.test(code)) return err("#gJoinErr", "Enter the 6-character code your friend shared.");
      const { error } = await NET.sb.rpc("join_guild", { p_code: code });
      if (error) return err("#gJoinErr", netGuildMsg(error));
      toast("Welcome to the guild!"); renderNetGuild(v);
    });
    $("#gMake").addEventListener("click", async () => {
      const name = $("#gName").value.trim();
      if (name.length < 2) return err("#gMakeErr", "Give your guild a name (at least 2 letters).");
      const { error } = await NET.sb.rpc("create_guild", { p_name: name });
      if (error) return err("#gMakeErr", netGuildMsg(error));
      toast("Guild created. Share the code!"); renderNetGuild(v);
    });
    return;
  }
  const draw = (rows) => {
    status.innerHTML = `<b>${esc(g.name)}</b> · ${g.members} player${g.members === 1 ? "" : "s"}. The board refreshes while you're here.`;
    body.innerHTML = `<div class="card" style="padding:6px 0"><div class="table-scroll"><table class="lb">
      <thead><tr><th>#</th><th>Hero</th><th>Where</th><th class="n">Stars</th><th class="n">Streak</th><th class="n">XP</th></tr></thead>
      <tbody>${rows.map((r, i) => { const p = { name: r.nickname, pix: r.pix, color: r.color, xp: r.xp, stars: r.stars, streak: r.streak, cur: r.cur, last: r.last_played || "" };
        return `<tr class="${r.is_me ? "me" : ""}"><td class="r">${i + 1}</td><td><span class="who">${avatarHtml(p, "sm")}<span>${esc(p.name)}${r.is_me ? " (you)" : ""}<br><span class="muted" style="font-weight:400;font-size:12px">${esc(rankFor(p.xp).r.name)}</span></span></span></td><td>${esc(placeOf(p).label)}</td><td class="n">${p.stars | 0}</td><td class="n">${p.streak | 0}</td><td class="n pixel" style="font-size:17px">${p.xp | 0}</td></tr>`; }).join("")}</tbody>
    </table></div></div>
    <div class="card side-card prose"><h3 style="margin-top:0">Invite friends</h3><p>Share this code. They open the game, go to <b>Guild</b> and type it in.</p>
      <p class="guild-code"><code>${esc(g.code)}</code> <button class="btn sm" id="gCopy">Copy</button></p>
      <p class="muted" style="font-size:12.5px">${NET_PRIVACY}</p><button class="btn ghost sm" id="gLeave">Leave guild</button></div>`;
    $("#gCopy").addEventListener("click", () => { try { navigator.clipboard.writeText(g.code); toast("Code copied"); } catch (_) { toast("Code: " + g.code); } });
    $("#gLeave").addEventListener("click", async () => {
      if (!confirm("Leave " + g.name + "? You can join again with the code.")) return;
      const { error } = await NET.sb.rpc("leave_guild");
      if (error) return toast(netGuildMsg(error));
      S.others = {}; renderNetGuild(v);
    });
  };
  draw(await netRefreshBoard());
  NET.boardTimer = setInterval(async () => { if (S.route.name !== "guild") return clearInterval(NET.boardTimer); draw(await netRefreshBoard()); }, 30000);
}

/* ───────── Feedback ───────── */
function openFeedback() {
  const r = S.route, where = r.name === "level" ? `Level ${r.id}${r.stage ? " · " + r.stage : ""}` : r.name;
  let rating = 0;
  openModal(`<p class="eyebrow">Feedback</p><h2>Tell us what you think</h2>
    <p class="muted">Confusing, broken, boring or brilliant? It goes straight to the people making the game.</p>
    <div class="fb-rate" role="group" aria-label="How is it going?">${[1, 2, 3, 4, 5].map((n) => `<button type="button" class="chip" data-r="${n}" aria-pressed="false">${"★".repeat(n)}</button>`).join("")}</div>
    <label class="sr" for="fbMsg">Your message</label>
    <textarea id="fbMsg" maxlength="2000" placeholder="What happened? What did you expect?"></textarea>
    <p class="muted" style="font-size:12px">About: ${esc(where)}. Please don't include personal details.</p>
    <p class="fb-err" id="fbErr" hidden></p>
    <div class="row"><button class="btn" data-close>Cancel</button><button class="btn primary" id="fbSend">Send</button></div>`, {
    onOpen: (bg) => {
      $$("[data-r]", bg).forEach((b) => b.addEventListener("click", () => { rating = +b.dataset.r; $$("[data-r]", bg).forEach((x) => x.setAttribute("aria-pressed", String(x === b))); }));
      const msg = $("#fbMsg", bg), errEl = $("#fbErr", bg);
      msg.addEventListener("input", () => { errEl.hidden = true; });
      $("#fbSend", bg).addEventListener("click", async () => {
        const text = msg.value.trim();
        if (!text) { errEl.textContent = "Write a few words first."; errEl.hidden = false; msg.focus(); return; }
        if (!netOn() || (!NET.uid && !(await netStart()))) { errEl.textContent = "Feedback needs an internet connection. Copy your message and try again later."; errEl.hidden = false; return; }
        const { error } = await NET.sb.from("feedback").insert({ level: r.name === "level" ? r.id : null, stage: r.stage || r.name, rating: rating || null, message: text.slice(0, 2000) });
        if (error) { errEl.textContent = "Couldn't send it. Try again in a minute."; errEl.hidden = false; return; }
        closeModal(); toast("Thanks! Your feedback was sent.");
      });
    }
  });
}
