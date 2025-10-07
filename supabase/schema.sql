-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- PROFILS (miroir de auth.users minimal)
create table if not exists public.profiles (
  id uuid primary key,
  email text unique,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- TRIPS
create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  date timestamptz,
  intention text not null,
  substance text,
  dose text,
  setting text,
  safety_flags text[] default '{}'
);

-- ENTRIES
create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  created_at timestamptz not null default now(),
  phase text not null check (phase in ('T24','T72','T14')),
  mood_scores jsonb not null default '{}',
  body_notes text,
  key_images text[] default '{}',
  insights text,
  action_next text,
  alignment_score int check (alignment_score between 0 and 7)
);

alter table public.entries
  add constraint entries_trip_phase_key unique (trip_id, phase);

-- TAGS
create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  unique (user_id, name)
);

create table if not exists public.trip_tags (
  trip_id uuid not null references public.trips(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (trip_id, tag_id)
);

-- PARTAGE
create table if not exists public.shares (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  target_user_id uuid references public.profiles(id) on delete set null,
  role text not null check (role in ('read','write')),
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

-- RLS activation
alter table public.profiles enable row level security;
alter table public.trips enable row level security;
alter table public.entries enable row level security;
alter table public.tags enable row level security;
alter table public.trip_tags enable row level security;
alter table public.shares enable row level security;

-- Policies
drop policy if exists "read own profile" on public.profiles;
create policy "read own profile" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "insert own profile" on public.profiles;
create policy "insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "update own profile" on public.profiles;
create policy "update own profile" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "trip owner can full" on public.trips;
create policy "trip owner can full" on public.trips
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "shared user can read trips" on public.trips;
create policy "shared user can read trips" on public.trips
  for select using (
    exists (
      select 1 from public.shares s
      where s.trip_id = trips.id
        and s.role in ('read','write')
        and s.target_user_id = auth.uid()
        and (s.expires_at is null or s.expires_at > now())
    )
  );

drop policy if exists "entries owner full" on public.entries;
create policy "entries owner full" on public.entries
  for all using (
    exists (
      select 1 from public.trips t
      where t.id = entries.trip_id
        and t.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.trips t
      where t.id = entries.trip_id
        and t.user_id = auth.uid()
    )
  );

drop policy if exists "entries shared read" on public.entries;
create policy "entries shared read" on public.entries
  for select using (
    exists (
      select 1 from public.shares s
      join public.trips t on t.id = s.trip_id
      where t.id = entries.trip_id
        and s.target_user_id = auth.uid()
        and (s.expires_at is null or s.expires_at > now())
    )
  );

drop policy if exists "tags owner full" on public.tags;
create policy "tags owner full" on public.tags
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "trip_tags owner full" on public.trip_tags;
create policy "trip_tags owner full" on public.trip_tags
  for all using (
    exists (
      select 1 from public.trips t
      where t.id = trip_tags.trip_id
        and t.user_id = auth.uid()
    )
    and exists (
      select 1 from public.tags g
      where g.id = trip_tags.tag_id
        and g.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.trips t
      where t.id = trip_tags.trip_id
        and t.user_id = auth.uid()
    )
    and exists (
      select 1 from public.tags g
      where g.id = trip_tags.tag_id
        and g.user_id = auth.uid()
    )
  );

drop policy if exists "shares owner manage" on public.shares;
create policy "shares owner manage" on public.shares
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists "shares target can read" on public.shares;
create policy "shares target can read" on public.shares
  for select using (target_user_id = auth.uid());

create or replace function public.seed_default_tags(target_user uuid)
returns void
language plpgsql
security definer
as $$
begin
  insert into public.tags (user_id, name)
  select target_user, tag_name
  from (values
    ('family'),
    ('love'),
    ('work'),
    ('forgiveness'),
    ('boundaries'),
    ('body'),
    ('spirituality'),
    ('fear'),
    ('anger'),
    ('joy')
  ) as t(tag_name)
  on conflict do nothing;
end;
$$;

-- Utilisation après création d’un utilisateur :
-- select public.seed_default_tags('<USER_UUID>');
