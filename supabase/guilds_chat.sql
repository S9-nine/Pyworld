-- Code Quest backend: up to 5 guilds per player, and guild chat.
-- Run after schema.sql, hardening.sql and sessions.sql: SQL Editor → New query → paste → Run.
-- Safe to run again, and safe while people play: the older game version keeps working.
--
-- Chat rules for now (content rules like word filters and reporting come later):
--   • only a guild's members can read or write its chat
--   • messages are 1–500 characters; at most 15 a minute and 400 a day per player
--   • players can delete their own messages; a guild's owner can delete any message in it

-- ───────── Several guilds per player (up to 5) ─────────
drop index if exists public.guild_members_one_guild;
create index if not exists guild_members_user on public.guild_members (user_id);

create or replace function public.is_member(p_guild uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from guild_members where guild_id = p_guild and user_id = auth.uid());
$$;

-- All my guilds, oldest first.
create or replace function public.my_guilds()
returns table (id uuid, name text, code text, is_owner boolean, members int, joined_at timestamptz)
language sql stable security definer set search_path = public as $$
  select g.id, g.name, g.code, g.owner = auth.uid(), (select count(*)::int from guild_members x where x.guild_id = g.id), m.joined_at
  from guilds g join guild_members m on m.guild_id = g.id
  where m.user_id = auth.uid()
  order by m.joined_at;
$$;

create or replace function public.create_guild(p_name text)
returns table (id uuid, name text, code text, is_owner boolean, members int)
language plpgsql security definer set search_path = public as $$
declare v_code text; v_id uuid;
begin
  if auth.uid() is null then raise exception 'Not signed in'; end if;
  if (select count(*) from guild_members where user_id = auth.uid()) >= 5 then raise exception 'You''re in 5 guilds already. Leave one to start another'; end if;
  if char_length(trim(coalesce(p_name, ''))) < 2 then raise exception 'Guild name needs at least 2 letters'; end if;
  perform guild_try('create', 5, interval '1 day', 'You''ve made a lot of guilds today. Try again tomorrow');
  loop
    v_code := (select string_agg(substr('ABCDEFGHJKMNPQRSTUVWXYZ23456789', 1 + floor(random() * 31)::int, 1), '') from generate_series(1, 6));
    exit when not exists (select 1 from guilds where guilds.code = v_code);
  end loop;
  insert into guilds (name, code, owner) values (left(trim(p_name), 32), v_code, auth.uid()) returning guilds.id into v_id;
  insert into guild_members (guild_id, user_id) values (v_id, auth.uid());
  return query select m.id, m.name, m.code, m.is_owner, m.members from my_guilds() m where m.id = v_id;
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
  if not is_member(v_id) then
    if (select count(*) from guild_members where user_id = auth.uid()) >= 5 then raise exception 'You''re in 5 guilds already. Leave one to join another'; end if;
    if (select count(*) from guild_members where guild_id = v_id) >= 50 then raise exception 'That guild is full (50 players)'; end if;
    insert into guild_members (guild_id, user_id) values (v_id, auth.uid());
  end if;
  return query select m.id, m.name, m.code, m.is_owner, m.members from my_guilds() m where m.id = v_id;
end $$;

-- Leave one guild. If the owner leaves, the longest-standing member takes over; an empty guild is removed.
create or replace function public.leave_guild_id(p_guild uuid)
returns void
language plpgsql security definer set search_path = public as $$
declare v_next uuid;
begin
  delete from guild_members where guild_id = p_guild and user_id = auth.uid();
  if not exists (select 1 from guild_members where guild_id = p_guild) then
    delete from guilds where id = p_guild;
  elsif exists (select 1 from guilds where id = p_guild and owner = auth.uid()) then
    select user_id into v_next from guild_members where guild_id = p_guild order by joined_at limit 1;
    update guilds set owner = v_next where id = p_guild;
  end if;
end $$;

-- The older game's "Leave guild" (no guild given): leaves every guild.
create or replace function public.leave_guild()
returns void
language plpgsql security definer set search_path = public as $$
declare v_g uuid;
begin
  for v_g in select guild_id from guild_members where user_id = auth.uid() loop
    perform leave_guild_id(v_g);
  end loop;
end $$;

