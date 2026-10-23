/* World 7 — Launch Harbor: Git, merging, testing first, docs, config and secrets, reviewing AI code.
   Boss: Ship It, a pre-launch checker for a project. */

RESOURCES[7] = [
  { name: "Pro Git, ch. 2 and 3 (free book)", what: "Recording changes, then branches. The official Git book.", url: "https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository" },
  { name: "Learn Git Branching", what: "An interactive visual game for branches and merges. Do the first two sections.", url: "https://learngitbranching.js.org/" },
  { name: "First Contributions", what: "Make your first pull request on a practice repo, step by step.", url: "https://github.com/firstcontributions/first-contributions" },
  { name: "Good First Issue", what: "Find beginner-friendly issues in real open-source projects.", url: "https://goodfirstissue.dev/" },
  { name: "GitHub Docs: Review AI-generated code", what: "GitHub's own checklist for checking code an AI wrote.", url: "https://docs.github.com/en/copilot/tutorials/review-ai-generated-code" },
  { name: "How to write a Git commit message", what: "Seven short rules every team follows.", url: "https://cbea.ms/git-commit/" }
];

LEVELS.push(
/* ───────────────────────────── 7-1 ───────────────────────────── */
{
  id: "7-1", world: 7, n: 1, title: "Save Points", concept: "Git: snapshots, add, commit, log",
  learn: [
    { h: "Git saves snapshots of your project",
      p: "<b>Git</b> records the history of a project as a series of <b>commits</b>. Each commit is a snapshot of every tracked file at that moment, plus a message saying what changed and why. You can look back at any commit, compare versions, or undo mistakes. Every software job uses it.",
      lang: "text", file: "a terminal session",
      code: `$ git init                      # start tracking this folder
$ git status                    # what changed since the last commit?
$ git add tracker.py            # put this change in the next snapshot (staging)
$ git commit -m "Add total command to tracker"
$ git log --oneline             # the history, newest first
a1f3c9e Add total command to tracker
7b2d011 Create expense tracker` },
    { h: "Three places: working folder, staging, history",
      p: "You edit files in your <b>working folder</b>. <code>git add</code> copies chosen changes to the <b>staging area</b>. <code>git commit</code> saves everything staged as a new snapshot in the <b>history</b>. Staging lets you commit related changes together and leave half-finished work out.",
      lang: "text", file: "where changes travel",
      code: `edit files  --git add-->  staging area  --git commit-->  history (local)
                                                         --git push-->  GitHub (remote)` },
    { h: "Commit is local, push shares it",
      p: "A commit lives only on your computer. <code>git push</code> uploads your commits to a <b>remote</b> like GitHub, and <code>git pull</code> downloads other people's. \"I committed, so it's on GitHub\" is a classic beginner mistake.",
      lang: "text", file: "sharing work",
      code: `$ git commit -m "Fix crash on empty input"   # saved on your laptop only
$ git push                                    # now it's on GitHub
$ git pull                                    # get your teammates' new commits` },
    { h: "Good commit messages",
      p: "Write the message as a short command that completes \"This commit will…\": <i>Add login page</i>, <i>Fix crash when file is missing</i>. Keep it under about 50 characters, and make each commit one logical change. Recruiters really do read your GitHub history.",
      lang: "text", file: "good and bad messages",
      code: `Good:  Add streak calculation to habit tracker
Good:  Fix KeyError when a category is new
Bad:   changes
Bad:   asdfgh
Bad:   Fixed stuff and added things and also updated readme` }
  ],
  think: [
    { type: "order", q: "Put these steps in the order you'd use them to share a fix.", lines: ["Edit the file", "git add the file", "git commit -m \"Fix crash on empty list\"", "git push"],
      why: "Edit, stage, save a snapshot locally, then share it." },
    { type: "mcq", q: "You committed your fix. Can your teammate see it on GitHub yet?", options: ["Yes, commits go to GitHub automatically", "No, not until you push", "Only if they pull first", "Only on Mondays"], answer: 1,
      why: "Commits are local. <code>git push</code> sends them to the remote." },
    { type: "match", q: "Match each command with what it does.", pairs: [["<code>git status</code>", "shows what has changed"], ["<code>git add</code>", "stages changes for the next commit"], ["<code>git commit</code>", "saves a snapshot locally"], ["<code>git log</code>", "shows the history"], ["<code>git push</code>", "uploads commits to the remote"]],
      why: "These five commands are most of what you'll type every day." },
    { type: "multi", q: "Which are good commit messages?", options: ["Add password strength checker", "update", "Fix total when expenses list is empty", "final final v2"], answer: [0, 2],
      why: "Good messages say exactly what the commit does, as a command. \"update\" and \"final final v2\" tell a reader nothing." }
  ],
  code: {
    brief: "Build a tiny version of Git to see how it really works. Write a class <code>MiniGit</code>:<br>• <code>add(filename, content)</code> stages a file's new content.<br>• <code>commit(message)</code> makes a new snapshot: all files from the previous commit, updated with everything staged. It clears the staging area and returns the new commit's id: <code>\"c1\"</code>, <code>\"c2\"</code> and so on. Raise <code>ValueError</code> if the message is empty (after stripping) or if nothing is staged.<br>• <code>log()</code> returns a list like <code>[\"c2: Fix bug\", \"c1: First version\"]</code>, newest first.<br>• <code>checkout(commit_id)</code> returns a dictionary of every file and its content at that commit. Raise <code>KeyError</code> for an unknown id.<br>Old snapshots must never change when you make new commits.",
    sample: ">>> g = MiniGit()\n>>> g.add(\"app.py\", \"print(1)\")\n>>> g.commit(\"First version\")\n'c1'\n>>> g.add(\"app.py\", \"print(2)\")\n>>> g.commit(\"Fix bug\")\n'c2'\n>>> g.checkout(\"c1\")\n{'app.py': 'print(1)'}",
    starter: `class MiniGit:
    def __init__(self):
        self.staged = {}
        self.commits = []   # each one could be (id, message, snapshot)
`,
    tests: [
      { setup: "g = MiniGit()\ng.add('app.py', 'print(1)')\nfirst = g.commit('First version')\ng.add('app.py', 'print(2)')\ng.add('README.md', '# App')\nsecond = g.commit('Fix bug')", call: "(first, second, g.log())", expect: "('c1', 'c2', ['c2: Fix bug', 'c1: First version'])", label: "Two commits and the log" },
      { setup: "g = MiniGit()\ng.add('app.py', 'print(1)')\ng.commit('First version')\ng.add('app.py', 'print(2)')\ng.add('README.md', '# App')\ng.commit('Fix bug')", call: "(g.checkout('c1'), g.checkout('c2'))", expect: "({'app.py': 'print(1)'}, {'app.py': 'print(2)', 'README.md': '# App'})", label: "Old snapshots don't change" },
      { setup: "g = MiniGit()\ng.add('a.txt', 'A')\ng.commit('Add a')\ng.add('b.txt', 'B')\ng.commit('Add b')", call: "g.checkout('c2')", expect: "{'a.txt': 'A', 'b.txt': 'B'}", label: "A commit keeps files from earlier commits" },
      { setup: "g = MiniGit()", call: "g.commit('Nothing here')", raises: "ValueError", label: "Can't commit with nothing staged" },
      { setup: "g = MiniGit()\ng.add('a.txt', 'A')", call: "g.commit('   ')", raises: "ValueError", label: "Can't commit with an empty message" },
      { setup: "g = MiniGit()\ng.add('a.txt', 'A')\ng.commit('Add a')", call: "g.commit('Again')", raises: "ValueError", label: "Staging is cleared after a commit" },
      { setup: "g = MiniGit()", call: "g.checkout('c9')", raises: "KeyError", label: "Unknown commit ids raise KeyError" }
    ],
    hints: [
      "In <code>commit</code>: check the message and the staging area first. Then start the snapshot as a <b>copy</b> of the last commit's snapshot (or <code>{}</code> if there isn't one).",
      "Copy with <code>dict(old_snapshot)</code>, then <code>.update(self.staged)</code>. Store <code>(commit_id, message, snapshot)</code>, then <code>self.staged = {}</code>.",
      "<code>log</code>: loop over <code>reversed(self.commits)</code>. <code>checkout</code>: return a copy of the matching snapshot, or <code>raise KeyError(commit_id)</code>."
    ],
    solution: `class MiniGit:
    def __init__(self):
        self.staged = {}
        self.commits = []

    def add(self, filename, content):
        self.staged[filename] = content

    def commit(self, message):
        if not message.strip():
            raise ValueError("Commit message can't be empty")
        if not self.staged:
            raise ValueError("Nothing to commit")
        snapshot = dict(self.commits[-1][2]) if self.commits else {}
        snapshot.update(self.staged)
        commit_id = f"c{len(self.commits) + 1}"
        self.commits.append((commit_id, message.strip(), snapshot))
        self.staged = {}
        return commit_id

    def log(self):
        return [f"{cid}: {msg}" for cid, msg, _ in reversed(self.commits)]

    def checkout(self, commit_id):
        for cid, _, snapshot in self.commits:
            if cid == commit_id:
                return dict(snapshot)
        raise KeyError(commit_id)`
  },
  bug: {
    brief: "After the second commit, checking out <code>c1</code> shows the <i>new</i> content: history got rewritten! Every commit is sharing one dictionary. Find where a copy is missing.",
    code: `class MiniGit:
    def __init__(self):
        self.files = {}
        self.commits = []

    def commit(self, filename, content, message):
        self.files[filename] = content
        self.commits.append((message, self.files))

    def checkout(self, n):
        return self.commits[n][1]

g = MiniGit()
g.commit("app.py", "v1", "First")
g.commit("app.py", "v2", "Second")
print(g.checkout(0))`,
    tests: [{ setup: "g = MiniGit()\ng.commit('app.py', 'v1', 'First')\ng.commit('app.py', 'v2', 'Second')", call: "(g.checkout(0), g.checkout(1))", expect: "({'app.py': 'v1'}, {'app.py': 'v2'})" }],
    hints: ["<code>self.files</code> is one dictionary, and every commit stores a reference to that same one (remember aliasing from The Backpack). Store <code>dict(self.files)</code> instead."],
    fix: `class MiniGit:
    def __init__(self):
        self.files = {}
        self.commits = []

    def commit(self, filename, content, message):
        self.files[filename] = content
        self.commits.append((message, dict(self.files)))

    def checkout(self, n):
        return self.commits[n][1]

g = MiniGit()
g.commit("app.py", "v1", "First")
g.commit("app.py", "v2", "Second")
print(g.checkout(0))`,
    lesson: "Storing a dictionary stores a reference. If it must not change later, store a copy."
  },
  explain: "Explain the difference between <code>git add</code>, <code>git commit</code> and <code>git push</code> to someone who has never used Git.",
  cards: [
    { q: "Where does a commit live until you push?", options: ["On GitHub", "Only on your computer", "In the cloud", "Nowhere"], answer: 1 },
    { q: "What does <code>git add</code> do?", options: ["Uploads files", "Stages changes for the next commit", "Creates a branch", "Deletes files"], answer: 1 },
    { q: "Best commit message?", options: ["update", "Fix crash when the file is missing", "asdf", "changes v2"], answer: 1 }
  ],
  skills: { git: 5, python: 2, logic: 2, talk: 2 }
},
/* ───────────────────────────── 7-2 ───────────────────────────── */
{
  id: "7-2", world: 7, n: 2, title: "Branching Paths", concept: "branches, merges and conflicts",
  learn: [
    { h: "Branches let you work without breaking main",
      p: "A <b>branch</b> is a separate line of commits. Teams keep <code>main</code> working, and build each feature on its own branch. When it's ready, the branch is <b>merged</b> back. On GitHub you ask for that merge with a <b>pull request</b> (PR), where teammates review your changes first.",
      lang: "text", file: "a feature branch",
      code: `$ git switch -c add-streaks       # create a branch and move to it
  ... edit, add, commit ...
$ git push -u origin add-streaks   # share the branch
  ... open a pull request on GitHub, get a review ...
$ git switch main
$ git pull                         # main now includes your merged work` },
    { h: "How a merge decides",
      p: "Git compares three versions of each file: the <b>base</b> (where the branches split), <b>ours</b> and <b>theirs</b>. If only one side changed something, Git takes that change. If both sides changed the <i>same</i> part differently, Git can't decide: that's a <b>merge conflict</b>, and a human must choose.",
      code: `base   = {"theme": "light", "volume": 5}
ours   = {"theme": "dark",  "volume": 5}   # we changed theme
theirs = {"theme": "light", "volume": 8}   # they changed volume
for key in base:
    b, o, t = base[key], ours[key], theirs[key]
    if o == t:
        print(key, "same on both:", o)
    elif o == b:
        print(key, "only they changed it:", t)
    elif t == b:
        print(key, "only we changed it:", o)
    else:
        print(key, "CONFLICT")` },
    { h: "Resolving a conflict",
      p: "In a conflict, Git marks the file with both versions between <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code> and <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code>. You edit it to the right result, delete the markers, then add and commit. Small, frequent merges mean small, easy conflicts.",
      lang: "text", file: "settings.py with a conflict",
      code: `<<<<<<< ours
GST_RATE = 0.18
=======
GST_RATE = 0.12
>>>>>>> theirs

# Decide (check with the team!), keep one line, delete the markers:
GST_RATE = 0.18` }
  ],
  think: [
    { type: "mcq", q: "Base has <code>price = 10</code>. Your branch changes it to 12. The other branch doesn't touch it. After the merge, what is it?", options: ["10", "12", "A conflict", "Both"], answer: 1,
      why: "Only one side changed it, so Git takes that change automatically." },
    { type: "mcq", q: "Base has <code>price = 10</code>. You change it to 12 and a teammate changes it to 15. What happens?", options: ["Git picks 12", "Git picks 15", "A merge conflict you must resolve", "Git averages them"], answer: 2,
      why: "Both sides changed the same thing differently, so Git asks a human to decide." },
    { type: "order", q: "Put the pull-request workflow in order.", lines: ["Create a branch for the feature", "Commit your changes on the branch", "Push the branch to GitHub", "Open a pull request and ask for a review", "Merge it into main after approval"],
      why: "Branch, commit, push, review, merge. Main stays working the whole time." }
  ],
  code: {
    brief: "Write <code>merge(base, ours, theirs)</code> for settings dictionaries, the way Git does a three-way merge. A key missing from a dictionary counts as the value <code>None</code>. For every key that appears in any of the three:<br>• if ours and theirs agree, use that value<br>• else if ours didn't change it (ours equals base), use theirs<br>• else if theirs didn't change it, use ours<br>• otherwise it's a conflict<br>Return a tuple <code>(merged, conflicts)</code>: <code>merged</code> has every non-conflicting key whose value isn't None (None means deleted), and <code>conflicts</code> is a sorted list of the conflicting keys.",
    sample: ">>> merge({\"theme\": \"light\", \"vol\": 5}, {\"theme\": \"dark\", \"vol\": 5}, {\"theme\": \"light\", \"vol\": 8})\n({'theme': 'dark', 'vol': 8}, [])",
    starter: `def merge(base, ours, theirs):
    pass
`,
    tests: [
      { call: "merge({'theme': 'light', 'vol': 5}, {'theme': 'dark', 'vol': 5}, {'theme': 'light', 'vol': 8})", expect: "({'theme': 'dark', 'vol': 8}, [])", silent: true, label: "Each side changed a different key" },
      { call: "merge({'gst': 0.18}, {'gst': 0.12}, {'gst': 0.05})", expect: "({}, ['gst'])", label: "Both changed the same key: conflict" },
      { call: "merge({'a': 1}, {'a': 2}, {'a': 2})", expect: "({'a': 2}, [])", label: "Both made the same change" },
      { call: "merge({}, {'new': 1}, {})", expect: "({'new': 1}, [])", label: "We added a key" },
      { call: "merge({'old': 1, 'x': 1}, {'x': 1}, {'old': 1, 'x': 1})", expect: "({'x': 1}, [])", label: "We deleted a key" },
      { call: "merge({'k': 1}, {}, {'k': 2})", expect: "({}, ['k'])", label: "We deleted it, they changed it: conflict" },
      { call: "merge({'b': 1, 'a': 1}, {'b': 2, 'a': 3}, {'b': 5, 'a': 4})", expect: "({}, ['a', 'b'])", label: "Conflicts are sorted" }
    ],
    fuzz: { n: 12, what: "random settings", gen: (r) => { const d = () => { const o = {}; for (const k of ["a", "b", "c", "d"]) if (r.next() < 0.7) o[k] = r.int(1, 3); return JSON.stringify(o); }; return { call: `[sorted(m.items()), c] if True else 0`.replace("m.items()", "merge(" + d() + ", " + d() + ", " + d() + ")[0].items()").replace("c]", "merge(" + d() + ", " + d() + ", " + d() + ")[1]]") }; } },
    hints: [
      "First collect every key: <code>keys = set(base) | set(ours) | set(theirs)</code>. Use <code>.get(key)</code>, which gives None for missing keys.",
      "Apply the four rules in order with if / elif / elif / else. Collect conflicts in a list.",
      "Only put a value in <code>merged</code> if it isn't None. Return <code>merged, sorted(conflicts)</code>."
    ],
    solution: `def merge(base, ours, theirs):
    merged = {}
    conflicts = []
    for key in sorted(set(base) | set(ours) | set(theirs)):
        b, o, t = base.get(key), ours.get(key), theirs.get(key)
        if o == t:
            value = o
        elif o == b:
            value = t
        elif t == b:
            value = o
        else:
            conflicts.append(key)
            continue
        if value is not None:
            merged[key] = value
    return merged, sorted(conflicts)`
  },
  bug: {
    brief: "<b>AI code review.</b> This merge never reports conflicts: it silently keeps our value whenever both sides changed something. Your teammate's change just vanishes. Make it report the conflict instead.",
    code: `# AI-written
def merge_value(base, ours, theirs):
    if ours == theirs:
        return ours
    if ours == base:
        return theirs
    return ours

print(merge_value(10, 12, 15))`,
    tests: [{ call: "merge_value(10, 12, 15)", expect: "'CONFLICT'" }, { call: "merge_value(10, 12, 10)", expect: "12" }, { call: "merge_value(10, 10, 15)", expect: "15" }, { call: "merge_value(1, 2, 2)", expect: "2" }],
    hints: ["There's one case missing: theirs unchanged (equal to base). Only in that case should ours win. Everything else is a conflict: return <code>\"CONFLICT\"</code>."],
    fix: `def merge_value(base, ours, theirs):
    if ours == theirs:
        return ours
    if ours == base:
        return theirs
    if theirs == base:
        return ours
    return "CONFLICT"

print(merge_value(10, 12, 15))`,
    lesson: "Silently picking one side loses work. A loud conflict is better than a quiet mistake."
  },
  explain: "Explain what a merge conflict is, why it happens, and how you'd resolve one on a team.",
  cards: [
    { q: "A pull request is…", options: ["Downloading code", "Asking for your branch to be reviewed and merged", "Deleting a branch", "A kind of commit"], answer: 1 },
    { q: "A merge conflict happens when…", options: ["Both branches changed the same part differently", "A file is new", "You push twice", "Main is empty"], answer: 0 },
    { q: "Why work on a branch?", options: ["It's faster", "Main stays working while you build", "Git requires it", "To hide code"], answer: 1 }
  ],
  skills: { git: 5, logic: 3, talk: 2 }
},
/* ───────────────────────────── 7-3 ───────────────────────────── */
{
  id: "7-3", world: 7, n: 3, title: "Proof Before Ship", concept: "test-first development, side effects",
  learn: [
    { h: "Write the test first",
      p: "In <b>test-driven development</b> (TDD), you write a failing test that describes what you want, then write just enough code to pass it, then tidy up. Thinking about examples first catches misunderstandings before you write any code.",
      lang: "text", file: "the TDD loop",
      code: `1. RED:      write a test for the next small behaviour. Run it: it fails.
2. GREEN:    write the simplest code that makes it pass.
3. REFACTOR: clean up, with the tests keeping you safe.
Repeat.` },
    { h: "Tests are examples you can run",
      p: "A list of examples is a precise description of a function. Before coding, read the tests and ask: what's the rule? What are the edge cases they cover? Which cases do they leave out?",
      code: `def test_initials():
    assert initials("Asha Rao") == "AR"
    assert initials("ravi") == "R"
    assert initials("  meera   k  nair ") == "MKN"

def initials(name):
    return "".join(word[0].upper() for word in name.split())

test_initials()
print("All examples pass")` },
    { h: "Side effects make tests lie",
      p: "A function has a <b>side effect</b> if it changes something outside itself, like the list you passed in. Side effects make bugs that depend on the order things run in. Prefer functions that return new values and leave their inputs alone.",
      code: `def top_two_bad(scores):
    scores.sort(reverse=True)     # changes the caller's list!
    return scores[:2]

def top_two(scores):
    return sorted(scores, reverse=True)[:2]   # leaves it alone

marks = [40, 90, 70]
print(top_two(marks), marks)
print(top_two_bad(marks), marks)` }
  ],
  think: [
    { type: "order", q: "Put one TDD cycle in order.", lines: ["Write a test for the next behaviour", "Run it and watch it fail", "Write the simplest code to pass it", "Run all tests: they pass", "Clean up the code, re-running the tests"],
      why: "Seeing the test fail first proves the test can actually catch the missing behaviour." },
    { type: "predict", q: "What does this print?", code: `def add_bonus(scores):
    for i in range(len(scores)):
        scores[i] += 5
    return scores

marks = [50, 60]
new = add_bonus(marks)
print(marks, new)`, answer: "[55, 65] [55, 65]",
      why: "The function changed the caller's list in place. <code>marks</code> and <code>new</code> are the same list. That side effect surprises whoever calls it." },
    { type: "refute", q: "This <code>slugify</code> should turn a title into a URL slug: lowercase words joined by single dashes. Find a title it gets wrong.", fn: "slugify", args: 1, example: "\"Hello World\"",
      code: `def slugify(title):
    return title.lower().replace(" ", "-")`,
      ref: `def slugify(title):
    return "-".join(title.lower().split())`,
      answer: "\"Hello  World\"", safe: ["\"Hello World\"", "\"chai\""],
      why: "Two spaces become two dashes, and spaces at the ends become dashes too. <code>split()</code> without arguments handles any amount of whitespace." }
  ],
  code: {
    brief: "Test-first: the team wrote these tests before the code. Write <code>slugify(title)</code> so that all of them pass.<pre class=\"sample\">def test_slugify():\n    assert slugify(\"Hello World\") == \"hello-world\"\n    assert slugify(\"  Learn   Python  Fast \") == \"learn-python-fast\"\n    assert slugify(\"Chai & Code!\") == \"chai-code\"\n    assert slugify(\"Top 10 Tips\") == \"top-10-tips\"\n    assert slugify(\"C++ vs Python?\") == \"c-vs-python\"\n    assert slugify(\"!!!\") == \"\"</pre>Work out the rule from the examples: letters and digits are kept (lowercased), and every run of anything else becomes a single dash, with no dashes at the ends. The checker also runs hidden examples.",
    sample: ">>> slugify(\"Chai & Code!\")\n'chai-code'",
    starter: `def slugify(title):
    pass


def test_slugify():
    assert slugify("Hello World") == "hello-world"
    assert slugify("  Learn   Python  Fast ") == "learn-python-fast"
    assert slugify("Chai & Code!") == "chai-code"
    assert slugify("Top 10 Tips") == "top-10-tips"
    assert slugify("C++ vs Python?") == "c-vs-python"
    assert slugify("!!!") == ""


test_slugify()
print("All tests pass!")
`,
    tests: [
      { call: "slugify('Hello World')", expect: "'hello-world'", silent: true },
      { call: "slugify('  Learn   Python  Fast ')", expect: "'learn-python-fast'" },
      { call: "slugify('Chai & Code!')", expect: "'chai-code'" },
      { call: "slugify('Top 10 Tips')", expect: "'top-10-tips'" },
      { call: "slugify('C++ vs Python?')", expect: "'c-vs-python'" },
      { call: "slugify('!!!')", expect: "''" }
    ],
    fuzz: { n: 15, what: "random titles", gen: (r) => ({ call: "slugify(" + JSON.stringify(Array.from({ length: r.int(1, 5) }, () => r.pick(["Chai", "code", "AI", "2026", "&", "!", " ", "  ", "-", "Top", "?", "x1"])).join(r.pick([" ", "  ", "-", ""]))) + ")" }) },
    hints: [
      "Go character by character. Keep <code>ch.lower()</code> if <code>ch.isalnum()</code>. Otherwise it's a separator.",
      "Build a list of words: when you meet a separator, finish the current word (if it isn't empty) and start a new one.",
      "At the end, add the last word, then <code>\"-\".join(words)</code>. Empty words never get added, so there are no double or edge dashes."
    ],
    solution: `def slugify(title):
    words = []
    current = ""
    for ch in title:
        if ch.isalnum():
            current += ch.lower()
        else:
            if current:
                words.append(current)
            current = ""
    if current:
        words.append(current)
    return "-".join(words)`
  },
  bug: {
    brief: "Two tests pass on their own, but fail when run one after the other: the first call quietly changes the list the second test uses. Make <code>top_three</code> leave its input alone.",
    code: `def top_three(scores):
    scores.sort(reverse=True)
    return scores[:3]

marks = [55, 90, 72, 40, 88]
print(top_three(marks))
print(marks)`,
    tests: [{ setup: "m = [55, 90, 72, 40, 88]\nr = top_three(m)", call: "(r, m)", expect: "([90, 88, 72], [55, 90, 72, 40, 88])", label: "The input list is unchanged" }, { call: "top_three([3, 1])", expect: "[3, 1]" }],
    hints: ["<code>.sort()</code> changes the list in place. Which function returns a new sorted list instead?"],
    fix: `def top_three(scores):
    return sorted(scores, reverse=True)[:3]

marks = [55, 90, 72, 40, 88]
print(top_three(marks))
print(marks)`,
    lesson: "Functions that change their inputs cause bugs far away from where they're called. Return new values instead."
  },
  explain: "What is test-driven development? Describe one benefit and one situation where you might not use it.",
  cards: [
    { q: "In TDD, what comes first?", options: ["The code", "A failing test", "The README", "Deployment"], answer: 1 },
    { q: "A function that changes the list you passed in has a…", options: ["return value", "side effect", "docstring", "syntax error"], answer: 1 },
    { q: "Which leaves the original list unchanged?", options: ["lst.sort()", "sorted(lst)", "lst.reverse()", "lst.append(1)"], answer: 1 }
  ],
  skills: { test: 5, python: 2, logic: 2, debug: 1, talk: 2 }
},
/* ───────────────────────────── 7-4 ───────────────────────────── */
{
  id: "7-4", world: 7, n: 4, title: "The Captain's Log", concept: "README files and Markdown",
  learn: [
    { h: "Your README is your project's front page",
      p: "When a recruiter opens your GitHub project, the <b>README</b> is the first (and often only) thing they read. It should say in seconds: what this is, why it exists, how to run it, and what it looks like. A project without a README looks unfinished.",
      lang: "text", file: "README.md",
      code: `# Habit Tracker

Track daily habits from the terminal and see your streaks.
Built with Python and SQLite.

## Install
1. Clone this repo
2. Run \`python habits.py\`

## Usage
> add read
Added: read

## What I learned
Transactions in SQLite, and testing date logic.` },
    { h: "Markdown in five minutes",
      p: "READMEs are written in <b>Markdown</b>: plain text with a few symbols. <code>#</code> makes a heading (<code>##</code> a smaller one), <code>-</code> or <code>1.</code> make lists, backticks make <code>code</code>, three backticks make a code block, and <code>[text](url)</code> makes a link. Blank lines separate blocks.",
      lang: "text", file: "Markdown cheat sheet",
      code: `# Big heading
## Smaller heading
Plain paragraph text. **Bold** and *italic*.

- a bullet
- another bullet

1. first step
2. second step

Inline \`code\`, and a [link](https://github.com).

\`\`\`
python app.py
\`\`\`` },
    { h: "Generate text from data",
      p: "Programs often produce documents: reports, emails, READMEs. Build the text from small pieces in a list, then <code>\"\\n\".join(lines)</code>. It's easier to get blank lines and order right than with one giant string.",
      code: `steps = ["Clone the repo", "pip install flask", "python app.py"]
lines = ["## Install", ""]
for i, step in enumerate(steps, start=1):
    lines.append(f"{i}. {step}")
print("\\n".join(lines))` }
  ],
  think: [
    { type: "multi", q: "Which belong in a good README?", options: ["What the project does, in one or two sentences", "How to install and run it", "An example or screenshot", "Your full chat history with an AI", "What you learned building it"], answer: [0, 1, 2, 4],
      why: "Purpose, setup, a demo and your learning tell a reader everything quickly. Chat logs don't belong there." },
    { type: "match", q: "Match each piece of Markdown with what it makes.", pairs: [["<code># Title</code>", "a big heading"], ["<code>- item</code>", "a bullet point"], ["<code>1. step</code>", "a numbered step"], ["<code>[docs](https://...)</code>", "a link"], ["<code>`x = 1`</code>", "inline code"]],
      why: "These five cover almost every README you'll write." },
    { type: "predict", q: "What does this print?", code: `lines = ["# App", "", "Run it:"]
lines += ["1. Install", "2. Start"]
print(len(lines))
print("\\n".join(lines[-2:]))`, answer: "5\n1. Install\n2. Start",
      why: "<code>+=</code> adds both steps to the list. The last two lines are then joined with newlines." }
  ],
  code: {
    brief: "Write <code>make_readme(project)</code>, which builds a README as one string from a dictionary like:<br><code>{\"name\": \"Habit Tracker\", \"summary\": \"Track habits.\", \"steps\": [\"Clone it\", \"Run python habits.py\"], \"tech\": [\"Python\", \"SQLite\"]}</code><br>The README has these lines, joined with <code>\\n</code>:<br>• <code># Habit Tracker</code>, a blank line, the summary, a blank line<br>• <code>## Install</code>, a blank line, then the steps numbered <code>1. Clone it</code> and so on, then a blank line<br>• <code>## Built with</code>, a blank line, then one <code>- Python</code> line per technology<br>If <code>tech</code> is missing or empty, leave out the whole Built with section (and the blank line before it). The README ends without a blank line.",
    sample: "# Habit Tracker\n\nTrack habits.\n\n## Install\n\n1. Clone it\n2. Run python habits.py\n\n## Built with\n\n- Python\n- SQLite",
    starter: `def make_readme(project):
    lines = []
    # Build the README one line at a time
    return "\\n".join(lines)
`,
    tests: [
      { call: "make_readme({'name': 'Habit Tracker', 'summary': 'Track habits.', 'steps': ['Clone it', 'Run python habits.py'], 'tech': ['Python', 'SQLite']})", expect: "'# Habit Tracker\\n\\nTrack habits.\\n\\n## Install\\n\\n1. Clone it\\n2. Run python habits.py\\n\\n## Built with\\n\\n- Python\\n- SQLite'", silent: true, label: "The full README" },
      { call: "make_readme({'name': 'Quiz', 'summary': 'A quiz.', 'steps': ['python quiz.py']})", expect: "'# Quiz\\n\\nA quiz.\\n\\n## Install\\n\\n1. python quiz.py'", label: "No tech list: no Built with section" },
      { call: "make_readme({'name': 'X', 'summary': 'Y', 'steps': ['a', 'b', 'c'], 'tech': []})", expect: "'# X\\n\\nY\\n\\n## Install\\n\\n1. a\\n2. b\\n3. c'", label: "An empty tech list" }
    ],
    hints: [
      "Append in order: <code>f\"# {project['name']}\"</code>, <code>\"\"</code>, the summary, <code>\"\"</code>, <code>\"## Install\"</code>, <code>\"\"</code>.",
      "Numbered steps: <code>for i, step in enumerate(project[\"steps\"], start=1): lines.append(f\"{i}. {step}\")</code>.",
      "<code>tech = project.get(\"tech\", [])</code>. Only if it's not empty: add <code>\"\"</code>, <code>\"## Built with\"</code>, <code>\"\"</code>, then the bullets."
    ],
    solution: `def make_readme(project):
    lines = [f"# {project['name']}", "", project["summary"], "", "## Install", ""]
    for i, step in enumerate(project["steps"], start=1):
        lines.append(f"{i}. {step}")
    tech = project.get("tech", [])
    if tech:
        lines += ["", "## Built with", ""]
        for t in tech:
            lines.append(f"- {t}")
    return "\\n".join(lines)`
  },
  bug: {
    brief: "This README generator glues everything onto one line, and GitHub shows a jumbled mess. Fix how the lines are joined.",
    code: `def make_readme(name, steps):
    lines = [f"# {name}", "", "## Install", ""]
    for i, step in enumerate(steps, start=1):
        lines.append(f"{i}. {step}")
    return "".join(lines)

print(make_readme("Quiz", ["Clone", "Run"]))`,
    tests: [{ call: "make_readme('Quiz', ['Clone', 'Run'])", expect: "'# Quiz\\n\\n## Install\\n\\n1. Clone\\n2. Run'" }],
    hints: ["Joining with an empty string puts nothing between the lines. What character starts a new line?"],
    fix: `def make_readme(name, steps):
    lines = [f"# {name}", "", "## Install", ""]
    for i, step in enumerate(steps, start=1):
        lines.append(f"{i}. {step}")
    return "\\n".join(lines)

print(make_readme("Quiz", ["Clone", "Run"]))`,
    lesson: "<code>\"\\n\".join(lines)</code> is the clean way to build multi-line text."
  },
  explain: "Draft, in a few sentences, the opening of the README for your flagship project: what it is, who it's for, and why you built it.",
  cards: [
    { q: "In Markdown, <code>## Install</code> makes…", options: ["A comment", "A heading", "A list", "Bold text"], answer: 1 },
    { q: "What should a README's first lines say?", options: ["The license", "What the project is and why it exists", "Your phone number", "The Python version only"], answer: 1 },
    { q: "<code>\"\\n\".join([\"a\", \"b\"])</code> gives…", options: ["\"ab\"", "\"a\\nb\"", "[\"a\", \"b\"]", "\"a b\""], answer: 1 }
  ],
  skills: { talk: 4, git: 2, python: 2 }
},
/* ───────────────────────────── 7-5 ───────────────────────────── */
{
  id: "7-5", world: 7, n: 5, title: "Lanterns and Locks", concept: "config, environment variables, .gitignore",
  learn: [
    { h: "Settings belong outside the code",
      p: "The same code runs on your laptop, a test server and the live site, with different settings: debug on or off, different databases, different secret keys. So settings come from <b>environment variables</b>, read when the program starts. This is one of the rules in the famous \"Twelve-Factor App\" guide.",
      code: `import os

port = int(os.environ.get("PORT", "5000"))
debug = os.environ.get("DEBUG", "false").lower() in ("1", "true", "yes")
print("Starting on port", port, "debug:", debug)` },
    { h: "Environment variables are always text",
      p: "<code>os.environ</code> only ever holds strings. <code>bool(\"false\")</code> is <b>True</b>, because any non-empty string is True! Convert carefully: compare the text with the values you accept, and turn numbers into ints with validation.",
      code: `for text in ["false", "0", "", "true"]:
    print(repr(text), "bool():", bool(text), "| careful check:", text.lower() in ("1", "true", "yes"))` },
    { h: ".gitignore keeps secrets and junk out of Git",
      p: "A <code>.gitignore</code> file lists things Git must never commit: secret files like <code>.env</code>, databases with real data, and generated folders like <code>__pycache__</code>. Add it <b>before</b> your first commit. Once a secret has been pushed, deleting it isn't enough: it's in the history, so cancel the key and make a new one.",
      lang: "text", file: ".gitignore",
      code: `# secrets and local settings
.env

# data
*.db

# Python's generated files
__pycache__/
*.pyc

# editors
.vscode/` },
    { h: "Never print secrets",
      p: "Logs and error messages get copied into chats, tickets and screenshots. When showing config, <b>mask</b> secrets: show just enough to recognise them. Professional logs use levels (DEBUG, INFO, WARNING, ERROR) so you can turn chatty messages off in production.",
      code: `secret = "sk-live-9f8e7d6c5b4a"
masked = secret[:3] + "*" * (len(secret) - 3)
print("SECRET_KEY =", masked)` }
  ],
  think: [
    { type: "mcq", q: "<code>DEBUG=false</code> is set. What is <code>bool(os.environ.get(\"DEBUG\"))</code>?", options: ["False", "True", "None", "An error"], answer: 1,
      why: "\"false\" is a non-empty string, and every non-empty string is truthy. This exact bug has left debug mode switched on in real production sites." },
    { type: "multi", q: "Which belong in <code>.gitignore</code>?", options: [".env", "app.py", "__pycache__/", "habits.db with real user data", "README.md"], answer: [0, 2, 3],
      why: "Secrets, generated files and real data stay out. Your code and README are exactly what you want on GitHub." },
    { type: "mcq", q: "You pushed an API key to a public repo, then deleted it in the next commit. Is it safe now?", options: ["Yes, it's deleted", "No: it's still in the history, so cancel the key and make a new one", "Only if the repo is small", "Yes, if nobody starred the repo"], answer: 1,
      why: "Bots scan GitHub for keys within minutes. The old commit still contains it. Rotating (replacing) the key is the only real fix." }
  ],
  code: {
    brief: "Write <code>load_config(env)</code>, which reads settings from a dictionary of environment variables (all values are text), and <code>masked(config)</code>.<br><code>load_config</code> returns a dictionary:<br>• <code>\"DEBUG\"</code>: True only if the value is <code>1</code>, <code>true</code> or <code>yes</code> (any capitals); default False.<br>• <code>\"PORT\"</code>: an int, default 5000. If it isn't a whole number from 1 to 65535, raise <code>ValueError</code>.<br>• <code>\"DATABASE_URL\"</code>: default <code>\"sqlite:///app.db\"</code>.<br>• <code>\"SECRET_KEY\"</code>: required. If it's missing or empty, raise <code>RuntimeError</code>.<br><code>masked(config)</code> returns a <b>copy</b> of the config where SECRET_KEY keeps its first 3 characters and every other character becomes <code>*</code>. The original must not change.",
    sample: ">>> c = load_config({\"SECRET_KEY\": \"abcdef\", \"DEBUG\": \"True\"})\n>>> c\n{'DEBUG': True, 'PORT': 5000, 'DATABASE_URL': 'sqlite:///app.db', 'SECRET_KEY': 'abcdef'}\n>>> masked(c)[\"SECRET_KEY\"]\n'abc***'",
    starter: `def load_config(env):
    pass


def masked(config):
    pass
`,
    tests: [
      { call: "load_config({'SECRET_KEY': 'abcdef', 'DEBUG': 'True'})", expect: "{'DEBUG': True, 'PORT': 5000, 'DATABASE_URL': 'sqlite:///app.db', 'SECRET_KEY': 'abcdef'}", silent: true, label: "Defaults and DEBUG=True" },
      { call: "[load_config({'SECRET_KEY': 'k', 'DEBUG': v})['DEBUG'] for v in ['1', 'yes', 'YES', 'false', '0', 'no', '']]", expect: "[True, True, True, False, False, False, False]", label: "DEBUG is only on for 1, true or yes" },
      { call: "load_config({'SECRET_KEY': 'k', 'PORT': '8080', 'DATABASE_URL': 'postgres://db'})", expect: "{'DEBUG': False, 'PORT': 8080, 'DATABASE_URL': 'postgres://db', 'SECRET_KEY': 'k'}" },
      { call: "load_config({'DEBUG': '1'})", raises: "RuntimeError", label: "Missing SECRET_KEY" },
      { call: "load_config({'SECRET_KEY': ''})", raises: "RuntimeError", label: "Empty SECRET_KEY" },
      { call: "[_cq_err(load_config, {'SECRET_KEY': 'k', 'PORT': p}) for p in ['abc', '0', '70000', '-1', '80']]", setup: "def _cq_err(f, *a):\n    try:\n        f(*a)\n        return 'ok'\n    except ValueError:\n        return 'ValueError'", expect: "['ValueError', 'ValueError', 'ValueError', 'ValueError', 'ok']", label: "Bad ports raise ValueError" },
      { setup: "c = load_config({'SECRET_KEY': 'sk-live-123'})\nm = masked(c)", call: "(m['SECRET_KEY'], c['SECRET_KEY'], m['PORT'])", expect: "('sk-********', 'sk-live-123', 5000)", label: "<code>masked</code> hides the secret without changing the original" }
    ],
    hints: [
      "Start with <code>config = {}</code>. DEBUG: <code>env.get(\"DEBUG\", \"\").lower() in (\"1\", \"true\", \"yes\")</code>.",
      "PORT: get the text (default <code>\"5000\"</code>), check <code>.isdigit()</code>, convert, then check the range. Raise ValueError otherwise.",
      "<code>masked</code>: <code>copy = dict(config)</code>, then <code>s = copy[\"SECRET_KEY\"]</code> and <code>copy[\"SECRET_KEY\"] = s[:3] + \"*\" * (len(s) - 3)</code>."
    ],
    solution: `def load_config(env):
    config = {}
    config["DEBUG"] = env.get("DEBUG", "").lower() in ("1", "true", "yes")
    port_text = env.get("PORT", "5000")
    if not port_text.isdigit() or not 1 <= int(port_text) <= 65535:
        raise ValueError(f"PORT must be 1 to 65535, got {port_text!r}")
    config["PORT"] = int(port_text)
    config["DATABASE_URL"] = env.get("DATABASE_URL", "sqlite:///app.db")
    secret = env.get("SECRET_KEY", "")
    if not secret:
        raise RuntimeError("SECRET_KEY is not set")
    config["SECRET_KEY"] = secret
    return config


def masked(config):
    copy = dict(config)
    s = copy["SECRET_KEY"]
    copy["SECRET_KEY"] = s[:3] + "*" * (len(s) - 3)
    return copy`
  },
  bug: {
    brief: "The live site is running with debug mode <b>on</b>, which lets visitors see its internals, even though the server sets <code>DEBUG=false</code>. Find out why.",
    code: `def debug_enabled(env):
    return bool(env.get("DEBUG"))

print(debug_enabled({"DEBUG": "false"}))`,
    tests: [{ call: "[debug_enabled({'DEBUG': v}) for v in ['false', 'False', '0', 'no', '']]", expect: "[False, False, False, False, False]" }, { call: "[debug_enabled({'DEBUG': v}) for v in ['true', 'TRUE', '1', 'yes']]", expect: "[True, True, True, True]" }, { call: "debug_enabled({})", expect: "False" }],
    hints: ["What is <code>bool(\"false\")</code>? Compare the lowercased text with the values that mean yes."],
    fix: `def debug_enabled(env):
    return env.get("DEBUG", "").lower() in ("1", "true", "yes")

print(debug_enabled({"DEBUG": "false"}))`,
    lesson: "Environment variables are text. <code>bool(\"false\")</code> is True. Check the words you mean."
  },
  explain: "Why should settings and secrets live in environment variables instead of the code? What goes in <code>.gitignore</code> for your flagship project?",
  cards: [
    { q: "<code>bool(\"false\")</code> is…", options: ["True", "False", "None", "An error"], answer: 0 },
    { q: "A secret was pushed to GitHub. The real fix is…", options: ["Delete the file", "Rotate (replace) the secret", "Rename the repo", "Add a comment"], answer: 1 },
    { q: "Values in <code>os.environ</code> are always…", options: ["Numbers", "Strings", "Booleans", "Any type"], answer: 1 }
  ],
  skills: { python: 3, git: 2, web: 1, debug: 2, talk: 2 }
},
/* ───────────────────────────── 7-6 ───────────────────────────── */
{
  id: "7-6", world: 7, n: 6, title: "Secret Hunter", concept: "scanning code for leaked secrets",
  learn: [
    { h: "Leaked keys are found in minutes",
      p: "Automated bots scan public GitHub repos for API keys around the clock. A leaked cloud key can run up a huge bill overnight. That's why companies run <b>secret scanners</b> before every push. You'll build a simple one, and you can run it on your own projects before pushing.",
      lang: "text", file: "what secrets look like",
      code: `AWS access key:     AKIA followed by 16 capital letters or digits
GitHub token:       ghp_ followed by 36 letters or digits
OpenAI-style key:   sk- followed by a long run of letters and digits
Private key file:   -----BEGIN RSA PRIVATE KEY-----
Hard-coded password: password = "hunter2"` },
    { h: "Scan text with string methods",
      p: "<code>line.find(\"ghp_\")</code> gives the position of a match, or -1. Slice out what comes after and check it character by character. Breaking a pattern into simple checks is a skill you'll use for parsing logs, files and user input.",
      code: `line = 'TOKEN = "ghp_aB3dE5fG7hJ9kL1mN3pQ5rS7tU9vW1xY3zA5"'
i = line.find("ghp_")
if i >= 0:
    rest = line[i + 4:i + 40]
    print(len(rest), rest.isalnum())` },
    { h: "Report line numbers",
      p: "A useful scanner says exactly where to look: the file and the line number. <code>enumerate(text.split(\"\\n\"), start=1)</code> gives each line with its number.",
      code: `files = {"app.py": "import os\\nKEY = os.environ['KEY']\\npassword = \\"chai123\\"\\n"}
for name, text in files.items():
    for number, line in enumerate(text.split("\\n"), start=1):
        if "password" in line.lower() and '"' in line:
            print(f"{name}:{number}: possible password")` }
  ],
  think: [
    { type: "multi", q: "Which lines should a secret scanner flag?", options: ["KEY = \"AKIAIOSFODNN7EXAMPLE\"", "KEY = os.environ[\"KEY\"]", "password = \"chai123\"", "password = input(\"Password? \")", "# never commit keys!"], answer: [0, 2],
      why: "Real key patterns and passwords written as text are leaks. Reading from the environment or the user is the right way, and comments are harmless." },
    { type: "mcq", q: "Your scanner finds a key in a file you're about to push. Best action?", options: ["Push anyway, it's probably a test key", "Remove it, load it from an environment variable, and rotate the key if it was ever pushed", "Rename the variable", "Add a comment saying it's secret"], answer: 1,
      why: "Move it out of the code. If it ever reached a remote, assume it's compromised and replace it." }
  ],
  code: {
    brief: "Build <code>find_secrets(files)</code>. <code>files</code> is a dictionary of filename → text. Return a list of <code>(filename, line_number, kind)</code> tuples, sorted by filename then line number. Line numbers start at 1. Check each line for:<br>• <code>\"aws\"</code>: <code>AKIA</code> followed by at least 16 capital letters or digits<br>• <code>\"github\"</code>: <code>ghp_</code> followed by at least 36 letters or digits<br>• <code>\"private key\"</code>: the text <code>PRIVATE KEY-----</code><br>• <code>\"password\"</code>: the word <code>password</code> (any capitals), then <code>=</code>, then a quoted non-empty string on the same line, like <code>password = \"x\"</code><br>If a line matches several kinds, report each one. Skip files whose name ends with <code>.md</code> (docs often show fake examples).",
    sample: ">>> find_secrets({\"app.py\": 'x = 1\\npassword = \"chai\"'})\n[('app.py', 2, 'password')]",
    starter: `def find_secrets(files):
    found = []
    # Check every line of every file
    return sorted(found)
`,
    tests: [
      { call: "find_secrets({'app.py': 'x = 1\\npassword = \"chai\"'})", expect: "[('app.py', 2, 'password')]", silent: true },
      { call: "find_secrets({'cfg.py': 'AWS = \"AKIAIOSFODNN7EXAMPLE\"\\nAWS2 = \"AKIA123\"'})", expect: "[('cfg.py', 1, 'aws')]", label: "AWS keys need 16 characters after AKIA" },
      { call: "find_secrets({'t.py': 'T = \"ghp_' + 'a1' * 18 + '\"\\nU = \"ghp_short\"'})", expect: "[('t.py', 1, 'github')]", label: "GitHub tokens" },
      { call: "find_secrets({'key.pem': '-----BEGIN RSA PRIVATE KEY-----\\nMIIE...'})", expect: "[('key.pem', 1, 'private key')]" },
      { call: "find_secrets({'a.py': 'PASSWORD=\"x\"\\npassword = input()\\npassword = \"\"\\ndb_password = os.environ[\"P\"]'})", expect: "[('a.py', 1, 'password')]", label: "Only real hard-coded passwords" },
      { call: "find_secrets({'README.md': 'password = \"example\"', 'b.py': 'ok', 'a.py': 'pw = 1\\nPassword = \\'s3cret\\''})", expect: "[('a.py', 2, 'password')]", label: "Skips .md files, sorts results, single quotes count" },
      { call: "find_secrets({})", expect: "[]" }
    ],
    hints: [
      "Loop over <code>sorted(files)</code>, skip names ending in <code>.md</code>, and loop over <code>enumerate(text.split(\"\\n\"), start=1)</code>.",
      "For AWS: <code>i = line.find(\"AKIA\")</code>; if <code>i &gt;= 0</code>, take <code>line[i+4:i+20]</code> and check it has 16 characters that are all digits or capital letters (<code>ch.isdigit() or ch.isupper()</code>). GitHub is the same idea with <code>isalnum()</code> and 36.",
      "Password: lowercase the line. Find <code>\"password\"</code>, then an <code>=</code> after it, then check the rest (stripped) starts with a quote and has at least one character before the closing quote."
    ],
    solution: `def run_after(line, marker, length, ok):
    i = line.find(marker)
    if i < 0:
        return False
    rest = line[i + len(marker):i + len(marker) + length]
    return len(rest) == length and all(ok(ch) for ch in rest)


def hardcoded_password(line):
    low = line.lower()
    i = low.find("password")
    if i < 0:
        return False
    j = low.find("=", i)
    if j < 0:
        return False
    rest = line[j + 1:].strip()
    return len(rest) >= 3 and rest[0] in "\\"'" and rest[1] != rest[0]


def find_secrets(files):
    found = []
    for name in sorted(files):
        if name.endswith(".md"):
            continue
        for number, line in enumerate(files[name].split("\\n"), start=1):
            if run_after(line, "AKIA", 16, lambda ch: ch.isdigit() or ch.isupper()):
                found.append((name, number, "aws"))
            if run_after(line, "ghp_", 36, lambda ch: ch.isalnum()):
                found.append((name, number, "github"))
            if "PRIVATE KEY-----" in line:
                found.append((name, number, "private key"))
            if hardcoded_password(line):
                found.append((name, number, "password"))
    return sorted(found)`
  },
  bug: {
    brief: "This password check misses <code>PASSWORD = \"secret\"</code> in capitals, which is exactly how many config files write it. Make it ignore case.",
    code: `def has_password(line):
    i = line.find("password")
    return i >= 0 and "=" in line[i:] and '"' in line[i:]

print(has_password('PASSWORD = "secret"'))`,
    tests: [{ call: "[has_password(l) for l in ['password = \"a\"', 'PASSWORD = \"secret\"', 'Password=\"x\"', 'x = 1']]", expect: "[True, True, True, False]" }],
    hints: ["Search a lowercased copy of the line: <code>line.lower()</code>."],
    fix: `def has_password(line):
    low = line.lower()
    i = low.find("password")
    return i >= 0 and "=" in low[i:] and '"' in low[i:]

print(has_password('PASSWORD = "secret"'))`,
    lesson: "Attackers and scanners don't care about capitals, so your checks shouldn't either."
  },
  explain: "How would you use your secret scanner in your own workflow before pushing code? What can a simple scanner still miss?",
  cards: [
    { q: "Why scan for secrets before pushing?", options: ["To make code faster", "Bots find leaked keys on GitHub within minutes", "Git requires it", "To shorten files"], answer: 1 },
    { q: "<code>\"abc\".find(\"z\")</code> returns…", options: ["0", "-1", "None", "An error"], answer: 1 },
    { q: "Where should a real API key live?", options: ["In app.py", "In an environment variable or an ignored .env file", "In README.md", "In a comment"], answer: 1 }
  ],
  skills: { python: 3, logic: 3, git: 2, debug: 1, talk: 2 }
},
/* ───────────────────────────── 7-7 ───────────────────────────── */
{
  id: "7-7", world: 7, n: 7, title: "The AI Pair", concept: "reviewing AI-generated code",
  learn: [
    { h: "AI writes fast, and wrong in sneaky ways",
      p: "AI assistants are now part of most developers' work, and employers expect you to use them <b>and</b> check them. Studies found people using AI wrote less secure code while feeling <i>more</i> confident about it. AI code often looks clean and passes a quick glance, which makes its mistakes easy to miss.",
      lang: "text", file: "common AI mistakes",
      code: `1. Hallucinated APIs:      list.push(), str.contains(), dict.has_key() don't exist in Python
2. Made-up packages:       "pip install fastjsonx" may not exist (or worse, may be malware)
3. Happy path only:        no handling of empty input, missing files, bad data
4. Security holes:         SQL built with f-strings, no escaping, secrets in code
5. Quietly "fixed" tests:  tests deleted or loosened until they pass` },
    { h: "A review checklist",
      p: "Before you accept AI code, run it, test it, and read every line asking: does this function really exist? What happens with empty or bad input? Is any user input put into SQL, HTML or a shell? Did it change or delete tests? Can I explain every line? If you can't explain it, you can't ship it.",
      lang: "text", file: "AI code review checklist",
      code: `[ ] It runs, and all tests pass (and no tests were removed)
[ ] Every function and package it uses actually exists
[ ] Empty, zero, missing and wrong inputs are handled
[ ] No user input goes into SQL, HTML or commands unescaped
[ ] No secrets in the code
[ ] I can explain every line in an interview` },
    { h: "Check that a method exists",
      p: "When code calls a method you don't recognise, check it. <code>dir(value)</code> lists what a value can do, and <code>hasattr</code> tests one name. The official docs are the final word.",
      code: `print(hasattr([], "append"), hasattr([], "push"))
print(hasattr("chai", "contains"), "ai" in "chai")
print([m for m in dir({}) if not m.startswith("_")])` }
  ],
  think: [
    { type: "multi", q: "An AI wrote these lines. Which use methods that <b>don't exist</b> in Python?", options: ["items.push(4)", "items.append(4)", "if text.contains(\"x\"):", "if \"x\" in text:", "d.has_key(\"a\")"], answer: [0, 2, 4],
      why: "<code>push</code> and <code>contains</code> come from other languages (JavaScript, Java), and <code>has_key</code> was removed in Python 3. Python uses append, <code>in</code>, and <code>in</code> again." },
    { type: "spot", q: "The AI says this function safely finds a user. Which line is the security problem?", code: `import sqlite3

def find_user(name):
    conn = sqlite3.connect("app.db")
    query = f"SELECT * FROM users WHERE name = '{name}'"
    row = conn.execute(query).fetchone()
    conn.close()
    return row`, answer: 5,
      why: "Building SQL with an f-string allows SQL injection. It needs a <code>?</code> placeholder." },
    { type: "mcq", q: "An AI \"fixes\" your failing test by deleting it. What should you do?", options: ["Accept it, all tests pass now", "Reject it: restore the test and fix the actual code", "Delete the other tests too", "Ask the AI again with the same prompt"], answer: 1,
      why: "A failing test is information. Removing it hides the bug, it doesn't fix it." }
  ],
  code: {
    brief: "An AI wrote <code>stats.py</code> for a teacher's marks dashboard. It looks fine but has <b>four</b> problems: a method that doesn't exist in Python, a crash on an empty list, a wrong boundary, and a function that changes its input. Fix them so these rules hold:<br>• <code>add_mark(marks, m)</code> returns a <b>new</b> list with m added, and raises <code>ValueError</code> unless 0 ≤ m ≤ 100.<br>• <code>average(marks)</code> returns the average rounded to 1 decimal place, or 0 for an empty list.<br>• <code>grade(m)</code>: 90 and above is <code>\"A\"</code>, 75 and above <code>\"B\"</code>, 50 and above <code>\"C\"</code>, otherwise <code>\"F\"</code>.<br>• <code>top(marks, n)</code> returns the n highest marks, highest first, without changing the input list.",
    sample: ">>> grade(90)\n'A'\n>>> average([])\n0",
    starter: `# AI-written. Review it, then fix it.
def add_mark(marks, m):
    if m < 0 or m > 100:
        raise ValueError("Mark must be 0 to 100")
    marks.push(m)
    return marks


def average(marks):
    return round(sum(marks) / len(marks), 1)


def grade(m):
    if m > 90:
        return "A"
    if m >= 75:
        return "B"
    if m >= 50:
        return "C"
    return "F"


def top(marks, n):
    marks.sort(reverse=True)
    return marks[:n]
`,
    tests: [
      { setup: "old = [70, 80]\nnew = add_mark(old, 90)", call: "(new, old)", expect: "([70, 80, 90], [70, 80])", label: "<code>add_mark</code> returns a new list" },
      { call: "[_cq_err(add_mark, [], m) for m in [-1, 101, 0, 100]]", setup: "def _cq_err(f, *a):\n    try:\n        f(*a)\n        return 'ok'\n    except ValueError:\n        return 'ValueError'", expect: "['ValueError', 'ValueError', 'ok', 'ok']", label: "<code>add_mark</code> checks the range" },
      { call: "average([70, 85, 90])", expect: "81.7" },
      { call: "average([])", expect: "0", label: "<code>average</code> of an empty list" },
      { call: "[grade(m) for m in [100, 90, 89, 75, 74, 50, 49, 0]]", expect: "['A', 'A', 'B', 'B', 'C', 'C', 'F', 'F']", label: "<code>grade</code> at every boundary" },
      { setup: "m = [55, 98, 72, 88]\nt = top(m, 2)", call: "(t, m)", expect: "([98, 88], [55, 98, 72, 88])", label: "<code>top</code> doesn't change the input" }
    ],
    hints: [
      "Run each function once with a small example. Python has no <code>.push</code>: what's the list method for adding to the end? And you need a copy so the input isn't changed: <code>marks + [m]</code> does both.",
      "Empty list: <code>if not marks: return 0</code> before dividing. Boundary: is 90 an A?",
      "<code>top</code>: use <code>sorted(marks, reverse=True)[:n]</code> instead of <code>.sort()</code>."
    ],
    solution: `def add_mark(marks, m):
    if m < 0 or m > 100:
        raise ValueError("Mark must be 0 to 100")
    return marks + [m]


def average(marks):
    if not marks:
        return 0
    return round(sum(marks) / len(marks), 1)


def grade(m):
    if m >= 90:
        return "A"
    if m >= 75:
        return "B"
    if m >= 50:
        return "C"
    return "F"


def top(marks, n):
    return sorted(marks, reverse=True)[:n]`
  },
  bug: {
    brief: "<b>AI code review.</b> The AI says this checks whether a word contains a vowel. It crashes with an AttributeError: <code>str</code> has no such method. Replace the made-up method with real Python.",
    code: `# AI-written
def has_vowel(word):
    for v in "aeiou":
        if word.lower().contains(v):
            return True
    return False

print(has_vowel("Python"))`,
    tests: [{ call: "[has_vowel(w) for w in ['Python', 'rhythm', 'AI', '']]", expect: "[True, False, True, False]" }],
    hints: ["In Python, you check whether text contains something with the <code>in</code> operator: <code>v in word.lower()</code>."],
    fix: `def has_vowel(word):
    for v in "aeiou":
        if v in word.lower():
            return True
    return False

print(has_vowel("Python"))`,
    lesson: "When AI code calls a method you've never seen, check that it exists. <code>.contains()</code> is from other languages."
  },
  explain: "Describe how you review code an AI wrote before you use it. Mention at least three things you check, and why.",
  cards: [
    { q: "Does Python's list have a <code>.push()</code> method?", options: ["Yes", "No, it's .append()", "Only in Python 2", "Only for strings"], answer: 1 },
    { q: "An AI suggests <code>pip install</code> of a package you've never heard of. First step?", options: ["Install it", "Check it really exists and is trustworthy (PyPI page, downloads, source)", "Delete your project", "Ignore it"], answer: 1 },
    { q: "The best sign you understand AI-written code:", options: ["It runs", "You can explain every line", "It's short", "It has comments"], answer: 1 }
  ],
  skills: { debug: 4, python: 2, test: 2, talk: 2, interview: 1 }
},
/* ───────────────────────────── 7-8 BOSS ───────────────────────────── */
{
  id: "7-8", world: 7, n: 8, boss: true, title: "Ship It", concept: "Boss: a pre-launch project checker",
  learn: [
    { h: "Boss rules",
      p: "Before shipping, professional teams run automated checks: is there a README, are there tests, is debug mode off, are there any secrets? Build that checker. It takes a whole project as a dictionary of filename → text and reports what's missing. Then run it on your own flagship before you share it.",
      lang: "text",
      code: `check_project(files) -> list of failed check names
score(files)         -> percentage of checks passed

Checks: readme, install, gitignore, tests, no_debug, no_secrets` },
    { h: "Reuse what you built",
      p: "Your <code>find_secrets</code> from Secret Hunter is exactly the no-secrets check. Good engineers reuse tested code instead of rewriting it. In the boss you can paste it in as a helper function.",
      lang: "text", file: "the checks",
      code: `readme      a README.md file exists
install     README.md has a line starting with "## Install"
gitignore   .gitignore exists and has lines ".env" and "__pycache__/"
tests       some file named test_*.py contains "def test_"
no_debug    no .py file contains "debug=True"
no_secrets  find_secrets(files) finds nothing` }
  ],
  think: [
    { type: "order", q: "Put a sensible release routine in order.", lines: ["Run all the tests", "Run the secret scanner", "Check debug is off and settings come from the environment", "Commit and push", "Deploy and click through the live site"],
      why: "Prove it works, prove it's safe, share it, then check it for real." },
    { type: "mcq", q: "Your checker says 5 of 6 checks pass. Should you ship?", options: ["Yes, 83% is good", "It depends which check failed: a leaked secret or debug mode blocks shipping", "No, never ship below 100%", "Ship and fix later, always"], answer: 1,
      why: "Not all checks are equal. Security problems block a release; a missing README section can be fixed tomorrow." }
  ],
  code: {
    brief: "Build the pre-launch checker. <code>files</code> is a dictionary of filename → text.<br>• <code>check_project(files)</code> returns the names of the checks that <b>fail</b>, in this order: <code>\"readme\"</code> (no <code>README.md</code>), <code>\"install\"</code> (README.md has no line starting with <code>## Install</code>, including when there's no README), <code>\"gitignore\"</code> (no <code>.gitignore</code>, or it lacks a line <code>.env</code> or a line <code>__pycache__/</code>), <code>\"tests\"</code> (no file named like <code>test_*.py</code> containing <code>def test_</code>), <code>\"no_debug\"</code> (some <code>.py</code> file contains <code>debug=True</code>), <code>\"no_secrets\"</code> (your <code>find_secrets</code> from Secret Hunter finds anything).<br>• <code>score(files)</code> returns the percentage of the 6 checks that pass, rounded to a whole number.",
    sample: ">>> check_project({\"app.py\": \"app.run(debug=True)\"})\n['readme', 'install', 'gitignore', 'tests', 'no_debug']\n>>> score({\"app.py\": \"app.run(debug=True)\"})\n17",
    starter: `def find_secrets(files):
    # Paste your Secret Hunter solution here (or write a simpler version)
    return []


def check_project(files):
    failed = []
    return failed


def score(files):
    pass
`,
    tests: [
      { setup: "good = {'README.md': '# App\\n\\n## Install\\n1. run', '.gitignore': '.env\\n__pycache__/\\n*.db', 'app.py': 'import os\\napp.run()', 'test_app.py': 'def test_home():\\n    assert True'}", call: "(check_project(good), score(good))", expect: "([], 100)", label: "A project ready to ship" },
      { call: "check_project({'app.py': 'app.run(debug=True)'})", expect: "['readme', 'install', 'gitignore', 'tests', 'no_debug']", label: "Almost everything missing" },
      { call: "score({'app.py': 'app.run(debug=True)'})", expect: "17" },
      { call: "check_project({'README.md': '# App\\nSee ## Install below', '.gitignore': '.env\\n', 'tests.py': 'def test_x(): pass', 'app.py': 'x = 1'})", expect: "['install', 'gitignore', 'tests']", label: "Near misses: the README line, .gitignore lines, the test file name" },
      { setup: "p = {'README.md': '## Install', '.gitignore': '__pycache__/\\n.env', 'test_a.py': 'def test_a(): pass', 'cfg.py': 'password = \"hunter2\"'}", call: "(check_project(p), score(p))", expect: "(['no_secrets'], 83)", label: "A leaked password" },
      { call: "check_project({'README.md': '## Install', '.gitignore': '.env\\n__pycache__/', 'test_a.py': 'def test_a(): pass', 'notes.md': 'debug=True is bad'})", expect: "[]", label: "debug=True only counts in .py files" }
    ],
    must: [["def\\s+find_secrets", "Include a <code>find_secrets</code> helper."]],
    hints: [
      "Write one small check at a time and test it. For the README: <code>readme = files.get(\"README.md\")</code>; for install: <code>any(line.startswith(\"## Install\") for line in readme.split(\"\\n\"))</code> when readme exists.",
      "For .gitignore, split it into stripped lines and check both <code>\".env\"</code> and <code>\"__pycache__/\"</code> are in that list. For tests: a name that <code>startswith(\"test_\")</code> and <code>endswith(\".py\")</code>, and contains <code>\"def test_\"</code>.",
      "<code>score</code>: <code>round((6 - len(check_project(files))) / 6 * 100)</code>. For no_secrets, paste your Secret Hunter code in as <code>find_secrets</code>."
    ],
    solution: `def run_after(line, marker, length, ok):
    i = line.find(marker)
    if i < 0:
        return False
    rest = line[i + len(marker):i + len(marker) + length]
    return len(rest) == length and all(ok(ch) for ch in rest)


def hardcoded_password(line):
    low = line.lower()
    i = low.find("password")
    if i < 0:
        return False
    j = low.find("=", i)
    if j < 0:
        return False
    rest = line[j + 1:].strip()
    return len(rest) >= 3 and rest[0] in "\\"'" and rest[1] != rest[0]


def find_secrets(files):
    found = []
    for name in sorted(files):
        if name.endswith(".md"):
            continue
        for number, line in enumerate(files[name].split("\\n"), start=1):
            if run_after(line, "AKIA", 16, lambda ch: ch.isdigit() or ch.isupper()):
                found.append((name, number, "aws"))
            if run_after(line, "ghp_", 36, lambda ch: ch.isalnum()):
                found.append((name, number, "github"))
            if "PRIVATE KEY-----" in line:
                found.append((name, number, "private key"))
            if hardcoded_password(line):
                found.append((name, number, "password"))
    return sorted(found)


def check_project(files):
    failed = []
    readme = files.get("README.md")
    if readme is None:
        failed.append("readme")
    if readme is None or not any(line.startswith("## Install") for line in readme.split("\\n")):
        failed.append("install")
    ignore = [line.strip() for line in files.get(".gitignore", "").split("\\n")]
    if ".gitignore" not in files or ".env" not in ignore or "__pycache__/" not in ignore:
        failed.append("gitignore")
    if not any(name.startswith("test_") and name.endswith(".py") and "def test_" in text for name, text in files.items()):
        failed.append("tests")
    if any(name.endswith(".py") and "debug=True" in text for name, text in files.items()):
        failed.append("no_debug")
    if find_secrets(files):
        failed.append("no_secrets")
    return failed


def score(files):
    return round((6 - len(check_project(files))) / 6 * 100)`,
    after: "Run this on your real flagship project before you share it. Then go and make that first open-source pull request."
  },
  bug: {
    brief: "<b>AI code review.</b> The AI's checker approves a project whose <code>.gitignore</code> only contains <code>.envrc</code>, so the real <code>.env</code> secrets file would be committed. It checks text too loosely. Make it check whole lines.",
    code: `# AI-written
def ignores_env(gitignore_text):
    return ".env" in gitignore_text

print(ignores_env(".envrc\\n__pycache__/"))`,
    tests: [{ call: "[ignores_env(t) for t in ['.env\\n', '.envrc\\n', 'x\\n  .env  \\ny', 'my.env.backup', '']]", expect: "[True, False, True, False, False]" }],
    hints: ["Split the text into lines, strip each one, and check whether <code>\".env\"</code> is one of the lines."],
    fix: `def ignores_env(gitignore_text):
    return ".env" in [line.strip() for line in gitignore_text.split("\\n")]

print(ignores_env(".envrc\\n__pycache__/"))`,
    lesson: "\"Contains\" and \"equals\" are different checks. Security checks need the strict one."
  },
  explain: "Interview practice: walk through your shipping routine for a project, from the last code change to the live site. Which checks are must-pass, and why?",
  cards: [
    { q: "Which failed check should block a release?", options: ["A short README", "A leaked secret", "A missing badge", "Long lines"], answer: 1 },
    { q: "Why automate pre-launch checks?", options: ["People forget steps under pressure", "It's required by Python", "It makes code faster", "To skip testing"], answer: 0 },
    { q: "<code>\".env\" in \".envrc\"</code> is…", options: ["True", "False"], answer: 0 }
  ],
  skills: { git: 3, test: 2, python: 3, logic: 2, talk: 3 },
  homeQuest: {
    title: "Take it home",
    intro: "Ship week. By the end, your flagship is live, documented, tested, and you've contributed to someone else's project.",
    tasks: [
      { t: "Ship your flagship", d: "Deploy it (PythonAnywhere or similar), and put the live link at the top of the README.", skill: "web" },
      { t: "Polish the README", d: "What it is, a screenshot or GIF, how to install and run it, how to run the tests, and what you learned.", skill: "talk" },
      { t: "Run the tests automatically on GitHub", d: "Add a GitHub Actions workflow that runs pytest on every push. Search \"GitHub Actions Python starter workflow\".", skill: "test" },
      { t: "Make your first open-source pull request", d: "Start with the First Contributions practice repo, then find a real issue labelled \"good first issue\".", skill: "git" },
      { t: "Scan before you push", d: "Run your secret scanner and pre-launch checker on your flagship. Fix anything they find.", skill: "git" },
      { t: "Ask someone to review your code", d: "A friend, a mentor on Exercism, or a community Discord. Act on one piece of feedback.", skill: "talk" }
    ]
  }
}
);
