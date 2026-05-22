-- Manual character replies on neighborhood posts (admin only)

create table if not exists public.character_responses (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  character text not null check (character in ('diho', 'hai', 'bob')),
  content text not null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_character_responses_post_id
  on public.character_responses (post_id);

create index if not exists idx_character_responses_created_at
  on public.character_responses (created_at desc);

alter table public.character_responses enable row level security;

drop policy if exists character_responses_select_approved on public.character_responses;
create policy character_responses_select_approved on public.character_responses
  for select using (
    exists (
      select 1
      from public.community_posts p
      where p.id = post_id and p.status = 'approved'
    )
  );
