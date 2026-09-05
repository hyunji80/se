create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete set null,
  product_name text not null,
  unit_price integer not null,
  quantity integer not null default 1,
  buyer_name text not null,
  buyer_phone text not null,
  status text not null default '입금대기',
  created_at timestamptz not null default now()
);

alter table orders enable row level security;

create policy "anyone can create an order"
  on orders for insert
  with check (true);

create policy "authenticated can view and manage orders"
  on orders for select
  using (auth.role() = 'authenticated');

create policy "authenticated can update orders"
  on orders for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
