/* ───────── Privacy Policy and Terms ─────────
   Plain-language versions shown in the game (More → Privacy & Terms, Profile, and when creating a hero).
   LEGAL_VERSION goes up when either changes in a way players should agree to again. These were written
   to match what the game really does; have them reviewed by a lawyer before charging money. */
const LEGAL_VERSION = 1;
const LEGAL_UPDATED = "29 October 2026";
const legalContact = () => (CQ_BACKEND.contact
  ? `email <a href="mailto:${esc(CQ_BACKEND.contact)}">${esc(CQ_BACKEND.contact)}</a>`
  : `use the <b>Feedback</b> button in the game and start your message with "Privacy" or "Safety"`);

const LEGAL = {
  privacy: () => `
    <p class="eyebrow">Last updated ${LEGAL_UPDATED}</p><h2>Privacy Policy</h2>
    <div class="legal-sum"><b>In short:</b> no email, phone number or real name is needed. Your progress lives in your browser.
      Online features (cloud backup, guilds, chat, feedback) store your hero name, progress and play data on servers in India,
      to run the game and make the lessons better. We never sell data or show ads. Players under 18 need a parent's or guardian's OK for online features.
      You can delete everything with <b>Delete profile</b>.</div>

    <h3>Who we are</h3>
    <p>Code Quest is a learning game made by an independent developer in India ("we", "us"). To ask anything about your data, ${legalContact()}.</p>

    <h3>What we collect</h3>
    <p><b>On your device only.</b> Your hero (name, character, progress), your drafts and your optional PIN are saved in your browser. They don't leave your device unless online features are on.</p>
    <p><b>When online features are on</b> (adults, or players whose parent or guardian agreed):</p>
    <ul>
      <li>an anonymous account ID made by the game. No email, phone or password.</li>
      <li>your hero name, character, XP, stars, streak and where you are in the game (shown to your guild mates), and a backup copy of your save.</li>
      <li>play data: which checks pass or fail, the code you check, hints you use, your Think and Explain answers, how long each step takes, and when you play.</li>
      <li>feedback you send, your guilds, and the messages you write in guild chat (your guild mates can read these).</li>
    </ul>
    <p><b>Only if you switch it on</b> (Profile → Your data → "Help train Code Quest's AI tutor"): the code from each Run, what it printed or which error it hit, and how far into the step you were.</p>
    <p><b>Technical data.</b> The services that deliver the website see your IP address and browser details, like any website: GitHub Pages (hosting), Google Fonts and jsDelivr (fonts and a code library), and Supabase (our database).</p>

    <h3>Why we use it</h3>
    <ul>
      <li>to run the game: back up your progress, show guild boards, deliver chat.</li>
      <li>to improve the lessons: find the steps people get stuck on, and the mistakes they make.</li>
      <li>to keep players safe: limits on spam, and reports of messages that break the rules.</li>
      <li>to train Code Quest's own AI tutor, only with your permission (above).</li>
    </ul>
    <p>We don't sell your data, show ads, or build profiles for advertising.</p>

    <h3>Children</h3>
    <p>Anyone can play. If you're under 18, online features stay off until your parent or guardian agrees in the game. Until then, everything stays on your device and nothing about how you play is sent to us. A parent or guardian can withdraw their OK at any time from Profile.</p>

    <h3>Where it's stored, and for how long</h3>
    <p>Online data is stored by Supabase, our database provider, on servers in Mumbai, India. Play data and chat messages are deleted automatically after 12 months. Your profile and save stay until you delete them. Feedback is kept up to 24 months.</p>

    <h3>Your rights</h3>
    <ul>
      <li><b>Delete:</b> Profile → <b>Delete profile</b> erases your hero on this device and everything about it online (save, progress, play data, chat messages, feedback).</li>
      <li><b>Correct:</b> change your hero name and details in Profile.</li>
      <li><b>Withdraw consent:</b> switch off the AI tutor option, or the parent OK, in Profile at any time.</li>
      <li><b>Ask or complain:</b> ${legalContact()}. We aim to reply within 7 days. If you're not satisfied, you can complain to India's Data Protection Board.</li>
    </ul>

    <h3>Security</h3>
    <p>Data travels over encrypted connections (HTTPS). The database only lets each player read and change their own data, and only guild members can read their guild's chat. If a breach ever affects your data, we'll tell you and the authorities as the law requires.</p>

    <h3>Changes</h3>
    <p>If we change this policy in a way that matters, the game will ask you to agree again.</p>`,

  terms: () => `
    <p class="eyebrow">Last updated ${LEGAL_UPDATED}</p><h2>Terms of Use</h2>
    <div class="legal-sum"><b>In short:</b> be kind, keep personal details private, don't break the game, and remember it's a learning game, not a job guarantee.</div>

    <h3>Using Code Quest</h3>
    <p>By creating a hero you agree to these terms and the Privacy Policy. If you're under 18, a parent or guardian needs to agree before you use online features (cloud backup, guilds, chat, feedback).</p>

    <h3>Learning, not a promise</h3>
    <p>Code Quest teaches programming through practice. It doesn't promise a job, a grade or any other result, and lessons may contain mistakes. The game is provided "as is", and features may change or stop.</p>

    <h3>Guilds and chat rules</h3>
    <ul>
      <li>Be kind. No bullying, hate, threats, sexual content, scams or spam.</li>
      <li>Never share personal details: your real full name, school, address, phone number, social media or photos. Links and phone numbers are blocked in chat.</li>
      <li>Never arrange to meet someone from the game, and tell a trusted adult if anyone makes you uncomfortable.</li>
      <li>Report messages that break these rules. Messages reported by several players are hidden, guild masters can delete messages in their guild, and we may remove content, heroes or guilds that break the rules.</li>
    </ul>

    <h3>Your work</h3>
    <p>Your code and answers are yours. You let us store and show them to run the game (for example, guild mates see your chat messages), and use them to improve the lessons. We use them to train our AI tutor only if you switch that option on.</p>

    <h3>Our work</h3>
    <p>The lessons, art, characters and code of Code Quest belong to us. Please don't copy or republish them without permission. Open-source parts (fonts and libraries) keep their own licences.</p>

    <h3>Fair play</h3>
    <p>Don't attack, overload or reverse-engineer the servers, get around the safety limits, or use bots or scripts to play or collect data.</p>

    <h3>Payments</h3>
    <p>Code Quest is free right now. If paid features are added, their price and refund policy will be shown clearly before you pay.</p>

    <h3>Ending</h3>
    <p>You can stop at any time and delete your profile. We may suspend online features for players who break these rules.</p>

    <h3>Law and contact</h3>
    <p>These terms are governed by the laws of India. Questions or complaints: ${legalContact()}.</p>`
};

