/* Checks every level the way a player would meet it, without a browser.
   For each level: model solutions pass, starter code fails, bug code fails and its fix passes,
   extra right answers ("alts") pass, plausible wrong answers ("wrong") fail, think questions are
   well formed, and every lesson example runs.
   Usage: node src/verify.js            (all levels)
          node src/verify.js 2-3 2-4    (only these levels)
          node src/verify.js w2         (one world)
   Also see test-cases.js, which replays saved player attempts. Neither uses any AI or credits. */
const { loadGame } = require("./test-env.js");

(async () => {
  const { LEVELS, WORLDS, SKILLS, runTests, runPython, outputLines, runSql, explainCheck } = await loadGame();

  const args = process.argv.slice(2);
  const pick = LEVELS.filter((L) => !args.length || args.includes(L.id) || args.includes("w" + L.world));
  const skillIds = new Set(SKILLS.map((s) => s.id));
  let problems = 0, checks = 0;
  const bad = (L, msg) => { problems++; console.log("  ✗ " + L.id + " " + msg); };
  const ok = () => { checks++; };
  const ids = new Set();

  for (const L of pick) {
    process.stdout.write(L.id + " " + L.title + "\n");
    if (ids.has(L.id)) bad(L, "duplicate id"); ids.add(L.id);
    for (const k of Object.keys(L.skills || {})) if (!skillIds.has(k)) bad(L, "unknown skill " + k);
    for (const c of L.cards || []) if (!(c.answer >= 0 && c.answer < c.options.length) || c.options.length > 4) bad(L, "card answer out of range: " + c.q);
    // Lesson examples run (with a default answer for input()).
    for (const [i, ex] of (L.learn || []).concat(L.learnCards || []).entries()) {   // both Learn designs
      if (ex.code == null) { ok(); continue; }   // a text-only card
      const lang = ex.lang || (L.code && L.code.kind);
      if (lang === "sql") {
        const r = await runSql(ex.code, ex.db || L.code.db);
        if (r.error) bad(L, "learn example " + (i + 1) + " SQL error: " + r.error.msg); else ok();
        r.db.close();
        continue;
      }
      if (lang) { ok(); continue; }
      const r = await runPython(ex.code, { inputs: ex.inputs || ["5", "5", "5", "5", "5", "5"], files: ex.files || (L.code && L.code.files), db: L.code && L.code.db, api: L.code && L.code.api, modules: L.code && L.code.modules, limit: 4000, seed: 1 });
      if (r.error && !ex.err) bad(L, "learn example " + (i + 1) + " errors: " + r.error.name + " " + r.error.msg + " line " + r.error.line);
      else if (!r.error && ex.err) bad(L, "learn example " + (i + 1) + " should show an error but runs fine");
      else ok();
      // Learn cards: the marked guess is what the code really prints; the "your turn" sample passes.
      if (ex.guess) {
        const want = ex.guess.options[ex.guess.answer], got = r.error ? "ERROR" : (r.out || "").replace(/\n+$/, "");
        if (got !== want) bad(L, `learn card ${i + 1} guess answer is ${JSON.stringify(want)} but the code prints ${JSON.stringify(got)}`); else ok();
        if (new Set(ex.guess.options).size !== ex.guess.options.length || ex.guess.options.length > 4) bad(L, `learn card ${i + 1} guess options repeat or are too many`); else ok();
        if (!ex.try || !ex.try.sample) { bad(L, `learn card ${i + 1} needs a "your turn" step with a sample`); continue; }
        const t = await runPython(ex.try.sample, { inputs: ["5"], limit: 4000, seed: 1 });
        if (ex.try.sample.trim() === ex.code.trim() || !ex.try.ok(t.out || "", ex.try.sample, t.error)) bad(L, `learn card ${i + 1} "your turn" sample doesn't pass its own check`); else ok();
      }
    }
    // Think questions.
    for (const [i, q] of (L.think || []).entries()) {
      const where = "think " + (i + 1) + " (" + q.type + ")";
      if (q.type === "mcq" && !(q.answer >= 0 && q.answer < q.options.length && q.options.length <= 4)) bad(L, where + " answer out of range");
      if (q.type === "multi" && !(Array.isArray(q.answer) && q.answer.every((a) => a < q.options.length))) bad(L, where + " bad multi answer");
      if (q.type === "spot" && !(q.answer >= 1 && q.answer <= q.code.split("\n").length)) bad(L, where + " spot line out of range");
      if (q.type === "match" && !(q.pairs && q.pairs.length >= 2)) bad(L, where + " needs pairs");
      if (q.type === "predict" && q.code && !q.noRun) {
        const r = await runPython(q.code, { inputs: q.inputs || [], files: q.files, seed: 1 });
        const got = r.error ? r.error.name : outputLinesRaw(r.out).join("\n");
        const want = String(q.answer).split("\n").map((l) => l.trim()).join("\n");
        if (got !== want) bad(L, where + " answer mismatch. Program prints:\n" + got + "\n  but answer is:\n" + want);
      }
      if (q.type === "fill" && !q.noRun) {
        const filled = fillCode(q.code, q.answers);
        const r = await runPython(filled, { inputs: q.inputs || [] });
        if (r.error || outputLines(r.out, r.prompts).join("\n") !== q.expect.join("\n")) bad(L, where + " model answers don't produce the expected output: " + (r.error ? r.error.name + " " + r.error.msg : outputLines(r.out, r.prompts).join(" / ")));
        for (const w of q.wrong || []) {
          const r2 = await runPython(fillCode(q.code, w), { inputs: q.inputs || [] });
          if (!r2.error && outputLines(r2.out, r2.prompts).join("\n") === q.expect.join("\n")) bad(L, where + " wrong fill passes: " + JSON.stringify(w));
        }
      }
      if (q.type === "refute") {
        const call = q.fn + "(" + q.answer + ")";
        const b = await runPython(q.code, { calls: [{ call }] }), g = await runPython(q.ref, { calls: [{ call }] });
        const ge = g.error || g.calls[0].error, be = b.error || b.calls[0].error;
        if (ge) bad(L, where + " model input is invalid for the correct version: " + ge.name + " " + ge.msg);
        else if (!be && b.calls[0].value === g.calls[0].value) bad(L, where + " model input doesn't break the buggy code");
        for (const okIn of q.safe || []) {
          const c2 = q.fn + "(" + okIn + ")";
          const b2 = await runPython(q.code, { calls: [{ call: c2 }] }), g2 = await runPython(q.ref, { calls: [{ call: c2 }] });
          if ((b2.error || b2.calls[0].error) || b2.calls[0].value !== g2.calls[0].value) bad(L, where + " 'safe' input " + okIn + " actually breaks the code");
        }
      }
      if (q.type === "trace" && q.check) {
        const r = await runPython(q.check, {});
        const got = outputLinesRaw(r.out).join("\n"), want = q.rows.map((row) => row.join(" ")).join("\n");
        if (r.error || got !== want) bad(L, where + " trace rows don't match the program. Program gives:\n" + (r.error ? r.error.name : got));
      }
      if (q.type === "order" && q.expect) {
        const r = await runPython(q.lines.join("\n"), { inputs: q.inputs || [] });
        if (r.error || outputLines(r.out, r.prompts).join("\n") !== q.expect.join("\n")) bad(L, where + " model order doesn't produce expected output: " + (r.error ? r.error.name + " " + r.error.msg + " line " + r.error.line : outputLines(r.out, r.prompts).join(" / ")));
      }
      ok();
    }
    // Forge and bug hunt.
    for (const kind of ["code", "bug"]) {
      const T = L[kind];
      if (!T) { bad(L, "missing " + kind); continue; }
      const model = kind === "code" ? T.solution : T.fix;
      if (model == null) { if (kind === "bug" && L.world > 1) bad(L, "bug has no fix to verify"); continue; }
      const good = await runTests(T, model);
      if (!good.pass) bad(L, kind + " model answer FAILS: " + summary(good));
      else ok();
      const start = kind === "code" ? T.starter : T.code;
      const st = await runTests(T, start);
      if (st.pass) bad(L, kind + " starting code already PASSES");
      else ok();
      for (const [j, alt] of (T.alts || []).entries()) {
        const r = await runTests(T, alt);
        if (!r.pass) bad(L, kind + " alt " + (j + 1) + " (should pass) FAILS: " + summary(r)); else ok();
      }
      for (const [j, w] of (T.wrong || []).entries()) {
        const r = await runTests(T, w.code || w);
        if (r.pass) bad(L, kind + " wrong " + (j + 1) + " (should fail) PASSES" + (w.why ? " — " + w.why : "")); else ok();
      }
    }
    // Tavern Talk: the sample answer passes; filler, gibberish and a copied question don't.
    if (!L.explainKeys || !L.explainModel) bad(L, "explain has no key ideas or sample answer (src/explain.js)");
    else {
      const r = explainCheck(L.explainModel, L);
      if (!r.ok) bad(L, "explain sample answer is rejected: " + r.msg.replace(/<[^>]+>/g, "")); else ok();
      const q = L.explain.replace(/<[^>]+>/g, "").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&");
      const junk = {
        "random words": "pizza blue jumping mountain quickly elephant guitar seven window happy river music",
        "keyboard mash": "asdfgh qwerty jkljkl zxcvb hjkhjk asdasd qweqwe sdfsdf the is it a to and",
        "unrelated sentences": "The cat is on the mat and it is a sunny day, so we can go to the park with my dog after lunch.",
        "vague filler": "I think this is a very important concept and it is good to know. It helps a lot and we should always use it in our work.",
        "copied question": q + " I think so, yes.",
        "same word repeated": "it is the thing the thing the thing the thing the thing the thing the thing",
        "short filler": "the cat sat down"
      };
      for (const [what, text] of Object.entries(junk)) if (explainCheck(text, L).ok) bad(L, "explain accepts " + what); else ok();
      // Every key idea has a short answer to show after passing, and no sample text trips a "wrong idea".
      if ((L.explainAnswers || []).length !== L.explainKeys.length) bad(L, "explain needs one answer per key idea (" + (L.explainAnswers || []).length + " answers, " + L.explainKeys.length + " keys)"); else ok();
      for (const text of [L.explainModel].concat(L.explainAnswers || [])) for (const [re] of L.explainWrong || []) if (re.test(text)) bad(L, "explain wrong-idea pattern matches correct text: " + text.slice(0, 60));
      // Real players' answers: short correct ones must pass, wrong ideas must get their correction.
      for (const [text, want] of EXPLAIN_EXAMPLES[L.id] || []) {
        const r2 = explainCheck(text, L), got = r2.ok ? "pass" : r2.kind;
        if (got !== want) bad(L, `explain example should ${want} but got ${got}: "${text.slice(0, 50)}…"`); else ok();
      }
    }
  }
  console.log("\n" + pick.length + " levels, " + checks + " checks passed, " + problems + " problem" + (problems === 1 ? "" : "s") + ".");
  process.exit(problems ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });

function outputLinesRaw(out) { return out.split("\n").map((l) => l.replace(/\s+$/, "")).filter((l) => l.trim() !== "").map((l) => l.trim()); }
function fillCode(code, answers) { let i = 0; return code.replace(/___/g, () => answers[i++]); }
function summary(r) {
  if (r.codeMsg) return "code check: " + r.codeMsg.replace(/<[^>]+>/g, "");
  const f = r.results.find((x) => !x.pass);
  return f ? (f.label || "").replace(/<[^>]+>/g, "") + " → " + (f.msg || "").replace(/<[^>]+>/g, "") : "?";
}

/* Answers players really wrote in Tavern Talk, and what the check must do with them:
   "pass", or the kind of "not yet" ("wrong" = a misconception that gets a correction). */
const EXPLAIN_EXAMPLES = {
  "1-1": [["first prints as a string, second prints 10", "pass"],
          ["the first one prints as a string and the second prints as 10", "pass"],
          ["the first is a strnig in quotes, the secnod one does the mtah and shows 10", "pass"],
          ["the quotes print as it is as a string and the ones without quotes will run it as a expression", "pass"],
          ["quotes", "short"]],
  "1-2": [["gold stores the value as its a variable and when u use gold again it just adds extra to the existing variable, as the left side works first and then reads to the right", "wrong"],
          ["gold is a variable, so it stores a value. Python works out the right side first, gold + 25, using the old value 50, then saves the result 75 back into gold.", "pass"]],
  "1-4": [["input gives a number so we use int to compare the age", "wrong"]],
  "2-1": [["range(1, 6) includes 6 so it gives 1 to 6, use range(1, 10) and print it to check the first and last", "wrong"]],
  "2-5": [["print just shows it on screen but retrun gives the value back so tests can check it", "pass"]],
  "4-5": [["where filters groups and having filters each row after the grouping, like for categories", "wrong"]],
  "7-1": [["git add stages files, git commit uploads them to github with a message, and push shares it", "wrong"]]
};
