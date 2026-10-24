/* World 8 — Interview Arena: the interview method, hash maps, two pointers, counting, Big-O,
   stacks, binary search and recursion. Boss: The Final Interview, a three-question coding round.
   Speed tests ("limit" in ms) use inputs big enough that a loop-inside-a-loop takes 10x longer
   than the limit, while the intended answer takes well under a tenth of it. */

RESOURCES[8] = [
  { name: "Tech Interview Handbook", what: "Free, honest guide to coding interviews, plus the Grind 75 problem list. Start with the \"Coding interview\" pages.", url: "https://www.techinterviewhandbook.org/grind75/" },
  { name: "NeetCode roadmap", what: "Problems grouped by pattern (arrays and hashing, two pointers, stack, binary search) with free video explanations.", url: "https://neetcode.io/roadmap" },
  { name: "LeetCode 75", what: "A 75-problem study plan. Do the easy ones in each topic first.", url: "https://leetcode.com/studyplan/leetcode-75/" },
  { name: "CodePath: the UMPIRE method", what: "The step-by-step interview routine used in this world, with worked examples.", url: "https://guides.codepath.org/compsci/UMPIRE-Interview-Strategy" },
  { name: "Python time complexity table", what: "The official list of how fast each list, set and dict operation is.", url: "https://wiki.python.org/moin/TimeComplexity" },
  { name: "Exponent peer mock interviews", what: "Free practice interviews with other learners (it used to be called Pramp).", url: "https://www.tryexponent.com/practice" },
  { name: "Tech Interview Handbook: resume", what: "How to write a one-page software engineer resume that gets past screening.", url: "https://www.techinterviewhandbook.org/resume/" }
];

