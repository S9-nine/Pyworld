-- Code Quest backend: chat safety (filters, reports, auto-hide, block) and automatic deletion of old data.
-- Run after guild_master.sql: SQL Editor → New query → paste this whole file → Run. Safe to run again,
-- and safe while people play.

-- ───────── What chat refuses ─────────
-- Returns a friendly reason when a text isn't allowed, or null when it's fine. Used for chat messages and
-- guild names. Kept simple on purpose: it blocks the common risky things, and reports catch the rest.
create or replace function public.chat_problem(t text) returns text
language plpgsql immutable set search_path = public as $$
declare s text := lower(coalesce(t, ''));
begin
  if s ~ '[a-z0-9._%+-]+@[a-z0-9-]+\.[a-z]{2,}' then
    return 'Email addresses aren''t allowed in chat. Keep personal details private.';
  end if;
  if s ~ '(https?://|www\.|\m[a-z0-9-]+\.(com|in|net|org|io|gg|me|co|app|dev|xyz|link|ly|tk|ru|site|online|store|shop|live)\M)' then
    return 'Links aren''t allowed in chat, to keep everyone safe.';
  end if;
  if regexp_replace(s, '[^0-9]', '', 'g') ~ '[0-9]{10,}' and s ~ '[0-9][0-9 ()+.-]{8,}[0-9]' then
    return 'Phone numbers aren''t allowed in chat. Keep personal details private.';
  end if;
  if s ~ '\m(insta(gram)?|snap ?chat|whats ?app|telegram|discord|facebook|tiktok)\M' and s ~ '\m(add|dm|text|msg|message|follow|my|id|handle|username|contact|ping|join)\M' then
    return 'Please don''t share social media or messaging accounts in chat.';
  end if;
  if s ~ '\m(fuck\w*|f+u+c+k+|shit\w*|bitch\w*|bastard\w*|dick\w*|pussy|cunt\w*|slut\w*|whore\w*|nigg\w*|fagg?\w*|retard\w*|rape\w*|porn\w*|nude\w*|sex\w*|chutiy\w*|madarchod\w*|madharchod\w*|behenchod\w*|bhenchod\w*|benchod\w*|bhosd\w*|gaand\w*|gand\w*|randi\w*|lund\w*|lavde\w*|lodu\w*|harami\w*|kamina\w*)\M' then
    return 'That has words we don''t allow. Please keep it kind.';
  end if;
  -- The strongest words also when spaced or dotted out ("f u c k").
  if regexp_replace(s, '[^a-z]', '', 'g') ~ '(fuck|cunt|nigger|chutiya|madarchod|madharchod|behenchod|bhenchod|bhosdi)' then
    return 'That has words we don''t allow. Please keep it kind.';
  end if;
  return null;
end $$;

-- Chat: the old limits plus the content rules (replaces chat_limit from guilds_chat.sql).
create or replace function public.chat_limit() returns trigger
language plpgsql security definer set search_path = public as $$
declare why text;
begin
  if (select count(*) from guild_messages where user_id = new.user_id and at > now() - interval '1 minute') >= 15 then
    raise exception 'Slow down a little! Wait a moment before sending more.';
  end if;
  if (select count(*) from guild_messages where user_id = new.user_id and at > now() - interval '1 day') >= 400 then
    raise exception 'That''s a lot of chat today! You can send more tomorrow.';
  end if;
  new.body := trim(new.body);
  why := chat_problem(new.body);
  if why is not null then raise exception '%', why; end if;
  return new;
end $$;

-- Guild names follow the same rules.
create or replace function public.guild_name_check() returns trigger
language plpgsql set search_path = public as $$
declare why text := chat_problem(new.name);
begin
  if why is not null then raise exception '%', replace(why, 'in chat', 'in guild names'); end if;
  return new;
end $$;
drop trigger if exists guild_name_check on public.guilds;
create trigger guild_name_check before insert or update of name on public.guilds for each row execute function public.guild_name_check();

-- ───────── Reports: 2 different members reporting a message hides it ─────────
create table if not exists public.chat_reports (
  message_id    bigint references public.guild_messages on delete set null,
  reporter      uuid not null default auth.uid() references auth.users on delete cascade,
  guild_id      uuid,
  reported_user uuid,
  body          text,
  reason        text check (reason is null or char_length(reason) <= 200),
  at            timestamptz not null default now(),
  unique (message_id, reporter)
);
create index if not exists chat_reports_msg on public.chat_reports (message_id);
create index if not exists chat_reports_reporter on public.chat_reports (reporter, at);
alter table public.chat_reports enable row level security;   -- no read policy: only you, in the dashboard
revoke all on public.chat_reports from anon, authenticated;

