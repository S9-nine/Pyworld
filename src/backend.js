/* ───────── Online backend (Supabase) ─────────
   For the GitHub Pages version (S.mode "local"). The browser save stays the source of truth, so the
   game still works offline. Each save slot also gets its own anonymous online identity (no email):
   • its save is backed up online and merged level by level (mergeInto), so nothing is lost;
   • its summary shows on its guild's board;
   • attempts, mistakes and hints are logged to help improve the game;
   • players can send feedback from any screen.
   Tables and security rules live in supabase/schema.sql, hardening.sql and sessions.sql. */
const NET = { sb: null, uid: null, slot: null, queue: [], timer: null, saveTimer: null, boardTimer: null, lib: null, session: null, lastLog: 0, noSession: false, chatTimer: null, chatChan: null };
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
    // A saved login can outlive its user (for example after old test players are deleted in the
    // dashboard). Check it with the server, and start a fresh anonymous login if it's gone; the
    // browser save is merged back up below, so no progress is lost.
    if (session) {
      const { error: gone } = await NET.sb.auth.getUser();
      if (gone) { await NET.sb.auth.signOut({ scope: "local" }); session = null; }
    }
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

/* "Delete profile": erase this slot's online copy, then forget its login so a new hero in the same
   slot starts clean instead of pulling the old progress back in. Returns false if the server
   couldn't be reached, so nothing is deleted halfway. */
async function netDeleteMe(slot) {
  const loginKey = "cq.net.slot" + slot;
  let hasLogin = false;
  try { hasLogin = !!localStorage.getItem(loginKey); } catch (_) {}
  if (NET.sb) netStopGuild();
  if (netConfigured() && hasLogin) {
    clearTimeout(NET.saveTimer); clearTimeout(NET.timer); NET.queue = [];
    if (NET.slot !== slot || !NET.uid) await netStart();
    if (!NET.uid) return false;
    const { error } = await NET.sb.rpc("delete_me");
    if (error) { console.warn("Delete profile:", error.message); return false; }
    await NET.sb.auth.signOut({ scope: "local" }).catch(() => {});
  }
  try { localStorage.removeItem(loginKey); } catch (_) {}
  if (NET.slot === slot) { NET.sb = null; NET.slot = null; NET.uid = null; S.others = {}; }
  return true;
}

/* save() calls this after every local save; uploads are batched to one every couple of seconds. */
function netSave() {
  if (!netOn() || !NET.uid) return;
  clearTimeout(NET.saveTimer);
  NET.saveTimer = setTimeout(() => netPush().then(() => setSync("ok", "Saved online")).catch(() => setSync("local", "Saved on this device · will sync later")), 2000);
}

/* Play data: what players try, get wrong and need help with. Sent in small batches. */
/* One id per sitting (a new one after 30 quiet minutes), so a visit can be followed start to finish. */
function netSession() {
  const now = Date.now();
  if (!NET.session || now - NET.lastLog > 30 * 60 * 1000) {
    NET.session = crypto.randomUUID ? crypto.randomUUID() : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) => (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16));
  }
  NET.lastLog = now;
  return NET.session;
}
function netLog(kind, level, stage, ok, detail) {
  if (!netOn()) return;
  const row = { kind, level: level || null, stage: stage || null, ok: ok == null ? null : !!ok, detail: detail || null };
  if (!NET.noSession) row.session_id = netSession();
  if (NET.queue.length < 300) NET.queue.push(row);
  if (NET.queue.length >= 20) netFlushEvents();
  else if (!NET.timer) NET.timer = setTimeout(netFlushEvents, 15000);
}
async function netFlushEvents() {
  clearTimeout(NET.timer); NET.timer = null;
  if (!NET.uid || !NET.queue.length) return;
  const batch = NET.queue.splice(0, 50);
  try {
    let { error } = await NET.sb.from("events").insert(batch);
    // A database without the session column yet (sessions.sql not run): send without it.
    if (error && /session_id/.test(error.message || "")) {
      NET.noSession = true;
      batch.forEach((r) => delete r.session_id);
      ({ error } = await NET.sb.from("events").insert(batch));
    }
    if (error) throw error;
  }
  catch (_) { NET.queue.unshift(...batch); }
}
document.addEventListener("visibilitychange", () => { if (document.hidden) { netFlushEvents(); if (NET.saveTimer) { clearTimeout(NET.saveTimer); netPush().catch(() => {}); } } });

