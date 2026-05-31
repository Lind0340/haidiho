-- Terms agreement tracking for profiles and story submissions

alter table public.profiles
  add column if not exists terms_agreed boolean not null default false,
  add column if not exists terms_agreed_at timestamptz;

alter table public.story_submissions
  add column if not exists terms_agreed boolean not null default false,
  add column if not exists terms_agreed_at timestamptz;
