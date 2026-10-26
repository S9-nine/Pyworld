-- Code Quest backend (Supabase / Postgres).
-- Run once: Supabase dashboard → SQL Editor → New query → paste this whole file → Run.
-- Safe to run again: it only creates what's missing.
-- Then run hardening.sql the same way (size limits and anti-spam).
--
-- Who can see what (Row Level Security is on for every table):
--   profiles, saves      each player reads and writes only their own row
--   guilds, members      changed only through the functions below; players see only their own guild
--   events, feedback     players can add rows but never read them; you read them in the dashboard
-- Players sign in anonymously (no email), one identity per save slot. Store as little as possible:
-- some players are under 18, so never ask for real names, emails or phone numbers here.

-- ───────── Profiles: the small public summary shown on guild boards ─────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users on delete cascade,
  nickname    text not null check (char_length(nickname) between 1 and 24),
  pix         int  not null default 0,
  color       int  not null default 0,
  xp          int  not null default 0 check (xp >= 0),
  stars       int  not null default 0 check (stars >= 0),
  streak      int  not null default 0 check (streak >= 0),
  cur         text,
  levels_done int  not null default 0,
  last_played date,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
alter table public.profiles enable row level security;
drop policy if exists "profiles: read own" on public.profiles;
drop policy if exists "profiles: insert own" on public.profiles;
drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: read own"   on public.profiles for select using (auth.uid() = id);
create policy "profiles: insert own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles: update own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- ───────── Saves: the full game state, one per player ─────────
create table if not exists public.saves (
  user_id    uuid primary key references auth.users on delete cascade,
  data       jsonb not null check (pg_column_size(data) < 500000),
  updated_at timestamptz not null default now()
);
alter table public.saves enable row level security;
drop policy if exists "saves: own" on public.saves;
create policy "saves: own" on public.saves for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ───────── Guilds: a group of players with a join code ─────────
create table if not exists public.guilds (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(name) between 2 and 32),
  code       text not null unique,
  owner      uuid not null references auth.users on delete cascade,
  created_at timestamptz not null default now()
);
create table if not exists public.guild_members (
  guild_id  uuid not null references public.guilds on delete cascade,
  user_id   uuid not null references auth.users on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (guild_id, user_id)
);
create unique index if not exists guild_members_one_guild on public.guild_members (user_id);
alter table public.guilds enable row level security;
alter table public.guild_members enable row level security;
drop policy if exists "guilds: members read" on public.guilds;
drop policy if exists "members: read own" on public.guild_members;
create policy "guilds: members read" on public.guilds for select
  using (exists (select 1 from public.guild_members m where m.guild_id = id and m.user_id = auth.uid()));
create policy "members: read own" on public.guild_members for select using (user_id = auth.uid());

-- ───────── Events: anonymous play data (attempts, mistakes, hints) to improve the game ─────────
create table if not exists public.events (
  id      bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  at      timestamptz not null default now(),
  level   text,
  stage   text,
  kind    text not null check (char_length(kind) <= 24),
  ok      boolean,
  detail  jsonb check (pg_column_size(detail) < 20000)
);
create index if not exists events_level_stage on public.events (level, stage, kind);
alter table public.events enable row level security;
drop policy if exists "events: add own" on public.events;
create policy "events: add own" on public.events for insert with check (user_id = auth.uid());

-- ───────── Feedback: what players tell you from inside the game ─────────
create table if not exists public.feedback (
  id      bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  at      timestamptz not null default now(),
  level   text,
  stage   text,
  rating  int check (rating between 1 and 5),
  message text not null check (char_length(message) between 1 and 2000)
);
alter table public.feedback enable row level security;
drop policy if exists "feedback: add own" on public.feedback;
create policy "feedback: add own" on public.feedback for insert with check (user_id = auth.uid());

-- ───────── Guild functions (the only way to create, join or leave a guild) ─────────
create or replace function public.my_guild()
returns table (id uuid, name text, code text, is_owner boolean, members int)
language sql stable security definer set search_path = public as $$
  select g.id, g.name, g.code, g.owner = auth.uid(), (select count(*)::int from guild_members x where x.guild_id = g.id)
  from guilds g join guild_members m on m.guild_id = g.id
  where m.user_id = auth.uid();
$$;

create or replace function public.create_guild(p_name text)
returns table (id uuid, name text, code text, is_owner boolean, members int)
language plpgsql security definer set search_path = public as $$
declare v_code text; v_id uuid;
begin
  if auth.uid() is null then raise exception 'Not signed in'; end if;
  if exists (select 1 from guild_members where user_id = auth.uid()) then raise exception 'Leave your current guild first'; end if;
  if char_length(trim(coalesce(p_name, ''))) < 2 then raise exception 'Guild name needs at least 2 letters'; end if;
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
  select g.id into v_id from guilds g where g.code = upper(trim(p_code));
  if v_id is null then raise exception 'No guild with that code. Check it and try again'; end if;
  if (select count(*) from guild_members where guild_id = v_id) >= 50 then raise exception 'That guild is full (50 players)'; end if;
  delete from guild_members where user_id = auth.uid();
  insert into guild_members (guild_id, user_id) values (v_id, auth.uid()) on conflict do nothing;
  return query select * from my_guild();
end $$;

create or replace function public.leave_guild()
returns void
language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  delete from guild_members where user_id = auth.uid() returning guild_id into v_id;
  -- An empty guild is removed.
  if v_id is not null and not exists (select 1 from guild_members where guild_id = v_id) then delete from guilds where id = v_id; end if;
end $$;

create or replace function public.guild_board()
returns table (nickname text, pix int, color int, xp int, stars int, streak int, cur text, levels_done int, last_played date, is_me boolean)
language sql stable security definer set search_path = public as $$
  select p.nickname, p.pix, p.color, p.xp, p.stars, p.streak, p.cur, p.levels_done, p.last_played, p.id = auth.uid()
  from guild_members me
  join guild_members m on m.guild_id = me.guild_id
  join profiles p on p.id = m.user_id
  where me.user_id = auth.uid()
  order by p.xp desc
  limit 50;
$$;

revoke all on function public.my_guild(), public.create_guild(text), public.join_guild(text), public.leave_guild(), public.guild_board() from public, anon;
grant execute on function public.my_guild(), public.create_guild(text), public.join_guild(text), public.leave_guild(), public.guild_board() to authenticated;
