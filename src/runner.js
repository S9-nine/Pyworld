/* Python runner (Skulpt) and test checker. */

let pyBusy = false;
let pyStopRequested = false;
globalThis.CQRT = { fs: {}, env: {}, api: [], dbs: {}, dbSeed: {}, memN: 0 };
let cqKeep = null;   // practice files and databases that survive between Run presses on the current level

class InputExhausted extends Error {}
const MARK = "\x02", SEP = "\x03";

/* Run Python source.
   opts.inputs: array of strings for test mode, or null for interactive.
   opts.ask(prompt): Promise<string> used in interactive mode.
   opts.onOut(text): streaming output callback.
   opts.files / env / api / db: practice files, environment, mock web routes and database seeds.
   opts.keep: keep practice files and databases between runs, like a real computer (interactive mode).
   opts.seed: seed for the random module, so programs that use randomness can be tested.
   opts.modules: extra importable modules { name: source }.
   opts.calls: [{ setup, call, expect, limit }] run after the program, as if it were imported.
   Resolves { out, prompts, error, files, calls, dbs }. */
async function runPython(code, opts = {}) {
  if (typeof Sk === "undefined") {
    return { out: "", prompts: [], error: { name: "EngineNotReady", msg: "The Python engine is still loading. Try again in a moment.", line: null }, calls: [], files: {} };
  }
  if (pyBusy) return { out: "", prompts: [], error: { name: "Busy", msg: "Another program is still running.", line: null }, calls: [], files: {} };
  const usesDb = /\bsqlite3\b/.test(code) || opts.db;
  if (usesDb && !cqSqlReady()) {
    try { await cqLoadSql(); } catch (_) {
      return { out: "", prompts: [], error: { name: "EngineNotReady", msg: "The database engine couldn't load. Check your internet connection and try again.", line: null }, calls: [], files: {} };
    }
  }
  pyBusy = true;
  pyStopRequested = false;
  cqInstallModules();
  const asModule = !!(opts.calls && opts.calls.length) || !!opts.asModule;
  const R = globalThis.CQRT;
  if (opts.keep && !cqKeep) cqKeep = { fs: {}, dbs: {}, given: {} };
  if (opts.keep) for (const [k, v] of Object.entries(opts.files || {})) if (!cqKeep.given[k]) { cqKeep.given[k] = 1; cqKeep.fs[k] = v; }   // each starting file is added once
  R.fs = opts.keep ? cqKeep.fs : Object.assign({}, opts.files || {});
  R.env = Object.assign({}, opts.env || {});
  R.api = opts.api || [];
  R.dbSeed = opts.db || {};
  R.dbs = opts.keep ? cqKeep.dbs : {};
  R.memN = 0;
  const extra = {};
  for (const [n, src] of Object.entries(opts.modules || {})) extra["src/lib/" + n + ".py"] = src;
  if (asModule) extra["src/lib/learner.py"] = code;
  const learnerFile = asModule ? "src/lib/learner.py" : "<stdin>.py";

  let out = "";
  const prompts = [];
  const echo = new Set(), soft = new Set();
  const queue = opts.inputs ? opts.inputs.slice() : null;
  const emit = (t) => { out += t; if (opts.onOut) opts.onOut(t); };
  const limit = opts.limit || 4000;
  Sk.configure({
    output: emit,
    read: (x) => {
      if (extra[x] !== undefined) return extra[x];
      if (Sk.builtinFiles === undefined || Sk.builtinFiles.files[x] === undefined) throw "File not found: '" + x + "'";
      return Sk.builtinFiles.files[x];
    },
    inputfunTakesPrompt: true,
    inputfun: (prompt) => {
      prompt = prompt == null ? "" : String(prompt);
      if (queue) {
        if (!queue.length) return Promise.reject(new InputExhausted("__cq_more_input__"));
        const v = queue.shift();
        prompts.push(norm(prompt + v));
        // Remember which output lines are the question + typed answer, however the question was shown
        // (inside input(), with print(..., end=""), or over several lines), so tests can ignore them.
        const first = (out.match(/\n/g) || []).length, text = prompt + v + "\n";
        if (prompt === "" && first > 0 && out.endsWith("\n")) soft.add(first - 1);   // a question shown with print() just before input()
        for (let i = 0; i < (text.match(/\n/g) || []).length; i++) echo.add(first + i);
        emit(text);
        return Promise.resolve(v);
      }
      emit(prompt);
      return (opts.ask ? opts.ask(prompt) : Promise.resolve("")).then((v) => {
        emit(v + "\n");
        Sk.execStart = Date.now();
        return v;
      });
    },
    __future__: Sk.python3,
    execLimit: limit,
    yieldLimit: 100,
    killableWhile: true,
    killableFor: true
  });
  /* One fresh module table per run, so the program, its imports and the test calls share modules:
     the learner's file is imported once, and a seeded random module stays seeded. */
  Sk.dateSet = false; Sk.filesLoaded = false; Sk.sysmodules = new Sk.builtin.dict([]); Sk.realsyspath = undefined; Sk.resetCompiler();
  let modN = 0;
  const runMain = (src, asMain) => Sk.misceval.asyncToPromise(() => Sk.importModuleInternal_("<stdin>", false, asMain ? "__main__" : "_cqrun" + (modN++), src, undefined, false, true), {
    "*": () => { if (pyStopRequested) throw new Sk.builtin.TimeLimitError("Stopped"); }
  });
  let error = null;
  const calls = [];
  try {
    await runMain("import _cq_io" + (opts.seed != null ? "\nimport random\nrandom.seed(" + (opts.seed | 0) + ")" : ""));
    const io = Sk.sysmodules.mp$subscript(new Sk.builtin.str("_cq_io")).$d;
    for (const n of ["open", "OSError", "FileNotFoundError", "FileExistsError", "IsADirectoryError"]) Sk.builtins[n] = io[n];
    Sk.builtins.IOError = io.OSError;
    Sk.execStart = Date.now();
    await runMain(asModule ? "import learner" : code, !asModule);
  } catch (e) {
    error = describeError(e, learnerFile);
  }
  if (!error) {
    for (const c of opts.calls || []) {
      const start = out.length;
      Sk.execStart = Date.now();
      Sk.execLimit = c.limit || limit;
      const driver = "from learner import *\n" + (c.setup ? c.setup + "\n" : "") +
        "_cq_r = (" + c.call + ")\n" +
        (c.expect != null ? "_cq_e = (" + c.expect + ")\nprint(" + JSON.stringify(MARK) + " + repr(_cq_r) + " + JSON.stringify(SEP) + " + repr(_cq_e) + " + JSON.stringify(SEP) + " + str(_cq_r == _cq_e))\n"
          : "print(" + JSON.stringify(MARK) + " + repr(_cq_r))\n");
      const res = { call: c.call };
      try {
        await runMain(driver);
        const txt = out.slice(start);
        const mk = txt.lastIndexOf(MARK);
        const parts = txt.slice(mk + 1).replace(/\n$/, "").split(SEP);
        res.value = parts[0];
        if (c.expect != null) { res.want = parts[1]; res.ok = parts[2] === "True"; }
        res.out = txt.slice(0, mk);
      } catch (e) {
        res.error = describeError(e, learnerFile);
        res.out = out.slice(start);
      }
      out = out.slice(0, start) + (res.out || "");
      calls.push(res);
      if (pyStopRequested) break;
    }
  }
  pyBusy = false;
  cqSqlEndRun();
  return { out, prompts, echo, soft, error, files: Object.assign({}, R.fs), calls, dbs: R.dbs };
}

