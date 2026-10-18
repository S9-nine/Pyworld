/* Python runner (Skulpt) and test checker. */

let pyBusy = false;
let pyStopRequested = false;

class InputExhausted extends Error {}

/* Run Python source.
   opts.inputs: array of strings for test mode, or null for interactive.
   opts.ask(prompt): Promise<string> used in interactive mode.
   opts.onOut(text): streaming output callback.
   Resolves { out, prompts, error } where error = { name, msg, line } or null. */
async function runPython(code, opts = {}) {
  if (typeof Sk === "undefined") {
    return { out: "", prompts: [], error: { name: "EngineNotReady", msg: "The Python engine is still loading. Try again in a moment.", line: null } };
  }
  if (pyBusy) return { out: "", prompts: [], error: { name: "Busy", msg: "Another program is still running.", line: null } };
  pyBusy = true;
  pyStopRequested = false;
  let out = "";
  const prompts = [];
  const queue = opts.inputs ? opts.inputs.slice() : null;
  const emit = (t) => { out += t; if (opts.onOut) opts.onOut(t); };
  const limit = opts.limit || 4000;
  Sk.configure({
    output: emit,
    read: (x) => {
      if (Sk.builtinFiles === undefined || Sk.builtinFiles.files[x] === undefined) throw "File not found: '" + x + "'";
      return Sk.builtinFiles.files[x];
    },
    inputfunTakesPrompt: true,
    inputfun: (prompt) => {
      prompt = prompt == null ? "" : String(prompt);
      if (queue) {
        if (!queue.length) return Promise.reject(new InputExhausted("more"));
        const v = queue.shift();
        prompts.push(norm(prompt + v));
        emit(prompt + v + "\n");
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
  let error = null;
  try {
    await Sk.misceval.asyncToPromise(() => Sk.importMainWithBody("<stdin>", false, code, true), {
      "*": () => { if (pyStopRequested) throw new Sk.builtin.TimeLimitError("Stopped"); }
    });
  } catch (e) {
    error = describeError(e);
  } finally {
    pyBusy = false;
  }
  return { out, prompts, error };
}

function stopPython() {
  pyStopRequested = true;
  if (typeof Sk !== "undefined") Sk.execLimit = 1;
}

function describeError(e) {
  if (e instanceof InputExhausted || (e && e.message === "more")) {
    return { name: "InputError", msg: "Your program asked for more input than this test provides.", line: null };
  }
  let name = "Error", msg = String(e), line = null;
  if (e && e.tp$name) {
    name = e.tp$name;
    try {
      const args = e.args && e.args.v;
      msg = args && args.length ? String(Sk.ffi.remapToJs(args[0])) : "";
    } catch (_) { msg = String(e); }
    if (e.traceback && e.traceback.length) line = e.traceback[0].lineno;
  }
  if (pyStopRequested && name === "TimeLimitError") msg = "Stopped";
  return { name, msg, line };
}

/* Plain-language explanation of a Python error, for beginners. */
function friendlyError(err) {
  const n = err.name, m = err.msg || "";
  if (n === "SyntaxError" || n === "ParseError" || n === "TokenError")
    return "Python couldn't read this line. Common causes: a missing closing quote or bracket, a missing colon after if / elif / else, a single = where you meant ==, or wrong indentation.";
  if (n === "IndentationError")
    return "The spaces at the start of a line are off. Lines inside an if or else need 4 spaces, and lines at the same level must line up.";
  if (n === "NameError") {
    const mm = /name '([^']+)'/.exec(m);
    return (mm ? "Python doesn't know the name <code>" + escapeHtml(mm[1]) + "</code>. " : "Python doesn't know a name you used. ") +
      "Check the spelling and capitals, make sure you created the variable before using it, and put text inside quotes.";
  }
  if (n === "TypeError" && /concatenate|must be str|can only concatenate/.test(m))
    return "You tried to join text and a number with +. Convert the number with <code>str()</code>, or use an f-string.";
  if (n === "TypeError" && /unsupported operand|can't multiply/.test(m))
    return "You're doing math on text. Remember <code>input()</code> gives a string, so wrap it in <code>int()</code> or <code>float()</code>.";
  if (n === "TypeError") return "A value is the wrong type for what you're doing with it. Check which values are strings and which are numbers.";
  if (n === "ValueError" && /invalid literal/.test(m))
    return "<code>int()</code> got text that isn't a whole number. Check what's being converted.";
  if (n === "ZeroDivisionError") return "You divided by zero. Check the number you're dividing by.";
  if (n === "TimeLimitError") return m === "Stopped" ? "You stopped the program." : "Your program ran too long. This usually means a loop that never ends.";
  if (n === "InputError") return "Check how many times you call <code>input()</code>. This test only types in the values listed.";
  if (n === "EngineNotReady" || n === "Busy") return m;
  return "Read the message: the error name and the line number tell you where to look.";
}

const norm = (s) => String(s).replace(/ /g, " ").replace(/[ \t]+/g, " ").trim();

function outputLines(out, prompts) {
  return out.split("\n").map(norm).filter((l) => l !== "" && !prompts.includes(l));
}

/* Run a level's tests. Returns { pass, results:[{pass, input, msg, out}], codeMsg } */
async function runTests(task, code) {
  const stripped = code.replace(/#.*$/gm, "");
  for (const [re, msg] of task.must || []) {
    if (!new RegExp(re).test(stripped)) return { pass: false, results: [], codeMsg: msg };
  }
  for (const [re, msg] of task.mustNot || []) {
    const codeOnly = stripped.split("\n").filter((l) => /print\(|=/.test(l)).join("\n");
    if (new RegExp(re).test(codeOnly)) return { pass: false, results: [], codeMsg: msg };
  }
  const results = [];
  for (const t of task.tests) {
    const r = await runPython(code, { inputs: t.in, limit: 3000 });
    const res = { input: t.in, out: r.out, pass: true, msg: "" };
    if (r.error) {
      res.pass = false;
      res.error = r.error;
      res.msg = r.error.name + (r.error.msg ? ": " + r.error.msg : "") + (r.error.line ? " (line " + r.error.line + ")" : "");
    } else {
      const lines = outputLines(r.out, r.prompts);
      for (const want of t.out) {
        if (!lines.includes(norm(want))) {
          res.pass = false;
          const close = lines.find((l) => l.toLowerCase().replace(/[^a-z0-9]/g, "") === norm(want).toLowerCase().replace(/[^a-z0-9]/g, ""));
          res.msg = close
            ? "Close! Expected <code>" + escapeHtml(want) + "</code> but got <code>" + escapeHtml(close) + "</code>. Check capitals, spaces and punctuation."
            : "Expected a line <code>" + escapeHtml(want) + "</code>.";
          break;
        }
      }
      if (res.pass && t.not) {
        for (const bad of t.not) if (lines.includes(norm(bad))) { res.pass = false; res.msg = "This case should not print <code>" + escapeHtml(bad) + "</code>."; break; }
      }
      if (res.pass && t.only && lines.length !== t.out.length) {
        res.pass = false;
        res.msg = "Print only <code>" + escapeHtml(t.out.join(" / ")) + "</code> for this case. Extra lines appeared.";
      }
      if (res.pass && t.check === "name") {
        if (!lines.some((l) => /^My name is \S+/.test(l))) { res.pass = false; res.msg = "Line 2 should start with <code>My name is</code> followed by a name."; }
      }
    }
    results.push(res);
  }
  return { pass: results.every((r) => r.pass), results, codeMsg: "" };
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
