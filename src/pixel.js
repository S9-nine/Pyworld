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