function stopPython() {
  pyStopRequested = true;
  if (typeof Sk !== "undefined") Sk.execLimit = 1;
}
/* Forget the practice files and databases kept between runs (on Reset, or when leaving a level). */
function resetPractice() {
  if (cqKeep) for (const k in cqKeep.dbs) { try { cqKeep.dbs[k].close(); } catch (_) {} }
  cqKeep = null;
}

function describeError(e, learnerFile) {
  if (e instanceof InputExhausted || (e && /__cq_more_input__/.test(String(e.message || "") + String(e)))) {
    return { name: "InputError", msg: "Your program asked for more input than this test provides.", line: null };
  }
  let name = "Error", msg = String(e), line = null, inCall = false;
  if (e && e.tp$name) {
    name = e.tp$name;
    try {
      const args = e.args && e.args.v;
      msg = args && args.length ? String(Sk.ffi.remapToJs(args[0])) : "";
    } catch (_) { msg = String(e); }
    const tb = e.traceback || [];
    const mine = tb.find((f) => f.filename === (learnerFile || "<stdin>.py"));
    if (mine) line = mine.lineno;
    else if (learnerFile === "src/lib/learner.py" && tb.some((f) => f.filename === "<stdin>.py")) inCall = true;
    else if (tb.length && !learnerFile) line = tb[0].lineno;
  } else if (e && e.message) msg = e.message;
  if (pyStopRequested && name === "TimeLimitError") msg = "Stopped";
  return { name, msg, line, inCall };
}