function openLegal(which = "privacy") {
  openModal(`<div class="legal">
      <div class="legal-tabs"><button class="btn sm${which === "privacy" ? " primary" : ""}" data-legal="privacy">Privacy Policy</button><button class="btn sm${which === "terms" ? " primary" : ""}" data-legal="terms">Terms of Use</button></div>
      <div class="legal-body">${LEGAL[which]()}</div>
      <div class="row" style="justify-content:flex-end"><button class="btn" data-close>Close</button></div></div>`,
    { onOpen: (bg) => {
      $(".modal", bg).classList.add("wide");
      $$("[data-legal]", bg).forEach((b) => b.addEventListener("click", () => openLegal(b.dataset.legal)));
    } });
}

/* ───────── Age and a parent's OK ─────────
   Players say their age when they create a hero (existing heroes are asked once). Online features
   (cloud backup, guilds, chat, feedback, play data) only switch on for adults, or for under-18s whose
   parent or guardian agrees on the parent screen. Without that, the game runs fully on the device. */
const AGE_BANDS = [["u13", "Under 13"], ["teen", "13 to 17"], ["adult", "18 or older"]];
const isMinor = (h = S.hero) => !!h && h.age !== "adult";
function onlineAllowed(h = S.hero) {
  return !!h && !!h.terms && (h.terms.v | 0) >= LEGAL_VERSION && (h.age === "adult" || !!(h.parent && h.parent.ok));
}
const legalNeeded = () => S.mode === "local" && netConfigured();
function needsQuickCheck(h = S.hero) { return legalNeeded() && !!h && (!h.age || !h.terms || (h.terms.v | 0) < LEGAL_VERSION); }
const ageAgreeHtml = (age, agreed) => `
  <div class="age-pick" role="radiogroup" aria-label="How old are you?">${AGE_BANDS.map(([k, t]) => `<button type="button" class="age-btn" role="radio" aria-checked="${age === k}" data-age="${k}">${t}</button>`).join("")}</div>
  <label class="agree"><input type="checkbox" id="agreeBox" ${agreed ? "checked" : ""}><span>I agree to the <a href="#" data-open-legal="terms">Terms of Use</a> and <a href="#" data-open-legal="privacy">Privacy Policy</a>.</span></label>`;
