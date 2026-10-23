/* Builds the single-file game.
   code-quest.html — page body for the claude.ai artifact (the host adds <html>/<head>).
   index.html      — standalone page you can open directly or host on GitHub Pages. */
const fs = require("fs"), p = (f) => __dirname + "/" + f;

const css = fs.readFileSync(p("pixel-ui.css"), "utf8") + `
@media (max-width: 1000px) { .profile-grid { grid-template-columns: minmax(0, 1fr); } }
@media (max-width: 640px) {
  .creator-grid { grid-template-columns: minmax(0, 1fr); }
  .char-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .stat-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .file-go { display: none; }
  .file { grid-template-columns: auto minmax(0, 1fr); }
}
`;
const shell = fs.readFileSync(p("shell.html"), "utf8").replace("</style>", () => css + "</style>");
const list = require("./build-list.js");
const js = list.content.concat(list.app).map((f) => fs.readFileSync(p(f), "utf8")).join("\n");
// Lessons contain HTML like "<script>" and "<!--"; escape them so the page's own <script> tag isn't cut short.
// ("<\/" and "<\!" mean the same thing inside JS strings and regexes.)
const safeJs = js.replace(/<\/script/gi, "<\\/script").replace(/<!--/g, "<\\!--");
const html = shell + "\n<script>\n" + safeJs + "\n</script>\n";

fs.writeFileSync(p("../code-quest.html"), html);
fs.writeFileSync(p("../index.html"),
  "<!doctype html>\n<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width,initial-scale=1,viewport-fit=cover\">\n" +
  "<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>\n</head>\n<body>\n" +
  html + "</body>\n</html>\n");
console.log("built", html.length, "bytes");
