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
  const { LEVELS, WORLDS, SKILLS, runTests, runPython, outputLines, runSql } = await loadGame();

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
    for (const [i, ex] of (L.learn || []).entries()) {
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