-- One guild's board, or (no guild given) everyone from all my guilds once each, for the map.
create or replace function public.guild_board_for(p_guild uuid default null)
returns table (nickname text, pix int, color int, xp int, stars int, streak int, cur text, levels_done int, last_played date, is_me boolean)
language sql stable security definer set search_path = public as $$
  select p.nickname, p.pix, p.color, p.xp, p.stars, p.streak, p.cur, p.levels_done, p.last_played, p.id = auth.uid()
  from profiles p
  where p.id in (select m.user_id from guild_members m
                 where m.guild_id in (select me.guild_id from guild_members me where me.user_id = auth.uid())
                   and (p_guild is null or m.guild_id = p_guild))
  order by p.xp desc
  limit 100;
$$;

-- The older game's board: now the same as all my guilds, each player once.
create or replace function public.guild_board()
returns table (nickname text, pix int, color int, xp int, stars int, streak int, cur text, levels_done int, last_played date, is_me boolean)
language sql stable security definer set search_path = public as $$
  select * from guild_board_for(null) limit 50;
$$;

-- ───────── Guild chat ─────────
create table if not exists public.guild_messages (
  id       bigint generated always as identity primary key,
  guild_id uuid not null references public.guilds on delete cascade,
  user_id  uuid not null default auth.uid() references auth.users on delete cascade,
  body     text not null check (char_length(trim(body)) between 1 and 500),
  at       timestamptz not null default now()
);
create index if not exists guild_messages_guild on public.guild_messages (guild_id, id);
create index if not exists guild_messages_user_at on public.guild_messages (user_id, at);
alter table public.guild_messages enable row level security;
drop policy if exists "chat: members read" on public.guild_messages;
drop policy if exists "chat: members write" on public.guild_messages;
drop policy if exists "chat: delete own or as owner" on public.guild_messages;
create policy "chat: members read" on public.guild_messages for select using (is_member(guild_id));
create policy "chat: members write" on public.guild_messages for insert with check (user_id = auth.uid() and is_member(guild_id));
create policy "chat: delete own or as owner" on public.guild_messages for delete
  using (user_id = auth.uid() or exists (select 1 from guilds g where g.id = guild_id and g.owner = auth.uid()));
revoke all on public.guild_messages from anon;
revoke update on public.guild_messages from authenticated;

create or replace function public.chat_limit() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from guild_messages where user_id = new.user_id and at > now() - interval '1 minute') >= 15 then
    raise exception 'Slow down a little! Wait a moment before sending more.';
  end if;
  if (select count(*) from guild_messages where user_id = new.user_id and at > now() - interval '1 day') >= 400 then
    raise exception 'That''s a lot of chat today! You can send more tomorrow.';
  end if;
  new.body := trim(new.body);
  return new;
end $$;
drop trigger if exists chat_limit on public.guild_messages;
create trigger chat_limit before insert on public.guild_messages for each row execute function public.chat_limit();

-- The latest 100 messages of a guild, with each sender's nickname and hero.
create or replace function public.guild_chat(p_guild uuid)
returns table (id bigint, body text, at timestamptz, nickname text, pix int, color int, is_me boolean, can_delete boolean)
language sql stable security definer set search_path = public as $$
  select * from (
    select c.id, c.body, c.at, coalesce(p.nickname, 'Old member'), coalesce(p.pix, 0), coalesce(p.color, 0),
           c.user_id = auth.uid(), c.user_id = auth.uid() or g.owner = auth.uid()
    from guild_messages c join guilds g on g.id = c.guild_id left join profiles p on p.id = c.user_id
    where c.guild_id = p_guild and is_member(p_guild)
    order by c.id desc limit 100
  ) latest order by id;
$$;

-- Live updates: the game listens for new messages (Supabase Realtime still applies the read rule above).
do $$ begin
  alter publication supabase_realtime add table public.guild_messages;
exception when others then null;   -- already added, or Realtime isn't set up
end $$;

revoke all on function public.is_member(uuid), public.my_guilds(), public.leave_guild_id(uuid), public.guild_board_for(uuid), public.guild_chat(uuid) from public, anon;
grant execute on function public.is_member(uuid), public.my_guilds(), public.leave_guild_id(uuid), public.guild_board_for(uuid), public.guild_chat(uuid) to authenticated;
revoke all on function public.create_guild(text), public.join_guild(text), public.leave_guild(), public.guild_board() from public, anon;
grant execute on function public.create_guild(text), public.join_guild(text), public.leave_guild(), public.guild_board() to authenticated;
