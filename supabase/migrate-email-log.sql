-- Audit log for transactional emails sent via Resend

create table if not exists public.email_sent_log (
  id uuid primary key default gen_random_uuid(),
  template text not null,
  recipient text not null,
  subject text not null,
  resend_id text,
  error_message text,
  meta jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_email_sent_log_template_created
  on public.email_sent_log (template, created_at desc);

create index if not exists idx_email_sent_log_recipient
  on public.email_sent_log (recipient);

alter table public.email_sent_log enable row level security;

-- Admins only (service role bypasses RLS for inserts from the app)
drop policy if exists email_sent_log_admin_select on public.email_sent_log;
create policy email_sent_log_admin_select on public.email_sent_log
  for select
  using (public.is_admin());
