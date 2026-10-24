/* Key ideas for each level's Tavern Talk (Explain) question, and a sample answer to compare with.
   keys: [hint shown to the player, regex that spots the idea]. need: how many keys must show up
   (default: 60% of them, rounded up). The regexes are generous on purpose: they look for the idea in
   any reasonable wording, not for exact phrases. verify.js checks every sample answer passes and that
   gibberish, word lists and copied questions fail. */
const EXPLAIN = {
  /* ── World 1 ── */
  "1-1": {
    keys: [
      ["what the quotes do", /quote|string|text|\bstr\b|word|letters|characters/i],
      ["what Python does when there are no quotes", /math|calculat|add|sum|plus|number|integer|\bint\b|\b10\b/i]
    ],
    model: "print(\"5 + 5\") shows 5 + 5 exactly as written, because the quotes make it a string of text. print(5 + 5) has no quotes, so Python does the maths first and shows 10."
  },
  "1-2": {
    keys: [
      ["what = really means in Python", /stor|assign|save|put|set|keep|label|box|becomes|updat|replac|not.{0,20}equal|not the same as/i],
      ["which side Python works out first", /right side|right-hand|first|before|evaluat|works? out|calculat|old value|current value/i],
      ["what happens to the old value", /new|replac|overwrit|updat|becomes|increase|goes up|more than before|adds? 25/i]
    ],
    model: "In Python, = does not mean 'is equal to'. It means 'store this value'. Python first works out the right side, gold + 25, using the old value of gold, and then stores the answer back in gold, so the new value replaces the old one."
  },
  "1-3": {
    keys: [
      ["what the quotes make \"5\"", /string|text|\bstr\b|quote|word|character/i],
      ["what + does to two strings", /join|glue|stick|concaten|combin|together|side by side|next to|attach/i],
      ["what + does to two numbers", /add|sum|math|integer|\bint\b|plus/i]
    ],
    model: "With quotes, \"5\" is a string, which is text. Using + on two strings joins them side by side, so you get 55. Without quotes, 5 is a number, so + really adds them and gives 10."
  },
  "1-4": {
    keys: [
      ["what type input() always gives you", /string|text|\bstr\b|word|characters/i],
      ["what int() does", /int\(\)|\bint\b|convert|turn|change|integer|whole number/i],
      ["what you can do once it's a number", /math|calculat|add|compare|bigger|greater|less|subtract|plus|\+|>|</i]
    ],
    model: "input() always gives back text, even if the person types 16. int() converts that text into a whole number. Then we can do maths with the age or compare it, like checking if age >= 18."
  },
  "1-5": {
    keys: [
      ["what // gives (the whole hours)", /\/\/|floor|whole|integer division|divid|division|how many (full|whole|times)/i],
      ["what % gives (the leftover)", /%|remainder|left ?over|modul|remain/i],
      ["the actual numbers for 135 minutes", /\b2\b|\btwo\b|\b15\b|fifteen|\b60\b|sixty/i]
    ],
    model: "135 // 60 divides and keeps only the whole part, so it gives 2 hours. 135 % 60 gives the remainder, what is left over after taking out the full hours, which is 15. So 135 minutes is 2 hours and 15 minutes."
  },
  "1-6": {
    keys: [
      ["what happens at the exact limit", /includ|equal|exact|same as|or more|at least|also counts|on the line|boundary|edge/i],
      ["an example height", /\d{2,3}/]
    ],
    model: "With >= a person who is exactly the limit can ride, but with > they are turned away. If the rule is 120 cm and someone is exactly 120, height >= 120 is True but height > 120 is False. So the choice decides who is included at the edge."
  },
  "1-7": {
    keys: [
      ["what Python does after the first True check", /first|stop|only one|skip|the rest|once|the others|won't check|doesn't check|ignor/i],
      ["what goes wrong if the order is changed", /order|top|before|after|wrong|catch|bigger|higher|largest|lower|swap|reverse|>=/i],
      ["the grade example", /\d{2}|grade|score|mark/i]
    ],
    model: "Python checks the conditions from the top and stops at the first one that is True, skipping the rest. If score >= 50 came before score >= 90, a score of 95 would match the first check and get the lower grade. So the biggest limit has to come first."
  },
  "1-8": {
    need: 3,
    keys: [
      ["normal inputs", /normal|usual|typical|regular|valid|correct|good|happy|right/i],
      ["edge or boundary values", /edge|boundary|exact|limit|border|equal|just (above|below|over|under)|smallest|largest|minimum|maximum|zero|\b0\b/i],
      ["wrong or unexpected inputs", /wrong|bad|invalid|negative|letters|typo|empty|blank|mistake|error|unexpected|weird|crash/i],
      ["why you chose them", /because|so that|to (check|make sure|see|test|catch)|why|in case/i]
    ],
    model: "First I tried normal inputs, like a correct password, to see the happy path work. Then I tried edge values, such as an age exactly on the limit, because that is where > and >= mistakes hide. I also tried wrong inputs like a typo to make sure the gate stays closed."
  },

  /* ── World 2 ── */
  "2-1": {
    need: 3,
    keys: [
      ["which numbers range(1, 6) gives", /1\s*(,|to|-|through|and|until)\s*5|1 2 3 4 5|five numbers|up to 5/i],
      ["whether the stop number is included", /not includ|isn't includ|excluded|exclusive|stops? before|doesn't includ|does not includ|never reach|not reach|left out|leaves out|without 6|6 is not|6 isn't|one less|up to but/i],
      ["the range that gives 1 to 10", /range\(\s*1\s*,\s*11\s*\)|\b11\b|eleven/i],
      ["how you'd check the first and last numbers", /first|last|print|check|test|look|list\(/i]
    ],
    model: "range(1, 6) gives 1, 2, 3, 4, 5. The stop number 6 is not included, so it stops one before it. For 1 to 10 you need range(1, 11). To check, I print the numbers and look at the first and the last one."
  },
  "2-2": {
    keys: [
      ["when a for loop fits", /for[\s\S]{0,80}(know|each|every|list|range|fixed|number of times|how many|items|collection)|(know|each|every|list|range|fixed|how many)[\s\S]{0,80}\bfor\b/i],
      ["when a while loop fits", /while[\s\S]{0,80}(until|condition|don't know|do not know|unknown|true|keeps?|as long as|stop|correct|right|valid|quit)|(until|condition|don't know|as long as)[\s\S]{0,80}while/i],
      ["an example of each", /example|e\.g|like|such as|password|guess|game|menu|list|count|range|times/i]
    ],
    model: "I use a for loop when I know how many times to repeat or have a list to go through, like printing each item in a shopping list. I use a while loop when I don't know how many times, and it should keep going until a condition changes, like asking for a password until it is correct."
  },
  "2-3": {
    need: 3,
    keys: [
      ["the index of the first item", /\b0\b|zero/i],
      ["the index of the last item", /len|length|minus 1|- ?1|one less/i],
      ["what [-1] does", /end|back|last|from the right|negative|backwards/i],
      ["why [-1] is easier", /easier|shorter|simple|clean|less|don't need|no need|without|mistake|error|readab|any (size|length)|whatever/i]
    ],
    model: "The first item is at index 0, and the last is at len(backpack) - 1. backpack[-1] counts from the end, so it gives the last item. It is easier because it is shorter and you don't need to work out the length, so there is less chance of an off-by-one mistake."
  },
  "2-4": {
    need: 3,
    keys: [
      ["what you keep track of", /best|biggest|largest|highest|max|smallest|so far|current/i],
      ["how each item is compared", /compar|each|every|loop|go through|check|replac|update|bigger than|greater|\bif\b/i],
      ["why starting at 0 can go wrong", /negative|minus|below zero|less than (0|zero)|not in the list|not a real|isn't in|never|wrong|lower than (0|zero)|empty/i]
    ],
    model: "Keep a variable for the best value seen so far. Go through each item, compare it with the best, and if it is bigger, replace the best. Start with the first item, because if every number is negative, a start of 0 would wrongly win even though 0 is not in the list."
  },
  "2-5": {
    need: 3,
    keys: [
      ["what print does", /show|screen|display|see|output|prints? (it|out|to)/i],
      ["what return does", /back|give|hand|send|caller|called|use (it|the value)|store|variable|result/i],
      ["why it matters for testing", /test|check|assert|compare|reuse|later|other code|another function/i]
    ],
    model: "print only shows a value on the screen for a person to read. return hands the value back to the code that called the function, so it can be stored in a variable and used later. Tests need return, because a test can only check a value it gets back."
  },
  "2-6": {
    need: 3,
    keys: [
      ["testing or fixing one piece at a time", /test|debug|fix|find (the )?(bug|problem|mistake)|check/i],
      ["reusing code instead of repeating it", /reuse|re-use|again|repeat|duplicat|copy|many places|more than once|other programs|share/i],
      ["reading and understanding the program", /read|understand|clear|name|organi[sz]|simple|small|focus|one (job|thing|task)/i],
      ["the password checker example", /password|has_digit|digit|upper|length|strong/i]
    ],
    model: "Small functions each do one job, so the program is easier to read. In the password checker, has_digit only checks for a number, so I can test it alone and find a bug faster. I can also reuse it in another program instead of copying the same code again."
  },
  "2-7": {
    need: 3,
    keys: [
      ["what a dictionary is good at", /key|look ?up|name|label|by (its )?(name|word)|pair|map/i],
      ["what a list is good at", /order|position|index|sequence|line|queue|one after|numbered/i],
      ["real-life examples", /example|e\.g|like|such as|phone|contact|shopping|dictionary|menu|price|marks|students|queue|playlist|grocer|to-?do|book|scores|names/i]
    ],
    model: "I use a dictionary when I want to look things up by a key, like a phone book where each name gives a number. I use a list when the order or position matters, like a shopping list or a queue of people. A menu with prices fits a dictionary because each dish name maps to its price."
  },
  "2-8": {
    need: 3,
    keys: [
      ["the data your tracker stores", /list|dict|store|amount|expense|data|total|saved/i],
      ["the functions you wrote", /function|def\b|main\(|add_|menu|show_/i],
      ["the wrong inputs you tried and what happened", /abc|\b0\b|zero|wrong|invalid|letters|negative|error|valueerror|try|except|message/i]
    ],
    model: "My tracker stores the expenses in a list, and each expense has an amount and a category. I wrote small functions: one to add an expense, one to show the total, and main() to run the menu. When I typed abc as an amount, it showed a friendly message instead of crashing, and 0 or negative amounts were refused."
  },

  /* ── World 3 ── */
  "3-1": {
    need: 3,
    keys: [
      ["reading the error message first", /read|traceback|error message|last line|message|line number/i],
      ["finding the line and guessing the cause", /find|guess|hypothes|cause|why|locat|which line|look at/i],
      ["changing one thing and running again", /change|fix|edit|try|run (it )?again|re-?run|test again|one thing/i],
      ["the step beginners skip and why it matters", /skip|forget|forgot|beginner|ignore|don't read|without reading|guessing|random|panic/i]
    ],
    model: "First I read the traceback, starting with the last line, which names the error. Then I find the line it points to and guess the cause. I change one thing and run it again to see if it worked. Beginners often skip reading the message and just change code at random, which wastes time."
  },
  "3-2": {
    keys: [
      ["what except ValueError catches", /only|specific|expect|that (one|error)|valueerror|particular|just the/i],
      ["what a bare except hides", /hide|hidden|swallow|silent|mask|catch(es)? (every|all|any)|everything|other (errors|bugs|mistakes)|typo|nameerror|never (see|know)|cover/i]
    ],
    model: "except ValueError only catches the one error we expect, like someone typing letters instead of a number. A bare except catches everything, so it also hides real bugs. In the typo bug, a misspelled name caused a NameError, but the bare except swallowed it and printed the friendly message, so the bug stayed hidden."
  },
  "3-3": {
    need: 3,
    keys: [
      ["when the input is impossible or invalid", /invalid|impossible|wrong|bad|can't|cannot|not (allowed|valid|enough)|more than|negative|too much|problem/i],
      ["why a returned value isn't safe enough", /ignor|miss|forget|unnotic|silent|quietly|mistake|confus|looks like|none|-1|wrong (number|value|answer)|keeps going|carry on|stop|crash|caller|force|must (handle|deal)|notice|loud|clear/i],
      ["the withdraw example", /withdraw|balance|money|account|bank|amount/i]
    ],
    model: "A function should raise an error when it is asked to do something impossible, like withdraw taking more money than the balance. If it just returned a value such as -1 or None, the caller might not notice and keep going with a wrong number. Raising stops the program clearly, so the problem must be handled."
  },
  "3-4": {
    keys: [
      ["what with does for you", /clos/i],
      ["what .strip() removes", /newline|\\n|new line|space|whitespace|enter|line break|invisible|extra|end of (each|the) line/i]
    ],
    model: "with open(...) as f: closes the file for us when the block ends, even if an error happens in the middle, so we never forget. Each line we read ends with an invisible newline, \\n, and .strip() removes it along with extra spaces, so comparisons like line == \"apple\" work."
  },
  "3-5": {
    need: 3,
    keys: [
      ["what mode \"w\" does to the file", /wipe|eras|delet|replac|overwrit|clear|empt|start(s)? (fresh|over|again|from scratch)|new file|remov/i],
      ["what mode \"a\" does", /add|end|append|keep|bottom|after|extra|on top/i],
      ["a real situation for each", /log|diary|journal|report|score|save|setting|notes|history|chat|record|receipt|backup|example/i]
    ],
    model: "Mode \"w\" wipes the file and starts fresh, so the old content is gone. Mode \"a\" keeps what is there and adds new lines at the end. I would use \"w\" to save today's report from scratch, and \"a\" for a diary or a log where every new entry is added after the old ones."
  },
  "3-6": {
    need: 3,
    keys: [
      ["how you call it after import math", /math\.sqrt|math\.|dot|prefix|whole module|everything|all of/i],
      ["how you call it after from math import sqrt", /directly|just sqrt|only sqrt|without (the )?math|sqrt\(|only (the|one|that)|shorter|just (the|one)/i],
      ["when you'd prefer each", /prefer|when|clear|where it came|clash|conflict|same name|readab|many|lots|few|one function|short/i]
    ],
    model: "import math brings in the whole module, so you write math.sqrt(16) and anyone reading can see where sqrt came from. from math import sqrt brings in only that one function, so you can call sqrt(16) directly, which is shorter. I prefer import math when I use many functions, and from-import when I only need one."
  },
  "3-7": {
    keys: [
      ["which kinds of inputs good tests cover", /edge|boundary|normal|empty|zero|\b0\b|negative|corner|different|many|several|unusual/i],
      ["checking exact expected answers", /expect|exact|correct (answer|value)|right answer|assert|==|known/i],
      ["what happened with the broken versions", /fail|caught|catch|broken|bug|wrong|mutant|differ|break/i]
    ],
    model: "A good test checks exact expected answers, for normal inputs and also edge cases like an empty cart or a discount right on the limit. My tests caught the broken versions of cart.py because each broken version gave a different number for one of those cases, so an assert failed."
  },
  "3-8": {
    keys: [
      ["two things that could go wrong", /missing|not found|no file|empty|bad line|wrong format|blank|letters|typo|invalid|filenotfound|valueerror|corrupt|broken/i],
      ["how your code handles them", /\btry\b|except|check|skip|message|tell|default|strip|ask again|catch|handle|\bif\b/i]
    ],
    model: "Two things could go wrong: the questions file might be missing, or a line in it might have the wrong format. For the missing file I catch FileNotFoundError and show a friendly message. For bad lines, I check the format and skip them instead of crashing, so the quiz still runs."
  },

  /* ── World 4 ── */
  "4-1": {
    keys: [
      ["what shop[\"items\"] gives you", /list/i],
      ["what [1] picks", /second|index 1|\[1\]|dict/i],
      ["what [\"tags\"][0] gives you", /first|\[0\]|string|\bstr\b|text|word|tag/i]
    ],
    model: "shop is a dict, so shop[\"items\"] gives the list of items. [1] picks the second item in that list, which is a dict. [\"tags\"] gives that item's list of tags, and [0] picks the first tag, which is a string."
  },
  "4-2": {
    keys: [
      ["what JSON is", /text|format|string|file|standard|readable/i],
      ["who else can read it", /other (programs|languages|apps|tools)|any language|javascript|web|api|share|send|everywhere|universal|standard/i],
      ["what you get back when you load it", /load|back|read (it )?back|dict|list|type|structure|parse|can't (read|get)|turn (it )?back|eval/i]
    ],
    model: "JSON is a standard text format for data, like lists and dicts. Almost every language and website can read it, so programs can share data. With json.loads we get a real dict or list back, but text made with str() can't be safely turned back into data."
  },
  "4-3": {
    keys: [
      ["the request", /request|url|\bget\b|\bask|send|call/i],
      ["the status code", /status|200|404|500|\bcode\b|\bok\b|success/i],
      ["the JSON body", /json|body|data|dict|response/i],
      ["what can go wrong", /wrong|fail|error|offline|internet|network|timeout|not found|down|missing|bad|invalid|key/i]
    ],
    model: "My code sends a request to a URL, usually a GET. The server replies with a status code, like 200 for OK or 404 for not found, and a body of JSON that I turn into a dict with .json(). Things can go wrong at each step: no internet, a bad status code, or a missing key in the data."
  },
  "4-4": {
    need: 4,
    keys: [
      ["what SELECT does", /select[\s\S]{0,60}(column|field|which|what|pick|choose|name|price)/i],
      ["what FROM does", /from[\s\S]{0,60}(table|which|items|snacks|products|shop)/i],
      ["what WHERE does", /where[\s\S]{0,60}(filter|condition|only|rows|which|match|keep|categor|snack|price)/i],
      ["what ORDER BY does", /order[\s\S]{0,40}(sort|order|arrang|cheap|price|ascend|descend|lowest|highest|small)/i],
      ["why a second shop is used", /second|another|other|different|hard-?cod|cheat|real|any (data|shop)|general|copy|fake/i]
    ],
    model: "SELECT picks which columns I want, like the name and price. FROM says which table to read, items. WHERE filters the rows so only snacks are kept. ORDER BY sorts them by price, cheapest first. The checker runs it on a second shop to make sure the query really works and the answer is not just copied in."
  },
  "4-5": {
    need: 3,
    keys: [
      ["what WHERE filters", /where[\s\S]{0,80}(row|before|each|single|individual)/i],
      ["what HAVING filters", /having[\s\S]{0,80}(group|after|total|count|sum|avg|aggregate)/i],
      ["an example from the shop", /categor|snack|price|stock|item|product|order|shop|customer|sweets|drinks/i]
    ],
    model: "WHERE filters single rows before they are grouped, for example only items with price above 20. HAVING filters whole groups after GROUP BY, using totals like COUNT or SUM. So to find categories with more than two items, I group by category and use HAVING COUNT(*) > 2."
  },
  "4-6": {
    need: 3,
    keys: [
      ["which rows a JOIN keeps", /join[\s\S]{0,100}(only|match|both|in common|have orders|has ordered|ordered)/i],
      ["which rows a LEFT JOIN keeps", /left[\s\S]{0,100}(all|every|even|also|including|no orders|without|null|none|empty|zero)/i],
      ["when you'd need each", /when|need|use|example|report|list|find|who/i]
    ],
    model: "A JOIN keeps only the rows that match in both tables, so I only see customers who have ordered something. A LEFT JOIN keeps every customer from the left table, even ones with no orders, and fills the order columns with NULL. I need LEFT JOIN to find customers who never ordered."
  },
  "4-7": {
    need: 3,
    keys: [
      ["where the attacker types", /type|typ|enter|input|box|form|field|login|password|username|user/i],
      ["what their text does to the query", /chang|trick|\brun|command|query|instructions|delete|drop|bypass|log in as|access|steal/i],
      ["how ? placeholders stop it", /placeholder|\?|separat|plain text|just (text|data)|only (text|data)|never (run|execut)|treated as|as data|as a value|not (as )?code|safe/i]
    ],
    model: "Imagine a login box. A sneaky person types a piece of SQL instead of a name, and if our code glues that text into the query, it can change what the query does, like logging in without a password. With ? placeholders the database gets the query and the data separately, so whatever they type is treated only as plain text, never as a command."
  },
  "4-8": {
    need: 3,
    keys: [
      ["the two tables", /two tables|habits?[\s\S]{0,80}(check|log|done|days?|entr)|tables/i],
      ["what UNIQUE does for the name", /unique|duplicat|twice|same name|only once|one of each/i],
      ["how the streak is counted", /\brow\b|in a row|consecutive|back|yesterday|today|each day|previous|counting|until|gap|miss/i]
    ],
    model: "It uses two tables: habits, with an id and a name, and checkins, which stores the habit id and the day each time it is done. The name is UNIQUE so the same habit can't be added twice. For the streak, I start from today and count back one day at a time until I find a day with no check-in."
  },

  /* ── World 5 ── */
  "5-1": {
    need: 4,
    keys: [
      ["the request", /request/i],
      ["the method", /method|\bget\b/i],
      ["the response", /respon/i],
      ["the status code", /status|200|404/i],
      ["what the browser does with the page", /server|html|browser|draw|render|display|show/i]
    ],
    model: "When I type a URL, the browser sends a request to the server. The request has a method, GET, which means 'give me this page'. The server sends back a response with a status code, like 200 for OK or 404 for not found, plus the HTML. The browser then draws that HTML as the page I see."
  },
  "5-2": {
    keys: [
      ["people using screen readers", /screen reader|blind|access|disab|assistive|read aloud|everyone/i],
      ["search engines and other programs", /search|google|seo|robot|program|tool|crawler|understand|meaning/i],
      ["where the looks should come from", /css|style|look|change|design|separate|later|easier/i]
    ],
    model: "Tags tell browsers and other programs what the content means. A screen reader can announce a real heading or list to a blind user, and search engines understand the page better. How it looks belongs in CSS, so I can change the design later without changing the meaning."
  },
  "5-3": {
    keys: [
      ["how someone can get around the HTML checks", /skip|bypass|change|edit|remove|delete|dev ?tools|curl|script|postman|hack|send (it )?(directly|straight)|without the (form|browser)|turn off|inspect|disable|fake/i],
      ["which part you can actually trust", /trust|control|only|last|server|safe|real|backend|guard/i]
    ],
    model: "The HTML checks run in the user's browser, so anyone can remove them with developer tools or send a request directly without using the form. The server is the only part we control, so it must check the data again before trusting it."
  },
  "5-4": {
    need: 3,
    keys: [
      ["how the URL is matched", /match|path|url|route|address/i],
      ["what happens to the part after /hello/", /asha|name (variable|parameter|argument)|variable|parameter|argument/i],
      ["who calls your function", /call|\brun|function|def\b/i],
      ["what is sent back", /return|response|send|back|page|show|browser/i]
    ],
    model: "The decorator tells Flask that this function handles paths that look like /hello/<name>. When someone visits /hello/Asha, Flask matches the route, takes Asha from the URL and calls the function with name = \"Asha\". Whatever the function returns is sent back to the browser as the response."
  },
  "5-5": {
    need: 3,
    keys: [
      ["the paths", /\/menu|\/api|path|route|endpoint|url/i],
      ["the filters", /filter|query|\?|veg|price|max|categor|param|argument/i],
      ["what happens on errors", /error|404|400|status|not found|bad request|message/i]
    ],
    model: "GET /api/menu returns every dish as a JSON list. You can filter with query arguments: ?veg=true keeps only vegetarian dishes and ?max_price=30 keeps dishes costing 30 or less. GET /api/menu/3 returns one dish. If the id doesn't exist you get status 404 with {\"error\": \"not found\"}, and a max_price that isn't a number gives 400."
  },
  "5-6": {
    keys: [
      ["what users might send", /anything|missing|empty|blank|wrong|bad|invalid|fake|long|huge|negative|text instead|letters|type/i],
      ["what could go wrong if it's stored", /crash|error|break|junk|garbage|corrupt|database|stor|attack|hack|spam|security|xss|injection|fill|full|slow|500/i]
    ],
    model: "Anyone can send anything in a POST request, not just what our form allows. If the server stored it without checking, an empty or missing field could crash the code with a 500 error, and a huge message or junk could fill the database. Validating first lets us reply 400 with a clear message instead."
  },
  "5-7": {
    need: 3,
    keys: [
      ["what an XSS attack does", /script|code|\brun|javascript|html|inject|attack/i],
      ["what escaping does", /escap|&lt;|safe|plain text|turns? [\s\S]{0,20}into|convert|replace|harmless|as text/i],
      ["why keys must stay out of the code", /share|github|public|push|commit|repo|leak|steal|anyone|\bgit\b/i],
      ["where environment variables live", /environ|\benv\b|os\.environ|outside|separate|server|setting|config|\.env/i]
    ],
    model: "XSS is when someone types HTML or a script into a form, and the page shows it as real code that runs in other people's browsers. Escaping turns characters like < into &lt;, so the browser shows them as plain text. API keys belong in environment variables because code gets pushed to GitHub and shared, and anyone could steal a key written in it."
  },
  "5-8": {
    need: 3,
    keys: [
      ["the routes and status codes", /route|status|200|201|400|404|\bget\b|post/i],
      ["how the data is stored", /sqlite|database|table|\bsql\b|stor|save/i],
      ["escaping to stop XSS", /escap|xss|html|safe|script/i],
      ["the other security step", /placeholder|\?|injection|validat|check|secret|\benv\b|length|empty/i]
    ],
    model: "GET / shows the messages as an HTML page, GET /api/entries returns them as JSON, and POST /api/entries adds one, replying 201 when it works or 400 when the name or message is empty. DELETE gives 204, or 404 if the entry is missing. Messages are stored in a sqlite table called entries with an id, a name and a message. For security I escape every message before showing it to stop XSS, and I use ? placeholders in SQL to stop injection."
  },

  /* ── World 6 ── */
  "6-1": {
    need: 3,
    keys: [
      ["who has the problem", /\bwho\b|users?|people|students?|friends?|parent|teacher|shop|owner|anyone|someone|family|beginner|player|customer|\bmy\b|\bfor\b/i],
      ["what the problem is", /problem|hard|difficult|forget|waste|trouble|need|want|struggl|track|manag|keep/i],
      ["the 2–3 must-have features", /feature|must|able to|\bcan\b|add|show|list|save|track|search|remind|first version|mvp/i]
    ],
    model: "I want to build a study planner for college students who forget deadlines and waste time deciding what to study. The must-have features for the MVP are: add a task with a due date, show tasks sorted by deadline, and save them so they are still there tomorrow."
  },
  "6-2": {
    need: 3,
    keys: [
      ["at least two different structures", /(?=[\s\S]*\blists?\b)(?=[\s\S]*\b(dict|dictionar|sets?\b|tuples?))|(?=[\s\S]*\bdict)(?=[\s\S]*\b(sets?\b|tuples?))|(?=[\s\S]*\bsets?\b)(?=[\s\S]*\btuples?)/i],
      ["what makes each one fit", /order|key|look ?up|duplicat|unique|fixed|change|position|fast|pair|group/i],
      ["your reasons", /because|since|so (that|i|it)|as it|to keep|which|why/i]
    ],
    model: "For a recipe app, I would store the steps in a list because their order matters. Each recipe would be a dict, so I can look up its name, time and steps by key. The tags would be a set, since a tag should never appear twice, and a nutrition fact like (calories, protein) could be a tuple because it never changes."
  },
  "6-3": {
    need: 3,
    keys: [
      ["what self is", /object|instance|itself|this (one|account|object)|the account|\bacc\b|that (one|account)/i],
      ["who fills in self", /automatic|python (passes|gives|puts|sends|fills)|passes|first (argument|parameter)|behind the scenes|for you|filled|hidden|secretly|on its own|by itself/i],
      ["where 500 goes", /500|amount|second|other (parameter|one)/i]
    ],
    model: "self is the object the method is working on, here the account acc. When I write acc.deposit(500), Python automatically passes acc in as the first parameter, self. So I only give the second one, and 500 goes into amount."
  },
  "6-4": {
    need: 3,
    keys: [
      ["inheritance (\"is a\")", /is a|is-a|inherit|parent|child|subclass|kind of|type of|extends/i],
      ["composition (\"has a\")", /has a|has-a|compos|contain|holds|inside|owns|made of|has an?\b|attribute/i],
      ["an example from your project", /example|e\.g|like|such as|\bmy\b|for instance|class/i]
    ],
    model: "Inheritance means 'is a': a child class is a kind of its parent and reuses its code, like an ExamTask is a Task. Composition means 'has a': one object holds another as an attribute, like my Planner has a list of tasks. In my project, a planner is not a kind of task, so composition fits there."
  },
  "6-5": {
    keys: [
      ["what makes it cleaner", /name|function|repeat|duplicat|constant|magic|slab|short|small|simpl|clear|readab|loop|table|list/i],
      ["how the tests made it safe", /test|same (result|output|answer|behavio)|still (work|pass)|nothing (broke|changed)|didn't break|safe|check|prove|confiden/i]
    ],
    model: "I replaced the long chain of if statements with a table of slabs and one loop, and gave the numbers clear names instead of magic numbers. It is shorter and easier to change. The hidden tests checked the same bills before and after, so I knew the refactor didn't break anything."
  },
  "6-6": {
    need: 3,
    keys: [
      ["what makes dates tricky", /month|leap|february|\bfeb\b|28|29|30|31|days in/i],
      ["what datetime does for you", /datetime|module|timedelta|handles|knows|correct|automatic|built|library/i],
      ["an example that goes wrong by hand", /example|e\.g|like|such as|adding|\badd|\d|year|end of|next|week|deadline|birthday/i]
    ],
    model: "Months have different lengths and leap years add February 29, so plain number maths makes mistakes. For example, adding 7 days to January 28 by hand might give January 35. With datetime, date + timedelta(days=7) correctly gives February 4, because the module already knows the calendar."
  },
  "6-7": {
    need: 3,
    keys: [
      ["the edge cases you thought about", /empty|blank|spaces?|comma|rupee|₹|\brs\b|negative|minus|letter|abc|decimal|\bdot\b|zero|none|symbol|currency|\d,\d/i],
      ["which one was hardest", /hard|difficult|tricky|tough|challeng|longest|confus/i],
      ["how you handled it", /strip|replace|remov|raise|valueerror|check|\bif\b|\btry\b|except|float|int\(|return/i]
    ],
    model: "I thought about an empty string, extra spaces, the ₹ symbol, commas like 1,200, negative amounts and letters like abc. The hardest was commas, because I had to remove them without breaking decimals. I used strip and replace, then float, and raised a ValueError for anything that still wasn't a number."
  },
  "6-8": {
    need: 3,
    keys: [
      ["the two classes and their jobs", /task[\s\S]{0,120}planner|planner[\s\S]{0,120}task|two classes|each class|one job|responsib/i],
      ["how saving works", /json|save|file|to_dict|from_dict|load|dump/i],
      ["the edge cases you handled", /edge|missing|empty|duplicat|past|overdue|wrong|invalid|no file|not found|bad|blank|error/i]
    ],
    model: "I used two classes so each has one job: Task holds one task's title, date and done flag, and Planner manages the list of tasks. To save, each Task turns itself into a dict with to_dict, and the planner writes the list as JSON. I handled edge cases like a missing save file, an empty title and duplicate tasks."
  },

  /* ── World 7 ── */
  "7-1": {
    need: 3,
    keys: [
      ["what git add does", /add[\s\S]{0,100}(stag|choose|pick|select|prepar|ready|basket|list|mark|which)/i],
      ["what git commit does", /commit[\s\S]{0,100}(save|snapshot|photo|record|checkpoint|message|version|point|history)/i],
      ["what git push does", /push[\s\S]{0,100}(upload|github|remote|online|server|cloud|share|internet|send)/i]
    ],
    model: "git add picks which changes you want to save, like putting items in a box before you seal it. git commit seals the box: it saves a snapshot of those changes on your computer with a message describing them. git push uploads your commits to GitHub so others can see them and you have a backup."
  },
  "7-2": {
    need: 3,
    keys: [
      ["why it happens", /same (line|part|place|spot|file|bit)|both|two (people|branches|changes)|different changes/i],
      ["what Git can't decide", /can't|cannot|doesn't know|does not know|decide|choose|which (one|version)|confus|automatic/i],
      ["how you'd resolve it", /talk|\bask|discuss|pick|choose|combine|keep|marker|<<<|edit|remove|test|commit|together/i]
    ],
    model: "A merge conflict happens when two people change the same lines of a file on different branches. Git can't decide which version to keep, so it marks both. To resolve it, I talk to my teammate, edit the file to keep the right lines, remove the markers, run the tests, and commit."
  },
  "7-3": {
    need: 3,
    keys: [
      ["the order you write things in", /test[\s\S]{0,60}(first|before)|(first|before)[\s\S]{0,60}test|\bred\b|fail first/i],
      ["one benefit", /benefit|help|catch|confiden|clear|think|design|bug|safe|know when|done|regress|proof/i],
      ["a time you might not use it", /not use|wouldn't|would not|skip|don't|unless|quick|prototype|experiment|explor|unsure|unclear|throw|small script|when you don't know/i]
    ],
    model: "In test-driven development, you write a failing test first, then write just enough code to make it pass, then clean up. One benefit is that you think clearly about what the code should do and know when it is done. I might not use it for a quick experiment where I don't know yet what I want to build."
  },
  "7-4": {
    need: 3,
    keys: [
      ["what it is", /is a|\bapp\b|tool|program|game|website|\bsite\b|project|helps|lets/i],
      ["who it's for", /\bfor\b|users?|students?|people|anyone|beginners|teachers|friends|\bwho\b/i],
      ["why you built it", /built|made|because|wanted|\bwhy\b|problem|needed|frustrat|struggl/i]
    ],
    model: "Study Planner is a simple command-line app that helps college students keep track of assignments and deadlines. It is for anyone who keeps forgetting due dates. I built it because I missed two deadlines in one week and wanted one place to see what is due next."
  },
  "7-5": {
    need: 3,
    keys: [
      ["what happens to secrets written in the code", /leak|share|github|public|push|commit|anyone|steal|repo|history/i],
      ["why settings change between computers", /change|different|without (editing|changing)|each (computer|machine|server)|server|environment|deploy|production|local|easy/i],
      ["what goes in .gitignore", /\.env|venv|__pycache__|\.pyc|secret|key|password|database|\.db|\blog|cache|node_modules|config/i]
    ],
    model: "Code gets pushed to GitHub and shared, so a secret written in it can leak to anyone, and it stays in the history. Settings also change between my laptop and the server, so reading them from the environment means I don't edit the code. In .gitignore I put .env, venv, __pycache__ and my local database file."
  },
  "7-6": {
    keys: [
      ["when you'd run it", /before|every|each|always|hook|habit|routine|push|commit/i],
      ["what it can still miss", /miss|can't|cannot|won't|not (catch|find|detect)|unknown|different (format|pattern)|new (kind|type)|split|encoded|base64|obfusc|history|image|false|private (info|data)|personal|email|phone|address/i]
    ],
    model: "I would run the scanner before every commit and push, as part of my routine, so a key never leaves my laptop. A simple scanner can still miss secrets that don't match its patterns, like a password split across two lines or a new kind of key, and it can't clean secrets already in the Git history."
  },
  "7-7": {
    need: 3,
    keys: [
      ["running or testing it", /\brun|test|try|execut/i],
      ["reading and understanding each line", /read|understand|line by line|explain|every line|each line|know what/i],
      ["checking security and edge cases", /secur|secret|key|injection|edge|empty|invalid|error|hallucin|made.up|exist|fake|import|librar|version|license|wrong/i],
      ["why it matters", /because|since|so (that|i|it)|can be wrong|mistake|confident|sure|blame|responsib|my name|my code/i]
    ],
    model: "First I read every line and make sure I can explain what it does. Then I run it with tests, including edge cases like empty input. I also check for security problems and for imports or functions the AI may have made up. I do this because AI code can look confident and still be wrong, and once I use it, it is my code."
  },
  "7-8": {
    need: 4,
    keys: [
      ["the tests", /test/i],
      ["checking for secrets", /secret|scan|\bkey|password|\.env|gitignore/i],
      ["the README, docs or commit", /readme|\bdoc|commit|version|changelog|\btag\b|message/i],
      ["deploying and checking the live site", /deploy|live|\bsite\b|pages|host|publish|\burl\b|check it|browser|server/i],
      ["why some checks are must-pass", /must|because|since|so (that|users|nobody|no one)|break|users?|leak|can't (undo|take back)|public/i]
    ],
    model: "After the last change, I run all the tests, then the secret scanner, then update the README and commit with a clear message. I push, deploy, and open the live site to check that it works. Tests and the secret scan are must-pass, because a broken app hurts users and a leaked key can't be taken back."
  },
  /* ── World 8 ── */
  "8-1": {
    need: 3,
    keys: [
      ["the UMPIRE steps you'd follow", /umpire|understand|plan|match|review|evaluat|implement|say it back|repeat/i],
      ["the questions you'd ask first", /\bask|question|clarif|what if|should (i|it)|can (the|numbers|there)/i],
      ["the edge cases you'd test", /duplicat|repeat|same|empty|one number|single|negative|\[5, ?5|\bnone\b/i]
    ],
    model: "First I'd say it back: return the second biggest different value. I'd ask what to return if the list is empty or has one number, and whether [5, 5, 3] should give 5 or 3. My plan is to remove duplicates with a set, sort, and return the second last value, or None if there are fewer than two. I'd test an empty list, repeats like [5, 5, 3], and all negative numbers."
  },
  "8-2": {
    need: 3,
    keys: [
      ["what the dict stores", /dict|position|index|seen|stor|remember/i],
      ["how you find the partner", /target ?- ?n|partner|complement|\bneed|differen|subtract|minus/i],
      ["why it's faster than checking every pair", /o\(n\)|one (pass|loop)|once|every pair|nested|loop inside|n²|n\^2|faster|one step|o\(1\)/i]
    ],
    model: "I loop through the list once. A dict remembers each number I've seen and its position. For each number n, the partner I need is target - n, so I check if it's already in the dict. Checking a dict takes about one step, so the whole thing is O(n), instead of O(n²) for checking every pair."
  },
  "8-3": {
    need: 3,
    keys: [
      ["where the two pointers start", /both ends|start|\bend\b|left[\s\S]{0,40}right|first and last|smallest[\s\S]{0,40}biggest/i],
      ["which pointer moves, and when", /too (small|big|low|high)|\bmove|smaller|bigger|increase|decrease/i],
      ["why it's safe and needs a sorted list", /sort|order|can't|cannot|never|no partner|drop|safe|rule out/i]
    ],
    model: "Put one pointer at the start and one at the end. If the two numbers add up to less than the target, move the left pointer right to get a bigger number; if more, move the right pointer left. It's safe because the list is sorted: if the smallest number plus the biggest is too small, the smallest number can never be part of an answer, so we can drop it."
  },
  "8-4": {
    need: 3,
    keys: [
      ["counting everything first", /count|dict|counter|tally/i],
      ["how you find the first unique one", /first|once|== ?1|only one|appears once|second (pass|loop)|again/i],
      ["why s.count inside a loop is slow", /whole string|every (time|letter|character)|again|n²|n\^2|loop inside|hidden loop|slow|o\(n/i]
    ],
    model: "First I count every character in one pass with a dict. Then I loop through the string again and return the position of the first character whose count is 1. s.count(ch) is slow because it reads the whole string again for every letter, which is a loop inside a loop, O(n²). Mine is two passes, so O(n)."
  },
  "8-5": {
    need: 3,
    keys: [
      ["the starter's Big-O", /o\(n²\)|o\(n\^2\)|o\(n2\)|o\(n ?\* ?n\)|n squared|quadratic|n²|n\^2/i],
      ["your version's Big-O", /o\(n\)|linear|one pass|once/i],
      ["where the hidden loop was", /slice|\[:i\]|in tickets|hidden|copies|copy|search/i],
      ["what you traded for speed", /memory|space|\bset\b|remember|extra/i]
    ],
    model: "The starter is O(n²): for every ticket, tickets[:i] copies the earlier tickets and in searches them, which is a hidden loop. My version keeps a set of tickets already seen, so each check takes one step and the whole thing is O(n). I traded some extra memory for the set to get a lot more speed."
  },
  "8-6": {
    need: 3,
    keys: [
      ["what happens to opening brackets", /push|append|opening|\badd/i],
      ["what happens on a closing bracket", /\bpop|\btop\b|last|closing|match|partner/i],
      ["where ([)] fails", /wrong|doesn't match|does not match|mismatch|not (its|the) partner|top is \[|\[ is on top/i],
      ["the check at the end", /empty|left over|nothing left|left open/i]
    ],
    model: "Every opening bracket is pushed onto the stack. For a closing bracket, I pop the top and check it is its partner. With ([)], I push ( and then [. Then ) arrives, but the top is [, which doesn't match, so it returns False right there. At the end the stack must also be empty, or something was left open."
  },
  "8-7": {
    need: 3,
    keys: [
      ["what each guess does to the range", /half|halv|middle|divid|split/i],
      ["why 20 guesses are enough", /\b20\b|twenty|log|2\^|power|1,?048,?576|million/i],
      ["what < or high = mid would break", /miss|skip|\blast\b|stuck|forever|infinite|never (end|stop|find)|same (number|range)|one left/i]
    ],
    model: "Each guess is the middle of what's left, so every answer throws away half of the numbers. 2 to the power 20 is more than a million, so after 20 halvings only one number can be left. With while low < high, the loop would stop before checking the last number left. With high = mid, the range could stop shrinking and the loop would get stuck forever."
  },
  "8-8": {
    keys: [
      ["the pattern you used", /dict|\bset\b|count|sort|\bkey\b|pattern|hash|counter/i],
      ["the steps", /first|then|loop|for each|step|after/i],
      ["the edge cases", /empty|duplicat|\btie|negative|edge|single|one (word|number)|fewer/i],
      ["its Big-O", /o\(|big-?o|linear|n log n/i]
    ],
    model: "I'll explain top_k. First I count each number with a dict in one pass. Then I sort the distinct numbers by count, biggest first, using the key (-count, n) so ties go to the smaller number, and take the first k. Edge cases: fewer than k numbers, ties, and an empty list. Counting is O(n) and sorting the distinct numbers is O(n log n)."
  }
};

for (const L of LEVELS) {
  const x = EXPLAIN[L.id];
  if (x) Object.assign(L, { explainKeys: x.keys, explainNeed: x.need, explainModel: x.model });
}
