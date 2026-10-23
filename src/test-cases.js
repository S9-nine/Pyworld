/* Replays saved player attempts against the checker, so a change can't quietly break it.
   tests/cases/w<N>/<level>.<code|bug>.<kind>_<what>.(py|sql|html)
     kind ok    → a correct answer: the checker must accept it
     kind bad   → a wrong answer: the checker must reject it
     kind cheat → hard-codes the answer: should be rejected
     kind orig  → the untouched starting code: must be rejected
   tests/cases/known.json lists attempts whose result is a known, accepted exception, with the reason.
   Usage: node src/test-cases.js        (all)        node src/test-cases.js w3   (one world)
   No AI, no credits: run it as often as you like. */
const fs = require("fs"), path = require("path");
const { loadGame, ROOT } = require("./test-env.js");
const CASES = path.join(ROOT, "tests", "cases");

(async () => {
  const { LEVELS, runTests } = await loadGame();
  const known = fs.existsSync(path.join(CASES, "known.json")) ? JSON.parse(fs.readFileSync(path.join(CASES, "known.json"), "utf8")) : {};
  const only = process.argv[2];
  let total = 0, wrong = 0, skipped = 0;
  const worlds = fs.readdirSync(CASES).filter((d) => /^w\d$/.test(d) && (!only || d === only)).sort();
  for (const w of worlds) {
    const files = fs.readdirSync(path.join(CASES, w)).filter((f) => /^\d-\d\.(code|bug)\.(ok|bad|cheat|orig)/.test(f)).sort();
    let fails = 0;
    for (const f of files) {
      const [id, part, rest] = f.split(".");
      const kind = rest.match(/^(ok|bad|cheat|orig)/)[1];
      const L = LEVELS.find((x) => x.id === id);
      if (!L) { skipped++; continue; }
      const code = fs.readFileSync(path.join(CASES, w, f), "utf8");
      const r = await runTests(L[part], code);
      const want = known[f] ? known[f].expect : kind === "ok" ? "pass" : "fail";
      const got = r.pass ? "pass" : "fail";
      total++;
      if (got !== want) {
        wrong++; fails++;
        const why = r.codeMsg || ((r.results || []).find((x) => !x.pass) || {}).msg || "";
        console.log(`  ✗ ${w}/${f}: expected the checker to ${want === "pass" ? "ACCEPT" : "REJECT"} it, but it ${got === "pass" ? "accepted" : "rejected"} it${why ? " (" + why.replace(/<[^>]+>/g, "").replace(/&#39;/g, "'").replace(/&quot;/g, '"').slice(0, 140) + ")" : ""}`);
      }
    }
    console.log(`${w}: ${files.length} attempts, ${fails ? fails + " surprising" : "all as expected"}`);
  }
  console.log(`\n${total} saved attempts replayed, ${wrong} surprise${wrong === 1 ? "" : "s"}${skipped ? ", " + skipped + " skipped (level not found)" : ""}.`);
  process.exit(wrong ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
