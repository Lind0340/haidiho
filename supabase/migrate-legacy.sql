-- =============================================================================
-- LEGACY MIGRATION ONLY
-- =============================================================================
-- SKIP THIS FILE on a fresh Supabase project (no tables yet).
-- Fresh project → run supabase/schema.sql only.
--
-- Use this ONLY if you already ran the OLD schema (category, published, etc.)
-- =============================================================================

do $$
begin
  if not exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'community_posts'
  ) then
    raise notice 'No legacy community_posts table — nothing to migrate. Run supabase/schema.sql instead.';
    return;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'community_posts'
      and column_name = 'category'
  ) then
    alter table public.community_posts rename column category to room;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'community_posts'
      and column_name = 'likes'
  ) then
    alter table public.community_posts rename column likes to like_count;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'community_posts'
      and column_name = 'comments_count'
  ) then
    alter table public.community_posts rename column comments_count to comment_count;
  end if;

  update public.community_posts
  set status = 'approved'
  where status = 'published';

  update public.community_posts
  set status = 'rejected'
  where status is not null
    and status not in ('pending', 'approved', 'rejected');

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'community_posts'
      and column_name = 'username'
  ) then
    alter table public.community_posts drop column username;
  end if;

  drop policy if exists "community_posts_select_published" on public.community_posts;
  drop policy if exists "community_posts_select_own_pending" on public.community_posts;
  drop policy if exists "community_posts_insert_pending" on public.community_posts;

  raise notice 'Legacy community_posts migration complete. Now run supabase/schema.sql.';
end $$;
