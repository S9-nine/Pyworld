/* World 6 — Capstone Castle: planning, data design, classes, inheritance, clean code, dates, edge cases.
   Boss: Flagship v1, a study planner with classes and JSON saving. */

RESOURCES[6] = [
  { name: "Harvard CS50P, Week 8: Object-Oriented Programming", what: "Classes, __init__, __str__, properties and inheritance.", url: "https://cs50.harvard.edu/python/weeks/8/" },
  { name: "Beyond the Basic Stuff with Python (free)", what: "Ch. 4 (names), 5 (code smells), 10 (effective functions), 15–17 (OOP). Perfect for this week.", url: "https://inventwithpython.com/beyond/" },
  { name: "Refactoring Guru: Code smells", what: "A catalogue of the warning signs in messy code, with fixes.", url: "https://refactoring.guru/refactoring/smells" },
  { name: "Atlassian: MVP and user stories", what: "How real teams decide what to build first.", url: "https://www.atlassian.com/agile/product-management/minimum-viable-product" },
  { name: "Python docs: datetime", what: "Dates, times and timedelta. Bookmark it.", url: "https://docs.python.org/3/library/datetime.html" }
];

const W6_ELECTRIC_MESSY = `def b(u):
    if u <= 100:
        t = u * 3
    elif u <= 200:
        t = 100 * 3 + (u - 100) * 5
    elif u <= 400:
        t = 100 * 3 + 100 * 5 + (u - 200) * 7
    else:
        t = 100 * 3 + 100 * 5 + 200 * 7 + (u - 400) * 9
    t = t + 50
    return t`;

