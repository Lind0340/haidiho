-- Mug submission terms agreement (for strip / newsletter use)

alter table public.mug_submissions
  add column if not exists terms_agreed boolean not null default false,
  add column if not exists terms_agreed_at timestamptz;
