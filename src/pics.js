/* Lesson pictures: small live pixel scenes in the game's world. Values are things lying on the
   ground (coin piles for numbers, scrolls for text, a backpack for a list, a chest of drawers for a
   dict); names are flags planted next to them. Reassigning a variable makes its flag fly to the new
   value, and two names for one list are simply two flags at the same backpack.

   One SVG per picture. Moving parts are wrapped in PX.live(states, …): each state says where the part
   sits and how visible it is at that step ({x, y, o}), and CSS transitions animate between steps.
   Flags wave, coins glint and stars twinkle with plain CSS; all of it stops for reduced motion.
   A lesson card opts in with pic: "name" (see PIC_FOR at the bottom). */

const PX = {
  pal: { k: "#1a1c2c", w: "#f4f4f4", y: "#ffcd75", o: "#ef7d57" },
  esc: (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])),
  // Pixel art from rows of letters ("." is empty), merging runs into single rects.
  sprite: (rows, x, y, s, pal = PX.pal) => rows.map((row, j) => {
    let out = "", i = 0;
    while (i < row.length) { const ch = row[i]; let k = 1; while (row[i + k] === ch) k++; if (ch !== "." && pal[ch]) out += `<rect x="${x + i * s}" y="${y + j * s}" width="${k * s}" height="${s}" fill="${pal[ch]}"/>`; i += k; }
    return out;
  }).join(""),
  rect: (x, y, w, h, fill, extra = "") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${extra}/>`,
  // Text with a 1px pixel shadow, so it reads anywhere in the scene.
  text: (x, y, str, cls = "px-t", anchor = "middle", shadow = true) => (shadow ? `<text class="${cls} px-sh" x="${x + 1}" y="${y + 1}" text-anchor="${anchor}">${PX.esc(str)}</text>` : "") + `<text class="${cls}" x="${x}" y="${y}" text-anchor="${anchor}">${PX.esc(str)}</text>`,
  st: (s) => `transform:translate(${s.x || 0}px,${s.y || 0}px);opacity:${s.o == null ? 1 : s.o}`,
  live: (states, inner) => `<g class="lv" data-st='${JSON.stringify(states)}' style="${PX.st(states[0])}">${inner}</g>`,
  // The night-time scene: sky, a few twinkling stars, and grass along the bottom.
  scene: (w, h, body, gy = h - 24) => {
    const stars = [[0.08, 0.12], [0.3, 0.07], [0.52, 0.16], [0.71, 0.06], [0.9, 0.14], [0.42, 0.3], [0.83, 0.32]]
      .map(([fx, fy], i) => `<rect class="px-star" style="animation-delay:${(i * 0.45).toFixed(2)}s" x="${Math.round(fx * w)}" y="${Math.round(fy * h)}" width="2" height="2" fill="#94b0c2"/>`).join("");
    const tufts = Array.from({ length: Math.floor(w / 46) }, (_, i) => PX.rect(14 + i * 46 + (i % 3) * 7, gy + 7 + (i % 2) * 6, 6, 2, "#38b764")).join("");
    return `<svg viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges">${PX.rect(0, 0, w, h, "#1a1c2c")}${stars}` +
      `${PX.rect(0, gy, w, h - gy, "#257179")}${PX.rect(0, gy, w, 3, "#38b764")}${tufts}${body}</svg>`;
  },

  /* ── Things in the world ── */
  coins: (cx, gy, value) => {
    const x = cx - 18, y = gy - 24;
    return PX.sprite(["....yyyy....", "...ywwyyy...", "..yyyyyyyy..", ".ywwyyyyywy.", ".yyyyyyyyyy.", "ywwyyyyyywyy", "yyyyyyyyyyyy", ".oooooooooo."], x, y, 3) +
      `<rect class="px-glint" x="${x + 9}" y="${y + 9}" width="3" height="3" fill="#f4f4f4"/>` + PX.text(cx, y - 7, value, "px-v");
  },
  scroll: (cx, gy, str) => {
    const w = Math.max(40, String(str).length * 8 + 22), x = cx - w / 2, y = gy - 24;
    return PX.rect(x, y, w, 20, "#f4e4c1") + PX.rect(x, y, w, 2, "#d9c49a") + PX.rect(x, y + 18, w, 2, "#d9c49a") +
      PX.rect(x - 5, y - 2, 7, 24, "#d9c49a") + PX.rect(x + w - 2, y - 2, 7, 24, "#d9c49a") + PX.rect(x - 5, y + 9, 7, 2, "#a8743f") + PX.rect(x + w - 2, y + 9, 7, 2, "#a8743f") +
      PX.text(cx, y + 14, str, "px-ink", "middle", false);
  },
  // A planted flag with the variable's name on its waving banner.
  flag: (x, gy, name, col = "#3b5dc9", dark = "#29366f") => {
    const bw = String(name).length * 8 + 18, top = gy - 74;
    return PX.rect(x - 4, gy - 3, 11, 3, "#333c57") + PX.rect(x, top, 3, 74, "#94b0c2") + PX.rect(x - 1, top - 4, 5, 5, "#ffcd75") +
      `<g class="px-wave">${PX.rect(x + 3, top + 2, bw, 20, col)}${PX.rect(x + 3, top + 19, bw, 3, dark)}${PX.rect(x + 3 + bw, top + 2, 7, 7, col)}${PX.rect(x + 3 + bw, top + 15, 7, 7, col)}` +
      `${PX.text(x + 3 + bw / 2, top + 16, name, "px-name")}</g>`;
  },
  // A backpack with numbered pockets (a list).
  pocket: (px, y, it) => PX.rect(px, y + 10, 44, 30, "#a8743f") + PX.rect(px, y + 10, 44, 3, "#5a3a12") + PX.text(px + 22, y + 31, it, "px-cream", "middle", false),
  bag: (x, gy, items, opts = {}) => {
    const w = items.length * 48 + 16, y = gy - 52;
    let out = PX.rect(x + 10, y - 10, w - 20, 12, "#8b5a2b") + PX.rect(x + w / 2 - 14, y - 16, 28, 8, "#5a3a12") + PX.rect(x, y, w, 52, "#8b5a2b") + PX.rect(x, y + 48, w, 4, "#5a3a12");
    items.forEach((it, i) => {
      const px = x + 8 + i * 48;
      out += PX.pocket(px, y, it);
      if (opts.idx) out += PX.text(px + 22, y - 22, String(i), "px-idx");
      if (opts.neg) out += PX.text(px + 22, gy + 17, String(i - items.length), "px-neg");
    });
    return out;
  },
  // A pixel hero (one of the game's own sprites), standing on the ground.
  hero: (x, gy, i = 0, s = 3) => {
    const sp = SPRITES[i % SPRITES.length];
    return PX.sprite(sp.rows, x, gy - 12 * s, s, Object.assign({}, PIX_BASE, sp.pal));
  },
  // A pointing arrow above something, with a label.
  pointer: (cx, y, label, cls = "px-v") => PX.text(cx, y, label, cls) + PX.sprite(["kyyyyk", ".kyyk.", "..kk.."], cx - 9, y + 5, 3),
  bubble: (cx, y, str) => {
    const w = String(str).length * 7.6 + 20;
    return PX.rect(cx - w / 2, y, w, 22, "#f4f4f4") + PX.rect(cx - w / 2 + 2, y + 22, w - 4, 2, "#94b0c2") + PX.rect(cx - 3, y + 24, 6, 5, "#f4f4f4") + PX.text(cx, y + 15, str, "px-ink", "middle", false);
  }
};

