# Code Quest (Pyworld)

An 8-week Python learning RPG. You play through worlds on a map, write real Python in the browser, solve logic riddles, hunt bugs, and explain your code like you would in an interview.

## Play

On Windows, double-click **`Play Code Quest.bat`**. It checks GitHub for game updates (if Git is installed), then opens the game in your browser.

Or just open `index.html` in a browser. Nothing to install. Python runs in the page using [Skulpt](https://skulpt.org/), so you need an internet connection the first time it loads.

To host it for free, turn on **GitHub Pages** for this repository (Settings → Pages → deploy from the `main` branch, root folder). The game will be at `https://<your-username>.github.io/Pyworld/`.

## What's inside

- **World 1 – Basics Village:** 8 levels covering `print`, variables, types, `input()`, math, and `if / elif / else`, ending in a boss level.
- **Five stages per level:** Learn → Think → Code → Debug → Explain.
- **Auto-checked challenges** with friendly, plain-English error explanations.
- **Memory Dungeon:** spaced-repetition review cards (1, 3, 7, 14, 30 days).
- **XP, ranks, stars, streaks**, a daily goal and a job-ready meter.
- **Pixel-art title screen**, 12 pixel heroes, and an editable profile.
- **Save files:** 3 per browser, each optionally locked with a 4-digit PIN.

## Saving

| Where you open it | How progress is saved |
| --- | --- |
| `index.html` / GitHub Pages | In your browser (`localStorage`). Up to 3 save files per browser, each with an optional PIN. |
| claude.ai artifact | Under each player's Claude account, with a live shared Guild leaderboard. |

**Moving progress between versions:** open **Profile → Sync with your other version**, press **Copy my save code**, then paste it into Profile on the other version and press **Combine progress**. Progress is merged level by level, keeping the best result for each, so nothing is lost. Do it whenever you switch versions.

The PIN is a friendly lock for people sharing one computer, not real security. Anyone with access to the browser's developer tools can read local saves.

## Project layout

```
index.html         Standalone game (open this)
code-quest.html    Same game, as the body for the claude.ai artifact
src/
  content.js       Worlds, levels, lessons, riddles, challenges, memory cards
  pixel.js         12×12 pixel-art hero sprites
  runner.js        Runs Python (Skulpt) and checks answers
  app.js           Map, levels, editor, Memory Dungeon, Guild board
  title.js         Title screen, save files, hero creation, PIN lock
  profile.js       Profile page
  shell.html       Page markup and main styles
  pixel-ui.css     Pixel-art UI styles
  build.js         Builds index.html and code-quest.html
```

## Editing

Change files in `src/`, then rebuild:

```bash
node src/build.js
```

To add a level, copy a level object in `src/content.js` and change it. Each challenge has `tests` with the inputs to type and the lines the output must contain.
