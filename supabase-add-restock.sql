create table if not exists restock_requests (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  product_name text not null,
  phone text not null,
  created_at timestamptz not null default now()
);

alter table restock_requests enable row level security;

create policy "anyone can request restock notification"
  on restock_requests for insert
  with check (true);

create policy "authenticated can view restock requests"
  on restock_requests for select
  using (auth.role() = 'authenticated');

create policy "authenticated can delete restock requests"
  on restock_requests for delete
  using (auth.role() = 'authenticated');
