-- Newsletter composer fields for weekly React Email issues

alter table public.newsletter_issues
  add column if not exists issue_date date,
  add column if not exists opening_line text,
  add column if not exists strip_site_image_url text,
  add column if not exists strip_newsletter_image_url text,
  add column if not exists strip_page_url text,
  add column if not exists difference_1 text,
  add column if not exists difference_2 text,
  add column if not exists difference_3 text,
  add column if not exists difference_4 text,
  add column if not exists difference_5 text,
  add column if not exists mug_image_url text,
  add column if not exists mug_member_name text,
  add column if not exists mug_story text,
  add column if not exists mug_page_url text,
  add column if not exists neighborhood_excerpt text,
  add column if not exists neighborhood_author text,
  add column if not exists neighborhood_room text,
  add column if not exists neighborhood_page_url text;
