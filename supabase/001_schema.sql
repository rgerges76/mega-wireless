
-- Mega Wireless production schema
create extension if not exists pgcrypto;

create type public.user_role as enum ('owner','manager','cashier','technician');
create type public.payment_method as enum ('cash','card');
create type public.repair_status as enum ('received','diagnosing','waiting_parts','in_progress','ready','completed','cancelled');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role public.user_role not null default 'cashier',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  sku text unique,
  barcode text,
  name text not null,
  category text not null default 'Accessories',
  cost numeric(12,2) not null default 0 check (cost >= 0),
  price numeric(12,2) not null default 0 check (price >= 0),
  minimum_price numeric(12,2) not null default 0 check (minimum_price >= 0),
  quantity integer not null default 0,
  low_stock_threshold integer not null default 5,
  image_url text,
  website_visible boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  phone text unique,
  email text,
  points integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.sales (
  id uuid primary key default gen_random_uuid(),
  receipt_number bigint generated always as identity unique,
  cashier_id uuid not null references public.profiles(id),
  customer_id uuid references public.customers(id),
  subtotal numeric(12,2) not null,
  tax numeric(12,2) not null default 0,
  total numeric(12,2) not null,
  payment_method public.payment_method not null,
  card_last4 text check (card_last4 is null or card_last4 ~ '^[0-9]{4}$'),
  created_at timestamptz not null default now()
);

create table public.sale_items (
  id uuid primary key default gen_random_uuid(),
  sale_id uuid not null references public.sales(id) on delete cascade,
  product_id uuid not null references public.products(id),
  quantity integer not null check (quantity > 0),
  unit_price numeric(12,2) not null,
  unit_cost numeric(12,2) not null,
  line_total numeric(12,2) not null
);

