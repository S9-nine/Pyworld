/* Code Quest — course content.
   Each level: learn cards, think questions, a code challenge, a bug hunt,
   an explain prompt, and memory cards for spaced review. */

const WORLDS = [
  { id: 1, name: "Basics Village", when: "Week 1", x: 110, y: 410, open: true,
    topics: "print, variables, types, input, math, if / elif / else",
    boss: "The Gatekeeper", job: "Python syntax, logic, reading errors" },
  { id: 2, name: "Loop Forest", when: "Week 2", x: 255, y: 300,
    topics: "for and while loops, lists, dictionaries, functions",
    boss: "Expense Tracker (terminal app)", job: "Core data structures" },
  { id: 3, name: "Debug Caves", when: "Week 3", x: 400, y: 410,
    topics: "errors and exceptions, files, modules, tests with pytest",
    boss: "Quiz game with saved high scores and tests", job: "Debugging, testing" },
  { id: 4, name: "Data Desert", when: "Week 4", x: 540, y: 290,
    topics: "APIs, JSON, SQL with SQLite",
    boss: "Habit tracker with a database", job: "SQL, working with data" },
  { id: 5, name: "Web Kingdom", when: "Week 5", x: 690, y: 380,
    topics: "HTTP, HTML basics, Flask, putting an app online",
    boss: "Your first deployed web app", job: "Backend web basics, deployment" },
  { id: 6, name: "Capstone Castle", when: "Week 6", x: 845, y: 290,
    topics: "plan and build one real project that solves a real annoyance",
    boss: "Your flagship project, version 1", job: "Building end to end" },
  { id: 7, name: "Launch Harbor", when: "Week 7", x: 720, y: 150,
    topics: "tests, README, deployment, AI-assisted review, first open-source PR",
    boss: "Flagship shipped + one merged pull request", job: "Shipping, Git, collaboration" },
  { id: 8, name: "Interview Arena", when: "Week 8", x: 890, y: 95,
    topics: "the interview method, hash maps, two pointers, Big-O, stacks, binary search, resume and applications",
    boss: "The Final Interview + 10 applications sent", job: "Interviews, communication" }
];

const RESOURCES = {
  1: [
    { name: "Harvard CS50P", what: "Free lectures. Watch Lecture 0 (Functions, Variables) and Lecture 1 (Conditionals).", url: "https://cs50.harvard.edu/python/" },
    { name: "Exercism Python track", what: "Free exercises with human mentors. Do 3 easy ones this week.", url: "https://exercism.org/tracks/python" },
    { name: "Automate the Boring Stuff", what: "Free online book. Chapters 1 and 2 match this world.", url: "https://automatetheboringstuff.com/" },
    { name: "Official Python tutorial", what: "The reference. Skim sections 3 and 4.1 when you want more detail.", url: "https://docs.python.org/3/tutorial/" }
  ]
};

const SKILLS = [
  { id: "python", name: "Python", total: 40 },
  { id: "logic", name: "Logic", total: 30 },
  { id: "debug", name: "Debugging", total: 25 },
  { id: "talk", name: "Explaining code", total: 20 },
  { id: "git", name: "Git & GitHub", total: 12 },
  { id: "test", name: "Testing", total: 12 },
  { id: "sql", name: "SQL & data", total: 10 },
  { id: "web", name: "Web apps", total: 10 },
  { id: "interview", name: "Interviews", total: 15 }
];

const RANKS = [
  { xp: 0, name: "Novice" },
  { xp: 150, name: "Apprentice" },
  { xp: 400, name: "Scripter" },
  { xp: 800, name: "Coder" },
  { xp: 1400, name: "Engineer" },
  { xp: 2200, name: "Wizard" },
  { xp: 3200, name: "Archmage" }
];

const XP = { learn: 10, think: 10, thinkRetry: 4, codeBase: 30, codeStar: 10, bug: 25, explain: 15, card: 5, homeTask: 20 };