LEVELS.push(
/* ───────────────────────────── 8-1 ───────────────────────────── */
{
  id: "8-1", world: 8, n: 1, title: "Think Out Loud", concept: "the interview method (UMPIRE)",
  learn: [
    { h: "What interviewers really score",
      p: "A coding interview isn't a quiz with one right answer. Interviewers usually score four things: how you <b>communicate</b>, how you <b>solve problems</b>, the <b>code</b> you write, and how you <b>test</b> it. A candidate who talks clearly and finds a good-but-not-perfect answer often beats one who types a perfect answer in silence. So the first skill of this world is a routine you can follow even when you're nervous.",
      lang: "text", file: "what gets written on the scorecard",
      code: `Communication   Did they explain their thinking? Did they ask good questions?
Problem solving Did they start simple, then improve?
Code            Is it correct, clear and well named?
Testing         Did they check it with examples and edge cases?` },
    { h: "UMPIRE: six steps for any problem",
      p: "CodePath teaches this routine, and it works. <b>U</b>nderstand the problem, <b>M</b>atch it to a pattern you know, <b>P</b>lan in plain words, <b>I</b>mplement, <b>R</b>eview by tracing an example, and <b>E</b>valuate: how fast is it, and which edge cases matter? Say each step out loud.",
      lang: "text", file: "UMPIRE",
      code: `Understand  Repeat the problem in your own words. Ask questions. Try 2 examples by hand.
Match       "This looks like counting / two pointers / a stack..."
Plan        Describe the steps in plain words before typing.
Implement   Write the code. Keep talking while you type.
Review      Walk through your code with an example, line by line.
Evaluate    How fast is it (Big-O)? Which edge cases did you handle?` },
    { h: "Ask before you code",
      p: "Problems are left a little vague on purpose, to see if you ask. For \"find the second largest number in a list\", good questions are: what if the list is empty or has one number? Can numbers repeat, like <code>[5, 5, 3]</code>? Can they be negative? Should I return it or print it? Each answer changes the code.",
      lang: "text", file: "clarifying questions",
      code: `You:  "So I get a list of numbers and return the second biggest?"
You:  "If the list is [5, 5, 3], is the answer 5 or 3?"
Them: "3. We mean the second biggest different value."
You:  "And if there isn't one, like [7]?"
Them: "Return None."` },
    { h: "Simple first, then better",
      p: "If you see a slow but correct answer, say it: \"A simple way is to check every pair, but that's slow for big lists. Let me improve it.\" That shows you can solve it, and it gives you something to fall back on. Then improve one step at a time. The rest of this world teaches the patterns that make answers fast." }
  ],
  think: [
    { type: "order", q: "Put the UMPIRE steps in order.", lines: ["Understand: repeat the problem and ask questions", "Match: which pattern does this look like?", "Plan: describe the steps in plain words", "Implement: write the code", "Review: trace the code with an example", "Evaluate: Big-O and edge cases"],
      why: "Understand and plan before you type. Review and evaluate after. Most nervous candidates skip straight to typing." },
    { type: "multi", q: "You're asked to \"find the second largest number in a list\". Which are good clarifying questions?", options: ["What if the list has fewer than two numbers?", "Can numbers repeat, like <code>[5, 5, 3]</code>?", "Is it okay if my code is messy?", "Can the numbers be negative?"], answer: [0, 1, 3],
      why: "Each good question changes what your code must do. Asking whether messy code is okay doesn't help: it should always be clear." },
    { type: "refute", q: "A candidate wrote this to find the second largest <i>different</i> value. Find a list it gets wrong.", fn: "second_largest", args: 1, example: "[3, 9, 4]",
      code: `def second_largest(nums):
    return sorted(nums)[-2]`,
      ref: `def second_largest(nums):
    values = sorted(set(nums))
    if len(values) < 2:
        return None
    return values[-2]`,
      answer: "[5, 5, 3]", safe: ["[3, 9, 4]", "[1, 2]"],
      why: "With repeats like <code>[5, 5, 3]</code>, the second-last item after sorting is 5 again. This is why you ask about duplicates before coding." },
    { type: "mcq", q: "You're stuck in the middle of an interview. What's the best move?", options: ["Stay quiet until you have the whole answer", "Say what you're thinking, and try a small example by hand", "Start typing something, anything", "Ask to skip the question"], answer: 1,
      why: "Interviewers can only help if they hear your thinking. Working a small example by hand often shows you the pattern." }
  ],
  code: {
    brief: "Silver medal! Write <code>second_largest(nums)</code> that returns the second largest <b>different</b> value in the list, or <code>None</code> if there isn't one.<br>• <code>[3, 9, 4]</code> gives <code>4</code><br>• <code>[5, 5, 3]</code> gives <code>3</code> (the two 5s are both gold)<br>• <code>[7]</code>, <code>[]</code> and <code>[2, 2, 2]</code> give <code>None</code><br>Negative numbers are allowed. Don't change the list you're given.",
    sample: ">>> second_largest([3, 9, 4])\n4\n>>> second_largest([5, 5, 3])\n3\n>>> second_largest([7])\nNone",
    starter: `def second_largest(nums):
    # Understand: second biggest DIFFERENT value, or None.
    # Plan: write your steps here as comments first.
    pass
`,
    tests: [
      { call: "second_largest([3, 9, 4])", expect: "4", label: "A normal list" },
      { call: "second_largest([5, 5, 3])", expect: "3", label: "Repeated largest value" },
      { call: "second_largest([10, 10, 9, 9])", expect: "9", label: "Repeats everywhere" },
      { call: "second_largest([-1, -5, -3])", expect: "-3", label: "All negative" },
      { call: "second_largest([7])", expect: "None", label: "Only one number" },
      { call: "second_largest([])", expect: "None", label: "Empty list" },
      { call: "second_largest([2, 2, 2])", expect: "None", label: "Every value the same" },
      { setup: "nums = [4, 1, 8]\nsecond_largest(nums)", call: "nums", expect: "[4, 1, 8]", label: "The list isn't changed" }
    ],
    fuzz: { n: 12, what: "random lists", gen: (r) => ({ call: "second_largest([" + Array.from({ length: r.int(0, 7) }, () => r.int(-5, 9)).join(", ") + "])" }) },
    hints: [
      "Understand first: <code>[5, 5, 3]</code> should give 3, so repeats count once. Which Python type keeps each value only once?",
      "<code>set(nums)</code> removes repeats. <code>sorted(...)</code> turns it into a sorted list. If that list has fewer than 2 values, return None.",
      "Want to impress? Do it in one pass with two variables, <code>best</code> and <code>second</code>, both starting at None. Careful with equal values."
    ],
    solution: `def second_largest(nums):
    values = sorted(set(nums))
    if len(values) < 2:
        return None
    return values[-2]`,
    alts: [`def second_largest(nums):
    best = None
    second = None
    for n in nums:
        if best is None or n > best:
            if best is not None:
                second = best
            best = n
        elif n != best and (second is None or n > second):
            second = n
    return second`],
    wrong: [
      { code: `def second_largest(nums):
    if len(nums) < 2:
        return None
    return sorted(nums)[-2]`, why: "ignores repeated values" },
      { code: `def second_largest(nums):
    nums.sort()
    values = []
    for n in nums:
        if n not in values:
            values.append(n)
    if len(values) < 2:
        return None
    return values[-2]`, why: "changes the caller's list" },
      { code: `def second_largest(nums):
    best = 0
    second = 0
    for n in nums:
        if n > best:
            second = best
            best = n
        elif best > n > second:
            second = n
    return second`, why: "starts at 0, so fails for negatives and returns 0 instead of None" }
    ]
  },
  bug: {
    brief: "Classic interview question: <code>max_profit(prices)</code> gets a list of daily share prices and returns the most money you could make by buying on one day and selling on a <b>later</b> day (0 if you can't make a profit). For <code>[7, 1, 5, 3, 6, 4]</code> it should be 5 (buy at 1, sell at 6), but it says 7. Review it like an interviewer would.",
    code: `def max_profit(prices):
    min_price = 0
    best = 0
    for p in prices:
        if p < min_price:
            min_price = p
        if p - min_price > best:
            best = p - min_price
    return best

print(max_profit([7, 1, 5, 3, 6, 4]))`,
    tests: [
      { call: "max_profit([7, 1, 5, 3, 6, 4])", expect: "5", label: "Buy at 1, sell at 6" },
      { call: "max_profit([7, 6, 4, 3, 1])", expect: "0", label: "Prices only fall" },
      { call: "max_profit([2, 4, 1])", expect: "2", label: "The lowest price comes too late to use" },
      { call: "max_profit([3])", expect: "0", label: "Only one day" },
      { call: "max_profit([])", expect: "0", label: "No prices" }
    ],
    hints: [
      "Trace it with <code>[7, 1, 5]</code>. Can <code>p &lt; min_price</code> ever be True when min_price starts at 0?",
      "It's the \"best so far\" trap from Loop Forest: the starting value must be a real price. Start with the first price, and return 0 for an empty list."
    ],
    fix: `def max_profit(prices):
    if not prices:
        return 0
    min_price = prices[0]
    best = 0
    for p in prices:
        if p < min_price:
            min_price = p
        if p - min_price > best:
            best = p - min_price
    return best

print(max_profit([7, 1, 5, 3, 6, 4]))`,
    lesson: "A \"lowest so far\" variable must start at a real value from the data, never at 0."
  },
  explain: "Interview practice: talk through how you'd solve \"find the second largest number in a list\" using UMPIRE. Which questions would you ask first, and which edge cases would you test?",
  cards: [
    { q: "What does the U in UMPIRE stand for?", options: ["Upload", "Understand", "Use loops", "Undo"], answer: 1 },
    { q: "Why ask clarifying questions before coding?", options: ["To waste time", "Each answer can change what the code must do", "Interviewers require 5 questions", "To avoid writing tests"], answer: 1 },
    { q: "You see a slow but correct answer. What should you do?", options: ["Hide it", "Say it, then improve it", "Refuse to answer", "Only write the fast one silently"], answer: 1 }
  ],
  skills: { interview: 3, talk: 3, logic: 2, python: 1 }
},
/* ───────────────────────────── 8-2 ───────────────────────────── */
{
  id: "8-2", world: 8, n: 2, title: "The Instant Index", concept: "hash maps: dicts and sets for fast lookups",
  learn: [
    { h: "Searching a list is slow. A set or dict is instant.",
      p: "<code>x in my_list</code> checks the items one by one, so a list of a million names can take a million checks. A <b>set</b> or <b>dict</b> works like the index at the back of a book: Python turns the value into a number (a <b>hash</b>) that says exactly where to look. That takes about one step, however big it gets. This one idea solves a huge number of interview questions.",
      code: `names = ["asha", "ravi", "meera", "john"]
print("meera" in names)   # checks asha, ravi, then meera: 3 steps

fast = set(names)
print("meera" in fast)    # jumps straight to it: about 1 step` },
    { h: "The pattern: remember what you've seen",
      p: "Loop through the data <b>once</b>. Keep a set or dict of what you've seen so far. At each item, ask: \"have I already seen the thing I need?\" Here's a duplicate finder that never looks back through the list.",
      code: `def first_duplicate(items):
    seen = set()
    for x in items:
        if x in seen:
            return x
        seen.add(x)
    return None

print(first_duplicate(["tea", "coffee", "milk", "coffee"]))` },
    { h: "Two Sum: the most famous interview question",
      p: "Given a list of numbers and a target, find two <b>positions</b> whose numbers add up to the target. The simple way tries every pair: a loop inside a loop. For 10,000 numbers that's about 50 million checks. Say it out loud as your first idea, then improve it.",
      code: `def two_sum_slow(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    return None

print(two_sum_slow([2, 7, 11, 15], 9))` },
    { h: "The faster idea",
      p: "When you're at a number <code>n</code>, the partner you need is <code>target - n</code>. If you keep a dict of <i>number → position</i> for everything you've already passed, you can check for the partner in one step. One loop instead of two. You'll write it in the Forge." }
  ],
  think: [
    { type: "predict", q: "What does this print?", code: `seen = set()
for x in [4, 7, 4, 1, 7]:
    if x in seen:
        print("again", x)
    seen.add(x)`, answer: "again 4\nagain 7",
      why: "The second 4 and the second 7 find themselves already in the set." },
    { type: "mcq", q: "You need to check, thousands of times, whether a username is already taken among 1 million users. What should hold the usernames?", options: ["A list", "A set", "A long string joined with commas", "A list you sort before every check"], answer: 1,
      why: "Checking a set takes about one step. A list or a string is searched one item at a time." },
    { type: "fill", q: "Fill the blanks so <code>has_pair</code> says whether any two numbers add up to the target.", code: `def has_pair(nums, target):
    seen = set()
    for n in nums:
        if target - n ___ seen:
            return True
        seen.___(n)
    return False

print(has_pair([2, 7, 11], 9), has_pair([3], 6))`, answers: ["in", "add"], expect: ["True False"], wrong: [["not in", "add"]],
      why: "For each number, look for the partner it needs among the numbers already seen, then add this one. Checking <i>before</i> adding stops a number pairing with itself." },
    { type: "match", q: "Match each operation with roughly how much work it is for a big collection.", pairs: [["<code>x in a_list</code>", "checks items one by one"], ["<code>x in a_set</code>", "about one step"], ["<code>sorted(a_list)</code>", "a bit more than one pass (n log n)"], ["a loop inside a loop", "every pair: n × n"]],
      why: "Knowing these costs is half of every \"can you make it faster?\" question." }
  ],
  code: {
    brief: "Write <code>two_sum(nums, target)</code> that returns a list <code>[i, j]</code> of two different positions, with <code>i &lt; j</code>, whose numbers add up to <code>target</code>. Return <code>None</code> if no pair works. Each test has at most one answer.<br>It must be <b>fast</b>: one test uses 20,000 numbers, and a loop inside a loop is too slow for it. Use a dict.",
    sample: ">>> two_sum([2, 7, 11, 15], 9)\n[0, 1]\n>>> two_sum([3, 3], 6)\n[0, 1]\n>>> two_sum([1, 5], 10)\nNone",
    starter: `def two_sum(nums, target):
    seen = {}   # number -> its position
`,
    tests: [
      { call: "two_sum([2, 7, 11, 15], 9)", expect: "[0, 1]", label: "The classic example" },
      { call: "two_sum([3, 2, 4], 6)", expect: "[1, 2]", label: "The first number isn't in the answer" },
      { call: "two_sum([3, 3], 6)", expect: "[0, 1]", label: "Two equal numbers" },
      { call: "two_sum([3, 4], 6)", expect: "None", label: "Can't use one number twice" },
      { call: "two_sum([-4, 10, 0, 7], 3)", expect: "[0, 3]", label: "Negative numbers" },
      { call: "two_sum([1, 5], 10)", expect: "None", label: "No pair works" },
      { call: "two_sum([], 4)", expect: "None", label: "Empty list" },
      { setup: "nums = list(range(1, 20001))", call: "two_sum(nums, 39999)", expect: "[19998, 19999]", limit: 3000, label: "20,000 numbers, fast",
        slowMsg: "Correct but too slow for 20,000 numbers. A loop inside a loop checks about 200 million pairs. Use a dict so each number needs only one look-up." }
    ],
    fuzz: { n: 12, what: "random lists", gen: (r) => {
      const pool = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024], nums = [];
      for (let k = r.int(1, 7); k > 0; k--) nums.push(pool.splice(r.int(0, pool.length - 1), 1)[0]);
      const target = nums.length > 1 && r.next() < 0.75 ? nums[0] + nums[nums.length - 1] : r.int(0, 2100);
      return { call: "two_sum([" + nums.join(", ") + "], " + target + ")" };
    } },
    hints: [
      "Loop once with <code>for i, n in enumerate(nums):</code>. The partner you need is <code>target - n</code>.",
      "If the partner is already in <code>seen</code>, return <code>[seen[target - n], i]</code>. Otherwise store this one: <code>seen[n] = i</code>.",
      "Check <i>before</i> you store, or a number can pair with itself (<code>[3, 4]</code> with target 6 would wrongly match 3 with 3)."
    ],
    solution: `def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        if target - n in seen:
            return [seen[target - n], i]
        seen[n] = i
    return None`,
    wrong: [
      { code: `def two_sum(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    return None`, why: "correct but too slow" },
      { code: `def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        seen[n] = i
        if target - n in seen:
            return [seen[target - n], i]
    return None`, why: "lets a number pair with itself" },
      { code: `def two_sum(nums, target):
    for i, n in enumerate(nums):
        if target - n in nums:
            j = nums.index(target - n)
            if j != i:
                return sorted([i, j])
    return None`, why: "searches the list inside the loop, so it's slow" }
    ]
  },
  bug: {
    brief: "Another candidate's Two Sum. For <code>[3, 4, 2]</code> with target 6 it returns <code>[0, 0]</code>: it paired the 3 with itself. One line is in the wrong place.",
    code: `def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        seen[n] = i
        if target - n in seen:
            return [seen[target - n], i]
    return None

print(two_sum([3, 4, 2], 6))`,
    tests: [
      { call: "two_sum([3, 4, 2], 6)", expect: "[1, 2]", label: "Don't pair 3 with itself" },
      { call: "two_sum([3, 3], 6)", expect: "[0, 1]", label: "Two real 3s are fine" },
      { call: "two_sum([5], 10)", expect: "None", label: "One number can't make a pair" }
    ],
    hints: ["Trace the first lap: n is 3, it's stored, then <code>6 - 3</code> is looked up... and found. The number must be looked for <i>before</i> it's stored."],
    fix: `def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        if target - n in seen:
            return [seen[target - n], i]
        seen[n] = i
    return None

print(two_sum([3, 4, 2], 6))`,
    lesson: "In the \"remember what you've seen\" pattern, check first, then remember."
  },
  explain: "Explain how your Two Sum works and why it's faster than checking every pair. What does the dict store, and what's the cost?",
  cards: [
    { q: "About how many steps does <code>x in my_set</code> take for a huge set?", options: ["One per item", "About one", "Half the items", "It depends on the alphabet"], answer: 1 },
    { q: "In Two Sum, what does the dict map?", options: ["position → number", "number → its position", "number → True", "target → answer"], answer: 1 },
    { q: "Why check for the partner before storing the current number?", options: ["It's faster", "So a number can't pair with itself", "Dicts require it", "To sort the list"], answer: 1 }
  ],
  skills: { interview: 3, logic: 3, python: 2 }
},
/* ───────────────────────────── 8-3 ───────────────────────────── */
{
  id: "8-3", world: 8, n: 3, title: "Two Fingers", concept: "two pointers on sorted lists",
  learn: [
    { h: "Two pointers walking toward each other",
      p: "Put one finger at the start of a list and one at the end, and move them toward each other. That's the <b>two pointers</b> pattern: each step moves at least one finger, so the whole list is covered in a single pass. Checking a palindrome (a word that reads the same backwards) is the simplest example.",
      code: `def is_palindrome(word):
    left = 0
    right = len(word) - 1
    while left < right:
        if word[left] != word[right]:
            return False
        left += 1
        right -= 1
    return True

print(is_palindrome("racecar"), is_palindrome("rocket"))` },
    { h: "Sorted lists give you a superpower",
      p: "In a <b>sorted</b> list, the left finger points at the smallest number and the right at the biggest. Looking for two numbers that add up to a target? If their sum is too small, move the left finger right (to a bigger number). If it's too big, move the right finger left. You never need to go back, so it's one pass.",
      lang: "text", file: "find two numbers adding to 13 in a sorted list",
      code: `[1, 3, 4, 6, 9]
 L           R    1 + 9 = 10   too small → move L right
    L        R    3 + 9 = 12   too small → move L right
       L     R    4 + 9 = 13   found it!` },
    { h: "Why it never misses a pair",
      p: "When <code>1 + 9</code> is too small, 1 can't be part of any answer: 9 is the biggest partner it could ever have. So it's safe to drop 1 and move on. The same logic drops the biggest number when the sum is too big. That's the kind of reasoning interviewers love to hear." },
    { h: "Merging two sorted lists",
      p: "Two pointers also work on <b>two</b> lists: one finger in each. Compare the two front items, take the smaller one, and move that finger. When one list runs out, the rest of the other is already sorted, so add it all.",
      code: `def merge(a, b):
    i = j = 0
    out = []
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            out.append(a[i])
            i += 1
        else:
            out.append(b[j])
            j += 1
    return out + a[i:] + b[j:]

print(merge([1, 4, 9], [2, 3, 10, 12]))` }
  ],
  think: [
    { type: "trace", q: "Trace the pointers looking for two numbers that add up to 13. Write <code>left</code>, <code>right</code> and <code>total</code> on each lap.", code: `nums = [1, 3, 4, 6, 9]
left, right = 0, len(nums) - 1
while left < right:
    total = nums[left] + nums[right]
    if total == 13:
        break
    if total < 13:
        left += 1
    else:
        right -= 1`, vars: ["left", "right", "total"], rows: [[0, 4, 10], [1, 4, 12], [2, 4, 13]],
      check: `nums = [1, 3, 4, 6, 9]
left, right = 0, len(nums) - 1
while left < right:
    total = nums[left] + nums[right]
    print(left, right, total)
    if total == 13:
        break
    if total < 13:
        left += 1
    else:
        right -= 1`,
      why: "Too small twice, so the left pointer moves right twice. 4 + 9 = 13 on the third lap." },
    { type: "mcq", q: "The sum is too small. Why does moving the <b>left</b> pointer right help?", options: ["Because the list is sorted, so the next number is bigger or equal", "Because the right pointer is tired", "It doesn't, it makes the sum smaller", "Because Python moves both"], answer: 0,
      why: "The pattern only works on sorted lists. If the list weren't sorted, moving a pointer wouldn't tell you anything." },
    { type: "refute", q: "This should check whether a word is a palindrome. Find a word it gets wrong.", fn: "is_palindrome", args: 1, example: "\"racecar\"",
      code: `def is_palindrome(word):
    return word[0] == word[-1]`,
      ref: `def is_palindrome(word):
    return word == word[::-1]`,
      answer: "\"abca\"", safe: ["\"racecar\"", "\"rocket\""],
      why: "It only compares the outer letters. \"abca\" starts and ends with a, but isn't a palindrome. (An empty word \"\" also crashes it.) Testing only the easy examples would never find this." },
    { type: "order", indent: true, q: "Build the palindrome checker. One line doesn't belong.", lines: ["def is_palindrome(word):", "    left, right = 0, len(word) - 1", "    while left < right:", "        if word[left] != word[right]:", "            return False", "        left += 1", "        right -= 1", "    return True", "print(is_palindrome(\"level\"), is_palindrome(\"lever\"))"],
      distractors: ["        left -= 1"], expect: ["True False"],
      why: "The pointers start at both ends and step toward each other. Moving left the wrong way would never meet the right pointer." }
  ],
  code: {
    brief: "Write <code>pair_with_sum(nums, target)</code>. <code>nums</code> is sorted from smallest to biggest. Return a tuple <code>(a, b)</code> of two numbers from <b>different positions</b> that add up to <code>target</code>, with <code>a &lt;= b</code>. If several pairs work, return the one with the <b>smallest</b> <code>a</code>. Return <code>None</code> if none work.<br>One test uses 20,000 numbers, so a loop inside a loop is too slow. Use two pointers.",
    sample: ">>> pair_with_sum([1, 3, 4, 6, 9], 13)\n(4, 9)\n>>> pair_with_sum([1, 2, 3, 4, 5, 6], 7)\n(1, 6)\n>>> pair_with_sum([2, 4], 8)\nNone",
    starter: `def pair_with_sum(nums, target):
    left = 0
    right = len(nums) - 1
`,
    tests: [
      { call: "pair_with_sum([1, 3, 4, 6, 9], 13)", expect: "(4, 9)", label: "The example" },
      { call: "pair_with_sum([1, 2, 3, 4, 5, 6], 7)", expect: "(1, 6)", label: "Several pairs: smallest first number" },
      { call: "pair_with_sum([-3, 0, 2, 7], 4)", expect: "(-3, 7)", label: "Negative numbers" },
      { call: "pair_with_sum([5, 5], 10)", expect: "(5, 5)", label: "Two equal numbers" },
      { call: "pair_with_sum([5], 10)", expect: "None", label: "One number can't pair with itself" },
      { call: "pair_with_sum([2, 4], 8)", expect: "None", label: "No pair works" },
      { call: "pair_with_sum([], 5)", expect: "None", label: "Empty list" },
      { setup: "nums = list(range(0, 40000, 2))", call: "pair_with_sum(nums, 79994)", expect: "(39996, 39998)", limit: 3000, label: "20,000 numbers, fast",
        slowMsg: "Correct but too slow for 20,000 numbers. Use one pointer at each end and move them toward each other." }
    ],
    fuzz: { n: 14, what: "random sorted lists", gen: (r) => ({ call: "pair_with_sum([" + Array.from({ length: r.int(0, 9) }, () => r.int(-5, 15)).sort((a, b) => a - b).join(", ") + "], " + r.int(-4, 24) + ")" }) },
    hints: [
      "Loop <code>while left &lt; right:</code>. Work out <code>total = nums[left] + nums[right]</code>.",
      "If total equals the target, return <code>(nums[left], nums[right])</code>. If it's too small, <code>left += 1</code>. Too big, <code>right -= 1</code>.",
      "After the loop, return None. <code>left &lt; right</code> also makes sure you never use one position twice."
    ],
    solution: `def pair_with_sum(nums, target):
    left = 0
    right = len(nums) - 1
    while left < right:
        total = nums[left] + nums[right]
        if total == target:
            return (nums[left], nums[right])
        if total < target:
            left += 1
        else:
            right -= 1
    return None`,
    alts: [`def pair_with_sum(nums, target):
    counts = {}
    for n in nums:
        counts[n] = counts.get(n, 0) + 1
    for n in nums:
        m = target - n
        if m in counts and n <= m and (m != n or counts[n] > 1):
            return (n, m)
    return None`],
    wrong: [
      { code: `def pair_with_sum(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return (nums[i], nums[j])
    return None`, why: "correct but too slow" },
      { code: `def pair_with_sum(nums, target):
    left = 0
    right = len(nums) - 1
    while left <= right:
        total = nums[left] + nums[right]
        if total == target:
            return (nums[left], nums[right])
        if total < target:
            left += 1
        else:
            right -= 1
    return None`, why: "<= lets one number pair with itself" },
      { code: `def pair_with_sum(nums, target):
    seen = set(nums)
    for n in nums:
        if target - n in seen:
            return (n, target - n)
    return None`, why: "pairs a number with itself" }
    ]
  },
  bug: {
    brief: "<code>common(a, b)</code> should return the numbers that are in <b>both</b> sorted lists, using two pointers. For <code>[1, 3, 5, 7]</code> and <code>[3, 4, 5, 8]</code> it should give <code>[3, 5]</code>, but it gives <code>[]</code>. One pointer moves the wrong way.",
    code: `def common(a, b):
    i = j = 0
    out = []
    while i < len(a) and j < len(b):
        if a[i] == b[j]:
            out.append(a[i])
            i += 1
            j += 1
        elif a[i] < b[j]:
            j += 1
        else:
            i += 1
    return out

print(common([1, 3, 5, 7], [3, 4, 5, 8]))`,
    tests: [
      { call: "common([1, 3, 5, 7], [3, 4, 5, 8])", expect: "[3, 5]", label: "The example" },
      { call: "common([2, 4, 6], [1, 2, 3, 4, 5, 6])", expect: "[2, 4, 6]", label: "All of one list" },
      { call: "common([1, 2], [3, 4])", expect: "[]", label: "Nothing in common" },
      { call: "common([], [1])", expect: "[]", label: "Empty list" }
    ],
    hints: ["When <code>a[i]</code> is the smaller one, can it still match anything later in b? b only gets bigger. So which pointer should move past it?"],
    fix: `def common(a, b):
    i = j = 0
    out = []
    while i < len(a) and j < len(b):
        if a[i] == b[j]:
            out.append(a[i])
            i += 1
            j += 1
        elif a[i] < b[j]:
            i += 1
        else:
            j += 1
    return out

print(common([1, 3, 5, 7], [3, 4, 5, 8]))`,
    lesson: "With two pointers on sorted lists, always move past the smaller value: it can't match anything that comes later."
  },
  explain: "Explain the two-pointer idea for finding a pair that adds up to a target in a sorted list. Why is it safe to move a pointer, and why does the list need to be sorted?",
  cards: [
    { q: "The two-pointer pair search needs the list to be…", options: ["Short", "Sorted", "All positive", "Made of strings"], answer: 1 },
    { q: "The sum is too big. Which pointer moves?", options: ["Left moves right", "Right moves left", "Both reset", "Neither"], answer: 1 },
    { q: "Why <code>while left &lt; right</code> instead of <code>&lt;=</code>?", options: ["It's faster to type", "So a position is never paired with itself", "Python requires it", "It sorts the list"], answer: 1 }
  ],
  skills: { interview: 3, logic: 3, python: 2 }
},
/* ───────────────────────────── 8-4 ───────────────────────────── */
{
  id: "8-4", world: 8, n: 4, title: "Counting Spells", concept: "counting with dicts and Counter",
  learn: [
    { h: "Count anything with a dict",
      p: "A huge number of interview questions are really \"count things, then look at the counts\". The pattern: a dict from item to count. <code>counts.get(x, 0)</code> gives the count so far, or 0 if <code>x</code> is new, so you never get a KeyError.",
      code: `counts = {}
for ch in "banana":
    counts[ch] = counts.get(ch, 0) + 1
print(counts)` },
    { h: "Counter does the counting for you",
      p: "Python's <code>collections.Counter</code> is a dict made for counting. Give it any list or string. <code>.most_common(n)</code> gives the n biggest counts. A missing key counts as 0 instead of crashing. In an interview, say you know about it, but be ready to write the dict version too.",
      code: `from collections import Counter

votes = Counter(["dosa", "idli", "dosa", "vada", "dosa", "idli"])
print(votes["dosa"], votes["poha"])
print(votes.most_common(2))` },
    { h: "Two passes are still fast",
      p: "To find the first letter that appears only once, first count every letter (one pass), then walk the string again and stop at the first letter whose count is 1 (another pass). Two passes is still about 2n steps, which grows like n. What makes code slow is a loop <i>inside</i> a loop, like calling <code>s.count(ch)</code> for every letter: <code>.count</code> secretly loops over the whole string each time." },
    { h: "Anagrams have the same counts",
      p: "Two words are anagrams if they use exactly the same letters, the same number of times: <i>listen</i> and <i>silent</i>. Comparing their Counters (or their sorted letters) checks exactly that. Comparing <b>sets</b> does not: a set forgets how many times each letter appears.",
      code: `from collections import Counter
print(Counter("listen") == Counter("silent"))
print(sorted("listen") == sorted("silent"))
print(set("aab") == set("abb"))    # True, but they're not anagrams!` }
  ],
  think: [
    { type: "predict", q: "What does this print?", code: `from collections import Counter
c = Counter("banana")
print(c["a"], c["z"], c.most_common(1))`, answer: "3 0 [('a', 3)]",
      why: "There are three a's. A missing key counts as 0 in a Counter. <code>most_common(1)</code> is a list with the single biggest pair." },
    { type: "spot", q: "This crashes with <code>KeyError: 'red'</code>. Which line is wrong?", code: `def tally(colours):
    counts = {}
    for c in colours:
        counts[c] += 1
    return counts

print(tally(["red", "blue", "red"]))`, answer: 4,
      why: "The first time a colour appears it isn't in the dict yet, so <code>counts[c] += 1</code> can't read it. Use <code>counts[c] = counts.get(c, 0) + 1</code>." },
    { type: "mcq", q: "Which check is <b>wrong</b> for anagrams?", options: ["<code>sorted(a) == sorted(b)</code>", "<code>Counter(a) == Counter(b)</code>", "<code>set(a) == set(b)</code>", "Comparing two count dicts built by hand"], answer: 2,
      why: "Sets forget how many of each letter there are: \"aab\" and \"abb\" have the same set but aren't anagrams." },
    { type: "multi", q: "Which of these hide a loop over the whole string or list, so they're slow inside another loop?", options: ["<code>s.count(ch)</code>", "<code>counts.get(ch, 0)</code>", "<code>ch in my_list</code>", "<code>len(s)</code>"], answer: [0, 2],
      why: "<code>.count</code> and <code>in</code> on a list check every item. A dict look-up and <code>len</code> take about one step." }
  ],
  code: {
    brief: "Two classic counting questions.<br>• <code>first_unique(s)</code> returns the <b>position</b> of the first character that appears exactly once in <code>s</code>, or <code>-1</code> if there isn't one. It must be fast: one test uses a string of 80,000 characters.<br>• <code>most_common_word(text)</code> returns the word that appears most often, in lowercase. Split on spaces, and strip <code>.,!?</code> from the ends of each word. If two words tie, return the one that appears <b>first</b> in the text. Return <code>None</code> if there are no words.",
    sample: ">>> first_unique(\"swiss\")\n1\n>>> first_unique(\"aabb\")\n-1\n>>> most_common_word(\"Chai, then more chai! Then sleep.\")\n'chai'",
    starter: `def first_unique(s):
    pass


def most_common_word(text):
    pass
`,
    tests: [
      { call: "first_unique(\"swiss\")", expect: "1", label: "first_unique: 'w' is at position 1" },
      { call: "first_unique(\"leetcode\")", expect: "0", label: "first_unique: the first letter" },
      { call: "first_unique(\"aabb\")", expect: "-1", label: "first_unique: nothing unique" },
      { call: "first_unique(\"\")", expect: "-1", label: "first_unique: empty string" },
      { setup: "s = \"ab\" * 40000 + \"z\"", call: "first_unique(s)", expect: "80000", limit: 3000, label: "first_unique: 80,000 characters, fast",
        slowMsg: "Correct but too slow. <code>s.count(ch)</code> inside a loop reads the whole string again for every letter. Count everything once first." },
      { call: "most_common_word(\"Chai, then more chai! Then sleep.\")", expect: "'chai'", label: "most_common_word: a tie goes to the first word" },
      { call: "most_common_word(\"to be or not to be\")", expect: "'to'", label: "most_common_word: another tie" },
      { call: "most_common_word(\"Go go GO! stop.\")", expect: "'go'", label: "most_common_word: any capitals" },
      { call: "most_common_word(\"\")", expect: "None", label: "most_common_word: no words" }
    ],
    fuzz: { n: 14, what: "random strings and sentences", gen: (r, i) => i % 2
      ? { call: "most_common_word(" + JSON.stringify(Array.from({ length: r.int(0, 8) }, () => r.pick(["chai", "Chai", "rain", "rain!", "Rain,", "code", "code.", "?"])).join(" ")) + ")" }
      : { call: "first_unique(" + JSON.stringify(Array.from({ length: r.int(0, 9) }, () => r.pick("aabbcz".split(""))).join("")) + ")" } },
    hints: [
      "<code>first_unique</code>: first loop builds <code>counts</code>. Second loop: <code>for i, ch in enumerate(s):</code> and return <code>i</code> when <code>counts[ch] == 1</code>.",
      "<code>most_common_word</code>: <code>words = [w.strip(\".,!?\").lower() for w in text.split()]</code>, then drop empty strings. Count them in a dict.",
      "For ties: dicts remember the order keys were added, so loop over the dict and keep the first word with the biggest count. Use <code>&gt;</code>, not <code>&gt;=</code>."
    ],
    solution: `def first_unique(s):
    counts = {}
    for ch in s:
        counts[ch] = counts.get(ch, 0) + 1
    for i, ch in enumerate(s):
        if counts[ch] == 1:
            return i
    return -1


def most_common_word(text):
    counts = {}
    for w in text.split():
        w = w.strip(".,!?").lower()
        if w:
            counts[w] = counts.get(w, 0) + 1
    best = None
    for w in counts:
        if best is None or counts[w] > counts[best]:
            best = w
    return best`,
    alts: [`from collections import Counter


def first_unique(s):
    c = Counter(s)
    for i, ch in enumerate(s):
        if c[ch] == 1:
            return i
    return -1


def most_common_word(text):
    words = [w.strip(".,!?").lower() for w in text.split()]
    words = [w for w in words if w]
    if not words:
        return None
    return Counter(words).most_common(1)[0][0]`],
    wrong: [
      { code: `def first_unique(s):
    for i, ch in enumerate(s):
        if s.count(ch) == 1:
            return i
    return -1


def most_common_word(text):
    counts = {}
    for w in text.split():
        w = w.strip(".,!?").lower()
        if w:
            counts[w] = counts.get(w, 0) + 1
    best = None
    for w in counts:
        if best is None or counts[w] > counts[best]:
            best = w
    return best`, why: "first_unique is too slow" },
      { code: `def first_unique(s):
    counts = {}
    for ch in s:
        counts[ch] = counts.get(ch, 0) + 1
    for i, ch in enumerate(s):
        if counts[ch] == 1:
            return i
    return -1


def most_common_word(text):
    counts = {}
    for w in text.split():
        w = w.strip(".,!?").lower()
        if w:
            counts[w] = counts.get(w, 0) + 1
    best = None
    for w in counts:
        if best is None or counts[w] >= counts[best]:
            best = w
    return best`, why: ">= gives ties to the last word" }
    ]
  },
  bug: {
    brief: "<code>is_anagram(a, b)</code> should ignore spaces and capitals, so \"Dormitory\" and \"dirty room\" are anagrams. But it also says \"aab\" and \"abb\" are anagrams, and they're not.",
    code: `def is_anagram(a, b):
    a = a.replace(" ", "").lower()
    b = b.replace(" ", "").lower()
    return set(a) == set(b)

print(is_anagram("aab", "abb"))`,
    tests: [
      { call: "is_anagram(\"listen\", \"silent\")", expect: "True", label: "listen / silent" },
      { call: "is_anagram(\"Dormitory\", \"dirty room\")", expect: "True", label: "Spaces and capitals are ignored" },
      { call: "is_anagram(\"aab\", \"abb\")", expect: "False", label: "Same letters, different counts" },
      { call: "is_anagram(\"abc\", \"abcd\")", expect: "False", label: "Different lengths" }
    ],
    hints: ["A set keeps each letter only once, so it can't tell \"aab\" from \"abb\". Compare something that keeps the counts: <code>sorted(a) == sorted(b)</code>, or two Counters."],
    fix: `def is_anagram(a, b):
    a = a.replace(" ", "").lower()
    b = b.replace(" ", "").lower()
    return sorted(a) == sorted(b)

print(is_anagram("aab", "abb"))`,
    lesson: "A set answers \"which?\", not \"how many?\". When counts matter, use a Counter, a count dict or sorting."
  },
  explain: "Explain how you found the first unique character quickly. Why is calling <code>s.count(ch)</code> inside a loop slow, and what does your version do instead?",
  cards: [
    { q: "<code>counts.get(\"x\", 0)</code> when \"x\" isn't in the dict gives…", options: ["KeyError", "0", "None", "\"x\""], answer: 1 },
    { q: "Why is <code>set(a) == set(b)</code> a bad anagram check?", options: ["Sets are slow", "Sets forget how many times each letter appears", "Sets can't hold letters", "It's fine"], answer: 1 },
    { q: "Two passes over a string of n letters take about…", options: ["n × n steps", "2n steps, which still grows like n", "1 step", "n! steps"], answer: 1 }
  ],
  skills: { interview: 3, logic: 2, python: 3 }
}
);