/* Plain-language explanation of a Python error, for beginners. */
function friendlyError(err) {
  const n = err.name, m = err.msg || "";
  if (n === "SyntaxError" || n === "ParseError" || n === "TokenError")
    return "Python couldn't read this line. Common causes: a missing closing quote or bracket, a missing colon after if / for / while / def, a single = where you meant ==, or wrong indentation.";
  if (n === "IndentationError")
    return "The spaces at the start of a line are off. Lines inside an if, loop or function need 4 more spaces, and lines at the same level must line up.";
  if (n === "NameError") {
    const mm = /name '([^']+)'/.exec(m);
    return (mm ? "Python doesn't know the name <code>" + escapeHtml(mm[1]) + "</code>. " : "Python doesn't know a name you used. ") +
      "Check the spelling and capitals, make sure you created it before using it, and put text inside quotes." +
      (err.inCall ? " If the checker is calling your function, check the function's name matches the task exactly." : "");
  }
  if (n === "UnboundLocalError")
    return "Inside a function you changed a variable that also exists outside it. Pass the value in as a parameter and return the new value instead.";
  if (n === "TypeError" && /concatenate|must be str|can only concatenate/.test(m))
    return "You tried to join text and a number with +. Convert the number with <code>str()</code>, or use an f-string.";
  if (n === "TypeError" && /unsupported operand|can't multiply/.test(m))
    return "You're doing math with the wrong type, for example text or <code>None</code>. Remember <code>input()</code> gives a string, and a function without <code>return</code> gives back <code>None</code>.";
  if (n === "TypeError" && /not supported between instances of 'str' and '(int|float)'|not supported between instances of '(int|float)' and 'str'/.test(m))
    return "You compared text with a number. <code>input()</code> always gives text, so wrap it: <code>int(input(...))</code>.";
  if (n === "TypeError" && /not callable/.test(m))
    return "You put brackets after something that isn't a function. Did a variable get the same name as a function?";
  if (n === "TypeError" && /argument|positional/.test(m))
    return "A function got the wrong number of values. Compare how many parameters the <code>def</code> line has with how many you pass in.";
  if (n === "TypeError" && /not subscriptable/.test(m))
    return "You used square brackets on something that isn't a list, string or dictionary. Check what type that value really is.";
  if (n === "TypeError" && /not iterable/.test(m))
    return "A loop (or something like <code>sum()</code>) was given a single value instead of a collection. Did you mean <code>range(n)</code>?";
  if (n === "TypeError") return "A value is the wrong type for what you're doing with it. Check which values are strings, numbers, lists or <code>None</code>.";
  if (n === "ValueError" && /invalid literal/.test(m))
    return "<code>int()</code> got text that isn't a whole number. Check what's being converted.";
  if (n === "ValueError") return "The type is right but the value isn't usable here. Read the message for which value it didn't like.";
  if (n === "IndexError") return "You asked for a position that doesn't exist. A list of 3 items has positions 0, 1 and 2. Check your <code>range()</code> and any <code>+ 1</code>.";
  if (n === "KeyError") return "That key isn't in the dictionary. Check the spelling, or use <code>.get(key, default)</code> when it might be missing.";
  if (n === "AttributeError" && /NoneType/.test(m))
    return "You used a dot on <code>None</code>. Something you expected to hold a value is empty, often a function that forgot to <code>return</code>, or a method like <code>.sort()</code> that returns None.";
  if (n === "AttributeError") return "That value doesn't have the method or attribute you used. Check the spelling and what type the value is.";
  if (n === "FileNotFoundError") return "There's no file with that name. Check the spelling, and remember a file must be created (mode <code>\"w\"</code>) before it can be read.";
  if (n === "ZeroDivisionError") return "You divided by zero. Check the number you're dividing by, especially for empty lists.";
  if (n === "RecursionError") return "A function kept calling itself and never stopped. Check the base case.";
  if (n === "AssertionError") return "An <code>assert</code> check failed: the thing it tested was False.";
  if (n === "TimeLimitError") return m === "Stopped" ? "You stopped the program." : "Your program ran too long. This usually means a loop that never ends, or an approach that's too slow for big inputs.";
  if (n === "InputError") return "Check how many times you call <code>input()</code>. This test only types in the values listed.";
  if (/Error$/.test(n) && /OperationalError|IntegrityError|ProgrammingError/.test(n)) return sqlFriendly(m);
  if (n === "ConnectionError") return "The request couldn't reach that address. Check the URL is exactly right, including https://.";
  if (n === "HTTPError") return "The server answered with an error status. Check the URL and the parameters you sent.";
  if (n === "JSONDecodeError") return "That text isn't valid JSON. JSON needs double quotes around keys and strings.";
  if (n === "SQL error") return sqlFriendly(m);
  if (n === "EngineNotReady" || n === "Busy") return m;
  return "Read the message: the error name and the line number tell you where to look.";
}
function sqlFriendly(m) {
  if (/no such table/.test(m)) return "There's no table with that name. Check the spelling, and make sure the table was created first.";
  if (/no such column/.test(m)) return "There's no column with that name. Check the spelling against the table's columns.";
  if (/syntax error/.test(m)) return "SQL couldn't read the statement. Check commas between columns, quotes around text, and the order SELECT, FROM, WHERE, GROUP BY, ORDER BY.";
  if (/UNIQUE constraint/.test(m)) return "That value must be unique, and it already exists in the table.";
  if (/NOT NULL constraint/.test(m)) return "A required column was left empty.";
  if (/bindings/.test(m)) return "The number of <code>?</code> placeholders doesn't match the number of values you passed. A single value still needs a tuple: <code>(value,)</code>.";
  if (/misuse of aggregate/i.test(m)) return "COUNT, SUM, AVG, MIN and MAX can't go in WHERE, because WHERE checks one row at a time, before any grouping. To filter on a group's total, use <code>HAVING</code> after <code>GROUP BY</code>.";
  if (/ambiguous column/i.test(m)) return "Two of your tables have a column with that name, so SQL doesn't know which one you mean. Put the table's name or alias in front: <code>c.name</code> or <code>o.id</code>.";
  if (/aggregate|GROUP BY/i.test(m)) return "When you use COUNT, SUM or AVG with other columns, those other columns need to be in GROUP BY.";
  return "Read the database's message carefully: it names the part it didn't understand.";
}

const norm = (s) => String(s).replace(/ /g, " ").replace(/[ \t]+/g, " ").trim();

/* ───────── Explaining output differences ─────────
   When a printed line is close to an expected one, say exactly what differs, in words,
   and show both lines with the differing characters highlighted. */