const PICS = {
  /* 1-2: names are flags planted next to values */
  tags: () => ({ w: 400, h: 136, caps: ["Each variable is a name planted next to a value. The hero flag marks the text \"Kai\" (a str). The gold flag marks a pile of 50 coins (an int)."],
    body: PX.flag(40, 112, "hero") + PX.scroll(150, 112, "\"Kai\"") + PX.flag(232, 112, "gold") + PX.coins(340, 112, "50") }),

  /* 1-2: gold = gold + 25: right side first, then the flag moves */
  reassign: () => ({ w: 420, h: 186, caps: [
      "Start: gold = 50. The gold flag is planted next to a pile of 50 coins.",
      "gold = gold + 25. Right side first: Python looks up gold (50), works out 50 + 25, and makes a new pile of 75.",
      "Then = moves the gold flag to the new pile. Nothing marks the old 50 any more, so Python clears it away."],
    body: PX.live([{}, {}, { o: 0.2 }], PX.coins(150, 162, "50")) +
      PX.live([{ o: 0, y: -10 }, {}, { o: 0 }], PX.bubble(250, 30, "50 + 25 → 75")) +
      PX.live([{ o: 0, y: 14 }, {}, {}], PX.coins(330, 162, "75")) +
      PX.live([{}, {}, { x: 238 }], PX.flag(46, 162, "gold")) }),

  /* 1-3: + joins text, adds numbers */
  plus: () => ({ w: 420, h: 196, caps: [
      "The same + sign does different jobs. Top shelf: two pieces of text. Bottom: two numbers.",
      "Text joins side by side: \"5\" + \"5\" is \"55\". Numbers add up: 5 + 5 is 10."],
    body: PX.rect(60, 70, 240, 5, "#5a3a12") + PX.rect(70, 75, 5, 10, "#5a3a12") + PX.rect(285, 75, 5, 10, "#5a3a12") +
      PX.text(30, 62, "str", "px-lbl") + PX.text(30, 164, "int", "px-lbl") +
      PX.live([{}, { x: 65, o: 0 }], PX.scroll(110, 70, "\"5\"")) + PX.live([{}, { o: 0 }], PX.text(175, 58, "+", "px-v")) + PX.live([{}, { x: -65, o: 0 }], PX.scroll(240, 70, "\"5\"")) +
      PX.live([{ o: 0, y: -8 }, {}], PX.scroll(175, 70, "\"55\"")) +
      PX.live([{}, { x: 65, o: 0 }], PX.coins(110, 172, "5")) + PX.live([{}, { o: 0 }], PX.text(175, 160, "+", "px-v")) + PX.live([{}, { x: -65, o: 0 }], PX.coins(240, 172, "5")) +
      PX.live([{ o: 0, y: -8 }, {}], PX.coins(175, 172, "10")) +
      PX.text(360, 62, "\"5\" + \"5\"", "px-code") + PX.text(360, 150, "5 + 5", "px-code") }),

  /* 1-7: the first open gate wins */
  elif: () => {
    const gy = 160, gx = [130, 220, 310];
    const gate = (x) => PX.rect(x, gy - 58, 6, 58, "#566c86") + PX.rect(x + 46, gy - 58, 6, 58, "#566c86") + PX.rect(x - 2, gy - 62, 56, 6, "#94b0c2");
    const labels = (texts, grades) => texts.map((t, i) => PX.text(gx[i] + 26, gy - 70, t, "px-code") + PX.text(gx[i] + 26, gy + 18, grades[i], "px-neg")).join("");
    return { w: 420, h: 190, caps: [
        "score = 95. Your hero walks the road and tries each gate in order, starting with >= 90.",
        "95 >= 90 is True, so the hero goes through the first gate: grade A. The other gates are never tried.",
        "Now the gates are in the wrong order: >= 50 comes first.",
        "95 >= 50 is True straight away, so the hero takes the first gate: grade C. The A gate is never reached. Put the biggest limit first."],
      body: gx.map(gate).join("") +
        PX.live([{}, {}, { o: 0 }, { o: 0 }], labels([">= 90", ">= 70", ">= 50"], ["A", "B", "C"])) +
        PX.live([{ o: 0 }, { o: 0 }, {}, {}], labels([">= 50", ">= 70", ">= 90"], ["C", "B", "A"])) +
        PX.text(56, 40, "score = 95", "px-code") +
        PX.live([{}, { x: 120, y: -4 }, {}, { x: 120, y: -4 }], PX.hero(34, gy, 0, 3)) +
        PX.live([{ o: 0 }, {}, { o: 0 }, { o: 0 }], PX.text(156, 58, "✓ A", "px-good")) +
        PX.live([{ o: 0 }, { o: 0 }, { o: 0 }, {}], PX.text(156, 58, "✓ C", "px-bad")) };
  },

  /* 2-3: positions in a backpack */
  slots: () => {
    const gy = 158, x = 110, pc = (i) => x + 8 + i * 48 + 22;
    return { w: 420, h: 190, caps: [
        "A list is a backpack with numbered pockets. Positions start at 0, so backpack[0] is \"map\".",
        "Counting from the end uses negative numbers: backpack[-1] is the last pocket, \"bread\"."],
      body: PX.bag(x, gy, ["map", "torch", "rope", "bread"], { idx: true, neg: true }) + PX.text(20, 30, "backpack", "px-code", "start") +
        PX.live([{}, { x: pc(3) - pc(0), o: 0 }], PX.pointer(pc(0), 30, "[0]")) +
        PX.live([{ o: 0 }, {}], PX.pointer(pc(3), 30, "[-1]")) };
  },

  /* 2-3: two names, one list */
  alias: () => {
    const gy = 160, x = 130;
    const extra = PX.rect(x + 160, gy - 52, 48, 52, "#8b5a2b") + PX.rect(x + 160, gy - 4, 48, 4, "#5a3a12") + PX.pocket(x + 8 + 3 * 48, gy - 52, "4");
    return { w: 540, h: 186, caps: [
        "b = a doesn't copy the list. It plants a second flag at the same backpack.",
        "So b.append(4) puts 4 into the one backpack, and a sees it too: a is now [1, 2, 3, 4].",
        "c = a.copy() makes a new backpack with its own flag, so changing c leaves a alone."],
      body: PX.flag(18, gy, "a") + PX.flag(70, gy, "b", "#ef7d57", "#b13e53") + PX.bag(x, gy, ["1", "2", "3"]) +
        PX.live([{ o: 0, y: -16 }, {}, {}], extra) +
        PX.live([{ o: 0, y: 10 }, { o: 0, y: 10 }, {}], PX.flag(366, gy, "c", "#38b764", "#257179") + `<g transform="translate(406 ${gy * 0.4}) scale(.6)">${PX.bag(0, gy, ["1", "2", "3", "4"])}</g>`) +
        PX.live([{ o: 0 }, { o: 0 }, {}], PX.text(450, 30, "c = a.copy()", "px-code")) };
  },

  /* 2-5: return hands a value back */
  machine: () => {
    const gy = 160;
    const forge = PX.rect(170, gy - 56, 80, 56, "#566c86") + PX.rect(176, gy - 50, 68, 30, "#333c57") +
      `<g class="px-fire">${PX.rect(186, gy - 42, 12, 16, "#ef7d57")}${PX.rect(200, gy - 46, 14, 20, "#ffcd75")}${PX.rect(216, gy - 40, 12, 14, "#ef7d57")}</g>` +
      PX.rect(164, gy - 64, 92, 8, "#94b0c2") + PX.text(210, gy - 72, "add_tax()", "px-code");
    return { w: 420, h: 190, caps: [
        "A function is a forge. You pass in an argument: price = 100.",
        "The forge works on it inside, where you can't see.",
        "return hands the answer back: 118. total = add_tax(100) plants the total flag on it. print would only show it on the screen."],
      body: forge + PX.live([{}, { x: 120, o: 0 }, { x: 120, o: 0 }], PX.coins(80, gy, "100")) +
        PX.live([{ o: 0, x: -50 }, { o: 0, x: -50 }, {}], PX.coins(350, gy, "118")) +
        PX.live([{ o: 0 }, { o: 0 }, {}], PX.flag(262, gy, "total", "#38b764", "#257179") + PX.text(372, 104, "return", "px-good")) };
  },

  /* 2-7: a dict is a chest of labelled drawers */
  drawers: () => {
    const x = 130, gy = 166, rows = [["dosa", "40"], ["idli", "30"], ["vada", "25"]];
    const chest = PX.rect(x, gy - 120, 120, 120, "#8b5a2b") + PX.rect(x - 4, gy - 124, 128, 6, "#5a3a12");
    const drawer = (i, [k, v]) => {
      const y = gy - 112 + i * 38;
      const front = PX.rect(x + 8, y, 104, 32, "#a8743f") + PX.rect(x + 8, y + 29, 104, 3, "#5a3a12") + PX.rect(x + 26, y + 8, 68, 16, "#f4e4c1") + PX.text(x + 60, y + 20, `"${k}"`, "px-ink", "middle", false);
      const inside = PX.sprite(["..yyyy..", ".ywyyyy.", "yyyyyyyy", ".oooooo."], x + 152, y + 10, 3) + PX.text(x + 196, y + 22, v, "px-v", "start");
      return i === 1 ? PX.live([{ o: 0 }, {}], inside) + PX.live([{}, { x: 34 }], front) : front;
    };
    return { w: 420, h: 190, caps: [
        "A dictionary is a chest of drawers, each with a label (the key): \"dosa\", \"idli\" and \"vada\".",
        "prices[\"idli\"] opens the idli drawer straight away: 30. No searching through the others."],
      body: chest + rows.map((r, i) => drawer(i, r)).join("") + PX.text(60, 40, "prices", "px-code") +
        PX.live([{ o: 0 }, {}], PX.text(350, 40, "prices[\"idli\"]", "px-code")) };
  },

  /* 4-6: JOIN vs LEFT JOIN */
  joins: () => {
    const people = [["Asha", 10], ["Ravi", 4], ["Meera", 1]];
    const villagers = people.map(([n, s], i) => PX.hero(24, 54 + i * 46, s, 2.5) + PX.text(64, 46 + i * 46, n, "px-t", "start")).join("");
    const orders = [["chai", 0], ["dosa", 0], ["idli", 1]].map(([o, who], i) => `<path class="px-rope" d="M118 ${40 + who * 46}L298 ${44 + i * 46}"/>` + PX.scroll(332, 58 + i * 46, o)).join("");
    return { w: 420, h: 214, caps: [
        "JOIN keeps only customers whose orders match: Asha (twice) and Ravi. Meera has no orders, so she disappears from the result.",
        "LEFT JOIN keeps every customer from the left table. Meera stays, with NULL (empty) where her order would be. That's how you find customers who never ordered."],
      body: villagers + orders + PX.text(60, 18, "customers", "px-lbl") + PX.text(332, 18, "orders", "px-lbl") +
        PX.live([{}, { o: 0 }], PX.text(320, 178, "Meera: left out", "px-bad")) +
        PX.live([{ o: 0 }, {}], `<path class="px-rope px-dash" d="M118 132L298 170"/>` + PX.rect(304, 158, 56, 22, "none", 'stroke="#94b0c2" stroke-width="2" stroke-dasharray="4 3"') + PX.text(332, 174, "NULL", "px-lbl")) };
  },

  /* 7-1: where changes travel in Git */
  git: () => {
    const gy = 160, xs = [40, 140, 240, 340];
    const desk = PX.rect(xs[0] - 6, gy - 24, 56, 6, "#8b5a2b") + PX.rect(xs[0], gy - 18, 6, 18, "#5a3a12") + PX.rect(xs[0] + 38, gy - 18, 6, 18, "#5a3a12");
    const crate = PX.rect(xs[1], gy - 30, 44, 30, "#a8743f") + PX.rect(xs[1], gy - 30, 44, 4, "#5a3a12") + PX.rect(xs[1] + 20, gy - 30, 4, 30, "#8b5a2b");
    const shelf = PX.rect(xs[2] - 4, gy - 60, 52, 60, "#5a3a12") + [0, 1, 2].map((r) => PX.rect(xs[2], gy - 56 + r * 19, 44, 14, ["#b13e53", "#3b5dc9", "#38b764"][r])).join("");
    const cloud = PX.rect(xs[3] - 10, 40, 70, 22, "#f4f4f4") + PX.rect(xs[3], 30, 44, 12, "#f4f4f4") + PX.rect(xs[3] + 8, 22, 6, 10, "#94b0c2") + PX.rect(xs[3] + 26, 18, 8, 14, "#94b0c2") + PX.rect(xs[3] + 28, 10, 6, 6, "#b13e53");
    const page = PX.rect(-2, -2, 22, 26, "#5a3a12") + PX.rect(0, 0, 18, 22, "#ffcd75") + PX.rect(3, 5, 12, 2, "#a8743f") + PX.rect(3, 10, 12, 2, "#a8743f") + PX.rect(3, 15, 8, 2, "#a8743f");
    const spots = [{ x: xs[0] + 13, y: gy - 50 }, { x: xs[1] + 13, y: gy - 56 }, { x: xs[2] + 13, y: gy - 88 }, { x: xs[3] + 16, y: 44 }];
    return { w: 420, h: 186, caps: [
        "You change a file on your computer. Git hasn't saved anything yet.",
        "git add puts the change in the staging crate: \"this goes in the next snapshot\".",
        "git commit saves a snapshot on the history shelf, with a message. It's still only on your computer!",
        "git push sends your commits up to GitHub, so others can see them."],
      body: desk + crate + shelf + cloud + PX.text(xs[0] + 22, gy + 18, "your files", "px-lbl") + PX.text(xs[1] + 22, gy + 18, "staging", "px-lbl") + PX.text(xs[2] + 22, gy + 18, "history", "px-lbl") + PX.text(xs[3] + 25, 82, "GitHub", "px-lbl") +
        PX.live([{ o: 0 }, {}, { o: 0.35 }, { o: 0.35 }], PX.text(xs[1] + 22, 30, "git add", "px-code")) +
        PX.live([{ o: 0 }, { o: 0 }, {}, { o: 0.35 }], PX.text(xs[2] + 22, 30, "git commit", "px-code")) +
        PX.live([{ o: 0 }, { o: 0 }, { o: 0 }, {}], PX.text(xs[3] + 25, 110, "git push", "px-code")) +
        PX.live(spots, page) };
  },

  /* 8-6: a stack of plates */
  stack: () => {
    const gy = 166, plate = (col, dark) => PX.rect(0, 0, 110, 14, col) + PX.rect(6, 14, 98, 4, dark);
    const at = (lvl) => ({ x: 120, y: gy - 22 - lvl * 22 });
    const off = { x: 120, y: -30, o: 0 }, gone = { x: 290, y: 40, o: 0 };
    return { w: 420, h: 190, caps: [
        "append(\"red\") puts a plate on the pile.",
        "append(\"blue\") goes on top of it…",
        "…and append(\"green\") on top of that.",
        "pop() always takes from the top: green comes off first. Last in, first out."],
      body: PX.rect(100, gy - 4, 150, 4, "#94b0c2") +
        PX.live([at(0), at(0), at(0), at(0)], plate("#b13e53", "#5d275d")) +
        PX.live([off, at(1), at(1), at(1)], plate("#3b5dc9", "#29366f")) +
        PX.live([off, off, at(2), gone], plate("#38b764", "#257179")) +
        PX.live([{ o: 0 }, { o: 0 }, { o: 0 }, {}], PX.text(340, 70, "pop() → \"green\"", "px-code")) };
  },

  /* 8-7: binary search halves the row */
  halving: () => {
    const nums = [2, 5, 8, 12, 16, 23, 38], gy = 150, x0 = 22, step = 54;
    const stone = (i) => { const x = x0 + i * step; return PX.rect(x, gy - 30, 44, 30, "#566c86") + PX.rect(x, gy - 30, 44, 4, "#94b0c2") + PX.text(x + 22, gy - 9, String(nums[i]), "px-t"); };
    const fx = (i) => x0 + i * step + 20;
    return { w: 410, h: 180, caps: [
        "Looking for 23 in a sorted row of stones. Check the middle stone first: 12.",
        "12 is too small, so 23 must be on the right. The whole left half is thrown away in one go.",
        "The new middle is 23. Found it in 2 looks instead of 6."],
      body: nums.map((_, i) => PX.live(i < 4 ? [{}, { o: 0.2, y: 6 }, { o: 0.2, y: 6 }] : [{}, {}, {}], stone(i))).join("") +
        PX.live([{ x: fx(3) - 20 }, { x: fx(5) - 20 }, { x: fx(5) - 20 }], PX.flag(20, gy - 30, "mid", "#ef7d57", "#b13e53")) +
        PX.live([{ o: 0 }, { o: 0 }, {}], PX.text(fx(5) + 10, 24, "found!", "px-good")) };
  }
};

