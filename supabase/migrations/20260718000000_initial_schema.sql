-- Initial Supabase schema for Aster Journal
-- Apply this in the Supabase SQL editor or via the Supabase CLI.

create extension if not exists pgcrypto;

-- Keep timestamps current.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Profiles mirror auth users and store app-level preferences.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '',
  avatar_url text,
  bio text not null default '',
  theme text not null default 'dark',
  timezone text not null default 'UTC',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.journal_collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  tone text not null default '',
  summary text not null default '',
  cover_image text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint journal_collections_name_not_blank check (char_length(trim(name)) > 0)
);

create index if not exists journal_collections_user_id_idx
  on public.journal_collections (user_id);

create index if not exists journal_collections_sort_order_idx
  on public.journal_collections (user_id, sort_order, created_at desc);

create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  collection_id uuid references public.journal_collections (id) on delete set null,
  title text not null default '',
  content text not null default '',
  excerpt text not null default '',
  mood text not null default 'calm',
  tags text[] not null default '{}',
  cover_image text not null default '',
  entry_date date not null default current_date,
  word_count integer not null default 0,
  reading_time_minutes integer not null default 1,
  is_pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  constraint journal_entries_title_length check (char_length(title) <= 200),
  constraint journal_entries_mood_check check (
    mood in (
      'still',
      'clear',
      'tender',
      'restless',
      'bright',
      'calm',
      'reflective',
      'hopeful',
      'introspective'
    )
  )
);

create index if not exists journal_entries_user_id_idx
  on public.journal_entries (user_id);

create index if not exists journal_entries_collection_id_idx
  on public.journal_entries (collection_id);

create index if not exists journal_entries_entry_date_idx
  on public.journal_entries (user_id, entry_date desc, created_at desc);

create index if not exists journal_entries_mood_idx
  on public.journal_entries (user_id, mood);

create index if not exists journal_entries_tags_gin_idx
  on public.journal_entries using gin (tags);

create table if not exists public.journal_tags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  slug text not null,
  created_at timestamptz not null default now(),
  constraint journal_tags_name_not_blank check (char_length(trim(name)) > 0),
  constraint journal_tags_slug_not_blank check (char_length(trim(slug)) > 0),
  constraint journal_tags_unique_per_user unique (user_id, slug)
);

create index if not exists journal_tags_user_id_idx
  on public.journal_tags (user_id);

create table if not exists public.journal_entry_tags (
  entry_id uuid not null references public.journal_entries (id) on delete cascade,
  tag_id uuid not null references public.journal_tags (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (entry_id, tag_id)
);

create index if not exists journal_entry_tags_tag_id_idx
  on public.journal_entry_tags (tag_id);

create index if not exists journal_entry_tags_entry_id_idx
  on public.journal_entry_tags (entry_id);

-- Update timestamps on change.
drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_journal_collections_updated_at on public.journal_collections;
create trigger set_journal_collections_updated_at
before update on public.journal_collections
for each row execute function public.set_updated_at();

drop trigger if exists set_journal_entries_updated_at on public.journal_entries;
create trigger set_journal_entries_updated_at
before update on public.journal_entries
for each row execute function public.set_updated_at();

-- Keep a profile row in sync with auth.users.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', ''),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.journal_collections enable row level security;
alter table public.journal_entries enable row level security;
alter table public.journal_tags enable row level security;
alter table public.journal_entry_tags enable row level security;

-- Profiles: users can manage only their own profile.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles
  for select
  using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles
  for insert
  with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Collections: owner-only access.
drop policy if exists "collections_select_own" on public.journal_collections;
create policy "collections_select_own"
  on public.journal_collections
  for select
  using (auth.uid() = user_id);

drop policy if exists "collections_insert_own" on public.journal_collections;
create policy "collections_insert_own"
  on public.journal_collections
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "collections_update_own" on public.journal_collections;
create policy "collections_update_own"
  on public.journal_collections
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "collections_delete_own" on public.journal_collections;
create policy "collections_delete_own"
  on public.journal_collections
  for delete
  using (auth.uid() = user_id);

-- Entries: owner-only access.
drop policy if exists "entries_select_own" on public.journal_entries;
create policy "entries_select_own"
  on public.journal_entries
  for select
  using (auth.uid() = user_id);

drop policy if exists "entries_insert_own" on public.journal_entries;
create policy "entries_insert_own"
  on public.journal_entries
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "entries_update_own" on public.journal_entries;
create policy "entries_update_own"
  on public.journal_entries
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "entries_delete_own" on public.journal_entries;
create policy "entries_delete_own"
  on public.journal_entries
  for delete
  using (auth.uid() = user_id);

-- Tags: owner-only access.
drop policy if exists "tags_select_own" on public.journal_tags;
create policy "tags_select_own"
  on public.journal_tags
  for select
  using (auth.uid() = user_id);

drop policy if exists "tags_insert_own" on public.journal_tags;
create policy "tags_insert_own"
  on public.journal_tags
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "tags_update_own" on public.journal_tags;
create policy "tags_update_own"
  on public.journal_tags
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "tags_delete_own" on public.journal_tags;
create policy "tags_delete_own"
  on public.journal_tags
  for delete
  using (auth.uid() = user_id);

-- Entry/tag links are readable and writable only if the user owns both sides.
drop policy if exists "entry_tags_select_own" on public.journal_entry_tags;
create policy "entry_tags_select_own"
  on public.journal_entry_tags
  for select
  using (
    exists (
      select 1
      from public.journal_entries e
      where e.id = entry_id
        and e.user_id = auth.uid()
    )
  );

drop policy if exists "entry_tags_insert_own" on public.journal_entry_tags;
create policy "entry_tags_insert_own"
  on public.journal_entry_tags
  for insert
  with check (
    exists (
      select 1
      from public.journal_entries e
      join public.journal_tags t on t.id = tag_id
      where e.id = entry_id
        and e.user_id = auth.uid()
        and t.user_id = auth.uid()
    )
  );

drop policy if exists "entry_tags_delete_own" on public.journal_entry_tags;
create policy "entry_tags_delete_own"
  on public.journal_entry_tags
  for delete
  using (
    exists (
      select 1
      from public.journal_entries e
      where e.id = entry_id
        and e.user_id = auth.uid()
    )
  );

-- Helpful comments for future migration work.
comment on table public.profiles is 'User profile and app preferences.';
comment on table public.journal_collections is 'User-defined memory collections.';
comment on table public.journal_entries is 'Primary journal entry records.';
comment on table public.journal_tags is 'User-defined tags for entries.';
comment on table public.journal_entry_tags is 'Many-to-many relation between entries and tags.';