/* ───────── Guilds (online): up to 5 per player, each with a board and a chat ───────── */
async function netGuilds() {
  const { data, error } = await NET.sb.rpc("my_guilds");
  if (error) throw error;
  return data || [];
}
/* Fills S.others with guild mates (everyone from all my guilds, once each), so the map's side board
   shows them. With a guild id, returns just that guild's board. */
async function netRefreshBoard(guildId) {
  if (!NET.uid) return [];
  let { data, error } = await NET.sb.rpc("guild_board_for", { p_guild: guildId || null });
  if (error && !guildId) ({ data, error } = await NET.sb.rpc("guild_board"));   // database not upgraded yet
  if (error) return [];
  if (!guildId) {
    const o = {};
    (data || []).forEach((p, i) => { if (!p.is_me) o["g" + i] = { name: p.nickname, pix: p.pix, color: p.color, xp: p.xp, stars: p.stars, streak: p.streak, cur: p.cur, done: p.levels_done, last: p.last_played || "" }; });
    S.others = o;
  }
  return data || [];
}
function netGuildMsg(e) { return esc(String((e && e.message) || e || "Something went wrong").replace(/^.*?: /, "")); }
function netStopGuild() {
  clearInterval(NET.boardTimer); clearInterval(NET.chatTimer);
  if (NET.chatChan) { NET.sb.removeChannel(NET.chatChan); NET.chatChan = null; }
}
const guildPick = () => "cq.guild.slot" + (S.slot || 1);