function charDiff(a, b) {
  // Longest common subsequence on characters: which chars of a and b are shared.
  const n = a.length, m = b.length, d = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) d[i][j] = a[i] === b[j] ? d[i + 1][j + 1] + 1 : Math.max(d[i + 1][j], d[i][j + 1]);
  const ka = new Array(n).fill(false), kb = new Array(m).fill(false);
  let i = 0, j = 0;
  while (i < n && j < m) { if (a[i] === b[j]) { ka[i] = kb[j] = true; i++; j++; } else if (d[i + 1][j] >= d[i][j + 1]) i++; else j++; }
  return { ka, kb, same: d[0][0] };
}
function lineSimilarity(a, b) {
  if (!a.length && !b.length) return 1;
  if (a.length * b.length > 40000) return 0;
  return (2 * charDiff(a, b).same) / (a.length + b.length);
}
function markDiff(text, keep, cls) {
  let out = "", run = "", cur = null;
  const flush = () => { if (run) out += cur ? `<mark class="${cls}">${escapeHtml(run).replace(/ /g, "&nbsp;")}</mark>` : escapeHtml(run); run = ""; };
  for (let i = 0; i < text.length; i++) { const m = !keep[i]; if (cur !== null && m !== cur) flush(); cur = m; run += text[i]; }
  flush();
  return out;
}
/* Plain-English reasons a printed line differs from the expected one. */
function diffReasons(want, got) {
  const strip = (x) => x.replace(/[.!?:]+$/, "");
  if (strip(want) === strip(got)) {
    const wEnd = want.slice(strip(want).length), gEnd = got.slice(strip(got).length);
    const name = (p) => (p === "." ? "full stop (.)" : "<b>" + escapeHtml(p) + "</b>");
    return [!gEnd ? `it's missing the ${name(wEnd)} at the end` : !wEnd ? `it has an extra ${name(gEnd)} at the end` : `it should end with ${name(wEnd)}, not ${name(gEnd)}`];
  }
  if (want.toLowerCase() === got.toLowerCase()) {
    const i = [...want].findIndex((c, k) => c !== got[k]);
    return [`a capital letter is different: you wrote <b>${escapeHtml(got[i])}</b> where the answer has <b>${escapeHtml(want[i])}</b>`];
  }
  if (want.replace(/ /g, "") === got.replace(/ /g, "")) return [got.length > want.length ? "it has an extra space" : "it's missing a space"];
  if (want.replace(/-/g, " ") === got.replace(/-/g, " ") || want.replace(/-/g, "") === got.replace(/-/g, "")) return ["check the hyphen (<b>-</b>)"];
  if (want.toLowerCase().replace(/[^a-z0-9]/g, "") === got.toLowerCase().replace(/[^a-z0-9]/g, "")) return ["only capitals, spaces or punctuation differ: compare the highlighted characters"];
  // Several things differ: name each kind of difference.
  const r = [];
  const words = (x) => x.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
  const ww = words(want), gw = words(got);
  const missing = ww.filter((w) => !gw.includes(w)), extra = gw.filter((w) => !ww.includes(w));
  if (missing.length) r.push(`the answer has <b>${escapeHtml(missing.slice(0, 4).join(" "))}</b>` + (extra.length ? ` where you have <b>${escapeHtml(extra.slice(0, 4).join(" "))}</b>` : ""));
  else if (extra.length) r.push(`you have extra words: <b>${escapeHtml(extra.slice(0, 4).join(" "))}</b>`);
  const gotWords = got.split(/\s+/);
  const caps = want.split(/\s+/).filter((w) => /[A-Z]/.test(w) && !gotWords.includes(w) && gotWords.some((g) => g.toLowerCase() === w.toLowerCase()));
  if (caps.length) r.push(`check the capitals in <b>${escapeHtml(caps.slice(0, 3).join(" "))}</b>`);
  const hy = want.split(/\s+/).filter((w) => w.includes("-") && !gotWords.includes(w));
  if (hy.length) r.push(`<b>${escapeHtml(hy[0].replace(/[.!?,]+$/, ""))}</b> has a hyphen (-)`);
  if (/[.!?]$/.test(want) && !/[.!?]$/.test(got)) r.push(`it should end with ${want.endsWith(".") ? "a full stop (.)" : "<b>" + escapeHtml(want.slice(-1)) + "</b>"}`);
  return r;
}
/* Little jokes for players who change the text on purpose. */
const OUTPUT_JOKES = [
  [/job.?ready in (a|one|1) (day|hour|minute|second)/i, "Job-ready in a day? Bold! The quest says 8 weeks, though."],
  [/\b(hacked|hacker|pwned|lol|lmao|haha)\b/i, "Ha, nice try. The checker has seen it all."],
  [/^(test|testing|asdf|qwerty)$/i, "Testing the checker? Respect. Now back to the quest."]
];
function lineCompareHtml(want, got) {
  const { ka, kb } = charDiff(got, want);
  return `<div class="diff"><div><span>yours</span><code>${markDiff(got, ka, "d-x")}</code></div><div><span>answer</span><code>${markDiff(want, kb, "d-m")}</code></div></div>`;
}
/* Every expected line that's missing, paired with the closest printed line that isn't already right. */
function outputProblems(wants, lines) {
  const left = lines.slice(), missing = [], probs = [];
  for (const w of wants) { const j = left.indexOf(w); if (j >= 0) left.splice(j, 1); else missing.push(w); }
  for (const w of missing) {
    let best = -1, score = 0;
    left.forEach((l, k) => { const sc = lineSimilarity(w, l); if (sc > score) { score = sc; best = k; } });
    if (best >= 0 && score >= 0.5) { probs.push({ want: w, got: left[best] }); left.splice(best, 1); }
    else probs.push({ want: w, got: null });
  }
  return probs;
}
function outputMessage(probs, total, printed) {
  const ok = total - probs.length;
  let head = !printed ? "Your program didn't print anything yet. " : ok ? `Your program runs, and ${ok} of ${total} lines are right. ` : "Your program runs. ";
  const joke = probs.map((p) => p.got && OUTPUT_JOKES.find(([re]) => re.test(p.got))).find(Boolean);
  if (joke) head = joke[1] + " " + head;
  const items = probs.slice(0, 4).map((p) => {
    if (!p.got) return `<li>Missing a line: <code>${escapeHtml(p.want)}</code></li>`;
    const why = diffReasons(p.want, p.got);
    return `<li>Close! ${why.length ? "Your line is different: " + why.join("; ") + "." : "Compare the highlighted parts."}${lineCompareHtml(p.want, p.got)}</li>`;
  });
  return head + (probs.length === 1 ? "One thing to fix:" : `${probs.length} things to fix:`) + `<ul class="probs">${items.join("")}</ul>` + (probs.length > 4 ? `…and ${probs.length - 4} more.` : "");
}

/* The program's printed lines, without blank lines and without the lines where input was typed.
   echo (line numbers) is exact; without it, lines equal to a prompt + answer are dropped. */
function outputLines(out, prompts, echo, soft) {
  if (echo) return out.split("\n").filter((l, i) => !echo.has(i) && !(soft && soft.has(i) && promptLike(norm(l)))).map(norm).filter((l) => l !== "");
  return out.split("\n").map(norm).filter((l) => l !== "" && !prompts.includes(l));
}
/* A line that looks like a question ("Guess:", "Number?"). When one is printed right before an input(),
   tests ignore it, since showing a prompt with print() is fine. */
const promptLike = (l) => /[?:]$/.test(l) && l.length <= 60;

/* Seeded random numbers for hidden tests, so every learner gets the same cases. */
function seededRng(seed) {
  let s = (seed * 2654435761) >>> 0 || 1;
  const next = () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
  return { next, int: (a, b) => a + Math.floor(next() * (b - a + 1)), pick: (arr) => arr[Math.floor(next() * arr.length)] };
}

function testLabel(t) {
  if (t.label) return t.label;
  if (t.call) return "Calls <code>" + escapeHtml(t.call) + "</code>";
  if (t.in && t.in.length) return "Typing " + t.in.map((x) => `<code>${escapeHtml(x)}</code>`).join(" then ");
  return "Running your program";
}

