-- Require signed-in users for story submissions (read feed stays public)

drop policy if exists story_submissions_insert on public.story_submissions;
create policy story_submissions_insert on public.story_submissions
  for insert with check (auth.uid() = user_id and user_id is not null);
