/* World 2 — Loop Forest: loops, lists, functions, dictionaries. Boss: Expense Tracker. */

RESOURCES[2] = [
  { name: "Harvard CS50P, Lecture 2: Loops", what: "Watch it this week, then try Problem Set 2. Pause and type along.", url: "https://cs50.harvard.edu/python/weeks/2/" },
  { name: "Automate the Boring Stuff, ch. 3, 4, 6, 7", what: "Free book: loops, functions, lists and dictionaries. Start with chapter 3.", url: "https://automatetheboringstuff.com/3e/chapter3.html" },
  { name: "Exercism Python track", what: "Do 3 exercises on lists, loops and dictionaries. Ask a mentor to review one.", url: "https://exercism.org/tracks/python" },
  { name: "Python Tutor", what: "Paste any loop and watch it run line by line. The best way to see what your code really does.", url: "https://pythontutor.com/python-compiler.html" }
];

LEVELS.push(
/* ───────────────────────────── 2-1 ───────────────────────────── */
{
  id: "2-1", world: 2, n: 1, title: "Echoes in the Forest", concept: "for loops and range()",
  learn: [
    { h: "A loop repeats work for you",
      p: "Programs often do the same thing many times. A <code>for</code> loop runs the indented lines once for each value. <code>range(3)</code> gives 0, 1 and 2, so the body runs three times. The loop variable (<code>i</code> here) holds the current value on each lap.",
      code: `for i in range(3):
    print("Echo number", i)
print("The forest goes quiet")` },
    { h: "range(start, stop, step)",
      p: "<code>range(start, stop, step)</code> begins at <b>start</b> and moves by <b>step</b> each time. It stops <b>before</b> stop, so stop is never included: <code>range(1, 6)</code> gives 1 to 5. Leave out start and it is 0. Leave out step and it is 1. A negative step counts down: <code>range(10, 0, -2)</code> gives 10, 8, 6, 4, 2.",
      code: `for n in range(1, 6):
    print(n, end=" ")
print()
for n in range(10, 0, -2):
    print(n, end=" ")` },
    { h: "Loop over text, letter by letter",
      p: "A <code>for</code> loop can walk through anything that holds several values. A string holds letters, so the loop variable gets one letter per lap. <code>end=\" \"</code> tells <code>print</code> to end with a space instead of a new line. <code>letter.upper()</code> gives a CAPITAL copy of the letter, and <code>.lower()</code> gives a small-letter copy. The dot means \"use a tool that belongs to this value\". <code>in</code> also works on text: <code>\"a\" in \"chai\"</code> is True.",
      code: `for letter in "chai":
    print(letter.upper(), end=" ")
print()
print("a" in "chai", "z" in "chai")` },
    { h: "The accumulator pattern",
      p: "To add things up in a loop, follow three steps: <b>1.</b> create the total <i>before</i> the loop, <b>2.</b> update it <i>inside</i> the loop, <b>3.</b> use it <i>after</i> the loop. You'll use this pattern every day as a developer: for sums, counts and building text.",
      code: `total = 0                 # 1. set up before the loop
for n in range(1, 6):
    total = total + n     # 2. update inside the loop
    print("after adding", n, "total is", total)
print("Sum:", total)      # 3. use it after the loop` }
  ],
  think: [
    { type: "predict", q: "Predict the output, then check.", code: `for i in range(3):
    print(i * 2)`, answer: "0\n2\n4",
      why: "<code>range(3)</code> gives 0, 1, 2. Each is doubled. It never reaches 3, because stop is never included." },
    { type: "mcq", q: "How many times does this loop body run?", code: `for n in range(2, 10, 3):
    print(n)`, options: ["2", "3", "4", "8"], answer: 1,
      why: "It starts at 2 and steps by 3: 2, 5, 8. The next value, 11, is past the stop (10), so it runs 3 times." },
    { type: "spot", q: "This should print 6 (1 + 2 + 3) but prints 3. Which line is the problem?", code: `for n in range(1, 4):
    total = 0
    total = total + n
print(total)`, answer: 2,
      why: "Setting <code>total = 0</code> inside the loop wipes it on every lap. The set-up step belongs <i>before</i> the loop." },
    { type: "fill", q: "Fill the blanks to make a rocket countdown.", code: `for n in range(___, ___, ___):
    print(n)
print("Liftoff!")`, answers: ["5", "0", "-1"], expect: ["5", "4", "3", "2", "1", "Liftoff!"],
      wrong: [["5", "1", "-1"], ["1", "6", "1"]],
      why: "Start at 5, step down by 1, and stop <i>before</i> 0, so 1 is the last number. <code>range(5, 0, -1)</code>." },
    { type: "predict", q: "Does the loop variable still exist after the loop? What does this print?", code: `for i in range(3):
    pass
print(i)`, answer: "2",
      why: "After the loop, <code>i</code> keeps the last value it had: 2. (<code>pass</code> means \"do nothing\".)" },
    { type: "order", indent: true, q: "The famous FizzBuzz interview question: for 1 to 15, print <code>Fizz</code> for multiples of 3, <code>Buzz</code> for multiples of 5, <code>FizzBuzz</code> for multiples of both, otherwise the number. Build it.",
      lines: ["for n in range(1, 16):", "    if n % 15 == 0:", "        print(\"FizzBuzz\")", "    elif n % 3 == 0:", "        print(\"Fizz\")", "    elif n % 5 == 0:", "        print(\"Buzz\")", "    else:", "        print(n)"],
      expect: ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"],
      why: "It uses <code>%</code> and <code>elif</code> from World 1. The strictest check (multiple of 15) must come first, or 15 would stop at the Fizz branch." }
  ],
  code: {
    brief: "The forest school needs a times-table scroll. Ask for a number, print its table from 1 to 10 in the format below, then print the sum of all ten answers. Use a <code>for</code> loop. Print only these lines.",
    sample: "Number? 7\n7 x 1 = 7\n7 x 2 = 14\n...\n7 x 10 = 70\nSum of the table: 385",
    starter: `n = int(input("Number? "))
# 1. Set up a total before the loop

# 2. Loop from 1 to 10: print each line and add to the total

# 3. Print the sum after the loop
`,
    tests: [
      { in: ["7"], out: ["7 x 1 = 7", "7 x 2 = 14", "7 x 3 = 21", "7 x 4 = 28", "7 x 5 = 35", "7 x 6 = 42", "7 x 7 = 49", "7 x 8 = 56", "7 x 9 = 63", "7 x 10 = 70", "Sum of the table: 385"], only: true, inOrder: true },
      { in: ["3"], out: ["3 x 1 = 3", "3 x 2 = 6", "3 x 3 = 9", "3 x 4 = 12", "3 x 5 = 15", "3 x 6 = 18", "3 x 7 = 21", "3 x 8 = 24", "3 x 9 = 27", "3 x 10 = 30", "Sum of the table: 165"], only: true, inOrder: true }
    ],
    fuzz: { n: 8, what: "random numbers", gen: (r) => ({ in: [String(r.int(2, 99))] }) },
    must: [["\\bfor\\b", "Use a <code>for</code> loop, so Python does the repeating for you."], ["range\\(", "Use <code>range()</code> to count from 1 to 10."]],
    hints: [
      "Which <code>range</code> gives 1 to 10? Remember stop is not included.",
      "Use the accumulator pattern. Before the loop: <code>total = 0</code>. Inside: <code>total = total + n * i</code>. After the loop (not indented): print the sum.",
      "<code>for i in range(1, 11):</code> then inside: <code>print(f\"{n} x {i} = {n * i}\")</code>"
    ],
    solution: `n = int(input("Number? "))
total = 0
for i in range(1, 11):
    print(f"{n} x {i} = {n * i}")
    total = total + n * i
print(f"Sum of the table: {total}")`,
    alts: [`n = int(input("Number? "))
total = 0
for i in range(1, 11):
    answer = n * i
    total += answer
    print(n, "x", i, "=", answer)
print("Sum of the table:", total)`],
    wrong: [
      { code: `n = int(input("Number? "))
total = 0
for i in range(1, 10):
    print(f"{n} x {i} = {n * i}")
    total = total + n * i
print(f"Sum of the table: {total}")`, why: "stops at 9" },
      { code: `n = int(input("Number? "))
for i in range(1, 11):
    total = 0
    print(f"{n} x {i} = {n * i}")
    total = total + n * i
print(f"Sum of the table: {total}")`, why: "total reset inside loop" }
    ]
  },
  bug: {
    brief: "The forest guide should number the visitors 1 to 5, but the count is off by one. This kind of bug is so common it has a name: an <b>off-by-one error</b>.",
    code: `for visitor in range(5):
    print(f"Welcome, visitor {visitor}")
print("Gate closed")`,
    tests: [{ in: [], out: ["Welcome, visitor 1", "Welcome, visitor 2", "Welcome, visitor 3", "Welcome, visitor 4", "Welcome, visitor 5", "Gate closed"], only: true, inOrder: true }],
    hint: "What's the first number <code>range(5)</code> gives? And the last? You want 1 to 5.",
    fix: `for visitor in range(1, 6):
    print(f"Welcome, visitor {visitor}")
print("Gate closed")`,
    lesson: "Off-by-one errors hide at the start and end of ranges. Always check the first and last values."
  },
  explain: "What numbers does <code>range(1, 6)</code> give? Is 6 included? Which range gives 1 to 10, and how do you check the first and last numbers are right?",
  cards: [
    { q: "How many numbers does <code>range(5)</code> give?", options: ["4", "5", "6", "It depends"], answer: 1 },
    { q: "What does <code>range(2, 8, 2)</code> give?", options: ["2, 4, 6", "2, 4, 6, 8", "2 to 8", "4, 6, 8"], answer: 0 },
    { q: "In the accumulator pattern, where does <code>total = 0</code> go?", options: ["Inside the loop", "Before the loop", "After the loop", "Anywhere"], answer: 1 },
    { q: "What does <code>for i in range(1, 4): print(i * i)</code> print?", options: ["1 4 9", "0 1 4", "1 4 9 16", "1 2 3"], answer: 0 }
  ],
  skills: { python: 3, logic: 3, debug: 2, talk: 2 }
},
/* ───────────────────────────── 2-2 ───────────────────────────── */
{
  id: "2-2", world: 2, n: 2, title: "Until the Fog Lifts", concept: "while loops",
  learn: [
    { h: "while repeats while a condition is True",
      p: "A <code>while</code> loop checks its condition before every lap. If it's True, the body runs. If it's False, Python skips to the code after the loop. Something inside the loop must change, or the condition stays True forever. <code>count -= 1</code> is short for <code>count = count - 1</code>. Likewise <code>years += 1</code> means <code>years = years + 1</code>.",
      code: `count = 3
while count > 0:
    print("Fog in", count)
    count -= 1
print("The fog lifts!")` },
    { h: "for or while?",
      p: "Use <code>for</code> when you know how many times to repeat, or you're walking through a collection. Use <code>while</code> when you repeat <b>until something happens</b>, like a correct answer or a goal being reached.",
      code: `# How many years until 100 saplings become 1000 trees,
# if the forest grows by 50% a year?
trees = 100
years = 0
while trees < 1000:
    trees = trees * 1.5
    years += 1
print(years, "years")` },
    { h: "Keep asking until the answer is valid",
      p: "A very common pattern: ask once, then <i>keep</i> asking while the answer is wrong. Press Run and try typing some wrong answers first.", inputs: ["41", "forty-two", "42"],
      code: `answer = input("What's 6 x 7? ")
while answer != "42":
    answer = input("Not quite. Try again: ")
print("Correct! The path opens.")` },
    { h: "while True and break",
      inputs: ["hello", "", "quit"],
      p: "Sometimes it's clearer to loop forever and <code>break</code> out when you're done. <code>break</code> jumps straight out of the nearest loop. <code>continue</code> is different: it skips the rest of this lap and goes back to the top. If a loop never ends, press <b>Stop</b>. It happens to every programmer.",
      code: `while True:
    word = input("Say the magic word (or 'quit'): ")
    if word == "quit":
        print("Goodbye!")
        break
    if word == "":
        continue   # nothing typed: skip to the next lap
    print("You said", word)` }
  ],
  think: [
    { type: "predict", q: "Trace it on paper first. What does this print?", code: `n = 1
while n < 20:
    n = n * 3
print(n)`, answer: "27",
      why: "n goes 1 → 3 → 9 → 27. Before each lap Python checks <code>n &lt; 20</code>. When n is 27 the check fails and the loop ends. The print is outside the loop, so it runs once." },
    { type: "predict", q: "When exactly does a while loop check its condition? What does this print?", code: `n = 0
while n < 3:
    n += 1
    print(n)`, answer: "1\n2\n3",
      why: "Python only checks the condition at the top of each lap. When n becomes 3 mid-lap, the rest of that lap (the print) still runs. Then the check fails and the loop ends." },
    { type: "mcq", q: "What happens when this runs?", code: `x = 5
while x > 0:
    print(x)`, options: ["It prints 5 once", "It prints 5, 4, 3, 2, 1", "It runs forever", "An error"], answer: 2,
      why: "Nothing inside the loop changes <code>x</code>, so <code>x &gt; 0</code> stays True forever. Every while loop needs something that moves it toward stopping." },
    { type: "order", indent: true, q: "A sapling is 1 m tall and grows 2 m a year. Build a program that prints how many years until it's taller than 10 m.",
      lines: ["height = 1", "years = 0", "while height <= 10:", "    height = height + 2", "    years = years + 1", "print(f\"{years} years\")"],
      expect: ["5 years"],
      why: "Set up the variables, loop while it's not tall enough yet, grow and count inside the loop, then print once after. The years: 3 m, 5 m, 7 m, 9 m, 11 m, so 5 years." },
    { type: "mcq", q: "Which loop fits best: <i>keep asking for a PIN until the user types the right one</i>?", options: ["for i in range(3):", "while pin != \"2580\":", "for pin in \"2580\":", "if pin == \"2580\":"], answer: 1,
      why: "You don't know how many tries it'll take, so you repeat <i>until</i> something happens. That's a while loop." }
  ],
  code: {
    brief: "Build a guessing game. The secret number is 7. Ask <code>Guess: </code> again and again until the player types 7. After each wrong guess print <code>Too low</code> or <code>Too high</code>. When the guess is right, print <code>Found it! Guesses: N</code>, where N counts every guess including the right one. Print nothing else.",
    sample: "Guess: 3\nToo low\nGuess: 9\nToo high\nGuess: 7\nFound it! Guesses: 3",
    starter: `secret = 7
# Count the guesses, and keep looping until the guess is right
`,
    tests: [
      { in: ["3", "9", "7"], out: ["Too low", "Too high", "Found it! Guesses: 3"], only: true, inOrder: true },
      { in: ["7"], out: ["Found it! Guesses: 1"], only: true },
      { in: ["10", "1", "8", "6", "7"], out: ["Too high", "Too low", "Too high", "Too low", "Found it! Guesses: 5"], only: true, inOrder: true }
    ],
    must: [["\\bwhile\\b", "Use a <code>while</code> loop. You don't know how many guesses it'll take."]],
    hints: [
      "You need a counter that starts at 0 and goes up by 1 for every guess.",
      "One way: <code>while True:</code>, ask for a guess, add 1 to the counter, then check it with if / elif / else.",
      "When the guess is right, print the message and <code>break</code>. Don't forget <code>int()</code> around <code>input()</code>."
    ],
    solution: `secret = 7
guesses = 0
while True:
    guess = int(input("Guess: "))
    guesses += 1
    if guess < secret:
        print("Too low")
    elif guess > secret:
        print("Too high")
    else:
        print(f"Found it! Guesses: {guesses}")
        break`,
    alts: [`secret = 7
guess = int(input("Guess: "))
count = 1
while guess != secret:
    if guess < secret:
        print("Too low")
    else:
        print("Too high")
    guess = int(input("Guess: "))
    count = count + 1
print("Found it! Guesses:", count)`],
    wrong: [{ code: `secret = 7
guesses = 0
guess = 0
while guess != secret:
    guess = int(input("Guess: "))
    if guess < secret:
        print("Too low")
    elif guess > secret:
        print("Too high")
print(f"Found it! Guesses: {guesses}")`, why: "never counts" }],
    after: "Next up: real games pick the secret with <code>random.randint(1, 20)</code>. You'll meet modules in World 3."
  },
  bug: {
    brief: "The forest glider's fuel display should count down and then land. Instead it never stops. Press Run (then Stop), and look at the indentation.",
    code: `fuel = int(input("Fuel? "))
while fuel > 0:
    print(f"Flying... fuel {fuel}")
fuel = fuel - 1
print("Landed")`,
    tests: [{ in: ["3"], out: ["Flying... fuel 3", "Flying... fuel 2", "Flying... fuel 1", "Landed"], only: true, inOrder: true },
      { in: ["5"], out: ["Flying... fuel 5", "Flying... fuel 4", "Flying... fuel 3", "Flying... fuel 2", "Flying... fuel 1", "Landed"], only: true, inOrder: true },
      { in: ["0"], out: ["Landed"], only: true }],
    hint: "Which lines are inside the loop? Only the indented ones. Is the line that changes <code>fuel</code> inside?",
    fix: `fuel = int(input("Fuel? "))
while fuel > 0:
    print(f"Flying... fuel {fuel}")
    fuel = fuel - 1
print("Landed")`,
    lesson: "In Python, indentation decides what's inside a loop. A missing indent can mean a loop that never ends."
  },
  explain: "When would you choose a <code>while</code> loop instead of a <code>for</code> loop? Give one example of each.",
  cards: [
    { q: "When does a <code>while</code> loop stop?", options: ["After 10 laps", "When the condition is False at the check before a lap", "The instant the condition becomes False, even mid-lap", "Never"], answer: 1 },
    { q: "What does <code>break</code> do?", options: ["Stops the whole program", "Skips one lap", "Jumps out of the nearest loop", "Causes an error"], answer: 2 },
    { q: "<code>count -= 1</code> means…", options: ["count = -1", "count = count - 1", "count == count - 1", "count is negative"], answer: 1 }
  ],
  skills: { python: 3, logic: 3, debug: 2, talk: 2 }
},
/* ───────────────────────────── 2-3 ───────────────────────────── */
{
  id: "2-3", world: 2, n: 3, title: "The Backpack", concept: "lists",
  learn: [
    { h: "A list holds many values, in order",
      p: "Square brackets make a list. It can hold any number of values, and <code>len()</code> tells you how many. Lists are everywhere: shopping carts, messages, high scores.",
      code: `backpack = ["map", "rope", "torch"]
print(backpack)
print(len(backpack), "items")` },
    { h: "Positions start at 0",
      p: "Each item has an <b>index</b>, starting at 0. So the first item is <code>backpack[0]</code>. Negative indexes count from the end: <code>backpack[-1]</code> is the last item. A <b>slice</b> like <code>backpack[0:2]</code> gives a new list from index 0 up to, but not including, 2. Slices work on text too, and a step of -1 walks backwards: <code>\"chai\"[::-1]</code> is <code>\"iahc\"</code>.",
      code: `backpack = ["map", "rope", "torch"]
print(backpack[0])
print(backpack[-1])
print(backpack[0:2])
print("chai"[::-1])
# print(backpack[3])  # remove the # to see an IndexError` },
    { h: "Lists can change",
      p: "Replace an item by its index, add to the end with <code>.append()</code>, remove the first matching <i>value</i> with <code>.remove()</code>, and take the last item off with <code>.pop()</code>. <code>.sort()</code> sorts the list itself. Methods that change a list give back <code>None</code>, Python's value for \"nothing\", so never write <code>items = items.sort()</code>. To get a <i>new</i> sorted list and keep the old one, use <code>sorted(items)</code>.",
      code: `backpack = ["map", "rope", "torch"]
backpack[1] = "lamp"
backpack.append("snacks")
backpack.remove("map")
last = backpack.pop()
print(backpack, "and I took out", last)
nums = [3, 1, 2]
print(sorted(nums), nums)   # a new list; nums is unchanged
nums.sort()
print(nums)` },
    { h: "Loop through a list",
      p: "A <code>for</code> loop gives you each item in turn. <code>in</code> checks whether something is in the list. When you also need the position, <code>enumerate()</code> gives you both, and <code>start=1</code> makes it start counting at 1, like people do.",
      code: `backpack = ["map", "rope", "torch"]
for item in backpack:
    print("-", item)
if "rope" in backpack:
    print("Ready to climb!")
for number, item in enumerate(backpack, start=1):
    print(f"{number}. {item}")` }
  ],
  think: [
    { type: "predict", q: "What does this print?", code: `nums = [10, 20, 30]
nums.append(40)
print(nums[1], nums[-1], len(nums))`, answer: "20 40 4",
      why: "After the append the list is [10, 20, 30, 40]. Index 1 is the <i>second</i> item (20), -1 is the last (40), and there are 4 items." },
    { type: "mcq", q: "What does this print?", code: `a = [1, 2]
b = a
b.append(3)
print(a)`, options: ["[1, 2]", "[1, 2, 3]", "[3]", "An error"], answer: 1,
      why: "<code>b = a</code> doesn't copy the list. Both names point to the <b>same</b> list, so changing it through b also changes what a sees. To copy, use <code>b = a.copy()</code>." },
    { type: "mcq", q: "What does this print?", code: `items = [3, 1, 2]
items = items.sort()
print(items)`, options: ["[1, 2, 3]", "[3, 1, 2]", "None", "An error"], answer: 2,
      why: "<code>.sort()</code> sorts the list in place and gives back <code>None</code>. Storing that None in <code>items</code> loses the list. Use <code>items.sort()</code> on its own line, or <code>sorted(items)</code> to get a new sorted list." },
    { type: "match", q: "Match each list tool with what it does.",
      pairs: [["<code>.append(x)</code>", "adds x to the end"], ["<code>.remove(x)</code>", "deletes the first x"], ["<code>.pop()</code>", "takes off and returns the last item"], ["<code>len(lst)</code>", "counts the items"], ["<code>x in lst</code>", "True if x is in the list"]],
      why: "These five cover most everyday list work. Notice <code>.pop()</code> gives the item back, while <code>.remove()</code> doesn't." }
  ],
  code: {
    brief: "Make a shopping list helper. Keep asking <code>Item: </code> until the user types <code>done</code>.<br>• If the item is already on the list, print <code>Already on the list: </code> and the item, and don't add it again.<br>• At the end print <code>You need N items:</code> and the list, numbered from 1.<br>• If nothing was added, print <code>Your list is empty.</code> instead.<br>Add items with <code>.append()</code> and check for repeats with <code>in</code>. Print nothing else.",
    sample: "Item: milk\nItem: bread\nItem: milk\nAlready on the list: milk\nItem: done\nYou need 2 items:\n1. milk\n2. bread",
    starter: `items = []
# 1. Keep asking for items until the user types done
# 2. Skip items that are already on the list
# 3. Print the empty message, or the numbered list
`,
    tests: [
      { in: ["milk", "bread", "milk", "done"], out: ["Already on the list: milk", "You need 2 items:", "1. milk", "2. bread"], only: true, inOrder: true },
      { in: ["done"], out: ["Your list is empty."], only: true },
      { in: ["rice", "dal", "ghee", "dal", "rice", "done"], out: ["Already on the list: dal", "Already on the list: rice", "You need 3 items:", "1. rice", "2. dal", "3. ghee"], only: true, inOrder: true }
    ],
    must: [["\\.append\\(", "Add new items with <code>.append()</code>."], ["\\bif\\s+[^\\n:]*\\bin\\b", "Use <code>if ... in items</code> to check whether an item is already on the list."]],
    hints: [
      "Loop with <code>while True:</code>, ask for an item, and <code>break</code> if it's <code>done</code>.",
      "Before adding: <code>if item in items:</code> print the warning, <code>else:</code> append it.",
      "After the loop: <code>if len(items) == 0:</code> print the empty message. Otherwise use <code>enumerate(items, start=1)</code> to number them."
    ],
    solution: `items = []
while True:
    item = input("Item: ")
    if item == "done":
        break
    if item in items:
        print(f"Already on the list: {item}")
    else:
        items.append(item)
if len(items) == 0:
    print("Your list is empty.")
else:
    print(f"You need {len(items)} items:")
    for number, item in enumerate(items, start=1):
        print(f"{number}. {item}")`,
    alts: [`items = []
item = input("Item: ")
while item != "done":
    if item not in items:
        items.append(item)
    else:
        print("Already on the list:", item)
    item = input("Item: ")
if not items:
    print("Your list is empty.")
else:
    print("You need", len(items), "items:")
    n = 1
    for item in items:
        print(str(n) + ". " + item)
        n += 1`],
    wrong: [{ code: `items = []
while True:
    item = input("Item: ")
    if item == "done":
        break
    items.append(item)
print(f"You need {len(items)} items:")
for number, item in enumerate(items, start=1):
    print(f"{number}. {item}")`, why: "duplicates and empty list not handled" }]
  },
  bug: {
    brief: "<code>best_score</code> should return the best score in a list, but it crashes. Read the error: what's the last index of a list with 4 items?",
    code: `def best_score(scores):
    best = scores[0]
    for i in range(1, len(scores) + 1):
        if scores[i] > best:
            best = scores[i]
    return best

print(f"Best score: {best_score([12, 30, 7, 45])}")`,
    tests: [{ call: "best_score([12, 30, 7, 45])", expect: "45" }, { call: "best_score([99, 1, 5])", expect: "99" }, { call: "best_score([5])", expect: "5" }, { call: "best_score([-3, -1, -2])", expect: "-1" }],
    hint: "A list of 4 items has indexes 0 to 3. What's the last value <code>range(1, len(scores) + 1)</code> gives? Even simpler: loop over the items with <code>for s in scores:</code>.",
    fix: `def best_score(scores):
    best = scores[0]
    for s in scores:
        if s > best:
            best = s
    return best

print(f"Best score: {best_score([12, 30, 7, 45])}")`,
    lesson: "IndexError means you asked for a position past the end. Looping over the items directly avoids the problem entirely."
  },
  explain: "What index does the first item have, and the last? What does <code>backpack[-1]</code> give, and why is it easier than <code>backpack[len(backpack) - 1]</code>?",
  cards: [
    { q: "<code>pets = [\"cat\", \"dog\", \"fish\"]</code>. What is <code>pets[1]</code>?", options: ["cat", "dog", "fish", "An error"], answer: 1 },
    { q: "What does <code>.sort()</code> give back?", options: ["The sorted list", "None", "The first item", "True"], answer: 1 },
    { q: "After <code>b = a</code> (where a is a list), changing b…", options: ["Doesn't affect a", "Also changes a", "Causes an error", "Copies the list"], answer: 1 },
    { q: "After <code>a = [1, 2]</code> and <code>a.append([3, 4])</code>, what is <code>len(a)</code>?", options: ["2", "3", "4", "An error"], answer: 1 }
  ],
  skills: { python: 3, logic: 2, debug: 3, talk: 2 }
},
/* ───────────────────────────── 2-4 ───────────────────────────── */
{
  id: "2-4", world: 2, n: 4, title: "Pattern Hunters", concept: "count, best-so-far, filter",
  learn: [
    { h: "Pattern 1: count what matches",
      p: "Most loop problems are one of a few patterns. Counting: start at 0, add 1 when an item matches.",
      code: `rain = [12, 0, 5, 0, 30, 0, 8]   # mm of rain each day
dry_days = 0
for mm in rain:
    if mm == 0:
        dry_days += 1
print("Dry days:", dry_days)` },
    { h: "Pattern 2: best so far",
      p: "To find the biggest, start with the <b>first item</b> as your best, then replace it whenever you see something bigger. Python has <code>max()</code> built in, but interviewers often ask you to write this yourself, and the same idea finds the longest word, the cheapest price or the earliest date. (The list must have at least one item.)",
      code: `rain = [12, 0, 5, 0, 30, 0, 8]
wettest = rain[0]
for mm in rain:
    if mm > wettest:
        wettest = mm
print("Wettest:", wettest, "| check:", max(rain))` },
    { h: "Pattern 3: build a new list",
      p: "Start with an empty list, and <code>.append()</code> the items you want to keep, or changed versions of them. This is called <b>filtering</b> (keeping some) and <b>mapping</b> (changing each).",
      code: `rain = [12, 0, 5, 0, 30, 0, 8]
heavy = []
for mm in rain:
    if mm >= 10:
        heavy.append(mm)
in_cm = []
for mm in rain:
    in_cm.append(mm / 10)
print(heavy)
print(in_cm)` },
    { h: "Turn text into a list with split()",
      p: "Data often arrives as one line of text. <code>.split()</code> breaks it at spaces into a list of strings. Each piece is still text, so convert with <code>int()</code> before doing math. <code>sum(numbers)</code> adds up a list of numbers. <code>.split(\",\")</code> splits at commas instead, and <code>\", \".join(words)</code> does the opposite: it glues a list of strings into one.",
      code: `line = "12 0 5 30"
parts = line.split()
print(parts)
numbers = []
for p in parts:
    numbers.append(int(p))
print(numbers, "total", sum(numbers))
print("a,b,c".split(","))
print(", ".join(["chai", "lassi"]))` },
    { h: "Pattern 4: a loop inside a loop",
      p: "A loop can sit inside another loop. For every lap of the outer loop, the inner loop runs all the way through. You'll use this for grids, pairs of items and the star patterns that show up in many company tests. <code>break</code> only leaves the inner loop.",
      code: `for row in range(1, 4):
    line = ""
    for col in range(row):
        line = line + "*"
    print(line)` }
  ],
  think: [
    { type: "predict", q: "What does this print?", code: `words = ["tea", "coffee", "milk", "tea"]
count = 0
for w in words:
    if len(w) > 3:
        count += 1
print(count)`, answer: "2",
      why: "Only \"coffee\" (6 letters) and \"milk\" (4) have more than 3 letters. \"tea\" has exactly 3, and 3 &gt; 3 is False." },
    { type: "mcq", q: "January temperatures in Leh are <code>[-8, -3, -12]</code>. This code says the highest is 0. Why?", code: `temps = [-8, -3, -12]
highest = 0
for t in temps:
    if t > highest:
        highest = t
print(highest)`, options: ["max() is broken", "Starting at 0 beats every negative number", "The loop skips the first item", "-3 is smaller than -8"], answer: 1,
      why: "None of the temperatures is above 0, so <code>highest</code> never changes. Start with the first item: <code>highest = temps[0]</code>. Then it works for any numbers." },
    { type: "fill", q: "Fill the blanks to keep only the even numbers.", code: `nums = [3, 8, 5, 12, 7, 6]
evens = ___
for n in nums:
    if n % 2 ___ 0:
        evens.___(n)
print(evens)`, answers: ["[]", "==", "append"], expect: ["[8, 12, 6]"], wrong: [["[]", "!=", "append"]],
      why: "Start with an empty list, test each number with <code>n % 2 == 0</code>, and append the ones that pass." },
    { type: "multi", q: "<code>nums = [4, 9, 2]</code>. Which of these give 9?", options: ["max(nums)", "sorted(nums)[-1]", "nums[-1]", "sorted(nums)[0]"], answer: [0, 1],
      why: "<code>max</code> finds the biggest, and the last item of a sorted list is the biggest. <code>nums[-1]</code> is just the last item as written (2), and <code>sorted(nums)[0]</code> is the smallest." },
    { type: "predict", q: "What does this nested loop print?", code: `for a in range(1, 3):
    for b in range(1, 4):
        print(a, b)`, answer: "1 1\n1 2\n1 3\n2 1\n2 2\n2 3",
      why: "For each value of a, the inner loop runs b through 1, 2, 3 completely before a moves on." },
    { type: "mcq", q: "What does this print?", code: `nums = [1, -2, -3, 4]
for n in nums:
    if n < 0:
        nums.remove(n)
print(nums)`, options: ["[1, 4]", "[1, -3, 4]", "[1, -2, 4]", "An error"], answer: 1,
      why: "Removing -2 shifts every later item one place left, so the loop never sees -3. Don't change a list while looping over it. Build a new list instead (Pattern 3)." }
  ],
  code: {
    brief: "Write a monsoon report. The user types each day's rainfall in mm on one line, separated by spaces (there is always at least one number). Use a <code>for</code> loop. Print exactly these four lines:<br>• <code>Days: 5</code> (how many days)<br>• <code>Total: 47 mm</code> (the total rainfall)<br>• <code>Wettest: day 5 (30 mm)</code>, counting days from 1. If two days have the same highest amount, report the earlier day.<br>• <code>Dry days: 2</code> (how many days had 0 mm)",
    sample: "Rain? 12 0 5 0 30\nDays: 5\nTotal: 47 mm\nWettest: day 5 (30 mm)\nDry days: 2",
    starter: `line = input("Rain? ")
# 1. Turn the line into a list of ints
# 2. Days and total
# 3. Wettest day: best so far, plus its day number
# 4. Count the dry days
# 5. Print the four lines
`,
    tests: [
      { in: ["12 0 5 0 30"], out: ["Days: 5", "Total: 47 mm", "Wettest: day 5 (30 mm)", "Dry days: 2"], only: true, inOrder: true },
      { in: ["40 3 40 1"], out: ["Days: 4", "Total: 84 mm", "Wettest: day 1 (40 mm)", "Dry days: 0"], only: true, inOrder: true },
      { in: ["0 0 0"], out: ["Days: 3", "Total: 0 mm", "Wettest: day 1 (0 mm)", "Dry days: 3"], only: true, inOrder: true }
    ],
    fuzz: { n: 10, what: "random rainfall", gen: (r) => ({ in: [Array.from({ length: r.int(1, 12) }, () => r.pick([0, 0, r.int(1, 9), r.int(10, 80)])).join(" ")] }) },
    must: [["\\.split\\(", "Use <code>.split()</code> to break the line into pieces."], ["\\bfor\\b", "Use a <code>for</code> loop over the days."]],
    hints: [
      "First build a list of ints: split the line, loop over the pieces, and append <code>int(piece)</code>.",
      "Days is <code>len(rain)</code>. For the wettest day, keep track of both the best amount and its day number. Use <code>&gt;</code>, not <code>&gt;=</code>, so ties keep the first day.",
      "<code>for day, mm in enumerate(rain, start=1):</code> gives you the day number and the amount together."
    ],
    solution: `line = input("Rain? ")
rain = []
for piece in line.split():
    rain.append(int(piece))
best_day = 1
best = rain[0]
dry = 0
for day, mm in enumerate(rain, start=1):
    if mm > best:
        best = mm
        best_day = day
    if mm == 0:
        dry += 1
print(f"Days: {len(rain)}")
print(f"Total: {sum(rain)} mm")
print(f"Wettest: day {best_day} ({best} mm)")
print(f"Dry days: {dry}")`,
    alts: [`rain = [int(x) for x in input("Rain? ").split()]
wettest = max(rain)
print("Days:", len(rain))
print("Total:", sum(rain), "mm")
print(f"Wettest: day {rain.index(wettest) + 1} ({wettest} mm)")
print("Dry days:", rain.count(0))`],
    wrong: [{ code: `line = input("Rain? ")
rain = []
for piece in line.split():
    rain.append(int(piece))
best_day = 1
best = rain[0]
dry = 0
for day, mm in enumerate(rain, start=1):
    if mm >= best:
        best = mm
        best_day = day
    if mm == 0:
        dry += 1
print(f"Days: {len(rain)}")
print(f"Total: {sum(rain)} mm")
print(f"Wettest: day {best_day} ({best} mm)")
print(f"Dry days: {dry}")`, why: "ties pick the last day" }]
  },
  bug: {
    brief: "<b>AI code review.</b> An AI sidekick wrote this to report the <b>first</b> day the bank balance went below zero. It runs, but the answer is wrong. Trace the balance day by day.",
    code: `# AI-written: return the first day (counting from 1) the balance went negative
def first_negative_day(balance, changes):
    first_bad = None
    for day in range(len(changes)):
        balance += changes[day]
        if balance < 0:
            first_bad = day + 1
    return first_bad

print(first_negative_day(100, [-30, -50, 20, -60, -40, -10]))`,
    tests: [{ call: "first_negative_day(100, [-30, -50, 20, -60, -40, -10])", expect: "4" }, { call: "first_negative_day(10, [-20, 5, -1, -30])", expect: "1" }, { call: "first_negative_day(50, [10, -70, 100, -200])", expect: "2" }, { call: "first_negative_day(5, [1, 2])", expect: "None" }],
    hint: "The balance goes 70, 20, 40, -20, -60, -70. The code keeps overwriting <code>first_bad</code>. How do you stop looking once you've found the first one?",
    fix: `def first_negative_day(balance, changes):
    first_bad = None
    for day in range(len(changes)):
        balance += changes[day]
        if balance < 0:
            first_bad = day + 1
            break
    return first_bad

print(first_negative_day(100, [-30, -50, 20, -60, -40, -10]))`,
    lesson: "\"First\" usually means: stop at the first match with <code>break</code>. Without it, you get the last match."
  },
  explain: "Describe the \"best so far\" pattern in plain words. Why should the starting value be the first item, not 0?",
  cards: [
    { q: "To count matches in a loop, the counter starts at…", options: ["1", "0", "The first item", "None"], answer: 1 },
    { q: "What does <code>\"5 10 15\".split()</code> give?", options: ["[5, 10, 15]", "[\"5\", \"10\", \"15\"]", "\"51015\"", "30"], answer: 1 },
    { q: "In \"best so far\", what should the starting best be?", options: ["0", "The first item", "-1", "None"], answer: 1 },
    { q: "What does <code>\", \".join([\"a\", \"b\", \"c\"])</code> give?", options: ["\"a, b, c\"", "[\"a\", \"b\", \"c\"]", "\"abc\"", "An error"], answer: 0 }
  ],
  skills: { python: 3, logic: 4, debug: 3, talk: 2 }
},
/* ───────────────────────────── 2-5 ───────────────────────────── */
{
  id: "2-5", world: 2, n: 5, title: "Spellbook", concept: "functions, return",
  learn: [
    { h: "A function is a named recipe",
      p: "<code>def</code> creates a function: a named block of code you can run whenever you want by <b>calling</b> it with brackets. Defining it doesn't run it. Calling it does.",
      code: `def chant():
    print("Abra...")
    print("...cadabra!")

chant()
chant()` },
    { h: "Parameters are a function's inputs",
      p: "Values in the brackets of <code>def</code> are <b>parameters</b>. When you call the function, the values you pass in (the <b>arguments</b>) fill them in, in order.",
      code: `def greet(name, city):
    print(f"Namaste, {name} from {city}!")

greet("Asha", "Jaipur")
greet("Ravi", "Kochi")` },
    { h: "return hands a value back",
      p: "<code>print</code> only shows something on the screen. <code>return</code> gives a value <b>back</b> to the code that called the function, so you can store it, use it in math, or test it. A function with no return gives back <code>None</code>.",
      code: `def area(width, height):
    return width * height

room = area(3, 4)
garden = area(2, 5)
print("Total:", room + garden)

def shout(word):
    print(word.upper())   # shows, but returns None
result = shout("hi")
print("shout gave back:", result)` },
    { h: "Functions can be tested",
      p: "Because a function returns a value, you can check it automatically: give it inputs, compare the answer. From now on the checker often <b>calls your functions</b> directly, so their names must match the task exactly. This is how automated tests work in real projects.",
      code: `def to_rupees(dollars):
    return dollars * 84

print(to_rupees(1) == 84)
print(to_rupees(10) == 840)` }
  ],
  think: [
    { type: "mcq", q: "What does this print?", code: `def double(n):
    print(n * 2)

x = double(5)
print(x)`, options: ["10, then 10", "10, then None", "None", "An error"], answer: 1,
      why: "Calling <code>double(5)</code> prints 10, but the function has no <code>return</code>, so it gives back <code>None</code>. That None is stored in x and printed." },
    { type: "predict", q: "What does this print?", code: `def mystery(a, b):
    return a * 2 + b

print(mystery(3, 4))
print(mystery(mystery(1, 1), 0))`, answer: "10\n6",
      why: "<code>mystery(3, 4)</code> is 3 × 2 + 4 = 10. For the second, work inside out: <code>mystery(1, 1)</code> is 3, then <code>mystery(3, 0)</code> is 6." },
    { type: "spot", q: "This crashes on the last line with a TypeError. Which line is the <i>real</i> cause?", code: `def add_tax(price):
    total = price * 1.18
bill = add_tax(100)
print(bill + 20)`, answer: 2,
      why: "The function works out <code>total</code> but never returns it, so <code>bill</code> is <code>None</code>, and <code>None + 20</code> crashes. The crash shows up on line 4 but the cause is line 2: it should be <code>return price * 1.18</code>." },
    { type: "order", indent: true, q: "Build a function that returns the bigger of two numbers, then use it. One line doesn't belong.",
      lines: ["def bigger(a, b):", "    if a > b:", "        return a", "    return b", "print(bigger(3, 9), bigger(8, 2))"],
      distractors: ["    print(a)"], expect: ["9 8"],
      why: "If a is bigger, return it and the function stops. Otherwise the last line returns b. A function should return its answer, not print it." },
    { type: "mcq", q: "What does this print?", code: `def greet():
    return "Namaste"

print(greet)`, options: ["Namaste", "greet", "Something like &lt;function greet at 0x...&gt;", "An error"], answer: 2,
      why: "Without brackets you only <i>name</i> the function, you don't run it. Python shows the function object itself. Write <code>greet()</code> to call it." }
  ],
  code: {
    brief: "Write three small spells. Don't call input() or print inside them: each one <b>returns</b> its answer.<br>• <code>to_celsius(f)</code>: converts Fahrenheit to Celsius with <code>(f - 32) * 5 / 9</code>, rounded to 1 decimal place with <code>round(x, 1)</code>.<br>• <code>is_monsoon(month)</code>: True for months 6 to 9 (June to September), otherwise False.<br>• <code>chai_cost(cups, price)</code>: the total cost. Orders of 10 cups or more get 10% off.",
    sample: ">>> to_celsius(212)\n100.0\n>>> is_monsoon(7)\nTrue\n>>> chai_cost(10, 15)\n135.0",
    starter: `def to_celsius(f):
    pass  # replace pass with your code


def is_monsoon(month):
    pass


def chai_cost(cups, price):
    pass


# Try them out here. The checker calls them directly.
print(to_celsius(212))
`,
    tests: [
      { call: "to_celsius(212)", expect: "100.0", silent: true },
      { call: "to_celsius(98.6)", expect: "37.0" },
      { call: "to_celsius(-40)", expect: "-40.0" },
      { call: "to_celsius(100)", expect: "37.8" },
      { call: "is_monsoon(6)", expect: "True", silent: true },
      { call: "is_monsoon(9)", expect: "True" },
      { call: "is_monsoon(5)", expect: "False" },
      { call: "is_monsoon(10)", expect: "False" },
      { call: "chai_cost(2, 15)", expect: "30", silent: true },
      { call: "chai_cost(10, 15)", expect: "135.0" },
      { call: "chai_cost(9, 20)", expect: "180" },
      { call: "chai_cost(20, 10)", expect: "180.0" }
    ],
    must: [["def\\s+to_celsius", "Define a function called <code>to_celsius</code>."], ["def\\s+is_monsoon", "Define a function called <code>is_monsoon</code>."], ["def\\s+chai_cost", "Define a function called <code>chai_cost</code>."]],
    hints: [
      "Each function must end by <code>return</code>-ing a value. Work the value out, then return it. No <code>print</code> or <code>input</code> inside.",
      "<code>to_celsius</code>: <code>return round((f - 32) * 5 / 9, 1)</code>. <code>is_monsoon</code> can return a comparison directly: <code>return 6 &lt;= month &lt;= 9</code>.",
      "<code>chai_cost</code>: work out <code>total = cups * price</code>, then <code>if cups &gt;= 10:</code> return <code>total * 0.9</code>, otherwise return total."
    ],
    solution: `def to_celsius(f):
    return round((f - 32) * 5 / 9, 1)


def is_monsoon(month):
    return 6 <= month <= 9


def chai_cost(cups, price):
    total = cups * price
    if cups >= 10:
        return total * 0.9
    return total


print(to_celsius(212))`,
    alts: [`def to_celsius(f):
    c = (f - 32) * 5 / 9
    return round(c, 1)

def is_monsoon(month):
    if month >= 6 and month <= 9:
        return True
    else:
        return False

def chai_cost(cups, price):
    if cups >= 10:
        return cups * price * 90 / 100
    else:
        return cups * price`],
    wrong: [{ code: `def to_celsius(f):
    print(round((f - 32) * 5 / 9, 1))

def is_monsoon(month):
    return 6 <= month <= 9

def chai_cost(cups, price):
    return cups * price`, why: "prints instead of returning, no discount" },
      { code: `def to_celsius(f):
    return round((f - 32) * 5 / 9, 1)

def is_monsoon(month):
    return 6 < month < 9

def chai_cost(cups, price):
    if cups > 10:
        return cups * price * 0.9
    return cups * price`, why: "boundaries wrong" }]
  },
  bug: {
    brief: "The report card says <code>Average: None</code>. Find out why the average gets lost. The function should <b>return</b> the average, not print it.",
    code: `def average(scores):
    total = 0
    for s in scores:
        total += s
    print(total / len(scores))

result = average([80, 90, 70])
print(f"Average: {result}")`,
    tests: [{ call: "average([80, 90, 70])", expect: "80.0", silent: true }, { call: "average([5])", expect: "5.0" }, { call: "average([1, 2])", expect: "1.5" }],
    hint: "Does the function <i>give back</i> the average, or only show it?",
    fix: `def average(scores):
    total = 0
    for s in scores:
        total += s
    return total / len(scores)

result = average([80, 90, 70])
print(f"Average: {result}")`,
    lesson: "If a value comes out as <code>None</code>, check whether a function forgot to <code>return</code>."
  },
  explain: "What's the difference between <code>print</code> and <code>return</code> inside a function? Why does it matter for testing?",
  cards: [
    { q: "What does a function return if it has no <code>return</code> line?", options: ["0", "An empty string", "None", "An error"], answer: 2 },
    { q: "In <code>def greet(name):</code>, <code>name</code> is a…", options: ["argument", "parameter", "return value", "module"], answer: 1 },
    { q: "Does <code>def</code> run the code inside the function?", options: ["Yes, straight away", "No, only when it's called", "Only the first line", "Only if it has a return"], answer: 1 }
  ],
  skills: { python: 4, logic: 2, debug: 2, talk: 2, test: 1 }
},
/* ───────────────────────────── 2-6 ───────────────────────────── */
{
  id: "2-6", world: 2, n: 6, title: "Function Forge", concept: "defaults, scope, small functions",
  learn: [
    { h: "Default values",
      p: "A parameter can have a <b>default</b>, used when the caller leaves it out. Parameters with defaults go after the ones without. You can also name an argument when calling, like <code>sugar=0</code>, which makes calls easy to read.",
      code: `def make_tea(cups, sugar=1):
    return f"{cups} cups, {sugar} spoon(s) of sugar each"

print(make_tea(2))
print(make_tea(3, 2))
print(make_tea(1, sugar=0))` },
    { h: "Variables inside stay inside",
      p: "A variable created inside a function is <b>local</b>: it only exists while the function runs. Code outside can't see it. To get a value out, <code>return</code> it. This is called <b>scope</b>, and it stops one function from changing another function's variables by mistake.",
      err: true,
      code: `def brew():
    flavour = "masala"
    return flavour

print(brew())
print(flavour)   # NameError: flavour only lived inside brew()` },
    { h: "Build big things from small functions",
      p: "Good programmers split problems into small functions that each do one job, then combine them. Small functions are easy to name, test and reuse. Strings have handy yes/no checks too: <code>ch.isdigit()</code>, <code>ch.isupper()</code>, <code>ch.isalpha()</code>.",
      code: `def is_vowel(ch):
    return ch.lower() in "aeiou"

def count_vowels(word):
    count = 0
    for ch in word:
        if is_vowel(ch):
            count += 1
    return count

print(count_vowels("Bengaluru"))
print("7".isdigit(), "A".isupper())` },
    { h: "Return early, or return two things",
      p: "<code>return</code> ends the function immediately, so you can return as soon as you know the answer. And a function can return several values at once, separated by commas. Python packs them into a <b>tuple</b>: like a list, but written with round brackets, and it can't be changed, e.g. <code>(5, 30)</code>. You unpack it into separate variables.",
      code: `def first_even(nums):
    for n in nums:
        if n % 2 == 0:
            return n      # stop as soon as we find one
    return None           # only reached if no even number

def lowest_highest(nums):
    return min(nums), max(nums)

print(first_even([3, 7, 10, 4]))
low, high = lowest_highest([12, 5, 30])
print(low, high)` }
  ],
  think: [
    { type: "predict", q: "What does this print?", code: `x = 10
def change():
    x = 99
    return x

print(change())
print(x)`, answer: "99\n10",
      why: "The <code>x = 99</code> inside the function makes a new <i>local</i> x. The outside x is untouched, so it's still 10." },
    { type: "mcq", q: "What does <code>greet(\"Asha\", \"Hi\")</code> return?", code: `def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"`, options: ["Hello, Asha!", "Hi, Asha!", "Asha, Hi!", "An error"], answer: 1,
      why: "The second argument replaces the default. The default \"Hello\" is only used when you leave it out." },
    { type: "match", q: "Match each word with its meaning.",
      pairs: [["parameter", "a name in the def line that receives a value"], ["argument", "the actual value you pass in a call"], ["return value", "what the call gives back"], ["local variable", "only exists inside the function"], ["default value", "used when the caller leaves it out"]],
      why: "Interviewers use these words, so it's worth knowing them exactly." },
    { type: "order", indent: true, q: "Build <code>has_digit</code>: True if the text contains any digit. One line doesn't belong.",
      lines: ["def has_digit(text):", "    for ch in text:", "        if ch.isdigit():", "            return True", "    return False", "print(has_digit(\"abc1\"), has_digit(\"abc\"))"],
      distractors: ["        else:"], expect: ["True False"],
      why: "Return True as soon as you find a digit. You can only say False after checking <i>every</i> character, so <code>return False</code> goes after the loop. An <code>else: return False</code> inside the loop would give up after the first letter." },
    { type: "mcq", q: "Watch out: what does this print?", code: `def add(item, bag=[]):
    bag.append(item)
    return bag

print(add("map"))
print(add("rope"))`, options: ["['map'] then ['rope']", "['map'] then ['map', 'rope']", "['rope'] twice", "An error"], answer: 1,
      why: "A default value is created once, when the function is defined, and then shared by every call. So the same list keeps growing. Use <code>bag=None</code> and create the list inside instead. Interviewers love this one." }
  ],
  code: {
    brief: "Write a password strength checker using two functions.<br>• <code>has_digit(text)</code> returns True if the text contains at least one digit.<br>• <code>strength(password)</code> returns <code>\"weak\"</code>, <code>\"medium\"</code> or <code>\"strong\"</code>:<br>&nbsp;&nbsp;– fewer than 8 characters: <code>\"weak\"</code><br>&nbsp;&nbsp;– 8 or more, with a digit <b>and</b> an uppercase letter: <code>\"strong\"</code><br>&nbsp;&nbsp;– anything else: <code>\"medium\"</code><br>Use <code>has_digit</code> inside <code>strength</code>.",
    sample: ">>> strength(\"abc\")\n'weak'\n>>> strength(\"abcdefgh\")\n'medium'\n>>> strength(\"Abcdefg1\")\n'strong'",
    starter: `def has_digit(text):
    pass


def strength(password):
    pass


print(strength("Monsoon2026"))
`,
    tests: [
      { call: "has_digit('abc1')", expect: "True", silent: true },
      { call: "has_digit('a7b')", expect: "True" },
      { call: "has_digit('abc')", expect: "False" },
      { call: "has_digit('ab-c')", expect: "False" },
      { call: "has_digit('')", expect: "False" },
      { call: "strength('abc')", expect: "'weak'", silent: true },
      { call: "strength('Ab1')", expect: "'weak'" },
      { call: "strength('abcdefgh')", expect: "'medium'" },
      { call: "strength('abcdefg1')", expect: "'medium'" },
      { call: "strength('ABCDEFGH')", expect: "'medium'" },
      { call: "strength('Abcdefg1')", expect: "'strong'" },
      { call: "strength('12345678')", expect: "'medium'" }
    ],
    fuzz: { n: 12, what: "random passwords", gen: (r) => { const set = "abcdefgXYZ019"; return { call: "strength(" + JSON.stringify(Array.from({ length: r.int(4, 12) }, () => r.pick(set.split(""))).join("")) + ")" }; } },
    must: [["def\\s+has_digit", "Define <code>has_digit</code>."], ["def\\s+strength", "Define <code>strength</code>."], ["def\\s+strength\\s*\\([^)]*\\)\\s*:[^\\n]*(\\n([ \\t]+[^\\n]*)?)*?\\n[ \\t]+[^\\n]*has_digit\\(", "Call <code>has_digit</code> inside <code>strength</code>."]],
    hints: [
      "In <code>strength</code>, check the length first: <code>if len(password) &lt; 8: return \"weak\"</code>.",
      "You'll need a check for uppercase too. Write a helper <code>has_upper</code>, shaped just like <code>has_digit</code>, using <code>ch.isupper()</code>.",
      "<code>has_digit</code>: loop over the letters, and <code>return True</code> as soon as <code>ch.isdigit()</code>. After the loop, <code>return False</code>."
    ],
    solution: `def has_digit(text):
    for ch in text:
        if ch.isdigit():
            return True
    return False


def has_upper(text):
    for ch in text:
        if ch.isupper():
            return True
    return False


def strength(password):
    if len(password) < 8:
        return "weak"
    if has_digit(password) and has_upper(password):
        return "strong"
    return "medium"


print(strength("Monsoon2026"))`,
    alts: [`def has_digit(text):
    return any(ch.isdigit() for ch in text)

def strength(password):
    upper = False
    for ch in password:
        if ch.isupper():
            upper = True
    if len(password) >= 8 and has_digit(password) and upper:
        return "strong"
    elif len(password) >= 8:
        return "medium"
    else:
        return "weak"`],
    wrong: [{ code: `def has_digit(text):
    for ch in text:
        if ch.isdigit():
            return True
        else:
            return False

def strength(password):
    if len(password) < 8:
        return "weak"
    if has_digit(password) and password != password.lower():
        return "strong"
    return "medium"`, why: "has_digit only checks the first letter" }]
  },
  bug: {
    brief: "<b>AI code review.</b> The AI's checker says <code>strength(\"Abcdefgh\")</code> is strong, but that password has no digit. No error appears. Find the wrong line.",
    code: `# AI-written
def has_digit(text):
    for ch in text:
        if ch.isdigit():
            return True
    return False


def has_upper(text):
    for ch in text:
        if ch.isupper():
            return True
    return False


def strength(password):
    if len(password) < 8:
        return "weak"
    if has_digit and has_upper(password):
        return "strong"
    return "medium"

print(strength("Abcdefgh"))`,
    tests: [{ call: "strength('Abcdefgh')", expect: "'medium'" }, { call: "strength('Abcdefg1')", expect: "'strong'" }, { call: "strength('abc')", expect: "'weak'" }, { call: "strength('abcdefg1')", expect: "'medium'" }],
    hints: ["Is <code>has_digit</code> actually being called on line 18? A function's name without brackets always counts as True."],
    fix: `def has_digit(text):
    for ch in text:
        if ch.isdigit():
            return True
    return False


def has_upper(text):
    for ch in text:
        if ch.isupper():
            return True
    return False


def strength(password):
    if len(password) < 8:
        return "weak"
    if has_digit(password) and has_upper(password):
        return "strong"
    return "medium"

print(strength("Abcdefgh"))`,
    lesson: "A function only runs when you add brackets and arguments: <code>has_digit(password)</code>. Without them, Python just sees a function, which counts as True."
  },
  explain: "Why do programmers split a program into small functions? Give two reasons, using the password checker as an example.",
  cards: [
    { q: "A variable created inside a function can be used…", options: ["Anywhere", "Only inside that function", "Only after the function", "Only in loops"], answer: 1 },
    { q: "What does <code>return</code> do to the rest of the function?", options: ["Nothing, it keeps going", "Ends the function straight away", "Skips one line", "Restarts it"], answer: 1 },
    { q: "<code>def f(a, b=2)</code>. What is b in <code>f(5)</code>?", options: ["5", "2", "None", "An error"], answer: 1 },
    { q: "Code after a <code>return</code> line in the same block…", options: ["Runs next", "Never runs", "Runs at the end", "Causes an error"], answer: 1 }
  ],
  skills: { python: 4, logic: 3, debug: 3, talk: 2, test: 1 }
},
/* ───────────────────────────── 2-7 ───────────────────────────── */
{
  id: "2-7", world: 2, n: 7, title: "Treasure Map", concept: "dictionaries",
  learn: [
    { h: "A dictionary maps keys to values",
      p: "A list finds things by position. A <b>dictionary</b> finds things by <b>key</b>, like a word in a real dictionary. Curly braces, then <code>key: value</code> pairs. Look a value up with its key in square brackets.",
      code: `prices = {"chai": 15, "samosa": 20, "vada pav": 25}
print(prices["samosa"])
print(len(prices), "items on the menu")` },
    { h: "Add, change and check",
      p: "Assigning to a new key adds it. Assigning to an existing key changes it. Looking up a missing key with <code>[]</code> crashes with a <b>KeyError</b>, so check with <code>in</code> first, or use <code>.get(key, default)</code>, which returns the default instead of crashing.",
      code: `prices = {"chai": 15, "samosa": 20}
prices["dosa"] = 60      # add
prices["chai"] = 18      # change
print(prices)
print("idli" in prices)
print(prices.get("idli", "not on the menu"))` },
    { h: "Loop over a dictionary",
      p: "Looping over a dictionary gives you its <b>keys</b>. Use <code>.items()</code> to get each key and value together, and <code>.values()</code> for just the values, e.g. <code>sum(prices.values())</code>. Dictionaries remember the order you added things.",
      code: `prices = {"chai": 15, "samosa": 20, "dosa": 60}
for item in prices:
    print(item)
for item, price in prices.items():
    print(f"{item}: Rs {price}")
print("Whole menu costs Rs", sum(prices.values()))` },
    { h: "Counting with a dictionary",
      p: "One of the most useful patterns in all of programming: count things with a dictionary. For each item, take the count so far (0 if it's new) and add 1. <code>counts.get(v, 0)</code> does the \"0 if new\" part.",
      code: `votes = ["chai", "coffee", "chai", "lassi", "chai", "coffee"]
counts = {}
for v in votes:
    counts[v] = counts.get(v, 0) + 1
print(counts)` }
  ],
  think: [
    { type: "predict", q: "What does this print?", code: `counts = {}
for ch in "banana":
    counts[ch] = counts.get(ch, 0) + 1
print(counts)`, answer: "{'b': 1, 'a': 3, 'n': 2}",
      why: "Each letter is a key. The first time a letter is seen, <code>.get</code> gives 0, so it becomes 1. Keys stay in the order they were first added: b, a, n." },
    { type: "mcq", q: "What happens here?", code: `ages = {"Asha": 21, "Ravi": 24}
print(ages["Meera"])`, options: ["It prints None", "It prints 0", "A KeyError", "It prints {}"], answer: 2,
      why: "Square brackets on a missing key crash with KeyError. <code>ages.get(\"Meera\")</code> would give None instead." },
    { type: "mcq", q: "What does this loop print?", code: `stock = {"pens": 12, "books": 3}
for x in stock:
    print(x)`, options: ["12 and 3", "pens and books", "(pens, 12) and (books, 3)", "An error"], answer: 1,
      why: "Looping over a dictionary gives the keys. Use <code>stock.values()</code> for the values, or <code>stock.items()</code> for both." },
    { type: "mcq", q: "What does this print?", code: `city = {"name": "Asha", "home": "Delhi"}
print("Delhi" in city)`, options: ["True", "False", "An error", "\"home\""], answer: 1,
      why: "<code>in</code> checks the <b>keys</b> of a dictionary, not the values. \"Delhi\" is a value. Use <code>\"Delhi\" in city.values()</code> to search values." },
    { type: "multi", q: "Which of these can be dictionary keys?", options: ["\"name\"", "42", "(1, 2)", "[1, 2]"], answer: [0, 1, 2],
      why: "Keys must be values that can't change: strings, numbers and tuples are fine. Lists can change, so they can't be keys." }
  ],
  code: {
    brief: "The village scribe wants a word counter. Ask <code>Sentence? </code>. Then:<br>• Clean each word: make it lowercase with <code>word.lower()</code>, and remove <code>.,!?</code> from its start and end with <code>.strip(\".,!?\")</code>. So <code>The</code>, <code>the</code> and <code>the.</code> all count as <code>the</code>.<br>• Print each word and its count, like <code>the: 3</code>, in the order the words first appear.<br>• Last, print <code>Most common: the (3)</code>: the word with the highest count and its count in round brackets. If two words have the same count, choose the one that appeared first.<br>Print nothing else.",
    sample: "Sentence? The cat and the hat. The end!\nthe: 3\ncat: 1\nand: 1\nhat: 1\nend: 1\nMost common: the (3)",
    starter: `sentence = input("Sentence? ")
counts = {}
# 1. Clean each word and count it in the dictionary
# 2. Print each word and its count
# 3. Find and print the most common word
`,
    tests: [
      { in: ["The cat and the hat. The end!"], out: ["the: 3", "cat: 1", "and: 1", "hat: 1", "end: 1", "Most common: the (3)"], only: true, inOrder: true },
      { in: ["Chai, chai, CHAI! Coffee?"], out: ["chai: 3", "coffee: 1", "Most common: chai (3)"], only: true, inOrder: true },
      { in: ["one two two one"], out: ["one: 2", "two: 2", "Most common: one (2)"], only: true, inOrder: true }
    ],
    fuzz: { n: 8, what: "random sentences", gen: (r) => ({ in: [Array.from({ length: r.int(1, 9) }, () => r.pick(["rain", "Rain!", "tea", "TEA", "sun,", "sun", "go?", "Go"])).join(" ")] }) },
    must: [["\\.get\\(|\\bin\\s+counts\\b|Counter", "Count with the dictionary: use <code>.get()</code> or check <code>in counts</code>."]],
    hints: [
      "Loop over <code>sentence.split()</code>, clean each word, and use the counting pattern from the lesson.",
      "Clean and count: <code>w = word.lower().strip(\".,!?\")</code>, then <code>counts[w] = counts.get(w, 0) + 1</code>. Print with <code>for w, n in counts.items():</code>.",
      "For the most common word, use the best-so-far pattern over <code>counts.items()</code>. Use <code>&gt;</code> so ties keep the earlier word."
    ],
    solution: `sentence = input("Sentence? ")
counts = {}
for word in sentence.split():
    w = word.lower().strip(".,!?")
    counts[w] = counts.get(w, 0) + 1
best_word = ""
best = 0
for w, n in counts.items():
    print(f"{w}: {n}")
    if n > best:
        best = n
        best_word = w
print(f"Most common: {best_word} ({best})")`,
    alts: [`sentence = input("Sentence? ")
counts = {}
for word in sentence.split():
    w = word.lower().strip(".,!?")
    if w in counts:
        counts[w] += 1
    else:
        counts[w] = 1
for w in counts:
    print(w + ": " + str(counts[w]))
top = max(counts, key=counts.get)
print(f"Most common: {top} ({counts[top]})")`],
    wrong: [{ code: `sentence = input("Sentence? ")
counts = {}
for word in sentence.split():
    counts[word] = counts.get(word, 0) + 1
best_word = ""
best = 0
for w, n in counts.items():
    print(f"{w}: {n}")
    if n > best:
        best = n
        best_word = w
print(f"Most common: {best_word} ({best})")`, why: "no lowercasing or stripping" }]
  },
  bug: {
    brief: "This vote counter crashes with a KeyError on the very first vote. Read the error, then fix it so every candidate is counted.",
    code: `def tally(votes):
    counts = {}
    for name in votes:
        counts[name] += 1
    return counts

print(tally(["Asha", "Ravi", "Asha", "Meera", "Asha"]))`,
    tests: [{ call: "tally(['Asha', 'Ravi', 'Asha', 'Meera', 'Asha'])", expect: "{'Asha': 3, 'Ravi': 1, 'Meera': 1}" }, { call: "tally(['Om', 'Om'])", expect: "{'Om': 2}" }, { call: "tally([])", expect: "{}" }],
    hint: "<code>counts[name] += 1</code> needs a number already stored under that name. What should a brand-new name start at?",
    fix: `def tally(votes):
    counts = {}
    for name in votes:
        counts[name] = counts.get(name, 0) + 1
    return counts

print(tally(["Asha", "Ravi", "Asha", "Meera", "Asha"]))`,
    lesson: "A KeyError names the missing key. <code>.get(key, 0)</code> gives new keys a starting value."
  },
  explain: "When would you use a dictionary instead of a list? Give a real-life example of each.",
  cards: [
    { q: "What does <code>d.get(\"x\", 0)</code> return if \"x\" isn't a key?", options: ["None", "0", "A KeyError", "\"x\""], answer: 1 },
    { q: "Looping <code>for k in d:</code> gives you…", options: ["The values", "The keys", "Pairs", "Indexes"], answer: 1 },
    { q: "Which can't be a dictionary key?", options: ["A string", "A number", "A list", "A tuple"], answer: 2 },
    { q: "What is <code>{\"a\": 1, \"a\": 2}</code>?", options: ["{'a': 1}", "{'a': 2}", "{'a': [1, 2]}", "An error"], answer: 1 }
  ],
  skills: { python: 3, logic: 3, debug: 2, talk: 2 }
},
/* ───────────────────────────── 2-8 BOSS ───────────────────────────── */
{
  id: "2-8", world: 2, n: 8, boss: true, title: "The Expense Tracker", concept: "Boss: a real terminal app",
  learn: [
    { h: "Boss rules",
      p: "This is your first real app, the kind you could show an employer. Only two new things: a list of dictionaries, and <code>main()</code> with the <code>__name__</code> check. Everything else you already know. Plan it as comments first: what data do you store, what commands are there, and what does each one print?",
      code: `# Data: a list of expenses. Each expense is a dictionary:
#   {"amount": 120, "category": "food"}
# Commands: add, list, total, quit
# Loop: ask for a command, do it, repeat until quit
expense = {"amount": 120, "category": "food"}
print(expense["category"], expense["amount"])` },
    { h: "A list of dictionaries",
      p: "Real apps store records like this: a list where every item is a dictionary with the same keys. It's how rows from a database or a website's data usually look in Python.",
      code: `expenses = [
    {"amount": 120, "category": "food"},
    {"amount": 40, "category": "bus"},
]
expenses.append({"amount": 60, "category": "food"})
for e in expenses:
    print(e["category"], e["amount"])` },
    { h: "main() and the __name__ check",
      p: "Professional Python files put the program's main loop in a function called <code>main()</code>, and only call it when the file is <b>run</b> directly, not when it's <b>imported</b> by another file or a test. That's what <code>if __name__ == \"__main__\":</code> checks. The checker uses this: it imports your file to test your functions without starting the loop.",
      code: `def double(n):
    return n * 2

def main():
    print("Running the app:", double(21))

if __name__ == "__main__":
    main()` },
    { h: "Checking for a valid number",
      p: "Users type anything. Check the text before calling <code>int()</code>. <code>text.isdigit()</code> is True only if the text is not empty and every character is a digit, so <code>\"-5\"</code> and <code>\"\"</code> give False. In <code>text.isdigit() and int(text) &gt; 0</code>, Python stops early: if the left side is False, <code>int(text)</code> never runs, so nothing crashes. <code>repr()</code> prints a value with its quotes, so you can see empty text. You'll learn a stronger way (try/except) in World 3.",
      code: `for text in ["120", "abc", "-5", "0", ""]:
    ok = text.isdigit() and int(text) > 0
    print(repr(text), "is a valid amount:", ok)` }
  ],
  think: [
    { type: "order", q: "Put the plan for the main loop in order.",
      lines: ["Create an empty list of expenses", "Ask for a command", "If it's quit, say goodbye and stop", "Otherwise do the command, then ask again"],
      why: "Set up the data once, then loop: ask, check for quit, act. The data must exist before the loop starts." },
    { type: "predict", q: "What does this print?", code: `expenses = [{"amount": 50, "category": "food"}, {"amount": 30, "category": "bus"}, {"amount": 20, "category": "food"}]
totals = {}
for e in expenses:
    c = e["category"]
    totals[c] = totals.get(c, 0) + e["amount"]
print(totals)`, answer: "{'food': 70, 'bus': 30}",
      why: "It's the counting pattern, but adding amounts instead of 1. food gets 50 + 20, bus gets 30." },
    { type: "mcq", q: "Why put the app's loop inside <code>main()</code> with <code>if __name__ == \"__main__\":</code>?", options: ["It runs faster", "So other files and tests can import the functions without starting the loop", "Python requires it", "It hides the code"], answer: 1,
      why: "When a test imports your file, <code>__name__</code> is the module's name, not \"__main__\", so the loop doesn't start and the test can call your functions directly." }
  ],
  code: {
    brief: "Build an expense tracker using a list of dictionaries, functions, and <code>main()</code> with the <code>__name__</code> check.<br><b>The function:</b> <code>total_by_category(expenses)</code> must <b>return</b> a dictionary of category totals, like <code>{\"food\": 150, \"bus\": 80}</code>. The checker calls it directly.<br><b>The app:</b> ask for commands with <code>&gt; </code>, again and again:<br>• <code>add</code>: ask <code>Amount? </code>. If it isn't a whole number above 0, print <code>Please enter a positive whole number.</code> and go back to the commands. Otherwise ask <code>Category? </code> and print <code>Added Rs 120 to food</code>.<br>• <code>list</code>: print each expense like <code>1. food: Rs 120</code>, numbered from 1. If there are none, print <code>No expenses yet.</code><br>• <code>total</code>: print <code>Total: Rs 230</code>, then one line per category in alphabetical order (A to Z), like <code>bus: Rs 80</code>. Use <code>sorted()</code>.<br>• <code>quit</code>: print <code>Bye! Expenses tracked: 3</code> and stop.<br>• anything else: <code>Unknown command: dance</code> (with the command typed).<br>Print nothing else, not even a menu.",
    sample: "> add\nAmount? 120\nCategory? food\nAdded Rs 120 to food\n> add\nAmount? 80\nCategory? bus\nAdded Rs 80 to bus\n> total\nTotal: Rs 200\nbus: Rs 80\nfood: Rs 120\n> quit\nBye! Expenses tracked: 2",
    starter: `def total_by_category(expenses):
    # Return a dict like {"food": 150, "bus": 80}
    pass


def main():
    expenses = []
    # Your command loop goes here


if __name__ == "__main__":
    main()
`,
    tests: [
      { call: "total_by_category([{'amount': 100, 'category': 'food'}, {'amount': 50, 'category': 'bus'}, {'amount': 20, 'category': 'food'}])", expect: "{'food': 120, 'bus': 50}", silent: true, label: "Calls <code>total_by_category</code> with 3 expenses" },
      { call: "total_by_category([])", expect: "{}", label: "Calls <code>total_by_category([])</code>" },
      { in: ["add", "120", "food", "add", "200", "bus", "add", "30", "food", "list", "total", "quit"], out: ["Added Rs 120 to food", "Added Rs 200 to bus", "Added Rs 30 to food", "1. food: Rs 120", "2. bus: Rs 200", "3. food: Rs 30", "Total: Rs 350", "bus: Rs 200", "food: Rs 150", "Bye! Expenses tracked: 3"], only: true, inOrder: true },
      { in: ["total", "list", "add", "abc", "add", "0", "add", "-5", "list", "quit"], out: ["Total: Rs 0", "No expenses yet.", "Please enter a positive whole number.", "Please enter a positive whole number.", "Please enter a positive whole number.", "No expenses yet.", "Bye! Expenses tracked: 0"], only: true, inOrder: true },
      { in: ["add", "45", "chai", "list", "dance", "quit"], out: ["Added Rs 45 to chai", "1. chai: Rs 45", "Unknown command: dance", "Bye! Expenses tracked: 1"], only: true, inOrder: true }
    ],
    must: [["def\\s+main\\s*\\(", "Put the command loop in a function called <code>main()</code>."], ["__name__\\s*==\\s*[\"']__main__[\"']|[\"']__main__[\"']\\s*==\\s*__name__", "Call <code>main()</code> inside <code>if __name__ == \"__main__\":</code>."], ["def\\s+total_by_category", "Define <code>total_by_category</code>."]],
    hints: [
      "Build it in steps. First make only <code>add</code> and <code>quit</code> work and press Run. Then add <code>list</code>, then <code>total</code>, then the error checks. <code>total_by_category</code> is the dictionary counting pattern, adding <code>e[\"amount\"]</code> instead of 1.",
      "In <code>main()</code>: <code>while True:</code>, <code>cmd = input(\"&gt; \")</code>, then <code>if cmd == \"add\":</code> … <code>elif cmd == \"list\":</code> … and so on. <code>break</code> after quit.",
      "For <code>total</code>: call <code>total_by_category(expenses)</code>, print the overall total, then loop over <code>sorted(totals)</code> to get the categories A–Z."
    ],
    solution: `def total_by_category(expenses):
    totals = {}
    for e in expenses:
        c = e["category"]
        totals[c] = totals.get(c, 0) + e["amount"]
    return totals


def main():
    expenses = []
    while True:
        cmd = input("> ")
        if cmd == "add":
            text = input("Amount? ")
            if not text.isdigit() or int(text) <= 0:
                print("Please enter a positive whole number.")
                continue
            amount = int(text)
            category = input("Category? ")
            expenses.append({"amount": amount, "category": category})
            print(f"Added Rs {amount} to {category}")
        elif cmd == "list":
            if not expenses:
                print("No expenses yet.")
            for i, e in enumerate(expenses, start=1):
                print(f"{i}. {e['category']}: Rs {e['amount']}")
        elif cmd == "total":
            totals = total_by_category(expenses)
            print(f"Total: Rs {sum(totals.values())}")
            for c in sorted(totals):
                print(f"{c}: Rs {totals[c]}")
        elif cmd == "quit":
            print(f"Bye! Expenses tracked: {len(expenses)}")
            break
        else:
            print(f"Unknown command: {cmd}")


if __name__ == "__main__":
    main()`,
    wrong: [{ code: `def total_by_category(expenses):
    totals = {}
    for e in expenses:
        totals[e["category"]] = e["amount"]
    return totals

def main():
    expenses = []
    while True:
        cmd = input("> ")
        if cmd == "add":
            text = input("Amount? ")
            category = input("Category? ")
            expenses.append({"amount": int(text), "category": category})
            print(f"Added Rs {text} to {category}")
        elif cmd == "quit":
            print(f"Bye! You tracked {len(expenses)} expenses.")
            break

if __name__ == "__main__":
    main()`, why: "overwrites totals, no validation, missing commands" }],
    after: "That's a real app. Take it home, save it as <code>tracker.py</code>, and run it in a terminal with <code>python tracker.py</code>."
  },
  bug: {
    brief: "<b>AI code review.</b> The AI wrote this check for amounts. It crashes on the very input it's meant to reject. Before fixing it, write down one input that proves it's wrong.",
    code: `# AI-written: is this a valid amount?
def valid_amount(text):
    return int(text) > 0 and text.isdigit()

for t in ["120", "0", "abc"]:
    print(t, valid_amount(t))`,
    tests: [{ call: "valid_amount('120')", expect: "True" }, { call: "valid_amount('0')", expect: "False" }, { call: "valid_amount('abc')", expect: "False" }, { call: "valid_amount('-5')", expect: "False" }, { call: "valid_amount('')", expect: "False" }],
    hints: ["Read the error: which value crashed it? Python checks the left side of <code>and</code> first, and stops at the first False."],
    fix: `def valid_amount(text):
    return text.isdigit() and int(text) > 0

for t in ["120", "0", "abc"]:
    print(t, valid_amount(t))`,
    lesson: "Order matters in <code>and</code>: put the safety check first, so the risky part only runs when it's safe."
  },
  explain: "Interview practice: walk through how your expense tracker is organised. What data does it store and which functions did you write? Which inputs did you try, including wrong ones like <code>abc</code> or <code>0</code>, and what did each one show?",
  cards: [
    { q: "What does <code>if __name__ == \"__main__\":</code> check?", options: ["Whether Python is installed", "Whether the file is being run directly, not imported", "Whether main() exists", "Whether there are errors"], answer: 1 },
    { q: "What's a good way to store many expenses?", options: ["One long string", "A list of dictionaries", "Lots of variables", "A single number"], answer: 1 },
    { q: "<code>continue</code> inside a loop…", options: ["Ends the loop", "Skips to the next lap", "Ends the program", "Repeats the lap"], answer: 1 }
  ],
  skills: { python: 4, logic: 4, debug: 3, talk: 3, test: 1 },
  homeQuest: {
    title: "Take it home",
    intro: "Build your portfolio. Each step is something you can show an employer. Tick each one when it's done.",
    tasks: [
      { t: "Run your expense tracker on your own computer", d: "Save it as <code>tracker.py</code> in a new folder and run <code>python tracker.py</code> in a terminal.", skill: "python" },
      { t: "Add one feature of your own", d: "Ideas: a <code>delete</code> command, the biggest expense, or a monthly budget warning.", skill: "logic" },
      { t: "Put it on GitHub with a README", d: "Explain what it does, how to run it, and paste an example session.", skill: "git" },
      { t: "Watch CS50P Lecture 2 (Loops)", d: "Then try two problems from Problem Set 2.", skill: "python" },
      { t: "Solve 3 Exercism exercises", d: "Pick ones about lists, loops and dictionaries. Ask a mentor to review one.", skill: "debug" },
      { t: "Explain your code to someone", d: "Walk a friend or family member through your tracker for 5 minutes. Teaching is the fastest way to find gaps.", skill: "talk" }
    ]
  }
}
);
