/* Draws the Code Quest pixel icon and writes:
   assets/code-quest.ico  (16–256 px, for the Windows desktop shortcut)
   assets/code-quest.png  (256 px)
   Run: node src/make-icon.js */
const fs = require("fs"), zlib = require("zlib"), path = require("path");

const PAL = {
  K: [0x1a, 0x1c, 0x2c], Y: [0xff, 0xcd, 0x75], O: [0xef, 0x7d, 0x57],
  W: [0xff, 0xf2, 0xc9], R: [0xb1, 0x3e, 0x53], D: [0x1a, 0x1c, 0x2c]
};

/* 16×16 design: a gold block with a dark outline, light top-left edge,
   orange bottom-right shade, and a </> glyph. */
function design() {
  const g = Array.from({ length: 16 }, () => Array(16).fill("."));
  for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
    const edge = x === 0 || y === 0 || x === 15 || y === 15;
    const corner = (x < 2 || x > 13) && (y < 2 || y > 13);
    if (corner && !((x === 1 || x === 14) && (y === 1 || y === 14))) continue;
    if (edge || ((x === 1 || x === 14) && (y === 1 || y === 14))) { g[y][x] = "K"; continue; }
    if (y === 14 || x === 14) g[y][x] = "O";
    else if (y === 1 || x === 1) g[y][x] = "W";
    else g[y][x] = "Y";
  }
  const lt = [[5, [4, 5]], [6, [3, 4]], [7, [2, 3]], [8, [2, 3]], [9, [3, 4]], [10, [4, 5]]];
  lt.forEach(([y, xs]) => xs.forEach((x) => { g[y][x] = "D"; g[y][15 - x] = "D"; }));
  [[4, 9], [5, 9], [6, 8], [7, 8], [8, 7], [9, 7], [10, 6], [11, 6]].forEach(([y, x]) => (g[y][x] = "R"));
  return g;
}

function render(grid, size) {
  const n = grid.length, px = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const ch = grid[Math.floor((y * n) / size)][Math.floor((x * n) / size)];
    const i = (y * size + x) * 4;
    if (ch === ".") continue;
    const [r, gg, b] = PAL[ch];
    px[i] = r; px[i + 1] = gg; px[i + 2] = b; px[i + 3] = 255;
  }
  return px;
}

const CRC = new Int32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c; });
function crc32(buf) { let c = -1; for (const b of buf) c = CRC[(c ^ b) & 255] ^ (c >>> 8); return (c ^ -1) >>> 0; }
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function png(size, px) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) px.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0))]);
}
function ico(images) {
  const head = Buffer.alloc(6); head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(images.length, 4);
  const dir = Buffer.alloc(16 * images.length);
  let offset = 6 + dir.length;
  images.forEach(({ size, data }, i) => {
    const o = i * 16;
    dir[o] = size >= 256 ? 0 : size; dir[o + 1] = size >= 256 ? 0 : size;
    dir.writeUInt16LE(1, o + 4); dir.writeUInt16LE(32, o + 6);
    dir.writeUInt32LE(data.length, o + 8); dir.writeUInt32LE(offset, o + 12);
    offset += data.length;
  });
  return Buffer.concat([head, dir, ...images.map((im) => im.data)]);
}

const grid = design();
const out = path.join(__dirname, "..", "assets");
fs.mkdirSync(out, { recursive: true });
const sizes = [16, 24, 32, 48, 64, 128, 256];
const images = sizes.map((s) => ({ size: s, data: png(s, render(grid, s)) }));
fs.writeFileSync(path.join(out, "code-quest.ico"), ico(images));
fs.writeFileSync(path.join(out, "code-quest.png"), images[images.length - 1].data);
console.log(grid.map((r) => r.join("")).join("\n"));
console.log("wrote assets/code-quest.ico and assets/code-quest.png");