async function renderNetGuild(v, pickId) {
  netStopGuild();
  v.innerHTML = `<div class="wrap"><div class="guild"><div><p class="eyebrow">Play together</p><h1>Guild</h1><p class="muted" id="gStatus">Connecting to the guild hall…</p></div><div id="gTabs"></div><div id="gBody"></div></div></div>`;
  if (!NET.uid && !(await netStart())) {
    $("#gStatus").innerHTML = `Couldn't reach the guild hall. Check your internet connection. <button class="btn sm" id="gRetry">Try again</button>`;
    $("#gRetry").addEventListener("click", () => renderNetGuild(v));
    return;
  }
  let gs;
  try { gs = await netGuilds(); } catch (e) { $("#gStatus").textContent = "Couldn't load your guilds. Try again in a minute."; return; }
  if (pickId) lsSet(guildPick(), pickId);
  const want = pickId === "new" ? "new" : lsGet(guildPick());
  const g = want === "new" ? null : gs.find((x) => x.id === want) || gs[0];
  const status = $("#gStatus"), body = $("#gBody");
  // Tabs: one per guild, plus "Join or start" while there's room (5 max).
  if (gs.length) {
    $("#gTabs").innerHTML = `<div class="g-tabs" role="tablist">${gs.map((x) => `<button class="g-tab${g && x.id === g.id ? " on" : ""}" role="tab" aria-selected="${!!(g && x.id === g.id)}" data-g="${esc(x.id)}">${esc(x.name)}</button>`).join("")}${gs.length < 5 ? `<button class="g-tab add${g ? "" : " on"}" data-g="new">+ Join or start</button>` : ""}</div>`;
    $$(".g-tab", v).forEach((b) => b.addEventListener("click", () => renderNetGuild(v, b.dataset.g)));
  }
  if (!g) {
    status.textContent = gs.length ? "Join another guild with a friend's code, or start a new one. You can be in up to 5." : "Join your friends' guild with their code, or start a new one and share yours.";
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
      const { data, error } = await NET.sb.rpc("join_guild", { p_code: code });
      if (error) return err("#gJoinErr", netGuildMsg(error));
      if (!data || !data.length) return err("#gJoinErr", "No guild with that code. Check it and try again.");
      toast("Welcome to the guild!"); netRefreshBoard(); renderNetGuild(v, data[0].id);
    });
    $("#gMake").addEventListener("click", async () => {
      const name = $("#gName").value.trim();
      if (name.length < 2) return err("#gMakeErr", "Give your guild a name (at least 2 letters).");
      const { data, error } = await NET.sb.rpc("create_guild", { p_name: name });
      if (error) return err("#gMakeErr", netGuildMsg(error));
      toast("Guild created. Share the code!"); renderNetGuild(v, data && data[0] && data[0].id);
    });
    return;
  }
  status.innerHTML = `<b>${esc(g.name)}</b> · ${g.members} player${g.members === 1 ? "" : "s"}${g.is_owner ? " · you started it" : ""}`;
  body.innerHTML = `<div class="g-grid">
    <div class="card chat" id="gChat"><div class="chat-head"><h3>Guild chat</h3><span class="muted" id="chatLive">connecting…</span></div>
      <div class="chat-list" id="chatList" aria-live="polite"><p class="muted chat-empty">Loading messages…</p></div>
      <form class="chat-send" id="chatForm"><label class="sr" for="chatIn">Message</label>
        <textarea id="chatIn" rows="1" maxlength="500" placeholder="Say hi, ask for help, share a win…"></textarea>
        <button class="btn primary" id="chatBtn" type="submit">Send</button></form>
      <p class="fb-err" id="chatErr" hidden></p>
      <p class="muted chat-note">Be kind. Never share your real name, school, phone number or address here.</p></div>
    <div class="card" style="padding:6px 0" id="gBoard"></div>
    <div class="card side-card prose"><h3 style="margin-top:0">Invite friends</h3><p>Share this code. They open the game, go to <b>Guild</b> and type it in.</p>
      <p class="guild-code"><code>${esc(g.code)}</code> <button class="btn sm" id="gCopy">Copy</button></p>
      <p class="muted" style="font-size:12.5px">${NET_PRIVACY}</p><button class="btn ghost sm" id="gLeave">Leave ${esc(g.name)}</button></div></div>`;
  $("#gCopy").addEventListener("click", () => { try { navigator.clipboard.writeText(g.code); toast("Code copied"); } catch (_) { toast("Code: " + g.code); } });
  $("#gLeave").addEventListener("click", async () => {
    if (!confirm("Leave " + g.name + "? You can join again with the code.")) return;
    const { error } = await NET.sb.rpc("leave_guild_id", { p_guild: g.id });
    if (error) return toast(netGuildMsg(error));
    lsSet(guildPick(), null); netRefreshBoard(); renderNetGuild(v);
  });

  const drawBoard = (rows) => {
    const el = $("#gBoard", v); if (!el) return;
    el.innerHTML = `<div class="table-scroll"><table class="lb">
      <thead><tr><th>#</th><th>Hero</th><th>Where</th><th class="n">Stars</th><th class="n">Streak</th><th class="n">XP</th></tr></thead>
      <tbody>${rows.map((r, i) => { const p = { name: r.nickname, pix: r.pix, color: r.color, xp: r.xp, stars: r.stars, streak: r.streak, cur: r.cur, last: r.last_played || "" };
        return `<tr class="${r.is_me ? "me" : ""}"><td class="r">${i + 1}</td><td><span class="who">${avatarHtml(p, "sm")}<span>${esc(p.name)}${r.is_me ? " (you)" : ""}<br><span class="muted" style="font-weight:400;font-size:12px">${esc(rankFor(p.xp).r.name)}</span></span></span></td><td>${esc(placeOf(p).label)}</td><td class="n">${p.stars | 0}</td><td class="n">${p.streak | 0}</td><td class="n pixel" style="font-size:17px">${p.xp | 0}</td></tr>`; }).join("")}</tbody>
    </table></div>`;
  };
  drawBoard(await netRefreshBoard(g.id));
  NET.boardTimer = setInterval(async () => { if (S.route.name !== "guild") return netStopGuild(); drawBoard(await netRefreshBoard(g.id)); }, 30000);
  netChat(v, g);
}

