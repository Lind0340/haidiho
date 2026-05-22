-- Link neighborhood stories to the public feed (run once on existing projects)

alter table public.community_posts
  alter column user_id drop not null;

alter table public.community_posts
  add column if not exists guest_author text;

alter table public.community_posts
  add column if not exists story_submission_id uuid
    references public.story_submissions(id) on delete set null;

create unique index if not exists idx_community_posts_story_submission
  on public.community_posts (story_submission_id)
  where story_submission_id is not null;

-- Backfill feed posts for stories that never got a linked community_post
insert into public.community_posts (
  story_submission_id,
  user_id,
  guest_author,
  room,
  content,
  status
)
select
  s.id,
  s.user_id,
  case
    when s.user_id is not null then null
    when trim(s.submitter_name) = '' then 'Neighbor'
    when left(trim(s.submitter_name), 1) = '@' then trim(s.submitter_name)
    when position(' ' in trim(s.submitter_name)) > 0 then trim(s.submitter_name)
    else '@' || trim(s.submitter_name)
  end,
  s.room,
  s.story_content,
  case when s.status in ('approved', 'turned_into_strip') then 'approved' else 'pending' end
from public.story_submissions s
where s.room is not null
  and not exists (
    select 1
    from public.community_posts cp
    where cp.story_submission_id = s.id
  );

-- Publish stories that were waiting on manual approval (AI moderator handles new ones)
update public.story_submissions
set status = 'approved'
where status = 'pending' and room is not null;

update public.community_posts cp
set status = 'approved'
from public.story_submissions s
where cp.story_submission_id = s.id
  and cp.status = 'pending'
  and s.status = 'approved';

update public.moderation_queue
set
  status = 'approved',
  moderator_notes = '[Hai AI moderator] legacy publish on migration',
  reviewed_at = now()
where status = 'pending'
  and content_type in ('story', 'post');
