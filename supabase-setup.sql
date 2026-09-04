create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  name text not null,
  price integer not null,
  unit text not null default '개',
  image_url text,
  tag text,
  is_best boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table products enable row level security;

create policy "public can read products"
  on products for select
  using (true);

create policy "authenticated can manage products"
  on products for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
