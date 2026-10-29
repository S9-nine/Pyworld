-- Code Quest backend: time spent per stage/level, and AI-tutor training data from players who opted in.
-- Run after sessions.sql: SQL Editor → New query → paste this whole file → Run. Safe to run again.
-- Read them in Table Editor → schema "insights" (private: the game's public key can't reach it).

-- How long each stage takes. Each player's time on a stage is added up first (the game logs it in pieces:
-- when they leave the stage or the page), then averaged across players.
create or replace view insights.stage_times as
with per_player as (
  select user_id, level, stage, sum((detail ->> 'ms')::bigint) as ms, bool_or(ok) as finished
  from public.events where kind = 'time' and level is not null
  group by user_id, level, stage
)
select level, stage, count(*) as players,
       round(avg(ms) / 60000.0, 1) as avg_minutes,
       round((percentile_cont(0.5) within group (order by ms) / 60000.0)::numeric, 1) as median_minutes,
       count(*) filter (where finished) as finished
from per_player group by level, stage order by level, stage;

-- How long a whole level takes, for players who finished it.
create or replace view insights.level_times as
with per_player as (
  select user_id, level, sum((detail ->> 'ms')::bigint) as ms
  from public.events where kind = 'time' and level is not null
  group by user_id, level
)
select level, count(*) as players, round(avg(ms) / 60000.0, 1) as avg_minutes,
       round((percentile_cont(0.5) within group (order by ms) / 60000.0)::numeric, 1) as median_minutes
from per_player group by level order by level;

-- Each player's latest answer to "Help train Code Quest's AI tutor" (in Profile → Your data).
create or replace view insights.ai_consent as
select distinct on (e.user_id) e.user_id, coalesce(p.nickname, '(deleted player)') as player, e.ok as allowed, e.at as answered_at
from public.events e left join public.profiles p on p.id = e.user_id
where e.kind = 'consent'
order by e.user_id, e.at desc;

-- Training data: every Run from players whose latest answer is yes, in order, per visit.
-- Players who said no (or never answered) never appear, even if older rows exist.
create or replace view insights.ai_runs as
select e.session_id, e.user_id, e.at, e.level, e.stage, e.ok as ran_cleanly,
       (e.detail ->> 'sec')::int as seconds_into_stage, e.detail ->> 'code' as code, e.detail ->> 'out' as output, e.detail ->> 'err' as error
from public.events e join insights.ai_consent c on c.user_id = e.user_id and c.allowed
where e.kind = 'run'
order by e.user_id, e.at;

revoke all on all tables in schema insights from public, anon, authenticated;
