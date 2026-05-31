-- AI pre-screening metadata on moderation queue (run in Supabase SQL editor)

alter table public.moderation_queue
  add column if not exists ai_approved boolean,
  add column if not exists ai_confidence text
    check (ai_confidence is null or ai_confidence in ('high', 'medium', 'low')),
  add column if not exists ai_reason text,
  add column if not exists ai_flags jsonb default '[]'::jsonb,
  add column if not exists ai_pre_approved boolean not null default false,
  add column if not exists needs_human_review boolean not null default false;

create index if not exists idx_moderation_queue_ai_rejected
  on public.moderation_queue (status, created_at desc)
  where status = 'rejected' and ai_approved = false;
