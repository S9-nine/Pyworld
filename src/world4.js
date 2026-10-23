/* World 4 — Data Desert: nested data, JSON, web APIs, SQL, sqlite3. Boss: The Habit Tracker. */

RESOURCES[4] = [
  { name: "SQLBolt", what: "Short interactive SQL lessons in your browser. Lessons 1–7 and 10–12 match this world.", url: "https://sqlbolt.com/lesson/select_queries_introduction" },
  { name: "Automate the Boring Stuff, ch. 16 and 18", what: "SQLite databases from Python, and CSV/JSON files.", url: "https://automatetheboringstuff.com/3e/chapter16.html" },
  { name: "Harvard CS50P, Week 4 notes", what: "Using requests and json with a real API (iTunes).", url: "https://cs50.harvard.edu/python/notes/4/" },
  { name: "requests: Quickstart", what: "GET, params, .json(), status codes and timeouts, from the official docs.", url: "https://requests.readthedocs.io/en/latest/user/quickstart/" },
  { name: "CS50 SQL", what: "Harvard's free SQL course using SQLite. Weeks 0 and 1 cover querying and joins.", url: "https://cs50.harvard.edu/sql/" }
];

const W4_SHOP = `CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, category TEXT, price INTEGER, stock INTEGER);
INSERT INTO products VALUES
 (1, 'Masala Chai Mix', 'drinks', 120, 30),
 (2, 'Banana Chips', 'snacks', 45, 80),
 (3, 'Mango Lassi', 'drinks', 60, 0),
 (4, 'Bhujia', 'snacks', 35, 120),
 (5, 'Ragi Cookies', 'snacks', 90, 25),
 (6, 'Filter Coffee', 'drinks', 150, NULL),
 (7, 'Peanut Chikki', 'sweets', 25, 60),
 (8, 'Kaju Katli', 'sweets', 480, 10),
 (9, 'Khakhra', 'snacks', 55, 40),
 (10, 'Rose Sharbat', 'drinks', 85, 15);`;
const W4_SHOP2 = `CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, category TEXT, price INTEGER, stock INTEGER);
INSERT INTO products VALUES
 (1, 'Murukku', 'snacks', 58, 5),
 (2, 'Jaljeera', 'drinks', 30, 90),
 (3, 'Mathri', 'snacks', 20, NULL),
 (4, 'Soan Papdi', 'sweets', 150, 12),
 (5, 'Chakli', 'snacks', 60, 33),
 (6, 'Nimbu Pani', 'drinks', 25, 50),
 (7, 'Namak Pare', 'snacks', 59, 8),
 (8, 'Thandai', 'drinks', 110, NULL);`;
const W4_ORDERS = `CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT, city TEXT);
INSERT INTO customers VALUES (1, 'Asha', 'Pune'), (2, 'Ravi', 'Delhi'), (3, 'Meera', 'Kochi'), (4, 'Om', 'Pune');
CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, amount INTEGER, day TEXT);
INSERT INTO orders VALUES (1, 1, 250, '2026-10-01'), (2, 2, 120, '2026-10-01'), (3, 1, 90, '2026-10-02'), (4, 3, 480, '2026-10-03'), (5, 1, 60, '2026-10-04'), (6, 2, 300, '2026-10-05');`;
const W4_ORDERS2 = `CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT, city TEXT);
INSERT INTO customers VALUES (1, 'Zoya', 'Agra'), (2, 'Kiran', 'Goa'), (3, 'Dev', 'Agra');
CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, amount INTEGER, day TEXT);
INSERT INTO orders VALUES (1, 3, 100, '2026-09-01'), (2, 1, 60, '2026-09-02'), (3, 1, 40, '2026-09-03');`;
const W4_LIBRARY = `CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL, author TEXT NOT NULL, year INTEGER);
INSERT INTO books (title, author, year) VALUES
 ('The Guide', 'R. K. Narayan', 1958),
 ('Wings of Fire', 'A. P. J. Abdul Kalam', 1999),
 ('Swami and Friends', 'R. K. Narayan', 1935),
 ('The God of Small Things', 'Arundhati Roy', 1997),
 ('Malgudi Days', 'R. K. Narayan', 1943),
 ('Train to Pakistan', 'Khushwant Singh', 1956);`;

