/* World 3 — Debug Caves: tracebacks, exceptions, files, modules, tests. Boss: The Quiz Master. */

RESOURCES[3] = [
  { name: "Harvard CS50P, Weeks 3–6", what: "Exceptions, Libraries, Unit Tests and File I/O: exactly this world. One a day.", url: "https://cs50.harvard.edu/python/weeks/3/" },
  { name: "Automate the Boring Stuff, ch. 5 and 10", what: "Debugging (tracebacks, assertions) and reading and writing files.", url: "https://automatetheboringstuff.com/3e/chapter5.html" },
  { name: "Real Python: Understanding the Traceback", what: "How to read a full traceback from the bottom up.", url: "https://realpython.com/python-traceback/" },
  { name: "pytest: Get started", what: "The official first steps. Install it at home with pip install pytest.", url: "https://docs.pytest.org/en/stable/getting-started.html" }
];

const W3_QUIZ = "What keyword starts a function?|def\nWhat does len(\"chai\") return?|4\nWhich error do you get for 10 / 0?|ZeroDivisionError\n";

LEVELS.push(
/* ───────────────────────────── 3-1 ───────────────────────────── */
{
  id: "3-1", world: 3, n: 1, title: "Reading the Runes", concept: "tracebacks and the debugging loop",
  learn: [
    { h: "A traceback is a map to the bug",
      p: "When Python crashes on your own computer, it prints a <b>traceback</b>. Read it from the <b>bottom up</b>: the last line names the error type and message, and the lines above show the path of calls that led there, ending at the line that broke. This game's console shows the bottom line and the line number for you.",
      lang: "text", file: "what you see in a terminal",
      code: `Traceback (most recent call last):
  File "shop.py", line 9, in <module>
    print(average([]))
  File "shop.py", line 4, in average
    return total / len(prices)
ZeroDivisionError: division by zero

# Read it bottom-up:
# 1. What went wrong?  ZeroDivisionError: division by zero
# 2. Where?            line 4, inside average()
# 3. How did we get there? line 9 called average([])` },
    { h: "The errors you'll meet most",
      p: "Each error name is a clue. <b>SyntaxError</b>: Python can't read the code. <b>NameError</b>: a name doesn't exist (often a typo). <b>TypeError</b>: wrong type for the job. <b>ValueError</b>: right type, bad value, like <code>int(\"abc\")</code>. <b>IndexError</b> and <b>KeyError</b>: asking for something that isn't there. Run it. Then remove the # from one line at a time, run again, and read each error.",
      err: true,
      code: `scores = [80, 90]
# Remove the # from one line at a time and read each error:
# print(scores[5])
# print(int("ninety"))
# print("Total: " + 170)
print(score)` },
    { h: "The debugging loop",
      p: "Good debuggers don't guess. They follow a loop: <b>1. Reproduce</b> the bug. <b>2. Read</b> the error: type, message, line. <b>3. Guess</b> a cause. <b>4. Test</b> the guess, often with a <code>print()</code>. <b>5. Fix</b> one thing. <b>6. Re-run</b> everything. Research shows that people taught this loop debug better than people who only practise.",
      code: `def average(prices):
    total = 0
    for p in prices:
        total += p
    print("DEBUG total =", total, "count =", len(prices))  # step 4: test the guess
    return total / len(prices)

print(average([40, 60]))` },
    { h: "Bugs with no error message",
      p: "The hardest bugs don't crash. The program runs and gives a wrong answer. To find them, print the values in the middle of the program, or trace by hand, and compare with what you <i>expected</i> at each step. The first place they differ is where the bug is.",
      code: `temps = [31, 33, 30, 35]
total = 0
for i in range(len(temps) - 1):
    print("DEBUG adding day", i, "=", temps[i])
    total += temps[i]
print("Average:", total / len(temps))   # 32.25 expected. What's missing?` }
  ],
  think: [
    { type: "mcq", q: "You get a long traceback. Where do you look <b>first</b>?", options: ["The first line", "The last line: the error type and message", "The middle", "The longest line"], answer: 1,
      why: "The bottom line says <i>what</i> went wrong. Then work upward to find <i>where</i> and <i>how</i> you got there." },
    { type: "match", q: "Match each error with its most likely cause.",
      pairs: [["<code>NameError</code>", "a typo in a variable or function name"], ["<code>TypeError</code>", "mixing types, like text + number"], ["<code>ValueError</code>", "int() was given text like \"abc\""], ["<code>IndexError</code>", "a list position that doesn't exist"], ["<code>KeyError</code>", "a dictionary key that doesn't exist"]],
      why: "Learning these five by heart makes most crashes a 30-second fix." },
    { type: "mcq", q: "Which error does this give?", code: `prices = {"tea": 15}
print(prices["coffee"])`, options: ["NameError", "KeyError", "IndexError", "ValueError"], answer: 1,
      why: "The dictionary exists, but the key <code>\"coffee\"</code> doesn't. That's a KeyError. A NameError would mean <code>prices</code> itself didn't exist." },
    { type: "spot", q: "This crashes with <code>ZeroDivisionError</code> on line 2. But <code>average()</code> itself is fine. Tap the line that really needs fixing.", code: `def average(prices):
    return sum(prices) / len(prices)

prices = [40, 60, 80]
cheap = []
for p in prices:
    if p < 30:
        cheap.append(p)
print("Average cheap price:", average(cheap))`, answer: 9,
      why: "The traceback's last line shows where it broke, but the lines above show who called it. Line 9 passes an empty list. Check <code>if cheap:</code> before calling." },
    { type: "trace", q: "This should find the average of the four days but prints 23.5. Trace <code>i</code> and <code>total</code> after each lap to see what's missing.", code: `temps = [31, 33, 30, 35]
total = 0
for i in range(len(temps) - 1):
    total += temps[i]
print(total / len(temps))`, vars: ["i", "total"], rows: [[0, 31], [1, 64], [2, 94]],
      check: `temps = [31, 33, 30, 35]
total = 0
for i in range(len(temps) - 1):
    total += temps[i]
    print(i, total)`,
      why: "The loop only runs 3 times, so day 4 (35) is never added. <code>range(len(temps) - 1)</code> stops one too early: it should be <code>range(len(temps))</code>." }
  ],
  code: {
    brief: "The cave's inventory report has <b>three bugs</b>. Run it, read each error, and fix them one at a time. What it should do:<br>• <code>total_value(items)</code> returns the total of quantity × price for all items.<br>• <code>low_stock(items, limit)</code> returns the names of items with quantity <b>at or below</b> the limit.<br>• <code>report(items)</code> prints three lines, as in the example.",
    sample: "Items: 3\nValue: Rs 410\nLow stock: torch, rope",
    starter: `def total_value(items):
    total = 0
    for name, qty, price in items:
        total = qty * price
    return total


def low_stock(items, limit):
    result = []
    for name, qty, price in items:
        if qty < limit:
            result.append(name)
    return result


def report(items):
    print("Items: " + len(items))
    print(f"Value: Rs {total_value(items)}")
    print("Low stock: " + ", ".join(low_stock(items, 5)))


cave = [("torch", 2, 50), ("rope", 5, 30), ("lantern", 8, 20)]
report(cave)
`,
    tests: [
      { call: "total_value([('torch', 2, 50), ('rope', 5, 30), ('lantern', 8, 20)])", expect: "410" },
      { call: "total_value([])", expect: "0" },
      { call: "low_stock([('torch', 2, 50), ('rope', 5, 30), ('lantern', 8, 20)], 5)", expect: "['torch', 'rope']" },
      { call: "low_stock([('gem', 1, 900)], 0)", expect: "[]" },
      { call: "report([('torch', 2, 50), ('rope', 5, 30), ('lantern', 8, 20)])", out: ["Items: 3", "Value: Rs 410", "Low stock: torch, rope"], label: "Calls <code>report(cave)</code> and reads what it prints" },
      { call: "report([('gem', 9, 100), ('map', 1, 5)])", out: ["Items: 2", "Value: Rs 905", "Low stock: map"], label: "Calls <code>report()</code> with a different inventory" }
    ],
    hints: [
      "Run it and read the last line of the error: what type is it, and which line? Fix that one, run again, then compare each printed line with the example.",
      "The crash is a TypeError on the <code>Items</code> line: text + number. Convert the number, or use an f-string.",
      "Then check the numbers. <code>total = qty * price</code> <i>replaces</i> the total every lap. What should it do instead?",
      "\"At or below\" the limit includes the limit itself. Which comparison is that?"
    ],
    solution: `def total_value(items):
    total = 0
    for name, qty, price in items:
        total += qty * price
    return total


def low_stock(items, limit):
    result = []
    for name, qty, price in items:
        if qty <= limit:
            result.append(name)
    return result


def report(items):
    print(f"Items: {len(items)}")
    print(f"Value: Rs {total_value(items)}")
    print("Low stock: " + ", ".join(low_stock(items, 5)))


cave = [("torch", 2, 50), ("rope", 5, 30), ("lantern", 8, 20)]
report(cave)`,
    wrong: [{ code: `def total_value(items):
    total = 0
    for name, qty, price in items:
        total += qty * price
    return total

def low_stock(items, limit):
    result = []
    for name, qty, price in items:
        if qty < limit:
            result.append(name)
    return result

def report(items):
    print(f"Items: {len(items)}")
    print(f"Value: Rs {total_value(items)}")
    print("Low stock: " + ", ".join(low_stock(items, 5)))`, why: "boundary bug left in" }]
  },
  bug: {
    brief: "No crash this time, just a wrong answer: the average of these four days should be <b>32.25</b>, but it prints 8.75. Add a <code>print()</code> inside the loop to watch <code>total</code>, then fix it.",
    code: `temps = [31, 33, 30, 35]
for t in temps:
    total = 0
    total += t
print(f"Average: {total / len(temps)}")`,
    tests: [{ in: [], out: ["Average: 32.25"] }],
    mustNot: [["32\\.25", "Don't type the answer. Fix the loop so Python works it out."]], mustNotAll: true,
    hints: ["Print <code>total</code> inside the loop. Does it ever grow past one day's temperature?", "<code>total = 0</code> runs on every lap and wipes the sum. Move it above the loop."],
    fix: `temps = [31, 33, 30, 35]
total = 0
for t in temps:
    total += t
print(f"Average: {total / len(temps)}")`,
    lesson: "Set up the total once, before the loop. When a value never grows, print it inside the loop to see why."
  },
  explain: "Describe the debugging loop in your own words. Which step do beginners most often skip, and why does it matter?",
  cards: [
    { q: "Where's the most useful line of a traceback?", options: ["The first", "The last", "The one with \"File\"", "None of them"], answer: 1 },
    { q: "<code>int(\"abc\")</code> raises…", options: ["TypeError", "ValueError", "NameError", "SyntaxError"], answer: 1 },
    { q: "A bug gives no error, just a wrong answer. Best first move?", options: ["Rewrite everything", "Print values in the middle", "Ask someone to fix it", "Add more code"], answer: 1 }
  ],
  skills: { python: 2, logic: 2, debug: 5, talk: 2 }
},
/* ───────────────────────────── 3-2 ───────────────────────────── */
{
  id: "3-2", world: 3, n: 2, title: "Safety Nets", concept: "try / except",
  learn: [
    { h: "Catch an error instead of crashing",
      p: "Put risky code in a <code>try</code> block. If it raises an error, Python jumps to the matching <code>except</code> block instead of crashing. Always name the error you expect, here <code>ValueError</code>, so other bugs aren't hidden.",
      inputs: ["twenty"],
      code: `text = input("How many cups of chai? ")
try:
    cups = int(text)
    print("Brewing", cups, "cups")
except ValueError:
    print("That's not a whole number:", text)` },
    { h: "Keep asking until it's valid",
      p: "Put the try inside a <code>while True</code> loop. If the conversion works, <code>break</code> out. If not, the except block prints a message and the loop asks again. This is the standard way to read numbers from users.",
      inputs: ["ten", "4.5", "12"],
      code: `while True:
    try:
        age = int(input("Age? "))
        break
    except ValueError:
        print("Please type a whole number.")
print("Thanks! Next year you'll be", age + 1)` },
    { h: "Several excepts, else and finally",
      p: "You can catch different errors differently. <code>else</code> runs only if nothing went wrong, and <code>finally</code> runs <b>no matter what</b>, which is useful for cleanup. Keep the <code>try</code> block small, so you know which line can fail. <code>{each:.2f}</code> inside an f-string shows the number with 2 decimal places.",
      code: `def share(total, people):
    try:
        each = total / people
    except ZeroDivisionError:
        print("Nobody to share with!")
    except TypeError:
        print("Both values must be numbers.")
    else:
        print(f"Each gets {each:.2f}")
    finally:
        print("-- done --")

share(100, 3)
share(100, 0)
share("100", 4)` },
    { h: "Don't catch everything",
      p: "A bare <code>except:</code> (with no error name) or <code>except Exception: pass</code> catches <i>every</i> error, including your own typos. The program then fails silently and you have no idea why. Only catch errors you know how to handle.",
      code: `try:
    total = 10 + int("5")
    print(totl)          # a typo!
except ValueError:
    print("Bad number")  # this doesn't hide the NameError, which is good` , err: true }
  ],
  think: [
    { type: "predict", q: "What does this print?", code: `try:
    print("A")
    x = int("7a")
    print("B")
except ValueError:
    print("C")
print("D")`, answer: "A\nC\nD",
      why: "A prints. Then <code>int(\"7a\")</code> fails, so Python jumps straight to except, skipping B. After the except, the program carries on with D." },
    { type: "mcq", q: "When does a <code>finally</code> block run?", options: ["Only if there was an error", "Only if there was no error", "Always", "Never, it's just a comment"], answer: 2,
      why: "<code>finally</code> always runs, error or not. It's for cleanup, like closing a file." },
    { type: "mcq", q: "What's wrong with this?", code: `try:
    age = int(input("Age? "))
except:
    print("Please type a number.")`, options: ["Nothing", "It catches every error, so typos and other bugs get hidden", "except must come before try", "int() can't fail"], answer: 1,
      why: "A bare <code>except:</code> catches everything, even a NameError from a typo, and shows the wrong message. Write <code>except ValueError:</code>." },
    { type: "fill", q: "Fill the blanks so a bad answer is caught and the loop asks again.", code: `while True:
    ___:
        n = int(input("Number? "))
        ___
    except ___:
        print("Try again")
print(n * 2)`, inputs: ["x", "21"], answers: ["try", "break", "ValueError"], expect: ["Try again", "42"],
      why: "The try block holds the risky conversion and breaks out when it works. <code>except ValueError</code> catches only bad numbers." }
  ],
  code: {
    brief: "Write a bill splitter that never crashes.<br>• Ask <code>Bill? </code> until it gets a number above 0. If the text isn't a number, print <code>That's not a number.</code> If it's 0 or less, print <code>The bill must be more than 0.</code><br>• Then ask <code>People? </code> until it gets a whole number of at least 1. Not a whole number: <code>That's not a whole number.</code> Less than 1: <code>Need at least 1 person.</code><br>• Print <code>Each pays Rs </code> and the share with 2 decimal places, using <code>f\"{x:.2f}\"</code>.<br>The bill can have decimals, so use <code>float()</code> for it.",
    sample: "Bill? abc\nThat's not a number.\nBill? 1000\nPeople? 0\nNeed at least 1 person.\nPeople? 3\nEach pays Rs 333.33",
    starter: `# 1. Keep asking for the bill until it's a number above 0

# 2. Keep asking for the people until it's a whole number, at least 1

# 3. Print the share
`,
    tests: [
      { in: ["abc", "1000", "0", "3"], out: ["That's not a number.", "Need at least 1 person.", "Each pays Rs 333.33"], only: true, inOrder: true },
      { in: ["-50", "0", "250.5", "two", "2.5", "2"], out: ["The bill must be more than 0.", "The bill must be more than 0.", "That's not a whole number.", "That's not a whole number.", "Each pays Rs 125.25"], only: true, inOrder: true },
      { in: ["99", "1"], out: ["Each pays Rs 99.00"], only: true },
      { in: ["80", "-2", "4"], out: ["Need at least 1 person.", "Each pays Rs 20.00"], only: true, inOrder: true }
    ],
    must: [["\\btry\\s*:", "Use <code>try</code> / <code>except</code> to catch bad input."], ["except\\s*\\(?[\\w\\s,]*ValueError", "Catch the specific error: <code>except ValueError:</code>."]],
    mustNot: [["except\\s*:", "Don't use a bare <code>except:</code>. Name the error you expect."], ["except\\s+(Base)?Exception\\b", "<code>except Exception</code> still catches almost everything. Name the error you expect: <code>except ValueError:</code>."]],
    mustNotAll: true,
    hints: [
      "Start with the bill: <code>while True:</code>, then <code>try: bill = float(input(\"Bill? \"))</code> and <code>except ValueError:</code> to print the not-a-number message.",
      "In the <code>except</code> block, after the message, add <code>continue</code> so the loop asks again. Without it, the next line uses <code>bill</code>, which doesn't exist yet. After the try/except: <code>if bill &lt;= 0:</code> print the message, <code>else: break</code>.",
      "The people loop is the same shape with <code>int()</code>. Finally: <code>print(f\"Each pays Rs {bill / people:.2f}\")</code>."
    ],
    solution: `while True:
    try:
        bill = float(input("Bill? "))
    except ValueError:
        print("That's not a number.")
        continue
    if bill <= 0:
        print("The bill must be more than 0.")
    else:
        break

while True:
    try:
        people = int(input("People? "))
    except ValueError:
        print("That's not a whole number.")
        continue
    if people < 1:
        print("Need at least 1 person.")
    else:
        break

print(f"Each pays Rs {bill / people:.2f}")`,
    alts: [`def ask_number(prompt, convert, bad_type, too_small, minimum):
    while True:
        try:
            value = convert(input(prompt))
            if value < minimum:
                print(too_small)
            else:
                return value
        except ValueError:
            print(bad_type)

bill = ask_number("Bill? ", float, "That's not a number.", "The bill must be more than 0.", 0.01)
people = ask_number("People? ", int, "That's not a whole number.", "Need at least 1 person.", 1)
print("Each pays Rs %.2f" % (bill / people))`],
    wrong: [{ code: `bill = float(input("Bill? "))
people = int(input("People? "))
print(f"Each pays Rs {bill / people:.2f}")`, why: "no validation" }]
  },
  bug: {
    brief: "When you type a valid age, this program still says <code>Please type a number.</code> and asks again, forever. The bare <code>except:</code> is hiding the real error. Make the except specific, then read what the real error is.",
    code: `while True:
    try:
        age = int(input("Age? "))
        print(f"Next year you'll be {age + 1}")
        brek
    except:
        print("Please type a number.")`,
    tests: [{ in: ["x", "20"], out: ["Please type a number.", "Next year you'll be 21"], only: true, inOrder: true }, { in: ["7"], out: ["Next year you'll be 8"], only: true }],
    mustNot: [["except\\s*:", "Keep looking: a bare <code>except:</code> still hides errors. Name the error you expect."], ["except\\s+(Base)?Exception\\b", "<code>except Exception</code> still hides almost everything. Name the error you expect."]],
    mustNotAll: true,
    hints: ["Change <code>except:</code> to <code>except ValueError:</code> and run it with a valid age. Now Python shows the real error.", "NameError: <code>brek</code>. What keyword did they mean?"],
    fix: `while True:
    try:
        age = int(input("Age? "))
        print(f"Next year you'll be {age + 1}")
        break
    except ValueError:
        print("Please type a number.")`,
    lesson: "A bare except turned a one-letter typo into an endless loop. Catch only the errors you expect."
  },
  explain: "Why is <code>except ValueError:</code> better than a bare <code>except:</code>? Use the typo bug as your example.",
  cards: [
    { q: "What runs if the try block has no error?", options: ["except", "else (and finally)", "Nothing", "The whole try again"], answer: 1 },
    { q: "Which error does <code>float(\"12,5\")</code> raise?", options: ["TypeError", "ValueError", "KeyError", "None"], answer: 1 },
    { q: "Why keep a try block small?", options: ["It's faster", "So you know which line can fail", "Python limits it", "To save memory"], answer: 1 }
  ],
  skills: { python: 3, logic: 2, debug: 4, talk: 2 }
},
/* ───────────────────────────── 3-3 ───────────────────────────── */
{
  id: "3-3", world: 3, n: 3, title: "Raising Alarms", concept: "raise and validating input",
  learn: [
    { h: "raise: refuse bad input",
      p: "Your own functions can raise errors too. When a function gets a value it can't work with, <code>raise ValueError(\"a clear message\")</code> stops it straight away and tells the caller exactly what was wrong. This is better than returning a wrong answer quietly.",
      code: `def set_volume(level):
    if level < 0 or level > 10:
        raise ValueError(f"Volume must be 0 to 10, got {level}")
    return level

print(set_volume(7))
try:
    set_volume(15)
except ValueError as e:
    print("Refused:", e)` },
    { h: "Read the message with as",
      p: "<code>except ValueError as e:</code> stores the error in <code>e</code>. Printing it shows the message. That way the person using the program learns <i>why</i> it failed, not just <i>that</i> it failed.",
      code: `for text in ["42", "forty"]:
    try:
        n = int(text)
        print("Got", n)
    except ValueError as e:
        print("Problem:", e)` },
    { h: "Validate early: guard clauses",
      p: "Check the inputs at the very top of a function and raise if they're bad. These checks are called <b>guard clauses</b>. The rest of the function can then trust its inputs, which keeps it simple.",
      code: `def book_seats(available, wanted):
    if wanted <= 0:
        raise ValueError("Book at least 1 seat")
    if wanted > available:
        raise ValueError(f"Only {available} seats left")
    return available - wanted

print(book_seats(10, 3))
for wanted in [0, 20]:
    try:
        book_seats(10, wanted)
    except ValueError as e:
        print(e)` },
    { h: "Raise vs return",
      p: "<code>return</code> hands back a normal answer. <code>raise</code> says \"something is wrong, stop\". Returning an error message as a string is a common mistake: the caller can't tell it apart from a real answer, and it may crash later in a confusing place.",
      code: `def bad_divide(a, b):
    if b == 0:
        return "Error: can't divide by zero"   # looks like an answer
    return a / b

result = bad_divide(10, 0)
print("Half of the result is...")
try:
    print(result / 2)
except TypeError as e:
    print("Crashed far from the real problem:", e)` }
  ],
  think: [
    { type: "predict", q: "What does this print?", code: `def check(age):
    if age < 0:
        raise ValueError("negative age")
    return "ok"

for a in [5, -1, 9]:
    try:
        print(check(a))
    except ValueError as e:
        print("error:", e)`, answer: "ok\nerror: negative age\nok",
      why: "For -1 the function raises, so the except prints the message. The loop then carries on with 9." },
    { type: "mcq", q: "Which line correctly signals a bad value?", options: ["return ValueError(\"bad\")", "raise ValueError(\"bad\")", "raise \"bad\"", "print(ValueError)"], answer: 1,
      why: "<code>raise</code> plus an error object. Returning the error object doesn't raise anything, and you can't raise a plain string." },
    { type: "refute", q: "This function should only accept PIN codes that are exactly 4 digits. Find an input it wrongly accepts.", fn: "is_valid_pin", args: 1, example: "\"1234\"",
      code: `def is_valid_pin(pin):
    return len(pin) == 4`,
      ref: `def is_valid_pin(pin):
    return len(pin) == 4 and pin.isdigit()`,
      answer: "\"abcd\"", safe: ["\"1234\"", "\"123\""],
      why: "It checks the length but not that every character is a digit, so <code>\"abcd\"</code> or <code>\"12a4\"</code> sneak through. Finding an input that breaks code is exactly how testers think." }
  ],
  code: {
    brief: "Write two careful functions for a bank app. They <b>return</b> answers and <b>raise</b> <code>ValueError</code> for bad input.<br>• <code>withdraw(balance, amount)</code> returns the new balance. If amount is 0 or less, raise <code>ValueError(\"Amount must be positive\")</code>. If amount is more than the balance, raise <code>ValueError(\"Insufficient funds\")</code>.<br>• <code>parse_age(text)</code> turns text into an int age. Spaces around the number are fine. If the text isn't a whole number (like <code>\"abc\"</code> or <code>\"12.5\"</code>), raise <code>ValueError</code>: <code>int()</code> already does this for you. If the number is below 0 or above 150, raise <code>ValueError(\"Age must be between 0 and 150\")</code>. 0 and 150 are both allowed.",
    sample: ">>> withdraw(100, 30)\n70\n>>> withdraw(50, 80)\nValueError: Insufficient funds\n>>> parse_age(\" 30 \")\n30",
    starter: `def withdraw(balance, amount):
    pass


def parse_age(text):
    pass
`,
    tests: [
      { call: "withdraw(100, 30)", expect: "70", silent: true },
      { call: "withdraw(100, 100)", expect: "0" },
      { call: "withdraw(100, 0)", raises: "ValueError", raisesMsg: "positive" },
      { call: "withdraw(100, -5)", raises: "ValueError", raisesMsg: "positive" },
      { call: "withdraw(50, 80)", raises: "ValueError", raisesMsg: "insufficient" },
      { call: "parse_age('25')", expect: "25", silent: true },
      { call: "parse_age(' 30 ')", expect: "30" },
      { call: "parse_age('0')", expect: "0" },
      { call: "parse_age('abc')", raises: "ValueError" },
      { call: "parse_age('151')", raises: "ValueError", raisesMsg: "between 0 and 150" },
      { call: "parse_age('-3')", raises: "ValueError", raisesMsg: "between 0 and 150" },
      { call: "parse_age('150')", expect: "150" },
      { call: "parse_age('12.5')", raises: "ValueError" },
      { call: "withdraw(75, 20)", expect: "55" }
    ],
    fuzz: { n: 6, what: "random balances and ages", gen: (r, i) => { if (i % 2) return { call: "parse_age('" + r.int(0, 150) + "')" }; const b = r.int(1, 900); return { call: "withdraw(" + b + ", " + r.int(1, b) + ")" }; } },
    must: [["\\braise\\s+ValueError", "Use <code>raise ValueError(...)</code> to refuse bad input."]],
    hints: [
      "Guard clauses first: <code>if amount &lt;= 0: raise ValueError(\"Amount must be positive\")</code>. Then the insufficient-funds check. Then return.",
      "<code>int(text)</code> already raises ValueError for text like \"abc\", and it ignores spaces around the number. You don't need to catch it: let it go up to the caller.",
      "After converting: <code>if age &lt; 0 or age &gt; 150: raise ValueError(\"Age must be between 0 and 150\")</code>."
    ],
    solution: `def withdraw(balance, amount):
    if amount <= 0:
        raise ValueError("Amount must be positive")
    if amount > balance:
        raise ValueError("Insufficient funds")
    return balance - amount


def parse_age(text):
    age = int(text)
    if age < 0 or age > 150:
        raise ValueError("Age must be between 0 and 150")
    return age`,
    wrong: [{ code: `def withdraw(balance, amount):
    if amount > balance:
        return "Insufficient funds"
    return balance - amount

def parse_age(text):
    return int(text)`, why: "returns messages instead of raising" }]
  },
  bug: {
    brief: "<code>set_speed(-20)</code> should raise a ValueError, but the test says nothing was raised. The function creates an error object but doesn't do anything with it.",
    code: `def set_speed(kmh):
    if kmh < 0:
        return ValueError("Speed can't be negative")
    return kmh

print(set_speed(60))
try:
    set_speed(-20)
    print("No error was raised!")
except ValueError as e:
    print("Refused:", e)`,
    tests: [{ call: "set_speed(60)", expect: "60" }, { call: "set_speed(-20)", raises: "ValueError" }],
    hints: ["Look at line 3. Is the error being raised, or just handed back like a normal answer?"],
    fix: `def set_speed(kmh):
    if kmh < 0:
        raise ValueError("Speed can't be negative")
    return kmh

print(set_speed(60))`,
    lesson: "<code>return ValueError(...)</code> hands back an object. <code>raise ValueError(...)</code> actually signals the error."
  },
  explain: "When should a function <code>raise</code> an error instead of returning a value? Use <code>withdraw</code> as your example.",
  cards: [
    { q: "What does <code>except ValueError as e:</code> give you in e?", options: ["The line number", "The error, including its message", "The input", "True"], answer: 1 },
    { q: "A guard clause is…", options: ["A comment", "A check at the top of a function that rejects bad input", "A try block", "A loop"], answer: 1 },
    { q: "Which is correct?", options: ["raise \"bad\"", "raise ValueError(\"bad\")", "return raise ValueError", "except raise"], answer: 1 }
  ],
  skills: { python: 3, logic: 2, debug: 3, talk: 2, test: 1 }
},
/* ───────────────────────────── 3-4 ───────────────────────────── */
{
  id: "3-4", world: 3, n: 4, title: "Scrolls of the Cave", concept: "reading files",
  learn: [
    { h: "Open a file and read it",
      p: "<code>open(\"name.txt\")</code> opens a file for reading. Use it with <code>with</code>, which closes the file for you when the block ends, even if there's an error. <code>.read()</code> gives the whole file as one string. The practice file below the editor shows what's inside.",
      files: { "spells.txt": "Lumos\nAlohomora\nExpelliarmus\n" },
      code: `with open("spells.txt") as f:
    text = f.read()
print(text)
print(len(text), "characters")` },
    { h: "Read line by line",
      p: "Looping over a file gives one line at a time. Each line ends with an invisible newline character <code>\\n</code>, so <code>\"Lumos\\n\" == \"Lumos\"</code> is False. Use <code>.strip()</code> to remove it, along with any spaces at the ends.",
      files: { "spells.txt": "Lumos\nAlohomora\nExpelliarmus\n" },
      code: `with open("spells.txt") as f:
    for line in f:
        print(repr(line), "->", repr(line.strip()))` },
    { h: "Lines with fields",
      p: "Data files often have several fields per line, separated by commas. <code>line.strip().split(\",\")</code> turns one line into a list of fields. This is the idea behind CSV files, which every company uses.",
      files: { "team.txt": "Asha,Pune,82\nRavi,Delhi,67\n" },
      code: `with open("team.txt") as f:
    for line in f:
        name, city, score = line.strip().split(",")
        print(f"{name} from {city} scored {int(score)}")` },
    { h: "When the file isn't there",
      p: "Opening a file that doesn't exist raises <code>FileNotFoundError</code>. Catch it to show a friendly message. Real programs also skip blank or broken lines instead of crashing on them.",
      code: `try:
    with open("missing.txt") as f:
        print(f.read())
except FileNotFoundError:
    print("No file yet. Create one first!")` },
    { h: "Files on your own computer",
      p: "On your computer, <code>open(\"scores.txt\")</code> looks in the folder your terminal is in, not always the folder of your .py file. If you get FileNotFoundError but the file is there, open the project folder in VS Code, or <code>cd</code> into it first. If a file has Hindi text or emoji, add <code>encoding=\"utf-8\"</code>: Windows doesn't use it by default. In paths, write <code>\"C:/data/new.txt\"</code> with forward slashes, because inside a string <code>\\n</code> means a new line.",
      files: { "names.txt": "आशा\nरवि\n" },
      code: `with open("names.txt", encoding="utf-8") as f:
    print(f.read())` }
  ],
  think: [
    { type: "mcq", q: "A file line is read as <code>\"Asha\\n\"</code>. Why is <code>line == \"Asha\"</code> False?", options: ["Files are always uppercase", "The line still has its newline character at the end", "== doesn't work on text", "The file is closed"], answer: 1,
      why: "Each line keeps its <code>\\n</code>. Use <code>line.strip() == \"Asha\"</code>." },
    { type: "predict", q: "<code>data.txt</code> contains three lines: <code>5</code>, <code>10</code> and <code>x</code>. What does this print?", files: { "data.txt": "5\n10\nx\n" }, code: `total = 0
with open("data.txt") as f:
    for line in f:
        try:
            total += int(line)
        except ValueError:
            print("skip", line.strip())
print(total)`, answer: "skip x\n15",
      why: "<code>int()</code> ignores the newline around numbers, so 5 and 10 add up to 15. <code>\"x\"</code> can't be converted, so it's skipped." },
    { type: "predict", q: "<code>spells.txt</code> has two lines, Lumos and Alohomora. What does this print?", files: { "spells.txt": "Lumos\nAlohomora\n" }, code: `with open("spells.txt") as f:
    first = f.read()
    second = f.read()
print(len(first), len(second))`, answer: "16 0",
      why: "After the first <code>read()</code>, Python is at the end of the file, so the second read gets empty text. Read once and keep it in a variable." },
    { type: "order", indent: true, q: "Build a program that prints each name in <code>names.txt</code> in capitals.",
      lines: ["with open(\"names.txt\") as f:", "    for line in f:", "        name = line.strip()", "        print(name.upper())"],
      files: { "names.txt": "asha\nravi\n" },
      why: "Open the file, loop over its lines, clean each line, then use it. Everything that uses <code>f</code> stays indented inside the <code>with</code>." }
  ],
  code: {
    brief: "Read <code>scores.txt</code>. A good line has exactly two parts: a name and a whole number, like <code>Asha,82</code>. Go through the file from top to bottom and print:<br>• For each good line: <code>Asha: 82</code><br>• For any other line: <code>Skipped bad line: </code> and the line, with spaces removed from the ends. Skip blank lines without printing anything.<br>• After the last line: <code>Average: </code> with 1 decimal place, then <code>Top: Asha (82)</code>. If two people share the top score, show the one that comes first.<br>• If there are no good lines, print only <code>No scores found.</code> instead of the average and top.<br>• If the file doesn't exist, print <code>scores.txt is missing.</code>",
    sample: "Asha: 82\nRavi: 67\nSkipped bad line: Meera,abc\nAverage: 74.5\nTop: Asha (82)",
    files: { "scores.txt": "Asha,82\nRavi,67\nMeera,abc\n" },
    starter: `# Read scores.txt, print each score, then the average and the top scorer
`,
    tests: [
      { files: { "scores.txt": "Asha,82\nRavi,67\nMeera,abc\n" }, out: ["Asha: 82", "Ravi: 67", "Skipped bad line: Meera,abc", "Average: 74.5", "Top: Asha (82)"], only: true, inOrder: true, label: "With the practice file" },
      { files: { "scores.txt": "Kiran,90\n\nZoya,95\nVik,95\nbad line\nOm,40,extra\n" }, out: ["Kiran: 90", "Zoya: 95", "Vik: 95", "Skipped bad line: bad line", "Skipped bad line: Om,40,extra", "Average: 93.3", "Top: Zoya (95)"], only: true, inOrder: true, label: "With blank lines, a tie and bad lines" },
      { files: { "scores.txt": "oops\n" }, out: ["Skipped bad line: oops", "No scores found."], only: true, label: "With no good lines" },
      { files: null, out: ["scores.txt is missing."], only: true, label: "When the file doesn't exist" }
    ],
    fuzz: { n: 6, what: "random score files", gen: (r) => ({ files: { "scores.txt": Array.from({ length: r.int(1, 7) }, () => r.pick(["Asha", "Ravi", "Meera", "Om"]) + "," + r.pick([String(r.int(0, 100)), String(r.int(0, 100)), "x"])).join("\n") + "\n" } }) },
    must: [["open\\(", "Open the file with <code>open()</code>."], ["FileNotFoundError", "Handle a missing file with <code>except FileNotFoundError:</code>."]],
    hints: [
      "Wrap the whole read in <code>try:</code> … <code>except FileNotFoundError:</code>. Inside, loop over the lines and <code>strip()</code> each one. Skip it with <code>continue</code> if it's empty.",
      "Split with <code>parts = line.split(\",\")</code>. A good line has <code>len(parts) == 2</code> and <code>parts[1].isdigit()</code>. Otherwise print the skipped message.",
      "Keep a list of (name, score) pairs. After the loop, use <code>sum</code> and <code>len</code> for the average (<code>f\"{avg:.1f}\"</code>), and the best-so-far pattern for the top."
    ],
    solution: `try:
    good = []
    with open("scores.txt") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            parts = line.split(",")
            if len(parts) != 2 or not parts[1].isdigit():
                print(f"Skipped bad line: {line}")
                continue
            name, score = parts[0], int(parts[1])
            print(f"{name}: {score}")
            good.append((name, score))
    if not good:
        print("No scores found.")
    else:
        total = 0
        for name, score in good:
            total += score
        print(f"Average: {total / len(good):.1f}")
        top_name, top = good[0]
        for name, score in good:
            if score > top:
                top_name, top = name, score
        print(f"Top: {top_name} ({top})")
except FileNotFoundError:
    print("scores.txt is missing.")`,
    wrong: [{ code: `with open("scores.txt") as f:
    good = []
    for line in f:
        name, score = line.strip().split(",")
        print(f"{name}: {score}")
        good.append(int(score))
print(f"Average: {sum(good) / len(good):.1f}")`, why: "crashes on bad lines and missing file" }]
  },
  bug: {
    brief: "The guard should let Asha in, because her name is in <code>guests.txt</code>. But it says <code>Not on the list</code> for everyone. Print <code>repr(line)</code> inside the loop to see what the lines really look like.",
    files: { "guests.txt": "Ravi\nAsha\nMeera\n" },
    code: `name = "Asha"
found = False
with open("guests.txt") as f:
    for line in f:
        if line == name:
            found = True
print("Welcome!" if found else "Not on the list")`,
    tests: [{ files: { "guests.txt": "Ravi\nAsha\nMeera\n" }, out: ["Welcome!"], only: true }, { files: { "guests.txt": "Ravi\nAshan\n" }, out: ["Not on the list"], only: true },
      { files: { "guests.txt": "Ravi\nAsha" }, out: ["Welcome!"], only: true, label: "Asha is the last line, with no newline after it" }],
    hints: ["<code>repr(line)</code> shows <code>'Asha\\n'</code>. What removes that newline?"],
    fix: `name = "Asha"
found = False
with open("guests.txt") as f:
    for line in f:
        if line.strip() == name:
            found = True
print("Welcome!" if found else "Not on the list")`,
    lesson: "Lines from files keep their newline. <code>.strip()</code> them before comparing."
  },
  explain: "Why do we use <code>with open(...) as f:</code> instead of just <code>f = open(...)</code>? And why <code>.strip()</code> each line?",
  cards: [
    { q: "What does looping over an open file give you?", options: ["Words", "Characters", "Lines", "The whole file"], answer: 2 },
    { q: "Opening a file that doesn't exist raises…", options: ["ValueError", "KeyError", "FileNotFoundError", "Nothing"], answer: 2 },
    { q: "What does <code>with</code> do for a file?", options: ["Makes it faster", "Closes it automatically", "Deletes it after", "Reads it twice"], answer: 1 }
  ],
  skills: { python: 3, logic: 3, debug: 2, talk: 2 }
},
/* ───────────────────────────── 3-5 ───────────────────────────── */
{
  id: "3-5", world: 3, n: 5, title: "Ink and Quill", concept: "writing files",
  learn: [
    { h: "\"w\" writes a new file",
      p: "Open with mode <code>\"w\"</code> to write. <b>Careful:</b> if the file already exists, <code>\"w\"</code> empties it first. <code>.write()</code> doesn't add a newline, so put <code>\\n</code> at the end of each line yourself. Run this, then look at the practice files below.",
      code: `with open("todo.txt", "w") as f:
    f.write("Learn files\\n")
    f.write("Build the quiz\\n")
print("Saved!")
with open("todo.txt") as f:
    print(f.read())` },
    { h: "\"a\" appends to the end",
      p: "Mode <code>\"a\"</code> keeps what's there and adds to the end. It's the right mode for logs, journals and high-score lists. If the file doesn't exist yet, both <code>\"w\"</code> and <code>\"a\"</code> create it.",
      code: `for day in ["Mon", "Tue", "Wed"]:
    with open("log.txt", "a") as f:
        f.write(f"{day}: practised\\n")
with open("log.txt") as f:
    print(f.read())` },
    { h: "Write many lines from a list",
      p: "Loop over your data and write one line per item. Open the file <b>once</b>, outside the loop, if you're writing it fresh: opening with \"w\" inside the loop would wipe it every lap.",
      code: `scores = {"Asha": 82, "Ravi": 67, "Meera": 91}
with open("report.txt", "w") as f:
    for name, score in scores.items():
        f.write(f"{name},{score}\\n")
with open("report.txt") as f:
    print(f.read())` },
    { h: "Files make data last",
      p: "Variables vanish when a program ends. Files don't. That's how apps remember things between runs. Here, Run keeps the practice files, so press Run a few times and watch the count grow. Press Reset to start fresh.",
      code: `try:
    with open("visits.txt") as f:
        visits = int(f.read())
except FileNotFoundError:
    visits = 0
visits += 1
with open("visits.txt", "w") as f:
    f.write(str(visits))
print("You've run this program", visits, "times")` }
  ],
  think: [
    { type: "mcq", q: "<code>notes.txt</code> has 10 lines. You run this. How many lines does it have now?", code: `with open("notes.txt", "w") as f:
    f.write("New note\\n")`, options: ["11", "10", "1", "0"], answer: 2,
      why: "Mode \"w\" empties the file before writing, so only the new line is left. To keep the old lines, use \"a\"." },
    { type: "predict", q: "What does this print?", code: `with open("out.txt", "w") as f:
    f.write("a")
    f.write("b")
    f.write("c\\n")
with open("out.txt") as f:
    print(f.readlines())`, answer: "['abc\\n']",
      why: "<code>.write()</code> adds no newline of its own, so a, b and c end up on one line. (<code>readlines()</code> gives a list with one string per line.)" },
    { type: "multi", q: "Which are good reasons to use mode <code>\"a\"</code>?", options: ["Keeping a log of every run", "Saving high scores without losing old ones", "Writing a fresh report each day", "Reading a file"], answer: [0, 1],
      why: "Append adds to what's there. A fresh daily report should use \"w\", and reading uses \"r\" (the default)." }
  ],
  code: {
    brief: "Make a learning journal stored in <code>journal.txt</code>.<br>• <code>add_entry(date, text)</code> adds a line <code>date | text</code> to the end of the file, keeping old entries.<br>• <code>count_entries()</code> returns how many non-empty lines the file has, or 0 if it doesn't exist.<br>• <code>last_entry()</code> returns the last non-empty line, stripped, or <code>None</code> if there isn't one.",
    sample: ">>> add_entry(\"2026-10-01\", \"Started World 3\")\n>>> count_entries()\n1\n>>> last_entry()\n'2026-10-01 | Started World 3'",
    files: { "journal.txt": "2026-09-30 | Finished Loop Forest\n" },
    starter: `def add_entry(date, text):
    pass


def count_entries():
    pass


def last_entry():
    pass
`,
    tests: [
      { files: null, setup: "add_entry('2026-10-01', 'Started World 3')\nadd_entry('2026-10-02', 'Fixed my first bug')", call: "count_entries()", expect: "2", fileOut: { "journal.txt": "2026-10-01 | Started World 3\n2026-10-02 | Fixed my first bug\n" }, label: "Two entries in a new journal" },
      { files: { "journal.txt": "2026-09-30 | Old entry\n" }, setup: "add_entry('2026-10-01', 'New one')", call: "last_entry()", expect: "'2026-10-01 | New one'", fileOut: { "journal.txt": "2026-09-30 | Old entry\n2026-10-01 | New one\n" }, label: "Adding keeps old entries" },
      { files: { "journal.txt": "a | 1\n\nb | 2\n\n" }, call: "count_entries()", expect: "2", label: "Blank lines don't count" },
      { files: null, call: "count_entries()", expect: "0", label: "No journal yet: count" },
      { files: null, call: "last_entry()", expect: "None", label: "No journal yet: last entry" },
      { files: { "journal.txt": "a | 1\n\nb | 2\n\n" }, call: "last_entry()", expect: "'b | 2'", label: "Last entry skips blank lines" },
      { files: { "journal.txt": "" }, call: "last_entry()", expect: "None", label: "Empty journal: last entry" },
      { files: { "journal.txt": "x | 1\n" }, setup: "add_entry('d1', 'one')\nadd_entry('d2', 'two')\nadd_entry('d3', 'three')", call: "(count_entries(), last_entry())", expect: "(4, 'd3 | three')", label: "Three new entries" }
    ],
    must: [["[\"']a[\"']", "Open the journal in append mode, <code>\"a\"</code>, so old entries are kept."]],
    hints: [
      "<code>add_entry</code>: <code>with open(\"journal.txt\", \"a\") as f: f.write(f\"{date} | {text}\\n\")</code>",
      "For the other two, read the lines inside <code>try:</code> … <code>except FileNotFoundError:</code>. Keep only lines where <code>line.strip()</code> isn't empty.",
      "<code>last_entry</code>: if the list of non-empty lines is empty, return None. Otherwise return the last one, <code>lines[-1]</code>."
    ],
    solution: `def add_entry(date, text):
    with open("journal.txt", "a") as f:
        f.write(f"{date} | {text}\\n")


def read_entries():
    entries = []
    try:
        with open("journal.txt") as f:
            for line in f:
                if line.strip():
                    entries.append(line.strip())
    except FileNotFoundError:
        pass
    return entries


def count_entries():
    return len(read_entries())


def last_entry():
    entries = read_entries()
    if not entries:
        return None
    return entries[-1]`,
    wrong: [{ code: `def add_entry(date, text):
    with open("journal.txt", "w") as f:
        f.write(f"{date} | {text}\\n")

def count_entries():
    with open("journal.txt") as f:
        return len(f.readlines())

def last_entry():
    with open("journal.txt") as f:
        return f.readlines()[-1].strip()`, why: "overwrites, crashes when missing" }]
  },
  bug: {
    brief: "This should save the three players to <code>players.txt</code>, replacing anything left from earlier runs. But only the last one survives. Look at where the file is opened.",
    code: `players = ["Asha", "Ravi", "Meera"]
for p in players:
    with open("players.txt", "w") as f:
        f.write(p + "\\n")
with open("players.txt") as f:
    print(f.read())`,
    tests: [{ files: null, fileOut: { "players.txt": "Asha\nRavi\nMeera\n" } }, { files: { "players.txt": "Old Player\n" }, fileOut: { "players.txt": "Asha\nRavi\nMeera\n" }, label: "players.txt already exists from an earlier run" }],
    hints: ["Mode \"w\" empties the file every time it's opened, and it's opened on every lap. Open it once, before the loop."],
    fix: `players = ["Asha", "Ravi", "Meera"]
with open("players.txt", "w") as f:
    for p in players:
        f.write(p + "\\n")
with open("players.txt") as f:
    print(f.read())`,
    lesson: "Opening with \"w\" inside a loop wipes the file on every lap. Open once, then write in the loop."
  },
  explain: "Explain the difference between modes <code>\"w\"</code> and <code>\"a\"</code>, and give one real situation for each.",
  cards: [
    { q: "Which mode keeps existing content and adds to the end?", options: ["\"r\"", "\"w\"", "\"a\"", "\"x\""], answer: 2 },
    { q: "Does <code>f.write(\"hi\")</code> add a newline?", options: ["Yes", "No", "Only on Windows", "Only with \"a\""], answer: 1 },
    { q: "Why do apps save data in files?", options: ["It's faster than variables", "Variables vanish when the program ends", "Python requires it", "To hide it"], answer: 1 }
  ],
  skills: { python: 3, logic: 2, debug: 2, talk: 2 }
},
/* ───────────────────────────── 3-6 ───────────────────────────── */
{
  id: "3-6", world: 3, n: 6, title: "Borrowed Magic", concept: "modules and imports",
  learn: [
    { h: "import borrows code",
      p: "A <b>module</b> is a file of Python code you can use in your program. Python comes with hundreds. <code>import math</code> loads one, and you use its parts with a dot: <code>math.sqrt()</code>, <code>math.pi</code>.",
      code: `import math

print(math.sqrt(144))
print(round(math.pi, 4))
print(math.ceil(7 / 2), "buses needed for 7 kids, 2 per bus")` },
    { h: "random makes games",
      p: "The <code>random</code> module picks things by chance. <code>random.randint(1, 6)</code> includes both 1 and 6, unlike <code>range</code>. <code>random.choice(list)</code> picks one item. Run it a few times.",
      code: `import random

print("You rolled", random.randint(1, 6))
print("Today's snack:", random.choice(["samosa", "poha", "idli"]))
deck = ["A", "K", "Q", "J"]
random.shuffle(deck)
print(deck)` },
    { h: "from ... import ...",
      p: "<code>from math import sqrt</code> brings in just one name, so you can write <code>sqrt()</code> without <code>math.</code>. It's shorter, but with plain <code>import</code> it's clearer where each name came from.",
      code: `from random import randint, choice
from math import sqrt

print(randint(1, 100))
print(choice("ABCD"))
print(sqrt(2))` },
    { h: "Your own modules",
      p: "Any <code>.py</code> file is a module. Bigger programs are split into several files that import each other. This level has a practice module called <code>bestiary.py</code> (open it below the editor). Import it like any other module. And remember the <code>if __name__ == \"__main__\":</code> check from World 2: it stops a module's demo code from running when it's imported.",
      code: `import bestiary

print(len(bestiary.MONSTERS), "monsters known")
print(bestiary.describe(bestiary.MONSTERS[0]))` },
    { h: "Installing other people's modules",
      p: "Thousands of free modules live on <b>PyPI</b>. On Windows, install one with <code>py -m pip install requests</code> (plain <code>pip</code> sometimes isn't found). Real projects first make a <b>virtual environment</b>, a private box of modules for one project: <code>py -m venv .venv</code>, then <code>.venv\\Scripts\\activate</code>. Save the list with <code>pip freeze &gt; requirements.txt</code> so a teammate can install the same versions with <code>pip install -r requirements.txt</code>.",
      lang: "text", file: "a terminal on Windows",
      code: `> py -m venv .venv
> .venv\\Scripts\\activate
(.venv) > py -m pip install requests pytest
(.venv) > pip freeze > requirements.txt` }
  ],
  think: [
    { type: "mcq", q: "Which values can <code>random.randint(1, 6)</code> give?", options: ["0 to 5", "1 to 5", "1 to 6", "0 to 6"], answer: 2,
      why: "Unlike <code>range</code>, <code>randint</code> includes both ends: 1, 2, 3, 4, 5 or 6." },
    { type: "mcq", q: "After <code>import math</code>, how do you get the square root of 16?", options: ["sqrt(16)", "math.sqrt(16)", "math(sqrt, 16)", "import sqrt(16)"], answer: 1,
      why: "With <code>import math</code>, everything inside is reached through <code>math.</code>. Only <code>from math import sqrt</code> lets you write <code>sqrt(16)</code>." },
    { type: "match", q: "Match each import with how you then call the function.",
      pairs: [["<code>import random</code>", "random.randint(1, 6)"], ["<code>from random import randint</code>", "randint(1, 6)"], ["<code>import math</code>", "math.floor(2.7)"], ["<code>from math import floor</code>", "floor(2.7)"]],
      why: "<code>import x</code> keeps the module name as a prefix. <code>from x import y</code> brings the name in directly." },
    { type: "mcq", q: "You saved your program as <code>random.py</code>. Now <code>import random</code> then <code>random.randint(1, 6)</code> gives an <code>AttributeError</code>. Why?", options: ["randint was removed from Python", "Python imported your own random.py instead of the real module", "You need from random import randint", "The file is too short"], answer: 1,
      why: "Python looks in your folder first. Never name your files after modules you use: random.py, math.py, pytest.py." }
  ],
  code: {
    brief: "Use three modules. Return your answers; don't print them.<br>• <code>roll(sides=6)</code> returns a random whole number from 1 to <code>sides</code>, using <code>random</code>.<br>• <code>hypotenuse(a, b)</code> returns the long side of a right triangle, √(a² + b²), rounded to 2 decimal places, using <code>math</code>.<br>• <code>strongest()</code> finds the monster with the highest power in <code>bestiary.MONSTERS</code> and returns <code>bestiary.describe()</code> of it.",
    sample: ">>> roll()\n4\n>>> hypotenuse(3, 4)\n5.0\n>>> strongest()\n'Stone Golem (power 58)'",
    modules: { bestiary: `MONSTERS = [
    {"name": "Cave Bat", "power": 12},
    {"name": "Stone Golem", "power": 58},
    {"name": "Glow Slime", "power": 7},
    {"name": "Shadow Wolf", "power": 41},
]


def describe(monster):
    return f"{monster['name']} (power {monster['power']})"
` },
    starter: `import random
import math
import bestiary


def roll(sides=6):
    pass


def hypotenuse(a, b):
    pass


def strongest():
    pass
`,
    tests: [
      { call: "all(1 <= roll() <= 6 for _ in range(300))", expect: "True", label: "300 rolls are all 1 to 6" },
      { call: "set(roll() for _ in range(600)) == {1, 2, 3, 4, 5, 6}", expect: "True", label: "Every face comes up in 600 rolls" },
      { call: "set(roll(2) for _ in range(100))", expect: "{1, 2}", label: "<code>roll(2)</code> gives only 1 and 2" },
      { call: "isinstance(roll(20), int)", expect: "True", label: "<code>roll()</code> returns a whole number" },
      { call: "hypotenuse(3, 4)", expect: "5.0", silent: true },
      { call: "hypotenuse(1, 1)", expect: "1.41" },
      { call: "hypotenuse(5, 12)", expect: "13.0" },
      { call: "hypotenuse(2, 3)", expect: "3.61" },
      { call: "strongest()", expect: "'Dragon (power 120)'", modules: { bestiary: "MONSTERS = [{'name': 'Rat', 'power': 2}, {'name': 'Ogre', 'power': 30}, {'name': 'Dragon', 'power': 120}]\ndef describe(m):\n    return f\"{m['name']} (power {m['power']})\"\n" }, label: "<code>strongest()</code> when the strongest is last" },
      { call: "strongest()", expect: "'Stone Golem (power 58)'", silent: true },
      { call: "strongest()", expect: "'Fire Imp (power 99)'", modules: { bestiary: "MONSTERS = [{'name': 'Fire Imp', 'power': 99}, {'name': 'Moth', 'power': 3}]\ndef describe(m):\n    return f\"{m['name']} (power {m['power']})\"\n" }, label: "<code>strongest()</code> with a different bestiary" }
    ],
    must: [["random\\.\\w+\\(|from random import", "Use the <code>random</code> module."], ["math\\.|from math import", "Use the <code>math</code> module."]],
    hints: [
      "Each function needs one tool from its module. Look back at the learn cards: which function picks a whole number between two values, and which one finds a square root? <code>roll</code> is one line.",
      "<code>hypotenuse</code>: <code>return round(math.sqrt(a * a + b * b), 2)</code>.",
      "<code>strongest</code>: best-so-far over <code>bestiary.MONSTERS</code>, comparing <code>m[\"power\"]</code>. Then <code>return bestiary.describe(best)</code>."
    ],
    solution: `import random
import math
import bestiary


def roll(sides=6):
    return random.randint(1, sides)


def hypotenuse(a, b):
    return round(math.sqrt(a * a + b * b), 2)


def strongest():
    best = bestiary.MONSTERS[0]
    for m in bestiary.MONSTERS:
        if m["power"] > best["power"]:
            best = m
    return bestiary.describe(best)`,
    alts: [`from random import randint
from math import hypot
from bestiary import MONSTERS, describe

def roll(sides=6):
    return randint(1, sides)

def hypotenuse(a, b):
    return round(hypot(a, b), 2)

def strongest():
    return describe(max(MONSTERS, key=lambda m: m["power"]))`],
    wrong: [{ code: `import random
import math

def roll(sides=6):
    return random.randint(0, sides)

def hypotenuse(a, b):
    return round(math.sqrt(a * a + b * b), 2)

def strongest():
    return "Stone Golem (power 58)"`, why: "0 possible, hard-coded" }]
  },
  bug: {
    brief: "The dice game crashes with a NameError, even though <code>random</code> is imported. Read the error carefully.",
    code: `import random

def roll_two():
    return randint(1, 6) + randint(1, 6)

print("You rolled", roll_two())`,
    tests: [{ call: "all(2 <= roll_two() <= 12 for _ in range(200))", expect: "True" }, { call: "len(set(roll_two() for _ in range(800)))", expect: "11" },
      { call: "sum(1 for _ in range(3600) if roll_two() == 7) > 2 * sum(1 for _ in range(3600) if roll_two() == 12)", expect: "True", label: "7 comes up far more often than 12, like real dice" }],
    hints: ["<code>import random</code> doesn't create a name called <code>randint</code>. How do you reach things inside a module?"],
    fix: `import random

def roll_two():
    return random.randint(1, 6) + random.randint(1, 6)

print("You rolled", roll_two())`,
    lesson: "With <code>import random</code>, write <code>random.randint</code>. Or import the name directly: <code>from random import randint</code>."
  },
  explain: "What's the difference between <code>import math</code> and <code>from math import sqrt</code>? When might you prefer each?",
  cards: [
    { q: "Does <code>random.randint(1, 10)</code> include 10?", options: ["Yes", "No", "Sometimes", "Only with a seed"], answer: 0 },
    { q: "What is a module?", options: ["A loop", "A file of Python code you can import", "A kind of error", "A variable"], answer: 1 },
    { q: "Why use <code>if __name__ == \"__main__\":</code> in a module?", options: ["To make it faster", "So its demo code doesn't run when it's imported", "To hide it", "It's required"], answer: 1 }
  ],
  skills: { python: 3, logic: 2, debug: 2, talk: 2 }
},
/* ───────────────────────────── 3-7 ───────────────────────────── */
{
  id: "3-7", world: 3, n: 7, title: "Test Spells", concept: "assert and pytest",
  learn: [
    { h: "assert: check a fact",
      p: "<code>assert</code> checks that something is True. If it is, nothing happens. If not, it raises an <code>AssertionError</code>. It's the smallest possible test.",
      err: true,
      code: `def double(n):
    return n * 2

assert double(4) == 8
assert double(0) == 0
print("Both checks passed")
assert double(3) == 7, "double(3) should be 6, not 7"` },
    { h: "Tests are functions starting with test_",
      p: "The tool <b>pytest</b> runs every function whose name starts with <code>test_</code>, and reports which ones failed. Professional code has hundreds of these. Each test checks one behaviour, and its name says which.",
      code: `def double(n):
    return n * 2

def test_double_positive():
    assert double(4) == 8

def test_double_zero():
    assert double(0) == 0

def test_double_negative():
    assert double(-3) == -6

test_double_positive()
test_double_zero()
test_double_negative()
print("All tests passed (pytest would find them by itself)")` },
    { h: "Testing errors and many cases",
      p: "<code>with pytest.raises(ValueError):</code> checks that the code inside raises that error. <code>@pytest.mark.parametrize</code> runs one test with many inputs. In the game, <code>import pytest</code> works like it does on your computer. Careful with decimals: <code>0.1 + 0.2 == 0.3</code> is False on a real computer, because decimals are stored in binary. Compare them with <code>pytest.approx</code>: <code>assert total([99], \"SAVE10\") == pytest.approx(89.1)</code>. And <code>coupon is None</code> checks whether no coupon was given.",
      code: `import pytest

def withdraw(balance, amount):
    if amount > balance:
        raise ValueError("Insufficient funds")
    return balance - amount

def test_too_much():
    with pytest.raises(ValueError):
        withdraw(50, 80)

@pytest.mark.parametrize("balance, amount, left", [(100, 30, 70), (100, 100, 0)])
def test_withdraw(balance, amount, left):
    assert withdraw(balance, amount) == left

test_too_much()
print("raises test passed")` },
    { h: "Good tests catch bugs",
      p: "A test that only checks the easy case proves little. A study found students' tests touched 95% of the code but caught only 14% of real bugs. Good tests poke the <b>edges</b>: zero, empty, negative, exactly-at-the-limit, the error cases. In the next challenge, the checker hides bugs in the code and counts how many your tests catch.",
      lang: "text",
      code: `Questions that find bugs:
- What if the list is empty?
- What about 0, negative numbers, very big numbers?
- What happens exactly at a limit (10 when the rule says "10 or more")?
- What should happen with bad input? Is the right error raised?
- Does the order matter? Do ties work?` }
  ],
  think: [
    { type: "mcq", q: "Which tests are most likely to catch a bug in <code>average(nums)</code>?", options: ["average([2, 4]) == 3 only", "average([2, 4]) == 3, average([5]) == 5, and that average([]) raises an error", "Ten tests with lists of two numbers", "Printing average([2, 4])"], answer: 1,
      why: "Different <i>kinds</i> of input find different bugs: a normal case, a single item, and the empty-list edge. Ten tests of the same kind add little." },
    { type: "predict", q: "What does this print?", code: `def is_even(n):
    return n % 2 == 0

results = []
for n in [2, 7, 0, -4]:
    results.append(is_even(n))
print(results)`, answer: "[True, False, True, True]",
      why: "0 and -4 are even too. Edge values like 0 and negatives are exactly what good tests try." },
    { type: "refute", q: "This <code>clamp</code> should keep a number between 0 and 100 (anything below 0 becomes 0, anything above 100 becomes 100). Find an input it gets wrong.", fn: "clamp", args: 1, example: "50",
      code: `def clamp(n):
    if n > 100:
        return 100
    return n`,
      ref: `def clamp(n):
    if n > 100:
        return 100
    if n < 0:
        return 0
    return n`,
      answer: "-5", safe: ["50", "150"],
      why: "It forgot the lower limit, so negative numbers pass straight through. Testing both edges would catch this." }
  ],
  code: {
    brief: "Be the tester. The module <code>cart.py</code> (below the editor) has a <code>total(prices, coupon=None)</code> function. Write pytest-style tests for it:<br>• no coupon: the sum of the prices<br>• <code>\"SAVE10\"</code>: 10% off<br>• <code>\"FLAT50\"</code>: Rs 50 off, but never below 0<br>• any other coupon: raises <code>ValueError</code><br>Your tests must <b>pass on the real code</b>. Then the checker swaps in five broken versions of <code>cart.py</code>, and your tests must <b>fail on each one</b>. Write at least 4 tests.",
    sample: "from cart import total\n\ndef test_no_coupon():\n    assert total([10, 20]) == 30",
    pytest: {
      module: "cart", min: 4,
      src: `def total(prices, coupon=None):
    subtotal = sum(prices)
    if coupon is None:
        return subtotal
    if coupon == "SAVE10":
        return round(subtotal * 0.9, 2)
    if coupon == "FLAT50":
        return max(0, subtotal - 50)
    raise ValueError("Unknown coupon: " + coupon)
`,
      mutants: [
        { label: "ignores coupons completely", src: "def total(prices, coupon=None):\n    return sum(prices)\n", hint: "Test what each coupon does to the price." },
        { label: "FLAT50 can go below zero", src: "def total(prices, coupon=None):\n    subtotal = sum(prices)\n    if coupon is None:\n        return subtotal\n    if coupon == 'SAVE10':\n        return round(subtotal * 0.9, 2)\n    if coupon == 'FLAT50':\n        return subtotal - 50\n    raise ValueError('Unknown coupon: ' + coupon)\n", hint: "What should FLAT50 do to a cart that costs less than Rs 50?" },
        { label: "silently ignores unknown coupons", src: "def total(prices, coupon=None):\n    subtotal = sum(prices)\n    if coupon == 'SAVE10':\n        return round(subtotal * 0.9, 2)\n    if coupon == 'FLAT50':\n        return max(0, subtotal - 50)\n    return subtotal\n", hint: "Check that a made-up coupon raises ValueError, with pytest.raises." },
        { label: "SAVE10 takes Rs 10 off instead of 10%", src: "def total(prices, coupon=None):\n    subtotal = sum(prices)\n    if coupon is None:\n        return subtotal\n    if coupon == 'SAVE10':\n        return subtotal - 10\n    if coupon == 'FLAT50':\n        return max(0, subtotal - 50)\n    raise ValueError('Unknown coupon: ' + coupon)\n", hint: "For a Rs 100 cart, 10% off and Rs 10 off are the same! Try a different price." },
        { label: "crashes on an empty cart", src: "def total(prices, coupon=None):\n    subtotal = prices[0] + sum(prices[1:])\n    if coupon is None:\n        return subtotal\n    if coupon == 'SAVE10':\n        return round(subtotal * 0.9, 2)\n    if coupon == 'FLAT50':\n        return max(0, subtotal - 50)\n    raise ValueError('Unknown coupon: ' + coupon)\n", hint: "What should an empty cart cost?" }
      ]
    },
    tests: [],
    starter: `from cart import total
import pytest


def test_no_coupon():
    assert total([10, 20]) == 30


# Write more tests below. Think about edges!
`,
    hints: [
      "One test per rule: no coupon, SAVE10, FLAT50 on a big cart, FLAT50 on a small cart, and an unknown coupon.",
      "For errors: <code>with pytest.raises(ValueError):</code> then <code>total([10], \"FREE\")</code> indented inside.",
      "Use prices where 10% isn't Rs 10 (like 200), and remember the empty cart: <code>total([])</code> should be 0."
    ],
    solution: `from cart import total
import pytest


def test_no_coupon():
    assert total([10, 20]) == 30


def test_empty_cart():
    assert total([]) == 0


def test_save10():
    assert total([200]) == 200
    assert total([200], "SAVE10") == 180


def test_flat50():
    assert total([120], "FLAT50") == 70


def test_flat50_never_negative():
    assert total([30], "FLAT50") == 0


def test_unknown_coupon():
    with pytest.raises(ValueError):
        total([10], "FREE")`
  },
  bug: {
    brief: "A teammate wrote these tests, but they're broken in two ways: one test expects the wrong answer, and one test doesn't actually check anything. Fix them so they pass on the real <code>cart.py</code> and catch the broken versions.",
    pytest: {
      module: "cart", min: 4,
      src: `def total(prices, coupon=None):
    subtotal = sum(prices)
    if coupon is None:
        return subtotal
    if coupon == "SAVE10":
        return round(subtotal * 0.9, 2)
    if coupon == "FLAT50":
        return max(0, subtotal - 50)
    raise ValueError("Unknown coupon: " + coupon)
`,
      mutants: [
        { label: "FLAT50 can go below zero", src: "def total(prices, coupon=None):\n    subtotal = sum(prices)\n    if coupon is None:\n        return subtotal\n    if coupon == 'SAVE10':\n        return round(subtotal * 0.9, 2)\n    if coupon == 'FLAT50':\n        return subtotal - 50\n    raise ValueError('Unknown coupon: ' + coupon)\n", hint: "Does test_flat50 actually check its answer?" },
        { label: "ignores coupons completely", src: "def total(prices, coupon=None):\n    return sum(prices)\n" },
        { label: "silently ignores unknown coupons", src: "def total(prices, coupon=None):\n    subtotal = sum(prices)\n    if coupon == 'SAVE10':\n        return round(subtotal * 0.9, 2)\n    if coupon == 'FLAT50':\n        return max(0, subtotal - 50)\n    return subtotal\n" },
        { label: "SAVE10 gives 20% off", src: "def total(prices, coupon=None):\n    subtotal = sum(prices)\n    if coupon is None:\n        return subtotal\n    if coupon == 'SAVE10':\n        return round(subtotal * 0.8, 2)\n    if coupon == 'FLAT50':\n        return max(0, subtotal - 50)\n    raise ValueError('Unknown coupon: ' + coupon)\n", hint: "Does test_save10 still check the discounted price?" }
      ]
    },
    tests: [],
    code: `from cart import total
import pytest


def test_plain():
    assert total([10, 20]) == 30


def test_save10():
    assert total([100], "SAVE10") == 10


def test_flat50():
    total([30], "FLAT50") == 0


def test_unknown():
    with pytest.raises(ValueError):
        total([10], "FREE")
`,
    hints: ["10% off Rs 100 leaves Rs 90, not 10.", "A line with <code>==</code> but no <code>assert</code> compares and then throws the answer away. Nothing is checked."],
    fix: `from cart import total
import pytest


def test_plain():
    assert total([10, 20]) == 30


def test_save10():
    assert total([100], "SAVE10") == 90


def test_flat50():
    assert total([30], "FLAT50") == 0


def test_unknown():
    with pytest.raises(ValueError):
        total([10], "FREE")
`,
    lesson: "A test without <code>assert</code> always passes, so it can't catch anything. Make sure every test can actually fail."
  },
  explain: "What makes a test good? Explain why your tests caught the broken versions of <code>cart.py</code>.",
  cards: [
    { q: "What does pytest run?", options: ["Every function", "Functions whose names start with test_", "Only main()", "Comments"], answer: 1 },
    { q: "A test with no <code>assert</code>…", options: ["Checks everything", "Can never fail, so it checks nothing", "Is a syntax error", "Runs twice"], answer: 1 },
    { q: "Which input is an edge case for <code>average(nums)</code>?", options: ["[1, 2]", "[]", "[5, 6, 7]", "[10, 20]"], answer: 1 }
  ],
  skills: { python: 2, logic: 3, debug: 3, talk: 2, test: 6 }
},
/* ───────────────────────────── 3-8 BOSS ───────────────────────────── */
{
  id: "3-8", world: 3, n: 8, boss: true, title: "The Quiz Master", concept: "Boss: files, errors and functions together",
  learn: [
    { h: "Boss rules",
      p: "Build a quiz game that reads its questions from a file and keeps a high-score table in another file. Everything from this world comes together: reading and writing files, handling missing files, clean functions, and the <code>main()</code> pattern. Plan the functions first, then build and test one at a time.",
      lang: "text",
      code: `questions.txt   one question per line:  question|answer
scores.txt      one score per line:     name,score

load_questions(path)  -> list of (question, answer)
check_answer(given, correct) -> True/False
save_score(name, score, path)
high_score(path) -> (name, score) or None
main()  ties it all together` },
    { h: "Split, then check the parts",
      p: "<code>line.split(\"|\")</code> splits at every <code>|</code>. Check how many parts you got before using them, so a broken line can't crash the game.",
      files: { "questions.txt": W3_QUIZ },
      code: `with open("questions.txt") as f:
    for line in f:
        parts = line.strip().split("|")
        if len(parts) == 2:
            q, a = parts
            print("Q:", q, "| A:", a)` },
    { h: "Fair answer checking",
      p: "Players type in different ways: <code>DEF</code>, <code> def </code>, <code>Def</code>. Compare them after cleaning both sides with <code>.strip().lower()</code>.",
      code: `def check_answer(given, correct):
    return given.strip().lower() == correct.strip().lower()

print(check_answer("  DEF ", "def"))
print(check_answer("define", "def"))` }
  ],
  think: [
    { type: "order", q: "Put the game's main steps in order.", lines: ["Load the questions from the file", "Ask each question and count correct answers", "Show the score", "Ask for the player's name and save the score", "Show the high score"],
      why: "Load data, play, report, save, then read back the best. Saving before showing the high score means this game counts too." },
    { type: "mcq", q: "The questions file is missing. What should the game do?", options: ["Crash with a traceback", "Print a friendly message and stop", "Make up questions", "Loop forever"], answer: 1,
      why: "Catch <code>FileNotFoundError</code> and explain what's wrong. A traceback scares players and tells them nothing useful." },
    { type: "fill", q: "Fill the blanks so the function returns the best score.", code: `def high_score(scores):
    best = ___
    for name, score in scores:
        if best is None or score ___ best[1]:
            best = (name, score)
    return best

print(high_score([("Asha", 2), ("Ravi", 3), ("Om", 3)]))`, answers: ["None", ">"], expect: ["('Ravi', 3)"],
      why: "Start with <code>None</code> so an empty list returns None. <code>&gt;</code> (not <code>&gt;=</code>) keeps the first player on a tie." }
  ],
  code: {
    brief: "Build the Quiz Master. Write these five functions:<br>• <code>load_questions(path)</code>: read a file of <code>question|answer</code> lines. Return a list of <code>(question, answer)</code> tuples, with spaces removed from both parts. Skip blank lines and lines that don't have exactly one <code>|</code>. Don't catch FileNotFoundError here: <code>main()</code> will.<br>• <code>check_answer(given, correct)</code>: True if they match, ignoring capitals and spaces at the ends.<br>• <code>save_score(name, score, path=\"scores.txt\")</code>: add a line <code>name,score</code> to the end of the file.<br>• <code>high_score(path=\"scores.txt\")</code>: return <code>(name, score)</code> with the highest score. On a tie, keep the first one. Skip lines that aren't <code>name,whole number</code>. Return <code>None</code> if the file is missing or has no good line.<br>• <code>main()</code>: load <code>questions.txt</code>. If it's missing, print <code>questions.txt is missing.</code> and stop. Ask each question, using the question plus a space as the prompt. Print <code>Correct!</code> or <code>Wrong! The answer was 4</code>. Then print <code>Score: 2/3</code>, ask <code>Name? </code>, save the score, and <b>after saving</b> print <code>High score: Asha (3)</code>.",
    sample: "What keyword starts a function? def\nCorrect!\nWhat does len(\"chai\") return? 3\nWrong! The answer was 4\nWhich error do you get for 10 / 0? zerodivisionerror\nCorrect!\nScore: 2/3\nName? Asha\nHigh score: Asha (2)",
    files: { "questions.txt": W3_QUIZ },
    starter: `def load_questions(path):
    pass


def check_answer(given, correct):
    pass


def save_score(name, score, path="scores.txt"):
    pass


def high_score(path="scores.txt"):
    pass


def main():
    pass


if __name__ == "__main__":
    main()
`,
    tests: [
      { files: { "q.txt": "A?|a\n\nB? | b \nbroken line\nC?|c|extra\n" }, call: "load_questions('q.txt')", expect: "[('A?', 'a'), ('B?', 'b')]", label: "<code>load_questions</code> skips blank and broken lines" },
      { call: "check_answer('  DEF ', 'def')", expect: "True" },
      { call: "check_answer('define', 'def')", expect: "False" },
      { files: { "s.txt": "Asha,2\nRavi,5\nOm,5\nbad\n" }, call: "high_score('s.txt')", expect: "('Ravi', 5)", label: "<code>high_score</code> picks the first of a tie" },
      { files: null, call: "high_score('nothing.txt')", expect: "None", label: "<code>high_score</code> with no file" },
      { files: { "s.txt": "Asha,2\n" }, setup: "save_score('Zoya', 7, 's.txt')", call: "high_score('s.txt')", expect: "('Zoya', 7)", fileOut: { "s.txt": "Asha,2\nZoya,7\n" }, label: "<code>save_score</code> adds a line" },
      { files: { "questions.txt": W3_QUIZ, "scores.txt": "Ravi,3\n" }, in: ["def", "3", " zerodivisionerror ", "Asha"], out: ["Correct!", "Wrong! The answer was 4", "Correct!", "Score: 2/3", "High score: Ravi (3)"], only: true, inOrder: true, fileOut: { "questions.txt": W3_QUIZ, "scores.txt": "Ravi,3\nAsha,2\n" }, label: "Plays a full game" },
      { files: null, out: ["questions.txt is missing."], only: true, label: "Missing questions file" },
      { files: null, call: "load_questions('nope.txt')", raises: "FileNotFoundError", label: "<code>load_questions</code> lets FileNotFoundError happen" },
      { files: { "questions.txt": W3_QUIZ, "scores.txt": "Ravi,1\n" }, in: ["def", "4", "ZeroDivisionError", "Zoya"], out: ["Correct!", "Correct!", "Correct!", "Score: 3/3", "High score: Zoya (3)"], only: true, inOrder: true, label: "A new high score" },
      { files: { "questions.txt": "Capital of India?|New Delhi\n2 + 2?|4\n" }, in: ["new delhi", "5", "Om"], out: ["Correct!", "Wrong! The answer was 4", "Score: 1/2", "High score: Om (1)"], only: true, inOrder: true, fileOut: { "scores.txt": "Om,1\n" }, label: "A different quiz, first game ever" }
    ],
    must: [["def\\s+main\\s*\\(", "Put the game in <code>main()</code>."], ["__name__", "Use <code>if __name__ == \"__main__\":</code> to start the game."]],
    hints: [
      "Build and test one function at a time. Call them at the bottom while you work, then remove the calls.",
      "<code>high_score</code>: wrap the reading in <code>try</code>/<code>except FileNotFoundError: return None</code>. Skip lines that don't split into 2 parts or whose score isn't digits.",
      "In <code>main</code>: <code>try: questions = load_questions(\"questions.txt\")</code> <code>except FileNotFoundError:</code> print the message and <code>return</code>."
    ],
    solution: `def load_questions(path):
    questions = []
    with open(path) as f:
        for line in f:
            parts = line.strip().split("|")
            if len(parts) == 2:
                questions.append((parts[0].strip(), parts[1].strip()))
    return questions


def check_answer(given, correct):
    return given.strip().lower() == correct.strip().lower()


def save_score(name, score, path="scores.txt"):
    with open(path, "a") as f:
        f.write(f"{name},{score}\\n")


def high_score(path="scores.txt"):
    best = None
    try:
        with open(path) as f:
            for line in f:
                parts = line.strip().split(",")
                if len(parts) != 2 or not parts[1].isdigit():
                    continue
                name, score = parts[0], int(parts[1])
                if best is None or score > best[1]:
                    best = (name, score)
    except FileNotFoundError:
        return None
    return best


def main():
    try:
        questions = load_questions("questions.txt")
    except FileNotFoundError:
        print("questions.txt is missing.")
        return
    score = 0
    for q, a in questions:
        given = input(q + " ")
        if check_answer(given, a):
            print("Correct!")
            score += 1
        else:
            print(f"Wrong! The answer was {a}")
    print(f"Score: {score}/{len(questions)}")
    name = input("Name? ")
    save_score(name, score)
    best = high_score()
    print(f"High score: {best[0]} ({best[1]})")


if __name__ == "__main__":
    main()`,
    after: "Take it home: write your own questions file about something you love, and add tests for each function with pytest."
  },
  bug: {
    brief: "<b>AI code review.</b> An AI wrote this <code>high_score</code>. It works on the happy path, but crashes on a perfectly normal situation: a brand-new player with no scores file yet. Make it return <code>None</code> instead.",
    code: `# AI-written
def high_score(path="scores.txt"):
    best = None
    with open(path) as f:
        for line in f:
            name, score = line.strip().split(",")
            if best is None or int(score) > best[1]:
                best = (name, int(score))
    return best

print(high_score())`,
    tests: [
      { files: null, call: "high_score()", expect: "None", label: "No scores file yet" },
      { files: { "scores.txt": "Asha,4\nRavi,6\n" }, call: "high_score()", expect: "('Ravi', 6)", label: "Normal scores file" }
    ],
    mustNot: [["except\\s*:", "A bare <code>except:</code> hides other bugs. Catch <code>FileNotFoundError</code>."]], mustNotAll: true,
    hints: ["What happens when <code>open()</code> can't find the file? Wrap it in try / except and return None."],
    fix: `def high_score(path="scores.txt"):
    best = None
    try:
        with open(path) as f:
            for line in f:
                name, score = line.strip().split(",")
                if best is None or int(score) > best[1]:
                    best = (name, int(score))
    except FileNotFoundError:
        return None
    return best

print(high_score())`,
    lesson: "AI code is often tested only on the happy path. Ask: what if the file, list or input is missing or empty?"
  },
  explain: "Interview practice: how did you make the Quiz Master robust? Name two things that could go wrong and how your code handles them.",
  cards: [
    { q: "Best way to handle a missing file a user might not have yet?", options: ["Let it crash", "Catch FileNotFoundError and handle it", "Delete the folder", "Use a bare except"], answer: 1 },
    { q: "How do you compare answers fairly?", options: ["==", "Clean both with .strip().lower(), then ==", "len()", "is"], answer: 1 },
    { q: "Which mode does save_score need?", options: ["\"r\"", "\"w\"", "\"a\"", "\"x\""], answer: 2 }
  ],
  skills: { python: 4, logic: 3, debug: 4, talk: 3, test: 2 },
  homeQuest: {
    title: "Take it home",
    intro: "This week you become someone who can debug and test. These steps prove it on your own machine.",
    tasks: [
      { t: "Install pytest and run real tests", d: "<code>py -m pip install pytest</code> (on Windows). Save your cart tests as <code>test_cart.py</code> next to <code>cart.py</code> and run <code>py -m pytest</code>.", skill: "test" },
      { t: "Build the Quiz Master locally", d: "Write your own <code>questions.txt</code> about a topic you love. Play it twice and check the high scores file.", skill: "python" },
      { t: "Use the debugger once", d: "In VS Code, click left of a line number to set a breakpoint, press F5, and step through your quiz line by line.", skill: "debug" },
      { t: "Read a real traceback bottom-up", d: "Break your quiz on purpose (remove a file, misspell a name) and read the full traceback in the terminal.", skill: "debug" },
      { t: "Watch CS50P Weeks 3 and 5", d: "Exceptions and Unit Tests. Try one problem from each problem set.", skill: "python" },
      { t: "Push the quiz to GitHub with tests", d: "Include <code>test_quiz.py</code> and a README that says how to run the game and the tests.", skill: "git" }
    ]
  }
}
);
