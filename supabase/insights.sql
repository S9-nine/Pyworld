-- Ready-made queries for improving the game. Supabase dashboard → SQL Editor → paste one → Run.
-- They read the play data the game sends (see the events and feedback tables in schema.sql).

-- 1. Where do players get stuck? Pass rate of each Forge / Bug Hunt check, hardest first.
select level, stage, count(*) as checks,
       round(100.0 * avg(case when ok then 1 else 0 end)) as pass_pct,
       count(distinct user_id) as players
from events where kind = 'check'
group by level, stage
having count(*) >= 3
order by pass_pct asc, checks desc
limit 30;

-- 2. The most common failing tests and errors, per level.
select level, stage, f.test, count(*) as times
from events, jsonb_array_elements_text(detail -> 'fails') as f(test)
where kind = 'check' and not ok
group by level, stage, f.test
order by times desc
limit 40;

select level, detail ->> 'error' as error, count(*) as times
from events where kind = 'check' and not ok and detail ->> 'error' is not null
group by 1, 2 order by times desc limit 30;

-- 3. Real wrong code people submitted for one level (change the level id).
select at, stage, detail -> 'fails' as failed_tests, detail ->> 'code' as code
from events where kind = 'check' and not ok and level = '1-2'
order by at desc limit 20;

-- 4. Think questions people miss most.
select level, (detail ->> 'q')::int + 1 as question, detail ->> 'type' as type,
       count(*) as answers, round(100.0 * avg(case when ok then 1 else 0 end)) as right_pct
from events where kind = 'think'
group by 1, 2, 3 having count(*) >= 3
order by right_pct asc limit 30;

-- 5. Tavern Talk answers that didn't pass, and why (shows where key ideas or corrections need work).
select level, detail ->> 'why' as reason, detail ->> 'text' as answer, at
from events where kind = 'explain' and not ok
order by at desc limit 40;

-- 6. Hint use per level (a lot of hints = the lesson or brief may need work).
select level, stage, count(*) as hints, count(distinct user_id) as players
from events where kind = 'hint' group by 1, 2 order by hints desc limit 30;

-- 7. Feedback from players, newest first.
select at, level, stage, rating, message from feedback order by at desc limit 100;

-- 8. How many players, and how far they've got.
select count(*) as players, round(avg(levels_done), 1) as avg_levels_done, max(levels_done) as best,
       count(*) filter (where last_played >= current_date - 7) as active_this_week
from profiles;

-- Explain answers players stood by ("I think my answer is right"). Read them: if they're right,
-- add their wording to that level's key idea in src/explain.js so the checker accepts it next time.
select level, at, detail->>'text' as answer, detail->>'got' as ideas_found, detail->>'need' as ideas_needed
from events where kind = 'explain_dispute'
order by at desc limit 50;
