-- ============================================================
-- OtakuBox — Schéma Supabase
-- À exécuter dans l'éditeur SQL de ton projet Supabase
-- ============================================================

-- Extension UUID
create extension if not exists "uuid-ossp";

-- ---- Profiles ----
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  avatar_url text,
  is_premium boolean not null default false,
  premium_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profil visible par son propriétaire"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Profil modifiable par son propriétaire"
  on public.profiles for update
  using (auth.uid() = id);

-- Créer automatiquement le profil à l'inscription
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.raw_user_meta_data ->> 'username');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---- Library Entries ----
create table if not exists public.library_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  mal_id integer,
  mangadex_id text,
  type text not null check (type in ('anime', 'manga', 'webtoon', 'light_novel')),
  title text not null,
  cover_image text not null default '',
  status text not null check (status in ('watching', 'reading', 'completed', 'plan_to_watch', 'on_hold', 'dropped')),
  progress integer not null default 0,
  total integer,
  score integer check (score >= 1 and score <= 10),
  notes text,
  genres text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, mal_id, type),
  unique(user_id, mangadex_id)
);

alter table public.library_entries enable row level security;

create policy "Bibliothèque visible par son propriétaire"
  on public.library_entries for select
  using (auth.uid() = user_id);

create policy "Bibliothèque modifiable par son propriétaire"
  on public.library_entries for all
  using (auth.uid() = user_id);

-- Index pour les performances
create index on public.library_entries(user_id);
create index on public.library_entries(user_id, type);
create index on public.library_entries(user_id, status);
create index on public.library_entries(updated_at desc);

-- Trigger updated_at
create or replace function public.update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger update_library_entries_updated_at
  before update on public.library_entries
  for each row execute procedure public.update_updated_at();

create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at();