/* Which lesson cards get which picture: level id → { card index: picture }. */
const PIC_FOR = {
  "1-2": { 0: "tags", 1: "reassign" },
  "1-3": { 1: "plus" },
  "1-7": { 1: "elif" },
  "2-3": { 1: "slots", 2: "alias" },
  "2-5": { 2: "machine" },
  "2-7": { 0: "drawers" },
  "4-6": { 2: "joins" },
  "7-1": { 1: "git" },
  "8-6": { 0: "stack" },
  "8-7": { 1: "halving" }
};
for (const L of LEVELS) for (const [i, name] of Object.entries(PIC_FOR[L.id] || {})) if (L.learn[i]) L.learn[i].pic = name;

/* Markup for a card's picture. One SVG; the caption and the moving parts change with each step. */
function picHtml(name, key) {
  const p = PICS[name] && PICS[name]();
  if (!p) return "";
  const n = p.caps.length;
  return `<figure class="pic" data-pic="${key}" data-steps="${n}" data-caps='${PX.esc(JSON.stringify(p.caps))}'>` +
    `<div class="pic-scene" role="img" aria-label="${PX.esc(p.caps.join(" "))}">${PX.scene(p.w, p.h, p.body)}</div>` +
    `<figcaption aria-live="polite">${PX.esc(p.caps[0])}</figcaption>` +
    (n > 1 ? `<div class="pic-nav"><button type="button" class="btn sm" data-pp>◂ Back</button><span class="pic-count">1 / ${n}</span><button type="button" class="btn sm" data-pn>Next ▸</button><button type="button" class="btn sm ghost" data-play title="Play it again">↻ Replay</button></div>` : "") + `</figure>`;
}
function wirePic(fig) {
  const n = +fig.dataset.steps, caps = JSON.parse(fig.dataset.caps), cap = fig.querySelector("figcaption");
  if (n < 2) return;
  const parts = [...fig.querySelectorAll(".lv")].map((g) => [g, JSON.parse(g.dataset.st)]);
  let at = 0, timer = null;
  const show = (i) => {
    at = Math.max(0, Math.min(n - 1, i));
    for (const [g, st] of parts) g.setAttribute("style", PX.st(st[Math.min(at, st.length - 1)]));
    cap.textContent = caps[at];
    fig.querySelector(".pic-count").textContent = `${at + 1} / ${n}`;
    fig.querySelector("[data-pp]").disabled = at === 0;
    fig.querySelector("[data-pn]").disabled = at === n - 1;
  };
  const stop = () => { clearInterval(timer); timer = null; };
  const play = () => { stop(); show(0); timer = setInterval(() => { if (at >= n - 1) return stop(); show(at + 1); }, 2600); };
  fig.querySelector("[data-pp]").addEventListener("click", () => { stop(); show(at - 1); });
  fig.querySelector("[data-pn]").addEventListener("click", () => { stop(); show(at + 1); });
  fig.querySelector("[data-play]").addEventListener("click", play);
  show(0);
  // Play through once by itself the first time the picture scrolls into view (not with reduced motion).
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); setTimeout(play, 700); } }, { threshold: 0.6 });
    io.observe(fig);
  }
}