/* Guild chat: the latest 100 messages, live. New messages arrive through Supabase Realtime, with a
   slow refresh as a fallback. Everything is shown as plain text (esc), so links and code can't run. */
function netChat(v, g) {
  const list = $("#chatList", v), input = $("#chatIn", v), form = $("#chatForm", v), errEl = $("#chatErr", v), live = $("#chatLive", v);
  let lastKey = null;
  const when = (t) => {
    const d = new Date(t), hm = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    return d.toDateString() === new Date().toDateString() ? hm : d.toLocaleDateString([], { day: "numeric", month: "short" }) + " " + hm;
  };
  const load = async () => {
    if (S.route.name !== "guild" || !document.body.contains(list)) return netStopGuild();
    const { data, error } = await NET.sb.rpc("guild_chat", { p_guild: g.id });
    if (error) { live.textContent = "can't reach chat"; return; }
    const key = (data || []).map((m) => m.id).join(",");
    if (key === lastKey) return;
    const first = lastKey === null, atBottom = list.scrollHeight - list.scrollTop - list.clientHeight < 60;
    lastKey = key;
    list.innerHTML = data.length ? data.map((m) => `<div class="msg${m.is_me ? " me" : ""}" data-id="${m.id}">
        ${m.is_me ? "" : avatarHtml({ pix: m.pix, color: m.color }, "sm")}
        <div class="bubble"><div class="msg-meta"><b>${m.is_me ? "You" : esc(m.nickname)}</b> <span>${esc(when(m.at))}</span>${m.can_delete ? `<button class="msg-del" type="button" title="Delete message" aria-label="Delete message">×</button>` : ""}</div><div class="msg-body">${esc(m.body)}</div></div></div>`).join("")
      : `<p class="muted chat-empty">No messages yet. Say hi to your guild!</p>`;
    if (first || atBottom) list.scrollTop = list.scrollHeight;
  };
  list.addEventListener("click", async (e) => {
    const del = e.target.closest(".msg-del"); if (!del) return;
    if (!confirm("Delete this message for everyone?")) return;
    const { error } = await NET.sb.from("guild_messages").delete().eq("id", del.closest(".msg").dataset.id);
    if (error) return toast("Couldn't delete it. Try again.");
    load();
  });
  const send = async () => {
    const text = input.value.trim();
    if (!text) return;
    const btn = $("#chatBtn", v); btn.disabled = true;
    const { error } = await NET.sb.from("guild_messages").insert({ guild_id: g.id, body: text.slice(0, 500) });
    btn.disabled = false;
    if (error) { errEl.textContent = /Slow down|a lot of chat/.test(error.message || "") ? error.message : "Couldn't send it. Check your internet and try again."; errEl.hidden = false; return; }
    errEl.hidden = true; input.value = ""; input.style.height = "";
    await load(); list.scrollTop = list.scrollHeight; input.focus();
  };
  form.addEventListener("submit", (e) => { e.preventDefault(); send(); });
  input.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } });
  input.addEventListener("input", () => { errEl.hidden = true; input.style.height = ""; input.style.height = Math.min(input.scrollHeight, 120) + "px"; });
  load();
  NET.chatChan = NET.sb.channel("guild-chat-" + g.id)
    .on("postgres_changes", { event: "*", schema: "public", table: "guild_messages", filter: "guild_id=eq." + g.id }, () => load())
    .subscribe((st) => { const on = st === "SUBSCRIBED"; live.textContent = on ? "● live" : "refreshing every 15s"; live.classList.toggle("on", on); });
  NET.chatTimer = setInterval(load, 15000);
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
        const send = $("#fbSend", bg);
        send.disabled = true;
        const { error } = await NET.sb.from("feedback").insert({ level: r.name === "level" ? r.id : null, stage: r.stage || r.name, rating: rating || null, message: text.slice(0, 2000) });
        send.disabled = false;
        if (error) { errEl.textContent = /feedback/i.test(error.message || "") ? error.message : "Couldn't send it. Try again in a minute."; errEl.hidden = false; return; }
        closeModal(); toast("Thanks! Your feedback was sent.");
      });
    }
  });
}