function bindAgeAgree(root, state) {
  $$(".age-btn", root).forEach((b) => b.addEventListener("click", () => {
    state.age = b.dataset.age;
    $$(".age-btn", root).forEach((x) => x.setAttribute("aria-checked", String(x === b)));
  }));
  $$("[data-open-legal]", root).forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); openLegal(a.dataset.openLegal); }));
}
/* Asked once of heroes made before ages were asked (or after the terms change). */
function openQuickCheck(then) {
  const h = S.hero, st = { age: h.age || "" };
  openModal(`<div class="qcheck"><p class="eyebrow">Quick check</p><h2>Before you carry on, ${esc(h.name)}</h2>
      <p>To keep cloud backup, guilds and chat on, we need your age group and your OK to our Terms. How old are you?</p>
      ${ageAgreeHtml(st.age, false)}<p class="fb-err" id="qcErr" hidden></p>
      <div class="row" style="justify-content:flex-end"><button class="btn" data-close>Not now</button><button class="btn primary" id="qcGo">Continue</button></div></div>`,
    { onOpen: (bg) => {
      bindAgeAgree(bg, st);
      $("#qcGo", bg).addEventListener("click", () => {
        const err = $("#qcErr", bg);
        if (!st.age) { err.textContent = "Pick your age group."; err.hidden = false; return; }
        if (!$("#agreeBox", bg).checked) { err.textContent = "Tick the box to agree to the Terms and Privacy Policy."; err.hidden = false; return; }
        h.age = st.age; h.terms = { v: LEGAL_VERSION, at: today() };
        save(); closeModal();
        if (isMinor() && !(h.parent && h.parent.ok)) openParentOk(then); else then();
      });
    } });
}
/* The parent screen: what online features are, and a parent or guardian agreeing (or playing offline). */
function openParentOk(then) {
  const h = S.hero;
  openModal(`<div class="parent-ok"><p class="eyebrow">For a parent or guardian</p><h2>Can ${esc(h.name)} use online features?</h2>
      <p>Code Quest works fully offline on this device. Online features add:</p>
      <ul><li><b>Cloud backup</b> of progress</li><li><b>Guilds and chat</b> with friends who share a guild code (links and phone numbers are blocked, and messages can be reported)</li>
        <li><b>Play data</b> (answers, mistakes, time per step) used only to improve the lessons</li></ul>
      <p>No email, phone number or real name is collected. Read the <a href="#" data-open-legal="privacy">Privacy Policy</a> and <a href="#" data-open-legal="terms">Terms</a>. You can switch this off, or delete everything, from Profile at any time.</p>
      <label class="plabel-s" for="poName">Parent or guardian's name</label>
      <input id="poName" class="po-input" maxlength="40" autocomplete="off" placeholder="Your name">
      <label class="agree"><input type="checkbox" id="poBox"><span>I'm ${esc(h.name)}'s parent or guardian, and I agree to these online features.</span></label>
      <p class="fb-err" id="poErr" hidden></p>
      <div class="row" style="justify-content:flex-end;flex-wrap:wrap"><button class="btn" id="poNo">Play offline for now</button><button class="btn primary" id="poYes">Parent agrees</button></div></div>`,
    { dismiss: false, onOpen: (bg) => {
      $$("[data-open-legal]", bg).forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); openLegal(a.dataset.openLegal); }));
      $("#poNo", bg).addEventListener("click", () => { h.parent = { ok: false, at: today() }; save(); closeModal(); toast("Playing offline. A parent can switch online features on from Profile."); then(); });
      $("#poYes", bg).addEventListener("click", async () => {
        const name = $("#poName", bg).value.trim(), err = $("#poErr", bg);
        if (name.length < 2 || !$("#poBox", bg).checked) { err.textContent = "Please type your name and tick the box."; err.hidden = false; return; }
        h.parent = { ok: true, by: name.slice(0, 40), at: today() };   // the name stays on this device only
        save(); closeModal();
        if (await netStart()) { netLog("consent", null, null, true, { parent: true, age: h.age, v: LEGAL_VERSION }); save(); render(); }
        toast("Thank you! Online features are on.");
        then();
      });
    } });
}
/* Called when a hero enters the game: ask anything missing, then go online if allowed. */
function legalOnEnter(then = () => {}) {
  if (!legalNeeded() || !S.hero) return then();
  if (needsQuickCheck()) return then();   // no pop-up: legalBanner() asks, and online features wait
  netStart().then((ok) => { if (ok && S.hero) { save(); render(); } });
  then();
}
/* Heroes made before ages were asked go straight in. This small banner asks when they're ready;
   until then the game works fully and only online features (backup, guild, chat) wait. */
function legalBanner() {
  $$(".legal-banner").forEach((x) => x.remove());
  if (!S.hero || !needsQuickCheck()) return;
  const el = document.createElement("div");
  el.className = "legal-banner";
  el.innerHTML = `<div class="wrap"><span>Quick question to keep your cloud backup, guild and chat on.</span><button class="btn sm primary" type="button">Answer (2 taps)</button></div>`;
  $("#view").parentNode.insertBefore(el, $("#view"));
  $("button", el).addEventListener("click", () => openQuickCheck(() => { legalBanner(); legalOnEnter(); }));
}
