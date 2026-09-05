alter table products add column if not exists image_urls text[] not null default '{}';
alter table orders add column if not exists delivery_method text;
alter table orders add column if not exists group_id uuid;
