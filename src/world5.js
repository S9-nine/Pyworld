/* World 5 — Web Kingdom: HTTP, HTML, forms, Flask routes, JSON APIs, POST, web security. Boss: a guestbook web app. */

RESOURCES[5] = [
  { name: "Flask Quickstart", what: "The official guide: routes, variables in URLs, request data and responses. Read it alongside this world.", url: "https://flask.palletsprojects.com/en/stable/quickstart/" },
  { name: "MDN: How the web works (HTTP)", what: "Requests, responses, methods and status codes, explained clearly.", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview" },
  { name: "MDN: Structuring content with HTML", what: "Headings, lists, links, images and forms, with live examples.", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content" },
  { name: "Flask Mega-Tutorial (Miguel Grinberg)", what: "Free and famous. Part I builds Hello World; later parts add forms and a database.", url: "https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world" },
  { name: "OWASP Top 10 (2025)", what: "The list of the most common web security risks. Know what Injection and XSS mean.", url: "https://top10.owasp.org/2025/" }
];

const W5_MENU = `MENU = [
    {"id": 1, "name": "Masala Chai", "price": 20, "veg": True},
    {"id": 2, "name": "Samosa", "price": 15, "veg": True},
    {"id": 3, "name": "Chicken Roll", "price": 60, "veg": False},
    {"id": 4, "name": "Filter Coffee", "price": 30, "veg": True},
]`;

LEVELS.push(
/* ───────────────────────────── 5-1 ───────────────────────────── */
{
  id: "5-1", world: 5, n: 1, title: "How the Web Talks", concept: "HTTP: requests, responses, URLs",
  learn: [
    { h: "Every page is a request and a response",
      p: "When you open a website, your browser sends a <b>request</b> to a server, and the server sends back a <b>response</b>. A request has a <b>method</b> (what you want to do) and a <b>URL</b> (what you want it done to). A response has a <b>status code</b> and a <b>body</b>, which is HTML for pages or JSON for APIs.",
      lang: "text", file: "one request and its response",
      code: `REQUEST                         RESPONSE
GET /menu?veg=yes HTTP/1.1      HTTP/1.1 200 OK
Host: chai-stall.example        Content-Type: application/json

                                [{"name": "Masala Chai", "price": 20}]` },
    { h: "Methods say what you want",
      p: "<b>GET</b> reads something and must not change anything. <b>POST</b> creates something new, like a new order. <b>PUT</b> or <b>PATCH</b> update something, and <b>DELETE</b> removes it. APIs built around these are called <b>REST</b> APIs.",
      lang: "text", file: "a REST API for orders",
      code: `GET    /orders        list all orders
GET    /orders/7      get order 7
POST   /orders        create a new order (data in the body)
PATCH  /orders/7      change order 7
DELETE /orders/7      cancel order 7` },
    { h: "The parts of a URL",
      p: "<code>https://chai-stall.example/menu?veg=yes&amp;page=2</code> has a scheme (<code>https</code>), a host (<code>chai-stall.example</code>), a path (<code>/menu</code>) and a <b>query string</b> after the <code>?</code>: pairs of <code>key=value</code> joined by <code>&amp;</code>. Breaking strings apart like this is everyday programming.",
      code: `url = "https://chai-stall.example/menu?veg=yes&page=2"
before, query = url.split("?", 1)
print("Path part:", before)
for pair in query.split("&"):
    key, value = pair.split("=", 1)
    print(key, "->", value)` },
    { h: "Status codes, again",
      p: "You met these in World 4 from the client's side. Now you'll be the server, so you'll <i>choose</i> them: 200 OK, 201 Created, 400 Bad Request (the client sent bad data), 404 Not Found, 405 Method Not Allowed, 500 Internal Server Error (your code crashed).",
      lang: "text", file: "status codes you'll send",
      code: `200 OK            here's what you asked for
201 Created       I made the new thing
400 Bad Request   your data is wrong or missing
404 Not Found     there's nothing at that address
405 Method Not Allowed   e.g. POST to a GET-only page
500 Server Error  my code crashed (a bug on the server)` }
  ],
  think: [
    { type: "match", q: "Match each action with the HTTP method a REST API would use.", pairs: [["Show the menu", "GET"], ["Place a new order", "POST"], ["Change the quantity of order 7", "PATCH"], ["Cancel order 7", "DELETE"]],
      why: "GET reads, POST creates, PATCH (or PUT) updates, DELETE removes." },
    { type: "order", q: "Put these steps in the order they happen when you open a web page.", lines: ["You type a URL and press Enter", "The browser sends a GET request to the server", "The server runs its code and builds a response", "The server sends back a status code and a body", "The browser shows the page"],
      why: "Request, then server work, then response, then display. Everything on the web follows this loop." },
    { type: "mcq", q: "A user sends an order with the quantity missing. Which status should your server send?", options: ["200", "400", "404", "500"], answer: 1,
      why: "The client's data is wrong, so 400 Bad Request. 500 would mean <i>your</i> code crashed, and 404 means the address doesn't exist." }
  ],
  code: {
    brief: "Write two URL helpers. They <b>return</b> answers.<br>• <code>parse_query(query)</code> turns <code>\"q=chai&amp;page=2\"</code> into <code>{\"q\": \"chai\", \"page\": \"2\"}</code>. Values stay as text. An empty string gives <code>{}</code>. A pair with no <code>=</code>, like <code>\"veg\"</code>, gives the value <code>\"\"</code>. Split each pair at the <b>first</b> <code>=</code> only.<br>• <code>build_url(base, params)</code> does the opposite: <code>build_url(\"/menu\", {\"veg\": \"yes\", \"page\": 2})</code> gives <code>\"/menu?veg=yes&amp;page=2\"</code>. With no params, return just the base.",
    sample: ">>> parse_query(\"q=chai&page=2\")\n{'q': 'chai', 'page': '2'}\n>>> build_url(\"/menu\", {\"veg\": \"yes\"})\n'/menu?veg=yes'",
    starter: `def parse_query(query):
    pass


def build_url(base, params):
    pass
`,
    tests: [
      { call: "parse_query('q=chai&page=2')", expect: "{'q': 'chai', 'page': '2'}", silent: true },
      { call: "parse_query('')", expect: "{}" },
      { call: "parse_query('veg')", expect: "{'veg': ''}" },
      { call: "parse_query('code=a=b&x=1')", expect: "{'code': 'a=b', 'x': '1'}" },
      { call: "build_url('/menu', {'veg': 'yes', 'page': 2})", expect: "'/menu?veg=yes&page=2'", silent: true },
      { call: "build_url('/menu', {})", expect: "'/menu'" },
      { call: "parse_query(build_url('/x', {'a': '1', 'b': 'two'}).split('?')[1])", expect: "{'a': '1', 'b': 'two'}", label: "The two helpers undo each other" }
    ],
    hints: [
      "<code>parse_query</code>: if the query is empty, return <code>{}</code>. Otherwise loop over <code>query.split(\"&amp;\")</code>.",
      "For each pair: <code>if \"=\" in pair:</code> split it with <code>pair.split(\"=\", 1)</code>, otherwise the value is <code>\"\"</code>.",
      "<code>build_url</code>: build a list of <code>f\"{k}={v}\"</code> strings, then join them with <code>\"&amp;\"</code>. Add <code>\"?\"</code> only if there are params."
    ],
    solution: `def parse_query(query):
    result = {}
    if query == "":
        return result
    for pair in query.split("&"):
        if "=" in pair:
            key, value = pair.split("=", 1)
        else:
            key, value = pair, ""
        result[key] = value
    return result


def build_url(base, params):
    if not params:
        return base
    parts = [f"{k}={v}" for k, v in params.items()]
    return base + "?" + "&".join(parts)`
  },
  bug: {
    brief: "This query parser crashes on <code>\"token=abc=\"</code> (some real tokens end with <code>=</code>) and on <code>\"debug\"</code>. Read the error, then make it split each pair at the first <code>=</code> only, and give <code>\"\"</code> when there's no <code>=</code>.",
    code: `def parse_query(query):
    result = {}
    for pair in query.split("&"):
        key, value = pair.split("=")
        result[key] = value
    return result

print(parse_query("token=abc=&debug"))`,
    tests: [{ call: "parse_query('a=1&b=2')", expect: "{'a': '1', 'b': '2'}" }, { call: "parse_query('token=abc=')", expect: "{'token': 'abc='}" }, { call: "parse_query('debug')", expect: "{'debug': ''}" }],
    hints: ["\"too many values to unpack\" means split gave more than 2 pieces. <code>split(\"=\", 1)</code> splits only once. For a pair with no <code>=</code>, check with <code>if \"=\" in pair</code>."],
    fix: `def parse_query(query):
    result = {}
    for pair in query.split("&"):
        if "=" in pair:
            key, value = pair.split("=", 1)
        else:
            key, value = pair, ""
        result[key] = value
    return result

print(parse_query("token=abc=&debug"))`,
    lesson: "Data from outside (URLs, files, users) is messy. Handle the odd cases instead of trusting the happy path."
  },
  explain: "Explain what happens, step by step, between typing a URL in your browser and seeing the page. Use the words request, method, response and status code.",
  cards: [
    { q: "Which method should only read data, never change it?", options: ["GET", "POST", "DELETE", "PATCH"], answer: 0 },
    { q: "In <code>/menu?veg=yes</code>, the part after ? is the…", options: ["Path", "Host", "Query string", "Status"], answer: 2 },
    { q: "Your server's code crashed. Which status does the client get?", options: ["200", "400", "404", "500"], answer: 3 }
  ],
  skills: { web: 4, python: 2, logic: 2, talk: 2 }
},
/* ───────────────────────────── 5-2 ───────────────────────────── */
{
  id: "5-2", world: 5, n: 2, title: "Building Blocks", concept: "HTML: headings, lists, links, images",
  learn: [
    { h: "HTML describes what things are",
      p: "Every web page is built from <b>HTML</b>. Tags in angle brackets mark what each piece of content <i>is</i>: <code>&lt;h1&gt;</code> is the main heading, <code>&lt;p&gt;</code> is a paragraph. Most tags come in pairs: an opening tag and a closing tag with a <code>/</code>. Press <b>Show</b> to see it.",
      code: `<h1>Desert Chai Stall</h1>
<p>Fresh chai since 1998. Open every day from 6 am.</p>
<h2>Today's special</h2>
<p>Ginger chai, only Rs 15.</p>` },
    { h: "Lists",
      p: "<code>&lt;ul&gt;</code> makes a bulleted (unordered) list and <code>&lt;ol&gt;</code> a numbered (ordered) one. Each item goes in its own <code>&lt;li&gt;</code>. Tags inside other tags are indented to show the nesting, like Python blocks.",
      code: `<h2>Menu</h2>
<ul>
  <li>Masala chai</li>
  <li>Samosa</li>
  <li>Bun maska</li>
</ul>
<h2>How to order</h2>
<ol>
  <li>Pick your snack</li>
  <li>Pay at the counter</li>
</ol>` },
    { h: "Links and images use attributes",
      p: "Extra information goes in <b>attributes</b> inside the opening tag. A link <code>&lt;a href=\"...\"&gt;</code> needs <code>href</code>, the address to go to. An image <code>&lt;img&gt;</code> needs <code>src</code>, the picture's address, and <code>alt</code>, a text description for people who can't see it, which screen readers read aloud. <code>&lt;img&gt;</code> has no closing tag.",
      code: `<p>Find us on <a href="https://maps.example.com/chai-stall">the map</a>.</p>
<img src="https://picsum.photos/200/120" alt="A clay cup of steaming chai">` },
    { h: "A full page has a skeleton",
      p: "A complete HTML file starts with <code>&lt;!doctype html&gt;</code>, then <code>&lt;html&gt;</code> holding a <code>&lt;head&gt;</code> (the title and settings) and a <code>&lt;body&gt;</code> (what you see). Good HTML uses the tag that matches the meaning, which helps search engines and accessibility tools.",
      code: `<!doctype html>
<html lang="en">
<head>
  <title>Desert Chai Stall</title>
</head>
<body>
  <h1>Desert Chai Stall</h1>
  <p>Open daily.</p>
</body>
</html>` }
  ],
  think: [
    { type: "match", q: "Match each tag with what it's for.", pairs: [["<code>&lt;h1&gt;</code>", "the main heading"], ["<code>&lt;p&gt;</code>", "a paragraph"], ["<code>&lt;ul&gt;</code>", "a bulleted list"], ["<code>&lt;li&gt;</code>", "one item in a list"], ["<code>&lt;a&gt;</code>", "a link"]],
      why: "Pick tags for what the content <i>is</i>, not how it looks. How it looks is CSS's job, next level." },
    { type: "mcq", q: "Why does every <code>&lt;img&gt;</code> need an <code>alt</code> attribute?", options: ["It makes the image load faster", "It describes the image for people who can't see it", "It sets the image size", "It's the image's file name"], answer: 1,
      why: "Screen readers read the alt text aloud, and it shows if the image fails to load. Many companies are legally required to make their sites accessible." },
    { type: "spot", lang: "html", q: "This link won't go anywhere when clicked. Which line is wrong?", code: `<h2>Contact</h2>
<p>Email us any time.</p>
<a>Visit our GitHub</a>
<p>Thanks!</p>`, answer: 3,
      why: "An <code>&lt;a&gt;</code> without <code>href</code> isn't a real link. It should be <code>&lt;a href=\"https://github.com/...\"&gt;</code>." }
  ],
  code: {
    kind: "html",
    brief: "Build your own developer profile page. It needs:<br>• one <code>&lt;h1&gt;</code> with your name<br>• a <code>&lt;p&gt;</code> about you, at least 10 words long<br>• a heading <code>&lt;h2&gt;</code> that says <code>Skills</code>, followed by a <code>&lt;ul&gt;</code> with at least 3 skills<br>• a link to your GitHub profile: its <code>href</code> must start with <code>https://github.com/</code><br>• an <code>&lt;img&gt;</code> with a non-empty <code>alt</code> description",
    sample: "Asha Rao\nI am learning Python and building small apps every day...\nSkills\n• Python  • SQL  • Git\nMy GitHub\n[photo]",
    starter: `<!doctype html>
<html lang="en">
<head>
  <title>My profile</title>
</head>
<body>
  <!-- Build your page here -->

</body>
</html>
`,
    tests: [
      { sel: "h1", count: 1, label: "Exactly one <code>&lt;h1&gt;</code>", msg: "Use exactly one <code>&lt;h1&gt;</code>, for your name." },
      { sel: "p", label: "A paragraph about you, 10+ words", fn: (els) => els.some((e) => e.textContent.trim().split(/\s+/).length >= 10), msg: "Write a <code>&lt;p&gt;</code> about yourself with at least 10 words." },
      { sel: "h2", text: "skills", label: "An <code>&lt;h2&gt;</code> that says Skills", msg: "Add <code>&lt;h2&gt;Skills&lt;/h2&gt;</code>." },
      { sel: "ul li", min: 3, label: "A list with at least 3 skills", msg: "Put at least 3 <code>&lt;li&gt;</code> items inside a <code>&lt;ul&gt;</code>." },
      { sel: "a", label: "A link to GitHub", fn: (els) => els.some((e) => /^https:\/\/github\.com\/\S+/.test(e.getAttribute("href") || "") && e.textContent.trim()), msg: "Add a link like <code>&lt;a href=\"https://github.com/your-name\"&gt;My GitHub&lt;/a&gt;</code>, with some link text." },
      { sel: "img", label: "An image with alt text", fn: (els) => els.length > 0 && els.every((e) => (e.getAttribute("alt") || "").trim() !== ""), msg: "Every <code>&lt;img&gt;</code> needs a non-empty <code>alt</code> describing it." }
    ],
    hints: [
      "Inside <code>&lt;body&gt;</code>, go top to bottom: the h1, the paragraph, the h2 and the list, the link, the image. Press Show after each one.",
      "A list: <code>&lt;ul&gt;</code>, then one <code>&lt;li&gt;Python&lt;/li&gt;</code> per skill, then <code>&lt;/ul&gt;</code>.",
      "<code>&lt;a href=\"https://github.com/your-name\"&gt;My GitHub&lt;/a&gt;</code> and <code>&lt;img src=\"https://picsum.photos/120\" alt=\"Photo of me smiling\"&gt;</code>."
    ],
    solution: `<!doctype html>
<html lang="en">
<head>
  <title>My profile</title>
</head>
<body>
  <h1>Asha Rao</h1>
  <p>I am learning Python and building small apps every day so I can become a developer.</p>
  <h2>Skills</h2>
  <ul>
    <li>Python</li>
    <li>SQL</li>
    <li>Git</li>
  </ul>
  <a href="https://github.com/asha-rao">My GitHub</a>
  <img src="https://picsum.photos/120" alt="Photo of Asha smiling">
</body>
</html>`,
    wrong: ["<h1>Asha</h1><h1>Rao</h1><p>I am learning Python and building small apps every single day.</p><h2>Skills</h2><ul><li>a</li><li>b</li><li>c</li></ul><a href='https://github.com/x'>gh</a><img src='p.png' alt='me'>", "<h1>Asha</h1><p>I am learning Python and building small apps every single day.</p><h2>Skills</h2><ul><li>a</li><li>b</li><li>c</li></ul><a href='https://github.com/x'>gh</a><img src='p.png' alt=''>"]
  },
  bug: {
    kind: "html",
    brief: "<b>Accessibility review.</b> This page fails three checks: the image has no description, the link text \"click here\" doesn't say where it goes, and the skills aren't inside a list. Fix all three.",
    code: `<h1>Ravi Kumar</h1>
<img src="ravi.jpg">
<p>Junior developer in Kochi.</p>
<p>See my projects: <a href="https://github.com/ravi-k">click here</a></p>
<li>Python</li>
<li>Flask</li>`,
    tests: [
      { sel: "img", label: "The image has alt text", fn: (els) => els.length > 0 && els.every((e) => (e.getAttribute("alt") || "").trim() !== ""), msg: "Add an <code>alt</code> that describes the photo." },
      { sel: "a", label: "The link text says where it goes", fn: (els) => els.length > 0 && els.every((e) => !/^\s*(click here|here|link)\s*$/i.test(e.textContent)), msg: "Change \"click here\" to words that say where the link goes, like \"Ravi's projects on GitHub\"." },
      { sel: "ul li, ol li", min: 2, label: "The skills are in a list", msg: "Put the <code>&lt;li&gt;</code> items inside <code>&lt;ul&gt;</code> … <code>&lt;/ul&gt;</code>." }
    ],
    hints: ["Three separate fixes: add <code>alt=\"...\"</code> to the img, rewrite the link text, and wrap the two <code>&lt;li&gt;</code> lines in <code>&lt;ul&gt;</code> and <code>&lt;/ul&gt;</code>."],
    fix: `<h1>Ravi Kumar</h1>
<img src="ravi.jpg" alt="Ravi standing in front of a whiteboard">
<p>Junior developer in Kochi.</p>
<p>See <a href="https://github.com/ravi-k">Ravi's projects on GitHub</a></p>
<ul>
  <li>Python</li>
  <li>Flask</li>
</ul>`,
    solution: "",
    lesson: "Accessible pages work for everyone: people using screen readers, keyboards or slow internet. Many companies check this before shipping."
  },
  explain: "Why should you choose HTML tags by what the content <i>is</i> (heading, list, link) rather than how it looks?",
  cards: [
    { q: "Which attribute holds a link's address?", options: ["src", "href", "alt", "link"], answer: 1 },
    { q: "Which tag makes one item in a list?", options: ["<ul>", "<item>", "<li>", "<list>"], answer: 2 },
    { q: "What is <code>alt</code> on an image for?", options: ["The file name", "A text description", "The size", "A tooltip only"], answer: 1 }
  ],
  skills: { web: 4, talk: 2, logic: 1 }
},
/* ───────────────────────────── 5-3 ───────────────────────────── */
{
  id: "5-3", world: 5, n: 3, title: "Forms and Style", concept: "HTML forms and a little CSS",
  learn: [
    { h: "Forms send data to a server",
      p: "A <code>&lt;form&gt;</code> collects input. <code>action</code> is the URL it sends to, and <code>method</code> is GET or POST. Every input needs a <code>name</code>: that's the key the server receives. Without a name, the value is never sent.",
      code: `<form action="/signup" method="post">
  <input name="email" type="email" placeholder="you@example.com">
  <button type="submit">Join</button>
</form>` },
    { h: "Labels and input types",
      p: "A <code>&lt;label for=\"x\"&gt;</code> names the input whose <code>id</code> is x. Clicking the label focuses the input, and screen readers read it. <code>type</code> helps phones show the right keyboard: <code>email</code>, <code>number</code>, <code>password</code>. <code>required</code> and <code>minlength</code> let the browser catch mistakes early.",
      code: `<form action="/signup" method="post">
  <label for="email">Email</label>
  <input id="email" name="email" type="email" required>

  <label for="pw">Password</label>
  <input id="pw" name="password" type="password" minlength="8" required>

  <button type="submit">Create account</button>
</form>` },
    { h: "Never trust the browser alone",
      p: "<code>required</code> and <code>minlength</code> are a nice first check, but anyone can send a request without your form, for example with Python's requests library. The server must always check the data again. You'll do that in Flask soon.",
      lang: "text", file: "two layers of checking",
      code: `Browser check (HTML attributes):  fast, friendly, easy to skip
Server check (your Python code):   slower, but can't be skipped

Always do both. Never only the browser.` },
    { h: "CSS makes it look good",
      p: "CSS rules pick elements with a <b>selector</b> and set <b>properties</b>. <code>button { ... }</code> styles every button. <code>.danger { ... }</code> styles elements with <code>class=\"danger\"</code>. Put CSS in a <code>&lt;style&gt;</code> tag for now.",
      code: `<style>
  body { font-family: sans-serif; max-width: 360px; margin: 24px auto; }
  label { display: block; margin-top: 12px; font-weight: bold; }
  input { width: 100%; padding: 8px; }
  button { margin-top: 16px; padding: 10px 18px; background: #23845A; color: white; border: 0; border-radius: 8px; }
  .note { color: #666; font-size: 13px; }
</style>
<form action="/signup" method="post">
  <label for="email">Email</label>
  <input id="email" name="email" type="email" required>
  <p class="note">We never share your email.</p>
  <button type="submit">Join</button>
</form>` }
  ],
  think: [
    { type: "mcq", q: "A form sends <code>email</code> and <code>city</code>, but the server only ever receives the email. What's most likely missing?", options: ["The city input has no name attribute", "The form has no CSS", "The button has no label", "The city input isn't required"], answer: 0,
      why: "Only inputs with a <code>name</code> are sent. The name is the key on the server side." },
    { type: "multi", q: "Which statements are true?", options: ["required in HTML is enough to keep bad data out", "The server must check data again", "A label's for must match an input's id", "type=\"email\" helps phones show the right keyboard"], answer: [1, 2, 3],
      why: "Browser checks are easy to bypass, so the server always checks again. Labels link to inputs by id, and input types give better keyboards and basic checks." },
    { type: "match", q: "Match each CSS selector with what it styles.", pairs: [["<code>button</code>", "every button"], ["<code>.note</code>", "elements with class=\"note\""], ["<code>#email</code>", "the element with id=\"email\""], ["<code>form input</code>", "inputs inside a form"]],
      why: "Tag names select every element of that kind, <code>.</code> selects a class, <code>#</code> selects one id, and a space means \"inside\"." }
  ],
  code: {
    kind: "html",
    brief: "Build the sign-up form for the Web Kingdom. It needs:<br>• a <code>&lt;form&gt;</code> with <code>method=\"post\"</code> and <code>action=\"/signup\"</code><br>• an input named <code>email</code> with <code>type=\"email\"</code> and <code>required</code><br>• an input named <code>password</code> with <code>type=\"password\"</code> and <code>minlength=\"8\"</code><br>• a <code>&lt;label&gt;</code> for every input, linked with <code>for</code> and <code>id</code><br>• a submit button<br>• a <code>&lt;style&gt;</code> block with at least one rule for <code>button</code>",
    sample: "Email     [            ]\nPassword  [            ]\n          [ Join ]",
    starter: `<!-- The sign-up form -->
`,
    tests: [
      { sel: "form", label: "A form that POSTs to /signup", fn: (els) => els.some((f) => (f.getAttribute("method") || "").toLowerCase() === "post" && f.getAttribute("action") === "/signup"), msg: "Use <code>&lt;form action=\"/signup\" method=\"post\"&gt;</code>." },
      { sel: "form input[name=email]", label: "A required email input", fn: (els) => els.some((e) => e.getAttribute("type") === "email" && e.hasAttribute("required")), msg: "Add <code>&lt;input name=\"email\" type=\"email\" required&gt;</code> inside the form." },
      { sel: "form input[name=password]", label: "A password input, at least 8 characters", fn: (els) => els.some((e) => e.getAttribute("type") === "password" && +e.getAttribute("minlength") >= 8), msg: "Add <code>&lt;input name=\"password\" type=\"password\" minlength=\"8\"&gt;</code>." },
      { sel: "form input", label: "Every input has a matching label", fn: (els, doc) => els.filter((e) => !/^(submit|hidden|button)$/i.test(e.getAttribute("type") || "")).every((e) => e.id && doc.querySelector(`label[for="${e.id}"]`)), msg: "Give each input an <code>id</code>, and add <code>&lt;label for=\"that-id\"&gt;</code> for it." },
      { sel: "form button, form input[type=submit]", label: "A submit button", fn: (els) => els.some((e) => (e.getAttribute("type") || "submit").toLowerCase() === "submit"), msg: "Add <code>&lt;button type=\"submit\"&gt;Join&lt;/button&gt;</code> inside the form." },
      { sel: "style", label: "CSS that styles the button", fn: (els) => els.some((e) => /(^|[\s,}])button[^{]*\{[^}]*:/.test(e.textContent)), msg: "Add a <code>&lt;style&gt;</code> with a rule like <code>button { background: green; }</code>." }
    ],
    hints: [
      "Start with the form tag and a button, press Show, then add one input at a time.",
      "Each input pair: <code>&lt;label for=\"email\"&gt;Email&lt;/label&gt;</code> then <code>&lt;input id=\"email\" name=\"email\" type=\"email\" required&gt;</code>.",
      "CSS goes in <code>&lt;style&gt; button { background: #23845A; color: white; } &lt;/style&gt;</code>."
    ],
    solution: `<style>
  button { background: #23845A; color: white; padding: 10px 18px; border: 0; }
</style>
<form action="/signup" method="post">
  <label for="email">Email</label>
  <input id="email" name="email" type="email" required>
  <label for="pw">Password</label>
  <input id="pw" name="password" type="password" minlength="8" required>
  <button type="submit">Join</button>
</form>`,
    wrong: [`<form action="/signup" method="get"><label for="e">Email</label><input id="e" name="email" type="email" required><label for="p">Password</label><input id="p" name="password" type="password" minlength="8"><button type="submit">Join</button></form><style>button{color:red}</style>`, `<form action="/signup" method="post"><input id="e" name="email" type="email" required><input id="p" name="password" type="password" minlength="8"><button>Join</button></form><style>button{color:red}</style>`]
  },
  bug: {
    kind: "html",
    brief: "Users fill in this feedback form, but the server receives nothing from it. The browser only sends inputs that have a name. Fix the inputs so the server gets <code>name</code>, <code>rating</code> and <code>comment</code>.",
    code: `<form action="/feedback" method="post">
  <label for="n">Your name</label>
  <input id="n" type="text">
  <label for="r">Rating (1-5)</label>
  <input id="r" type="number" min="1" max="5">
  <label for="c">Comment</label>
  <textarea id="c"></textarea>
  <button type="submit">Send</button>
</form>`,
    tests: [
      { sel: "form input[name=name]", label: "Sends <code>name</code>", msg: "Add <code>name=\"name\"</code> to the first input." },
      { sel: "form input[name=rating]", label: "Sends <code>rating</code>", msg: "Add <code>name=\"rating\"</code> to the number input." },
      { sel: "form textarea[name=comment]", label: "Sends <code>comment</code>", msg: "Add <code>name=\"comment\"</code> to the textarea." }
    ],
    hints: ["<code>id</code> links the label. <code>name</code> is what the server sees. Each field needs both."],
    fix: `<form action="/feedback" method="post">
  <label for="n">Your name</label>
  <input id="n" name="name" type="text">
  <label for="r">Rating (1-5)</label>
  <input id="r" name="rating" type="number" min="1" max="5">
  <label for="c">Comment</label>
  <textarea id="c" name="comment"></textarea>
  <button type="submit">Send</button>
</form>`,
    solution: "",
    lesson: "<code>id</code> is for the page (labels, CSS). <code>name</code> is for the server. Forms need both."
  },
  explain: "Why must the server check form data even when the HTML uses <code>required</code> and <code>minlength</code>?",
  cards: [
    { q: "Which attribute decides the key the server receives?", options: ["id", "name", "class", "for"], answer: 1 },
    { q: "In CSS, <code>.note</code> selects…", options: ["Every <note> tag", "Elements with class=\"note\"", "The element with id=\"note\"", "Nothing"], answer: 1 },
    { q: "Is HTML's <code>required</code> enough to protect your server?", options: ["Yes", "No, the server must check too", "Only with POST", "Only on phones"], answer: 1 }
  ],
  skills: { web: 4, talk: 2, logic: 1 }
},
/* ───────────────────────────── 5-4 ───────────────────────────── */
{
  id: "5-4", world: 5, n: 4, title: "Hello, Flask", concept: "Flask routes and the test client",
  learn: [
    { h: "Flask turns functions into web pages",
      p: "<b>Flask</b> is a popular Python web framework. You create an <code>app</code>, and <code>@app.route(\"/\")</code> above a function says: \"when someone requests this path, run this function and send back what it returns\". The <code>@</code> line is called a <b>decorator</b>.",
      code: `from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return "Welcome to the Web Kingdom!"

@app.route("/about")
def about():
    return "<h1>About</h1><p>A chai stall with an API.</p>"

client = app.test_client()
print(client.get("/").get_data(as_text=True))
print(client.get("/about").status_code)` },
    { h: "Test it without a browser",
      p: "<code>app.test_client()</code> sends pretend requests to your app, with no server and no browser. Real companies test their web apps exactly this way, and so does this game's checker. <code>.status_code</code> and <code>.get_data(as_text=True)</code> show what came back.",
      code: `from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return "Hi!"

client = app.test_client()
for path in ["/", "/nothing-here"]:
    r = client.get(path)
    print(path, "->", r.status_code)` },
    { h: "Variables in the URL",
      p: "Put <code>&lt;name&gt;</code> in the route, and Flask passes that part of the URL to your function as a parameter. <code>&lt;int:n&gt;</code> only matches whole numbers and converts them for you, so <code>/square/abc</code> gives a 404.",
      code: `from flask import Flask

app = Flask(__name__)

@app.route("/hello/<name>")
def hello(name):
    return f"Hello, {name}!"

@app.route("/square/<int:n>")
def square(n):
    return str(n * n)

c = app.test_client()
print(c.get("/hello/Asha").get_data(as_text=True))
print(c.get("/square/12").get_data(as_text=True))
print(c.get("/square/abc").status_code)` },
    { h: "Running it for real",
      p: "On your own computer, <code>app.run(debug=True)</code> starts a real server at <code>http://127.0.0.1:5000</code> that your browser can open. Put it under <code>if __name__ == \"__main__\":</code> so tests and hosting services can import the app without starting a second server. Never use <code>debug=True</code> on a live website: it lets visitors run code on your server.",
      code: `from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return "It works!"

if __name__ == "__main__":
    app.run(debug=True)` }
  ],
  think: [
    { type: "predict", q: "What does this print?", code: `from flask import Flask
app = Flask(__name__)

@app.route("/double/<int:n>")
def double(n):
    return str(n * 2)

c = app.test_client()
print(c.get("/double/21").get_data(as_text=True))
print(c.get("/double/x").status_code)`, answer: "42\n404",
      why: "<code>&lt;int:n&gt;</code> turns \"21\" into the number 21. \"x\" isn't a whole number, so no route matches and Flask answers 404." },
    { type: "mcq", q: "Why does this route crash with a 500 error?", code: `@app.route("/total")
def total():
    t = 20 + 15
    print(t)`, options: ["Routes can't do maths", "It prints instead of returning, so it returns None", "The path needs <int:t>", "print is not allowed in Flask"], answer: 1,
      why: "A view function must <b>return</b> the response. With no return it gives None, and Flask can't send None, so it's a server error." },
    { type: "mcq", q: "Why put <code>app.run()</code> under <code>if __name__ == \"__main__\":</code>?", options: ["It's faster", "So tests and hosting services can import the app without starting a server", "Flask requires it", "It hides the code"], answer: 1,
      why: "Hosting services like PythonAnywhere import your app and serve it themselves. A bare <code>app.run()</code> would try to start a second server." }
  ],
  code: {
    brief: "Build your first Flask app called <code>app</code> with three routes:<br>• <code>/</code> returns <code>Welcome to the Web Kingdom!</code><br>• <code>/hello/&lt;name&gt;</code> returns <code>Hello, NAME!</code> with the name from the URL<br>• <code>/square/&lt;int:n&gt;</code> returns the square of n as text, like <code>144</code><br>Start the server only inside <code>if __name__ == \"__main__\":</code>.",
    sample: "GET /            -> Welcome to the Web Kingdom!\nGET /hello/Ravi  -> Hello, Ravi!\nGET /square/12   -> 144\nGET /square/abc  -> 404 Not Found",
    starter: `from flask import Flask

app = Flask(__name__)

# Your routes here


if __name__ == "__main__":
    app.run(debug=True)
`,
    tests: [
      { setup: "c = app.test_client()", call: "c.get('/').get_data(as_text=True)", expect: "'Welcome to the Web Kingdom!'", label: "GET <code>/</code>" },
      { setup: "c = app.test_client()", call: "c.get('/hello/Ravi').get_data(as_text=True)", expect: "'Hello, Ravi!'", label: "GET <code>/hello/Ravi</code>" },
      { setup: "c = app.test_client()", call: "c.get('/hello/Meera').get_data(as_text=True)", expect: "'Hello, Meera!'", label: "GET <code>/hello/Meera</code>" },
      { setup: "c = app.test_client()", call: "c.get('/square/12').get_data(as_text=True)", expect: "'144'", label: "GET <code>/square/12</code>" },
      { setup: "c = app.test_client()", call: "c.get('/square/0').status_code", expect: "200", label: "GET <code>/square/0</code> works" },
      { setup: "c = app.test_client()", call: "c.get('/square/abc').status_code", expect: "404", label: "GET <code>/square/abc</code> is 404" }
    ],
    must: [["from\\s+flask\\s+import", "Import Flask with <code>from flask import Flask</code>."], ["@app\\.route", "Create routes with <code>@app.route(...)</code>."]],
    hints: [
      "Copy the pattern from Learn: <code>@app.route(\"/\")</code> on one line, <code>def home():</code> under it, and a <code>return</code>.",
      "<code>@app.route(\"/hello/&lt;name&gt;\")</code> then <code>def hello(name): return f\"Hello, {name}!\"</code>",
      "<code>@app.route(\"/square/&lt;int:n&gt;\")</code>. The response must be text, so return <code>str(n * n)</code>."
    ],
    solution: `from flask import Flask

app = Flask(__name__)


@app.route("/")
def home():
    return "Welcome to the Web Kingdom!"


@app.route("/hello/<name>")
def hello(name):
    return f"Hello, {name}!"


@app.route("/square/<int:n>")
def square(n):
    return str(n * n)


if __name__ == "__main__":
    app.run(debug=True)`,
    wrong: [{ code: `from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return "Welcome to the Web Kingdom!"

@app.route("/hello/<name>")
def hello(name):
    return "Hello, Ravi!"

@app.route("/square/<n>")
def square(n):
    return str(int(n) * int(n))`, why: "hard-coded name; square crashes (500) instead of 404" }]
  },
  bug: {
    brief: "Visiting <code>/menu</code> gives a <b>500 Internal Server Error</b>. Use the test client to see it, then fix the view.",
    code: `from flask import Flask

app = Flask(__name__)

@app.route("/menu")
def menu():
    items = ["Masala Chai", "Samosa", "Bun Maska"]
    page = "Today: " + ", ".join(items)
    print(page)

c = app.test_client()
r = c.get("/menu")
print(r.status_code)`,
    tests: [{ setup: "c = app.test_client()", call: "c.get('/menu').status_code", expect: "200" }, { setup: "c = app.test_client()", call: "c.get('/menu').get_data(as_text=True)", expect: "'Today: Masala Chai, Samosa, Bun Maska'" }],
    hints: ["The server log line shows a TypeError about the view returning None. What should a view function do with its page instead of printing it?"],
    fix: `from flask import Flask

app = Flask(__name__)

@app.route("/menu")
def menu():
    items = ["Masala Chai", "Samosa", "Bun Maska"]
    page = "Today: " + ", ".join(items)
    return page

c = app.test_client()
r = c.get("/menu")
print(r.status_code)`,
    lesson: "A view must return its response. A 500 error means your code crashed: check the server's log for the real error."
  },
  explain: "Explain what <code>@app.route(\"/hello/&lt;name&gt;\")</code> does, step by step, when someone visits <code>/hello/Asha</code>.",
  cards: [
    { q: "What does a Flask view function send back to the browser?", options: ["What it prints", "What it returns", "Nothing", "Its name"], answer: 1 },
    { q: "<code>/square/&lt;int:n&gt;</code> with <code>/square/abc</code> gives…", options: ["0", "An error 500", "404 Not Found", "abc"], answer: 2 },
    { q: "Should a live website run with <code>debug=True</code>?", options: ["Yes, always", "No, it lets visitors run code on your server", "Only on Fridays", "Only with HTTPS"], answer: 1 }
  ],
  skills: { web: 5, python: 2, test: 1, talk: 2 }
},
/* ───────────────────────────── 5-5 ───────────────────────────── */
{
  id: "5-5", world: 5, n: 5, title: "Speaking JSON", concept: "JSON APIs, status codes, query args",
  learn: [
    { h: "Return a dictionary, get JSON",
      p: "APIs answer with JSON. In Flask, return a dictionary or a list and it's sent as JSON automatically. <code>jsonify()</code> does the same thing explicitly. On the client side, <code>.get_json()</code> turns the answer back into Python.",
      code: `from flask import Flask

app = Flask(__name__)

@app.route("/api/status")
def status():
    return {"ok": True, "version": 1}

c = app.test_client()
r = c.get("/api/status")
print(r.status_code, r.get_json())` },
    { h: "Choose the status code",
      p: "Return a tuple <code>(body, status)</code> to set the status code yourself. When something isn't found, say so with 404 and a clear error message. Clients rely on the status code, so sending an error with 200 would mislead them.",
      code: `from flask import Flask

app = Flask(__name__)
STOCK = {"chai": 30, "samosa": 0}

@app.route("/api/stock/<item>")
def stock(item):
    if item not in STOCK:
        return {"error": f"no item called {item}"}, 404
    return {"item": item, "left": STOCK[item]}

c = app.test_client()
for item in ["chai", "dosa"]:
    r = c.get(f"/api/stock/{item}")
    print(r.status_code, r.get_json())` },
    { h: "Read the query string",
      p: "<code>request.args</code> holds the query string as a dictionary-like object. <code>request.args.get(\"max_price\", type=int)</code> reads a value and converts it, giving <code>None</code> if it's missing or not a number.",
      code: `from flask import Flask, request

app = Flask(__name__)
PRICES = {"chai": 20, "samosa": 15, "roll": 60}

@app.route("/api/cheap")
def cheap():
    limit = request.args.get("max", type=int)
    if limit is None:
        return {"error": "add ?max=NUMBER"}, 400
    return [name for name, p in PRICES.items() if p <= limit]

c = app.test_client()
print(c.get("/api/cheap?max=20").get_json())
print(c.get("/api/cheap").status_code)` },
    { h: "Design clean API paths",
      p: "Good APIs are predictable: nouns in the path, plural names, ids for single items, and the query string for filters. <code>GET /api/menu</code> lists, <code>GET /api/menu/3</code> gets one, <code>GET /api/menu?veg=true</code> filters.",
      lang: "text", file: "a predictable API",
      code: `GET /api/menu              all items
GET /api/menu?veg=true     only vegetarian items
GET /api/menu?max_price=30 items costing 30 or less
GET /api/menu/3            item 3 (or 404)` }
  ],
  think: [
    { type: "mcq", q: "An item isn't found. Which return is best?", options: ["return {\"error\": \"not found\"}", "return {\"error\": \"not found\"}, 404", "return None", "raise Exception(\"not found\")"], answer: 1,
      why: "The body explains the problem and the 404 tells programs what happened. The first option would say 200 OK, which is misleading. None and an uncaught exception both become a 500." },
    { type: "predict", q: "What does this print?", code: `from flask import Flask, request
app = Flask(__name__)

@app.route("/api/add")
def add():
    a = request.args.get("a", type=int)
    b = request.args.get("b", 0, type=int)
    if a is None:
        return {"error": "a is required"}, 400
    return {"sum": a + b}

c = app.test_client()
print(c.get("/api/add?a=5&b=7").get_json())
print(c.get("/api/add?a=5").get_json())
print(c.get("/api/add?b=2").status_code)`, answer: "{'sum': 12}\n{'sum': 5}\n400",
      why: "b has a default of 0, so leaving it out is fine. a has no default, so it's None when missing, and the route answers 400." },
    { type: "mcq", q: "Which path is the most RESTful way to get product 42?", options: ["/getProduct?id=42", "/api/products/42", "/api/product-42-get", "/api/42/products/get"], answer: 1,
      why: "A plural noun for the collection, then the id. The method (GET) already says what you're doing, so verbs don't belong in the path." }
  ],
  code: {
    brief: "Build the chai stall's menu API. <code>MENU</code> is given in the starter.<br>• <code>GET /api/menu</code> returns the list of all items as JSON.<br>• It also accepts filters: <code>?veg=true</code> keeps only vegetarian items, and <code>?max_price=30</code> keeps items costing 30 or less. Both can be used together. If <code>max_price</code> isn't a whole number, return <code>{\"error\": \"max_price must be a number\"}</code> with status 400.<br>• <code>GET /api/menu/&lt;int:item_id&gt;</code> returns one item, or <code>{\"error\": \"not found\"}</code> with status 404.",
    sample: "GET /api/menu?veg=true&max_price=20\n200 [{\"id\": 1, \"name\": \"Masala Chai\", \"price\": 20, \"veg\": true}, {\"id\": 2, ...}]\nGET /api/menu/9\n404 {\"error\": \"not found\"}",
    starter: `from flask import Flask, request

app = Flask(__name__)

` + W5_MENU + `


# Your routes here
`,
    tests: [
      { setup: "c = app.test_client()", call: "[i['id'] for i in c.get('/api/menu').get_json()]", expect: "[1, 2, 3, 4]", label: "GET <code>/api/menu</code>" },
      { setup: "c = app.test_client()", call: "[i['id'] for i in c.get('/api/menu?veg=true').get_json()]", expect: "[1, 2, 4]", label: "GET <code>?veg=true</code>" },
      { setup: "c = app.test_client()", call: "[i['id'] for i in c.get('/api/menu?max_price=30').get_json()]", expect: "[1, 2, 4]", label: "GET <code>?max_price=30</code>" },
      { setup: "c = app.test_client()", call: "[i['id'] for i in c.get('/api/menu?veg=true&max_price=20').get_json()]", expect: "[1, 2]", label: "Both filters together" },
      { setup: "c = app.test_client()\nr = c.get('/api/menu?max_price=cheap')", call: "(r.status_code, r.get_json())", expect: "(400, {'error': 'max_price must be a number'})", label: "A bad max_price gives 400" },
      { setup: "c = app.test_client()", call: "c.get('/api/menu/3').get_json()['name']", expect: "'Chicken Roll'", label: "GET <code>/api/menu/3</code>" },
      { setup: "c = app.test_client()\nr = c.get('/api/menu/9')", call: "(r.status_code, r.get_json())", expect: "(404, {'error': 'not found'})", label: "A missing item gives 404" }
    ],
    hints: [
      "Two routes. In the list route, start with <code>items = MENU</code> and narrow it down with each filter that's present.",
      "<code>if request.args.get(\"veg\") == \"true\":</code> keep items where <code>i[\"veg\"]</code>. For max_price: <code>if \"max_price\" in request.args:</code>, convert with <code>request.args.get(\"max_price\", type=int)</code>, and if that's None return the 400.",
      "The single-item route loops over MENU looking for <code>i[\"id\"] == item_id</code>, and returns <code>{\"error\": \"not found\"}, 404</code> after the loop."
    ],
    solution: `from flask import Flask, request

app = Flask(__name__)

` + W5_MENU + `


@app.route("/api/menu")
def menu():
    items = MENU
    if request.args.get("veg") == "true":
        items = [i for i in items if i["veg"]]
    if "max_price" in request.args:
        limit = request.args.get("max_price", type=int)
        if limit is None:
            return {"error": "max_price must be a number"}, 400
        items = [i for i in items if i["price"] <= limit]
    return items


@app.route("/api/menu/<int:item_id>")
def menu_item(item_id):
    for i in MENU:
        if i["id"] == item_id:
            return i
    return {"error": "not found"}, 404`,
    wrong: [{ code: `from flask import Flask, request

app = Flask(__name__)

` + W5_MENU + `

@app.route("/api/menu")
def menu():
    items = MENU
    if request.args.get("veg") == "true":
        items = [i for i in items if i["veg"]]
    limit = request.args.get("max_price", type=int)
    if limit:
        items = [i for i in items if i["price"] <= limit]
    return items

@app.route("/api/menu/<int:item_id>")
def menu_item(item_id):
    for i in MENU:
        if i["id"] == item_id:
            return i
    return {"error": "not found"}`, why: "bad max_price ignored; 404 sent as 200" }]
  },
  bug: {
    brief: "The mobile app thinks every missing user exists, because this API says <b>200 OK</b> even when it can't find them. Make missing users return status 404.",
    code: `from flask import Flask

app = Flask(__name__)
USERS = {1: "Asha", 2: "Ravi"}

@app.route("/api/users/<int:uid>")
def user(uid):
    if uid not in USERS:
        return {"error": "user not found"}
    return {"id": uid, "name": USERS[uid]}`,
    tests: [{ setup: "c = app.test_client()", call: "c.get('/api/users/1').get_json()", expect: "{'id': 1, 'name': 'Asha'}" }, { setup: "c = app.test_client()\nr = c.get('/api/users/7')", call: "(r.status_code, r.get_json())", expect: "(404, {'error': 'user not found'})" }],
    hints: ["Return a tuple: the body, then the status code."],
    fix: `from flask import Flask

app = Flask(__name__)
USERS = {1: "Asha", 2: "Ravi"}

@app.route("/api/users/<int:uid>")
def user(uid):
    if uid not in USERS:
        return {"error": "user not found"}, 404
    return {"id": uid, "name": USERS[uid]}`,
    lesson: "Programs read status codes, not your error text. An error with 200 tells them everything went fine."
  },
  explain: "Describe your menu API to a front-end developer who will use it: the paths, the filters, and what happens on errors.",
  cards: [
    { q: "How do you send a 404 from a Flask view?", options: ["return 404", "return body, 404", "print(404)", "raise 404"], answer: 1 },
    { q: "What does <code>request.args.get(\"n\", type=int)</code> give for <code>?n=abc</code>?", options: ["0", "\"abc\"", "None", "An error 500"], answer: 2 },
    { q: "In Flask, returning a dictionary sends…", options: ["HTML", "JSON", "Plain text", "Nothing"], answer: 1 }
  ],
  skills: { web: 5, python: 2, logic: 2, talk: 2 }
},
/* ───────────────────────────── 5-6 ───────────────────────────── */
{
  id: "5-6", world: 5, n: 6, title: "Taking Orders", concept: "POST, validation, 201 and 400",
  learn: [
    { h: "Routes answer GET unless you say otherwise",
      p: "By default a route only answers GET. Add <code>methods=[\"POST\"]</code> to accept POST requests. If a client uses a method you didn't list, Flask answers <b>405 Method Not Allowed</b> by itself.",
      code: `from flask import Flask

app = Flask(__name__)

@app.route("/api/ping", methods=["GET", "POST"])
def ping():
    return {"pong": True}

@app.route("/api/only-get")
def only_get():
    return {"ok": True}

c = app.test_client()
print(c.post("/api/ping").status_code)
print(c.post("/api/only-get").status_code)` },
    { h: "Read the JSON body",
      p: "A POST usually carries data in its body. <code>request.get_json(silent=True)</code> parses a JSON body into Python, or gives <code>None</code> if there isn't valid JSON. In tests, send a body with <code>c.post(path, json={...})</code>.",
      code: `from flask import Flask, request

app = Flask(__name__)

@app.route("/api/echo", methods=["POST"])
def echo():
    data = request.get_json(silent=True)
    return {"you_sent": data}

c = app.test_client()
print(c.post("/api/echo", json={"item": "chai", "qty": 2}).get_json())` },
    { h: "Validate everything, then answer 201",
      p: "Check every field the client sends: is it there, is it the right type, is it in range? If not, answer <b>400</b> with a clear message. If it's fine, store it and answer <b>201 Created</b> with the new thing, including its new id.",
      code: `from flask import Flask, request

app = Flask(__name__)
NOTES = []

@app.route("/api/notes", methods=["POST"])
def add_note():
    data = request.get_json(silent=True) or {}
    text = data.get("text")
    if not isinstance(text, str) or not text.strip():
        return {"error": "text is required"}, 400
    note = {"id": len(NOTES) + 1, "text": text.strip()}
    NOTES.append(note)
    return note, 201

c = app.test_client()
print(c.post("/api/notes", json={"text": "  buy milk "}).get_json())
r = c.post("/api/notes", json={"txt": "oops"})
print(r.status_code, r.get_json())` },
    { h: "isinstance checks types",
      p: "JSON can hold any type, so a client could send <code>\"qty\": \"lots\"</code>. <code>isinstance(value, int)</code> checks the type. One catch: in Python, True counts as an int, so rule it out explicitly when it matters.",
      code: `for qty in [3, "3", 2.5, True]:
    ok = isinstance(qty, int) and not isinstance(qty, bool)
    print(repr(qty), "is a whole number:", ok)` }
  ],
  think: [
    { type: "mcq", q: "You POST to a route defined as <code>@app.route(\"/api/orders\")</code>. What status do you get?", options: ["200", "201", "404", "405"], answer: 3,
      why: "Without <code>methods=[\"POST\"]</code>, the route only answers GET. The path exists, so it's not 404: it's 405 Method Not Allowed." },
    { type: "multi", q: "A client posts <code>{\"item\": \"chai\", \"qty\": ...}</code>. Which qty values should the server reject with 400?", options: ["\"2\"", "0", "5", "-3", "2.5"], answer: [0, 1, 3, 4],
      why: "Only a whole number in the allowed range is fine. Text, zero, negatives and decimals all get a 400." },
    { type: "order", q: "Put the steps of handling a POST in order.", lines: ["Read the JSON body", "Check every field and return 400 if something is wrong", "Create and store the new record with a new id", "Return the record with status 201"],
      why: "Validate before you store anything. Bad data that gets saved is much harder to clean up later." }
  ],
  code: {
    brief: "Let customers place orders. The starter has <code>MENU</code> and an empty <code>ORDERS</code> list.<br>• <code>POST /api/orders</code> takes JSON like <code>{\"item_id\": 1, \"qty\": 2}</code>.<br>&nbsp;&nbsp;– If <code>item_id</code> isn't on the menu: <code>{\"error\": \"unknown item\"}</code>, status 400.<br>&nbsp;&nbsp;– If <code>qty</code> isn't a whole number from 1 to 20: <code>{\"error\": \"qty must be 1 to 20\"}</code>, status 400.<br>&nbsp;&nbsp;– Otherwise store and return <code>{\"id\": 1, \"item\": \"Masala Chai\", \"qty\": 2, \"total\": 40}</code> with status 201. Ids count up from 1.<br>• <code>GET /api/orders</code> returns the list of all orders.",
    sample: "POST /api/orders {\"item_id\": 1, \"qty\": 2}\n201 {\"id\": 1, \"item\": \"Masala Chai\", \"qty\": 2, \"total\": 40}\nPOST /api/orders {\"item_id\": 1, \"qty\": 0}\n400 {\"error\": \"qty must be 1 to 20\"}",
    starter: `from flask import Flask, request

app = Flask(__name__)

` + W5_MENU + `
ORDERS = []


# Your routes here
`,
    tests: [
      { setup: "c = app.test_client()\nr = c.post('/api/orders', json={'item_id': 1, 'qty': 2})", call: "(r.status_code, r.get_json())", expect: "(201, {'id': 1, 'item': 'Masala Chai', 'qty': 2, 'total': 40})", label: "A good order gives 201" },
      { setup: "c = app.test_client()\nc.post('/api/orders', json={'item_id': 1, 'qty': 2})\nr = c.post('/api/orders', json={'item_id': 3, 'qty': 1})", call: "r.get_json()", expect: "{'id': 2, 'item': 'Chicken Roll', 'qty': 1, 'total': 60}", label: "The second order gets id 2" },
      { setup: "c = app.test_client()\nc.post('/api/orders', json={'item_id': 2, 'qty': 4})", call: "c.get('/api/orders').get_json()", expect: "[{'id': 1, 'item': 'Samosa', 'qty': 4, 'total': 60}]", label: "GET lists the orders" },
      { setup: "c = app.test_client()\nr = c.post('/api/orders', json={'item_id': 99, 'qty': 1})", call: "(r.status_code, r.get_json())", expect: "(400, {'error': 'unknown item'})", label: "Unknown item" },
      { setup: "c = app.test_client()", call: "[c.post('/api/orders', json={'item_id': 1, 'qty': q}).status_code for q in [0, 21, -1, '2', 2.5]]", expect: "[400, 400, 400, 400, 400]", label: "Bad quantities: 0, 21, -1, \"2\", 2.5" },
      { setup: "c = app.test_client()", call: "[c.post('/api/orders', json={'item_id': 4, 'qty': q}).status_code for q in [1, 20]]", expect: "[201, 201]", label: "Quantities 1 and 20 are allowed" },
      { setup: "c = app.test_client()\nr = c.post('/api/orders', json={'qty': 1})", call: "r.status_code", expect: "400", label: "Missing item_id" },
      { setup: "c = app.test_client()\nc.post('/api/orders', json={'item_id': 1, 'qty': 0})", call: "c.get('/api/orders').get_json()", expect: "[]", label: "Rejected orders aren't stored" }
    ],
    must: [["methods\\s*=", "Accept POST with <code>methods=[\"POST\"]</code> (and GET for the list)."]],
    hints: [
      "One route can handle both: <code>@app.route(\"/api/orders\", methods=[\"GET\", \"POST\"])</code>, then <code>if request.method == \"GET\": return ORDERS</code>.",
      "For POST: <code>data = request.get_json(silent=True) or {}</code>. Find the menu item whose id is <code>data.get(\"item_id\")</code>; if there's none, return the unknown-item 400.",
      "Check qty with <code>isinstance(qty, int) and not isinstance(qty, bool) and 1 &lt;= qty &lt;= 20</code>. The new id is <code>len(ORDERS) + 1</code>."
    ],
    solution: `from flask import Flask, request

app = Flask(__name__)

` + W5_MENU + `
ORDERS = []


def find_item(item_id):
    for i in MENU:
        if i["id"] == item_id:
            return i
    return None


@app.route("/api/orders", methods=["GET", "POST"])
def orders():
    if request.method == "GET":
        return ORDERS
    data = request.get_json(silent=True) or {}
    item = find_item(data.get("item_id"))
    if item is None:
        return {"error": "unknown item"}, 400
    qty = data.get("qty")
    if not isinstance(qty, int) or isinstance(qty, bool) or not 1 <= qty <= 20:
        return {"error": "qty must be 1 to 20"}, 400
    order = {"id": len(ORDERS) + 1, "item": item["name"], "qty": qty, "total": qty * item["price"]}
    ORDERS.append(order)
    return order, 201`,
    wrong: [{ code: `from flask import Flask, request

app = Flask(__name__)

` + W5_MENU + `
ORDERS = []

@app.route("/api/orders", methods=["GET", "POST"])
def orders():
    if request.method == "GET":
        return ORDERS
    data = request.get_json()
    item = [i for i in MENU if i["id"] == data["item_id"]][0]
    qty = int(data["qty"])
    order = {"id": len(ORDERS) + 1, "item": item["name"], "qty": qty, "total": qty * item["price"]}
    ORDERS.append(order)
    return order, 201`, why: "no validation" }]
  },
  bug: {
    brief: "The feedback form posts to this route, but every submission gets <b>405 Method Not Allowed</b>. Fix the route so POST works, and keep GET working too.",
    code: `from flask import Flask, request

app = Flask(__name__)
FEEDBACK = []

@app.route("/api/feedback")
def feedback():
    if request.method == "POST":
        FEEDBACK.append(request.get_json(silent=True))
        return {"saved": True}, 201
    return FEEDBACK`,
    tests: [{ setup: "c = app.test_client()", call: "c.post('/api/feedback', json={'stars': 5}).status_code", expect: "201" }, { setup: "c = app.test_client()\nc.post('/api/feedback', json={'stars': 4})", call: "c.get('/api/feedback').get_json()", expect: "[{'stars': 4}]" }],
    hints: ["Routes answer only GET unless you list other methods in <code>methods=[...]</code>."],
    fix: `from flask import Flask, request

app = Flask(__name__)
FEEDBACK = []

@app.route("/api/feedback", methods=["GET", "POST"])
def feedback():
    if request.method == "POST":
        FEEDBACK.append(request.get_json(silent=True))
        return {"saved": True}, 201
    return FEEDBACK`,
    lesson: "405 means the address exists but doesn't accept that method. Check the route's <code>methods</code>."
  },
  explain: "Why should a server validate the data in a POST request before storing it? Give two things that could go wrong if it didn't.",
  cards: [
    { q: "Which status means \"I created the new thing\"?", options: ["200", "201", "204", "400"], answer: 1 },
    { q: "A route without <code>methods=</code> answers…", options: ["Every method", "Only GET", "Only POST", "Nothing"], answer: 1 },
    { q: "<code>request.get_json(silent=True)</code> gives what for a body that isn't JSON?", options: ["{}", "None", "An error 500", "The raw text"], answer: 1 }
  ],
  skills: { web: 5, python: 2, logic: 2, debug: 1, talk: 2 }
},
/* ───────────────────────────── 5-7 ───────────────────────────── */
{
  id: "5-7", world: 5, n: 7, title: "Guarding the Gates", concept: "XSS, escaping, secrets in env vars",
  learn: [
    { h: "Cross-site scripting (XSS)",
      p: "If you put user input straight into HTML, a user can type HTML of their own, including <code>&lt;script&gt;</code> tags that run in other visitors' browsers and steal their accounts. This is <b>XSS</b>, one of the most common web attacks. Watch what a \"comment\" can do to a page.",
      code: `comment = '<script>steal(document.cookie)</script>Nice chai!'
page = f"<li>{comment}</li>"
print(page)   # a browser would RUN that script` },
    { h: "Escape before you insert",
      p: "<code>html.escape()</code> turns special characters into safe codes: <code>&lt;</code> becomes <code>&amp;lt;</code>, so the browser shows the text instead of running it. Escape every piece of user text you put into HTML. Real Flask apps use templates (Jinja), which do this automatically.",
      code: `import html

comment = '<script>steal(document.cookie)</script>Nice chai!'
safe = html.escape(comment)
print(f"<li>{safe}</li>")` },
    { h: "Keep secrets out of your code",
      p: "API keys, passwords and secret keys must never be written in your code, because code gets shared on GitHub. Read them from <b>environment variables</b> with <code>os.environ</code>, which are set on the server, not in the file. If a secret ever lands on GitHub, treat it as stolen: cancel it and make a new one.",
      code: `import os

key = os.environ.get("WEATHER_KEY")
if key is None:
    print("No key set. On your computer: set WEATHER_KEY=... in the terminal first.")
else:
    print("Key loaded, starting with", key[:3] + "...")` },
    { h: "Don't leak details in errors",
      p: "Error messages for users should be short and safe. Never show stack traces, database errors or secrets to visitors: log them on the server instead. Attackers read error messages carefully.",
      lang: "text", file: "good and bad error messages",
      code: `BAD:  sqlite3.OperationalError: no such column: pasword in SELECT * FROM users WHERE...
GOOD: {"error": "Something went wrong. Please try again."}   (details go to the server log)` }
  ],
  think: [
    { type: "mcq", q: "A user's name is shown on the page with <code>f\"&lt;h2&gt;{name}&lt;/h2&gt;\"</code>. What's the risk?", options: ["None, names are harmless", "A \"name\" containing HTML or a script would run in other people's browsers", "It will be too slow", "Names can't contain spaces"], answer: 1,
      why: "Any user-supplied text is a possible attack. Escape it with <code>html.escape(name)</code>." },
    { type: "predict", q: "What does this print?", code: `import html
print(html.escape('5 < 6 & "chai"'))`, answer: "5 &lt; 6 &amp; &quot;chai&quot;",
      why: "&lt; becomes &amp;lt;, &amp; becomes &amp;amp; and the double quotes become &amp;quot;. The browser shows these as the original characters, but never treats them as HTML." },
    { type: "multi", q: "Where is it safe to keep an API key?", options: ["In an environment variable on the server", "In a .env file listed in .gitignore", "In app.py, committed to a public repo", "In the HTML page"], answer: [0, 1],
      why: "Secrets live outside the code: environment variables, or a local .env file that git ignores. Anything in a repo or a page is public." }
  ],
  code: {
    brief: "Make the comments wall safe.<br>• <code>render_comments(comments)</code> takes a list of comment strings and returns an HTML string: <code>&lt;ul&gt;</code>, then one <code>&lt;li&gt;</code> per comment with the text <b>escaped</b>, then <code>&lt;/ul&gt;</code>, all on one line with no spaces between tags. An empty list gives <code>&lt;p&gt;No comments yet.&lt;/p&gt;</code>.<br>• <code>get_api_key()</code> returns the value of the environment variable <code>WEATHER_KEY</code>. If it isn't set, raise <code>RuntimeError(\"WEATHER_KEY is not set\")</code>.",
    sample: ">>> render_comments([\"Nice!\", \"<b>wow</b>\"])\n'<ul><li>Nice!</li><li>&lt;b&gt;wow&lt;/b&gt;</li></ul>'",
    starter: `import html
import os


def render_comments(comments):
    pass


def get_api_key():
    pass
`,
    tests: [
      { call: "render_comments(['Nice chai!', 'Too sweet'])", expect: "'<ul><li>Nice chai!</li><li>Too sweet</li></ul>'", silent: true },
      { call: "render_comments(['<script>alert(1)</script>'])", expect: "'<ul><li>&lt;script&gt;alert(1)&lt;/script&gt;</li></ul>'", label: "A script is escaped" },
      { call: "render_comments(['Tom & \"Jerry\"'])", expect: "'<ul><li>Tom &amp; &quot;Jerry&quot;</li></ul>'", label: "Quotes and &amp; are escaped" },
      { call: "render_comments([])", expect: "'<p>No comments yet.</p>'" },
      { env: { WEATHER_KEY: "abc123" }, call: "get_api_key()", expect: "'abc123'", label: "Reads the key from the environment" },
      { env: { WEATHER_KEY: "zzz999" }, call: "get_api_key()", expect: "'zzz999'", label: "Works with any key" },
      { call: "get_api_key()", raises: "RuntimeError", raisesMsg: "WEATHER_KEY", label: "Raises when the key is missing" }
    ],
    mustNot: [["abc123|zzz999", "Never write the key in your code. Read it from <code>os.environ</code>."]],
    mustNotAll: true,
    hints: [
      "<code>render_comments</code>: if the list is empty return the paragraph. Otherwise build <code>\"&lt;ul&gt;\"</code> + one <code>f\"&lt;li&gt;{html.escape(c)}&lt;/li&gt;\"</code> per comment + <code>\"&lt;/ul&gt;\"</code>.",
      "<code>\"\".join([...])</code> glues the list items together with nothing between them.",
      "<code>get_api_key</code>: <code>key = os.environ.get(\"WEATHER_KEY\")</code>, then <code>if key is None: raise RuntimeError(\"WEATHER_KEY is not set\")</code>."
    ],
    solution: `import html
import os


def render_comments(comments):
    if not comments:
        return "<p>No comments yet.</p>"
    items = "".join(f"<li>{html.escape(c)}</li>" for c in comments)
    return f"<ul>{items}</ul>"


def get_api_key():
    key = os.environ.get("WEATHER_KEY")
    if key is None:
        raise RuntimeError("WEATHER_KEY is not set")
    return key`,
    wrong: [{ code: `import os

def render_comments(comments):
    if not comments:
        return "<p>No comments yet.</p>"
    return "<ul>" + "".join(f"<li>{c}</li>" for c in comments) + "</ul>"

def get_api_key():
    return os.environ["WEATHER_KEY"]`, why: "no escaping; KeyError instead of RuntimeError" }]
  },
  bug: {
    brief: "<b>Security review.</b> The search page repeats what the user searched for. Someone searched for <code>&lt;script&gt;</code>…, and it ran on everyone's screen. Escape the search text before putting it in the page.",
    code: `from flask import Flask, request

app = Flask(__name__)

@app.route("/search")
def search():
    q = request.args.get("q", "")
    return f"<h1>Results for {q}</h1><p>No snacks found.</p>"`,
    tests: [
      { setup: "c = app.test_client()", call: "c.get('/search?q=chai').get_data(as_text=True)", expect: "'<h1>Results for chai</h1><p>No snacks found.</p>'" },
      { setup: "c = app.test_client()", call: "'<script>' in c.get('/search?q=<script>alert(1)</script>').get_data(as_text=True)", expect: "False", label: "A script can't get into the page" }
    ],
    hints: ["<code>import html</code>, then use <code>html.escape(q)</code> inside the f-string."],
    fix: `import html
from flask import Flask, request

app = Flask(__name__)

@app.route("/search")
def search():
    q = request.args.get("q", "")
    return f"<h1>Results for {html.escape(q)}</h1><p>No snacks found.</p>"`,
    lesson: "Any text that came from a user must be escaped before it goes into HTML. Templates in real Flask apps do this for you."
  },
  explain: "Explain XSS and how escaping prevents it. Then explain why API keys belong in environment variables, not in code.",
  cards: [
    { q: "What does <code>html.escape(\"&lt;b&gt;\")</code> return?", options: ["<b>", "&lt;b&gt;", "b", "An error"], answer: 1 },
    { q: "You accidentally pushed an API key to GitHub. First step?", options: ["Delete the file", "Cancel (rotate) the key and make a new one", "Make the repo private", "Nothing"], answer: 1 },
    { q: "XSS happens when…", options: ["A database is slow", "User input is put into HTML without escaping", "A password is too short", "You use POST"], answer: 1 }
  ],
  skills: { web: 4, python: 2, debug: 2, talk: 3 }
},
/* ───────────────────────────── 5-8 BOSS ───────────────────────────── */
{
  id: "5-8", world: 5, n: 8, boss: true, title: "The Guestbook", concept: "Boss: a full web app with a database",
  learn: [
    { h: "Boss rules",
      p: "Build a real web app: a guestbook where visitors leave messages. It has a JSON API, stores messages in SQLite, and shows them on an HTML page, safely escaped. This is the same shape as most web apps companies build: routes, validation, a database and HTML. Plan the routes first.",
      lang: "text",
      code: `guestbook.db: entries(id INTEGER PRIMARY KEY, name TEXT, message TEXT)

GET    /                   HTML page listing messages, newest first
GET    /api/entries        JSON list, newest first
POST   /api/entries        add one   -> 201, or 400 if invalid
DELETE /api/entries/<id>   remove    -> 204, or 404` },
    { h: "One small helper for the database",
      p: "Every route needs a connection. A helper that connects and creates the table if needed keeps routes short. Turning rows into dictionaries makes them easy to return as JSON.",
      code: `import sqlite3

def get_db():
    conn = sqlite3.connect(":memory:")
    conn.execute("CREATE TABLE IF NOT EXISTS entries (id INTEGER PRIMARY KEY, name TEXT, message TEXT)")
    return conn

conn = get_db()
conn.execute("INSERT INTO entries (name, message) VALUES (?, ?)", ("Asha", "Hello!"))
rows = conn.execute("SELECT id, name, message FROM entries ORDER BY id DESC").fetchall()
print([{"id": r[0], "name": r[1], "message": r[2]} for r in rows])` },
    { h: "204 No Content",
      p: "After a successful DELETE there's nothing left to send back. Status <b>204 No Content</b> says \"done, and the body is empty\": return <code>\"\", 204</code>.",
      code: `from flask import Flask

app = Flask(__name__)
ITEMS = {1: "chai"}

@app.route("/api/items/<int:item_id>", methods=["DELETE"])
def delete_item(item_id):
    if item_id not in ITEMS:
        return {"error": "not found"}, 404
    del ITEMS[item_id]
    return "", 204

c = app.test_client()
print(c.delete("/api/items/1").status_code, c.delete("/api/items/1").status_code)` }
  ],
  think: [
    { type: "match", q: "Match each request with the status your guestbook should send.", pairs: [["POST a valid message", "201"], ["POST with an empty name", "400"], ["DELETE a message that exists", "204"], ["DELETE a message that doesn't exist", "404"], ["GET /api/entries", "200"]],
      why: "Each outcome has a standard code, so any client can understand your API without reading your code." },
    { type: "mcq", q: "Where must the HTML page escape text?", options: ["Nowhere, it's from our database", "Every name and message, because users wrote them", "Only messages longer than 140 characters", "Only on DELETE"], answer: 1,
      why: "Data in your database still came from users. Escape it every time it goes into HTML." },
    { type: "order", q: "Put the POST /api/entries steps in order.", lines: ["Read the JSON body", "Check the name and message, or return 400", "INSERT with ? placeholders and commit", "Return the new entry with 201"],
      why: "Validate, store safely, then confirm. The same four steps as Taking Orders, now with a real database." }
  ],
  code: {
    brief: "Build the guestbook app named <code>app</code>, storing entries in <code>guestbook.db</code> (table <code>entries(id, name, message)</code>, created if missing).<br>• <code>POST /api/entries</code> with JSON <code>{\"name\": \"Asha\", \"message\": \"Hi!\"}</code>. Strip spaces from both. If the name is empty, or the message is empty or longer than 140 characters, return <code>{\"error\": \"name and message (1-140 chars) are required\"}</code> with 400. Otherwise save it and return <code>{\"id\": 1, \"name\": \"Asha\", \"message\": \"Hi!\"}</code> with 201.<br>• <code>GET /api/entries</code> returns all entries as a list of those dictionaries, newest (highest id) first.<br>• <code>DELETE /api/entries/&lt;int:entry_id&gt;</code> returns <code>\"\"</code> with 204, or <code>{\"error\": \"not found\"}</code> with 404.<br>• <code>GET /</code> returns an HTML page: <code>&lt;h1&gt;Guestbook&lt;/h1&gt;</code> followed by one <code>&lt;p&gt;&lt;b&gt;NAME&lt;/b&gt;: MESSAGE&lt;/p&gt;</code> per entry, newest first, with name and message escaped. If there are none: <code>&lt;h1&gt;Guestbook&lt;/h1&gt;&lt;p&gt;Be the first to sign!&lt;/p&gt;</code>.",
    sample: "POST /api/entries {\"name\": \" Asha \", \"message\": \"Hi!\"}\n201 {\"id\": 1, \"name\": \"Asha\", \"message\": \"Hi!\"}\nGET /\n<h1>Guestbook</h1><p><b>Asha</b>: Hi!</p>",
    starter: `import html
import sqlite3
from flask import Flask, request

app = Flask(__name__)
DB = "guestbook.db"


def get_db():
    conn = sqlite3.connect(DB)
    conn.execute("CREATE TABLE IF NOT EXISTS entries (id INTEGER PRIMARY KEY, name TEXT, message TEXT)")
    return conn


# Your routes here


if __name__ == "__main__":
    app.run(debug=True)
`,
    tests: [
      { setup: "c = app.test_client()\nr = c.post('/api/entries', json={'name': ' Asha ', 'message': 'Hi!'})", call: "(r.status_code, r.get_json())", expect: "(201, {'id': 1, 'name': 'Asha', 'message': 'Hi!'})", label: "A good entry gives 201" },
      { setup: "c = app.test_client()\nc.post('/api/entries', json={'name': 'Asha', 'message': 'First'})\nc.post('/api/entries', json={'name': 'Ravi', 'message': 'Second'})", call: "c.get('/api/entries').get_json()", expect: "[{'id': 2, 'name': 'Ravi', 'message': 'Second'}, {'id': 1, 'name': 'Asha', 'message': 'First'}]", label: "GET lists newest first" },
      { setup: "c = app.test_client()", call: "[c.post('/api/entries', json=j).status_code for j in [{'name': '', 'message': 'x'}, {'name': 'A', 'message': '   '}, {'name': 'A', 'message': 'x' * 141}, {'message': 'x'}, {}]]", expect: "[400, 400, 400, 400, 400]", label: "Invalid entries give 400" },
      { setup: "c = app.test_client()", call: "c.post('/api/entries', json={'name': 'A', 'message': 'x' * 140}).status_code", expect: "201", label: "140 characters is allowed" },
      { setup: "c = app.test_client()\nc.post('/api/entries', json={'name': 'Asha', 'message': 'Hi'})", call: "[c.delete('/api/entries/1').status_code, c.delete('/api/entries/1').status_code, len(c.get('/api/entries').get_json())]", expect: "[204, 404, 0]", label: "DELETE removes, then 404" },
      { setup: "c = app.test_client()\nc.post('/api/entries', json={'name': 'Asha', 'message': 'Hi'})\nc.post('/api/entries', json={'name': '<i>Om</i>', 'message': '<script>x()</script>'})", call: "c.get('/').get_data(as_text=True)", expect: "'<h1>Guestbook</h1><p><b>&lt;i&gt;Om&lt;/i&gt;</b>: &lt;script&gt;x()&lt;/script&gt;</p><p><b>Asha</b>: Hi</p>'", label: "The page is escaped, newest first" },
      { setup: "c = app.test_client()", call: "c.get('/').get_data(as_text=True)", expect: "'<h1>Guestbook</h1><p>Be the first to sign!</p>'", label: "The empty page" },
      { setup: "c = app.test_client()\nc.post('/api/entries', json={'name': 'Asha', 'message': 'Saved?'})", call: "1", expect: "1", dbCheck: { file: "guestbook.db", sql: "SELECT name, message FROM entries", rows: [["Asha", "Saved?"]], msg: "The entry isn't saved in guestbook.db. Did you <code>commit()</code>?" }, label: "Entries are really saved in the database" }
    ],
    must: [["\\?", "Use <code>?</code> placeholders in your SQL."], ["html\\.escape", "Escape names and messages with <code>html.escape()</code>."]],
    mustNot: [["execute\\(\\s*f[\"']", "Don't build SQL with f-strings. Use <code>?</code> placeholders."]],
    mustNotAll: true,
    hints: [
      "Start with POST and GET /api/entries, test them, then DELETE, then the HTML page. Write a helper <code>all_entries()</code> that returns the list newest first, and use it in two routes.",
      "POST: <code>data = request.get_json(silent=True) or {}</code>, <code>name = str(data.get(\"name\", \"\")).strip()</code>. After the INSERT and <code>commit()</code>, <code>cur.lastrowid</code> is the new id.",
      "DELETE: run the DELETE, and check <code>cur.rowcount</code>: 0 means nothing was deleted, so return 404. The page: <code>\"&lt;h1&gt;Guestbook&lt;/h1&gt;\" + \"\".join(f\"&lt;p&gt;&lt;b&gt;{html.escape(e['name'])}&lt;/b&gt;: {html.escape(e['message'])}&lt;/p&gt;\" for e in entries)</code>."
    ],
    solution: `import html
import sqlite3
from flask import Flask, request

app = Flask(__name__)
DB = "guestbook.db"


def get_db():
    conn = sqlite3.connect(DB)
    conn.execute("CREATE TABLE IF NOT EXISTS entries (id INTEGER PRIMARY KEY, name TEXT, message TEXT)")
    return conn


def all_entries():
    conn = get_db()
    rows = conn.execute("SELECT id, name, message FROM entries ORDER BY id DESC").fetchall()
    conn.close()
    return [{"id": r[0], "name": r[1], "message": r[2]} for r in rows]


@app.route("/api/entries", methods=["GET", "POST"])
def entries():
    if request.method == "GET":
        return all_entries()
    data = request.get_json(silent=True) or {}
    name = str(data.get("name", "")).strip()
    message = str(data.get("message", "")).strip()
    if not name or not message or len(message) > 140:
        return {"error": "name and message (1-140 chars) are required"}, 400
    conn = get_db()
    cur = conn.execute("INSERT INTO entries (name, message) VALUES (?, ?)", (name, message))
    conn.commit()
    conn.close()
    return {"id": cur.lastrowid, "name": name, "message": message}, 201


@app.route("/api/entries/<int:entry_id>", methods=["DELETE"])
def delete_entry(entry_id):
    conn = get_db()
    cur = conn.execute("DELETE FROM entries WHERE id = ?", (entry_id,))
    conn.commit()
    conn.close()
    if cur.rowcount == 0:
        return {"error": "not found"}, 404
    return "", 204


@app.route("/")
def home():
    rows = all_entries()
    if not rows:
        return "<h1>Guestbook</h1><p>Be the first to sign!</p>"
    body = "".join(f"<p><b>{html.escape(e['name'])}</b>: {html.escape(e['message'])}</p>" for e in rows)
    return "<h1>Guestbook</h1>" + body


if __name__ == "__main__":
    app.run(debug=True)`,
    after: "You just built a full-stack web app. Take it home, run it with Flask, and put it online with PythonAnywhere (see Take it home)."
  },
  bug: {
    brief: "<b>AI code review.</b> The AI's delete route always answers 204, even for messages that never existed, so the app shows \"Deleted!\" for nothing. Make it return 404 when nothing was deleted.",
    db: { "guestbook.db": "CREATE TABLE entries (id INTEGER PRIMARY KEY, name TEXT, message TEXT); INSERT INTO entries (name, message) VALUES ('Asha', 'Hi');" },
    code: `# AI-written
import sqlite3
from flask import Flask

app = Flask(__name__)

@app.route("/api/entries/<int:entry_id>", methods=["DELETE"])
def delete_entry(entry_id):
    conn = sqlite3.connect("guestbook.db")
    conn.execute("DELETE FROM entries WHERE id = ?", (entry_id,))
    conn.commit()
    conn.close()
    return "", 204`,
    tests: [{ setup: "c = app.test_client()", call: "[c.delete('/api/entries/1').status_code, c.delete('/api/entries/1').status_code, c.delete('/api/entries/42').status_code]", expect: "[204, 404, 404]" }],
    hints: ["<code>execute()</code> returns a cursor, and <code>cursor.rowcount</code> says how many rows the DELETE removed."],
    fix: `import sqlite3
from flask import Flask

app = Flask(__name__)

@app.route("/api/entries/<int:entry_id>", methods=["DELETE"])
def delete_entry(entry_id):
    conn = sqlite3.connect("guestbook.db")
    cur = conn.execute("DELETE FROM entries WHERE id = ?", (entry_id,))
    conn.commit()
    conn.close()
    if cur.rowcount == 0:
        return {"error": "not found"}, 404
    return "", 204`,
    lesson: "Check what actually happened (rows changed, items found) before telling the client it worked."
  },
  explain: "Interview practice: walk through your guestbook's design: its routes and status codes, how data is stored, and the two security steps you took.",
  cards: [
    { q: "Status for a successful DELETE with no body?", options: ["200", "201", "204", "404"], answer: 2 },
    { q: "<code>cursor.rowcount</code> after a DELETE tells you…", options: ["The new id", "How many rows were removed", "The table size", "Nothing"], answer: 1 },
    { q: "Text from your own database going into HTML should be…", options: ["Trusted", "Escaped", "Encrypted", "Deleted"], answer: 1 }
  ],
  skills: { web: 5, python: 2, sql: 2, logic: 2, talk: 3, test: 1 },
  homeQuest: {
    title: "Take it home",
    intro: "This is where your work goes live on the internet. A link you can send a recruiter is worth more than any certificate.",
    tasks: [
      { t: "Install Flask and run your guestbook", d: "<code>pip install flask</code>, save the boss as <code>app.py</code>, run <code>python app.py</code>, and open <code>http://127.0.0.1:5000</code>.", skill: "web" },
      { t: "Add a real HTML form", d: "Add a form on the page that posts a new message, using what you learned in Forms and Style. Read it in Flask with <code>request.form</code>.", skill: "web" },
      { t: "Deploy it on PythonAnywhere (free)", d: "Free \"Beginner\" accounts keep your SQLite file. Follow their Flask guide, and don't call <code>app.run()</code> there. Free web apps must be renewed monthly.", skill: "web" },
      { t: "Write pytest tests with the test client", d: "Create <code>test_app.py</code> with at least 4 tests using <code>app.test_client()</code>, like the game's checker does.", skill: "test" },
      { t: "Push to GitHub with a live link in the README", d: "Add <code>guestbook.db</code> and any <code>.env</code> file to <code>.gitignore</code> first.", skill: "git" },
      { t: "Read the Flask Quickstart once, end to end", d: "flask.palletsprojects.com: you'll recognise almost everything now.", skill: "web" }
    ]
  }
}
);
