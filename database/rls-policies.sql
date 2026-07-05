create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.uploaded_models enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.reviews enable row level security;
alter table public.gallery_items enable row level security;
alter table public.support_tickets enable row level security;
alter table public.ai_recommendation_requests enable row level security;

create policy "profiles_select_own_or_admin" on public.profiles
for select using (auth.uid() = id or public.is_admin());

create policy "profiles_insert_own" on public.profiles
for insert with check (auth.uid() = id);

create policy "profiles_update_own_or_admin" on public.profiles
for update using (auth.uid() = id or public.is_admin())
with check (auth.uid() = id or public.is_admin());

create policy "categories_public_read" on public.categories
for select using (true);

create policy "categories_admin_all" on public.categories
for all using (public.is_admin())
with check (public.is_admin());

create policy "products_public_read_active" on public.products
for select using (is_active = true or public.is_admin());

create policy "products_admin_all" on public.products
for all using (public.is_admin())
with check (public.is_admin());

create policy "uploaded_models_owner_read" on public.uploaded_models
for select using (auth.uid() = user_id or public.is_admin());

create policy "uploaded_models_owner_insert" on public.uploaded_models
for insert with check (auth.uid() = user_id);

create policy "uploaded_models_owner_update" on public.uploaded_models
for update using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());

create policy "uploaded_models_owner_delete" on public.uploaded_models
for delete using (auth.uid() = user_id or public.is_admin());

create policy "cart_items_owner_all" on public.cart_items
for all using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "orders_owner_read" on public.orders
for select using (auth.uid() = user_id or public.is_admin());

create policy "orders_owner_insert" on public.orders
for insert with check (auth.uid() = user_id or user_id is null);

create policy "orders_admin_update" on public.orders
for update using (public.is_admin())
with check (public.is_admin());

create policy "order_items_owner_read" on public.order_items
for select using (
  public.is_admin()
  or exists (
    select 1 from public.orders
    where orders.id = order_items.order_id
    and orders.user_id = auth.uid()
  )
);

create policy "order_items_owner_insert" on public.order_items
for insert with check (
  public.is_admin()
  or exists (
    select 1 from public.orders
    where orders.id = order_items.order_id
    and (orders.user_id = auth.uid() or orders.user_id is null)
  )
);

create policy "payments_owner_read" on public.payments
for select using (
  public.is_admin()
  or exists (
    select 1 from public.orders
    where orders.id = payments.order_id
    and orders.user_id = auth.uid()
  )
);

create policy "payments_admin_all" on public.payments
for all using (public.is_admin())
with check (public.is_admin());

create policy "reviews_public_read" on public.reviews
for select using (true);

create policy "reviews_authenticated_insert" on public.reviews
for insert with check (auth.uid() = user_id);

create policy "reviews_owner_update" on public.reviews
for update using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "reviews_owner_or_admin_delete" on public.reviews
for delete using (auth.uid() = user_id or public.is_admin());

create policy "gallery_public_read" on public.gallery_items
for select using (true);

create policy "gallery_admin_all" on public.gallery_items
for all using (public.is_admin())
with check (public.is_admin());

create policy "support_tickets_insert_anyone" on public.support_tickets
for insert with check (true);

create policy "support_tickets_select_owner_or_admin" on public.support_tickets
for select using (public.is_admin() or auth.uid() = user_id);

create policy "support_tickets_admin_update" on public.support_tickets
for update using (public.is_admin())
with check (public.is_admin());

create policy "ai_requests_owner_insert" on public.ai_recommendation_requests
for insert with check (user_id is null or auth.uid() = user_id);

create policy "ai_requests_owner_or_admin_read" on public.ai_recommendation_requests
for select using (public.is_admin() or auth.uid() = user_id);

create policy "storage_public_read" on storage.objects
for select using (bucket_id in ('stl-files', 'product-images', 'gallery-images'));

create policy "storage_authenticated_upload_stl" on storage.objects
for insert with check (
  bucket_id in ('stl-files', 'user-uploads')
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "storage_owner_update_uploads" on storage.objects
for update using (
  bucket_id in ('stl-files', 'user-uploads')
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "storage_owner_delete_uploads" on storage.objects
for delete using (
  bucket_id in ('stl-files', 'user-uploads')
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "storage_admin_all" on storage.objects
for all using (public.is_admin())
with check (public.is_admin());