create table public.repair_tickets (
  id uuid primary key default gen_random_uuid(),
  ticket_number bigint generated always as identity unique,
  customer_id uuid references public.customers(id),
  device text not null,
  serial_or_imei text,
  issue text not null,
  estimated_price numeric(12,2),
  final_price numeric(12,2),
  technician_id uuid references public.profiles(id),
  status public.repair_status not null default 'received',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.time_entries (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.profiles(id),
  clock_in timestamptz not null default now(),
  clock_out timestamptz
);

create table public.website_content (
  key text primary key,
  value jsonb not null,
  updated_by uuid references public.profiles(id),
  updated_at timestamptz not null default now()
);

create table public.audit_logs (
  id bigint generated always as identity primary key,
  user_id uuid references public.profiles(id),
  action text not null,
  entity text not null,
  entity_id text,
  details jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.current_role()
returns public.user_role
language sql stable security definer set search_path=public
as $$ select role from public.profiles where id = auth.uid() and active = true $$;

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.customers enable row level security;
alter table public.sales enable row level security;
alter table public.sale_items enable row level security;
alter table public.repair_tickets enable row level security;
alter table public.time_entries enable row level security;
alter table public.website_content enable row level security;
alter table public.audit_logs enable row level security;

create policy "profiles self read" on public.profiles for select using (id = auth.uid() or public.current_role() in ('owner','manager'));
create policy "profiles owner manage" on public.profiles for all using (public.current_role()='owner') with check (public.current_role()='owner');

create policy "products public website read" on public.products for select using (website_visible = true and active = true);
create policy "products staff read" on public.products for select to authenticated using (public.current_role() is not null);
create policy "products managers write" on public.products for all to authenticated
using (public.current_role() in ('owner','manager')) with check (public.current_role() in ('owner','manager'));

create policy "customers staff read" on public.customers for select to authenticated using (public.current_role() is not null);
create policy "customers staff insert" on public.customers for insert to authenticated with check (public.current_role() is not null);
create policy "customers managers update" on public.customers for update to authenticated
using (public.current_role() in ('owner','manager')) with check (public.current_role() in ('owner','manager'));

create policy "sales staff read" on public.sales for select to authenticated using (public.current_role() is not null);
create policy "sales cashier insert" on public.sales for insert to authenticated with check (cashier_id=auth.uid());
create policy "sale items staff read" on public.sale_items for select to authenticated using (public.current_role() is not null);

create policy "repairs staff read" on public.repair_tickets for select to authenticated using (public.current_role() is not null);
create policy "repairs staff insert" on public.repair_tickets for insert to authenticated with check (public.current_role() is not null);
create policy "repairs update scoped" on public.repair_tickets for update to authenticated
using (public.current_role() in ('owner','manager') or technician_id=auth.uid())
with check (public.current_role() in ('owner','manager') or technician_id=auth.uid());

create policy "time own read" on public.time_entries for select to authenticated
using (employee_id=auth.uid() or public.current_role() in ('owner','manager'));
create policy "time own write" on public.time_entries for insert to authenticated with check (employee_id=auth.uid());
create policy "time own update" on public.time_entries for update to authenticated using (employee_id=auth.uid());

create policy "website public read" on public.website_content for select using (true);
create policy "website managers write" on public.website_content for all to authenticated
using (public.current_role() in ('owner','manager')) with check (public.current_role() in ('owner','manager'));

create policy "audit managers read" on public.audit_logs for select to authenticated using (public.current_role() in ('owner','manager'));
create policy "audit insert authenticated" on public.audit_logs for insert to authenticated with check (user_id=auth.uid());

create or replace function public.create_sale(
  p_items jsonb,
  p_tax_enabled boolean,
  p_payment public.payment_method,
  p_card_last4 text default null,
  p_customer_id uuid default null
) returns uuid
language plpgsql security definer set search_path=public
as $$
declare
  v_sale_id uuid;
  v_subtotal numeric(12,2):=0;
  v_tax numeric(12,2):=0;
  v_total numeric(12,2):=0;
  v_item jsonb;
  v_product public.products%rowtype;
  v_qty int;
  v_price numeric(12,2);
begin
  if public.current_role() not in ('owner','manager','cashier') then
    raise exception 'Not authorized';
  end if;
  if p_payment='card' and (p_card_last4 is null or p_card_last4 !~ '^[0-9]{4}$') then
    raise exception 'Card last4 required';
  end if;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_qty := (v_item->>'quantity')::int;
    v_price := (v_item->>'unit_price')::numeric;
    select * into v_product from public.products where id=(v_item->>'product_id')::uuid for update;
    if not found or not v_product.active then raise exception 'Invalid product'; end if;
    if v_qty <= 0 or v_product.quantity < v_qty then raise exception 'Insufficient stock for %', v_product.name; end if;
    if v_price < v_product.minimum_price and public.current_role()='cashier' then
      raise exception 'Price below minimum for %', v_product.name;
    end if;
    v_subtotal := v_subtotal + (v_qty*v_price);
  end loop;

  if p_tax_enabled then v_tax := round(v_subtotal*0.0925,2); end if;
  v_total := v_subtotal+v_tax;

  insert into public.sales(cashier_id,customer_id,subtotal,tax,total,payment_method,card_last4)
  values(auth.uid(),p_customer_id,v_subtotal,v_tax,v_total,p_payment,case when p_payment='card' then p_card_last4 else null end)
  returning id into v_sale_id;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_qty := (v_item->>'quantity')::int;
    v_price := (v_item->>'unit_price')::numeric;
    select * into v_product from public.products where id=(v_item->>'product_id')::uuid for update;
    insert into public.sale_items(sale_id,product_id,quantity,unit_price,unit_cost,line_total)
    values(v_sale_id,v_product.id,v_qty,v_price,v_product.cost,v_qty*v_price);
    update public.products set quantity=quantity-v_qty,updated_at=now() where id=v_product.id;
  end loop;

  insert into public.audit_logs(user_id,action,entity,entity_id,details)
  values(auth.uid(),'CREATE','sale',v_sale_id::text,jsonb_build_object('total',v_total,'payment',p_payment));

  return v_sale_id;
end $$;

grant execute on function public.create_sale(jsonb,boolean,public.payment_method,text,uuid) to authenticated;