LEVELS.push(
/* ───────────────────────────── 4-1 ───────────────────────────── */
{
  id: "4-1", world: 4, n: 1, title: "Nested Treasure", concept: "lists of dicts, sorting with key",
  learn: [
    { h: "Data inside data",
      p: "Real data is <b>nested</b>: lists inside dictionaries inside lists. Reach inside one step at a time, reading left to right. <code>shop[\"items\"]</code> is a list, so <code>shop[\"items\"][0]</code> is its first item, which is a dictionary, so <code>[\"name\"]</code> gets its name.",
      code: `shop = {
    "name": "Desert Chai Stall",
    "items": [
        {"name": "chai", "price": 15, "tags": ["hot", "sweet"]},
        {"name": "lassi", "price": 40, "tags": ["cold"]},
    ],
}
print(shop["name"])
print(shop["items"][0]["name"])
print(shop["items"][1]["tags"][0])
print(len(shop["items"]), "items")` },
    { h: "Loop over records",
      p: "A list of dictionaries is like a table: each dictionary is one row. Loop over the list and pick out the fields you need. Combine this with the patterns from World 2: counting, totals and best-so-far.",
      code: `orders = [
    {"customer": "Asha", "item": "chai", "qty": 2},
    {"customer": "Ravi", "item": "lassi", "qty": 1},
    {"customer": "Asha", "item": "lassi", "qty": 3},
]
cups = {}
for o in orders:
    cups[o["customer"]] = cups.get(o["customer"], 0) + o["qty"]
print(cups)` },
    { h: "Sort by any field with key=",
      p: "<code>sorted()</code> can sort by any rule. Give it <code>key=</code>, a small function that picks what to compare. <code>lambda o: o[\"qty\"]</code> is a one-line function: \"given o, return its qty\". Add <code>reverse=True</code> for biggest first.",
      code: `orders = [
    {"customer": "Asha", "qty": 2},
    {"customer": "Ravi", "qty": 5},
    {"customer": "Meera", "qty": 1},
]
by_qty = sorted(orders, key=lambda o: o["qty"], reverse=True)
for o in by_qty:
    print(o["customer"], o["qty"])
print(max(orders, key=lambda o: o["qty"])["customer"], "ordered the most")` },
    { h: "Sort by two things",
      p: "When there's a tie, add a second rule by returning a <b>tuple</b>: Python compares the first value, then the second. A minus sign sorts numbers biggest-first while text stays A–Z.",
      code: `scores = {"Ravi": 90, "Asha": 95, "Om": 90, "Zoya": 70}
ranked = sorted(scores.items(), key=lambda kv: (-kv[1], kv[0]))
for name, score in ranked:
    print(name, score)` }
  ],
  think: [
    { type: "mcq", q: "How do you get <code>\"cold\"</code>?", code: `shop = {"items": [{"name": "chai", "tags": ["hot"]}, {"name": "lassi", "tags": ["cold", "sweet"]}]}`, options: ["shop[\"tags\"][0]", "shop[\"items\"][1][\"tags\"][0]", "shop[1][\"tags\"][0]", "shop[\"items\"][\"lassi\"][0]"], answer: 1,
      why: "Step by step: <code>shop[\"items\"]</code> is the list, <code>[1]</code> is lassi's dictionary, <code>[\"tags\"]</code> is its list, and <code>[0]</code> is \"cold\"." },
    { type: "predict", q: "What does this print?", code: `people = [{"name": "Asha", "age": 31}, {"name": "Ravi", "age": 24}, {"name": "Om", "age": 28}]
for p in sorted(people, key=lambda p: p["age"]):
    print(p["name"])`, answer: "Ravi\nOm\nAsha",
      why: "<code>key=</code> sorts by age, youngest first: 24, 28, 31." },
    { type: "mcq", q: "This crashes with <code>TypeError: list indices must be integers or slices, not str</code>. Why?", code: `data = {"users": [{"name": "Asha"}, {"name": "Ravi"}]}
print(data["users"]["name"])`, options: ["\"name\" is misspelled", "data[\"users\"] is a list, so it needs a number index first", "Dictionaries can't hold lists", "print can't show names"], answer: 1,
      why: "<code>data[\"users\"]</code> is a list of users. Pick one first: <code>data[\"users\"][0][\"name\"]</code>, or loop over them." }
  ],
  code: {
    brief: "A chai stall's orders arrive as a list of dictionaries like <code>{\"customer\": \"Asha\", \"item\": \"chai\", \"qty\": 2, \"price\": 15}</code>. Write three functions that <b>return</b> answers:<br>• <code>revenue(orders)</code>: total money, adding qty × price for every order.<br>• <code>items_sold(orders)</code>: a dictionary of item → total qty, items in the order they first appear.<br>• <code>leaderboard(orders)</code>: a list of <code>(customer, spent)</code> tuples, highest spender first. If two customers spent the same, sort them A–Z by name.",
    sample: ">>> leaderboard(orders)\n[('Ravi', 120), ('Om', 90), ('Asha', 70)]",
    starter: `def revenue(orders):
    pass


def items_sold(orders):
    pass


def leaderboard(orders):
    pass


orders = [
    {"customer": "Asha", "item": "chai", "qty": 2, "price": 15},
    {"customer": "Ravi", "item": "lassi", "qty": 3, "price": 40},
    {"customer": "Om", "item": "samosa", "qty": 3, "price": 20},
    {"customer": "Asha", "item": "lassi", "qty": 1, "price": 40},
    {"customer": "Om", "item": "chai", "qty": 2, "price": 15},
]
print(leaderboard(orders))
`,
    tests: [
      { setup: "o = [{'customer': 'Asha', 'item': 'chai', 'qty': 2, 'price': 15}, {'customer': 'Ravi', 'item': 'lassi', 'qty': 3, 'price': 40}, {'customer': 'Om', 'item': 'samosa', 'qty': 3, 'price': 20}, {'customer': 'Asha', 'item': 'lassi', 'qty': 1, 'price': 40}, {'customer': 'Om', 'item': 'chai', 'qty': 2, 'price': 15}]", call: "revenue(o)", expect: "280", label: "<code>revenue</code> of the sample orders" },
      { call: "revenue([])", expect: "0" },
      { setup: "o = [{'customer': 'Asha', 'item': 'chai', 'qty': 2, 'price': 15}, {'customer': 'Ravi', 'item': 'lassi', 'qty': 3, 'price': 40}, {'customer': 'Om', 'item': 'samosa', 'qty': 3, 'price': 20}, {'customer': 'Asha', 'item': 'lassi', 'qty': 1, 'price': 40}, {'customer': 'Om', 'item': 'chai', 'qty': 2, 'price': 15}]", call: "items_sold(o)", expect: "{'chai': 4, 'lassi': 4, 'samosa': 3}", label: "<code>items_sold</code> of the sample orders" },
      { setup: "o = [{'customer': 'Asha', 'item': 'chai', 'qty': 2, 'price': 15}, {'customer': 'Ravi', 'item': 'lassi', 'qty': 3, 'price': 40}, {'customer': 'Om', 'item': 'samosa', 'qty': 3, 'price': 20}, {'customer': 'Asha', 'item': 'lassi', 'qty': 1, 'price': 40}, {'customer': 'Om', 'item': 'chai', 'qty': 2, 'price': 15}]", call: "leaderboard(o)", expect: "[('Ravi', 120), ('Om', 90), ('Asha', 70)]", label: "<code>leaderboard</code> of the sample orders" },
      { setup: "o = [{'customer': 'Zed', 'item': 'x', 'qty': 1, 'price': 50}, {'customer': 'Amy', 'item': 'y', 'qty': 2, 'price': 25}, {'customer': 'Bo', 'item': 'x', 'qty': 1, 'price': 10}]", call: "leaderboard(o)", expect: "[('Amy', 50), ('Zed', 50), ('Bo', 10)]", label: "<code>leaderboard</code> breaks ties A–Z" },
      { call: "leaderboard([])", expect: "[]" }
    ],
    must: [["def\\s+leaderboard", "Define <code>leaderboard</code>."]],
    hints: [
      "Each function is a World 2 pattern on a list of dictionaries: a total, a dictionary count, and a sort.",
      "<code>leaderboard</code>: first build a dictionary of customer → total spent. Then sort its <code>.items()</code>.",
      "Sort with <code>key=lambda kv: (-kv[1], kv[0])</code>: biggest total first, then name A–Z. <code>sorted()</code> of <code>.items()</code> gives a list of tuples."
    ],
    solution: `def revenue(orders):
    total = 0
    for o in orders:
        total += o["qty"] * o["price"]
    return total


def items_sold(orders):
    sold = {}
    for o in orders:
        sold[o["item"]] = sold.get(o["item"], 0) + o["qty"]
    return sold


def leaderboard(orders):
    spent = {}
    for o in orders:
        spent[o["customer"]] = spent.get(o["customer"], 0) + o["qty"] * o["price"]
    return sorted(spent.items(), key=lambda kv: (-kv[1], kv[0]))`,
    wrong: [{ code: `def revenue(orders):
    return sum(o["qty"] * o["price"] for o in orders)

def items_sold(orders):
    sold = {}
    for o in orders:
        sold[o["item"]] = sold.get(o["item"], 0) + o["qty"]
    return sold

def leaderboard(orders):
    spent = {}
    for o in orders:
        spent[o["customer"]] = spent.get(o["customer"], 0) + o["qty"] * o["price"]
    return sorted(spent.items(), key=lambda kv: kv[1], reverse=True)`, why: "ties not sorted by name" }]
  },
  bug: {
    brief: "This should print the names of everyone over 25, but it crashes. Read the error and look at the shape of the data.",
    code: `data = {"team": [{"name": "Asha", "age": 31}, {"name": "Ravi", "age": 24}, {"name": "Om", "age": 28}]}
for person in data["team"]["name"]:
    if person["age"] > 25:
        print(person)`,
    tests: [{ in: [], out: ["Asha", "Om"], only: true, inOrder: true }],
    hints: ["<code>data[\"team\"]</code> is a list. Loop over the list itself, then use <code>person[\"name\"]</code> and <code>person[\"age\"]</code> inside."],
    fix: `data = {"team": [{"name": "Asha", "age": 31}, {"name": "Ravi", "age": 24}, {"name": "Om", "age": 28}]}
for person in data["team"]:
    if person["age"] > 25:
        print(person["name"])`,
    lesson: "With nested data, say each step's type out loud: dictionary, list, dictionary. The error tells you which step was wrong."
  },
  explain: "How do you read a path like <code>shop[\"items\"][1][\"tags\"][0]</code>? Explain each step and what type you have after it.",
  cards: [
    { q: "What does <code>sorted(xs, key=lambda x: x[\"age\"])</code> sort by?", options: ["The whole dictionary", "Each item's \"age\"", "Alphabetical order", "Nothing"], answer: 1 },
    { q: "<code>data[\"users\"]</code> is a list. How do you get the first user's name?", options: ["data[\"users\"][\"name\"]", "data[\"users\"][0][\"name\"]", "data[0][\"name\"]", "data[\"name\"][0]"], answer: 1 },
    { q: "What does <code>reverse=True</code> do in <code>sorted()</code>?", options: ["Sorts biggest first", "Reverses the text", "Removes items", "Nothing"], answer: 0 }
  ],
  skills: { python: 3, logic: 3, debug: 2, talk: 2, sql: 1 }
},
/* ───────────────────────────── 4-2 ───────────────────────────── */
{
  id: "4-2", world: 4, n: 2, title: "JSON Scrolls", concept: "json.loads, json.dumps, JSON files",
  learn: [
    { h: "JSON: the language of data",
      p: "<b>JSON</b> is a text format for data that almost every website, API and app uses. It looks like Python dictionaries and lists, with a few differences: strings must use <b>double quotes</b>, and it writes <code>true</code>, <code>false</code> and <code>null</code> where Python writes True, False and None.",
      lang: "text", file: "player.json",
      code: `{
  "name": "Asha",
  "level": 4,
  "online": true,
  "guild": null,
  "items": ["map", "rope"]
}` },
    { h: "Text to Python: json.loads",
      p: "<code>json.loads(text)</code> (\"load string\") turns JSON text into Python dictionaries and lists. <code>json.dumps(data)</code> (\"dump string\") goes the other way. <code>indent=2</code> makes it pretty.",
      code: `import json

text = '{"name": "Asha", "level": 4, "online": true, "guild": null}'
player = json.loads(text)
print(player["name"], player["online"], player["guild"])
player["level"] += 1
print(json.dumps(player))
print(json.dumps(player, indent=2))` },
    { h: "Save and load JSON files",
      p: "<code>json.dump(data, f)</code> writes to an open file, and <code>json.load(f)</code> reads one. This is the easiest way to save settings, game saves or any structured data. In fact, this game saves your hero as JSON.",
      code: `import json

hero = {"name": "Asha", "xp": 120, "badges": ["Gatekeeper"]}
with open("save.json", "w") as f:
    json.dump(hero, f, indent=2)

with open("save.json") as f:
    loaded = json.load(f)
print(loaded["badges"], loaded == hero)` },
    { h: "When JSON is broken",
      p: "If the text isn't valid JSON, <code>json.loads</code> raises <code>json.JSONDecodeError</code>, a kind of ValueError. Single quotes and trailing commas are the usual culprits. Real programs catch it and fall back to safe defaults.",
      code: `import json

for text in ['{"ok": true}', "{'ok': true}", '{"ok": true,}']:
    try:
        print(json.loads(text))
    except json.JSONDecodeError as e:
        print("Not valid JSON:", e)` }
  ],
  think: [
    { type: "match", q: "Match each JSON value with what Python turns it into.", pairs: [["<code>true</code>", "True"], ["<code>null</code>", "None"], ["<code>\"5\"</code>", "the string '5'"], ["<code>[1, 2]</code>", "a list"], ["<code>{\"a\": 1}</code>", "a dictionary"]],
      why: "JSON and Python map almost one to one. The words differ (true/True, null/None) and JSON strings always use double quotes." },
    { type: "mcq", q: "Which is valid JSON?", options: ["{'name': 'Asha'}", "{\"name\": \"Asha\",}", "{\"name\": \"Asha\", \"age\": 31}", "{name: \"Asha\"}"], answer: 2,
      why: "JSON needs double quotes around every key and string, and no comma after the last item." },
    { type: "predict", q: "What does this print?", code: `import json
data = json.loads('{"scores": [10, 20, 30], "player": {"name": "Om"}}')
print(data["player"]["name"], sum(data["scores"]))`, answer: "Om 60",
      why: "After loading, it's ordinary Python data: a dictionary holding a list and another dictionary." }
  ],
  code: {
    brief: "Build a settings manager that keeps settings in a JSON file.<br>• <code>load_settings(path)</code>: returns the settings dictionary from the file. If the file is missing <b>or</b> isn't valid JSON, return the defaults: <code>{\"theme\": \"light\", \"volume\": 5, \"language\": \"en\"}</code>.<br>• <code>save_settings(settings, path)</code>: writes the dictionary to the file with <code>json.dump(settings, f, indent=2)</code>.<br>• <code>set_option(path, key, value)</code>: loads the settings, changes one key, saves them, and returns the new dictionary.",
    sample: ">>> set_option(\"settings.json\", \"theme\", \"dark\")\n{'theme': 'dark', 'volume': 5, 'language': 'en'}",
    files: { "settings.json": "{\n  \"theme\": \"light\",\n  \"volume\": 7,\n  \"language\": \"hi\"\n}" },
    starter: `import json

DEFAULTS = {"theme": "light", "volume": 5, "language": "en"}


def load_settings(path):
    pass


def save_settings(settings, path):
    pass


def set_option(path, key, value):
    pass
`,
    tests: [
      { files: { "s.json": "{\"theme\": \"dark\", \"volume\": 9, \"language\": \"ta\"}" }, call: "load_settings('s.json')", expect: "{'theme': 'dark', 'volume': 9, 'language': 'ta'}", label: "Loads a settings file" },
      { files: null, call: "load_settings('s.json')", expect: "{'theme': 'light', 'volume': 5, 'language': 'en'}", label: "Missing file: defaults" },
      { files: { "s.json": "{'theme': 'dark'}" }, call: "load_settings('s.json')", expect: "{'theme': 'light', 'volume': 5, 'language': 'en'}", label: "Broken JSON: defaults" },
      { files: null, setup: "save_settings({'theme': 'dark', 'volume': 3}, 'out.json')", call: "load_settings('out.json')", expect: "{'theme': 'dark', 'volume': 3}", fileOut: { "out.json": "{\n  \"theme\": \"dark\",\n  \"volume\": 3\n}" }, label: "Saves pretty JSON" },
      { files: null, call: "set_option('s.json', 'volume', 8)", expect: "{'theme': 'light', 'volume': 8, 'language': 'en'}", label: "<code>set_option</code> with no file yet" },
      { files: { "s.json": "{\"theme\": \"dark\", \"volume\": 9, \"language\": \"ta\"}" }, setup: "set_option('s.json', 'theme', 'light')", call: "load_settings('s.json')['theme']", expect: "'light'", label: "<code>set_option</code> really saves" }
    ],
    must: [["import\\s+json", "Use the <code>json</code> module."]],
    hints: [
      "<code>load_settings</code>: <code>try:</code> open and <code>return json.load(f)</code>. Catch both problems at once: <code>except (FileNotFoundError, json.JSONDecodeError):</code>.",
      "Return a <b>copy</b> of the defaults, <code>dict(DEFAULTS)</code>, so changing the settings later can't change DEFAULTS itself.",
      "<code>set_option</code> is three lines: load, <code>settings[key] = value</code>, save, then return the dictionary."
    ],
    solution: `import json

DEFAULTS = {"theme": "light", "volume": 5, "language": "en"}


def load_settings(path):
    try:
        with open(path) as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return dict(DEFAULTS)


def save_settings(settings, path):
    with open(path, "w") as f:
        json.dump(settings, f, indent=2)


def set_option(path, key, value):
    settings = load_settings(path)
    settings[key] = value
    save_settings(settings, path)
    return settings`,
    wrong: [{ code: `import json

DEFAULTS = {"theme": "light", "volume": 5, "language": "en"}

def load_settings(path):
    try:
        with open(path) as f:
            return json.load(f)
    except FileNotFoundError:
        return DEFAULTS

def save_settings(settings, path):
    with open(path, "w") as f:
        f.write(str(settings))

def set_option(path, key, value):
    settings = load_settings(path)
    settings[key] = value
    save_settings(settings, path)
    return settings`, why: "writes Python repr, not JSON; broken JSON crashes" }]
  },
  bug: {
    brief: "The save file looks fine to a human, but loading it crashes. Python wrote it with <code>str()</code> instead of the json module. Fix the <b>saving</b> function so the file is real JSON.",
    code: `import json

def save(hero, path):
    with open(path, "w") as f:
        f.write(str(hero))

def load(path):
    with open(path) as f:
        return json.load(f)

save({"name": "Asha", "alive": True}, "hero.json")
print(load("hero.json"))`,
    tests: [{ files: null, call: "load('h.json')", setup: "save({'name': 'Asha', 'alive': True, 'pet': None}, 'h.json')", expect: "{'name': 'Asha', 'alive': True, 'pet': None}" }],
    hints: ["<code>str(hero)</code> writes Python's style: single quotes and True. JSON needs double quotes and true. Which json function writes to a file?"],
    fix: `import json

def save(hero, path):
    with open(path, "w") as f:
        json.dump(hero, f)

def load(path):
    with open(path) as f:
        return json.load(f)

save({"name": "Asha", "alive": True}, "hero.json")
print(load("hero.json"))`,
    lesson: "A Python dictionary printed with str() looks like JSON, but it isn't. Always use json.dump or json.dumps."
  },
  explain: "What is JSON, and why do programs save data as JSON instead of just using <code>str()</code>?",
  cards: [
    { q: "<code>json.loads</code> turns…", options: ["Python into JSON text", "JSON text into Python data", "A file into a list of lines", "JSON into HTML"], answer: 1 },
    { q: "In JSON, Python's <code>None</code> is written as…", options: ["None", "nil", "null", "\"\""], answer: 2 },
    { q: "Why is <code>{'a': 1}</code> not valid JSON?", options: ["It needs double quotes", "It's too short", "Numbers aren't allowed", "It is valid"], answer: 0 }
  ],
  skills: { python: 3, logic: 2, debug: 2, talk: 2, sql: 1 }
},
/* ───────────────────────────── 4-3 ───────────────────────────── */
{
  id: "4-3", world: 4, n: 3, title: "Calling Faraway Lands", concept: "web APIs with requests",
  learn: [
    { h: "An API is a website for programs",
      p: "Websites send pages for people. <b>APIs</b> send data, usually JSON, for programs. You send a <b>request</b> to a URL and get back a <b>response</b> with a <b>status code</b> and a body. The <code>requests</code> library does this in one line. In the game, a practice internet answers a few real API addresses, so the same code works on your own computer.",
      code: `import requests

r = requests.get("https://pokeapi.co/api/v2/pokemon/pikachu", timeout=10)
print(r.status_code)
data = r.json()
print(data["name"], "is number", data["id"])
print("Type:", data["types"][0]["type"]["name"])` },
    { h: "Status codes tell you what happened",
      p: "<b>200</b> means OK. <b>404</b> means not found. <b>400</b> means your request was wrong. <b>500</b> means the server broke. Always check before you trust the body. <code>r.ok</code> is True for codes below 400, and <code>r.raise_for_status()</code> raises an error for bad ones.",
      code: `import requests

for name in ["eevee", "agumon"]:
    r = requests.get(f"https://pokeapi.co/api/v2/pokemon/{name}", timeout=10)
    if r.status_code == 200:
        print(name, "weighs", r.json()["weight"])
    else:
        print(name, "->", r.status_code, "not found")` },
    { h: "Send parameters with params=",
      p: "Many APIs take options in the URL after a <code>?</code>, like <code>?latitude=28.6&amp;longitude=77.2</code>. Don't build that by hand: pass a dictionary to <code>params=</code> and requests builds a correct URL for you.",
      code: `import requests

r = requests.get("https://api.open-meteo.com/v1/forecast",
                 params={"latitude": 28.6, "longitude": 77.2, "current": "temperature_2m"},
                 timeout=10)
print(r.url)
print("Delhi now:", r.json()["current"]["temperature_2m"], "°C")` },
    { h: "Things go wrong on networks",
      p: "Networks fail: no internet, a slow server, a typo in the address. Always pass <code>timeout=</code> so your program can't hang forever, and catch <code>requests.exceptions.RequestException</code>, the parent of all requests errors.",
      code: `import requests

try:
    r = requests.get("https://pokeapi.co.typo/api", timeout=10)
    print(r.status_code)
except requests.exceptions.RequestException as e:
    print("Network problem:", type(e).__name__)` }
  ],
  think: [
    { type: "match", q: "Match each status code with its meaning.", pairs: [["200", "OK, here's your data"], ["404", "Not found"], ["400", "Your request was wrong"], ["500", "The server broke"], ["201", "Created something new"]],
      why: "2xx means success, 4xx means the client (you) made a mistake, and 5xx means the server did." },
    { type: "mcq", q: "Why add <code>timeout=10</code> to every request?", options: ["It makes requests faster", "So the program doesn't wait forever if the server never answers", "The API requires it", "It retries 10 times"], answer: 1,
      why: "Without a timeout, a request to a server that never answers can freeze your program forever. requests has no timeout by default." },
    { type: "predict", q: "The practice API says Snorlax weighs 4600. What does this print?", code: `import requests
r = requests.get("https://pokeapi.co/api/v2/pokemon/snorlax", timeout=10)
data = r.json()
print(data["name"].title(), data["weight"] / 10, "kg")`, answer: "Snorlax 460.0 kg",
      why: "PokeAPI gives weight in tenths of a kilogram, so divide by 10. Reading the API's documentation tells you units like this." }
  ],
  code: {
    brief: "Build a Pokédex card using the PokeAPI at <code>https://pokeapi.co/api/v2/pokemon/NAME</code>.<br>• <code>pokemon_card(name)</code> returns a line like <code>Pikachu #25 | electric | HP 35</code>: the name with a capital first letter, the id, the types joined with <code>/</code> (like <code>grass/poison</code>), and the base stat called <code>hp</code>.<br>• Lowercase the name before asking the API.<br>• If the API says 404, return <code>Not found: agumon</code> (the name as given, lowercased).<br>• If there's a network error, return <code>Network error</code>.",
    sample: ">>> pokemon_card(\"Bulbasaur\")\n'Bulbasaur #1 | grass/poison | HP 45'",
    starter: `import requests

URL = "https://pokeapi.co/api/v2/pokemon/"


def pokemon_card(name):
    pass


print(pokemon_card("pikachu"))
`,
    tests: [
      { call: "pokemon_card('pikachu')", expect: "'Pikachu #25 | electric | HP 35'", silent: true },
      { call: "pokemon_card('Bulbasaur')", expect: "'Bulbasaur #1 | grass/poison | HP 45'" },
      { call: "pokemon_card('SNORLAX')", expect: "'Snorlax #143 | normal | HP 160'" },
      { call: "pokemon_card('gengar')", expect: "'Gengar #94 | ghost/poison | HP 60'" },
      { call: "pokemon_card('Agumon')", expect: "'Not found: agumon'" },
      { call: "pokemon_card('pikachu')", offline: true, expect: "'Network error'", label: "When the network is down" }
    ],
    must: [["requests\\.get\\(", "Use <code>requests.get()</code>."], ["timeout\\s*=", "Pass <code>timeout=</code> so the request can't hang forever."]],
    hints: [
      "Start: <code>r = requests.get(URL + name.lower(), timeout=10)</code>. Check <code>r.status_code == 404</code> before reading <code>r.json()</code>.",
      "Types: loop over <code>data[\"types\"]</code> and collect <code>t[\"type\"][\"name\"]</code>, then <code>\"/\".join(...)</code>. For HP, loop over <code>data[\"stats\"]</code> and find the one whose <code>s[\"stat\"][\"name\"] == \"hp\"</code>.",
      "Wrap the request in <code>try:</code> … <code>except requests.exceptions.RequestException:</code> and return \"Network error\"."
    ],
    solution: `import requests

URL = "https://pokeapi.co/api/v2/pokemon/"


def pokemon_card(name):
    name = name.lower()
    try:
        r = requests.get(URL + name, timeout=10)
    except requests.exceptions.RequestException:
        return "Network error"
    if r.status_code == 404:
        return f"Not found: {name}"
    data = r.json()
    types = "/".join(t["type"]["name"] for t in data["types"])
    hp = 0
    for s in data["stats"]:
        if s["stat"]["name"] == "hp":
            hp = s["base_stat"]
    return f"{data['name'].title()} #{data['id']} | {types} | HP {hp}"


print(pokemon_card("pikachu"))`,
    wrong: [{ code: `import requests

def pokemon_card(name):
    data = requests.get("https://pokeapi.co/api/v2/pokemon/" + name.lower(), timeout=10).json()
    return f"{data['name'].title()} #{data['id']} | {data['types'][0]['type']['name']} | HP {data['stats'][0]['base_stat']}"`, why: "only first type; crashes on 404" }]
  },
  bug: {
    brief: "<b>AI code review.</b> The AI's weather helper works for Delhi, but crashes with a KeyError when called without a city's coordinates. Make it return <code>None</code> when the API answers with an error status, instead of crashing.",
    code: `# AI-written
import requests

def current_temp(lat, lon):
    r = requests.get("https://api.open-meteo.com/v1/forecast",
                     params={"latitude": lat, "longitude": lon, "current": "temperature_2m"},
                     timeout=10)
    return r.json()["current"]["temperature_2m"]

print(current_temp(28.6, 77.2))
print(current_temp(None, None))`,
    tests: [{ call: "current_temp(28.6, 77.2)", expect: "19.2" }, { call: "current_temp(12.97, 77.59)", expect: "26.3" }, { call: "current_temp(None, None)", expect: "None", label: "Missing coordinates: the API says 400" }],
    hints: ["Print <code>r.status_code</code> for the bad call. Only read <code>[\"current\"]</code> when the request was OK: <code>if not r.ok: return None</code>."],
    fix: `import requests

def current_temp(lat, lon):
    r = requests.get("https://api.open-meteo.com/v1/forecast",
                     params={"latitude": lat, "longitude": lon, "current": "temperature_2m"},
                     timeout=10)
    if not r.ok:
        return None
    return r.json()["current"]["temperature_2m"]

print(current_temp(28.6, 77.2))`,
    lesson: "Check the status code before trusting the body. Error responses have a different shape."
  },
  explain: "Walk through what happens when your code calls an API: the request, the status code, the JSON body. What can go wrong at each step?",
  cards: [
    { q: "Status 404 means…", options: ["OK", "Not found", "Server crashed", "Created"], answer: 1 },
    { q: "What does <code>r.json()</code> give you?", options: ["The status code", "The body parsed into Python data", "The URL", "The headers"], answer: 1 },
    { q: "Best way to add <code>?city=Pune</code> to a request?", options: ["Glue strings", "params={\"city\": \"Pune\"}", "headers=", "json="], answer: 1 }
  ],
  skills: { python: 3, logic: 2, debug: 3, talk: 2, web: 2 }
},
/* ───────────────────────────── 4-4 ───────────────────────────── */
{
  id: "4-4", world: 4, n: 4, title: "The Data Vault", concept: "SQL: SELECT, WHERE, ORDER BY",
  learn: [
    { h: "Databases hold tables",
      p: "Companies keep their data in <b>databases</b>. A database holds <b>tables</b>, like spreadsheets: each row is a record and each column is a field. <b>SQL</b> is the language for asking questions of them, and it's one of the most requested skills in job ads. Press Run: this asks for every row of the <code>products</code> table.",
      code: `SELECT * FROM products;` },
    { h: "Pick columns, filter rows",
      p: "List the columns you want after <code>SELECT</code>. <code>WHERE</code> keeps only the rows that match. Text goes in <b>single quotes</b>. Combine conditions with <code>AND</code> and <code>OR</code>. SQL keywords don't care about capitals, but writing them in CAPITALS makes queries easy to read.",
      code: `SELECT name, price
FROM products
WHERE category = 'snacks' AND price < 60;` },
    { h: "Sort and limit",
      p: "<code>ORDER BY</code> sorts the results: <code>ASC</code> is smallest first (the default) and <code>DESC</code> is biggest first. Without ORDER BY, the order is not guaranteed. <code>LIMIT 3</code> keeps only the first 3 rows. The clauses always come in this order: SELECT, FROM, WHERE, ORDER BY, LIMIT.",
      code: `SELECT name, price
FROM products
ORDER BY price DESC
LIMIT 3;` },
    { h: "Patterns and missing values",
      p: "<code>LIKE '%chai%'</code> matches text containing \"chai\" (<code>%</code> means \"anything\"). A missing value is <code>NULL</code>, and it's special: <code>= NULL</code> never matches anything. Use <code>IS NULL</code> or <code>IS NOT NULL</code>.",
      code: `SELECT name, stock FROM products WHERE name LIKE '%a%' AND stock IS NOT NULL;
SELECT name FROM products WHERE stock IS NULL;` }
  ],
  think: [
    { type: "order", q: "Put the clauses of this query in the right order.", lang: "sql", lines: ["SELECT name, price", "FROM products", "WHERE stock > 0", "ORDER BY price DESC", "LIMIT 5"],
      why: "SQL clauses have a fixed order: SELECT, FROM, WHERE, ORDER BY, LIMIT. Putting WHERE after ORDER BY is a syntax error." },
    { type: "mcq", q: "Which query finds products whose stock is unknown?", lang: "sql", options: ["SELECT name FROM products WHERE stock = NULL", "SELECT name FROM products WHERE stock IS NULL", "SELECT name FROM products WHERE stock = 0", "SELECT name FROM products WHERE stock = ''"], answer: 1,
      why: "NULL means \"unknown\", so <code>= NULL</code> is never true, not even for NULL. Use <code>IS NULL</code>. A stock of 0 is a known value, not a missing one." },
    { type: "multi", q: "Which queries return only drinks that cost less than 100?", options: ["SELECT * FROM products WHERE category = 'drinks' AND price < 100", "SELECT * FROM products WHERE category = 'drinks' OR price < 100", "SELECT * FROM products WHERE price < 100 AND category = 'drinks'", "SELECT * FROM products WHERE category = drinks AND price < 100"], answer: [0, 2],
      why: "Both conditions must be true, so AND, in either order. OR would also return cheap snacks. Without quotes, <code>drinks</code> is read as a column name, which doesn't exist." }
  ],
  code: {
    kind: "sql",
    brief: "The desert shop wants a snack menu. Write <b>one query</b> that lists the <code>name</code> and <code>price</code> of products in the <code>snacks</code> category that cost <b>less than 60</b>, cheapest first.<br>The table is <code>products(id, name, category, price, stock)</code>. The checker also runs your query on a second, different shop, so don't pick rows by their ids.",
    sample: "name         | price\n-------------+------\nBhujia       | 35\nBanana Chips | 45\nKhakhra      | 55",
    db: W4_SHOP,
    starter: `-- Snacks under 60, cheapest first
SELECT
`,
    tests: [{ label: "On the desert shop" }, { label: "On a second shop", db: W4_SHOP2 }],
    hints: [
      "Start with <code>SELECT name, price FROM products</code>, press Run, and add one clause at a time.",
      "Two conditions joined by AND: <code>WHERE category = 'snacks' AND price &lt; 60</code>.",
      "Finish with <code>ORDER BY price</code>. Smallest first is the default."
    ],
    solution: `SELECT name, price
FROM products
WHERE category = 'snacks' AND price < 60
ORDER BY price;`,
    alts: ["select name, price from products where price < 60 and category = 'snacks' order by price asc"],
    wrong: ["SELECT name, price FROM products WHERE category = 'snacks' AND price <= 60 ORDER BY price", "SELECT name, price FROM products WHERE category = 'snacks' AND price < 60 ORDER BY price DESC", "SELECT name, price FROM products WHERE id IN (4, 2, 9) ORDER BY price"]
  },
  bug: {
    kind: "sql",
    brief: "The shop manager wants products whose stock was never recorded (it's missing, not 0). This query returns nothing at all, but there is at least one. Fix it.",
    db: W4_SHOP,
    code: `SELECT name FROM products WHERE stock = NULL;`,
    tests: [{ label: "On the desert shop" }, { label: "On a second shop", db: W4_SHOP2 }],
    hints: ["NULL isn't a value you can compare with <code>=</code>. Which two words test for a missing value?"],
    solution: `SELECT name FROM products WHERE stock IS NULL;`,
    fix: `SELECT name FROM products WHERE stock IS NULL;`,
    lesson: "<code>= NULL</code> is never true. Missing values need <code>IS NULL</code>."
  },
  explain: "Explain what each part of your snack query does: SELECT, FROM, WHERE and ORDER BY. Why does the checker run it on a second shop too?",
  cards: [
    { q: "Which clause filters rows?", options: ["SELECT", "WHERE", "ORDER BY", "LIMIT"], answer: 1 },
    { q: "How do you find rows where <code>phone</code> is missing?", options: ["phone = NULL", "phone IS NULL", "phone = ''", "phone == None"], answer: 1 },
    { q: "In SQL, text values go in…", options: ["Double quotes", "Single quotes", "No quotes", "Brackets"], answer: 1 }
  ],
  skills: { sql: 5, logic: 2, debug: 1, talk: 2 }
},
/* ───────────────────────────── 4-5 ───────────────────────────── */
{
  id: "4-5", world: 4, n: 5, title: "Counting Crowds", concept: "COUNT, SUM, AVG, GROUP BY, HAVING",
  learn: [
    { h: "Aggregates squash many rows into one",
      p: "<code>COUNT(*)</code> counts rows. <code>SUM</code>, <code>AVG</code>, <code>MIN</code> and <code>MAX</code> work on a column. <code>AS</code> gives the result column a readable name. <code>ROUND(x, 1)</code> rounds to 1 decimal place.",
      code: `SELECT COUNT(*) AS products,
       MIN(price) AS cheapest,
       MAX(price) AS dearest,
       ROUND(AVG(price), 1) AS average
FROM products;` },
    { h: "GROUP BY: one answer per group",
      p: "<code>GROUP BY category</code> splits the rows into one group per category, then the aggregates run on each group separately. Every column in SELECT must be either in GROUP BY or inside an aggregate.",
      code: `SELECT category, COUNT(*) AS items, SUM(stock) AS total_stock
FROM products
GROUP BY category
ORDER BY category;` },
    { h: "HAVING filters groups",
      p: "<code>WHERE</code> filters <b>rows before</b> grouping. <code>HAVING</code> filters <b>groups after</b> grouping, so it's where conditions on COUNT or SUM go. The full order is: SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT.",
      code: `SELECT category, COUNT(*) AS items
FROM products
WHERE price < 200
GROUP BY category
HAVING COUNT(*) >= 3
ORDER BY items DESC;` },
    { h: "COUNT(*) vs COUNT(column)",
      p: "<code>COUNT(*)</code> counts every row. <code>COUNT(stock)</code> counts only rows where stock isn't NULL. Missing values quietly change your numbers, so know which one you mean.",
      code: `SELECT COUNT(*) AS all_rows, COUNT(stock) AS with_stock FROM products;` }
  ],
  think: [
    { type: "mcq", q: "You want categories with more than 3 products. Where does <code>COUNT(*) &gt; 3</code> go?", options: ["WHERE", "HAVING", "ORDER BY", "SELECT"], answer: 1,
      why: "WHERE runs on single rows, before grouping, so it can't see counts. HAVING runs on whole groups." },
    { type: "mcq", q: "A table has 10 rows, and 3 have <code>email</code> as NULL. What's <code>COUNT(email)</code>?", options: ["10", "7", "3", "NULL"], answer: 1,
      why: "<code>COUNT(column)</code> skips NULLs. <code>COUNT(*)</code> would give 10." },
    { type: "order", q: "Put these clauses in the order SQL needs.", lang: "sql", lines: ["SELECT category, AVG(price)", "FROM products", "WHERE stock > 0", "GROUP BY category", "HAVING AVG(price) > 50", "ORDER BY category"],
      why: "Rows are filtered (WHERE), grouped (GROUP BY), groups are filtered (HAVING), then sorted (ORDER BY)." }
  ],
  code: {
    kind: "sql",
    brief: "Write one query that gives, for each <code>category</code>: the number of products as <code>items</code>, and the average price rounded to 1 decimal place as <code>avg_price</code>. Only include categories with <b>at least 3</b> products. Sort by category A–Z.",
    sample: "category | items | avg_price\n---------+-------+----------\ndrinks   | 4     | 103.8\nsnacks   | 4     | 56.3",
    db: W4_SHOP,
    starter: `-- One row per category with at least 3 products
SELECT
`,
    tests: [{ label: "On the desert shop" }, { label: "On a second shop", db: W4_SHOP2 }],
    hints: [
      "Start with <code>SELECT category, COUNT(*) AS items FROM products GROUP BY category</code> and run it.",
      "Add <code>ROUND(AVG(price), 1) AS avg_price</code> to the SELECT.",
      "Filter the groups with <code>HAVING COUNT(*) &gt;= 3</code>, then <code>ORDER BY category</code>."
    ],
    solution: `SELECT category, COUNT(*) AS items, ROUND(AVG(price), 1) AS avg_price
FROM products
GROUP BY category
HAVING COUNT(*) >= 3
ORDER BY category;`,
    wrong: ["SELECT category, COUNT(*) AS items, ROUND(AVG(price), 1) AS avg_price FROM products GROUP BY category ORDER BY category", "SELECT category, COUNT(*) AS items, AVG(price) AS avg_price FROM products GROUP BY category HAVING COUNT(*) >= 3 ORDER BY category"]
  },
  bug: {
    kind: "sql",
    brief: "This should list categories whose total stock is over 100, but SQLite refuses to run it. Read the error.",
    db: W4_SHOP,
    code: `SELECT category, SUM(stock) AS total_stock
FROM products
WHERE SUM(stock) > 100
GROUP BY category;`,
    tests: [{ label: "On the desert shop" }, { label: "On a second shop", db: W4_SHOP2 }],
    ordered: false,
    hints: ["\"misuse of aggregate\" means SUM is in a place that runs before grouping. Which clause filters groups?"],
    solution: `SELECT category, SUM(stock) AS total_stock
FROM products
GROUP BY category
HAVING SUM(stock) > 100;`,
    fix: `SELECT category, SUM(stock) AS total_stock
FROM products
GROUP BY category
HAVING SUM(stock) > 100;`,
    lesson: "Conditions on COUNT, SUM or AVG go in HAVING, after GROUP BY."
  },
  explain: "Explain the difference between WHERE and HAVING with an example from the shop.",
  cards: [
    { q: "What does <code>GROUP BY category</code> do?", options: ["Sorts by category", "Makes one group per category for the aggregates", "Removes duplicates only", "Filters categories"], answer: 1 },
    { q: "Conditions on <code>COUNT(*)</code> go in…", options: ["WHERE", "HAVING", "FROM", "LIMIT"], answer: 1 },
    { q: "<code>COUNT(column)</code> skips…", options: ["Zeros", "NULLs", "Duplicates", "Nothing"], answer: 1 }
  ],
  skills: { sql: 5, logic: 3, debug: 1, talk: 2 }
},
/* ───────────────────────────── 4-6 ───────────────────────────── */
{
  id: "4-6", world: 4, n: 6, title: "Linked Tables", concept: "JOIN, LEFT JOIN",
  learn: [
    { h: "Why split data into tables?",
      p: "Instead of writing a customer's name and city on every order, databases store customers once and give each one an <b>id</b>. Each order stores just the <code>customer_id</code>. This avoids copies that can disagree. Run both queries to see the two tables.",
      db: W4_ORDERS,
      code: `SELECT * FROM customers;
SELECT * FROM orders;` },
    { h: "JOIN puts them back together",
      p: "<code>JOIN ... ON</code> matches rows from two tables. Here each order is matched to the customer whose <code>id</code> equals the order's <code>customer_id</code>. Short names like <code>c</code> and <code>o</code> (aliases) keep it readable.",
      db: W4_ORDERS,
      code: `SELECT o.id, c.name, o.amount
FROM orders o
JOIN customers c ON c.id = o.customer_id
ORDER BY o.id;` },
    { h: "LEFT JOIN keeps everyone",
      p: "A plain <code>JOIN</code> (inner join) only keeps rows that have a match, so customers with no orders disappear. <code>LEFT JOIN</code> keeps every row from the left table and fills in NULL where there's no match. <code>COALESCE(x, 0)</code> turns a NULL into 0.",
      db: W4_ORDERS,
      code: `SELECT c.name, COUNT(o.id) AS orders, COALESCE(SUM(o.amount), 0) AS spent
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
GROUP BY c.id
ORDER BY c.name;` },
    { h: "Forgetting ON is a classic bug",
      p: "Without an ON condition, every customer is paired with every order: 4 customers × 6 orders = 24 rows of nonsense. If a join returns far too many rows, check the ON.",
      db: W4_ORDERS,
      code: `SELECT COUNT(*) AS rows_without_on FROM customers, orders;` }
  ],
  think: [
    { type: "mcq", q: "Om has no orders. Is he in the result of an inner <code>JOIN</code> between customers and orders?", options: ["Yes, with NULL", "No, inner JOIN only keeps matches", "Yes, with amount 0", "It's an error"], answer: 1,
      why: "An inner JOIN drops rows without a match. LEFT JOIN would keep Om, with NULL for the order columns." },
    { type: "mcq", q: "3 customers and 5 orders, joined with no ON condition. How many rows come back?", options: ["5", "3", "8", "15"], answer: 3,
      why: "Every customer pairs with every order: 3 × 5 = 15. That's called a cross join." },
    { type: "fill", q: "Fill the blanks so the query matches each order to its customer.", lang: "sql", code: `SELECT c.name, o.amount
FROM orders o
JOIN customers c ___ c.id = o.___;`, answers: ["ON", "customer_id"], expect: [], noRun: true,
      why: "<code>ON</code> gives the matching rule: the customer's id equals the order's customer_id." }
  ],
  code: {
    kind: "sql",
    brief: "Write one query showing how much each customer has spent: <code>name</code> and <code>spent</code> (the sum of their order amounts). Include customers with no orders, with <code>spent</code> as 0. Sort by <code>spent</code> biggest first, and by <code>name</code> A–Z when two customers spent the same.<br>Tables: <code>customers(id, name, city)</code> and <code>orders(id, customer_id, amount, day)</code>.",
    sample: "name  | spent\n------+------\nMeera | 480\nRavi  | 420\nAsha  | 400\nOm    | 0",
    db: W4_ORDERS,
    starter: `-- Every customer and how much they spent
SELECT
`,
    tests: [{ label: "On the desert shop" }, { label: "On a second shop", db: W4_ORDERS2 }],
    hints: [
      "Start from customers so everyone is kept: <code>FROM customers c LEFT JOIN orders o ON o.customer_id = c.id</code>.",
      "Group by customer (<code>GROUP BY c.id</code>) and add up <code>SUM(o.amount)</code>. Wrap it in <code>COALESCE(..., 0)</code> for people with no orders.",
      "Sort with two rules: <code>ORDER BY spent DESC, c.name</code>."
    ],
    solution: `SELECT c.name, COALESCE(SUM(o.amount), 0) AS spent
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
GROUP BY c.id
ORDER BY spent DESC, c.name;`,
    wrong: ["SELECT c.name, SUM(o.amount) AS spent FROM customers c JOIN orders o ON o.customer_id = c.id GROUP BY c.id ORDER BY spent DESC, c.name", "SELECT c.name, COALESCE(SUM(o.amount), 0) AS spent FROM customers c LEFT JOIN orders o ON o.customer_id = c.id GROUP BY c.id ORDER BY spent DESC"]
  },
  bug: {
    kind: "sql",
    brief: "This should count each customer's orders. Asha has 3, but it says much more, and so does everyone else. Fix the join.",
    db: W4_ORDERS,
    code: `SELECT c.name, COUNT(*) AS orders
FROM customers c, orders o
GROUP BY c.name
ORDER BY c.name;`,
    tests: [{ label: "On the desert shop" }, { label: "On a second shop", db: W4_ORDERS2 }],
    hints: ["Every customer is being paired with every order. Use <code>JOIN orders o ON o.customer_id = c.id</code>."],
    solution: `SELECT c.name, COUNT(*) AS orders
FROM customers c
JOIN orders o ON o.customer_id = c.id
GROUP BY c.name
ORDER BY c.name;`,
    fix: `SELECT c.name, COUNT(*) AS orders
FROM customers c
JOIN orders o ON o.customer_id = c.id
GROUP BY c.name
ORDER BY c.name;`,
    lesson: "Too many rows after a join almost always means a missing or wrong ON condition."
  },
  explain: "Explain the difference between JOIN and LEFT JOIN using customers and orders. When would you need each?",
  cards: [
    { q: "Which join keeps customers with no orders?", options: ["JOIN", "LEFT JOIN (customers on the left)", "CROSS JOIN", "None"], answer: 1 },
    { q: "What does <code>COALESCE(x, 0)</code> do?", options: ["Adds 0", "Gives 0 when x is NULL", "Counts x", "Rounds x"], answer: 1 },
    { q: "A join returns far too many rows. Likely cause?", options: ["A missing ON condition", "Too few rows", "ORDER BY", "Using AS"], answer: 0 }
  ],
  skills: { sql: 5, logic: 3, debug: 2, talk: 2 }
},
/* ───────────────────────────── 4-7 ───────────────────────────── */
{
  id: "4-7", world: 4, n: 7, title: "Python Meets SQL", concept: "sqlite3, placeholders, commit",
  learn: [
    { h: "sqlite3: a database in one file",
      p: "Python's <code>sqlite3</code> module talks to SQLite, a whole database in a single file. <code>connect()</code> opens it (and creates it if needed), <code>execute()</code> runs SQL, and <code>fetchall()</code> gives the rows as a list of tuples. Open the practice files to see <code>library.db</code>.",
      code: `import sqlite3

conn = sqlite3.connect("library.db")
rows = conn.execute("SELECT title, year FROM books ORDER BY year").fetchall()
for title, year in rows:
    print(year, title)
conn.close()` },
    { h: "Pass values with ? placeholders",
      p: "Never glue user input into SQL with f-strings. Put a <code>?</code> where each value goes and pass the values as a tuple. A single value still needs a tuple: <code>(author,)</code> with a comma.",
      code: `import sqlite3

author = "R. K. Narayan"
conn = sqlite3.connect("library.db")
rows = conn.execute("SELECT title FROM books WHERE author = ? ORDER BY year", (author,)).fetchall()
print([r[0] for r in rows])
conn.close()` },
    { h: "Changes need commit()",
      p: "INSERT, UPDATE and DELETE change data inside a <b>transaction</b>. Nothing is saved until you call <code>conn.commit()</code>. If the program ends first, the changes are thrown away. <code>cursor.lastrowid</code> gives the id of the row you just inserted.",
      code: `import sqlite3

conn = sqlite3.connect("library.db")
cur = conn.execute("INSERT INTO books (title, author, year) VALUES (?, ?, ?)", ("The White Tiger", "Aravind Adiga", 2008))
print("New id:", cur.lastrowid)
conn.commit()
print(conn.execute("SELECT COUNT(*) FROM books").fetchone()[0], "books")
conn.close()` },
    { h: "Why placeholders matter: SQL injection",
      p: "If you build SQL with an f-string, a user can type SQL as their \"name\" and change what your query does. This is <b>SQL injection</b>, one of the most common real-world attacks. Watch it return every book, even though no author has that name.",
      code: `import sqlite3

conn = sqlite3.connect("library.db")
evil = "nobody' OR '1'='1"
unsafe = conn.execute(f"SELECT title FROM books WHERE author = '{evil}'").fetchall()
safe = conn.execute("SELECT title FROM books WHERE author = ?", (evil,)).fetchall()
print("f-string:", len(unsafe), "books leaked")
print("placeholder:", len(safe), "books")
conn.close()` }
  ],
  think: [
    { type: "mcq", q: "Which line is safe?", options: ["conn.execute(f\"SELECT * FROM users WHERE name = '{name}'\")", "conn.execute(\"SELECT * FROM users WHERE name = ?\", (name,))", "conn.execute(\"SELECT * FROM users WHERE name = \" + name)", "conn.execute(\"SELECT * FROM users WHERE name = '%s'\" % name)"], answer: 1,
      why: "Only the placeholder version keeps the value as data. Every other version pastes the text into the SQL, so a crafted name can change the query." },
    { type: "spot", q: "This runs without errors, but the new book is gone the next time the program starts. Which line is missing something after it?", code: `import sqlite3
conn = sqlite3.connect("library.db")
conn.execute("INSERT INTO books (title, author, year) VALUES (?, ?, ?)", ("Godaan", "Premchand", 1936))
conn.close()`, answer: 3,
      why: "After the INSERT there's no <code>conn.commit()</code>, so closing the connection throws the change away." },
    { type: "mcq", q: "What's wrong with <code>conn.execute(\"SELECT * FROM books WHERE year = ?\", (1958))</code>?", options: ["Nothing", "(1958) is just a number in brackets: a one-item tuple needs a comma, (1958,)", "? only works with text", "SELECT needs commit"], answer: 1,
      why: "Brackets alone don't make a tuple. <code>(1958,)</code> with a trailing comma does." }
  ],
  code: {
    brief: "Write a library helper for <code>library.db</code> (table <code>books(id, title, author, year)</code>). Every function opens the database, does its job, and closes it.<br>• <code>add_book(title, author, year)</code>: inserts a book, saves it, and returns the new book's id.<br>• <code>books_by(author)</code>: returns a list of that author's titles, oldest first. Use a <code>?</code> placeholder.<br>• <code>count_books()</code>: returns how many books there are.",
    sample: ">>> books_by(\"R. K. Narayan\")\n['Swami and Friends', 'Malgudi Days', 'The Guide']\n>>> add_book(\"The White Tiger\", \"Aravind Adiga\", 2008)\n7",
    db: { "library.db": W4_LIBRARY },
    starter: `import sqlite3

DB = "library.db"


def add_book(title, author, year):
    pass


def books_by(author):
    pass


def count_books():
    pass
`,
    tests: [
      { call: "books_by('R. K. Narayan')", expect: "['Swami and Friends', 'Malgudi Days', 'The Guide']", silent: true },
      { call: "books_by('Nobody')", expect: "[]" },
      { call: "count_books()", expect: "6" },
      { call: "add_book('The White Tiger', 'Aravind Adiga', 2008)", expect: "7", dbCheck: { file: "library.db", sql: "SELECT title, author, year FROM books WHERE id = 7", rows: [["The White Tiger", "Aravind Adiga", 2008]], msg: "The new book isn't saved in the database. Did you <code>commit()</code>?" }, label: "<code>add_book</code> saves the book" },
      { setup: "add_book('Godaan', 'Premchand', 1936)", call: "count_books()", expect: "7", label: "<code>count_books</code> sees new books" },
      { call: "books_by(\"x' OR '1'='1\")", expect: "[]", label: "Safe against SQL injection" }
    ],
    must: [["\\?", "Use <code>?</code> placeholders for values."]],
    mustNot: [["execute\\(\\s*f[\"']", "Don't build SQL with f-strings. Use <code>?</code> placeholders."]],
    mustNotAll: true,
    hints: [
      "Pattern for each function: <code>conn = sqlite3.connect(DB)</code>, do the work, <code>conn.close()</code>, return.",
      "<code>add_book</code>: <code>cur = conn.execute(\"INSERT INTO books (title, author, year) VALUES (?, ?, ?)\", (title, author, year))</code>, then <code>conn.commit()</code>, and return <code>cur.lastrowid</code>.",
      "<code>books_by</code>: <code>rows = conn.execute(\"SELECT title FROM books WHERE author = ? ORDER BY year\", (author,)).fetchall()</code>. Each row is a tuple, so return <code>[r[0] for r in rows]</code>."
    ],
    solution: `import sqlite3

DB = "library.db"


def add_book(title, author, year):
    conn = sqlite3.connect(DB)
    cur = conn.execute("INSERT INTO books (title, author, year) VALUES (?, ?, ?)", (title, author, year))
    conn.commit()
    conn.close()
    return cur.lastrowid


def books_by(author):
    conn = sqlite3.connect(DB)
    rows = conn.execute("SELECT title FROM books WHERE author = ? ORDER BY year", (author,)).fetchall()
    conn.close()
    return [r[0] for r in rows]


def count_books():
    conn = sqlite3.connect(DB)
    n = conn.execute("SELECT COUNT(*) FROM books").fetchone()[0]
    conn.close()
    return n`,
    wrong: [{ code: `import sqlite3

DB = "library.db"

def add_book(title, author, year):
    conn = sqlite3.connect(DB)
    cur = conn.execute("INSERT INTO books (title, author, year) VALUES (?, ?, ?)", (title, author, year))
    conn.close()
    return cur.lastrowid

def books_by(author):
    conn = sqlite3.connect(DB)
    rows = conn.execute("SELECT title FROM books WHERE author = ? ORDER BY year", (author,)).fetchall()
    return [r[0] for r in rows]

def count_books():
    conn = sqlite3.connect(DB)
    return conn.execute("SELECT COUNT(*) FROM books").fetchone()[0]`, why: "never commits" }]
  },
  bug: {
    brief: "<b>Security review.</b> This login check works for normal users, but an attacker can log in as Asha <b>without her password</b> by typing <code>asha' --</code> as the username. (<code>--</code> starts a comment in SQL, so the password check disappears.) Fix it with placeholders.",
    db: { "users.db": "CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, password TEXT); INSERT INTO users (name, password) VALUES ('asha', 'chai123'), ('ravi', 'monsoon9');" },
    code: `import sqlite3

def login(username, password):
    conn = sqlite3.connect("users.db")
    row = conn.execute(f"SELECT id FROM users WHERE name = '{username}' AND password = '{password}'").fetchone()
    conn.close()
    return row is not None

print(login("asha", "chai123"))
print(login("asha' --", "anything"))`,
    tests: [
      { call: "login('asha', 'chai123')", expect: "True" },
      { call: "login('asha', 'wrong')", expect: "False" },
      { call: "login(\"asha' --\", 'anything')", expect: "False", label: "The injection attack fails" },
      { call: "login(\"x' OR '1'='1\", \"x' OR '1'='1\")", expect: "False", label: "Another injection attack fails" }
    ],
    hints: ["Replace each <code>'{...}'</code> with <code>?</code>, and pass <code>(username, password)</code> as the second argument to <code>execute</code>."],
    fix: `import sqlite3

def login(username, password):
    conn = sqlite3.connect("users.db")
    row = conn.execute("SELECT id FROM users WHERE name = ? AND password = ?", (username, password)).fetchone()
    conn.close()
    return row is not None

print(login("asha", "chai123"))`,
    lesson: "Placeholders stop SQL injection. (Real apps also never store plain passwords: they store a hash. You'll meet that in World 5.)"
  },
  explain: "Explain SQL injection to a friend who doesn't code. How do <code>?</code> placeholders stop it?",
  cards: [
    { q: "What saves INSERT/UPDATE changes in sqlite3?", options: ["conn.close()", "conn.commit()", "conn.save()", "Nothing, it's automatic"], answer: 1 },
    { q: "Safe way to pass a value into SQL?", options: ["An f-string", "A ? placeholder with a tuple", "String +", "% formatting"], answer: 1 },
    { q: "What does <code>fetchall()</code> return?", options: ["A dictionary", "A list of tuples, one per row", "A string", "The number of rows"], answer: 1 }
  ],
  skills: { python: 2, sql: 5, debug: 2, talk: 2, web: 1 }
},
/* ───────────────────────────── 4-8 BOSS ───────────────────────────── */
{
  id: "4-8", world: 4, n: 8, boss: true, title: "The Habit Tracker", concept: "Boss: a database-backed app",
  learn: [
    { h: "Boss rules",
      p: "Build a habit tracker that remembers everything in a SQLite database. Two tables: <code>habits</code> and <code>checkins</code>. The functions do the database work, and <code>main()</code> is a small command loop like your expense tracker. Build and test one function at a time.",
      lang: "text",
      code: `habits(id INTEGER PRIMARY KEY, name TEXT UNIQUE NOT NULL)
checkins(habit_id INTEGER, day TEXT, UNIQUE(habit_id, day))

connect()              -> open habits.db, create tables if missing
add_habit(name)        -> ValueError if it already exists
check_in(name, day)    -> ValueError if there's no such habit
streak(name, today)    -> days in a row, ending today
main()                 -> commands: add, done, streak, list, quit` },
    { h: "CREATE TABLE IF NOT EXISTS",
      p: "Apps create their tables the first time they run. <code>IF NOT EXISTS</code> makes it safe to run every time. <code>UNIQUE</code> makes the database refuse duplicates by raising <code>sqlite3.IntegrityError</code>, and <code>INSERT OR IGNORE</code> quietly skips a duplicate instead.",
      code: `import sqlite3

conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE IF NOT EXISTS habits (id INTEGER PRIMARY KEY, name TEXT UNIQUE NOT NULL)")
conn.execute("INSERT INTO habits (name) VALUES (?)", ("read",))
try:
    conn.execute("INSERT INTO habits (name) VALUES (?)", ("read",))
except sqlite3.IntegrityError as e:
    print("Refused:", e)
conn.execute("INSERT OR IGNORE INTO habits (name) VALUES (?)", ("read",))
print(conn.execute("SELECT COUNT(*) FROM habits").fetchone()[0], "habit")` },
    { h: "Dates: count back day by day",
      p: "The <code>datetime</code> module understands calendars. Turn <code>\"2026-10-23\"</code> into a <code>date</code>, then subtract <code>timedelta(days=1)</code> to step back one day, even across months. <code>str(d)</code> turns it back into text like the database stores.",
      code: `import datetime

def to_date(text):
    y, m, d = text.split("-")
    return datetime.date(int(y), int(m), int(d))

day = to_date("2026-11-02")
for _ in range(3):
    print(str(day))
    day = day - datetime.timedelta(days=1)` }
  ],
  think: [
    { type: "mcq", q: "A habit was done on Oct 21, 22 and 23. Today is Oct 23. What's the streak?", options: ["1", "2", "3", "0"], answer: 2,
      why: "Count back from today while each day has a check-in: 23 yes, 22 yes, 21 yes, 20 no. That's 3." },
    { type: "mcq", q: "Today is Oct 23 and the last check-in was Oct 22. With our rule (the streak must end today), what's the streak?", options: ["0", "1", "2", "It depends on Oct 21"], answer: 0,
      why: "Our rule counts back from today, and today has no check-in, so the streak is 0. Real apps often allow until the end of the day; deciding rules like this is part of building software." },
    { type: "fill", q: "Fill the blanks so this counts the streak.", code: `import datetime

def streak(days, today):
    count = 0
    day = today
    while str(day) ___ days:
        count += 1
        day = day - datetime.___(days=1)
    return count

print(streak({"2026-10-21", "2026-10-22", "2026-10-23"}, datetime.date(2026, 10, 23)))`, answers: ["in", "timedelta"], expect: ["3"],
      why: "Keep counting while the day is in the set of check-ins, stepping back one day each lap." }
  ],
  code: {
    brief: "Build the habit tracker in <code>habits.db</code>. Write:<br>• <code>connect()</code>: returns a connection to <code>habits.db</code>, creating both tables if they don't exist (see Learn for the columns).<br>• <code>add_habit(name)</code>: adds a habit. If it already exists, raise <code>ValueError(\"Habit already exists\")</code>.<br>• <code>check_in(name, day)</code>: records that the habit was done on <code>day</code> (text like <code>\"2026-10-23\"</code>). Doing it twice on the same day counts once. If there's no such habit, raise <code>ValueError</code>.<br>• <code>streak(name, today)</code>: the number of days in a row with a check-in, counting back from <code>today</code> (a text date). 0 if today has none.<br>• <code>main()</code>: first ask <code>Today? </code>, then read commands with <code>&gt; </code>:<br>&nbsp;&nbsp;<code>add read</code> → <code>Added: read</code> or <code>Already tracking: read</code><br>&nbsp;&nbsp;<code>done read</code> → <code>Done: read</code> or <code>No habit called: read</code><br>&nbsp;&nbsp;<code>streak read</code> → <code>read: 3 day streak</code><br>&nbsp;&nbsp;<code>quit</code> → <code>Keep going!</code><br>Print nothing else.",
    sample: "Today? 2026-10-23\n> add read\nAdded: read\n> done read\nDone: read\n> streak read\nread: 1 day streak\n> quit\nKeep going!",
    starter: `import sqlite3
import datetime

DB = "habits.db"


def connect():
    pass


def add_habit(name):
    pass


def check_in(name, day):
    pass


def streak(name, today):
    pass


def main():
    pass


if __name__ == "__main__":
    main()
`,
    tests: [
      { setup: "add_habit('read')", call: "connect().execute('SELECT name FROM habits').fetchall()", expect: "[('read',)]", label: "<code>add_habit</code> saves a habit" },
      { setup: "add_habit('read')", call: "add_habit('read')", raises: "ValueError", label: "Adding a habit twice raises ValueError" },
      { call: "check_in('swim', '2026-10-23')", raises: "ValueError", label: "Checking in an unknown habit raises ValueError" },
      { setup: "add_habit('read')\nfor d in ['2026-10-21', '2026-10-22', '2026-10-23', '2026-10-23']:\n    check_in('read', d)", call: "streak('read', '2026-10-23')", expect: "3", label: "Three days in a row" },
      { setup: "add_habit('walk')\nfor d in ['2026-10-30', '2026-10-31', '2026-11-01', '2026-10-28']:\n    check_in('walk', d)", call: "streak('walk', '2026-11-01')", expect: "3", label: "A streak across two months" },
      { setup: "add_habit('read')\ncheck_in('read', '2026-10-22')", call: "streak('read', '2026-10-23')", expect: "0", label: "No check-in today" },
      { setup: "add_habit('read')\ncheck_in('read', '2026-10-23')\ncheck_in('read', '2026-10-23')", call: "connect().execute('SELECT COUNT(*) FROM checkins').fetchone()[0]", expect: "1", label: "Same day twice counts once" },
      { in: ["2026-10-23", "add read", "add read", "done read", "done swim", "streak read", "quit"], out: ["Added: read", "Already tracking: read", "Done: read", "No habit called: swim", "read: 1 day streak", "Keep going!"], only: true, inOrder: true, label: "Plays a full session" }
    ],
    must: [["import\\s+sqlite3", "Store the data with <code>sqlite3</code>."], ["CREATE TABLE IF NOT EXISTS", "Create the tables with <code>CREATE TABLE IF NOT EXISTS</code>."], ["def\\s+main\\s*\\(", "Put the command loop in <code>main()</code>."]],
    mustNot: [["execute\\(\\s*f[\"']", "Use <code>?</code> placeholders, not f-strings, in SQL."]],
    mustNotAll: true,
    hints: [
      "<code>connect()</code>: connect, run both CREATE TABLE IF NOT EXISTS statements, and return the connection. Every other function starts with <code>conn = connect()</code>.",
      "<code>add_habit</code>: try the INSERT and <code>commit()</code>; <code>except sqlite3.IntegrityError: raise ValueError(\"Habit already exists\")</code>. <code>check_in</code>: look up the habit's id first, raise ValueError if it's None, then <code>INSERT OR IGNORE</code> into checkins and commit.",
      "<code>streak</code>: fetch all the habit's days into a set, then count back from <code>today</code> with <code>timedelta(days=1)</code> while <code>str(day) in days</code>. In main, split each command with <code>cmd, name = line.split(\" \", 1)</code>."
    ],
    solution: `import sqlite3
import datetime

DB = "habits.db"


def connect():
    conn = sqlite3.connect(DB)
    conn.execute("CREATE TABLE IF NOT EXISTS habits (id INTEGER PRIMARY KEY, name TEXT UNIQUE NOT NULL)")
    conn.execute("CREATE TABLE IF NOT EXISTS checkins (habit_id INTEGER, day TEXT, UNIQUE(habit_id, day))")
    return conn


def to_date(text):
    y, m, d = text.split("-")
    return datetime.date(int(y), int(m), int(d))


def habit_id(conn, name):
    row = conn.execute("SELECT id FROM habits WHERE name = ?", (name,)).fetchone()
    return row[0] if row else None


def add_habit(name):
    conn = connect()
    try:
        conn.execute("INSERT INTO habits (name) VALUES (?)", (name,))
        conn.commit()
    except sqlite3.IntegrityError:
        raise ValueError("Habit already exists")
    finally:
        conn.close()


def check_in(name, day):
    conn = connect()
    hid = habit_id(conn, name)
    if hid is None:
        conn.close()
        raise ValueError(f"No habit called {name}")
    conn.execute("INSERT OR IGNORE INTO checkins (habit_id, day) VALUES (?, ?)", (hid, day))
    conn.commit()
    conn.close()


def streak(name, today):
    conn = connect()
    hid = habit_id(conn, name)
    rows = conn.execute("SELECT day FROM checkins WHERE habit_id = ?", (hid,)).fetchall()
    conn.close()
    days = {r[0] for r in rows}
    count = 0
    day = to_date(today)
    while str(day) in days:
        count += 1
        day = day - datetime.timedelta(days=1)
    return count


def main():
    today = input("Today? ")
    while True:
        line = input("> ").strip()
        if line == "quit":
            print("Keep going!")
            break
        cmd, name = line.split(" ", 1)
        if cmd == "add":
            try:
                add_habit(name)
                print(f"Added: {name}")
            except ValueError:
                print(f"Already tracking: {name}")
        elif cmd == "done":
            try:
                check_in(name, today)
                print(f"Done: {name}")
            except ValueError:
                print(f"No habit called: {name}")
        elif cmd == "streak":
            print(f"{name}: {streak(name, today)} day streak")


if __name__ == "__main__":
    main()`,
    after: "You built a real database app. Take it home and add a <code>list</code> command that shows every habit with its streak."
  },
  bug: {
    brief: "<b>AI code review.</b> The AI's <code>add_habit</code> passes a quick test, but the habits vanish: a second connection can't see them. Find what's missing.",
    code: `# AI-written
import sqlite3

def add_habit(name):
    conn = sqlite3.connect("habits.db")
    conn.execute("CREATE TABLE IF NOT EXISTS habits (id INTEGER PRIMARY KEY, name TEXT UNIQUE NOT NULL)")
    conn.execute("INSERT INTO habits (name) VALUES (?)", (name,))
    print("Added", name)
    conn.close()

def all_habits():
    conn = sqlite3.connect("habits.db")
    rows = conn.execute("SELECT name FROM habits ORDER BY id").fetchall()
    conn.close()
    return [r[0] for r in rows]

if __name__ == "__main__":
    add_habit("read")
    print(all_habits())`,
    tests: [{ setup: "add_habit('read')\nadd_habit('walk')", call: "all_habits()", expect: "['read', 'walk']" }],
    hints: ["The INSERT runs inside a transaction. What has to happen before <code>close()</code> for it to be saved?"],
    fix: `import sqlite3

def add_habit(name):
    conn = sqlite3.connect("habits.db")
    conn.execute("CREATE TABLE IF NOT EXISTS habits (id INTEGER PRIMARY KEY, name TEXT UNIQUE NOT NULL)")
    conn.execute("INSERT INTO habits (name) VALUES (?)", (name,))
    conn.commit()
    print("Added", name)
    conn.close()

def all_habits():
    conn = sqlite3.connect("habits.db")
    rows = conn.execute("SELECT name FROM habits ORDER BY id").fetchall()
    conn.close()
    return [r[0] for r in rows]

if __name__ == "__main__":
    add_habit("read")
    print(all_habits())`,
    lesson: "Data you change isn't saved until <code>commit()</code>. AI-written database code forgets this surprisingly often."
  },
  explain: "Interview practice: how does your habit tracker store data? Describe the two tables, why the name is UNIQUE, and how you calculate a streak.",
  cards: [
    { q: "What does <code>CREATE TABLE IF NOT EXISTS</code> avoid?", options: ["Slow queries", "An error when the table is already there", "Duplicate rows", "SQL injection"], answer: 1 },
    { q: "Inserting a duplicate into a UNIQUE column raises…", options: ["ValueError", "sqlite3.IntegrityError", "KeyError", "Nothing"], answer: 1 },
    { q: "How do you step back one day from a date d?", options: ["d - 1", "d - datetime.timedelta(days=1)", "d.back()", "d[-1]"], answer: 1 }
  ],
  skills: { python: 3, sql: 4, logic: 3, debug: 2, talk: 3, test: 1 },
  homeQuest: {
    title: "Take it home",
    intro: "Data skills are what most junior jobs actually use day to day. Prove yours on your own machine.",
    tasks: [
      { t: "Run the habit tracker locally", d: "Save it as <code>habits.py</code>, run it for a few days, and open <code>habits.db</code> with the free \"DB Browser for SQLite\" app to see your tables.", skill: "sql" },
      { t: "Finish SQLBolt lessons 1–12", d: "sqlbolt.com. Short, interactive, and covers everything in this world.", skill: "sql" },
      { t: "Call a real API", d: "Run your Pokédex card against the real PokeAPI. Then try another free API, such as Open-Meteo for your city's weather.", skill: "web" },
      { t: "Export data as JSON", d: "Add a command to the habit tracker that saves all habits and streaks to <code>export.json</code>.", skill: "python" },
      { t: "Push it to GitHub", d: "Add a README with the table design and example commands. Add <code>habits.db</code> to <code>.gitignore</code>: never commit real user data.", skill: "git" },
      { t: "Explain JOIN out loud", d: "Explain INNER vs LEFT JOIN to someone with two hand-drawn tables. You'll be asked this in interviews.", skill: "talk" }
    ]
  }
}
);
