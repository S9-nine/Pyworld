/* Pixel-art hero sprites. 12×12 grids; each letter maps to a colour in the
   sprite's palette, "." is transparent. Colours lean on the Sweetie-16 palette. */

const PIX_BASE = { k: "#1a1c2c", w: "#f4f4f4", s: "#ffcd9e", b: "#1a1c2c", y: "#ffcd75", r: "#b13e53" };

const SPRITES = [
  { name: "Wizard", pal: { p: "#8e4fc9" }, rows: [
    ".....kk.....", "....kppk....", "...kppppk...", "..kppyppk...",
    ".kkkkkkkkkk.", "..kssssssk..", "..ksbssbsk..", "..kwwsswwk..",
    "..kwwwwwwk..", "...kwwwwk...", "..kppwwppk..", "..kkkkkkkk.."] },
  { name: "Knight", pal: { g: "#94b0c2", w: "#73eff7", u: "#3b5dc9" }, rows: [
    ".....rr.....", "....rrr.....", "...kkkkkk...", "..kggggggk..",
    "..kgwwwwgk..", "..kgkkkkgk..", "..kgkwkwgk..", "..kggggggk..",
    "...kggggk...", "..kuuuuuuk..", ".kuuyuuyuuk.", ".kkkkkkkkkk."] },
  { name: "Ninja", pal: { n: "#333c57" }, rows: [
    "............", "...kkkkkk...", "..knnnnnnk..", ".krrrrrrrrk.",
    ".knssssssnk.", ".knsbssbsnk.", ".knnnnnnnnk.", "rrknnnnnnk..",
    ".rknnnnnnk..", "..knnrrnnk..", "..knnkknnk..", "..kkk..kkk.."] },
  { name: "Robot", pal: { g: "#94b0c2", d: "#566c86", c: "#73eff7" }, rows: [
    ".....kk.....", ".....ky.....", "..kkkkkkkk..", "..kggggggk..",
    "..kgcggcgk..", "..kggggggk..", "..kgkkkkgk..", "..kkkkkkkk..",
    ".kddddddddk.", ".kddryyrddk.", ".kddddddddk.", "..kk....kk.."] },
  { name: "Cat", pal: { o: "#ef7d57", g: "#38b764", p: "#f4a6b8" }, rows: [
    "............", "..k......k..", ".kok....kok.", ".kookkkkook.",
    ".kooooooook.", ".kogoooogok.", ".koooppoook.", ".kooowwoook.",
    "..kooooook..", "..kowwwwok..", "..kooooook..", "..kk....kk.."] },
  { name: "Frog", pal: { g: "#38b764", l: "#a7f070" }, rows: [
    "............", "..kkk..kkk..", ".kwbwkkwbwk.", ".kggggggggk.",
    "kggggggggggk", "kggggggggggk", "kgkggggggkgk", "kggkkkkkkggk",
    ".kggggggggk.", ".kgllllllgk.", "kggkggggkggk", "kkk.kkkk.kkk"] },
  { name: "Ghost", pal: { p: "#f4a6b8" }, rows: [
    "....kkkk....", "..kkwwwwkk..", ".kwwwwwwwwk.", ".kwwwwwwwwk.",
    "kwwbbwwbbwwk", "kwwbbwwbbwwk", "kwwwwwwwwwwk", "kwwwwbbwwwwk",
    "kwpwwwwwwpwk", "kwwwwwwwwwwk", "kwkwwkkwwkwk", ".k.kk..kk.k."] },
  { name: "Slime", pal: { e: "#41a6f6", w: "#cdeefe" }, rows: [
    "............", "............", ".....kk.....", "....keek....",
    "...kewek....", "..kewweek...", ".keeeeeeeek.", ".kekeeeekek.",
    "keekeeeekeek", "keeeekkeeeek", "keeeeeeeeeek", ".kkkkkkkkkk."] },
  { name: "Dragon", pal: { d: "#38b764", l: "#a7f070" }, rows: [
    "..k.....k...", "..kyk..kyk..", "..kdddddddk.", ".kdddddddddk",
    ".kddwbddwbdk", ".kdddddddddk", ".kdllllllldk", ".kddrrrrdddk",
    "..kdddddddk.", "..kdyyyydk..", ".kddyyyyddk.", ".kkk.kk.kkk."] },
  { name: "Astronaut", pal: { c: "#29366f", C: "#73eff7", u: "#3b5dc9" }, rows: [
    "...kkkkkk...", "..kwwwwwwk..", ".kwkkkkkkwk.", ".kwkcCcckwk.",
    ".kwkcccckwk.", ".kwwkkkkwwk.", "..kwwwwwwk..", ".kwwrwwuwwk.",
    "kwkwwwwwwkwk", "kwkwwwwwwkwk", "..kwwkkwwk..", "..kkk..kkk.."] },
  { name: "Fox", pal: { o: "#ef7d57" }, rows: [
    ".k........k.", ".kok....kok.", ".kookkkkook.", ".kooooooook.",
    ".koboooobok.", ".kwwoooowwk.", "..kwwkkwwk..", "...kwwwwk...",
    "..kooooook..", ".koowwwwook.", ".kooooooook.", "..kk....kk.."] },
  { name: "Skelly", pal: {}, rows: [
    "...kkkkkk...", "..kwwwwwwk..", ".kwwwwwwwwk.", ".kwkkwwkkwk.",
    ".kwkkwwkkwk.", ".kwwwkkwwwk.", "..kwwwwwwk..", "..kwkwkwkk..",
    "...kkkkkk...", "..kwkwwkwk..", "..kwkwwkwk..", "...kk..kk..."] }
];

