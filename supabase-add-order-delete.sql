create policy "authenticated can delete orders"
  on orders for delete
  using (auth.role() = 'authenticated');
