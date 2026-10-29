-- Code Quest backend: say who the Guild Master (owner) is, on the board and in chat.
-- Run after guilds_chat.sql: SQL Editor → New query → paste this whole file → Run. Safe to run again,
-- and safe while people play (the older game version ignores the new column).

-- A function's columns can't change in place, so these are dropped and made again.
drop function if exists public.guild_board();
drop function if exists public.guild_board_for(uuid);
drop function if exists public.guild_chat(uuid);

-- One guild's board, or (no guild given) everyone from all my guilds once each, for the map.
-- is_master: this player owns that guild (always false on the all-guilds list).
create function public.guild_board_for(p_guild uuid default null)
returns table (nickname text, pix int, color int, xp int, stars int, streak int, cur text, levels_done int, last_played date, is_me boolean, is_master boolean)
language sql stable security definer set search_path = public as $$
  select p.nickname, p.pix, p.color, p.xp, p.stars, p.streak, p.cur, p.levels_done, p.last_played, p.id = auth.uid(),
         p_guild is not null and exists (select 1 from guilds g where g.id = p_guild and g.owner = p.id)
  from profiles p
  where p.id in (select m.user_id from guild_members m
                 where m.guild_id in (select me.guild_id from guild_members me where me.user_id = auth.uid())
                   and (p_guild is null or m.guild_id = p_guild))
  order by p.xp desc
  limit 100;
$$;

-- The older game's board (same columns as before).
create function public.guild_board()
returns table (nickname text, pix int, color int, xp int, stars int, streak int, cur text, levels_done int, last_played date, is_me boolean)
language sql stable security definer set search_path = public as $$
  select b.nickname, b.pix, b.color, b.xp, b.stars, b.streak, b.cur, b.levels_done, b.last_played, b.is_me
  from guild_board_for(null) b limit 50;
$$;

-- The latest 100 messages of a guild, with each sender's nickname and hero, and whether they're its master.
create function public.guild_chat(p_guild uuid)
returns table (id bigint, body text, at timestamptz, nickname text, pix int, color int, is_me boolean, can_delete boolean, from_master boolean)
language sql stable security definer set search_path = public as $$
  select * from (
    select c.id, c.body, c.at, coalesce(p.nickname, 'Old member') as nickname, coalesce(p.pix, 0) as pix, coalesce(p.color, 0) as color,
           c.user_id = auth.uid() as is_me, c.user_id = auth.uid() or g.owner = auth.uid() as can_delete, c.user_id = g.owner as from_master
    from guild_messages c join guilds g on g.id = c.guild_id left join profiles p on p.id = c.user_id
    where c.guild_id = p_guild and is_member(p_guild)
    order by c.id desc limit 100
  ) latest order by id;
$$;

revoke all on function public.guild_board(), public.guild_board_for(uuid), public.guild_chat(uuid) from public, anon;
grant execute on function public.guild_board(), public.guild_board_for(uuid), public.guild_chat(uuid) to authenticated;
