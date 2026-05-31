-- Full weekly newsletter system (run after migrate-newsletter-composer.sql if needed)

alter table public.newsletter_subscribers
  add column if not exists unsubscribe_token uuid unique default gen_random_uuid();

update public.newsletter_subscribers
  set unsubscribe_token = gen_random_uuid()
  where unsubscribe_token is null;

alter table public.newsletter_issues
  add column if not exists featured_post_ids jsonb default '[]'::jsonb,
  add column if not exists exclusive_type text
    check (exclusive_type is null or exclusive_type in (
      'back_channel', 'hai_entry', 'compliance', 'derek', 'bob'
    )),
  add column if not exists exclusive_content text,
  add column if not exists newsletter_strip_url text,
  add column if not exists mug_member_title text,
  add column if not exists send_failures jsonb default '[]'::jsonb;

-- Mirror newsletter_strip_url from legacy column when present
update public.newsletter_issues
  set newsletter_strip_url = strip_newsletter_image_url
  where newsletter_strip_url is null and strip_newsletter_image_url is not null;
