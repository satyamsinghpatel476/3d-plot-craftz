create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text unique,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null,
  short_description text,
  category text not null,
  product_type text not null,
  price numeric(12, 2) not null default 0,
  stock integer not null default 0,
  image_url text,
  material text,
  color text,
  dimensions text,
  rating numeric(3, 2) default 4.6,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.uploaded_models (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  file_name text not null,
  file_url text not null,
  file_size bigint not null,
  material text not null,
  color text not null,
  infill_percentage integer not null check (infill_percentage between 10 and 100),
  hollow_or_solid text not null check (hollow_or_solid in ('Hollow', 'Solid', 'Custom infill')),
  estimated_weight numeric(10, 2),
  estimated_time numeric(10, 2),
  estimated_price numeric(12, 2),
  ai_suggestions jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  order_number text not null unique,
  total_amount numeric(12, 2) not null default 0,
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'cod', 'refunded')),
  order_status text not null default 'pending' check (order_status in ('pending', 'processing', 'printing', 'shipped', 'delivered', 'cancelled')),
  payment_method text not null check (payment_method in ('razorpay', 'cod', 'quote')),
  shipping_name text not null,
  shipping_phone text not null,
  shipping_email text not null,
  shipping_address text not null,
  city text not null,
  state text not null,
  pincode text not null,
  delivery_notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  uploaded_model_id uuid references public.uploaded_models(id) on delete set null,
  quantity integer not null default 1 check (quantity > 0),
  price numeric(12, 2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  razorpay_order_id text,
  razorpay_payment_id text,
  razorpay_signature text,
  amount numeric(12, 2) not null default 0,
  status text not null default 'created',
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text not null,
  material text not null,
  print_time text not null,
  purpose text not null,
  description text not null,
  category text,
  created_at timestamptz not null default now()
);

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved')),
  created_at timestamptz not null default now()
);

create table if not exists public.ai_recommendation_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  input jsonb not null,
  recommendation jsonb not null,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.email,
    new.raw_user_meta_data ->> 'phone',
    'customer'
  )
  on conflict (id) do update
  set full_name = excluded.full_name,
      email = excluded.email,
      phone = excluded.phone;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('stl-files', 'stl-files', true, 52428800, array['model/stl', 'application/sla', 'application/octet-stream']),
  ('product-images', 'product-images', true, 10485760, array['image/png', 'image/jpeg', 'image/webp']),
  ('gallery-images', 'gallery-images', true, 10485760, array['image/png', 'image/jpeg', 'image/webp']),
  ('user-uploads', 'user-uploads', false, 52428800, array['model/stl', 'image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;
