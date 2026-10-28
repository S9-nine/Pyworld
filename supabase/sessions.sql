-- Code Quest backend: play sessions and ready-made summaries.
-- Run after schema.sql and hardening.sql: SQL Editor → New query → paste this whole file → Run.
-- Safe to run again, and safe while people are playing (it only adds an empty column and views).
--
-- To read the summaries: Table Editor → schema dropdown (top left, says "public") → pick "insights".
-- They live in their own schema, which the game's public key can't reach, so only you see them.

-- ───────── Sessions: one id per sitting, so you can follow a player's visit start to finish ─────────
alter table public.events add column if not exists session_id uuid;
create index if not exists events_session on public.events (session_id, at);

create schema if not exists insights;
revoke all on schema insights from public, anon, authenticated;

-- Each visit: who, when, how long, what they did, and where they were when it ended.
create or replace view insights.sessions as
select e.session_id,
       coalesce(max(p.nickname), '(deleted player)') as player,
       min(e.at) as started,
       round(extract(epoch from max(e.at) - min(e.at)) / 60)::int as minutes,
       count(*) as events,
       count(*) filter (where e.kind = 'check' and e.ok) as checks_passed,
       count(*) filter (where e.kind = 'check' and not e.ok) as checks_failed,
       count(*) filter (where e.kind = 'hint') as hints,
       string_agg(distinct e.level, ', ' order by e.level) as levels,
       (array_agg(concat_ws(' · ', e.level, e.stage) order by e.at desc))[1] as ended_at
from public.events e left join public.profiles p on p.id = e.user_id
where e.session_id is not null
group by e.session_id
order by started desc;

-- Every level and stage at a glance: how many played it, how hard it was, how much help they needed.
create or replace view insights.level_summary as
select level, stage,
       count(distinct user_id) as players,
       count(*) filter (where kind = 'check') as checks,
       round(100.0 * avg(case when ok then 1 else 0 end) filter (where kind = 'check')) as check_pass_pct,
       count(*) filter (where kind = 'hint') as hints,
       count(*) filter (where kind = 'think' and not ok) as think_wrong,
       count(*) filter (where kind = 'explain' and not ok) as explain_retries,
       count(*) filter (where kind = 'explain_dispute') as explain_disputes
from public.events
where level is not null
group by level, stage
order by level, stage;

-- Where players stopped: the last thing each player did, for players not seen in the last day.
-- A level or stage near the top is where people give up. Look there first.
create or replace view insights.where_players_stopped as
select level, stage, count(*) as players_stopped_here, max(at) as latest
from (select distinct on (user_id) user_id, level, stage, at
      from public.events where level is not null
      order by user_id, at desc) last_seen
where at < now() - interval '1 day'
group by level, stage
order by players_stopped_here desc;

-- Explain answers players stood by ("I think my answer is right"). If one is right, add its
-- wording to that level's key idea in src/explain.js so the checker accepts it next time.
create or replace view insights.disputed_answers as
select e.at, e.level, coalesce(p.nickname, '(deleted player)') as player,
       e.detail ->> 'text' as answer, e.detail ->> 'got' as ideas_found, e.detail ->> 'need' as ideas_needed
from public.events e left join public.profiles p on p.id = e.user_id
where e.kind = 'explain_dispute'
order by e.at desc;

-- Feedback with the player's nickname, newest first.
create or replace view insights.feedback as
select f.at, coalesce(p.nickname, '(deleted player)') as player, f.level, f.stage, f.rating, f.message
from public.feedback f left join public.profiles p on p.id = f.user_id
order by f.at desc;

revoke all on all tables in schema insights from public, anon, authenticated;