-- Report a message (members of its guild only; 20 reports a day each). Keeps a copy of the message so
-- you can review it even after it's deleted.
create or replace function public.report_message(p_message bigint, p_reason text default null)
returns boolean
language plpgsql security definer set search_path = public as $$
declare m guild_messages;
begin
  if auth.uid() is null then raise exception 'Not signed in'; end if;
  select * into m from guild_messages where id = p_message;
  if m.id is null or not is_member(m.guild_id) then return false; end if;
  if m.user_id = auth.uid() then raise exception 'You can delete your own message instead.'; end if;
  if (select count(*) from chat_reports where reporter = auth.uid() and at > now() - interval '1 day') >= 20 then
    raise exception 'You''ve sent a lot of reports today. Thank you! Try again tomorrow.';
  end if;
  insert into chat_reports (message_id, reporter, guild_id, reported_user, body, reason)
    values (m.id, auth.uid(), m.guild_id, m.user_id, m.body, left(p_reason, 200))
    on conflict (message_id, reporter) do nothing;
  return true;
end $$;

-- ───────── Chat with sender codes (for blocking) and reported messages hidden ─────────
-- sender: an anonymous code per player (not their account ID), the same in every guild, so blocking works everywhere.
drop function if exists public.guild_chat(uuid);
create function public.guild_chat(p_guild uuid)
returns table (id bigint, body text, at timestamptz, nickname text, pix int, color int, is_me boolean, can_delete boolean, from_master boolean, sender text)
language sql stable security definer set search_path = public as $$
  select * from (
    select c.id, c.body, c.at, coalesce(p.nickname, 'Old member') as nickname, coalesce(p.pix, 0) as pix, coalesce(p.color, 0) as color,
           c.user_id = auth.uid() as is_me, c.user_id = auth.uid() or g.owner = auth.uid() as can_delete, c.user_id = g.owner as from_master,
           left(md5('cq-sender-' || c.user_id::text), 12) as sender
    from guild_messages c join guilds g on g.id = c.guild_id left join profiles p on p.id = c.user_id
    where c.guild_id = p_guild and is_member(p_guild)
      and (select count(distinct r.reporter) from chat_reports r where r.message_id = c.id) < 2
    order by c.id desc limit 100
  ) latest order by id;
$$;
revoke all on function public.guild_chat(uuid), public.report_message(bigint, text), public.chat_problem(text) from public, anon;
grant execute on function public.guild_chat(uuid), public.report_message(bigint, text) to authenticated;

-- For you: every reported message, newest first, with how many people reported it and whether it's hidden.
create or replace view insights.chat_reports as
select max(r.at) as last_reported, count(distinct r.reporter) as reports, count(distinct r.reporter) >= 2 as hidden,
       g.name as guild, coalesce(p.nickname, '(deleted player)') as sender, max(r.body) as message,
       string_agg(distinct r.reason, ' | ') as reasons, r.message_id, r.reported_user
from public.chat_reports r left join public.guilds g on g.id = r.guild_id left join public.profiles p on p.id = r.reported_user
group by r.message_id, r.reported_user, g.name, p.nickname
order by last_reported desc;
revoke all on all tables in schema insights from public, anon, authenticated;

-- ───────── Old data deletes itself ─────────
-- Play data and chat after 12 months; feedback and reports after 24 (see the Privacy Policy).
create or replace function public.cleanup_old_data() returns void
language sql security definer set search_path = public as $$
  delete from events where at < now() - interval '12 months';
  delete from guild_messages where at < now() - interval '12 months';
  delete from feedback where at < now() - interval '24 months';
  delete from chat_reports where at < now() - interval '24 months';
  delete from guild_tries where at < now() - interval '2 days';
$$;
revoke all on function public.cleanup_old_data() from public, anon, authenticated;

-- Runs now and then while people play (about once every 500 play events), so no scheduler is needed.
create or replace function public.events_limit() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from events where user_id = new.user_id and at > now() - interval '10 minutes') >= 200
  or (select count(*) from events where user_id = new.user_id and at > now() - interval '1 day') >= 2000
  then return null; end if;
  if random() < 0.002 then perform cleanup_old_data(); end if;
  return new;
end $$;
