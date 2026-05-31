-- =============================================================================
-- Haidiho — complete Supabase schema
-- Run in Supabase Dashboard → SQL Editor (fresh project or after backup).
-- Wade: set your profile role to 'admin' after first signup.
-- =============================================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- Helpers (no table dependencies)
-- -----------------------------------------------------------------------------

create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- CORE: profiles
-- -----------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  bio text,
  role text not null default 'member'
    check (role in ('member', 'moderator', 'admin')),
  mug_submitted boolean not null default false,
  story_submitted boolean not null default false,
  terms_agreed boolean not null default false,
  terms_agreed_at timestamptz,
  joined_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at();

-- Role helpers (must run after profiles table exists)
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.is_moderator_or_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('moderator', 'admin')
  );
$$;

-- -----------------------------------------------------------------------------
-- CORE: community
-- -----------------------------------------------------------------------------

create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  guest_author text,
  room text not null
    check (room in ('water_cooler', 'training_room', 'help_desk')),
  content text not null,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  is_featured boolean not null default false,
  featured_week date,
  like_count integer not null default 0,
  comment_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists community_posts_updated_at on public.community_posts;
create trigger community_posts_updated_at
  before update on public.community_posts
  for each row execute function public.update_updated_at();

create table if not exists public.post_likes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (post_id, user_id)
);

create table if not exists public.post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  like_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists post_comments_updated_at on public.post_comments;
create trigger post_comments_updated_at
  before update on public.post_comments
  for each row execute function public.update_updated_at();

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

-- -----------------------------------------------------------------------------
-- STRIPS
-- -----------------------------------------------------------------------------

create table if not exists public.strips (
  id uuid primary key default gen_random_uuid(),
  strip_number integer unique,
  title text not null,
  slug text unique,
  image_url text not null,
  caption text,
  category text
    check (category in ('main', 'back_channel', 'max_daydream', 'help_desk')),
  inspired_by_post_id uuid references public.community_posts(id) on delete set null,
  inspired_by_member text,
  status text not null default 'draft'
    check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.strip_likes (
  id uuid primary key default gen_random_uuid(),
  strip_id uuid not null references public.strips(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (strip_id, user_id)
);

-- -----------------------------------------------------------------------------
-- MUG WALL (community sharing only — no voting pipeline)
-- -----------------------------------------------------------------------------

create table if not exists public.mug_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  member_name text not null,
  member_title text,
  mug_text text,
  mug_story text,
  image_url text not null,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  is_featured boolean not null default false,
  featured_week date,
  appeared_in_strip_id uuid references public.strips(id) on delete set null,
  terms_agreed boolean not null default false,
  terms_agreed_at timestamptz,
  created_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- STORY SUBMISSIONS
-- -----------------------------------------------------------------------------

create table if not exists public.story_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  submitter_name text not null,
  submitter_email text,
  room text
    check (room in ('water_cooler', 'training_room', 'help_desk')),
  story_content text not null,
  ai_tool_used text,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'turned_into_strip', 'rejected')),
  turned_into_strip_id uuid references public.strips(id) on delete set null,
  moderator_notes text,
  terms_agreed boolean not null default false,
  terms_agreed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.community_posts
  add column if not exists story_submission_id uuid
    references public.story_submissions(id) on delete set null;

create unique index if not exists idx_community_posts_story_submission
  on public.community_posts (story_submission_id)
  where story_submission_id is not null;

-- -----------------------------------------------------------------------------
-- NEWSLETTER
-- -----------------------------------------------------------------------------

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  first_name text,
  unsubscribe_token uuid unique default gen_random_uuid(),
  status text not null default 'active'
    check (status in ('active', 'unsubscribed')),
  source text default 'say_haidiho'
    check (source in ('homepage', 'say_haidiho', 'strip_page', 'neighborhood', 'mug_wall')),
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

