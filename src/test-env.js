/* Loads the game's checker into Node, exactly as the browser runs it, for the free offline tests.
   The first run downloads Skulpt, sql.js and an HTML parser into .vendor/ (not committed). */
const fs = require("fs"), vm = require("vm"), path = require("path"), https = require("https"), { execSync } = require("child_process");
const ROOT = path.join(__dirname, ".."), VENDOR = path.join(ROOT, ".vendor");
const FILES = {
  "skulpt.min.js": "https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt.min.js",
  "skulpt-stdlib.js": "https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt-stdlib.js",
  "sql-asm.js": "https://cdn.jsdelivr.net/npm/sql.js@1.10.3/dist/sql-asm.js"
};
const get = (url, to) => new Promise((ok, bad) => https.get(url, (r) => {
  if (r.statusCode >= 300 && r.headers.location) return get(r.headers.location, to).then(ok, bad);
  if (r.statusCode !== 200) return bad(new Error(url + " " + r.statusCode));
  const f = fs.createWriteStream(to); r.pipe(f); f.on("finish", () => f.close(ok));
}).on("error", bad));

async function loadGame() {
  fs.mkdirSync(VENDOR, { recursive: true });
  for (const [f, url] of Object.entries(FILES)) if (!fs.existsSync(path.join(VENDOR, f))) { console.log("downloading", f); await get(url, path.join(VENDOR, f)); }
  if (!fs.existsSync(path.join(VENDOR, "node_modules", "linkedom"))) {
    console.log("installing linkedom (HTML parser for the HTML levels)");
    try { execSync("npm install linkedom@0.18.5 --prefix . --no-audit --no-fund --silent", { cwd: VENDOR, stdio: "ignore" }); } catch (_) { console.log("  (couldn't install it; HTML levels will be skipped)"); }
  }
  global.window = global; global.navigator = { userAgent: "node" };
  vm.runInThisContext(fs.readFileSync(path.join(VENDOR, "skulpt.min.js"), "utf8"));
  vm.runInThisContext(fs.readFileSync(path.join(VENDOR, "skulpt-stdlib.js"), "utf8"));
  global.initSqlJs = require(path.join(VENDOR, "sql-asm.js"));
  global.loadScript = async () => {};
  try { const { DOMParser } = require(path.join(VENDOR, "node_modules", "linkedom")); global.DOMParser = DOMParser; } catch (_) {}
  const content = require("./build-list.js").content;
  const src = ["vmods.js", "runner.js"].concat(content).map((f) => fs.readFileSync(path.join(__dirname, f), "utf8")).join("\n") +
    "\n;globalThis.__CQ = { LEVELS, WORLDS, SKILLS, runTests, runPython, outputLines, runSql };";
  vm.runInThisContext(src, { filename: "game.js" });
  return global.__CQ;
}

module.exports = { loadGame, ROOT };