LEVELS.push(
/* ───────────────────────────── 8-5 ───────────────────────────── */
{
  id: "8-5", world: 8, n: 5, title: "The Speed Detective", concept: "Big-O: how work grows with the input",
  learn: [
    { h: "Big-O counts steps, not seconds",
      p: "Seconds depend on the computer. Interviewers ask a better question: <b>if the input gets 10 times bigger, how much more work is there?</b> That's what Big-O describes. One loop over n items is <b>O(n)</b>: 10 times the data, 10 times the work. A loop inside a loop is <b>O(n²)</b>: 10 times the data, 100 times the work. That's why the 20,000-number tests in this world time out for nested loops.",
      lang: "text", file: "how the work grows",
      code: `items      O(1)    O(log n)   O(n)       O(n log n)   O(n²)
10         1       about 3    10         about 33     100
1,000      1       about 10   1,000      about 10k    1,000,000
1,000,000  1       about 20   1,000,000  about 20M    1,000,000,000,000` },
    { h: "The five you'll meet most",
      p: "<b>O(1)</b>: the same work whatever the size, like a dict look-up. <b>O(log n)</b>: halve the problem each step, like binary search. <b>O(n)</b>: look at each item once. <b>O(n log n)</b>: sorting. <b>O(n²)</b>: compare every item with every other. In an interview, after you write code, say its Big-O without being asked.",
      lang: "text", file: "spot the shape",
      code: `d[key]                       O(1)     one look-up
while lo <= hi: (halving)    O(log n)
for x in items:              O(n)     one pass
sorted(items)                O(n log n)
for a in items:
    for b in items:          O(n²)    every pair` },
    { h: "Hidden loops",
      p: "Some single lines secretly loop over a whole list: <code>x in a_list</code>, <code>a_list.count(x)</code>, <code>a_list.index(x)</code>, <code>a_list.remove(x)</code>, <code>sum(a_list)</code>, <code>max(a_list)</code>, and slicing like <code>a_list[:i]</code>. One of them inside a loop makes the whole thing O(n²), even though you only typed one <code>for</code>." },
    { h: "Trading memory for speed",
      p: "The fix for slow code is often to <b>remember</b> something: a set of what you've seen, a dict of counts, a running total. That uses extra memory (O(n) space) to save lots of time. Saying \"I'm trading memory for speed\" in an interview shows you understand the choice.",
      code: `def has_duplicate(items):
    seen = set()            # extra memory...
    for x in items:
        if x in seen:       # ...so this check is O(1)
            return True
        seen.add(x)
    return False

print(has_duplicate([4, 8, 15, 16, 23, 42, 8]))` }
  ],
  think: [
    { type: "match", q: "Match each piece of code with its Big-O.", pairs: [["<code>prices[\"dosa\"]</code>", "O(1)"], ["<code>for x in items: total += x</code>", "O(n)"], ["<code>sorted(items)</code>", "O(n log n)"], ["a loop inside a loop over the same list", "O(n²)"], ["halving the search range every step", "O(log n)"]],
      why: "These five cover almost every interview question you'll meet." },
    { type: "mcq", q: "An O(n²) function takes 1 second for 1,000 items. About how long for 10,000 items?", options: ["2 seconds", "10 seconds", "100 seconds", "1,000 seconds"], answer: 2,
      why: "10 times the items means 10 × 10 = 100 times the work for O(n²). An O(n) version would take about 10 seconds." },
    { type: "multi", q: "Which of these secretly loop over the whole list?", options: ["<code>x in my_list</code>", "<code>x in my_set</code>", "<code>my_list.count(x)</code>", "<code>len(my_list)</code>", "<code>sum(my_list)</code>"], answer: [0, 2, 4],
      why: "<code>in</code> on a list, <code>.count</code> and <code>sum</code> visit every item. A set look-up and <code>len</code> take about one step." },
    { type: "predict", q: "What does this print?", code: `steps = 0
n = 64
while n > 1:
    n = n // 2
    steps += 1
print(steps)`, answer: "6",
      why: "64 → 32 → 16 → 8 → 4 → 2 → 1: six halvings. Halving is O(log n): doubling the input adds just one more step." }
  ],
  code: {
    brief: "The festival gate scans every ticket. <code>first_repeat(tickets)</code> must return the first ticket that is scanned a <b>second</b> time (the repeat that happens earliest), or <code>None</code> if no ticket repeats.<br>The starter code is correct, but the gate freezes on a busy day with 50,000 tickets. Make it fast. Then say its Big-O in the Tavern.",
    sample: ">>> first_repeat([5, 3, 8, 3, 5])\n3\n>>> first_repeat([1, 2, 3])\nNone",
    starter: `def first_repeat(tickets):
    for i in range(len(tickets)):
        if tickets[i] in tickets[:i]:
            return tickets[i]
    return None
`,
    tests: [
      { call: "first_repeat([5, 3, 8, 3, 5])", expect: "3", label: "3 repeats before 5 does" },
      { call: "first_repeat([1, 2, 3])", expect: "None", label: "No repeats" },
      { call: "first_repeat([])", expect: "None", label: "No tickets" },
      { call: "first_repeat([\"A1\", \"B2\", \"A1\"])", expect: "'A1'", label: "Ticket codes as text" },
      { call: "first_repeat([7, 7])", expect: "7", label: "Back-to-back repeat" },
      { setup: "tickets = list(range(50000)) + [49999]", call: "first_repeat(tickets)", expect: "49999", limit: 3000, label: "50,000 tickets, fast",
        slowMsg: "Correct but too slow for 50,000 tickets. <code>x in tickets[:i]</code> copies and searches a slice on every lap: a hidden loop. Remember the tickets you've seen in a set." }
    ],
    fuzz: { n: 10, what: "random ticket lists", gen: (r) => ({ call: "first_repeat([" + Array.from({ length: r.int(0, 9) }, () => r.int(1, 8)).join(", ") + "])" }) },
    hints: [
      "Where's the hidden loop? <code>tickets[:i]</code> builds a new list, and <code>in</code> searches it. Both are O(n), inside an O(n) loop.",
      "Keep a <code>seen = set()</code>. For each ticket: if it's in <code>seen</code>, return it. Otherwise add it.",
      "That's one pass with O(1) checks: O(n) time, using O(n) extra memory for the set."
    ],
    solution: `def first_repeat(tickets):
    seen = set()
    for t in tickets:
        if t in seen:
            return t
        seen.add(t)
    return None`,
    wrong: [
      { code: `def first_repeat(tickets):
    seen = []
    for t in tickets:
        if t in seen:
            return t
        seen.append(t)
    return None`, why: "searching a list is still a hidden loop" },
      { code: `def first_repeat(tickets):
    for t in tickets:
        if tickets.count(t) > 1:
            return t
    return None`, why: "returns the first ticket that ever repeats, not the first repeat, and it's slow" }
    ]
  },
  bug: {
    brief: "A step-counter app shows a running total after every walk. The answers are right, but for a long history of 30,000 walks the app freezes. Find the hidden loop and make it fast.",
    code: `def running_totals(steps):
    out = []
    for i in range(len(steps)):
        out.append(sum(steps[:i + 1]))
    return out

print(running_totals([3000, 4500, 1200]))`,
    tests: [
      { call: "running_totals([3000, 4500, 1200])", expect: "[3000, 7500, 8700]", label: "Three walks" },
      { call: "running_totals([])", expect: "[]", label: "No walks" },
      { setup: "steps = list(range(30000))", call: "running_totals(steps)[-1]", expect: "449985000", limit: 3000, label: "30,000 walks, fast",
        slowMsg: "Still too slow. Each lap adds up the whole list again from the start. Keep a running total instead." }
    ],
    hints: ["<code>sum(steps[:i + 1])</code> adds everything again on every lap, so it's O(n²). Keep a variable <code>total</code>, add one walk each lap, and append it."],
    fix: `def running_totals(steps):
    out = []
    total = 0
    for s in steps:
        total += s
        out.append(total)
    return out

print(running_totals([3000, 4500, 1200]))`,
    lesson: "Code can be correct and still be a bug. Look for work that is repeated on every lap and remember it instead."
  },
  explain: "What is the Big-O of the starter code for the ticket gate, and of your version? Explain where the hidden loop was and what you traded to remove it.",
  cards: [
    { q: "One loop over n items is…", options: ["O(1)", "O(n)", "O(n²)", "O(log n)"], answer: 1 },
    { q: "Which line hides a loop?", options: ["<code>d[key]</code>", "<code>x in a_list</code>", "<code>len(a_list)</code>", "<code>a_list.append(x)</code>"], answer: 1 },
    { q: "Double the input for an O(n²) function. The work becomes…", options: ["Twice as much", "Four times as much", "The same", "Half"], answer: 1 }
  ],
  skills: { interview: 3, logic: 3, python: 1, debug: 1 }
},
/* ───────────────────────────── 8-6 ───────────────────────────── */
{
  id: "8-6", world: 8, n: 6, title: "Stack Tower", concept: "stacks: last in, first out",
  learn: [
    { h: "A stack is a pile of plates",
      p: "You put plates on top, and you take plates off the top. The last one in is the first one out (<b>LIFO</b>). In Python, a list is a perfect stack: <code>append</code> puts on top, <code>pop()</code> takes from the top. Both take about one step. Stacks are behind your browser's back button, every Undo button, and the way Python keeps track of function calls.",
      code: `plates = []
plates.append("red")
plates.append("blue")
plates.append("green")
print(plates.pop())    # the last one in comes out first
print(plates)` },
    { h: "Matching brackets: the classic stack question",
      p: "Is <code>{[()]}</code> balanced? Read it left to right. Push every <b>opening</b> bracket. For every <b>closing</b> bracket, the top of the stack must be its partner: pop it. At the end, the stack must be empty. A dict from closing to opening bracket keeps it short.",
      lang: "text", file: "checking ( [ ] )",
      code: `char  action                        stack
(     opening: push                 (
[     opening: push                 ( [
]     closing: top is [ → match, pop  (
)     closing: top is ( → match, pop  (empty)
end   stack is empty → balanced` },
    { h: "Three ways it can go wrong",
      p: "A closing bracket with the <b>wrong</b> partner on top: <code>(]</code>. A closing bracket when the stack is <b>empty</b>: <code>())</code>, where you must check before popping, or <code>pop()</code> crashes. Opening brackets <b>left over</b> at the end: <code>(()</code>. Good tests cover all three." },
    { h: "pop(0) is not a stack",
      p: "<code>pop(0)</code> takes from the <b>bottom</b>: that's a queue (first in, first out), like people in a line. It's also slow, because every other item has to shift down one place. For a real queue, Python has <code>collections.deque</code>." }
  ],
  think: [
    { type: "predict", q: "What does this print?", code: `stack = []
for ch in "abc":
    stack.append(ch)
print(stack.pop(), stack.pop())
stack.append("d")
print(stack)`, answer: "c b\n['a', 'd']",
      why: "c went in last, so it comes out first, then b. Only a is left, and d goes on top of it." },
    { type: "multi", q: "Which strings are balanced?", options: ["<code>([]{})</code>", "<code>(]</code>", "<code>(()</code>", "<code>{[()]}</code>", "<code>)(</code>"], answer: [0, 3],
      why: "<code>(]</code> closes with the wrong partner, <code>(()</code> leaves one open, and <code>)(</code> closes before anything is open." },
    { type: "order", indent: true, q: "Reverse a word using a stack. One line doesn't belong.", lines: ["word = \"stack\"", "letters = []", "for ch in word:", "    letters.append(ch)", "result = \"\"", "while letters:", "    result += letters.pop()", "print(result)"],
      distractors: ["    result += letters.pop(0)"], expect: ["kcats"],
      why: "Push every letter, then pop them all: the last letter comes out first, so the word comes out backwards. <code>pop(0)</code> would give the word back unchanged." },
    { type: "spot", q: "This bracket checker crashes on <code>\"())\"</code> with <i>IndexError: pop from empty list</i>. Which line needs a check before it?", code: `def balanced(s):
    stack = []
    for ch in s:
        if ch == "(":
            stack.append(ch)
        elif ch == ")":
            stack.pop()
    return not stack`, answer: 7,
      why: "When a <code>)</code> arrives with nothing open, there's nothing to pop. Check <code>if not stack: return False</code> first." }
  ],
  code: {
    brief: "Write <code>is_balanced(s)</code> that returns True if every bracket in <code>s</code> is closed by the right partner, in the right order. Brackets are <code>()</code>, <code>[]</code> and <code>{}</code>. Any other characters (letters, spaces, maths) are ignored.<br>• <code>\"{[()]}\"</code> and <code>\"print(nums[0])\"</code> are balanced<br>• <code>\"(]\"</code>, <code>\"(()\"</code> and <code>\"())\"</code> are not<br>• An empty string is balanced",
    sample: ">>> is_balanced(\"{[()]}\")\nTrue\n>>> is_balanced(\"(]\")\nFalse\n>>> is_balanced(\"print(nums[0])\")\nTrue",
    starter: `def is_balanced(s):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
`,
    tests: [
      { call: "is_balanced(\"{[()]}\")", expect: "True", label: "Nested brackets" },
      { call: "is_balanced(\"()[]{}\")", expect: "True", label: "Side by side" },
      { call: "is_balanced(\"print(nums[0])\")", expect: "True", label: "Other characters are ignored" },
      { call: "is_balanced(\"\")", expect: "True", label: "Empty string" },
      { call: "is_balanced(\"(]\")", expect: "False", label: "Wrong partner" },
      { call: "is_balanced(\"([)]\")", expect: "False", label: "Closed in the wrong order" },
      { call: "is_balanced(\"(()\")", expect: "False", label: "One left open" },
      { call: "is_balanced(\"())\")", expect: "False", label: "Closing with nothing open" },
      { call: "is_balanced(\"]\")", expect: "False", label: "Starts with a closing bracket" }
    ],
    fuzz: { n: 16, what: "random bracket strings", gen: (r, i) => {
      // Half are built balanced (random nesting, a few letters); the other half have one character swapped.
      const build = (d) => { let t = ""; for (let k = r.int(d ? 0 : 1, 2); k > 0; k--) { const j = r.int(0, 2); t += (r.next() < 0.3 ? "a" : "") + "([{"[j] + (d < 2 ? build(d + 1) : "") + ")]}"[j]; } return t; };
      let t = build(0);
      if (i % 2) { const p = r.int(0, t.length - 1); t = t.slice(0, p) + r.pick(")]}([{".split("")) + t.slice(p + 1); }
      return { call: "is_balanced(" + JSON.stringify(t) + ")" };
    } },
    hints: [
      "Loop over each character. If it's an opening bracket (one of the dict's values), push it.",
      "If it's a closing bracket (a key in <code>pairs</code>): if the stack is empty, or <code>stack.pop() != pairs[ch]</code>, return False.",
      "After the loop, it's balanced only if nothing is left open: <code>return not stack</code>."
    ],
    solution: `def is_balanced(s):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for ch in s:
        if ch in "([{":
            stack.append(ch)
        elif ch in pairs:
            if not stack or stack.pop() != pairs[ch]:
                return False
    return not stack`,
    wrong: [
      { code: `def is_balanced(s):
    return s.count("(") == s.count(")") and s.count("[") == s.count("]") and s.count("{") == s.count("}")`, why: "counting ignores the order" },
      { code: `def is_balanced(s):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for ch in s:
        if ch in "([{":
            stack.append(ch)
        elif ch in pairs:
            if not stack or stack.pop() != pairs[ch]:
                return False
    return True`, why: "forgets brackets left open" },
      { code: `def is_balanced(s):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for ch in s:
        if ch in "([{":
            stack.append(ch)
        elif ch in pairs:
            if stack and stack.pop() != pairs[ch]:
                return False
    return not stack`, why: "accepts a closing bracket with nothing open" }
    ]
  },
  bug: {
    brief: "The notes app has Undo. After typing \"Hello\", \" world\" and \"!\", one Undo should leave \"Hello world\". Instead the whole note disappears. The history is used like a queue instead of a stack.",
    code: `class Editor:
    def __init__(self):
        self.text = ""
        self.history = []

    def write(self, words):
        self.history.append(self.text)
        self.text += words

    def undo(self):
        if self.history:
            self.text = self.history.pop(0)

e = Editor()
e.write("Hello")
e.write(" world")
e.write("!")
e.undo()
print(e.text)`,
    tests: [
      { setup: "e = Editor()\ne.write('Hello')\ne.write(' world')\ne.write('!')\ne.undo()", call: "e.text", expect: "'Hello world'", label: "One undo" },
      { setup: "e = Editor()\ne.write('Hello')\ne.write(' world')\ne.write('!')\ne.undo()\ne.undo()", call: "e.text", expect: "'Hello'", label: "Two undos" },
      { setup: "e = Editor()\ne.write('Hi')\ne.undo()\ne.undo()", call: "e.text", expect: "''", label: "Undo with nothing left does nothing" }
    ],
    hints: ["Undo should restore the <b>most recent</b> saved text, which is at the end of the list. <code>pop(0)</code> takes the oldest one."],
    fix: `class Editor:
    def __init__(self):
        self.text = ""
        self.history = []

    def write(self, words):
        self.history.append(self.text)
        self.text += words

    def undo(self):
        if self.history:
            self.text = self.history.pop()

e = Editor()
e.write("Hello")
e.write(" world")
e.write("!")
e.undo()
print(e.text)`,
    lesson: "Undo is a stack: the newest change comes off first. <code>pop()</code> takes from the top, <code>pop(0)</code> from the bottom."
  },
  explain: "Explain how your bracket checker uses a stack. Walk through <code>\"([)]\"</code> and say exactly where and why it returns False.",
  cards: [
    { q: "A stack is…", options: ["First in, first out", "Last in, first out", "Sorted", "Random"], answer: 1 },
    { q: "Which pair of list methods makes a stack?", options: ["<code>append</code> and <code>pop()</code>", "<code>insert(0)</code> and <code>sort</code>", "<code>append</code> and <code>pop(0)</code>", "<code>count</code> and <code>index</code>"], answer: 0 },
    { q: "When is a bracket string balanced at the end?", options: ["When the stack is empty", "When the stack is full", "When it has an even length", "Always"], answer: 0 }
  ],
  skills: { interview: 3, logic: 3, python: 2 }
},
/* ───────────────────────────── 8-7 ───────────────────────────── */
{
  id: "8-7", world: 8, n: 7, title: "Halving the Maze", concept: "binary search and recursion",
  learn: [
    { h: "Guess a number from 1 to 1,000,000 in 20 tries",
      p: "Always guess the <b>middle</b>. \"Higher\" or \"lower\" throws away half of what's left. A million becomes 500,000, then 250,000... After 20 halvings, one number is left. That's <b>binary search</b>, and it's O(log n): doubling the range adds just one more guess. It only works when the data is <b>sorted</b> (numbers in order, words in a dictionary).",
      code: `low, high = 1, 1000000
guesses = 0
while low < high:
    low = (low + high) // 2 + 1     # pretend the answer was always "higher"
    guesses += 1
print(guesses, "guesses at most")` },
    { h: "Binary search on a sorted list",
      p: "Keep two edges, <code>low</code> and <code>high</code>. Look at the middle. Too small? The answer must be to the right, so <code>low = mid + 1</code>. Too big? <code>high = mid - 1</code>. Stop when you find it, or when the edges cross: then it isn't there.",
      code: `def search(nums, target):
    low, high = 0, len(nums) - 1
    while low <= high:
        mid = (low + high) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1

print(search([2, 5, 8, 12, 16, 23, 38], 23), search([2, 5, 8], 7))` },
    { h: "The off-by-one traps",
      p: "Three details catch everyone: use <code>//</code> so mid is a whole number; loop <code>while low &lt;= high</code> (with <code>&lt;</code> you'd skip the last candidate); and move to <code>mid + 1</code> or <code>mid - 1</code>, never just <code>mid</code>, or the loop can get stuck forever. In real code, Python's <code>bisect</code> module does this for you." },
    { h: "Recursion: a function that calls itself",
      p: "Some problems contain smaller copies of themselves. A <b>recursive</b> function solves a small piece, then calls itself on the rest. It needs a <b>base case</b> that stops without calling itself again, or it never ends (Python stops it with a <i>RecursionError</i>). And it must <b>use</b> what the inner call returns.",
      code: `def total(nums):
    if not nums:                    # base case: an empty list adds up to 0
        return 0
    return nums[0] + total(nums[1:])   # first item + the total of the rest

print(total([4, 2, 7]))` }
  ],
  think: [
    { type: "trace", q: "Trace a binary search for 23 in <code>[2, 5, 8, 12, 16, 23, 38]</code>. Write <code>low</code>, <code>high</code> and <code>mid</code> on each lap.", code: `nums = [2, 5, 8, 12, 16, 23, 38]
low, high = 0, len(nums) - 1
while low <= high:
    mid = (low + high) // 2
    if nums[mid] == 23:
        break
    if nums[mid] < 23:
        low = mid + 1
    else:
        high = mid - 1`, vars: ["low", "high", "mid"], rows: [[0, 6, 3], [4, 6, 5]],
      check: `nums = [2, 5, 8, 12, 16, 23, 38]
low, high = 0, len(nums) - 1
while low <= high:
    mid = (low + high) // 2
    print(low, high, mid)
    if nums[mid] == 23:
        break
    if nums[mid] < 23:
        low = mid + 1
    else:
        high = mid - 1`,
      why: "The middle is 12, too small, so low jumps to 4. The new middle is position 5: 23. Two looks instead of six." },
    { type: "mcq", q: "With binary search, what's the most guesses you need for a number from 1 to 1,000?", options: ["10", "100", "500", "1,000"], answer: 0,
      why: "2 to the power 10 is 1,024, so 10 halvings get from 1,000 down to one number." },
    { type: "predict", q: "What does this print?", code: `def count(n):
    if n == 0:
        return "go!"
    return str(n) + " " + count(n - 1)

print(count(3))`, answer: "3 2 1 go!",
      why: "count(3) is \"3 \" + count(2), which is \"2 \" + count(1), and so on down to the base case, which returns \"go!\"." },
    { type: "mcq", q: "A recursive function has no base case. What happens?", options: ["It returns None", "It calls itself until Python stops it with a RecursionError", "Python adds a base case for you", "It runs once"], answer: 1,
      why: "Without a case that stops, every call makes another call. Python allows about a thousand nested calls, then raises RecursionError." }
  ],
  code: {
    brief: "The Oracle has picked a secret number between <code>low</code> and <code>high</code> (both included). Write <code>find_secret(guess, low, high)</code> that finds it and returns it.<br>You can't see the number. Call <code>guess(x)</code> and it returns <code>\"higher\"</code> (the secret is bigger than x), <code>\"lower\"</code> (it's smaller) or <code>\"correct\"</code>.<br>The Oracle is impatient: for 1 to 1,000,000 you get at most <b>20</b> guesses, and after 40 it throws you out.",
    sample: ">>> find_secret(guess, 1, 100)    # the secret was 73\n73\n# guesses: 50 → higher, 75 → lower, 62 → higher, 68 → higher,\n#          71 → higher, 73 → correct",
    starter: `def find_secret(guess, low, high):
    # Guess the middle of low..high each time.
    # guess(x) answers "higher", "lower" or "correct".
    pass
`,
    tests: [
      { setup: "SECRET = 73\n_calls = [0]\ndef guess(x):\n    _calls[0] += 1\n    if _calls[0] > 40:\n        raise RuntimeError('More than 40 guesses! Guess the middle of what is left each time.')\n    if x == SECRET:\n        return 'correct'\n    return 'higher' if SECRET > x else 'lower'", call: "find_secret(guess, 1, 100)", expect: "73", label: "Secret 73, range 1 to 100" },
      { setup: "SECRET = 777777\n_calls = [0]\ndef guess(x):\n    _calls[0] += 1\n    if _calls[0] > 40:\n        raise RuntimeError('More than 40 guesses! Guess the middle of what is left each time.')\n    if x == SECRET:\n        return 'correct'\n    return 'higher' if SECRET > x else 'lower'", call: "(find_secret(guess, 1, 1000000), _calls[0] <= 20)", expect: "(777777, True)", label: "1 to 1,000,000 in at most 20 guesses" },
      { setup: "SECRET = 1\n_calls = [0]\ndef guess(x):\n    _calls[0] += 1\n    if _calls[0] > 40:\n        raise RuntimeError('More than 40 guesses! Guess the middle of what is left each time.')\n    if x == SECRET:\n        return 'correct'\n    return 'higher' if SECRET > x else 'lower'", call: "(find_secret(guess, 1, 1000000), _calls[0] <= 20)", expect: "(1, True)", label: "The lowest possible number" },
      { setup: "SECRET = 1000000\n_calls = [0]\ndef guess(x):\n    _calls[0] += 1\n    if _calls[0] > 40:\n        raise RuntimeError('More than 40 guesses! Guess the middle of what is left each time.')\n    if x == SECRET:\n        return 'correct'\n    return 'higher' if SECRET > x else 'lower'", call: "(find_secret(guess, 1, 1000000), _calls[0] <= 20)", expect: "(1000000, True)", label: "The highest possible number" },
      { setup: "SECRET = 5\n_calls = [0]\ndef guess(x):\n    _calls[0] += 1\n    if _calls[0] > 40:\n        raise RuntimeError('More than 40 guesses! Guess the middle of what is left each time.')\n    if x == SECRET:\n        return 'correct'\n    return 'higher' if SECRET > x else 'lower'", call: "find_secret(guess, 5, 5)", expect: "5", label: "A range with one number" },
      { setup: "SECRET = -7\n_calls = [0]\ndef guess(x):\n    _calls[0] += 1\n    if _calls[0] > 40:\n        raise RuntimeError('More than 40 guesses! Guess the middle of what is left each time.')\n    if x == SECRET:\n        return 'correct'\n    return 'higher' if SECRET > x else 'lower'", call: "find_secret(guess, -50, 50)", expect: "-7", label: "Negative numbers" }
    ],
    fuzz: { n: 12, what: "random secrets and ranges", gen: (r) => {
      const lo = r.int(-1000, 1000), hi = lo + r.int(0, 5000), secret = r.int(lo, hi), most = Math.ceil(Math.log2(hi - lo + 1)) + 1;
      return { setup: "SECRET = " + secret + "\n_calls = [0]\ndef guess(x):\n    _calls[0] += 1\n    if _calls[0] > 40:\n        raise RuntimeError('More than 40 guesses! Guess the middle of what is left each time.')\n    if x == SECRET:\n        return 'correct'\n    return 'higher' if SECRET > x else 'lower'",
        call: "(find_secret(guess, " + lo + ", " + hi + "), _calls[0] <= " + most + ")" };
    } },
    hints: [
      "Ask <code>answer = guess(mid)</code> once per lap, and store it, so you don't waste guesses.",
      "If it's <code>\"correct\"</code>, return mid. If <code>\"higher\"</code>, the secret is above mid: <code>low = mid + 1</code>. If <code>\"lower\"</code>: <code>high = mid - 1</code>.",
      "Use <code>//</code> so mid is a whole number. <code>(low + high) / 2</code> gives a float like 36.5."
    ],
    solution: `def find_secret(guess, low, high):
    while low <= high:
        mid = (low + high) // 2
        answer = guess(mid)
        if answer == "correct":
            return mid
        if answer == "higher":
            low = mid + 1
        else:
            high = mid - 1
    return None`,
    alts: [`def find_secret(guess, low, high):
    mid = (low + high) // 2
    answer = guess(mid)
    if answer == "correct":
        return mid
    if answer == "higher":
        return find_secret(guess, mid + 1, high)
    return find_secret(guess, low, mid - 1)`],
    wrong: [
      { code: `def find_secret(guess, low, high):
    for x in range(low, high + 1):
        if guess(x) == "correct":
            return x`, why: "guesses one by one" },
      { code: `def find_secret(guess, low, high):
    while low <= high:
        mid = (low + high) // 2
        if guess(mid) == "correct":
            return mid
        if guess(mid) == "higher":
            low = mid + 1
        else:
            high = mid - 1`, why: "asks twice per lap, so it uses up to 40 guesses" },
      { code: `def find_secret(guess, low, high):
    while low < high:
        mid = (low + high) // 2
        answer = guess(mid)
        if answer == "correct":
            return mid
        if answer == "higher":
            low = mid + 1
        else:
            high = mid - 1
    return None`, why: "< skips the last candidate" }
    ]
  },
  bug: {
    brief: "<code>nested_sum(items)</code> should add up every number in a list, even numbers inside lists inside lists. For <code>[1, [2, 3], [4, [5]]]</code> it should give 15, but it gives 1. The recursive call happens, but its answer is thrown away.",
    code: `def nested_sum(items):
    total = 0
    for x in items:
        if isinstance(x, list):
            nested_sum(x)
        else:
            total += x
    return total

print(nested_sum([1, [2, 3], [4, [5]]]))`,
    tests: [
      { call: "nested_sum([1, [2, 3], [4, [5]]])", expect: "15", label: "Lists inside lists" },
      { call: "nested_sum([1, 2, 3])", expect: "6", label: "A flat list" },
      { call: "nested_sum([[], [[]]])", expect: "0", label: "Only empty lists" },
      { call: "nested_sum([[[[10]]]])", expect: "10", label: "Deeply nested" }
    ],
    hints: ["<code>nested_sum(x)</code> works out the inner total, but nothing uses it. Add it: <code>total += nested_sum(x)</code>."],
    fix: `def nested_sum(items):
    total = 0
    for x in items:
        if isinstance(x, list):
            total += nested_sum(x)
        else:
            total += x
    return total

print(nested_sum([1, [2, 3], [4, [5]]]))`,
    lesson: "A recursive call is just a function call: if you don't use what it returns, the work is lost."
  },
  explain: "Explain why your <code>find_secret</code> never needs more than 20 guesses for 1 to 1,000,000. What would go wrong if you used <code>while low &lt; high</code> or <code>high = mid</code>?",
  cards: [
    { q: "Binary search only works if the data is…", options: ["Short", "Sorted", "Unique", "Numbers"], answer: 1 },
    { q: "Binary search is…", options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], answer: 1 },
    { q: "What must every recursive function have?", options: ["A loop", "A base case that stops it", "A global variable", "Two parameters"], answer: 1 }
  ],
  skills: { interview: 3, logic: 3, python: 2 }
},
/* ───────────────────────────── 8-8 ───────────────────────────── */
{
  id: "8-8", world: 8, n: 8, boss: true, title: "The Final Interview", concept: "Boss: a three-question coding round",
  learn: [
    { h: "Boss rules",
      p: "This is a real coding round: three questions like the ones companies ask in a first technical interview. Each needs a pattern from this world, and each has a speed test. Follow UMPIRE for each one: say the problem back, try an example by hand, plan, code, trace it, then say its Big-O. Do them in any order.",
      lang: "text", file: "the round",
      code: `group_anagrams(words)  -> list of groups of words that are anagrams of each other
longest_streak(days)   -> length of the longest run of consecutive numbers
top_k(nums, k)         -> the k most frequent numbers

Each one: about 15 minutes in a real interview. Talk while you work.` },
    { h: "Group anagrams: find a shared key",
      p: "Anagrams become the same when you sort their letters: <i>eat</i>, <i>tea</i> and <i>ate</i> all become <code>\"aet\"</code>. Use that as a dict key and collect the words that share it. Dicts remember the order keys arrive, so the groups come out in the order they first appeared.",
      code: `key = "".join(sorted("tea"))
print(key)

groups = {}
groups.setdefault(key, []).append("tea")    # make the list if it's new, then add
groups.setdefault(key, []).append("eat")
print(groups)` },
    { h: "Longest streak: only start counting at the start",
      p: "Put the numbers in a set. A number <code>n</code> starts a streak only if <code>n - 1</code> isn't in the set. From each start, count up while <code>n + 1</code> is there. Every number is visited about twice in total, so it's O(n). Counting up from <i>every</i> number would be O(n²) on a long streak. Sorting first also works, in O(n log n)." },
    { h: "Top k: count, then sort by the count",
      p: "Count with a dict or Counter, then sort the distinct numbers by count, biggest first. To break ties by the smaller number, sort by a tuple: <code>key=lambda n: (-counts[n], n)</code>. The minus sign flips the count so the biggest comes first.",
      code: `counts = {5: 2, 1: 3, 9: 2}
print(sorted(counts, key=lambda n: (-counts[n], n)))` }
  ],
  think: [
    { type: "order", q: "The interviewer says: \"Find the longest run of consecutive numbers.\" Put your first moves in order.", lines: ["Say it back: \"So for [100, 4, 200, 1, 3, 2] the answer is 4, from 1 to 4?\"", "Ask: \"Can there be duplicates? What should an empty list give?\"", "Say the simple idea: sort, then walk through counting runs", "Improve: use a set and only count up from the start of each run", "Code it, then trace it with the example", "Say the Big-O: O(n) time, O(n) extra memory"],
      why: "Understand, ask, a simple idea, a better idea, code and check, then evaluate. That's UMPIRE in a real round." },
    { type: "predict", q: "What does this print?", code: `words = ["tan", "ate", "nat"]
print(["".join(sorted(w)) for w in words])`, answer: "['ant', 'aet', 'ant']",
      why: "Sorting the letters gives anagrams the same key: tan and nat both become ant." },
    { type: "multi", q: "For <code>longest_streak</code>, which inputs should your own tests include?", options: ["An empty list", "Duplicates, like <code>[1, 2, 2, 3]</code>", "Numbers out of order", "Negative numbers", "Only the example from the question"], answer: [0, 1, 2, 3],
      why: "Empty input, repeats, order and negatives are where bugs hide. The example alone proves little." },
    { type: "mcq", q: "You finish early. What's the best use of the last five minutes?", options: ["Sit quietly", "Trace your code with an edge case and say its Big-O", "Rewrite it in another language", "Ask if you passed"], answer: 1,
      why: "Finding your own bug before the interviewer does is one of the strongest signals you can give." }
  ],
  code: {
    brief: "Three questions, three functions:<br>• <code>group_anagrams(words)</code> returns a list of groups (lists). Words that are anagrams go in the same group. Groups are in the order their first word appears, and words in each group keep their order.<br>• <code>longest_streak(days)</code> returns the length of the longest run of consecutive whole numbers in the list, in any order: <code>[100, 4, 200, 1, 3, 2]</code> gives 4 (1, 2, 3, 4). Duplicates don't break a run. An empty list gives 0.<br>• <code>top_k(nums, k)</code> returns the <code>k</code> most frequent numbers, most frequent first. Ties go to the <b>smaller</b> number. If there are fewer than <code>k</code> different numbers, return them all.<br>Each has a speed test, so no loops inside loops over the whole input.",
    sample: ">>> group_anagrams([\"eat\", \"tea\", \"tan\", \"ate\", \"nat\", \"bat\"])\n[['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']]\n>>> longest_streak([100, 4, 200, 1, 3, 2])\n4\n>>> top_k([1, 1, 1, 2, 2, 3], 2)\n[1, 2]",
    starter: `def group_anagrams(words):
    pass


def longest_streak(days):
    pass


def top_k(nums, k):
    pass
`,
    tests: [
      { call: "group_anagrams([\"eat\", \"tea\", \"tan\", \"ate\", \"nat\", \"bat\"])", expect: "[['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']]", label: "group_anagrams: the example" },
      { call: "group_anagrams([])", expect: "[]", label: "group_anagrams: no words" },
      { call: "group_anagrams([\"a\", \"b\", \"a\"])", expect: "[['a', 'a'], ['b']]", label: "group_anagrams: repeated words" },
      { setup: "words = ['w' + str(i) for i in range(30000)]", call: "len(group_anagrams(words))", expect: "2207", limit: 3000, label: "group_anagrams: 30,000 words (2,207 groups), fast",
        slowMsg: "group_anagrams is too slow. Use a dict from sorted letters to the group, instead of searching through the groups for every word." },
      { call: "longest_streak([100, 4, 200, 1, 3, 2])", expect: "4", label: "longest_streak: the example" },
      { call: "longest_streak([])", expect: "0", label: "longest_streak: empty list" },
      { call: "longest_streak([1, 2, 2, 3])", expect: "3", label: "longest_streak: duplicates don't break a run" },
      { call: "longest_streak([10, 5, 12, 3, 11, 4])", expect: "3", label: "longest_streak: two runs of 3" },
      { call: "longest_streak([-1, 0, 1, 7])", expect: "3", label: "longest_streak: negatives" },
      { setup: "days = list(range(60000, 0, -1))", call: "longest_streak(days)", expect: "60000", limit: 3000, label: "longest_streak: one run of 60,000, fast",
        slowMsg: "longest_streak is too slow. Only count upwards from numbers that start a run (n - 1 isn't in the set), or sort first." },
      { call: "top_k([1, 1, 1, 2, 2, 3], 2)", expect: "[1, 2]", label: "top_k: the example" },
      { call: "top_k([4, 4, 5, 5, 6], 2)", expect: "[4, 5]", label: "top_k: a tie goes to the smaller number" },
      { call: "top_k([3, 1, 3, 1, 2], 3)", expect: "[1, 3, 2]", label: "top_k: ties, then the rest" },
      { call: "top_k([7], 5)", expect: "[7]", label: "top_k: fewer numbers than k" },
      { setup: "nums = [i % 20000 for i in range(60000)]", call: "top_k(nums, 3)", expect: "[0, 1, 2]", limit: 3000, label: "top_k: 60,000 numbers, fast",
        slowMsg: "top_k is too slow. <code>nums.count(n)</code> inside a loop reads the whole list every time. Count everything in one pass." }
    ],
    fuzz: { n: 15, what: "random inputs for all three", gen: (r, i) => {
      const nums = () => "[" + Array.from({ length: r.int(0, 9) }, () => r.int(-3, 8)).join(", ") + "]";
      if (i % 3 === 0) return { call: "group_anagrams(" + JSON.stringify(Array.from({ length: r.int(0, 7) }, () => r.pick(["ab", "ba", "abc", "cab", "b", "a", "bca", "aab", "aba"]))) + ")" };
      if (i % 3 === 1) return { call: "longest_streak(" + nums() + ")" };
      return { call: "top_k(" + nums() + ", " + r.int(1, 4) + ")" };
    } },
    hints: [
      "<code>group_anagrams</code>: <code>groups = {}</code>, then for each word <code>groups.setdefault(\"\".join(sorted(w)), []).append(w)</code>. Return <code>list(groups.values())</code>.",
      "<code>longest_streak</code>: <code>s = set(days)</code>. For each n in s where <code>n - 1 not in s</code>, count up while <code>n + length in s</code>. Keep the best.",
      "<code>top_k</code>: build <code>counts</code> in one pass, then <code>sorted(counts, key=lambda n: (-counts[n], n))[:k]</code>."
    ],
    solution: `def group_anagrams(words):
    groups = {}
    for w in words:
        key = "".join(sorted(w))
        groups.setdefault(key, []).append(w)
    return list(groups.values())


def longest_streak(days):
    s = set(days)
    best = 0
    for n in s:
        if n - 1 not in s:
            length = 1
            while n + length in s:
                length += 1
            best = max(best, length)
    return best


def top_k(nums, k):
    counts = {}
    for n in nums:
        counts[n] = counts.get(n, 0) + 1
    return sorted(counts, key=lambda n: (-counts[n], n))[:k]`,
    alts: [`from collections import Counter


def group_anagrams(words):
    groups = {}
    for w in words:
        key = tuple(sorted(w))
        if key not in groups:
            groups[key] = []
        groups[key].append(w)
    return [g for g in groups.values()]


def longest_streak(days):
    if not days:
        return 0
    nums = sorted(set(days))
    best = run = 1
    for i in range(1, len(nums)):
        if nums[i] == nums[i - 1] + 1:
            run += 1
            best = max(best, run)
        else:
            run = 1
    return best


def top_k(nums, k):
    c = Counter(nums)
    pairs = sorted(c.items(), key=lambda p: (-p[1], p[0]))
    return [n for n, _ in pairs[:k]]`],
    wrong: [
      { code: `def group_anagrams(words):
    groups = []
    for w in words:
        for g in groups:
            if sorted(g[0]) == sorted(w):
                g.append(w)
                break
        else:
            groups.append([w])
    return groups


def longest_streak(days):
    s = set(days)
    best = 0
    for n in s:
        if n - 1 not in s:
            length = 1
            while n + length in s:
                length += 1
            best = max(best, length)
    return best


def top_k(nums, k):
    counts = {}
    for n in nums:
        counts[n] = counts.get(n, 0) + 1
    return sorted(counts, key=lambda n: (-counts[n], n))[:k]`, why: "group_anagrams searches every group for every word" },
      { code: `def group_anagrams(words):
    groups = {}
    for w in words:
        groups.setdefault("".join(sorted(w)), []).append(w)
    return list(groups.values())


def longest_streak(days):
    s = set(days)
    best = 0
    for n in s:
        length = 1
        while n + length in s:
            length += 1
        best = max(best, length)
    return best


def top_k(nums, k):
    counts = {}
    for n in nums:
        counts[n] = counts.get(n, 0) + 1
    return sorted(counts, key=lambda n: (-counts[n], n))[:k]`, why: "longest_streak counts up from every number" },
      { code: `def group_anagrams(words):
    groups = {}
    for w in words:
        groups.setdefault("".join(sorted(w)), []).append(w)
    return list(groups.values())


def longest_streak(days):
    s = set(days)
    best = 0
    for n in s:
        if n - 1 not in s:
            length = 1
            while n + length in s:
                length += 1
            best = max(best, length)
    return best


def top_k(nums, k):
    counts = {}
    for n in nums:
        counts[n] = counts.get(n, 0) + 1
    return sorted(counts, key=lambda n: -counts[n])[:k]`, why: "top_k ignores the tie rule" }
    ]
  },
  bug: {
    brief: "Mock interview: review a candidate's <code>longest_streak</code>. It passes the example, but the interviewer found <b>two</b> bugs: an empty list gives 1 instead of 0, and <code>[1, 2, 2, 3]</code> gives 2 instead of 3. Fix both.",
    code: `def longest_streak(days):
    days = sorted(days)
    best = 1
    run = 1
    for i in range(1, len(days)):
        if days[i] == days[i - 1] + 1:
            run += 1
            best = max(best, run)
        else:
            run = 1
    return best

print(longest_streak([100, 4, 200, 1, 3, 2]))
print(longest_streak([]), longest_streak([1, 2, 2, 3]))`,
    tests: [
      { call: "longest_streak([100, 4, 200, 1, 3, 2])", expect: "4", label: "The example" },
      { call: "longest_streak([])", expect: "0", label: "Empty list" },
      { call: "longest_streak([1, 2, 2, 3])", expect: "3", label: "A duplicate in the middle of a run" },
      { call: "longest_streak([5, 5, 5])", expect: "1", label: "Only duplicates" }
    ],
    hints: [
      "Empty list: <code>best</code> starts at 1 before looking at any data. Return 0 straight away when there are no days.",
      "Duplicates: after sorting, <code>[1, 2, 2, 3]</code> has 2 next to 2, which resets the run. Either skip a number equal to the one before it, or sort <code>set(days)</code> instead."
    ],
    fix: `def longest_streak(days):
    if not days:
        return 0
    days = sorted(set(days))
    best = 1
    run = 1
    for i in range(1, len(days)):
        if days[i] == days[i - 1] + 1:
            run += 1
            best = max(best, run)
        else:
            run = 1
    return best

print(longest_streak([100, 4, 200, 1, 3, 2]))
print(longest_streak([]), longest_streak([1, 2, 2, 3]))`,
    lesson: "Passing the example proves little. Interviewers test empty input and duplicates first, so you should too."
  },
  explain: "Interview practice: pick one of the three questions and explain your solution as you would in a real interview: the pattern, the steps, the edge cases, and its Big-O.",
  cards: [
    { q: "What key groups anagrams together?", options: ["The word's length", "The word's letters, sorted", "The first letter", "The word reversed"], answer: 1 },
    { q: "In <code>longest_streak</code>, when do you start counting up from n?", options: ["Always", "Only when n - 1 is not in the set", "Only when n is even", "Only for the smallest number"], answer: 1 },
    { q: "<code>key=lambda n: (-counts[n], n)</code> sorts by…", options: ["Count, smallest first", "Count, biggest first, then the smaller number", "Number only", "Random order"], answer: 1 }
  ],
  skills: { interview: 4, logic: 3, python: 3, talk: 2 },
  homeQuest: {
    title: "Take it home",
    intro: "Final week. The goal isn't to feel ready, it's to start applying. Interviews are a skill you get better at by doing them.",
    tasks: [
      { t: "Write a one-page resume", d: "Projects first: your flagship and two others, each with a live link, the tech you used and one result. Follow the Tech Interview Handbook resume guide.", skill: "talk" },
      { t: "Update LinkedIn and GitHub", d: "A clear headline (\"Python developer: web apps and data\"), your projects pinned on GitHub, and a README on each one.", skill: "talk" },
      { t: "Solve 15 practice problems", d: "Easy ones from NeetCode or LeetCode 75: arrays and hashing, two pointers, stack, binary search. Say each solution out loud with UMPIRE.", skill: "interview" },
      { t: "Do two mock interviews", d: "One with a friend, one with a stranger (Exponent's free peer practice). Ask for honest feedback and fix one habit.", skill: "interview" },
      { t: "Prepare your stories", d: "Practise \"Tell me about yourself\" (60 seconds) and two project stories: the problem, what you built, a hard bug, what you'd do differently.", skill: "talk" },
      { t: "Send 10 applications", d: "Internships and junior roles, on company career pages, LinkedIn, Naukri, Wellfound or Internshala. Track each one in a spreadsheet and follow up after a week.", skill: "interview" }
    ]
  }
}
);
