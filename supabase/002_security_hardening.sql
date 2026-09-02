-- Apply in Supabase SQL Editor as the database owner.
-- Removes anonymous access to private product columns and tightens staff writes.
begin;

revoke all on public.customers, public.sales, public.sale_items,
  public.repair_tickets, public.time_entries, public.audit_logs from anon;

drop policy if exists "products public website read" on public.products;
revoke select on public.products from anon;

create or replace view public.products_public
with (security_barrier = true)
as select id, sku, name, category, price, quantity, image_url, updated_at
from public.products
where website_visible = true and active = true;

grant select on public.products_public to anon, authenticated;

drop policy if exists "products managers write" on public.products;
create policy "products owner manager write" on public.products for all to authenticated
using (public.current_role() in ('owner','manager'))
with check (public.current_role() in ('owner','manager'));

drop policy if exists "website managers write" on public.website_content;
create policy "website owner manager write" on public.website_content for all to authenticated
using (public.current_role() in ('owner','manager'))
with check (public.current_role() in ('owner','manager'));

drop policy if exists "audit managers read" on public.audit_logs;
create policy "audit owner read" on public.audit_logs for select to authenticated
using (public.current_role() = 'owner');

create or replace function public.protect_owner_role()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  if old.role = 'owner' and new.role <> 'owner' and public.current_role() <> 'owner' then
    raise exception 'Only an owner can change an owner role';
  end if;
  return new;
end $$;

drop trigger if exists protect_owner_role_trigger on public.profiles;
create trigger protect_owner_role_trigger before update of role on public.profiles
for each row execute function public.protect_owner_role();

commit;
