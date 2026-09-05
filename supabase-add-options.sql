alter table products add column if not exists options jsonb not null default '[]'::jsonb;
alter table products add column if not exists shipping_note text;
alter table orders add column if not exists option_name text;