LEVELS.push(
/* ───────────────────────────── 6-1 ───────────────────────────── */
{
  id: "6-1", world: 6, n: 1, title: "Choose Your Quest", concept: "planning: user stories and an MVP",
  learn: [
    { h: "Build something that solves a real annoyance",
      p: "Your flagship project matters more than any certificate. The best ones solve a problem you or people you know really have: tracking chai stall orders, splitting rent with flatmates, a timetable for your sister's exams. Real problems make better stories in interviews too.",
      lang: "text", file: "project ideas that work",
      code: `Good:  "My hostel mess posts the menu on WhatsApp every day. I built an app
        that shows this week's menu and lets students rate meals."
Weak:  "A to-do list app." (fine for practice, but nobody's problem)

Ask: Who has this problem? How do they solve it today? What's annoying about that?` },
    { h: "User stories say who wants what, and why",
      p: "Teams describe features as <b>user stories</b>: <i>As a [who], I want [what], so that [why]</i>. The \"why\" stops you building things nobody needs. Each story should be small enough to build in a day or two.",
      lang: "text", file: "user stories",
      code: `As a student, I want to see today's mess menu, so that I can decide whether to eat out.
As a student, I want to rate a meal from 1 to 5, so that the mess knows what to fix.
As the mess manager, I want a weekly average per dish, so that I can change the menu.` },
    { h: "MVP: the smallest version that's useful",
      p: "An <b>MVP</b> (minimum viable product) is the smallest version that solves the core problem. Must-haves go in first. Nice-to-haves wait until the MVP works and real people have tried it. Most beginner projects fail by trying to build everything at once.",
      code: `features = [
    {"name": "show menu", "hours": 4, "must": True},
    {"name": "rate a meal", "hours": 6, "must": True},
    {"name": "dark mode", "hours": 3, "must": False},
    {"name": "login with Google", "hours": 10, "must": False},
]
must = [f["name"] for f in features if f["must"]]
hours = sum(f["hours"] for f in features if f["must"])
print("MVP:", must, "=", hours, "hours")` },
    { h: "Plan the work as small tasks",
      p: "Split each story into tasks of a few hours, and estimate each one. Beginners usually underestimate by about half, so double your first guesses. Then build one thin slice end to end (data, logic, output) before adding width.",
      lang: "text", file: "one story, split into tasks",
      code: `Story: As a student, I want to rate a meal from 1 to 5.
  [ ] Decide how ratings are stored (table: ratings(meal, day, stars))   1 h
  [ ] Function add_rating(meal, day, stars) with validation + tests      2 h
  [ ] Route POST /api/ratings                                             1 h
  [ ] A simple form on the page                                           2 h` }
  ],
  think: [
    { type: "mcq", q: "Which is the best user story?", options: ["Add a database.", "As a flatmate, I want to see who owes whom, so that we can settle rent without arguments.", "Make the app good.", "As a user, I want features."], answer: 1,
      why: "It names who, what and why, and it's small enough to build. \"Add a database\" is a task, not a story: it says nothing about what the user gets." },
    { type: "multi", q: "You're building an app for a chai stall to take pre-orders. Which belong in the MVP?", options: ["Customers can see the menu", "Customers can place an order", "The owner sees today's orders", "Loyalty points", "A dark mode", "Online payments"], answer: [0, 1, 2],
      why: "The core loop is: see menu, order, owner sees it. Payments can be cash at pickup for now. Loyalty points and dark mode can wait until people actually use it." },
    { type: "order", q: "Put these project steps in a sensible order.", lines: ["Talk to two people who have the problem", "Write the user stories", "Pick the must-haves for the MVP", "Build one thin slice end to end", "Show it to real users and collect feedback"],
      why: "Understand the problem, describe it, cut it down, build the smallest useful thing, then learn from real users." }
  ],
  code: {
    brief: "Write <code>mvp(features, budget)</code> to choose what to build first. Each feature is a dictionary like <code>{\"name\": \"show menu\", \"hours\": 4, \"must\": True}</code>. Return a list of names:<br>• First, every must-have, in the order given. If the must-haves together need more hours than the budget, raise <code>ValueError</code>.<br>• Then add nice-to-haves, <b>cheapest first</b> (if two cost the same, keep their original order), as long as each one still fits in the hours left. If one doesn't fit, skip it and try the next.",
    sample: ">>> mvp([{\"name\": \"menu\", \"hours\": 4, \"must\": True}, {\"name\": \"login\", \"hours\": 10, \"must\": False}, {\"name\": \"dark mode\", \"hours\": 3, \"must\": False}], 9)\n['menu', 'dark mode']",
    starter: `def mvp(features, budget):
    pass
`,
    tests: [
      { call: "mvp([{'name': 'menu', 'hours': 4, 'must': True}, {'name': 'login', 'hours': 10, 'must': False}, {'name': 'dark mode', 'hours': 3, 'must': False}], 9)", expect: "['menu', 'dark mode']", silent: true },
      { call: "mvp([{'name': 'a', 'hours': 2, 'must': False}, {'name': 'b', 'hours': 5, 'must': True}, {'name': 'c', 'hours': 1, 'must': True}], 8)", expect: "['b', 'c', 'a']", label: "Must-haves stay in their given order" },
      { call: "mvp([{'name': 'big', 'hours': 6, 'must': False}, {'name': 'small', 'hours': 2, 'must': False}, {'name': 'tiny', 'hours': 1, 'must': False}], 7)", expect: "['tiny', 'small']", label: "Cheapest first, skipping what doesn't fit" },
      { call: "mvp([{'name': 'x', 'hours': 3, 'must': False}, {'name': 'y', 'hours': 3, 'must': False}], 3)", expect: "['x']", label: "Ties keep their original order" },
      { call: "mvp([{'name': 'x', 'hours': 5, 'must': False}, {'name': 'y', 'hours': 1, 'must': False}, {'name': 'z', 'hours': 2, 'must': False}], 4)", expect: "['y', 'z']", label: "Keeps going after a skip" },
      { call: "mvp([{'name': 'core', 'hours': 20, 'must': True}], 10)", raises: "ValueError", label: "Must-haves over budget raise ValueError" },
      { call: "mvp([], 5)", expect: "[]" }
    ],
    fuzz: { n: 10, what: "random feature lists", gen: (r) => ({ setup: "def _cq_try(f, *a):\n    try:\n        return f(*a)\n    except ValueError:\n        return 'ValueError'", call: "_cq_try(mvp, " + JSON.stringify(Array.from({ length: r.int(1, 7) }, (_, i) => ({ name: "f" + i, hours: r.int(1, 6), must: r.next() < 0.3 }))).replace(/true/g, "True").replace(/false/g, "False") + ", " + r.int(4, 16) + ")" }) },
    hints: [
      "Two passes. First loop: collect the must-have names and add up their hours. If that's over the budget, raise ValueError.",
      "Then make a list of the nice-to-haves and sort it with <code>sorted(..., key=lambda f: f[\"hours\"])</code>. Python's sort keeps ties in their original order.",
      "Loop over the sorted nice-to-haves: if <code>used + f[\"hours\"] &lt;= budget</code>, add it and update <code>used</code>. (Once one doesn't fit, the bigger ones after it won't either.)"
    ],
    solution: `def mvp(features, budget):
    chosen = []
    used = 0
    for f in features:
        if f["must"]:
            chosen.append(f["name"])
            used += f["hours"]
    if used > budget:
        raise ValueError(f"Must-haves need {used} hours")
    extras = sorted([f for f in features if not f["must"]], key=lambda f: f["hours"])
    for f in extras:
        if used + f["hours"] <= budget:
            chosen.append(f["name"])
            used += f["hours"]
    return chosen`,
    wrong: [{ code: `def mvp(features, budget):
    chosen = []
    used = 0
    for f in sorted(features, key=lambda f: (not f["must"], f["hours"])):
        if used + f["hours"] <= budget:
            chosen.append(f["name"])
            used += f["hours"]
        else:
            break
    return chosen`, why: "musts sorted; stops at first skip; no ValueError" }]
  },
  bug: {
    brief: "<b>AI code review.</b> This planner picks features cheapest first while they fit. But with exactly 3 hours left, a 3-hour feature is skipped, even though it fits perfectly. Find the off-by-one.",
    code: `# AI-written
def fill_budget(features, hours_left):
    picked = []
    for f in sorted(features, key=lambda f: f["hours"]):
        if f["hours"] >= hours_left:
            break
        picked.append(f["name"])
        hours_left -= f["hours"]
    return picked

print(fill_budget([{"name": "x", "hours": 5}, {"name": "y", "hours": 1}, {"name": "z", "hours": 2}], 4))`,
    tests: [
      { call: "fill_budget([{'name': 'a', 'hours': 3}], 3)", expect: "['a']", label: "An exact fit" },
      { call: "fill_budget([{'name': 'a', 'hours': 2}, {'name': 'b', 'hours': 2}, {'name': 'c', 'hours': 1}], 3)", expect: "['c', 'a']" },
      { call: "fill_budget([{'name': 'a', 'hours': 3}, {'name': 'b', 'hours': 3}, {'name': 'c', 'hours': 1}], 4)", expect: "['c', 'a']" },
      { call: "fill_budget([{'name': 'a', 'hours': 9}], 4)", expect: "[]" }
    ],
    hints: ["A feature fits if its hours are <b>at most</b> the hours left. Which comparison means \"more than\"?"],
    fix: `def fill_budget(features, hours_left):
    picked = []
    for f in sorted(features, key=lambda f: f["hours"]):
        if f["hours"] > hours_left:
            break
        picked.append(f["name"])
        hours_left -= f["hours"]
    return picked

print(fill_budget([{"name": "x", "hours": 5}, {"name": "y", "hours": 1}, {"name": "z", "hours": 2}], 4))`,
    lesson: "Boundaries again: \"fits\" includes an exact fit. Always test the exact limit."
  },
  explain: "Describe the project you'd like to build as your flagship. Who has the problem, and what are the 2–3 must-have features for its MVP?",
  cards: [
    { q: "A user story has three parts:", options: ["Who, what, why", "Name, date, time", "Input, output, error", "Front, back, database"], answer: 0 },
    { q: "MVP stands for…", options: ["Most Valuable Player", "Minimum Viable Product", "Maximum Visible Page", "Main View Panel"], answer: 1 },
    { q: "Beginners' time estimates are usually…", options: ["Too high", "About right", "Too low", "Random"], answer: 2 }
  ],
  skills: { logic: 4, python: 2, talk: 3 }
},
/* ───────────────────────────── 6-2 ───────────────────────────── */
{
  id: "6-2", world: 6, n: 2, title: "Shapes of Data", concept: "choosing structures: sets, tuples, dicts of lists",
  learn: [
    { h: "Pick the structure that fits the question",
      p: "Before writing code, ask what you'll do with the data most. Keep things in order? A <b>list</b>. Look things up by name? A <b>dict</b>. Check \"is it there?\" or remove duplicates? A <b>set</b>. A fixed small record that shouldn't change? A <b>tuple</b>.",
      lang: "text", file: "which structure?",
      code: `list   ["chai", "samosa", "chai"]      ordered, duplicates allowed
dict   {"chai": 20, "samosa": 15}       look up by key
set    {"chai", "samosa"}               no duplicates, fast "in"
tuple  ("Asha", "Pune", 82)            a fixed record, can't be changed` },
    { h: "Sets: no duplicates, fast membership",
      p: "A set keeps each value once. <code>set(list)</code> removes duplicates, and <code>x in a_set</code> is very fast even for millions of items. Sets also do Venn-diagram maths: <code>&amp;</code> (in both), <code>|</code> (in either), <code>-</code> (in the first but not the second). An empty set is written <code>set()</code>, because <code>{}</code> is an empty dict.",
      code: `monday = {"Asha", "Ravi", "Meera"}
tuesday = {"Ravi", "Om", "Asha"}
print(sorted(monday & tuesday), "came both days")
print(sorted(monday | tuesday), "came at least once")
print(sorted(monday - tuesday), "came Monday only")
print(len(set(["chai", "chai", "lassi"])), "different drinks")` },
    { h: "A dict of lists groups things",
      p: "When each key has many values, store a list under each key. This is how you group data: orders by customer, students by class, check-ins by day.",
      code: `visits = [("Mon", "Asha"), ("Mon", "Ravi"), ("Tue", "Asha")]
by_day = {}
for day, name in visits:
    by_day.setdefault(day, []).append(name)
print(by_day)` },
    { h: "Tuples as small records",
      p: "A tuple groups a few related values. You can unpack it in a loop, return several values from a function, and use tuples as dictionary keys (lists can't be keys). Because tuples can't change, they're safe to pass around.",
      code: `seats = {("A", 1): "Asha", ("A", 2): "Ravi"}
for (row, num), name in seats.items():
    print(f"Row {row} seat {num}: {name}")
print(seats.get(("B", 1), "empty"))` }
  ],
  think: [
    { type: "match", q: "Match each job with the best structure.", pairs: [["Remove duplicate emails from a sign-up list", "set"], ["Look up a product's price by its name", "dict"], ["Keep messages in the order they arrived", "list"], ["A GPS point (latitude, longitude) that shouldn't change", "tuple"], ["Students grouped by class", "dict of lists"]],
      why: "Choosing the right shape first makes the code that follows short and fast." },
    { type: "predict", q: "What does this print?", code: `a = {1, 2, 3, 4}
b = {3, 4, 5}
print(sorted(a & b), sorted(a - b), len(a | b))`, answer: "[3, 4] [1, 2] 5",
      why: "&amp; keeps what's in both, - keeps what's only in a, and | has every value once: 1, 2, 3, 4, 5." },
    { type: "mcq", q: "What type is <code>x = {}</code>?", options: ["An empty set", "An empty dict", "An empty list", "An error"], answer: 1,
      why: "Curly braces with nothing inside make a dict. An empty set must be written <code>set()</code>." }
  ],
  code: {
    brief: "Analyse a coding club's attendance. <code>days</code> is a dictionary of day → list of names who came, like <code>{\"Mon\": [\"Asha\", \"Ravi\"], \"Tue\": [\"Asha\"]}</code>. Return answers:<br>• <code>always_present(days)</code>: names that came every day, sorted A–Z.<br>• <code>missed_some(roster, days)</code>: names from the roster list who missed at least one day, sorted A–Z.<br>• <code>rate(name, days)</code>: the percentage of days the person came, rounded to a whole number with <code>round()</code>.<br>With no days at all, <code>always_present</code> returns <code>[]</code> and <code>rate</code> returns 0.",
    sample: ">>> always_present({\"Mon\": [\"Asha\", \"Ravi\"], \"Tue\": [\"Asha\"]})\n['Asha']\n>>> rate(\"Ravi\", {\"Mon\": [\"Asha\", \"Ravi\"], \"Tue\": [\"Asha\"]})\n50",
    starter: `def always_present(days):
    pass


def missed_some(roster, days):
    pass


def rate(name, days):
    pass
`,
    tests: [
      { setup: "d = {'Mon': ['Asha', 'Ravi', 'Om'], 'Tue': ['Asha', 'Om', 'Om'], 'Wed': ['Om', 'Asha', 'Meera']}", call: "always_present(d)", expect: "['Asha', 'Om']", silent: true, label: "<code>always_present</code> over 3 days" },
      { call: "always_present({})", expect: "[]" },
      { setup: "d = {'Mon': ['Asha', 'Ravi', 'Om'], 'Tue': ['Asha', 'Om', 'Om'], 'Wed': ['Om', 'Asha', 'Meera']}", call: "missed_some(['Ravi', 'Asha', 'Zoya', 'Om', 'Meera'], d)", expect: "['Meera', 'Ravi', 'Zoya']", label: "<code>missed_some</code>, including someone who never came" },
      { setup: "d = {'Mon': ['Asha', 'Ravi', 'Om'], 'Tue': ['Asha', 'Om', 'Om'], 'Wed': ['Om', 'Asha', 'Meera']}", call: "[rate('Om', d), rate('Ravi', d), rate('Zoya', d)]", expect: "[100, 33, 0]", label: "<code>rate</code>, even with a duplicate name in a day" },
      { call: "rate('Asha', {})", expect: "0" }
    ],
    must: [["set\\(|&|\\.intersection\\(", "Use sets to compare who came on different days."]],
    hints: [
      "<code>always_present</code>: start with <code>set(</code> the first day's list <code>)</code>, then <code>&amp;=</code> each other day's set. Return <code>sorted(...)</code>.",
      "<code>missed_some</code>: everyone in the roster minus the always-present set.",
      "<code>rate</code>: count the days where <code>name in names</code>, divide by <code>len(days)</code>, times 100, then <code>round()</code>. Check for no days first."
    ],
    solution: `def always_present(days):
    if not days:
        return []
    common = None
    for names in days.values():
        if common is None:
            common = set(names)
        else:
            common = common & set(names)
    return sorted(common)


def missed_some(roster, days):
    return sorted(set(roster) - set(always_present(days)))


def rate(name, days):
    if not days:
        return 0
    came = 0
    for names in days.values():
        if name in names:
            came += 1
    return round(came / len(days) * 100)`,
    wrong: [{ code: `def always_present(days):
    result = []
    for names in days.values():
        for n in names:
            if n not in result:
                result.append(n)
    return sorted(result)

def missed_some(roster, days):
    return []

def rate(name, days):
    came = sum(names.count(name) for names in days.values())
    return round(came / len(days) * 100)`, why: "union instead of intersection, duplicates counted" }]
  },
  bug: {
    brief: "The website says it had 5 unique visitors today, but only 3 different people visited. Fix <code>unique_visitors</code>.",
    code: `def unique_visitors(log):
    visitors = []
    for name in log:
        visitors.append(name)
    return len(visitors)

print(unique_visitors(["asha", "ravi", "asha", "om", "ravi"]))`,
    tests: [{ call: "unique_visitors(['asha', 'ravi', 'asha', 'om', 'ravi'])", expect: "3" }, { call: "unique_visitors(['x', 'x', 'x'])", expect: "1" }, { call: "unique_visitors([])", expect: "0" }],
    hints: ["Which structure keeps each value only once?"],
    fix: `def unique_visitors(log):
    return len(set(log))

print(unique_visitors(["asha", "ravi", "asha", "om", "ravi"]))`,
    lesson: "\"Unique\" or \"different\" in a task is a strong hint to use a set."
  },
  explain: "Pick a project idea and describe its data: which parts would you store as lists, dicts, sets or tuples, and why?",
  cards: [
    { q: "Fastest way to remove duplicates from a list?", options: ["sort it", "set(lst)", "lst.remove()", "a loop with print"], answer: 1 },
    { q: "<code>{\"a\", \"b\"} &amp; {\"b\", \"c\"}</code> is…", options: ["{'a', 'b', 'c'}", "{'b'}", "{'a', 'c'}", "{}"], answer: 1 },
    { q: "Which can be a dictionary key?", options: ["[1, 2]", "(1, 2)", "{1, 2}", "{1: 2}"], answer: 1 }
  ],
  skills: { python: 3, logic: 3, talk: 2 }
},
/* ───────────────────────────── 6-3 ───────────────────────────── */
{
  id: "6-3", world: 6, n: 3, title: "Blueprints", concept: "classes, __init__, self, methods",
  learn: [
    { h: "A class is a blueprint",
      p: "So far, data (dicts) and functions have lived apart. A <b>class</b> bundles them: it's a blueprint, and each <b>object</b> made from it has its own data (<b>attributes</b>) and things it can do (<b>methods</b>). <code>__init__</code> runs when an object is created and sets up its attributes. <code>self</code> means \"this particular object\".",
      code: `class Hero:
    def __init__(self, name, gold):
        self.name = name
        self.gold = gold

    def earn(self, amount):
        self.gold += amount

asha = Hero("Asha", 50)
ravi = Hero("Ravi", 10)
asha.earn(25)
print(asha.name, asha.gold)
print(ravi.name, ravi.gold)` },
    { h: "Methods always take self first",
      p: "Every method's first parameter is <code>self</code>. You don't pass it yourself: <code>asha.earn(25)</code> becomes <code>Hero.earn(asha, 25)</code> behind the scenes. Forgetting <code>self</code> in the def line is the most common class bug.",
      code: `class Counter:
    def __init__(self):
        self.count = 0

    def add(self, n=1):
        self.count += n
        return self.count

c = Counter()
c.add()
c.add(5)
print(c.count)` },
    { h: "__str__ makes objects print nicely",
      p: "Printing an object shows something like <code>&lt;__main__.Hero object at 0x...&gt;</code> unless you define <code>__str__</code>, which returns the text to show. Methods with double underscores are special: Python calls them for you.",
      code: `class Hero:
    def __init__(self, name, gold):
        self.name = name
        self.gold = gold

    def __str__(self):
        return f"{self.name} ({self.gold} gold)"

heroes = [Hero("Asha", 75), Hero("Ravi", 10)]
for h in heroes:
    print(h)
print(f"Leader: {max(heroes, key=lambda h: h.gold)}")` },
    { h: "Objects protect their own rules",
      p: "Methods can refuse bad changes by raising errors, so the object can never end up in a broken state. Code that uses the object doesn't need to know the rules; it just calls the methods. This is called <b>encapsulation</b>.",
      code: `class Wallet:
    def __init__(self):
        self.balance = 0

    def spend(self, amount):
        if amount > self.balance:
            raise ValueError("Not enough money")
        self.balance -= amount

w = Wallet()
try:
    w.spend(10)
except ValueError as e:
    print("Refused:", e)` }
  ],
  think: [
    { type: "predict", q: "What does this print?", code: `class Box:
    def __init__(self, items):
        self.items = items

    def add(self, x):
        self.items.append(x)
        return len(self.items)

a = Box([1])
b = Box([7, 8])
a.add(2)
print(a.add(3), len(b.items))`, answer: "3 2",
      why: "Each object has its own list. a gets 2 and 3 added (3 items), while b still has 2." },
    { type: "spot", q: "Calling <code>t.reset()</code> crashes with \"reset() takes 0 positional arguments but 1 was given\". Which line is wrong?", code: `class Timer:
    def __init__(self):
        self.seconds = 0

    def reset():
        self.seconds = 0

t = Timer()
t.reset()`, answer: 5,
      why: "Every method needs <code>self</code> as its first parameter: <code>def reset(self):</code>. Python passes the object automatically, so a method without self gets one argument too many." },
    { type: "match", q: "Match each word with its meaning.", pairs: [["class", "the blueprint"], ["object", "one thing made from the blueprint"], ["attribute", "data stored on an object, like self.name"], ["method", "a function that belongs to the class"], ["<code>__init__</code>", "runs when an object is created"]],
      why: "Interviews use these words all the time, so know them exactly." }
  ],
  code: {
    brief: "Write a class <code>BankAccount</code>:<br>• <code>BankAccount(owner, balance=0)</code> stores <code>owner</code>, <code>balance</code> and an empty <code>history</code> list.<br>• <code>deposit(amount)</code>: adds money. If amount is 0 or less, raise <code>ValueError</code>. Adds <code>\"deposit 500\"</code> to the history.<br>• <code>withdraw(amount)</code>: takes money out. If amount is 0 or less, or more than the balance, raise <code>ValueError</code>. Adds <code>\"withdraw 200\"</code> to the history.<br>• Printing an account shows <code>Asha: Rs 300</code>.<br>Failed operations change nothing.",
    sample: ">>> acc = BankAccount(\"Asha\")\n>>> acc.deposit(500)\n>>> acc.withdraw(200)\n>>> print(acc)\nAsha: Rs 300\n>>> acc.history\n['deposit 500', 'withdraw 200']",
    starter: `class BankAccount:
    def __init__(self, owner, balance=0):
        pass
`,
    tests: [
      { setup: "a = BankAccount('Asha')\na.deposit(500)\na.withdraw(200)", call: "(a.balance, a.history, str(a))", expect: "(300, ['deposit 500', 'withdraw 200'], 'Asha: Rs 300')", label: "Deposit, withdraw and print" },
      { setup: "a = BankAccount('Ravi', 100)", call: "(a.owner, a.balance, a.history)", expect: "('Ravi', 100, [])", label: "A starting balance" },
      { setup: "a = BankAccount('Om', 50)", call: "a.withdraw(80)", raises: "ValueError", label: "Can't withdraw more than the balance" },
      { setup: "a = BankAccount('Om', 50)\ntry:\n    a.withdraw(80)\nexcept ValueError:\n    pass", call: "(a.balance, a.history)", expect: "(50, [])", label: "A failed withdrawal changes nothing" },
      { setup: "a = BankAccount('Om')", call: "a.deposit(0)", raises: "ValueError", label: "Deposits must be positive" },
      { setup: "a = BankAccount('Om', 10)", call: "a.withdraw(-5)", raises: "ValueError", label: "Withdrawals must be positive" },
      { setup: "a = BankAccount('A')\nb = BankAccount('B')\na.deposit(10)", call: "(a.balance, b.balance, b.history)", expect: "(10, 0, [])", label: "Each account has its own data" }
    ],
    must: [["class\\s+BankAccount", "Define <code>class BankAccount</code>."], ["def\\s+__str__", "Add a <code>__str__</code> method so the account prints nicely."]],
    hints: [
      "In <code>__init__</code>: <code>self.owner = owner</code>, <code>self.balance = balance</code>, <code>self.history = []</code>.",
      "Each method: check first and raise if the amount is bad, and only then change <code>self.balance</code> and append to <code>self.history</code>.",
      "<code>def __str__(self): return f\"{self.owner}: Rs {self.balance}\"</code>"
    ],
    solution: `class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance
        self.history = []

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Deposit must be positive")
        self.balance += amount
        self.history.append(f"deposit {amount}")

    def withdraw(self, amount):
        if amount <= 0 or amount > self.balance:
            raise ValueError("Invalid withdrawal")
        self.balance -= amount
        self.history.append(f"withdraw {amount}")

    def __str__(self):
        return f"{self.owner}: Rs {self.balance}"`,
    wrong: [{ code: `class BankAccount:
    history = []

    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount
        self.history.append(f"deposit {amount}")

    def withdraw(self, amount):
        self.history.append(f"withdraw {amount}")
        if amount > self.balance:
            raise ValueError("no")
        self.balance -= amount

    def __str__(self):
        return f"{self.owner}: Rs {self.balance}"`, why: "shared class-level history, no validation, history before check" }]
  },
  bug: {
    brief: "<code>s.add_score(5)</code> crashes with a TypeError about the number of arguments. Read it, then fix the method.",
    code: `class Scoreboard:
    def __init__(self):
        self.total = 0

    def add_score(points):
        self.total += points

s = Scoreboard()
s.add_score(5)
print(s.total)`,
    tests: [{ setup: "s = Scoreboard()\ns.add_score(5)\ns.add_score(7)", call: "s.total", expect: "12" }],
    hints: ["What must every method's first parameter be?"],
    fix: `class Scoreboard:
    def __init__(self):
        self.total = 0

    def add_score(self, points):
        self.total += points

s = Scoreboard()
s.add_score(5)
print(s.total)`,
    lesson: "\"takes 1 positional argument but 2 were given\" on a method almost always means a missing <code>self</code>."
  },
  explain: "Explain what <code>self</code> is, and why <code>acc.deposit(500)</code> works even though <code>deposit</code> is defined with two parameters.",
  cards: [
    { q: "When does <code>__init__</code> run?", options: ["When the class is defined", "When an object is created", "When it's printed", "Never automatically"], answer: 1 },
    { q: "What does <code>self</code> refer to?", options: ["The class", "The current object", "The module", "The parent class"], answer: 1 },
    { q: "Which method decides what <code>print(obj)</code> shows?", options: ["__init__", "__str__", "__print__", "show"], answer: 1 }
  ],
  skills: { python: 5, logic: 2, debug: 2, talk: 2 }
},
/* ───────────────────────────── 6-4 ───────────────────────────── */
{
  id: "6-4", world: 6, n: 4, title: "Families of Objects", concept: "inheritance and composition",
  learn: [
    { h: "Inheritance: an \"is a\" relationship",
      p: "A class can <b>inherit</b> from another: <code>class Perishable(Item)</code> means \"a Perishable is an Item, with extras\". It gets all of Item's methods for free and can add new ones or replace (<b>override</b>) existing ones.",
      code: `class Item:
    def __init__(self, name, price):
        self.name = name
        self.price = price

    def label(self):
        return f"{self.name}: Rs {self.price}"

class Perishable(Item):
    def __init__(self, name, price, days_left):
        super().__init__(name, price)
        self.days_left = days_left

    def label(self):
        return super().label() + f" (use within {self.days_left} days)"

print(Item("Rice", 60).label())
print(Perishable("Milk", 30, 2).label())` },
    { h: "super() reuses the parent's code",
      p: "<code>super().__init__(name, price)</code> runs the parent's <code>__init__</code> so you don't copy its code. <code>super().label()</code> calls the parent's version of a method, so the child can build on it instead of rewriting it.",
      code: `class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return "..."

class Cow(Animal):
    def speak(self):
        return "Moo"

for a in [Animal("Generic"), Cow("Lakshmi")]:
    print(a.name, "says", a.speak(), "| is an Animal:", isinstance(a, Animal))` },
    { h: "Composition: a \"has a\" relationship",
      p: "Often it's simpler for an object to <b>contain</b> other objects. A Cart <i>has</i> items; it isn't an item. Prefer composition unless the \"is a\" sentence is clearly true. Deep inheritance trees are hard to change.",
      code: `class Cart:
    def __init__(self):
        self.items = []

    def add(self, item):
        self.items.append(item)

    def total(self):
        return sum(i.price for i in self.items)

class Item:
    def __init__(self, name, price):
        self.name = name
        self.price = price

cart = Cart()
cart.add(Item("Chai", 20))
cart.add(Item("Samosa", 15))
print(len(cart.items), "items, Rs", cart.total())` }
  ],
  think: [
    { type: "multi", q: "Which are good uses of inheritance (\"is a\" is clearly true)?", options: ["SavingsAccount inherits from BankAccount", "Car inherits from Engine", "Admin inherits from User", "Cart inherits from Item"], answer: [0, 2],
      why: "A savings account is a bank account, and an admin is a user. A car <i>has</i> an engine and a cart <i>has</i> items: those are composition." },
    { type: "predict", q: "What does this print?", code: `class Shape:
    def area(self):
        return 0

    def describe(self):
        return f"{type(self).__name__} with area {self.area()}"

class Square(Shape):
    def __init__(self, side):
        self.side = side

    def area(self):
        return self.side * self.side

print(Square(3).describe())
print(Shape().describe())`, answer: "Square with area 9\nShape with area 0",
      why: "<code>describe</code> is inherited, but it calls <code>self.area()</code>, which uses the Square's own version. This is called <b>polymorphism</b>." },
    { type: "mcq", q: "A child class defines its own <code>__init__</code> but forgets <code>super().__init__(...)</code>. What happens?", options: ["Nothing, Python calls the parent's anyway", "The parent's setup never runs, so its attributes are missing", "It's a syntax error", "The child can't have methods"], answer: 1,
      why: "If the child defines __init__, the parent's one only runs if you call it. Missing attributes then cause AttributeErrors later." }
  ],
  code: {
    brief: "Build a small shop model.<br>• <code>Item(name, price)</code> with a method <code>final_price()</code> that returns the price.<br>• <code>DiscountedItem(name, price, percent)</code> inherits from Item. Its <code>final_price()</code> returns the price minus <code>percent</code>%, rounded to 2 decimal places. Use <code>super().__init__</code>.<br>• <code>Cart()</code> holds items (composition): <code>add(item)</code>, <code>total()</code> (sum of final prices, rounded to 2 places), and <code>priciest()</code> (the name of the item with the highest final price, or <code>None</code> for an empty cart).",
    sample: ">>> cart = Cart()\n>>> cart.add(Item(\"Rice\", 60))\n>>> cart.add(DiscountedItem(\"Ghee\", 500, 10))\n>>> cart.total()\n510.0\n>>> cart.priciest()\n'Ghee'",
    starter: `class Item:
    pass


class DiscountedItem(Item):
    pass


class Cart:
    pass
`,
    tests: [
      { call: "Item('Rice', 60).final_price()", expect: "60" },
      { call: "DiscountedItem('Ghee', 500, 10).final_price()", expect: "450.0" },
      { call: "DiscountedItem('Tea', 99, 15).final_price()", expect: "84.15" },
      { call: "(DiscountedItem('Ghee', 500, 10).name, DiscountedItem('Ghee', 500, 10).price, isinstance(DiscountedItem('x', 1, 1), Item))", expect: "('Ghee', 500, True)", label: "DiscountedItem is an Item with name and price" },
      { setup: "c = Cart()\nc.add(Item('Rice', 60))\nc.add(DiscountedItem('Ghee', 500, 10))", call: "(c.total(), c.priciest())", expect: "(510.0, 'Ghee')", label: "A cart with two items" },
      { setup: "c = Cart()\nc.add(Item('Big', 100))\nc.add(DiscountedItem('Bigger', 150, 50))", call: "c.priciest()", expect: "'Big'", label: "<code>priciest</code> uses the final price" },
      { call: "(Cart().total(), Cart().priciest())", expect: "(0, None)", label: "An empty cart" }
    ],
    must: [["class\\s+DiscountedItem\\s*\\(\\s*Item\\s*\\)", "DiscountedItem must inherit from Item: <code>class DiscountedItem(Item):</code>."], ["super\\(\\)", "Use <code>super().__init__(name, price)</code> in DiscountedItem."]],
    hints: [
      "Item: <code>__init__</code> stores name and price; <code>final_price</code> returns <code>self.price</code>.",
      "DiscountedItem's <code>__init__(self, name, price, percent)</code>: call <code>super().__init__(name, price)</code>, then store percent. Its <code>final_price</code>: <code>round(self.price * (100 - self.percent) / 100, 2)</code>.",
      "Cart keeps <code>self.items = []</code>. <code>priciest</code>: if empty return None, else <code>max(self.items, key=lambda i: i.final_price()).name</code>."
    ],
    solution: `class Item:
    def __init__(self, name, price):
        self.name = name
        self.price = price

    def final_price(self):
        return self.price


class DiscountedItem(Item):
    def __init__(self, name, price, percent):
        super().__init__(name, price)
        self.percent = percent

    def final_price(self):
        return round(self.price * (100 - self.percent) / 100, 2)


class Cart:
    def __init__(self):
        self.items = []

    def add(self, item):
        self.items.append(item)

    def total(self):
        return round(sum(i.final_price() for i in self.items), 2)

    def priciest(self):
        if not self.items:
            return None
        return max(self.items, key=lambda i: i.final_price()).name`
  },
  bug: {
    brief: "Creating a <code>Student</code> works, but <code>s.describe()</code> crashes with an AttributeError: the student has no <code>name</code>. The child forgot something.",
    code: `class Person:
    def __init__(self, name):
        self.name = name

    def describe(self):
        return f"{self.name}"

class Student(Person):
    def __init__(self, name, course):
        self.course = course

    def describe(self):
        return f"{self.name} studies {self.course}"

s = Student("Asha", "Python")
print(s.describe())`,
    tests: [{ call: "Student('Asha', 'Python').describe()", expect: "'Asha studies Python'" }, { call: "Student('Ravi', 'SQL').name", expect: "'Ravi'" }],
    hints: ["The parent's <code>__init__</code> sets <code>self.name</code>, but it never runs. Call it from the child."],
    fix: `class Person:
    def __init__(self, name):
        self.name = name

    def describe(self):
        return f"{self.name}"

class Student(Person):
    def __init__(self, name, course):
        super().__init__(name)
        self.course = course

    def describe(self):
        return f"{self.name} studies {self.course}"

s = Student("Asha", "Python")
print(s.describe())`,
    lesson: "If a child class has its own <code>__init__</code>, call <code>super().__init__(...)</code> so the parent can set up its part."
  },
  explain: "Explain the difference between inheritance (\"is a\") and composition (\"has a\") with an example from your own project idea.",
  cards: [
    { q: "<code>class B(A):</code> means…", options: ["A inherits from B", "B inherits from A", "A and B are the same", "B contains A"], answer: 1 },
    { q: "What does <code>super().__init__(...)</code> do?", options: ["Deletes the parent", "Runs the parent's __init__", "Creates a new class", "Calls the child's __init__"], answer: 1 },
    { q: "A Cart holding Items is an example of…", options: ["Inheritance", "Composition", "Recursion", "Encapsulation only"], answer: 1 }
  ],
  skills: { python: 5, logic: 2, debug: 1, talk: 2 }
},
/* ───────────────────────────── 6-5 ───────────────────────────── */
{
  id: "6-5", world: 6, n: 5, title: "Clean Code", concept: "names, constants, small functions, refactoring",
  learn: [
    { h: "Code is read far more than it's written",
      p: "Teammates, reviewers and future you will read your code many times. Clean code uses <b>clear names</b> (<code>price_with_gst</code>, not <code>p2</code>), <b>named constants</b> instead of magic numbers, <b>small functions</b> that do one thing, and <b>no copy-pasted logic</b>. Interviewers notice all of it.",
      code: `# Hard to read
def f(a):
    return a + a * 0.18

# Easy to read
GST_RATE = 0.18

def price_with_gst(price):
    return price + price * GST_RATE

print(f(100), price_with_gst(100))` },
    { h: "Refactoring: improve without changing behaviour",
      p: "<b>Refactoring</b> means restructuring code while keeping exactly what it does. The safety net is tests: run them before and after. If they pass, the behaviour didn't change.",
      code: `def total_before(items):
    t = 0
    for i in items:
        t = t + i[1] * i[2]
    return t

def total_after(items):
    return sum(qty * price for name, qty, price in items)

cart = [("chai", 2, 20), ("samosa", 3, 15)]
print(total_before(cart) == total_after(cart))` },
    { h: "Turn repetition into data",
      p: "When code repeats the same shape with different numbers, put the numbers in a list and loop over it. Adding a new case then means adding one line of data, not more code.",
      code: `RATES = [("Mumbai", 1.10), ("Pune", 1.00), ("Nagpur", 0.95)]

def delivery_charge(base, city):
    for name, factor in RATES:
        if name == city:
            return round(base * factor)
    raise ValueError(f"We don't deliver to {city}")

print(delivery_charge(100, "Mumbai"), delivery_charge(100, "Nagpur"))` },
    { h: "Docstrings and type hints",
      p: "A <b>docstring</b> (a string as the first line of a function) says what it does. <b>Type hints</b> like <code>units: int</code> and <code>-&gt; int</code> say what goes in and comes out. Python doesn't enforce them, but editors and teammates use them.",
      code: `def bill(units: int) -> int:
    """Return the electricity bill in rupees for the given units."""
    return units * 5

print(bill(10))
print(bill.__doc__)` }
  ],
  think: [
    { type: "mcq", q: "Which name is best for a function that returns how many days are left until an exam?", options: ["d()", "calc()", "days_until_exam()", "doStuff()"], answer: 2,
      why: "A good name says what the function returns or does, so readers don't have to read its body." },
    { type: "multi", q: "Which are signs of messy code (\"code smells\")?", options: ["The same 5 lines copied in three places", "Numbers like 0.18 and 400 with no explanation", "A 120-line function doing five different jobs", "A short function with a docstring", "Variables called x1, x2, tmp"], answer: [0, 1, 2, 4],
      why: "Duplication, magic numbers, giant functions and meaningless names all make code harder to change safely." },
    { type: "mcq", q: "You refactored a function. How do you know you didn't break it?", options: ["It looks nicer", "Run the tests before and after; they still pass", "The code is shorter", "You ask an AI"], answer: 1,
      why: "Refactoring keeps behaviour the same, and tests are how you prove it." }
  ],
  code: {
    brief: "This electricity bill function works but is messy:<pre class=\"sample\">" + W6_ELECTRIC_MESSY.replace(/</g, "&lt;") + "</pre>The rules: the first 100 units cost Rs 3 each, the next 100 (101–200) Rs 5, the next 200 (201–400) Rs 7, and every unit above 400 Rs 9. A fixed charge of Rs 50 is added. Rewrite it cleanly as <code>bill(units)</code>:<br>• put the slabs in a constant <code>SLABS</code>, a list of <code>(units_in_slab, rate)</code> tuples, using <code>None</code> for \"no limit\" on the last one<br>• put the 50 in a constant <code>FIXED_CHARGE</code><br>• loop over <code>SLABS</code> instead of an if/elif chain<br>The checker compares your function with the original on many random readings.",
    sample: ">>> bill(150)\n600\n>>> bill(450)\n2700",
    starter: `SLABS = [(100, 3), (100, 5), (200, 7), (None, 9)]
FIXED_CHARGE = 50


def bill(units):
    """Return the electricity bill in rupees for this many units."""
    pass
`,
    tests: [
      { call: "bill(0)", expect: "50" },
      { call: "bill(100)", expect: "350" },
      { call: "bill(150)", expect: "600" },
      { call: "bill(200)", expect: "850" },
      { call: "bill(400)", expect: "2250" },
      { call: "bill(450)", expect: "2700" }
    ],
    fuzz: { n: 20, what: "random meter readings", gen: (r) => ({ call: "bill(" + r.int(0, 1200) + ")" }) },
    must: [["SLABS\\s*=", "Keep the slab table in a constant called <code>SLABS</code>."], ["for\\s+[^\\n]*\\bin\\s+SLABS", "Loop over <code>SLABS</code>."], ["FIXED_CHARGE\\s*=", "Keep the 50 in a constant called <code>FIXED_CHARGE</code>."]],
    mustNot: [["\\belif\\b", "Replace the if/elif chain with a loop over SLABS."], ["\\b(100|200|400)\\s*\\*", "Don't hard-code slab sizes in the maths. Read them from SLABS."]],
    mustNotAll: true,
    hints: [
      "Keep a variable <code>left = units</code> and a <code>total = 0</code>. Loop <code>for size, rate in SLABS:</code>.",
      "In each slab, the units charged are <code>left</code> if size is None, otherwise <code>min(left, size)</code>. Add them times the rate, and subtract them from <code>left</code>.",
      "Stop when <code>left</code> is 0 (<code>break</code>), and return <code>total + FIXED_CHARGE</code>."
    ],
    solution: `SLABS = [(100, 3), (100, 5), (200, 7), (None, 9)]
FIXED_CHARGE = 50


def bill(units):
    """Return the electricity bill in rupees for this many units."""
    left = units
    total = 0
    for size, rate in SLABS:
        if left <= 0:
            break
        used = left if size is None else min(left, size)
        total += used * rate
        left -= used
    return total + FIXED_CHARGE`
  },
  bug: {
    brief: "The same GST maths was copy-pasted into two functions, and someone updated only one. Now the cart and the single price disagree. Make both use 18% GST, with the rate in one constant so this can't happen again.",
    code: `def price_with_gst(price):
    return round(price * 1.18, 2)

def cart_with_gst(prices):
    return round(sum(prices) * 1.12, 2)

print(price_with_gst(100), cart_with_gst([100]))`,
    tests: [{ call: "price_with_gst(100)", expect: "118.0" }, { call: "cart_with_gst([100, 50])", expect: "177.0" }, { call: "cart_with_gst([10])", expect: "11.8" }],
    must: [["GST_RATE\\s*=", "Put the rate in one constant, <code>GST_RATE = 0.18</code>."]],
    hints: ["Make a constant <code>GST_RATE = 0.18</code> and use it in both. Even better: let <code>cart_with_gst</code> call <code>price_with_gst</code>."],
    fix: `GST_RATE = 0.18

def price_with_gst(price):
    return round(price * (1 + GST_RATE), 2)

def cart_with_gst(prices):
    return price_with_gst(sum(prices))

print(price_with_gst(100), cart_with_gst([100]))`,
    lesson: "Copy-pasted logic drifts apart. Keep each rule in exactly one place."
  },
  explain: "Pick something from your refactor and explain why it's cleaner. How did the hidden tests make the refactor safe?",
  cards: [
    { q: "Refactoring means…", options: ["Adding features", "Changing structure without changing behaviour", "Deleting tests", "Rewriting in another language"], answer: 1 },
    { q: "A \"magic number\" is…", options: ["A random number", "An unexplained number in the code", "A constant", "A prime number"], answer: 1 },
    { q: "Best defence against copy-paste bugs?", options: ["Comments", "Keep each rule in one function or constant", "More copies", "Shorter names"], answer: 1 }
  ],
  skills: { python: 3, logic: 3, debug: 2, talk: 2, test: 1 }
},
/* ───────────────────────────── 6-6 ───────────────────────────── */
{
  id: "6-6", world: 6, n: 6, title: "Calendar Magic", concept: "datetime: dates, timedelta, weekdays",
  learn: [
    { h: "Dates are objects, not strings",
      p: "<code>datetime.date(2026, 10, 23)</code> is a real date that understands calendars: month lengths, leap years, weekdays. Subtracting two dates gives a <b>timedelta</b>, whose <code>.days</code> is the gap. Adding a timedelta moves the date.",
      code: `import datetime

exam = datetime.date(2026, 11, 15)
today = datetime.date(2026, 10, 23)
print((exam - today).days, "days to go")
print(today + datetime.timedelta(days=30))` },
    { h: "Weekdays and formatting",
      p: "<code>.weekday()</code> gives 0 for Monday up to 6 for Sunday. <code>.strftime()</code> formats a date: <code>%d</code> day, <code>%b</code> short month, <code>%Y</code> year, <code>%a</code> short weekday, <code>%A</code> full weekday. <code>str(date)</code> gives the standard <code>2026-10-23</code> form.",
      code: `import datetime

d = datetime.date(2026, 10, 23)
print(d.weekday(), d.strftime("%A"))
print(d.strftime("%a %d %b %Y"))
print(str(d))` },
    { h: "Turning text into a date",
      p: "Dates usually arrive as text like <code>\"2026-10-23\"</code>. Split it and build a date. If the text is impossible (month 13, February 30), <code>datetime.date</code> raises a ValueError, which you can catch.",
      code: `import datetime

def to_date(text):
    y, m, d = text.split("-")
    return datetime.date(int(y), int(m), int(d))

print(to_date("2026-02-28") + datetime.timedelta(days=1))
try:
    to_date("2026-02-30")
except ValueError as e:
    print("Not a real date:", e)` },
    { h: "Compare and sort dates",
      p: "Dates compare like numbers: earlier is smaller. That makes sorting by date, or checking \"is it overdue?\", one line each. Strings in <code>YYYY-MM-DD</code> form also sort correctly, which is why databases and APIs use that format.",
      code: `import datetime

deadlines = {"essay": datetime.date(2026, 11, 2), "quiz": datetime.date(2026, 10, 28)}
today = datetime.date(2026, 10, 30)
for task, due in sorted(deadlines.items(), key=lambda kv: kv[1]):
    print(task, due, "OVERDUE" if due < today else "ok")` }
  ],
  think: [
    { type: "predict", q: "What does this print?", code: `import datetime
d = datetime.date(2026, 12, 30) + datetime.timedelta(days=3)
print(d, d.year)`, answer: "2027-01-02 2027",
      why: "Dates handle month and year boundaries for you, which is a big reason not to do date maths by hand." },
    { type: "mcq", q: "<code>datetime.date(2026, 10, 24).weekday()</code> is 5. What day is that?", options: ["Friday", "Saturday", "Sunday", "Thursday"], answer: 1,
      why: "weekday() counts Monday as 0, so 5 is Saturday and 6 is Sunday." },
    { type: "mcq", q: "Why store dates as <code>\"2026-10-23\"</code> rather than <code>\"23/10/2026\"</code>?", options: ["It's shorter", "Year-month-day text sorts in the right order, and it's the international standard (ISO 8601)", "Python can't read slashes", "It looks nicer"], answer: 1,
      why: "Sorting \"23/10/2026\" as text puts the 1st of every month first. ISO dates sort correctly even as plain text." }
  ],
  code: {
    brief: "Write three date helpers. Dates go in and out as <code>\"YYYY-MM-DD\"</code> text.<br>• <code>add_working_days(start, n)</code>: the date <code>n</code> working days after <code>start</code>, skipping Saturdays and Sundays. <code>n</code> is 0 or more; with 0, return the start unchanged.<br>• <code>days_until(today, deadline)</code>: whole days from today to the deadline (negative if it has passed).<br>• <code>pretty(date)</code>: like <code>Fri 23 Oct 2026</code>.",
    sample: ">>> add_working_days(\"2026-10-23\", 1)\n'2026-10-26'\n>>> days_until(\"2026-10-23\", \"2026-11-15\")\n23\n>>> pretty(\"2026-10-23\")\n'Fri 23 Oct 2026'",
    starter: `import datetime


def to_date(text):
    y, m, d = text.split("-")
    return datetime.date(int(y), int(m), int(d))


def add_working_days(start, n):
    pass


def days_until(today, deadline):
    pass


def pretty(date):
    pass
`,
    tests: [
      { call: "add_working_days('2026-10-23', 1)", expect: "'2026-10-26'", silent: true, label: "Friday + 1 working day is Monday" },
      { call: "add_working_days('2026-10-21', 2)", expect: "'2026-10-23'" },
      { call: "add_working_days('2026-10-24', 1)", expect: "'2026-10-26'", label: "Starting on a Saturday" },
      { call: "add_working_days('2026-12-30', 5)", expect: "'2027-01-06'", label: "Across the new year" },
      { call: "add_working_days('2026-10-23', 0)", expect: "'2026-10-23'" },
      { call: "days_until('2026-10-23', '2026-11-15')", expect: "23" },
      { call: "days_until('2026-03-01', '2026-02-27')", expect: "-2" },
      { call: "pretty('2026-10-23')", expect: "'Fri 23 Oct 2026'" },
      { call: "pretty('2027-01-04')", expect: "'Mon 04 Jan 2027'" }
    ],
    fuzz: { n: 10, what: "random start dates", gen: (r) => ({ call: `add_working_days('2026-${String(r.int(1, 12)).padStart(2, "0")}-${String(r.int(1, 28)).padStart(2, "0")}', ${r.int(0, 15)})` }) },
    must: [["timedelta", "Move dates with <code>datetime.timedelta</code>."], ["weekday\\(\\)", "Use <code>.weekday()</code> to find weekends."]],
    hints: [
      "<code>add_working_days</code>: convert with <code>to_date</code>. While you still have days to add: move forward one day, and only count it if <code>day.weekday() &lt; 5</code>.",
      "<code>days_until</code>: <code>(to_date(deadline) - to_date(today)).days</code>.",
      "<code>pretty</code>: <code>to_date(date).strftime(\"%a %d %b %Y\")</code>. Return dates as text with <code>str(day)</code>."
    ],
    solution: `import datetime


def to_date(text):
    y, m, d = text.split("-")
    return datetime.date(int(y), int(m), int(d))


def add_working_days(start, n):
    day = to_date(start)
    added = 0
    while added < n:
        day = day + datetime.timedelta(days=1)
        if day.weekday() < 5:
            added += 1
    return str(day)


def days_until(today, deadline):
    return (to_date(deadline) - to_date(today)).days


def pretty(date):
    return to_date(date).strftime("%a %d %b %Y")`
  },
  bug: {
    brief: "Deliveries are promised for Saturdays, but the warehouse is closed on weekends. This function only skips Sundays. Fix it to skip both weekend days.",
    code: `import datetime

def next_working_day(day):
    nxt = day + datetime.timedelta(days=1)
    while nxt.weekday() == 6:
        nxt = nxt + datetime.timedelta(days=1)
    return nxt

print(next_working_day(datetime.date(2026, 10, 23)))`,
    tests: [
      { call: "str(next_working_day(datetime.date(2026, 10, 23)))", setup: "import datetime", expect: "'2026-10-26'", label: "After Friday comes Monday" },
      { call: "str(next_working_day(datetime.date(2026, 10, 24)))", setup: "import datetime", expect: "'2026-10-26'", label: "After Saturday comes Monday" },
      { call: "str(next_working_day(datetime.date(2026, 10, 21)))", setup: "import datetime", expect: "'2026-10-22'", label: "A normal weekday" }
    ],
    hints: ["weekday() is 5 for Saturday and 6 for Sunday. Which condition covers both?"],
    fix: `import datetime

def next_working_day(day):
    nxt = day + datetime.timedelta(days=1)
    while nxt.weekday() >= 5:
        nxt = nxt + datetime.timedelta(days=1)
    return nxt

print(next_working_day(datetime.date(2026, 10, 23)))`,
    lesson: "Weekends are two days: <code>weekday() &gt;= 5</code>. Calendar rules are full of edge cases like this."
  },
  explain: "Why is it better to use the datetime module than to do date maths with plain numbers? Give one example where doing it by hand would go wrong.",
  cards: [
    { q: "<code>date.weekday()</code> for Monday is…", options: ["1", "0", "7", "\"Mon\""], answer: 1 },
    { q: "<code>(date2 - date1)</code> gives a…", options: ["number", "timedelta", "string", "date"], answer: 1 },
    { q: "Which format sorts correctly as plain text?", options: ["23/10/2026", "Oct 23 2026", "2026-10-23", "10-23-2026"], answer: 2 }
  ],
  skills: { python: 3, logic: 3, debug: 1, talk: 2 }
},
/* ───────────────────────────── 6-7 ───────────────────────────── */
{
  id: "6-7", world: 6, n: 7, title: "Edge Walkers", concept: "robust input handling and edge cases",
  learn: [
    { h: "Real input is messy",
      p: "Users type <code>\" Rs 1,250 \"</code>, <code>\"rs.99\"</code> or <code>\"abc\"</code> into a box that expects a number. Robust code <b>normalises</b> input first (trim spaces, fix case, remove harmless decoration), then <b>validates</b> it, and raises a clear error for anything it can't handle.",
      code: `for raw in ["  250 ", "Rs 1,250", "RS.99", "abc"]:
    text = raw.strip().lower()
    if text.startswith("rs"):
        text = text[2:].lstrip(". ")
    text = text.replace(",", "")
    print(repr(raw), "->", repr(text), "| a number?", text.replace(".", "", 1).isdigit())` },
    { h: "Think in edge cases",
      p: "For every function, list the edges before coding: empty input, zero, negative, very large, exactly at a limit, odd formats, duplicates. Most real bugs live there. Interviewers ask \"what edge cases did you consider?\" in almost every round.",
      lang: "text", file: "edge-case checklist",
      code: `Empty:        "", [], {}, None
Size:         0, 1, very large
Sign:         negative numbers
Boundaries:   exactly at each limit, one below, one above
Format:       extra spaces, capitals, commas, wrong separators
Repeats:      duplicates, ties
Time:         end of month, leap years, weekends` },
    { h: "Leap years: a classic edge case",
      p: "A year is a leap year if it's divisible by 4, <b>except</b> years divisible by 100, <b>unless</b> they're also divisible by 400. So 2024 and 2000 are leap years, but 1900 and 2100 aren't. Many real systems have had bugs here.",
      code: `def is_leap(year):
    return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)

for y in [2024, 2026, 1900, 2000, 2100]:
    print(y, is_leap(y))` }
  ],
  think: [
    { type: "refute", q: "This function should return the average of a list, or 0 for an empty list. Find an input that breaks it.", fn: "average", args: 1, example: "[2, 4]",
      code: `def average(nums):
    return sum(nums) / len(nums)`,
      ref: `def average(nums):
    if not nums:
        return 0
    return sum(nums) / len(nums)`,
      answer: "[]", safe: ["[2, 4]", "[5]"],
      why: "An empty list divides by zero. Empty input is the first edge case to try, always." },
    { type: "refute", q: "This should say whether a year is a leap year. Find a year it gets wrong.", fn: "is_leap", args: 1, example: "2024",
      code: `def is_leap(year):
    return year % 4 == 0`,
      ref: `def is_leap(year):
    return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)`,
      answer: "1900", safe: ["2024", "2026"],
      why: "Century years like 1900 and 2100 are divisible by 4 but aren't leap years. 2000 is, because it's divisible by 400." },
    { type: "multi", q: "Which inputs should you test for a function that splits a bill between people?", options: ["0 people", "1 person", "A bill of 0", "A bill that doesn't divide evenly, like 100 between 3", "Only 1000 between 4"], answer: [0, 1, 2, 3],
      why: "Zero, one, nothing to pay and awkward division are where the bugs are. 1000 between 4 is the easy case that tells you little." }
  ],
  code: {
    brief: "Write <code>parse_amount(text)</code>, which turns money typed by a user into a float. Rules, in order:<br>• Strip spaces from both ends. Ignore capitals.<br>• An optional <code>rs</code> or <code>rs.</code> at the start is allowed, with or without spaces after it.<br>• Remove all commas.<br>• What's left must be digits, optionally with one <code>.</code> and at most 2 digits after it. Otherwise raise <code>ValueError</code>. This means empty text, negative numbers and words are refused.<br>• Return it as a float.",
    sample: ">>> parse_amount(\" Rs 1,250.50 \")\n1250.5\n>>> parse_amount(\"rs.99\")\n99.0\n>>> parse_amount(\"-5\")\nValueError",
    starter: `def parse_amount(text):
    pass
`,
    tests: [
      { call: "parse_amount('1250')", expect: "1250.0", silent: true },
      { call: "parse_amount(' Rs 1,250.50 ')", expect: "1250.5" },
      { call: "parse_amount('rs.99')", expect: "99.0" },
      { call: "parse_amount('RS. 7.5')", expect: "7.5" },
      { call: "parse_amount('0')", expect: "0.0" },
      { call: "parse_amount('')", raises: "ValueError", label: "Empty text is refused" },
      { call: "parse_amount('abc')", raises: "ValueError", label: "Words are refused" },
      { call: "parse_amount('-5')", raises: "ValueError", label: "Negative amounts are refused" },
      { call: "parse_amount('12.345')", raises: "ValueError", label: "More than 2 decimals is refused" },
      { call: "parse_amount('Rs')", raises: "ValueError", label: "\"Rs\" alone is refused" },
      { call: "parse_amount('1.2.3')", raises: "ValueError", label: "Two dots are refused" }
    ],
    fuzz: { n: 12, what: "random typed amounts", gen: (r) => ({ call: "[_cq_try(parse_amount, " + JSON.stringify(r.pick(["", " ", "Rs ", "rs.", "RS"]) + r.pick(["", "1,", "12,"]) + r.int(0, 999) + r.pick(["", ".5", ".05", ".123", "x", ".", ".0"]) + r.pick(["", " "])) + ")]", setup: "def _cq_try(f, x):\n    try:\n        return f(x)\n    except ValueError:\n        return 'ValueError'" }) },
    hints: [
      "Normalise first: <code>t = text.strip().lower()</code>. If it <code>startswith(\"rs\")</code>, cut those 2 letters off, then <code>.lstrip(\". \")</code>. Then remove commas.",
      "Validate: if <code>t</code> has a <code>.</code>, split into whole and decimals with <code>t.split(\".\")</code>: there must be exactly 2 parts, the whole part must be digits, and the decimals must be 1 or 2 digits.",
      "Without a dot, <code>t.isdigit()</code> must be True. <code>\"\".isdigit()</code> is False, so empty text is refused automatically. Raise <code>ValueError</code> for anything that fails, then <code>return float(t)</code>."
    ],
    solution: `def parse_amount(text):
    t = text.strip().lower()
    if t.startswith("rs"):
        t = t[2:].lstrip(". ")
    t = t.replace(",", "")
    if "." in t:
        parts = t.split(".")
        if len(parts) != 2 or not parts[0].isdigit() or not parts[1].isdigit() or len(parts[1]) > 2:
            raise ValueError(f"Not an amount: {text!r}")
    elif not t.isdigit():
        raise ValueError(f"Not an amount: {text!r}")
    return float(t)`,
    wrong: [{ code: `def parse_amount(text):
    return float(text.strip().lower().replace("rs", "").replace(",", "").strip(". "))`, why: "accepts negatives and 3 decimals" }]
  },
  bug: {
    brief: "<b>AI code review.</b> The AI's leap-year check passes for 2024 and 2026, so it shipped. Then a calendar showed 29 February 1900, a date that never existed. Fix the rule.",
    code: `# AI-written
def is_leap(year):
    return year % 4 == 0

print(is_leap(2024), is_leap(2026))`,
    tests: [{ call: "[is_leap(y) for y in [2024, 2026, 1900, 2000, 2100, 2400]]", expect: "[True, False, False, True, False, True]" }],
    hints: ["Divisible by 4, except years divisible by 100, unless they're also divisible by 400."],
    fix: `def is_leap(year):
    return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)

print(is_leap(2024), is_leap(2026))`,
    lesson: "Tests that only try the easy cases prove little. The century years were the edge case."
  },
  explain: "List the edge cases you thought about for <code>parse_amount</code>, and explain which one was hardest to handle.",
  cards: [
    { q: "Is 1900 a leap year?", options: ["Yes", "No"], answer: 1 },
    { q: "Best first edge case for any function that takes a list?", options: ["A list of 100 items", "An empty list", "A sorted list", "A list of strings"], answer: 1 },
    { q: "\"Normalise input\" means…", options: ["Reject it", "Clean it into a standard form before checking it", "Make it uppercase only", "Save it"], answer: 1 }
  ],
  skills: { python: 3, logic: 4, debug: 2, test: 2, talk: 2 }
},
/* ───────────────────────────── 6-8 BOSS ───────────────────────────── */
{
  id: "6-8", world: 6, n: 8, boss: true, title: "Flagship v1", concept: "Boss: a study planner with classes and saving",
  learn: [
    { h: "Boss rules",
      p: "Build version 1 of a real app: a study planner. Two classes, JSON saving, dates, validation and edge cases. It's the shape of most back-end code: a model class for the data, a manager class for the operations, and saving to disk. Design first, then build one method at a time.",
      lang: "text",
      code: `Task(title, due, done=False)
    is_overdue(today) -> bool
    to_dict()         -> {"title": ..., "due": ..., "done": ...}
    Task.from_dict(d) -> Task

Planner(path="planner.json")   loads saved tasks if the file exists
    add(title, due)       -> Task   (ValueError for bad input)
    complete(title)       -> True/False
    pending()             -> list of Tasks, by due date then title
    overdue(today)        -> list of titles
    save()                -> writes JSON` },
    { h: "Class methods build objects from data",
      p: "A <code>@classmethod</code> receives the class itself as <code>cls</code> instead of an object. It's the standard way to write alternative constructors, like building a Task from a dictionary loaded from JSON.",
      code: `class Task:
    def __init__(self, title, due, done=False):
        self.title = title
        self.due = due
        self.done = done

    def to_dict(self):
        return {"title": self.title, "due": self.due, "done": self.done}

    @classmethod
    def from_dict(cls, d):
        return cls(d["title"], d["due"], d.get("done", False))

t = Task.from_dict({"title": "Revise SQL", "due": "2026-10-30"})
print(t.to_dict())` },
    { h: "Checking a date string",
      p: "To validate <code>\"YYYY-MM-DD\"</code>, try building a real date from it and catch the errors. This one helper refuses <code>\"tomorrow\"</code>, <code>\"2026-13-01\"</code> and <code>\"2026-02-30\"</code>.",
      code: `import datetime

def valid_date(text):
    try:
        y, m, d = text.split("-")
        datetime.date(int(y), int(m), int(d))
        return len(text) == 10
    except ValueError:
        return False

for t in ["2026-10-30", "tomorrow", "2026-13-01", "2026-02-30"]:
    print(t, valid_date(t))` }
  ],
  think: [
    { type: "order", q: "Put the planner's save-and-load round trip in order.", lines: ["Turn each Task into a dict with to_dict()", "Write the list of dicts to planner.json with json.dump", "Later, a new Planner reads planner.json with json.load", "Turn each dict back into a Task with Task.from_dict"],
      why: "Objects can't be saved directly as JSON, so they go through plain dictionaries both ways." },
    { type: "mcq", q: "Why do <code>pending()</code> results need a second sort key (the title)?", options: ["Titles are more important than dates", "So tasks due on the same day always come out in the same order", "Python requires two keys", "It's faster"], answer: 1,
      why: "Ties need a rule, or the order can change between runs and tests become flaky." },
    { type: "multi", q: "Which inputs should <code>add(title, due)</code> refuse?", options: ["An empty title", "A title of only spaces", "A due date of \"next week\"", "A due date of \"2026-02-30\"", "A title with emoji"], answer: [0, 1, 2, 3],
      why: "Empty or blank titles and impossible or non-standard dates would break the planner later. Emoji are just text, so they're fine." }
  ],
  code: {
    brief: "Build the study planner.<br><b>Task(title, due, done=False)</b>: due is <code>\"YYYY-MM-DD\"</code> text. Methods: <code>is_overdue(today)</code> (not done and due before today), <code>to_dict()</code>, and a classmethod <code>from_dict(d)</code>.<br><b>Planner(path=\"planner.json\")</b>: keeps a list <code>self.tasks</code>. If the file exists, load the tasks from it.<br>• <code>add(title, due)</code>: strip the title. Raise <code>ValueError</code> if it's empty, if the due date isn't a real <code>YYYY-MM-DD</code> date, or if a task with that title already exists. Otherwise add and return the Task.<br>• <code>complete(title)</code>: mark it done and return True, or return False if there's no such task.<br>• <code>pending()</code>: tasks not done, sorted by due date, then title.<br>• <code>overdue(today)</code>: titles of overdue tasks, in the same order.<br>• <code>save()</code>: write all tasks as a JSON list of dicts.",
    sample: ">>> p = Planner()\n>>> p.add(\"Revise SQL\", \"2026-10-30\")\n>>> p.add(\"Mock interview\", \"2026-10-25\")\n>>> [t.title for t in p.pending()]\n['Mock interview', 'Revise SQL']\n>>> p.overdue(\"2026-10-27\")\n['Mock interview']",
    starter: `import datetime
import json


class Task:
    pass


class Planner:
    pass
`,
    tests: [
      { call: "Task('a', '2026-10-01').to_dict()", expect: "{'title': 'a', 'due': '2026-10-01', 'done': False}", label: "<code>Task.to_dict</code>" },
      { call: "(lambda t: (t.title, t.due, t.done))(Task.from_dict({'title': 'x', 'due': '2026-01-02', 'done': True}))", expect: "('x', '2026-01-02', True)", label: "<code>Task.from_dict</code>" },
      { call: "[Task('a', '2026-10-01').is_overdue('2026-10-02'), Task('a', '2026-10-01').is_overdue('2026-10-01'), Task('a', '2026-10-01', True).is_overdue('2026-12-01')]", expect: "[True, False, False]", label: "<code>is_overdue</code>" },
      { files: null, setup: "p = Planner()\np.add('Revise SQL', '2026-10-30')\np.add('Mock interview', '2026-10-25')\np.add('Apply to 5 jobs', '2026-10-25')", call: "[t.title for t in p.pending()]", expect: "['Apply to 5 jobs', 'Mock interview', 'Revise SQL']", label: "<code>pending</code> sorts by date, then title" },
      { files: null, setup: "p = Planner()\np.add('A', '2026-10-01')\np.add('B', '2026-10-05')\np.add('C', '2026-09-01')\np.complete('C')", call: "(p.overdue('2026-10-03'), p.complete('C'), p.complete('Z'))", expect: "(['A'], True, False)", label: "<code>overdue</code> and <code>complete</code>" },
      { files: null, setup: "p = Planner()", call: "[_cq_err(p.add, t, d) for t, d in [('', '2026-10-01'), ('   ', '2026-10-01'), ('x', 'next week'), ('x', '2026-02-30'), ('x', '2026-13-01')]]", setup: "p = Planner()\ndef _cq_err(f, *a):\n    try:\n        f(*a)\n        return 'ok'\n    except ValueError:\n        return 'ValueError'", expect: "['ValueError', 'ValueError', 'ValueError', 'ValueError', 'ValueError']", label: "Bad titles and dates are refused" },
      { files: null, setup: "p = Planner()\np.add(' Revise ', '2026-10-01')\ndef _cq_err(f, *a):\n    try:\n        f(*a)\n        return 'ok'\n    except ValueError:\n        return 'ValueError'", call: "(p.tasks[0].title, _cq_err(p.add, 'Revise', '2026-11-01'))", expect: "('Revise', 'ValueError')", label: "Titles are stripped; duplicates refused" },
      { files: null, setup: "p = Planner('plan.json')\np.add('Revise SQL', '2026-10-30')\np.add('Mock', '2026-10-25')\np.complete('Mock')\np.save()\nq = Planner('plan.json')", call: "[(t.title, t.due, t.done) for t in q.tasks]", expect: "[('Revise SQL', '2026-10-30', False), ('Mock', '2026-10-25', True)]", label: "Saving and loading keeps every task" },
      { files: null, setup: "p = Planner('plan.json')\np.add('Revise SQL', '2026-10-30')\np.save()\nimport json\nwith open('plan.json') as f:\n    data = json.load(f)", call: "data", expect: "[{'title': 'Revise SQL', 'due': '2026-10-30', 'done': False}]", label: "The file is a JSON list of dicts" }
    ],
    must: [["class\\s+Task", "Define <code>class Task</code>."], ["class\\s+Planner", "Define <code>class Planner</code>."], ["@classmethod", "Make <code>from_dict</code> a <code>@classmethod</code>."], ["json\\.", "Save and load with the <code>json</code> module."]],
    hints: [
      "Build Task first and test it at the bottom of the file. <code>is_overdue</code> can compare the date strings directly, because YYYY-MM-DD text sorts like dates: <code>not self.done and self.due &lt; today</code>.",
      "Planner's <code>__init__</code>: <code>self.path = path</code>, <code>self.tasks = []</code>, then <code>try:</code> open and load the list, and turn each dict into a Task with <code>Task.from_dict</code>; <code>except FileNotFoundError: pass</code>.",
      "<code>pending</code>: <code>sorted([t for t in self.tasks if not t.done], key=lambda t: (t.due, t.title))</code>. Write a small <code>valid_date</code> helper for <code>add</code>, like the one in Learn."
    ],
    solution: `import datetime
import json


def valid_date(text):
    try:
        y, m, d = text.split("-")
        datetime.date(int(y), int(m), int(d))
    except ValueError:
        return False
    return len(text) == 10


class Task:
    def __init__(self, title, due, done=False):
        self.title = title
        self.due = due
        self.done = done

    def is_overdue(self, today):
        return not self.done and self.due < today

    def to_dict(self):
        return {"title": self.title, "due": self.due, "done": self.done}

    @classmethod
    def from_dict(cls, d):
        return cls(d["title"], d["due"], d.get("done", False))


class Planner:
    def __init__(self, path="planner.json"):
        self.path = path
        self.tasks = []
        try:
            with open(path) as f:
                self.tasks = [Task.from_dict(d) for d in json.load(f)]
        except FileNotFoundError:
            pass

    def find(self, title):
        for t in self.tasks:
            if t.title == title:
                return t
        return None

    def add(self, title, due):
        title = title.strip()
        if not title:
            raise ValueError("Title is required")
        if not valid_date(due):
            raise ValueError("Due date must be YYYY-MM-DD")
        if self.find(title):
            raise ValueError("That task already exists")
        task = Task(title, due)
        self.tasks.append(task)
        return task

    def complete(self, title):
        task = self.find(title)
        if task is None:
            return False
        task.done = True
        return True

    def pending(self):
        return sorted([t for t in self.tasks if not t.done], key=lambda t: (t.due, t.title))

    def overdue(self, today):
        return [t.title for t in self.pending() if t.is_overdue(today)]

    def save(self):
        with open(self.path, "w") as f:
            json.dump([t.to_dict() for t in self.tasks], f, indent=2)`,
    after: "This is your flagship's skeleton. Take it home and grow it: a command-line menu, then a Flask API, then a page."
  },
  bug: {
    brief: "<b>AI code review.</b> The AI's loader crashes the very first time anyone uses the app, because there's no saved file yet. Make a missing file mean \"no tasks yet\".",
    code: `# AI-written
import json

def load_tasks(path):
    with open(path) as f:
        return json.load(f)

print(load_tasks("planner.json"))`,
    tests: [{ files: null, call: "load_tasks('planner.json')", expect: "[]", label: "No file yet" }, { files: { "planner.json": "[{\"title\": \"A\", \"due\": \"2026-10-01\", \"done\": false}]" }, call: "load_tasks('planner.json')", expect: "[{'title': 'A', 'due': '2026-10-01', 'done': False}]", label: "An existing file" }],
    hints: ["Catch <code>FileNotFoundError</code> and return an empty list."],
    fix: `import json

def load_tasks(path):
    try:
        with open(path) as f:
            return json.load(f)
    except FileNotFoundError:
        return []

print(load_tasks("planner.json"))`,
    lesson: "The first run of any app has no saved data. Always test the \"brand-new user\" path."
  },
  explain: "Interview practice: explain the design of your planner: why two classes, how saving works, and which edge cases you handled.",
  cards: [
    { q: "What does a <code>@classmethod</code> receive first?", options: ["self (the object)", "cls (the class)", "Nothing", "The module"], answer: 1 },
    { q: "Why convert objects to dicts before saving JSON?", options: ["JSON can't store custom objects directly", "Dicts are faster", "Python requires it for all files", "To hide data"], answer: 0 },
    { q: "What should loading do on a brand-new install with no save file?", options: ["Crash", "Start with no tasks", "Ask the user to make the file", "Create random tasks"], answer: 1 }
  ],
  skills: { python: 5, logic: 3, debug: 2, test: 1, talk: 3 },
  homeQuest: {
    title: "Take it home",
    intro: "This week your flagship project is born. Keep it small, real and finished.",
    tasks: [
      { t: "Write your project's user stories", d: "5–8 stories in a <code>PLAN.md</code>, with the MVP must-haves marked. Talk to at least one person who has the problem.", skill: "talk" },
      { t: "Design the data", d: "Sketch your tables or classes on paper. Which structure holds what, and why?", skill: "logic" },
      { t: "Build the MVP's first thin slice", d: "One story, end to end: data, logic, and a way to use it (command line or a Flask route).", skill: "python" },
      { t: "Add tests for the core logic", d: "At least 5 pytest tests, including edge cases from your checklist.", skill: "test" },
      { t: "Commit daily with clear messages", d: "Small commits like <code>Add rating validation</code>. Push to GitHub every day.", skill: "git" },
      { t: "Read Beyond the Basic Stuff, ch. 5", d: "Code smells. Find two in your own code and fix them.", skill: "python" }
    ]
  }
}
);