function codeChecks(task, code) {
  // SQL: skip -- comments and ignore case (keywords can be written any way). Python: skip # comments.
  // A rule can add its own regex flags as a third item, e.g. ["create\\s+table", "…", "i"].
  const sql = task.kind === "sql";
  const stripped = sql ? code.replace(/--.*$/gm, "") : code.replace(/#.*$/gm, "");
  const flags = (extra) => "m" + (sql ? "i" : "") + (extra && !(sql && extra === "i") ? extra : "");
  for (const [re, msg, f] of task.must || []) {
    if (!new RegExp(re, flags(f)).test(stripped)) return msg;
  }
  for (const [re, msg, f] of task.mustNot || []) {
    // Pure-number patterns (like "45") only count on lines that print, assign or return, so the number can still appear elsewhere.
    const numeric = /^[\d.\\]+$/.test(re);
    const codeOnly = task.mustNotAll || !numeric ? stripped : stripped.split("\n").filter((l) => /print\(|=|return/.test(l)).join("\n");
    if (new RegExp(re, flags(f)).test(codeOnly)) return msg;
  }
  return "";
}

function runOpts(task, t, extra = {}) {
  return Object.assign({
    inputs: t.in || [],
    files: t.files === null ? {} : Object.assign({}, task.files || {}, t.files || {}),   // files: null = start with no files at all
    env: t.env || task.env,
    api: t.offline ? [{ url: /^/, fn: () => ({ error: "HTTPSConnectionPool: Max retries exceeded (no internet connection)" }) }] : t.api || task.api,
    db: t.db || task.db,
    seed: t.seed != null ? t.seed : task.seed,
    modules: Object.assign({}, task.modules || {}, t.modules || {}),
    calls: t.call ? [{ setup: t.setup, call: t.call, expect: t.expect, limit: t.limit }] : [],
    asModule: !!task.asModule,
    limit: t.limit || task.limit || 3000
  }, extra);
}

/* Run a level's tests. Returns { pass, results:[{pass, label, msg, out, error, hidden}], codeMsg } */
async function runTests(task, code) {
  const codeMsg = codeChecks(task, code);
  if (codeMsg) return { pass: false, results: [], codeMsg };
  if (task.kind === "sql") return runSqlTests(task, code);
  if (task.kind === "html") return runHtmlTests(task, code);
  if (task.pytest) return runPytestTests(task, code);
  const tests = task.tests.slice();
  if (task.fuzz) {
    const rng = seededRng(task.fuzz.seed || 7);
    for (let i = 0; i < task.fuzz.n; i++) tests.push(Object.assign({ hidden: true, ref: true }, task.fuzz.gen(rng, i)));
  }
  const results = [];
  for (const t of tests) {
    const res = await checkOne(task, t, code);
    results.push(res);
    if (t.hidden && !res.pass) break;   // one failing hidden case is enough to report
  }
  return { pass: results.every((r) => r.pass), results, codeMsg: "", hiddenCount: tests.filter((t) => t.hidden).length };
}

async function checkOne(task, t, code) {
  const r = await runPython(code, runOpts(task, t));
  const res = { label: testLabel(t), input: t.in || [], out: r.out, pass: true, msg: "", hidden: !!t.hidden };
  const fail = (msg) => { res.pass = false; if (!res.msg) res.msg = msg; };
  const call = r.calls[0];
  const err = r.error || (call && call.error);
  if (t.raises) {
    if (!err) fail("This should raise <code>" + t.raises + "</code>, but nothing went wrong.");
    else if (err.name !== t.raises) { res.error = err; fail("Expected <code>" + t.raises + "</code> but got <code>" + escapeHtml(err.name + (err.msg ? ": " + err.msg : "")) + "</code>."); }
    if (res.pass && t.raisesMsg && !new RegExp(t.raisesMsg, "i").test(err.msg)) fail("Right error type, but the message should mention <code>" + escapeHtml(t.raisesMsg) + "</code>.");
    return res;
  }
  if (err) {
    res.error = err;
    if (err.name === "TimeLimitError" && t.limit) fail(t.slowMsg || "Too slow for a big input. Look for an approach that doesn't loop inside a loop.");
    else fail(err.name + (err.msg ? ": " + escapeHtml(err.msg) : "") + (err.line ? " (line " + err.line + ")" : ""));
    return res;
  }
  let ref = null;
  if (t.ref) ref = await runPython(task.solution, runOpts(task, t));
  const lines = call ? outputLines(call.out, r.prompts) : outputLines(r.out, r.prompts, r.echo, r.soft);
  if (ref) {
    const want = ref.calls[0] ? outputLines(ref.calls[0].out, ref.prompts) : outputLines(ref.out, ref.prompts, ref.echo, ref.soft);
    const mine = lines;
    if (call) {
      if (call.value !== ref.calls[0].value) fail("Hidden test: <code>" + escapeHtml(t.call) + "</code> should give <code>" + escapeHtml(ref.calls[0].value) + "</code> but gave <code>" + escapeHtml(call.value) + "</code>.");
    }
    if (res.pass && want.join("\n") !== mine.join("\n")) {
      const lines = mine;
      const i = want.findIndex((w, k) => w !== lines[k]);
      const i2 = i < 0 ? want.length : i;
      fail((t.in && t.in.length ? "Hidden test, typing " + t.in.map((x) => `<code>${escapeHtml(x)}</code>`).join(" then ") + ": " : "Hidden test: ") +
        (i2 < want.length ? "expected <code>" + escapeHtml(want[i2]) + "</code>" + (lines[i2] != null ? " but got <code>" + escapeHtml(lines[i2]) + "</code>" : " but your program stopped printing") : "your program printed an extra line <code>" + escapeHtml(lines[i2]) + "</code>") + ".");
    }
    return res;
  }
  if (call && call.ok && /^(True|False)$/.test(String(t.expect).trim()) && call.value !== String(t.expect).trim()) {
    fail("<code>" + escapeHtml(t.call) + "</code> should give <code>" + escapeHtml(t.expect) + "</code> (a True/False value) but gave <code>" + escapeHtml(call.value) + "</code>.");
  }
  if (call && t.expect != null && !call.ok) {
    fail("<code>" + escapeHtml(t.call) + "</code> should give <code>" + escapeHtml(call.want) + "</code> but gave <code>" + escapeHtml(call.value) + "</code>." +
      (call.value === "None" ? " Did the function forget to <code>return</code>?" : ""));
  }
  if (res.pass && (t.out || []).length) {
    const probs = outputProblems(t.out.map(norm), lines);
    if (t.check === "name" && !lines.some((l) => /^My name is \S+/.test(l))) {
      const near = lines.find((l) => /^my\s*name\s*is/i.test(l));
      probs.push(near ? { want: near.replace(/^my\s*name\s*is/i, "My name is"), got: near } : { want: "My name is (your name)", got: null });
    }
    if (probs.length) fail(outputMessage(probs, t.out.length + (t.check === "name" ? 1 : 0), lines.length));
  }
  if (res.pass && t.inOrder) {
    const wanted = t.out.map(norm), seq = lines.filter((l) => wanted.includes(l));
    const i = wanted.findIndex((w, k) => seq[k] !== w);
    if (i >= 0) fail("Line " + (i + 1) + " of the answer should be <code>" + escapeHtml(t.out[i]) + "</code> but your program printed <code>" + escapeHtml(seq[i] == null ? "(nothing)" : seq[i]) + "</code> there.");
  }
  for (const pat of t.re || []) {
    if (res.pass && !lines.some((l) => new RegExp(pat).test(l))) fail(t.reMsg || "Expected a line like <code>" + escapeHtml(pat.replace(/\\[ds]\+?|[\^$]/g, "…")) + "</code>.");
  }
  if (res.pass && t.not) {
    for (const bad of t.not) if (lines.includes(norm(bad))) { fail("This case should not print <code>" + escapeHtml(bad) + "</code>."); break; }
  }
  if (res.pass && t.only && lines.length !== (t.out || []).length) {
    const wanted = (t.out || []).map(norm), left = wanted.slice();
    const extra = lines.find((l) => { const j = left.indexOf(l); if (j >= 0) { left.splice(j, 1); return false; } return true; });
    fail("Your program printed an extra line: <code>" + escapeHtml(extra == null ? "?" : extra) + "</code>. Print only <code>" + escapeHtml((t.out || []).join(" / ")) + "</code> for this case." +
      " If that line is a question for the user, put it inside <code>input(\"...\")</code>.");
  }
  if (res.pass && t.silent && lines.length) fail("This function should <b>return</b> its answer, not print it. Remove the <code>print()</code> inside the function.");
  for (const [name, want] of Object.entries(t.fileOut || {})) {
    if (!res.pass) break;
    // fileLoose: ignore spaces at the ends of lines and blank lines at the end of the file.
    const loose = (x) => String(x).split("\n").map((l) => l.replace(/\s+$/, "")).join("\n").replace(/\n+$/, "");
    const got = t.fileLoose && r.files[name] !== undefined && loose(r.files[name]) === loose(want) ? want : r.files[name];
    if (got === undefined) fail("The file <code>" + escapeHtml(name) + "</code> wasn't created.");
    else if (got + "\n" === want) fail("<code>" + escapeHtml(name) + "</code> is nearly right: the last line needs <code>\\n</code> at the end.");
    else if (got !== want) {
      const gl = got.split("\n"), wl = want.split("\n");
      const i = wl.findIndex((w, k) => w !== gl[k]);
      fail("<code>" + escapeHtml(name) + "</code> isn't right" + (i >= 0 ? ": line " + (i + 1) + " should be <code>" + escapeHtml(wl[i] || "(nothing)") + "</code> but is <code>" + escapeHtml(gl[i] == null ? "(missing)" : gl[i] || "(empty line)") + "</code>" : "") + ".");
    }
  }
  if (res.pass && t.dbCheck) {
    const dc = t.dbCheck, db = r.dbs[dc.file];
    if (!db) fail("The database <code>" + escapeHtml(dc.file) + "</code> was never opened.");
    else {
      let got = [];
      try { const x = db.exec(dc.sql); got = x.length ? x[0].values : []; } catch (e) { got = "error: " + e.message; }
      if (JSON.stringify(got) !== JSON.stringify(dc.rows)) fail(dc.msg || "The data saved in the database isn't right. Did you <code>commit()</code>?");
    }
  }
  for (const k in r.dbs) { try { r.dbs[k].close(); } catch (_) {} }
  return res;
}

/* Learner writes pytest-style tests. They must pass on the real code and catch each planted bug. */
async function runPytestTests(task, code) {
  const P = task.pytest;
  const helper = "import learner\n" +
    "def names():\n    out = []\n    for n in dir(learner):\n        f = getattr(learner, n)\n        if n.startswith('test') and callable(f):\n" +
    "            p = getattr(f, '_cq_params', None)\n            if p is None:\n                out.append(n + '#-1')\n            else:\n                for i in range(len(p[1])):\n                    out.append(n + '#' + str(i))\n    return out\n" +
    "def run(key):\n    n, i = key.split('#')\n    f = getattr(learner, n)\n    i = int(i)\n    if i < 0:\n        f()\n        return 'ok'\n" +
    "    ns, vals = f._cq_params\n    v = vals[i]\n    if len(ns) == 1:\n        v = (v,)\n    f(**dict(zip(ns, v)))\n    return 'ok'\n";
  const srcLines = code.split("\n");
  const runSuite = async (moduleSrc) => {
    const modules = Object.assign({}, task.modules || {}, { [P.module]: moduleSrc, _cqpt: helper });
    const list = await runPython(code, { files: task.files, modules, calls: [{ setup: "import _cqpt", call: "_cqpt.names()" }] });
    if (list.error || list.calls[0].error) return { error: list.error || list.calls[0].error };
    let keys = [];
    try { keys = JSON.parse(list.calls[0].value.replace(/'/g, '"')); } catch (_) { keys = []; }
    const calls = keys.map((k) => ({ setup: "import _cqpt", call: "_cqpt.run(" + JSON.stringify(k) + ")" }));
    const r = keys.length ? await runPython(code, { files: task.files, modules, calls }) : { calls: [] };
    return { keys, results: r.calls.map((c, i) => ({ key: keys[i], error: c.error })) };
  };
  const results = [];
  const real = await runSuite(P.src);
  if (real.error) {
    return { pass: false, codeMsg: "", results: [{ label: "Your test file runs", pass: false, error: real.error, msg: escapeHtml(real.error.name + ": " + real.error.msg) + (real.error.line ? " (line " + real.error.line + ")" : "") }] };
  }
  const count = real.keys.length;
  results.push({ label: "You wrote at least " + (P.min || 1) + " test" + ((P.min || 1) > 1 ? "s" : ""), pass: count >= (P.min || 1),
    msg: count ? "Only " + count + " test" + (count > 1 ? "s" : "") + " found. Each test is a function whose name starts with <code>test_</code>." : "No tests found. Each test is a function whose name starts with <code>test_</code>." });
  const broken = real.results.filter((x) => x.error);
  const show = (x) => { const ln = x.error.line ? srcLines[x.error.line - 1] : ""; return "<code>" + escapeHtml(x.key.split("#")[0]) + "</code> failed" + (x.error.line ? " on line " + x.error.line + ": <code>" + escapeHtml(ln.trim()) + "</code>" : ": " + escapeHtml(x.error.name + " " + x.error.msg)); };
  results.push({ label: "All your tests pass on the real code", pass: count > 0 && !broken.length,
    msg: broken.length ? show(broken[0]) + ". The real code is correct, so this test expects the wrong thing." : "Write some tests first." });
  for (const m of P.mutants) {
    if (!count || broken.length) { results.push({ label: "Catch the bug: " + m.label, pass: false, msg: "Fix the tests above first." }); continue; }
    const r = await runSuite(m.src);
    const caught = r.error || r.results.some((x) => x.error);
    results.push({ label: "Catch the bug: " + m.label, pass: !!caught, msg: "None of your tests noticed this bug. " + (m.hint || "Add a test for that case.") });
  }
  return { pass: results.every((r) => r.pass), results, codeMsg: "" };
}

/* SQL levels: run a query against a practice database and compare with the model answer. */
function sqlTable(cols, rows) {
  if (!cols) return "";
  const cells = [cols].concat(rows.map((r) => r.map((v) => v === null ? "NULL" : String(v))));
  const w = cols.map((_, i) => Math.min(28, Math.max(...cells.map((r) => String(r[i]).length))));
  const fmt = (r) => r.map((v, i) => String(v).slice(0, 28).padEnd(w[i])).join(" | ");
  return [fmt(cells[0]), w.map((n) => "-".repeat(n)).join("-+-")].concat(cells.slice(1).map(fmt)).join("\n") + "\n(" + rows.length + " row" + (rows.length === 1 ? "" : "s") + ")\n";
}
function sqlFloat(v, t) { return t === 2 && Number.isInteger(v) ? v.toFixed(1) : v; }
async function runSql(code, seed) {
  await cqLoadSql();
  const db = new cqSQL.Database();
  if (seed) db.exec(seed);
  const sets = [];
  let error = null;
  const stmts = splitSql(code);
  for (const s of stmts) {
    let st;
    try {
      st = db.prepare(s);
      const ptr = cqStmtPtr(st);
      let cols = null;
      const rows = [];
      while (st.step()) {
        if (!cols) cols = st.getColumnNames();
        const r = st.get();
        rows.push(r.map((v, i) => sqlFloat(v, cqSQL._sqlite3_column_type ? cqSQL._sqlite3_column_type(ptr, i) : 0)));
      }
      if (!cols && st.getColumnNames().length) cols = st.getColumnNames();
      st.free();
      if (cols) sets.push({ cols, rows, sql: s });
    } catch (e) {
      try { if (st) st.free(); } catch (_) {}
      error = { name: "SQL error", msg: String(e.message || e), stmt: s };
      break;
    }
  }
  return { db, sets, error };
}
function splitSql(code) {
  const out = [];
  let cur = "", q = null;
  const src = code.replace(/--[^\n]*/g, "");
  for (const c of src) {
    if (q) { if (c === q) q = null; cur += c; continue; }
    if (c === "'" || c === '"') q = c;
    if (c === ";") { if (cur.trim()) out.push(cur.trim()); cur = ""; continue; }
    cur += c;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}
async function runSqlTests(task, code) {
  const results = [];
  for (const t of task.tests) {
    const seed = t.db || task.db;
    const mine = await runSql(code, seed), ref = await runSql(task.solution, seed);
    const res = { label: t.label || "Your query", pass: true, msg: "", out: "" };
    const cmp = (a, b) => {
      if (!a) return "Your SQL didn't return any rows to check. End with a SELECT.";
      if (a.cols.length !== b.cols.length) return "Expected " + b.cols.length + " column" + (b.cols.length > 1 ? "s" : "") + " (" + escapeHtml(b.cols.join(", ")) + ") but got " + a.cols.length + ".";
      // Numbers compare by value, and a number stored as text ('56.3') counts as that number.
      const key = (r) => JSON.stringify(r.map((v) => typeof v === "number" || (typeof v === "string" && /^-?\d+(\.\d+)?$/.test(v.trim())) ? +(+v).toFixed(6) : v));
      const ordered = task.ordered != null ? task.ordered : /order\s+by/i.test(task.solution);
      const A = a.rows.map(key), B = b.rows.map(key);
      if (A.length !== B.length) return "Expected " + B.length + " row" + (B.length === 1 ? "" : "s") + " but got " + A.length + ".";
      if (ordered) { const i = A.findIndex((x, k) => x !== B[k]); if (i >= 0) return "Row " + (i + 1) + " should be <code>" + escapeHtml(b.rows[i].join(", ")) + "</code> but is <code>" + escapeHtml(a.rows[i].join(", ")) + "</code>." + (A.slice().sort().join() === B.slice().sort().join() ? " The rows are right but the order isn't." : ""); }
      else if (A.slice().sort().join("\n") !== B.slice().sort().join("\n")) return "Some rows don't match the expected result.";
      return "";
    };
    if (mine.error) { res.pass = false; res.msg = escapeHtml(mine.error.msg); res.error = mine.error; }
    else if (task.checkSql) {
      const a = mine.db.exec(task.checkSql), b = ref.db.exec(task.checkSql);
      const A = a.length ? { cols: a[0].columns, rows: a[0].values } : { cols: [], rows: [] }, B = b.length ? { cols: b[0].columns, rows: b[0].values } : { cols: [], rows: [] };
      const m = cmp(A, B);
      if (m) { res.pass = false; res.msg = t.msg || "The table doesn't look right afterwards. " + m; }
    } else {
      const m = cmp(mine.sets[mine.sets.length - 1], ref.sets[ref.sets.length - 1]);
      if (m) { res.pass = false; res.msg = m; }
    }
    res.out = mine.sets.length ? sqlTable(mine.sets[mine.sets.length - 1].cols, mine.sets[mine.sets.length - 1].rows) : "";
    mine.db.close(); ref.db.close();
    results.push(res);
  }
  return { pass: results.every((r) => r.pass), results, codeMsg: "" };
}

/* HTML levels: parse the page and check it like a browser would. */
function htmlDoc(code) { return new DOMParser().parseFromString(code, "text/html"); }
async function runHtmlTests(task, code) {
  const doc = htmlDoc(code);
  const results = task.tests.map((t) => {
    const els = Array.from(doc.querySelectorAll(t.sel));
    let ok = true;
    if (t.count != null) ok = els.length === t.count;
    else if (t.min != null) ok = els.length >= t.min;
    else ok = els.length > 0;
    if (ok && t.text != null) ok = els.some((e) => e.textContent.toLowerCase().includes(String(t.text).toLowerCase()));
    if (ok && t.attr) ok = els.length > 0 && els.every((e) => Object.entries(t.attr).every(([k, v]) => v === true ? e.hasAttribute(k) && e.getAttribute(k).trim() !== "" : e.getAttribute(k) === v));
    if (ok && t.fn) ok = !!t.fn(els, doc);
    return { label: t.label, pass: ok, msg: t.msg || "Not there yet." };
  });
  return { pass: results.every((r) => r.pass), results, codeMsg: "" };
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* ───────── Explain (Tavern Talk) check ─────────
   No AI needed. An answer passes when it reads like real sentences in the player's own words
   and touches enough of the level's key ideas (L.explainKeys: [hint, regex] pairs). */
const EXPLAIN_GLUE = new Set(("the a an is are was were be it its it's to and of if in on at that this these those so because then " +
  "when while you we i i'm my your our they them their he she will would can could should but for with not no as or by from " +
  "each every what which how why do does did there here has have had into than also just only one").split(" "));
function explainWords(s) { return String(s || "").toLowerCase().replace(/[’`]/g, "'").match(/[a-z0-9_]+(?:'[a-z]+)?/g) || []; }
/* Typos in important words shouldn't cost a pass ("retrun", "dictonary"). The important words are
   taken from the level's key-idea patterns; a close misspelling adds the correct word for matching. */
function editDistance(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i].concat(new Array(b.length).fill(0)));
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) {
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
  }
  return d[a.length][b.length];
}
function typoFixes(words, L) {
  if (!L._vocab) L._vocab = [...new Set((L.explainKeys || []).flatMap(([, re]) => re.source.toLowerCase().replace(/\\./g, " ").match(/[a-z]{5,}/g) || []))];
  const extra = [];
  for (const w of new Set(words)) {
    if (w.length < 5) continue;
    for (const v of L._vocab) {
      if (w.startsWith(v) || w[0] !== v[0]) continue;
      const allowed = v.length >= 8 ? 2 : 1;
      if (Math.min(editDistance(w, v), editDistance(w.slice(0, v.length), v)) <= allowed) extra.push(v);
    }
  }
  return extra;
}
/* Returns { ok, msg, hits, got, need, kind }. hits are worked out even when the answer isn't ready
   yet, so the page can tick key ideas live while the player types. */
function explainCheck(text, L) {
  const t = String(text || "").trim(), words = explainWords(t);
  const keys = L.explainKeys || [];
  const fixes = typoFixes(words, L);
  const tt = fixes.length ? t + " " + fixes.join(" ") : t;
  const hits = keys.map(([, re]) => re.test(tt));
  const need = L.explainNeed || Math.max(1, Math.ceil(keys.length * 0.6));
  const got = hits.filter(Boolean).length;
  const res = (ok, kind, msg) => ({ ok, kind, msg, hits, got, need });
  if (words.length < 5) return res(false, "short", "Tell me a little more: a sentence or two is plenty.");
  // A common wrong idea blocks the pass, with a friendly correction, even if the key words are there.
  for (const [re, fix] of L.explainWrong || []) if (re.test(t)) return res(false, "wrong", "Careful! " + fix);
  const distinct = new Set(words);
  if (distinct.size < Math.max(4, words.length * 0.4)) return res(false, "words", "Lots of the same words repeated there. Try saying it in a normal sentence.");
  const glue = words.filter((w) => EXPLAIN_GLUE.has(w)).length;
  if (words.length < 12 ? glue < 1 : glue < 3 || glue < words.length * 0.12) return res(false, "words", "That reads like a list of words. Say it in a sentence, as if you're telling a friend.");
  const mash = words.filter((w) => w.length >= 5 && !/\d/.test(w) && (!/[aeiouy]/.test(w) || /[^aeiouy]{5}/.test(w))).length;
  if (mash > words.length * 0.25) return res(false, "words", "Some of that doesn't look like real words. Try again in plain sentences.");
  const asked = new Set(explainWords(String(L.explain || "").replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/g, " ")));
  const fresh = [...distinct].filter((w) => !asked.has(w) && !EXPLAIN_GLUE.has(w));
  if (fresh.length < (words.length < 12 ? 3 : 5)) return res(false, "words", "That mostly repeats the question. In your own words: what happens, and why?");
  if (got >= need) return res(true, "ok", "");
  const miss = keys.filter((_, i) => !hits[i]);
  return res(false, "keys", `Nearly there! Say something about <b>${escapeHtml(miss[0][0])}</b>.` + (need - got > 1 ? ` (${got} of ${need} key ideas so far.)` : ""));
}