/* SVG markup for a sprite, merging horizontal runs into single rects. */
const _pixCache = {};
function pixelSvg(i, size) {
  const idx = ((i | 0) % SPRITES.length + SPRITES.length) % SPRITES.length;
  if (!_pixCache[idx]) {
    const sp = SPRITES[idx], pal = Object.assign({}, PIX_BASE, sp.pal);
    let rects = "";
    sp.rows.forEach((row, y) => {
      let x = 0;
      while (x < row.length) {
        const ch = row[x];
        let run = 1;
        while (x + run < row.length && row[x + run] === ch) run++;
        if (ch !== "." && pal[ch]) rects += `<rect x="${x}" y="${y}" width="${run}" height="1" fill="${pal[ch]}"/>`;
        x += run;
      }
    });
    _pixCache[idx] = rects;
  }
  return `<svg viewBox="0 0 12 12" ${size ? `width="${size}" height="${size}"` : ""} shape-rendering="crispEdges" aria-hidden="true">${_pixCache[idx]}</svg>`;
}

/* Small pixel icons for the interface. Each is drawn as fills only; a dark outline is added around
   the shape automatically, so every icon matches the heroes' pixel style. */
const PIX_ICON_PAL = { P: "#f4e4c1", Q: "#d9c49a", r: "#b13e53", o: "#ef7d57", y: "#ffcd75", w: "#f4f4f4", G: "#94b0c2", d: "#566c86", B: "#8b5a2b", b: "#3b5dc9", n: "#29366f", c: "#73eff7", g: "#38b764", k: "#1a1c2c" };
const PIX_ICONS = {
  map: [
    "PPPPPPPPPP", "PQQQQQQQQP", "PQrQQQQQQP", "PQQQrQQQQP", "PQQQQQrQQP",
    "PQQQQQQQQP", "PQQQQQrQrP", "PQQQQQQrQP", "PQQQQQrQrP", "PPPPPPPPPP"],
  sword: [
    ".........ww", "........wGw", ".......wGw.", "......wGw..", ".....wGw...",
    "..y.wGw....", "...yGw.....", "...By......", "..B..y.....", ".y........."],
  flame: [
    "....o.....", "....oo....", "...ooo..o.", "...oyoo.o.", "..ooyyooo.",
    "..oyyyyyo.", ".ooyywyyoo", ".oyywwwyyo", ".oyywwwyyo", "..oyyyyyo.", "...ooooo.."],
  shield: [
    "bbbbbbbbbb", "bccbbbbbbb", "bcbbbbbbbb", "byybbbbyyb", "bbyybbyybb",
    "bbbyyyybbb", "bbbbyybbbb", ".bbbbbbbb.", "..bbbbbb..", "...bbbb...", "....bb...."]
};
function pixIcon(name, size = 22) {
  const rows = PIX_ICONS[name];
  if (!rows) return "";
  const h = rows.length + 2, w = Math.max(...rows.map((r) => r.length)) + 2;
  const grid = Array.from({ length: h }, (_, y) => Array.from({ length: w }, (_, x) => (rows[y - 1] || "")[x - 1] || "."));
  const filled = (x, y) => grid[y] && grid[y][x] && grid[y][x] !== "." && grid[y][x] !== "k";
  // Outline: every empty cell next to a filled one (up, down, left, right) becomes dark.
  const out = grid.map((row, y) => row.map((ch, x) => ch === "." && (filled(x - 1, y) || filled(x + 1, y) || filled(x, y - 1) || filled(x, y + 1)) ? "k" : ch).join(""));
  let rects = "";
  out.forEach((row, y) => {
    let x = 0;
    while (x < row.length) { const ch = row[x]; let n = 1; while (row[x + n] === ch) n++; if (ch !== "." && PIX_ICON_PAL[ch]) rects += `<rect x="${x}" y="${y}" width="${n}" height="1" fill="${PIX_ICON_PAL[ch]}"/>`; x += n; }
  });
  return `<svg class="pix-icon" viewBox="0 0 ${w} ${h}" width="${size}" height="${size * h / w}" shape-rendering="crispEdges" aria-hidden="true">${rects}</svg>`;
}