const LEVELS = [
/* ───────────────────────────── 1-1 ───────────────────────────── */
{
  id: "1-1", world: 1, n: 1, title: "First Words", concept: "print() and strings",
  learn: [
    { h: "A program is a list of instructions",
      p: "Python runs your lines from top to bottom, one at a time. <code>print()</code> shows whatever is inside the brackets. Press <b>Run</b> on any example, change it, and run it again. Breaking things on purpose is a great way to learn.",
      code: `print("Hello, world!")
print("I am learning Python.")` },
    { h: "Text goes inside quotes",
      p: "Text is called a <b>string</b>. Put it inside quotes, either single or double. Numbers don't need quotes, and Python can do math with them.",
      code: `print('Single quotes work')
print("So do double quotes")
print(42)
print(3 + 4)` },
    { h: "Comments are notes for humans",
      p: "Anything after a <code>#</code> is ignored by Python. Use comments to explain <i>why</i> your code does something. Future you will be grateful.",
      code: `# This whole line is ignored
print("Comments help future you")  # notes can go at the end too` },
    { h: "Commas join things with spaces",
      p: "Give <code>print()</code> several values separated by commas and it prints them on one line, with a space between each.",
      code: `print("Level", 1, "complete")` }
  ],
  think: [
    { type: "mcq", q: "What does this program show?", code: `print("3 + 4")
print(3 + 4)`,
      options: ["3 + 4, then 7", "7, then 7", "3 + 4, then 3 + 4", "An error"], answer: 0,
      why: "Quotes turn anything into text, so the first line prints the characters <code>3 + 4</code>. The second line has no quotes, so Python does the math." },
    { type: "mcq", q: "Which line prints exactly <code>Ready?</code>",
      options: ["print(Ready?)", "print(\"Ready?\")", "Print(\"Ready?\")", "print \"Ready?\""], answer: 1,
      why: "Text needs quotes, Python is case-sensitive (<code>Print</code> is not <code>print</code>), and Python 3 needs the brackets." }
  ],
  code: {
    brief: "Write a program that prints these three lines. Use your own name on line 2.",
    sample: "Hello, world!\nMy name is Kai\nI will be job-ready in 8 weeks.",
    starter: `# Write your code below. Each line of output needs its own print().
`,
    tests: [ { in: [], out: ["Hello, world!", "I will be job-ready in 8 weeks."], check: "name" } ],
    hints: [
      "You need three <code>print()</code> lines, one for each line of output.",
      "Text goes inside quotes: <code>print(\"Hello, world!\")</code>",
      "Copy the punctuation exactly. The comma after Hello and the full stop at the end both count."
    ],
    solution: `print("Hello, world!")
print("My name is Kai")
print("I will be job-ready in 8 weeks.")`
  },
  bug: {
    brief: "The village crier's script crashes before it says anything. Find the bug and fix it.",
    code: `print("Welcome to Basics Village!)
print("Population: 42")`,
    tests: [ { in: [], out: ["Welcome to Basics Village!", "Population: 42"] } ],
    hint: "Every string that opens with a quote must close with the same kind of quote."
  },
  explain: "In your own words: what's the difference between <code>print(\"5 + 5\")</code> and <code>print(5 + 5)</code>?",
  cards: [
    { q: "What does <code>print(\"2\" + \"2\")</code> show?", options: ["4", "22", "2 + 2", "An error"], answer: 1 },
    { q: "Which symbol starts a comment in Python?", options: ["//", "#", "--", "/*"], answer: 1 }
  ],
  skills: { python: 3, logic: 1, debug: 2, talk: 2 }
},
/* ───────────────────────────── 1-2 ───────────────────────────── */
{
  id: "1-2", world: 1, n: 2, title: "Memory Boxes", concept: "variables",
  learn: [
    { h: "A variable is a name for a value",
      p: "A variable stores a value under a name so you can use it later. Picture a name tag tied to the value. In Python, <code>=</code> means <b>tie this name to this value</b>. It does not mean \"equals\" like in math.",
      code: `hero = "Kai"
gold = 50
print(hero)
print(gold)` },
    { h: "A name can move to a new value",
      p: "Python always works out the <b>right side first</b>, then ties the name on the left to the result. So <code>gold = gold + 25</code> means: look up gold, add 25, then tie gold to the answer.",
      code: `gold = 50
gold = gold + 25
print(gold)` },
    { h: "Good names say what's inside",
      p: "Use lowercase words joined by underscores. No spaces, and don't start with a number. <code>max_health</code> tells a reader far more than <code>m</code> or <code>x2</code>.",
      code: `player_name = "Kai"
max_health = 100
print(player_name, "has", max_health, "health")` },
    { h: "f-strings put variables into text",
      p: "Put an <code>f</code> before the quotes and wrap variable names in <code>{ }</code>. Python swaps in their values. You'll use this all the time.",
      code: `hero = "Kai"
level = 3
print(f"{hero} reached level {level}!")` }
  ],
  think: [
    { type: "mcq", q: "What does this print?", code: `x = 5
x = x + 2
x = x * 2
print(x)`, options: ["7", "14", "10", "x"], answer: 1,
      why: "Trace it line by line: x is 5, then 5 + 2 = 7, then 7 × 2 = 14. Tracing on paper like this is how developers debug." },
    { type: "mcq", q: "Which of these is a valid variable name?",
      options: ["2nd_place", "player score", "player_score", "player-score"], answer: 2,
      why: "Names can't start with a number, can't contain spaces, and a hyphen means minus. Underscores are the Python style." },
    { type: "mcq", q: "What does this print?", code: `a = 1
b = a
a = 9
print(b)`, options: ["1", "9", "a", "An error"], answer: 0,
      why: "<code>b = a</code> copies the value that was in a <i>at that moment</i> (1). Changing a later doesn't reach back and change b." }
  ],
  code: {
    brief: "A hero starts with 50 gold, finds a chest with 25 gold, then buys a potion for 30 gold. Update <code>gold</code> step by step, then print the line below. Let Python do the math.",
    sample: "Kai has 45 gold left.",
    starter: `hero = "Kai"
gold = 50
# The hero finds a chest with 25 gold

# The hero buys a potion for 30 gold

# Print the message
`,
    tests: [ { in: [], out: ["Kai has 45 gold left."] } ],
    must: [ ["gold\\s*=\\s*gold", "Update the box with something like <code>gold = gold + 25</code>."] ],
    mustNot: [ ["45", "Don't type 45 yourself. Let Python work it out from the variables."] ],
    hints: [
      "Add first: <code>gold = gold + 25</code>. Then subtract the potion the same way.",
      "Use an f-string to print: <code>print(f\"... {gold} ...\")</code>",
      "Don't forget the hero's name comes from the <code>hero</code> variable: <code>{hero}</code>."
    ],
    solution: `hero = "Kai"
gold = 50
gold = gold + 25
gold = gold - 30
print(f"{hero} has {gold} gold left.")`
  },
  bug: {
    brief: "This score counter crashes. Read the error message carefully. It tells you which name Python doesn't know.",
    code: `score = 10
bonus = 5
total = score + Bonus
print(f"Total score: {total}")`,
    tests: [ { in: [], out: ["Total score: 15"] } ],
    hint: "Python is case-sensitive. Is <code>Bonus</code> the same as <code>bonus</code>?"
  },
  explain: "Why is <code>gold = gold + 25</code> not a math mistake? Explain what Python does, step by step.",
  cards: [
    { q: "After <code>x = 3</code> and then <code>x = x + 1</code>, what is x?", options: ["3", "4", "x + 1", "An error"], answer: 1 },
    { q: "What does <code>=</code> do in Python?", options: ["Checks if two things are equal", "Stores a value in a variable", "Prints a value", "Compares types"], answer: 1 }
  ],
  skills: { python: 3, logic: 2, debug: 2, talk: 2 }
},
/* ───────────────────────────── 1-3 ───────────────────────────── */
{
  id: "1-3", world: 1, n: 3, title: "Shape of Data", concept: "types and converting",
  learn: [
    { h: "Every value has a type",
      p: "The four types you'll use every day: <b>int</b> (whole numbers), <b>float</b> (decimals), <b>str</b> (text) and <b>bool</b> (True or False). <code>type()</code> tells you which one you have.",
      code: `print(type(42))
print(type(3.5))
print(type("hi"))
print(type(True))` },
    { h: "Types change what + does",
      p: "With numbers, <code>+</code> adds. With strings, it glues them together. <code>*</code> on a string repeats it. Same symbol, different behaviour, all because of the type.",
      code: `print(5 + 5)
print("5" + "5")
print("ha" * 3)` },
    { h: "Convert with int(), float() and str()",
      p: "Data often arrives as text, from a user, a file or a website. Convert it before doing math: <code>int(\"40\")</code> gives the number 40. Go the other way with <code>str()</code>.",
      code: `price = "40"
qty = 3
total = int(price) * qty
print(total)
print("Total: " + str(total))` },
    { h: "Booleans answer yes-or-no questions",
      p: "Comparisons give back <code>True</code> or <code>False</code>. You'll use them to make decisions in a couple of levels.",
      code: `print(10 > 3)
print(2 == 5)` }
  ],
  think: [
    { type: "mcq", q: "What does this print?", code: `print("7" + "3")`, options: ["10", "73", "7 + 3", "An error"], answer: 1,
      why: "Both are strings because of the quotes, so <code>+</code> glues them together." },
    { type: "mcq", q: "What happens here?", code: `print("Age: " + 20)`, options: ["Age: 20", "Age 20", "A TypeError", "Age: + 20"], answer: 2,
      why: "Python won't glue text and a number with <code>+</code>. Fix it with <code>str(20)</code> or an f-string." },
    { type: "mcq", q: "What type is <code>\"True\"</code> (with quotes)?", options: ["bool", "str", "int", "None"], answer: 1,
      why: "Quotes always make a string, even if the text inside looks like something else." }
  ],
  code: {
    brief: "A shop sends its data as text: <code>price = \"40\"</code> and <code>quantity = \"3\"</code>. Convert them, work out the total, and print the line below.",
    sample: "Total: 120 coins",
    starter: `price = "40"
quantity = "3"
# Convert, multiply, and print the total
`,
    tests: [ { in: [], out: ["Total: 120 coins"] } ],
    must: [ ["int\\(", "Convert the text to numbers with <code>int()</code>."] ],
    mustNot: [ ["120", "Don't type 120 yourself. Let Python calculate it."] ],
    hints: [
      "<code>\"40\" * \"3\"</code> won't work. Both need to become numbers first.",
      "Try <code>total = int(price) * int(quantity)</code>",
      "Print with an f-string: <code>print(f\"Total: {total} coins\")</code>"
    ],
    solution: `price = "40"
quantity = "3"
total = int(price) * int(quantity)
print(f"Total: {total} coins")`
  },
  bug: {
    brief: "The life counter crashes with a TypeError. Fix it so it prints the line correctly.",
    code: `lives = 3
print("Lives left: " + lives)`,
    tests: [ { in: [], out: ["Lives left: 3"] } ],
    hint: "You can't glue a string and a number with <code>+</code>. Wrap the number in <code>str()</code>, or use an f-string."
  },
  explain: "Why does <code>\"5\" + \"5\"</code> give 55 but <code>5 + 5</code> give 10?",
  cards: [
    { q: "What does <code>int(\"8\") + 2</code> give?", options: ["10", "82", "8 + 2", "An error"], answer: 0 },
    { q: "Which of these is a float?", options: ["7", "\"7.0\"", "7.0", "True"], answer: 2 }
  ],
  skills: { python: 3, logic: 1, debug: 3, talk: 2 }
},
/* ───────────────────────────── 1-4 ───────────────────────────── */
{
  id: "1-4", world: 1, n: 4, title: "Talking to Users", concept: "input()",
  learn: [
    { h: "input() waits for the user",
      p: "<code>input()</code> pauses the program, shows a question, and waits. Whatever the user types gets stored. Press <b>Run</b>, then type your answer in the console and press Enter.",
      code: `name = input("What's your name? ")
print(f"Welcome, {name}!")` },
    { h: "input() always gives you a string",
      p: "Even if the user types <code>20</code>, you get the text <code>\"20\"</code>. If you want to do math, convert it straight away with <code>int()</code>.",
      code: `age = int(input("How old are you? "))
print(f"Next year you'll be {age + 1}")` },
    { h: "Plan first: input, process, output",
      p: "Almost every program follows this shape. Before writing code, say in plain words what comes in, what you do with it, and what goes out. Writing these as comments first is a habit professional developers use.",
      code: `# Input
year = int(input("Birth year? "))
# Process
age = 2026 - year
# Output
print(f"You turn {age} this year")` }
  ],
  think: [
    { type: "order", q: "Put these lines in order so the program asks for a number and prints double it.",
      lines: [`n = input("Number? ")`, `n = int(n)`, `doubled = n * 2`, `print(f"Double is {doubled}")`],
      why: "Input, then convert, then process, then output. A value must exist before you can use it." },
    { type: "mcq", q: "The user types <code>7</code>. What does this print?", code: `x = input()
print(x + x)`, options: ["14", "77", "7 + 7", "An error"], answer: 1,
      why: "<code>input()</code> gave the string \"7\", and two strings glue together." }
  ],
  code: {
    brief: "Ask for the user's name, then their age. Print a message like the one below. The game tests it with different people, so use the inputs, not fixed values.",
    sample: "Hi Ana! In 5 years you'll be 25.",
    starter: `# 1. Ask for the name

# 2. Ask for the age (remember to convert it!)

# 3. Print the message
`,
    tests: [
      { in: ["Ana", "20"], out: ["Hi Ana! In 5 years you'll be 25."] },
      { in: ["Ravi", "31"], out: ["Hi Ravi! In 5 years you'll be 36."] }
    ],
    must: [ ["input\\(", "Use <code>input()</code> to ask the user."] ],
    hints: [
      "Ask twice: <code>name = input(\"Name? \")</code>, then the age.",
      "Convert the age: <code>age = int(input(\"Age? \"))</code>",
      "The message has an apostrophe in <i>you'll</i>, so wrap it in double quotes: <code>print(f\"Hi {name}! In 5 years you'll be {age + 5}.\")</code>"
    ],
    solution: `name = input("Name? ")
age = int(input("Age? "))
print(f"Hi {name}! In 5 years you'll be {age + 5}.")`
  },
  bug: {
    brief: "The pie planner crashes when someone types a number. Find out why.",
    code: `apples = input("How many apples? ")
pies = apples // 3
print(f"You can bake {pies} pies")`,
    tests: [
      { in: ["10"], out: ["You can bake 3 pies"] },
      { in: ["7"], out: ["You can bake 2 pies"] }
    ],
    hint: "What type does <code>input()</code> return? Can you do math on it?"
  },
  explain: "Why do we need <code>int()</code> around <code>input()</code> when asking for an age?",
  cards: [
    { q: "What type does <code>input()</code> always return?", options: ["int", "str", "float", "It depends what you type"], answer: 1 },
    { q: "Most programs follow: Input → ? → Output", options: ["Print", "Process", "Pause", "Python"], answer: 1 }
  ],
  skills: { python: 3, logic: 2, debug: 2, talk: 2 }
},
/* ───────────────────────────── 1-5 ───────────────────────────── */
{
  id: "1-5", world: 1, n: 5, title: "Math Machine", concept: "operators",
  learn: [
    { h: "Python is a calculator",
      p: "Beyond <code>+ - *</code> there are three you'll use a lot. <code>/</code> always gives a decimal. <code>//</code> gives how many <i>whole</i> times something fits. <code>%</code> gives the remainder. <code>**</code> is power.",
      code: `print(7 + 2, 7 - 2, 7 * 2)
print(7 / 2)   # true division, always a float
print(7 // 2)  # whole times
print(7 % 2)   # remainder
print(2 ** 3)  # power` },
    { h: "// and % are a team",
      p: "Splitting things into groups and leftovers comes up all the time: minutes into hours, cents into coins, items into pages. <code>//</code> gives the groups and <code>%</code> gives what's left.",
      code: `cookies = 17
kids = 5
print("Each kid gets", cookies // kids)
print("Left over:", cookies % kids)` },
    { h: "Order of operations",
      p: "Same as school math: <code>**</code> first, then <code>* / // %</code>, then <code>+ -</code>. When in doubt, add brackets. Clear code beats clever code.",
      code: `print(2 + 3 * 4)
print((2 + 3) * 4)` },
    { h: "Logic trick: even or odd",
      p: "<code>n % 2</code> is 0 for even numbers and 1 for odd ones. You'll use this trick in loops and puzzles, including a famous interview question.",
      code: `print(10 % 2)
print(7 % 2)` }
  ],
  think: [
    { type: "mcq", q: "What does this print?", code: `print(17 % 5)`, options: ["3", "2", "3.4", "12"], answer: 1,
      why: "5 fits into 17 three times (15), and 2 is left over." },
    { type: "mcq", q: "What does this print?", code: `print(2 + 3 * 2 ** 2)`, options: ["100", "14", "20", "36"], answer: 1,
      why: "Power first (2² = 4), then multiply (3 × 4 = 12), then add (2 + 12 = 14)." },
    { type: "mcq", q: "Which expression gives the number of full weeks in 45 days?", options: ["45 / 7", "45 % 7", "45 // 7", "45 ** 7"], answer: 2,
      why: "<code>//</code> counts whole groups. <code>45 // 7</code> is 6 full weeks, and <code>45 % 7</code> is the 3 days left over." }
  ],
  code: {
    brief: "Ask for a number of minutes and print it as hours and minutes, exactly like the example. Test it in your head with 60 and 59 too.",
    sample: "Minutes? 135\n2 hours and 15 minutes",
    starter: `minutes = int(input("Minutes? "))
# Work out the hours and the leftover minutes

# Print the result
`,
    tests: [
      { in: ["135"], out: ["2 hours and 15 minutes"] },
      { in: ["60"], out: ["1 hours and 0 minutes"] },
      { in: ["59"], out: ["0 hours and 59 minutes"] }
    ],
    must: [ ["//", "Use <code>//</code> to count the whole hours."], ["%", "Use <code>%</code> for the leftover minutes."] ],
    hints: [
      "How many whole 60s fit in the minutes? That's the hours.",
      "<code>hours = minutes // 60</code> and <code>left = minutes % 60</code>",
      "<code>print(f\"{hours} hours and {left} minutes\")</code>"
    ],
    solution: `minutes = int(input("Minutes? "))
hours = minutes // 60
left = minutes % 60
print(f"{hours} hours and {left} minutes")`
  },
  bug: {
    brief: "The average of 80, 90 and 70 should be 80.0, but this prints something much bigger. Fix the logic.",
    code: `a = 80
b = 90
c = 70
average = a + b + c / 3
print(f"Average: {average}")`,
    tests: [ { in: [], out: ["Average: 80.0"] } ],
    hint: "Division happens before addition. Which part should be added up first? Use brackets."
  },
  explain: "Explain how <code>//</code> and <code>%</code> work together to turn 135 minutes into hours and minutes.",
  cards: [
    { q: "What is <code>20 % 6</code>?", options: ["3", "2", "3.33", "0"], answer: 1 },
    { q: "What does <code>9 // 2</code> give?", options: ["4.5", "4", "5", "1"], answer: 1 }
  ],
  skills: { python: 3, logic: 3, debug: 2, talk: 2 }
},
/* ───────────────────────────── 1-6 ───────────────────────────── */
{
  id: "1-6", world: 1, n: 6, title: "Fork in the Road", concept: "if / else",
  learn: [
    { h: "if lets your program decide",
      p: "An <code>if</code> checks a condition. If it's True, the indented lines underneath run. The colon <code>:</code> and the 4-space indent are required. They show Python which lines belong to the if.",
      code: `height = 130
if height >= 120:
    print("Welcome aboard!")
print("Next rider please")` },
    { h: "else covers everything else",
      p: "<code>else</code> runs when the condition is False. Exactly one of the two blocks runs, never both.",
      code: `temperature = 15
if temperature > 25:
    print("Wear shorts")
else:
    print("Bring a jacket")` },
    { h: "Comparing values",
      p: "<code>==</code> equal, <code>!=</code> not equal, <code>&gt; &lt; &gt;= &lt;=</code>. Remember: one <code>=</code> stores, two <code>==</code> compares. Mixing them up is one of the most common beginner bugs.",
      code: `password = "dragon"
print(password == "dragon")
print(password != "dragon")` },
    { h: "Say the rule out loud first",
      p: "Before coding a decision, write the rule as a sentence: <i>\"If height is at least 120, let them in. Otherwise, say sorry.\"</i> \"At least\" means <code>&gt;=</code>. Translating words into exact conditions is the core skill of programming logic.",
      code: `# Rule: at least 120 cm to ride
height = 120
if height >= 120:
    print("In you go")
else:
    print("Not yet")` }
  ],
  think: [
    { type: "mcq", q: "A ride needs riders to be <b>at least</b> 120 cm. Which condition is right?",
      options: ["height > 120", "height >= 120", "height == 120", "height => 120"], answer: 1,
      why: "\"At least\" includes 120 itself, so <code>&gt;=</code>. <code>=&gt;</code> isn't a Python operator." },
    { type: "mcq", q: "What does this print?", code: `x = 10
if x > 5:
    print("big")
else:
    print("small")
print("done")`, options: ["big", "big, then done", "small, then done", "big, small, done"], answer: 1,
      why: "Only the if block runs, then the program carries on. <code>print(\"done\")</code> isn't indented, so it always runs." },
    { type: "mcq", q: "What's wrong with <code>if score = 100:</code>?",
      options: ["Nothing", "It needs == to compare", "100 needs quotes", "if must be capitalised"], answer: 1,
      why: "A single <code>=</code> stores a value. To compare, use <code>==</code>." }
  ],
  code: {
    brief: "Ask for the rider's height in cm. If it's at least 120, print <code>Welcome aboard!</code>. Otherwise print <code>Sorry, too short</code>.",
    sample: "Height? 125\nWelcome aboard!",
    starter: `height = int(input("Height? "))
`,
    tests: [
      { in: ["120"], out: ["Welcome aboard!"], not: ["Sorry, too short"] },
      { in: ["119"], out: ["Sorry, too short"], not: ["Welcome aboard!"] },
      { in: ["150"], out: ["Welcome aboard!"], not: ["Sorry, too short"] }
    ],
    must: [ ["\\bif\\b", "Use an <code>if</code>."], ["\\belse\\b", "Use an <code>else</code> for the other case."] ],
    hints: [
      "Write the rule as a sentence first: if height is at least 120…",
      "<code>if height &gt;= 120:</code> and indent the print underneath with 4 spaces.",
      "Then <code>else:</code> on its own line, lined up with the <code>if</code>, with its own indented print."
    ],
    solution: `height = int(input("Height? "))
if height >= 120:
    print("Welcome aboard!")
else:
    print("Sorry, too short")`
  },
  bug: {
    brief: "This voting check won't even start. Read the error, then fix it.",
    code: `age = int(input("Age? "))
if age >= 18
    print("You can vote")
else:
    print("Not yet")`,
    tests: [
      { in: ["20"], out: ["You can vote"] },
      { in: ["12"], out: ["Not yet"] }
    ],
    hint: "Look closely at the end of the <code>if</code> line. What does every if, elif and else line need?"
  },
  explain: "Why does it matter whether you use <code>&gt;</code> or <code>&gt;=</code> in the ride check? Give an example height.",
  cards: [
    { q: "Which operator checks if two values are equal?", options: ["=", "==", "===", "!="], answer: 1 },
    { q: "What shows Python which lines belong to an if?", options: ["Curly braces", "Indentation", "Semicolons", "Brackets"], answer: 1 }
  ],
  skills: { python: 3, logic: 3, debug: 2, talk: 2 }
},
/* ───────────────────────────── 1-7 ───────────────────────────── */
{
  id: "1-7", world: 1, n: 7, title: "Many Paths", concept: "elif, and, or, not",
  learn: [
    { h: "elif means \"else if\"",
      p: "When there are more than two options, chain them with <code>elif</code>. Python checks from the top and runs <b>only the first</b> branch that's True, then skips the rest.",
      code: `score = 82
if score >= 90:
    print("A")
elif score >= 75:
    print("B")
elif score >= 50:
    print("C")
else:
    print("Try again")` },
    { h: "Order matters",
      p: "Put the strictest check first. Here a score of 95 never reaches the A branch, because <code>95 &gt;= 50</code> is already True.",
      code: `score = 95
if score >= 50:
    print("C")
elif score >= 90:
    print("A")  # never reached for 95!` },
    { h: "Combine conditions",
      p: "<code>and</code> needs both sides True. <code>or</code> needs at least one. <code>not</code> flips True and False.",
      code: `age = 16
has_ticket = True
if age >= 13 and has_ticket:
    print("Enjoy the movie")

is_weekend = False
if not is_weekend:
    print("School day")` },
    { h: "Test the edges",
      p: "Bugs hide at the boundaries. If A starts at 90, test 89, 90 and 91. Developers call these <b>edge cases</b>, and interviewers love asking about them.",
      code: `# Change score to 89, 90 and 91 and run each time
score = 90
if score >= 90:
    print(score, "is an A")
else:
    print(score, "is not an A")` }
  ],
  think: [
    { type: "mcq", q: "What does this print?", code: `temp = 35
if temp > 20:
    print("warm")
elif temp > 30:
    print("hot")`, options: ["warm", "hot", "warm, then hot", "Nothing"], answer: 0,
      why: "35 &gt; 20 is True, so the first branch runs and the rest are skipped. The stricter check should come first." },
    { type: "mcq", q: "A park lets you in if you're 12 or older, <b>or</b> if you're with an adult. Which condition fits?",
      options: ["age >= 12 and with_adult", "age >= 12 or with_adult", "age > 12 or with_adult", "not age >= 12"], answer: 1,
      why: "Either reason is enough, so <code>or</code>. And \"12 or older\" includes 12, so <code>&gt;=</code>." },
    { type: "mcq", q: "Grade A starts at 90. Which scores are the best to test?",
      options: ["10, 50, 100", "89, 90, 91", "90 only", "Any random three"], answer: 1,
      why: "Right below, on, and right above the boundary. That's where off-by-one bugs show up." }
  ],
  code: {
    brief: "Ask for a score and print the grade: <code>A</code> for 90 and up, <code>B</code> for 75 and up, <code>C</code> for 50 and up, otherwise <code>Try again</code>.",
    sample: "Score? 82\nB",
    starter: `score = int(input("Score? "))
`,
    tests: [
      { in: ["95"], out: ["A"], only: true },
      { in: ["90"], out: ["A"], only: true },
      { in: ["80"], out: ["B"], only: true },
      { in: ["75"], out: ["B"], only: true },
      { in: ["50"], out: ["C"], only: true },
      { in: ["49"], out: ["Try again"], only: true }
    ],
    must: [ ["\\belif\\b", "Use <code>elif</code> for the middle grades."] ],
    hints: [
      "Start with the strictest grade: check for A first.",
      "<code>if score &gt;= 90:</code> … <code>elif score &gt;= 75:</code> … and so on.",
      "Finish with <code>else:</code> for <code>Try again</code>. Each print is indented under its branch."
    ],
    solution: `score = int(input("Score? "))
if score >= 90:
    print("A")
elif score >= 75:
    print("B")
elif score >= 50:
    print("C")
else:
    print("Try again")`
  },
  bug: {
    brief: "This weekend checker says <i>every</i> day is the weekend. It runs without errors, which makes the bug sneakier.",
    code: `day = input("Day? ")
if day == "Saturday" or "Sunday":
    print("Weekend!")
else:
    print("Weekday")`,
    tests: [
      { in: ["Sunday"], out: ["Weekend!"] },
      { in: ["Saturday"], out: ["Weekend!"] },
      { in: ["Monday"], out: ["Weekday"], not: ["Weekend!"] }
    ],
    hint: "Each side of <code>or</code> must be a full comparison. <code>\"Sunday\"</code> on its own is just a non-empty string, which counts as True."
  },
  explain: "Explain why the order of the elif checks matters, using the grade example.",
  cards: [
    { q: "In an if / elif chain, how many branches run?", options: ["Every True one", "Only the first True one", "The last True one", "None of them"], answer: 1 },
    { q: "What does <code>True or False</code> give?", options: ["True", "False", "An error", "None"], answer: 0 }
  ],
  skills: { python: 3, logic: 4, debug: 3, talk: 2 }
},
/* ───────────────────────────── 1-8 BOSS ───────────────────────────── */
{
  id: "1-8", world: 1, n: 8, boss: true, title: "The Gatekeeper", concept: "Boss: everything so far",
  learn: [
    { h: "Boss rules",
      p: "No new concepts here, only a bigger problem. The trick that works for every hard problem: <b>write the rules in plain words as comments first</b>, then turn each comment into code, then test every path.",
      code: `# Rule 1: ask for the password and age
# Rule 2: wrong password -> stay shut
# Rule 3: right password, 13 or older -> open
# Rule 4: right password, under 13 -> need a grown-up
print("Plan written. Now code it!")` },
    { h: "Nesting decisions",
      p: "You can put an <code>if</code> inside another <code>if</code>. Indent one more level for each layer. Or combine conditions with <code>and</code>. Both work, so pick the one that reads more clearly.",
      code: `has_key = True
level = 4
if has_key:
    if level >= 5:
        print("Door opens")
    else:
        print("Come back at level 5")
else:
    print("You need a key")` }
  ],
  think: [
    { type: "mcq", q: "The Gatekeeper has 3 possible answers. What's the fewest test runs that tries every path?",
      options: ["1", "2", "3", "10"], answer: 2,
      why: "One test per path: wrong password, right password and old enough, right password and too young. Then add edge cases like age exactly 13." },
    { type: "order", q: "Put this plan in a sensible order.",
      lines: ["Ask for the password and age", "Check the password first", "If it's right, check the age", "Print the matching message"],
      why: "Collect the input, then check the most important rule first, then the detail inside it." }
  ],
  code: {
    brief: "Ask for a password, then an age. Passwords are case-sensitive.<br>• Wrong password (not <code>python</code>): <code>Wrong password. The gate stays shut.</code><br>• Right password and 13 or older: <code>The gate opens. Welcome, hero!</code><br>• Right password and under 13: <code>You need a grown-up to enter.</code>",
    sample: "Password? python\nAge? 20\nThe gate opens. Welcome, hero!",
    starter: `# Write your plan as comments first, then code each step.
`,
    tests: [
      { in: ["python", "20"], out: ["The gate opens. Welcome, hero!"], only: true },
      { in: ["python", "13"], out: ["The gate opens. Welcome, hero!"], only: true },
      { in: ["python", "12"], out: ["You need a grown-up to enter."], only: true },
      { in: ["Python", "30"], out: ["Wrong password. The gate stays shut."], only: true },
      { in: ["dragon", "40"], out: ["Wrong password. The gate stays shut."], only: true }
    ],
    must: [ ["input\\(", "Ask for the password and age with <code>input()</code>."] ],
    hints: [
      "Ask for both first: <code>password = input(\"Password? \")</code> and <code>age = int(input(\"Age? \"))</code>",
      "Check the password first: <code>if password != \"python\":</code> prints the wrong-password line.",
      "Then <code>elif age &gt;= 13:</code> for the gate opening, and <code>else:</code> for the grown-up line."
    ],
    solution: `password = input("Password? ")
age = int(input("Age? "))
if password != "python":
    print("Wrong password. The gate stays shut.")
elif age >= 13:
    print("The gate opens. Welcome, hero!")
else:
    print("You need a grown-up to enter.")`
  },
  bug: {
    brief: "<b>AI code review.</b> An AI sidekick wrote this discount checker. Members get 20% off orders of <b>100 or more</b>. It looks right, but it fails a test. Checking AI code like this is a skill employers now ask about.",
    code: `# Written by an AI sidekick. Members get 20% off orders of 100 or more.
total = float(input("Order total? "))
member = input("Member? (yes/no) ")
if member == "yes" and total > 100:
    total = total * 0.8
print(f"You pay {total}")`,
    tests: [
      { in: ["100", "yes"], out: ["You pay 80.0"] },
      { in: ["150", "yes"], out: ["You pay 120.0"] },
      { in: ["150", "no"], out: ["You pay 150.0"] },
      { in: ["50", "yes"], out: ["You pay 50.0"] }
    ],
    hint: "Re-read the rule: \"100 <b>or more</b>\". What happens with exactly 100?"
  },
  explain: "Interview practice: walk through how you tested the Gatekeeper. Which inputs did you try, and why those?",
  cards: [
    { q: "Before coding a tricky rule, what should you do first?", options: ["Start typing", "Write the rules in plain words", "Ask an AI for the full code", "Copy something online"], answer: 1 },
    { q: "An AI wrote code that looks right. What do you do?", options: ["Ship it", "Test it, especially edge cases", "Delete it", "Rewrite it in another language"], answer: 1 }
  ],
  skills: { python: 4, logic: 4, debug: 4, talk: 3 },
  homeQuest: {
    title: "Take it home",
    intro: "Real developers code on their own computer and share work on GitHub. These steps start your portfolio. Tick each one when it's done.",
    tasks: [
      { t: "Install Python 3 and VS Code", d: "python.org/downloads and code.visualstudio.com. Run <code>python --version</code> in a terminal to check.", skill: "python" },
      { t: "Build a text adventure", d: "At least 3 choices using <code>input()</code> and <code>if / elif / else</code>. Make it about something you like.", skill: "logic" },
      { t: "Create a free GitHub account", d: "github.com. Pick a professional username, because employers will see it.", skill: "git" },
      { t: "Put your adventure on GitHub with a README", d: "Say what it is, how to run it (<code>python adventure.py</code>), and one thing you learned.", skill: "git" },
      { t: "Watch CS50P Lectures 0 and 1", d: "Functions, Variables and Conditionals. Pause and type along.", skill: "python" },
      { t: "Solve 3 Exercism exercises", d: "Python track. Request mentor feedback on one of them.", skill: "debug" }
    ]
  }
}
];