create table if not exists public.newsletter_issues (
  id uuid primary key default gen_random_uuid(),
  issue_number integer unique not null,
  title text not null,
  subject_line text,
  preview_text text,
  featured_strip_id uuid references public.strips(id) on delete set null,
  featured_mug_id uuid references public.mug_submissions(id) on delete set null,
  featured_post_id uuid references public.community_posts(id) on delete set null,
  tip_of_week text,
  issue_date date,
  opening_line text,
  strip_site_image_url text,
  strip_newsletter_image_url text,
  strip_page_url text,
  difference_1 text,
  difference_2 text,
  difference_3 text,
  difference_4 text,
  difference_5 text,
  mug_image_url text,
  mug_member_name text,
  mug_story text,
  mug_page_url text,
  neighborhood_excerpt text,
  neighborhood_author text,
  neighborhood_room text,
  neighborhood_page_url text,
  featured_post_ids jsonb default '[]'::jsonb,
  newsletter_strip_url text,
  mug_member_title text,
  exclusive_type text
    check (exclusive_type is null or exclusive_type in (
      'back_channel', 'hai_entry', 'compliance', 'derek', 'bob'
    )),
  exclusive_content text,
  send_failures jsonb default '[]'::jsonb,
  status text not null default 'draft'
    check (status in ('draft', 'scheduled', 'sent')),
  scheduled_at timestamptz,
  sent_at timestamptz,
  subscriber_count integer default 0,
  open_rate numeric,
  created_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- MERCHANDISE (original Haidiho IP only)
-- -----------------------------------------------------------------------------

create table if not exists public.product_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.product_categories(id) on delete restrict,
  name text not null,
  slug text unique not null,
  description text,
  tagline text,
  character text
    check (character in (
      'diho', 'hai', 'derek', 'bob', 'trisha', 'compliance', 'chad', 'max',
      'jessica', 'spark', 'universal'
    )),
  printful_product_id text,
  printify_product_id text,
  base_price numeric(10, 2),
  compare_at_price numeric(10, 2),
  images jsonb default '[]'::jsonb,
  is_featured boolean not null default false,
  status text not null default 'draft'
    check (status in ('draft', 'active', 'sold_out', 'discontinued')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at
  before update on public.products
  for each row execute function public.update_updated_at();

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  sku text unique not null,
  printful_variant_id text,
  printify_variant_id text,
  price numeric(10, 2) not null,
  inventory_type text not null default 'print_on_demand'
    check (inventory_type in ('print_on_demand', 'digital', 'physical')),
  is_available boolean not null default true,
  attributes jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  customer_email text not null,
  customer_name text,
  status text not null default 'pending'
    check (status in (
      'pending', 'processing', 'fulfilled', 'shipped', 'delivered',
      'cancelled', 'refunded'
    )),
  stripe_payment_intent_id text unique,
  stripe_session_id text,
  subtotal numeric(10, 2) not null default 0,
  shipping_cost numeric(10, 2) not null default 0,
  tax numeric(10, 2) not null default 0,
  total numeric(10, 2) not null default 0,
  currency text not null default 'usd',
  shipping_address jsonb,
  printful_order_id text,
  printify_order_id text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists orders_updated_at on public.orders;
create trigger orders_updated_at
  before update on public.orders
  for each row execute function public.update_updated_at();

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  variant_id uuid not null references public.product_variants(id) on delete restrict,
  quantity integer not null default 1 check (quantity > 0),
  unit_price numeric(10, 2) not null,
  total_price numeric(10, 2) not null,
  printful_item_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.digital_downloads (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete restrict,
  order_item_id uuid references public.order_items(id) on delete set null,
  user_id uuid references public.profiles(id) on delete set null,
  customer_email text not null,
  download_url text,
  download_token text unique not null default encode(gen_random_bytes(24), 'hex'),
  download_count integer not null default 0,
  max_downloads integer not null default 5,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.wallpaper_downloads (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete restrict,
  user_id uuid references public.profiles(id) on delete set null,
  customer_email text,
  download_token text unique not null default encode(gen_random_bytes(24), 'hex'),
  tier text not null default 'free'
    check (tier in ('free', 'premium', 'corporate')),
  downloaded_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- ADMIN & MODERATION
-- -----------------------------------------------------------------------------

create table if not exists public.moderation_queue (
  id uuid primary key default gen_random_uuid(),
  content_type text not null
    check (content_type in ('post', 'comment', 'mug', 'story')),
  content_id uuid not null,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  moderator_id uuid references public.profiles(id) on delete set null,
  moderator_notes text,
  reviewed_at timestamptz,
  ai_approved boolean,
  ai_confidence text check (ai_confidence is null or ai_confidence in ('high', 'medium', 'low')),
  ai_reason text,
  ai_flags jsonb default '[]'::jsonb,
  ai_pre_approved boolean not null default false,
  needs_human_review boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value jsonb not null default '{}'::jsonb,
  description text,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

drop trigger if exists site_settings_updated_at on public.site_settings;
create trigger site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.update_updated_at();

create table if not exists public.featured_content (
  id uuid primary key default gen_random_uuid(),
  week_of date unique not null,
  featured_strip_id uuid references public.strips(id) on delete set null,
  featured_mug_id uuid references public.mug_submissions(id) on delete set null,
  featured_post_id uuid references public.community_posts(id) on delete set null,
  featured_story_id uuid references public.story_submissions(id) on delete set null,
  created_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- INDEXES
-- -----------------------------------------------------------------------------

create index if not exists idx_community_posts_room_status_created
  on public.community_posts (room, status, created_at desc);
create index if not exists idx_community_posts_user_id
  on public.community_posts (user_id);
create index if not exists idx_community_posts_is_featured
  on public.community_posts (is_featured) where is_featured = true;

create index if not exists idx_post_likes_post_id on public.post_likes (post_id);
create index if not exists idx_post_comments_post_id on public.post_comments (post_id);

create index if not exists idx_mug_submissions_status_featured
  on public.mug_submissions (status, is_featured);

create index if not exists idx_strips_strip_number on public.strips (strip_number);
create index if not exists idx_strips_status_published
  on public.strips (status, published_at desc);

create index if not exists idx_orders_user_status on public.orders (user_id, status);
create index if not exists idx_orders_stripe_pi on public.orders (stripe_payment_intent_id);
create index if not exists idx_order_items_order_id on public.order_items (order_id);

create index if not exists idx_newsletter_subscribers_email_status
  on public.newsletter_subscribers (email, status);
create index if not exists idx_story_submissions_status
  on public.story_submissions (status);

create index if not exists idx_products_status_featured
  on public.products (status, is_featured);
create index if not exists idx_products_character on public.products (character);
create index if not exists idx_product_variants_product_id
  on public.product_variants (product_id);

create index if not exists idx_moderation_queue_status_created
  on public.moderation_queue (status, created_at desc);
create unique index if not exists idx_moderation_queue_content_unique
  on public.moderation_queue (content_type, content_id);

-- -----------------------------------------------------------------------------
-- TRIGGERS: auth profile, counts, moderation queue
-- -----------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(
      new.raw_user_meta_data->>'display_name',
      new.raw_user_meta_data->>'full_name',
      split_part(new.email, '@', 1)
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.update_post_like_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update public.community_posts
    set like_count = like_count + 1
    where id = new.post_id;
    return new;
  elsif tg_op = 'DELETE' then
    update public.community_posts
    set like_count = greatest(like_count - 1, 0)
    where id = old.post_id;
    return old;
  end if;
  return null;
end;
$$;

drop trigger if exists post_likes_count_insert on public.post_likes;
drop trigger if exists post_likes_count_delete on public.post_likes;
create trigger post_likes_count_insert
  after insert on public.post_likes
  for each row execute function public.update_post_like_count();
create trigger post_likes_count_delete
  after delete on public.post_likes
  for each row execute function public.update_post_like_count();

create or replace function public.update_comment_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update public.community_posts
    set comment_count = comment_count + 1
    where id = new.post_id;
    return new;
  elsif tg_op = 'DELETE' then
    update public.community_posts
    set comment_count = greatest(comment_count - 1, 0)
    where id = old.post_id;
    return old;
  end if;
  return null;
end;
$$;

drop trigger if exists post_comments_count_insert on public.post_comments;
drop trigger if exists post_comments_count_delete on public.post_comments;
create trigger post_comments_count_insert
  after insert on public.post_comments
  for each row execute function public.update_comment_count();
create trigger post_comments_count_delete
  after delete on public.post_comments
  for each row execute function public.update_comment_count();

create or replace function public.enqueue_moderation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_type text;
begin
  if new.status is distinct from 'pending' then
    return new;
  end if;

  v_type := case tg_table_name
    when 'community_posts' then 'post'
    when 'post_comments' then 'comment'
    when 'mug_submissions' then 'mug'
    when 'story_submissions' then 'story'
    else null
  end;

  if v_type is not null then
    insert into public.moderation_queue (content_type, content_id, status)
    values (v_type, new.id, 'pending')
    on conflict (content_type, content_id) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists community_posts_moderation on public.community_posts;
drop trigger if exists post_comments_moderation on public.post_comments;
drop trigger if exists mug_submissions_moderation on public.mug_submissions;
drop trigger if exists story_submissions_moderation on public.story_submissions;

create trigger community_posts_moderation
  after insert on public.community_posts
  for each row execute function public.enqueue_moderation();
create trigger post_comments_moderation
  after insert on public.post_comments
  for each row execute function public.enqueue_moderation();
create trigger mug_submissions_moderation
  after insert on public.mug_submissions
  for each row execute function public.enqueue_moderation();
create trigger story_submissions_moderation
  after insert on public.story_submissions
  for each row execute function public.enqueue_moderation();

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- -----------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.community_posts enable row level security;
alter table public.post_likes enable row level security;
alter table public.post_comments enable row level security;
alter table public.character_responses enable row level security;
alter table public.strips enable row level security;
alter table public.strip_likes enable row level security;
alter table public.mug_submissions enable row level security;
alter table public.story_submissions enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.newsletter_issues enable row level security;
alter table public.product_categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.digital_downloads enable row level security;
alter table public.wallpaper_downloads enable row level security;
alter table public.moderation_queue enable row level security;
alter table public.site_settings enable row level security;
alter table public.featured_content enable row level security;

-- profiles
drop policy if exists profiles_select_public on public.profiles;
create policy profiles_select_public on public.profiles
  for select using (true);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists profiles_update_admin on public.profiles;
create policy profiles_update_admin on public.profiles
  for update using (public.is_admin());

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own on public.profiles
  for insert with check (auth.uid() = id);

-- community_posts
drop policy if exists community_posts_select_approved on public.community_posts;
create policy community_posts_select_approved on public.community_posts
  for select using (
    status = 'approved'
    or auth.uid() = user_id
    or public.is_moderator_or_admin()
  );

drop policy if exists community_posts_insert_auth on public.community_posts;
create policy community_posts_insert_auth on public.community_posts
  for insert with check (
    auth.uid() = user_id
    and status = 'pending'
  );

drop policy if exists community_posts_update_own on public.community_posts;
create policy community_posts_update_own on public.community_posts
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists community_posts_delete_own on public.community_posts;
create policy community_posts_delete_own on public.community_posts
  for delete using (auth.uid() = user_id);

drop policy if exists community_posts_update_staff on public.community_posts;
create policy community_posts_update_staff on public.community_posts
  for update using (public.is_moderator_or_admin());

drop policy if exists community_posts_delete_staff on public.community_posts;
create policy community_posts_delete_staff on public.community_posts
  for delete using (public.is_moderator_or_admin());

-- post_likes
drop policy if exists post_likes_select on public.post_likes;
create policy post_likes_select on public.post_likes for select using (true);

drop policy if exists post_likes_insert on public.post_likes;
create policy post_likes_insert on public.post_likes
  for insert with check (auth.uid() = user_id);

drop policy if exists post_likes_delete on public.post_likes;
create policy post_likes_delete on public.post_likes
  for delete using (auth.uid() = user_id);

-- post_comments
drop policy if exists post_comments_select on public.post_comments;
create policy post_comments_select on public.post_comments
  for select using (
    status = 'approved'
    or auth.uid() = user_id
    or public.is_moderator_or_admin()
  );

drop policy if exists post_comments_insert on public.post_comments;
create policy post_comments_insert on public.post_comments
  for insert with check (auth.uid() = user_id and status = 'pending');

drop policy if exists post_comments_update_own on public.post_comments;
create policy post_comments_update_own on public.post_comments
  for update using (auth.uid() = user_id);

drop policy if exists post_comments_update_staff on public.post_comments;
create policy post_comments_update_staff on public.post_comments
  for update using (public.is_moderator_or_admin());

-- character_responses (public read when parent post approved; writes via service role)
drop policy if exists character_responses_select_approved on public.character_responses;
create policy character_responses_select_approved on public.character_responses
  for select using (
    exists (
      select 1
      from public.community_posts p
      where p.id = post_id and p.status = 'approved'
    )
  );

-- strips (public read published)
drop policy if exists strips_select_published on public.strips;
create policy strips_select_published on public.strips
  for select using (status = 'published' or public.is_moderator_or_admin());

drop policy if exists strips_write_admin on public.strips;
create policy strips_write_admin on public.strips
  for all using (public.is_admin());

-- strip_likes
drop policy if exists strip_likes_select on public.strip_likes;
create policy strip_likes_select on public.strip_likes for select using (true);

drop policy if exists strip_likes_insert on public.strip_likes;
create policy strip_likes_insert on public.strip_likes
  for insert with check (auth.uid() = user_id);

drop policy if exists strip_likes_delete on public.strip_likes;
create policy strip_likes_delete on public.strip_likes
  for delete using (auth.uid() = user_id);

-- mug_submissions
drop policy if exists mug_submissions_select_approved on public.mug_submissions;
create policy mug_submissions_select_approved on public.mug_submissions
  for select using (
    status = 'approved'
    or auth.uid() = user_id
    or public.is_moderator_or_admin()
  );

drop policy if exists mug_submissions_insert on public.mug_submissions;
create policy mug_submissions_insert on public.mug_submissions
  for insert with check (true);

drop policy if exists mug_submissions_update_staff on public.mug_submissions;
create policy mug_submissions_update_staff on public.mug_submissions
  for update using (public.is_moderator_or_admin());

-- story_submissions
drop policy if exists story_submissions_insert on public.story_submissions;
create policy story_submissions_insert on public.story_submissions
  for insert with check (auth.uid() = user_id and user_id is not null);

drop policy if exists story_submissions_select_own on public.story_submissions;
create policy story_submissions_select_own on public.story_submissions
  for select using (
    auth.uid() = user_id
    or public.is_admin()
  );

drop policy if exists story_submissions_select_staff on public.story_submissions;
create policy story_submissions_select_staff on public.story_submissions
  for select using (public.is_moderator_or_admin());

drop policy if exists story_submissions_update_admin on public.story_submissions;
create policy story_submissions_update_admin on public.story_submissions
  for update using (public.is_admin());

-- newsletter_subscribers
drop policy if exists newsletter_subscribers_insert on public.newsletter_subscribers;
create policy newsletter_subscribers_insert on public.newsletter_subscribers
  for insert with check (true);

drop policy if exists newsletter_subscribers_select_admin on public.newsletter_subscribers;
create policy newsletter_subscribers_select_admin on public.newsletter_subscribers
  for select using (public.is_admin());

drop policy if exists newsletter_subscribers_update_admin on public.newsletter_subscribers;
create policy newsletter_subscribers_update_admin on public.newsletter_subscribers
  for update using (public.is_admin());

-- newsletter_issues (admin only)
drop policy if exists newsletter_issues_admin on public.newsletter_issues;
create policy newsletter_issues_admin on public.newsletter_issues
  for all using (public.is_admin());

-- product_categories & products (public read active)
drop policy if exists product_categories_select on public.product_categories;
create policy product_categories_select on public.product_categories
  for select using (is_active = true or public.is_admin());

drop policy if exists product_categories_admin on public.product_categories;
create policy product_categories_admin on public.product_categories
  for all using (public.is_admin());

drop policy if exists products_select_active on public.products;
create policy products_select_active on public.products
  for select using (status = 'active' or public.is_admin());

drop policy if exists products_admin on public.products;
create policy products_admin on public.products
  for all using (public.is_admin());

drop policy if exists product_variants_select on public.product_variants;
create policy product_variants_select on public.product_variants
  for select using (
    exists (
      select 1 from public.products p
      where p.id = product_id and (p.status = 'active' or public.is_admin())
    )
  );

drop policy if exists product_variants_admin on public.product_variants;
create policy product_variants_admin on public.product_variants
  for all using (public.is_admin());

-- orders
drop policy if exists orders_select_own on public.orders;
create policy orders_select_own on public.orders
  for select using (auth.uid() = user_id);

drop policy if exists orders_select_admin on public.orders;
create policy orders_select_admin on public.orders
  for select using (public.is_admin());

drop policy if exists orders_insert on public.orders;
create policy orders_insert on public.orders
  for insert with check (auth.uid() = user_id or user_id is null);

drop policy if exists orders_update_admin on public.orders;
create policy orders_update_admin on public.orders
  for update using (public.is_admin());

-- order_items (via order ownership)
drop policy if exists order_items_select on public.order_items;
create policy order_items_select on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and (o.user_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists order_items_insert on public.order_items;
create policy order_items_insert on public.order_items
  for insert with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and (o.user_id = auth.uid() or public.is_admin())
    )
  );

-- digital_downloads
drop policy if exists digital_downloads_select_own on public.digital_downloads;
create policy digital_downloads_select_own on public.digital_downloads
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists digital_downloads_insert on public.digital_downloads;
create policy digital_downloads_insert on public.digital_downloads
  for insert with check (public.is_admin());

-- wallpaper_downloads
drop policy if exists wallpaper_downloads_select_own on public.wallpaper_downloads;
create policy wallpaper_downloads_select_own on public.wallpaper_downloads
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists wallpaper_downloads_insert on public.wallpaper_downloads;
create policy wallpaper_downloads_insert on public.wallpaper_downloads
  for insert with check (true);

-- moderation_queue
drop policy if exists moderation_queue_staff on public.moderation_queue;
create policy moderation_queue_staff on public.moderation_queue
  for all using (public.is_moderator_or_admin());

-- site_settings (public read safe keys; admin write)
drop policy if exists site_settings_select_public on public.site_settings;
create policy site_settings_select_public on public.site_settings
  for select using (
    key in (
      'mug_wall_purpose', 'merch_source', 'merch_store_active',
      'mug_submissions_open', 'story_submissions_open', 'newsletter_active',
      'featured_week'
    )
    or public.is_admin()
  );

drop policy if exists site_settings_admin on public.site_settings;
create policy site_settings_admin on public.site_settings
  for all using (public.is_admin());

-- featured_content (public read)
drop policy if exists featured_content_select on public.featured_content;
create policy featured_content_select on public.featured_content
  for select using (true);

drop policy if exists featured_content_admin on public.featured_content;
create policy featured_content_admin on public.featured_content
  for all using (public.is_admin());

-- -----------------------------------------------------------------------------
-- STORAGE BUCKETS
-- -----------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('strips', 'strips', true, null, null),
  ('mugs', 'mugs', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('avatars', 'avatars', true, 2097152, array['image/jpeg', 'image/png', 'image/webp']),
  ('products', 'products', true, null, null),
  ('wallpapers', 'wallpapers', true, null, null)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- strips: public read, admin write
drop policy if exists storage_strips_read on storage.objects;
create policy storage_strips_read on storage.objects
  for select using (bucket_id = 'strips');

drop policy if exists storage_strips_write on storage.objects;
create policy storage_strips_write on storage.objects
  for insert with check (bucket_id = 'strips' and public.is_admin());

drop policy if exists storage_strips_update on storage.objects;
create policy storage_strips_update on storage.objects
  for update using (bucket_id = 'strips' and public.is_admin());

drop policy if exists storage_strips_delete on storage.objects;
create policy storage_strips_delete on storage.objects
  for delete using (bucket_id = 'strips' and public.is_admin());

-- mugs: public read, authenticated upload to own folder
drop policy if exists storage_mugs_read on storage.objects;
create policy storage_mugs_read on storage.objects
  for select using (bucket_id = 'mugs');

drop policy if exists storage_mugs_insert on storage.objects;
create policy storage_mugs_insert on storage.objects
  for insert with check (
    bucket_id = 'mugs'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- avatars: own folder only
drop policy if exists storage_avatars_read on storage.objects;
create policy storage_avatars_read on storage.objects
  for select using (bucket_id = 'avatars');

drop policy if exists storage_avatars_insert on storage.objects;
create policy storage_avatars_insert on storage.objects
  for insert with check (
    bucket_id = 'avatars'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists storage_avatars_update on storage.objects;
create policy storage_avatars_update on storage.objects
  for update using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- products: admin write, public read
drop policy if exists storage_products_read on storage.objects;
create policy storage_products_read on storage.objects
  for select using (bucket_id = 'products');

drop policy if exists storage_products_write on storage.objects;
create policy storage_products_write on storage.objects
  for all using (bucket_id = 'products' and public.is_admin());

-- wallpapers: public read (token gating in app layer)
drop policy if exists storage_wallpapers_read on storage.objects;
create policy storage_wallpapers_read on storage.objects
  for select using (bucket_id = 'wallpapers');

drop policy if exists storage_wallpapers_write on storage.objects;
create policy storage_wallpapers_write on storage.objects
  for all using (bucket_id = 'wallpapers' and public.is_admin());

-- -----------------------------------------------------------------------------
-- SEED DATA
-- -----------------------------------------------------------------------------

insert into public.product_categories (name, slug, description, display_order)
values
  ('Mugs', 'mugs', 'Original Haidiho character mugs', 1),
  ('Apparel', 'apparel', 'Tees and wearables', 2),
  ('Stickers', 'stickers', 'Sticker packs and singles', 3),
  ('Prints', 'prints', 'Art prints', 4),
  ('Digital Downloads', 'digital-downloads', 'Wallpapers and digital goods', 5)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  display_order = excluded.display_order;

-- Mugs (draft)
insert into public.products (category_id, name, slug, character, status, base_price)
select c.id, v.name, v.slug, v.character, 'draft', 18.00
from public.product_categories c
cross join (values
  ('Help.', 'help-diho', 'diho'),
  ('Coffee: Survival Fuel', 'coffee-survival-fuel', 'diho'),
  ('Processing...', 'processing-hai', 'hai'),
  ('Processing Positivity', 'processing-positivity', 'hai'),
  ('This Too Shall Pass (Probably by 4pm)', 'this-too-shall-pass', 'bob'),
  ('Done.', 'done-bob', 'bob'),
  ('Reliable. Minimal. Perfect.', 'reliable-minimal-perfect', 'bob'),
  ('Liability Is My Love Language', 'liability-love-language', 'compliance'),
  ('Inbox Zero: A Beautiful Lie', 'inbox-zero-lie', 'universal'),
  ('Coffee: Human Battery', 'coffee-human-battery', 'hai'),
  ('Magic Is A Strategy', 'magic-is-a-strategy', 'spark'),
  ('Neither of them is wrong.', 'neither-wrong', 'universal'),
  ('We''re All In This Together', 'all-in-this-together', 'universal'),
  ('Total: who even knows.', 'total-who-knows', 'diho')
) as v(name, slug, character)
where c.slug = 'mugs'
on conflict (slug) do nothing;

-- Apparel (draft)
insert into public.products (category_id, name, slug, character, status, base_price)
select c.id, v.name, v.slug, v.character, 'draft', 28.00
from public.product_categories c
cross join (values
  ('I Work Hard So My Dog Can Have A Better Life', 'dog-better-life', 'diho'),
  ('Survive Email Meetings Not Cry', 'survive-email-meetings', 'diho'),
  ('Not The Hero We Need. But Here I Am.', 'not-the-hero', 'bob')
) as v(name, slug, character)
where c.slug = 'apparel'
on conflict (slug) do nothing;

-- Digital downloads (draft)
insert into public.products (category_id, name, slug, character, status, base_price)
select c.id, v.name, v.slug, v.character, 'draft', 0.00
from public.product_categories c
cross join (values
  ('Strip 001 "First Day" Desktop Wallpaper', 'strip-001-wallpaper', 'universal'),
  ('Strip 002 "Processing" Desktop Wallpaper', 'strip-002-wallpaper', 'universal'),
  ('Strip 003 "Monday" Desktop Wallpaper', 'strip-003-wallpaper', 'universal'),
  ('Strip 004 "The Help Desk" Desktop Wallpaper', 'strip-004-wallpaper', 'universal'),
  ('Full Cast Group Shot Wallpaper', 'full-cast-wallpaper', 'universal'),
  ('BOB Solo Wallpaper', 'bob-solo-wallpaper', 'bob'),
  ('DiHo At Home Wallpaper', 'diho-at-home-wallpaper', 'diho'),
  ('Hai Solo "People First Always" Wallpaper', 'hai-solo-wallpaper', 'hai')
) as v(name, slug, character)
where c.slug = 'digital-downloads'
on conflict (slug) do nothing;

-- Site settings
insert into public.site_settings (key, value, description)
values
  ('mug_wall_purpose', '"community_sharing_only"', 'Mug wall is display-only community sharing'),
  ('merch_source', '"original_haidiho_ip_only"', 'Merch never derived from community submissions'),
  ('merch_store_active', 'false', 'Hide store until launch'),
  ('mug_submissions_open', 'true', 'Accept mug photo submissions'),
  ('story_submissions_open', 'true', 'Accept story submissions'),
  ('newsletter_active', 'true', 'Newsletter signup enabled'),
  ('featured_week', to_jsonb(date_trunc('week', now())::date::text), 'Current featured week (ISO date)')
on conflict (key) do update set
  value = excluded.value,
  description = excluded.description;

-- -----------------------------------------------------------------------------
-- LEGACY MIGRATION (run only if upgrading from old schema.sql)
-- -----------------------------------------------------------------------------
-- alter table community_posts rename column category to room;
-- update community_posts set status = 'approved' where status = 'published';
-- alter table community_posts drop column if exists username;
-- alter table community_posts rename column likes to like_count;
-- alter table community_posts rename column comments_count to comment_count;
