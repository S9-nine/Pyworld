/* The order source files are joined in. Content files come first so the app can see every level. */
const content = ["content.js", "world2.js", "world3.js", "world4.js", "world5.js", "world6.js", "world7.js", "world8.js"]
  .filter((f) => require("fs").existsSync(__dirname + "/" + f));
module.exports = {
  content,
  app: ["vmods.js", "pixel.js", "runner.js", "app.js", "title.js", "profile.js"]
};
