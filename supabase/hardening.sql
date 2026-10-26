-- Code Quest backend: anti-spam limits, and the "Delete profile" function.
-- Run after schema.sql: Supabase dashboard → SQL Editor → New query → paste this whole file → Run.
-- Safe to run again.
--
-- The game's key is public on purpose (every web game's is), so someone could skip the game and
-- talk to the database directly. These rules hold no matter what they send:
--   • every text and number has a sensible size, so nobody can store huge or silly values
--   • each player can only send so many events, feedback messages and guild tries per hour/day
--   • players who aren't signed in can't touch any table at all

-- ───────── Sizes ─────────
-- "not valid" = applies to every new write without re-checking old rows.
alter table public.profiles drop constraint if exists profiles_sane;
alter table public.profiles add constraint profiles_sane check (
  pix between 0 and 99 and color between 0 and 99
  and xp <= 1000000 and stars <= 10000 and streak <= 10000 and levels_done between 0 and 1000
  and (cur is null or char_length(cur) <= 16)
) not valid;

alter table public.saves drop constraint if exists saves_small;
alter table public.saves add constraint saves_small check (pg_column_size(data) < 200000) not valid;

alter table public.events drop constraint if exists events_sane;
alter table public.events add constraint events_sane check (
  (level is null or char_length(level) <= 32) and (stage is null or char_length(stage) <= 32)
) not valid;

alter table public.feedback drop constraint if exists feedback_sane;
alter table public.feedback add constraint feedback_sane check (
  (level is null or char_length(level) <= 32) and (stage is null or char_length(stage) <= 32)
) not valid;

-- ───────── No access without signing in ─────────
-- (Signed-in players use the "authenticated" role; "anon" is someone with only the public key.)
revoke all on all tables in schema public from anon;
revoke insert, update, delete on public.guilds, public.guild_members from authenticated;
revoke select, update, delete on public.events, public.feedback from authenticated;

-- ───────── Events: at most 200 per 10 minutes and 2000 per day per player ─────────
-- Extra events are quietly dropped (no error), so a spammer just wastes their time.
create index if not exists events_user_at on public.events (user_id, at);
create or replace function public.events_limit() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from events where user_id = new.user_id and at > now() - interval '10 minutes') >= 200
  or (select count(*) from events where user_id = new.user_id and at > now() - interval '1 day') >= 2000
  then return null; end if;
  return new;
end $$;
drop trigger if exists events_limit on public.events;
create trigger events_limit before insert on public.events for each row execute function public.events_limit();

-- ───────── Feedback: at most 5 per 10 minutes and 20 per day per player ─────────
create index if not exists feedback_user_at on public.feedback (user_id, at);
create or replace function public.feedback_limit() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from feedback where user_id = new.user_id and at > now() - interval '10 minutes') >= 5
  or (select count(*) from feedback where user_id = new.user_id and at > now() - interval '1 day') >= 20
  then raise exception 'Thanks for all the feedback! You can send more a bit later.'; end if;
  return new;
end $$;
drop trigger if exists feedback_limit on public.feedback;
create trigger feedback_limit before insert on public.feedback for each row execute function public.feedback_limit();

-- ───────── Guilds: at most 10 join tries per 10 minutes, 5 new guilds per day ─────────
-- Stops anyone guessing guild codes by trying thousands of them.
create table if not exists public.guild_tries (
  user_id uuid not null references auth.users on delete cascade,
  action  text not null,
  at      timestamptz not null default now()
);
create index if not exists guild_tries_user on public.guild_tries (user_id, action, at);
alter table public.guild_tries enable row level security;   -- no policies: only the functions below use it
revoke all on public.guild_tries from anon, authenticated;

create or replace function public.guild_try(p_action text, p_max int, p_window interval, p_msg text)
returns void
language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from guild_tries where user_id = auth.uid() and action = p_action and at > now() - p_window) >= p_max then
    raise exception '%', p_msg;
  end if;
  insert into guild_tries (user_id, action) values (auth.uid(), p_action);
  delete from guild_tries where at < now() - interval '2 days';
end $$;
revoke all on function public.guild_try(text, int, interval, text) from public, anon, authenticated;

create or replace function public.create_guild(p_name text)
returns table (id uuid, name text, code text, is_owner boolean, members int)
language plpgsql security definer set search_path = public as $$
declare v_code text; v_id uuid;
begin
  if auth.uid() is null then raise exception 'Not signed in'; end if;
  if exists (select 1 from guild_members where user_id = auth.uid()) then raise exception 'Leave your current guild first'; end if;
  if char_length(trim(coalesce(p_name, ''))) < 2 then raise exception 'Guild name needs at least 2 letters'; end if;
  perform guild_try('create', 5, interval '1 day', 'You''ve made a lot of guilds today. Try again tomorrow');
  loop
    -- 6 characters with no look-alikes (no 0/O, 1/I/L)
    v_code := (select string_agg(substr('ABCDEFGHJKMNPQRSTUVWXYZ23456789', 1 + floor(random() * 31)::int, 1), '') from generate_series(1, 6));
    exit when not exists (select 1 from guilds where guilds.code = v_code);
  end loop;
  insert into guilds (name, code, owner) values (left(trim(p_name), 32), v_code, auth.uid()) returning guilds.id into v_id;
  insert into guild_members (guild_id, user_id) values (v_id, auth.uid());
  return query select * from my_guild();
end $$;

create or replace function public.join_guild(p_code text)
returns table (id uuid, name text, code text, is_owner boolean, members int)
language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  if auth.uid() is null then raise exception 'Not signed in'; end if;
  perform guild_try('join', 10, interval '10 minutes', 'Too many tries. Wait 10 minutes and check the code with your friend');
  select g.id into v_id from guilds g where g.code = upper(trim(left(coalesce(p_code, ''), 12)));
  -- A wrong code returns nothing instead of an error: an error would undo the try being counted.
  if v_id is null then return; end if;
  if (select count(*) from guild_members where guild_id = v_id) >= 50 then raise exception 'That guild is full (50 players)'; end if;
  delete from guild_members where user_id = auth.uid();
  insert into guild_members (guild_id, user_id) values (v_id, auth.uid()) on conflict do nothing;
  return query select * from my_guild();
end $$;

revoke all on function public.create_guild(text), public.join_guild(text) from public, anon;
grant execute on function public.create_guild(text), public.join_guild(text) to authenticated;

-- ───────── Delete profile: a player erases everything about themselves ─────────
-- Called by the "Delete profile" button. Removes the login, save, guild-board entry, play data and
-- feedback. A guild they started is handed to its longest-standing member, so friends keep it.
create or replace function public.delete_me()
returns void
language plpgsql security definer set search_path = public as $$
declare v_g uuid; v_next uuid; v_me uuid := auth.uid();
begin
  if v_me is null then raise exception 'Not signed in'; end if;
  for v_g in select g.id from guilds g where g.owner = v_me loop
    select m.user_id into v_next from guild_members m where m.guild_id = v_g and m.user_id <> v_me order by m.joined_at limit 1;
    if v_next is not null then update guilds set owner = v_next where guilds.id = v_g; end if;
  end loop;
  begin
    delete from auth.users where id = v_me;   -- every table below is removed with it (on delete cascade)
  exception when insufficient_privilege then
    delete from guild_members where user_id = v_me;
    delete from guilds g where g.owner = v_me;
    delete from events where user_id = v_me;
    delete from feedback where user_id = v_me;
    delete from profiles where id = v_me;
    delete from saves where user_id = v_me;
  end;
end $$;
revoke all on function public.delete_me() from public, anon;
grant execute on function public.delete_me() to authenticated;
