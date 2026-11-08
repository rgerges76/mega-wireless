-- Apply as database owner (Supabase SQL Editor).
-- Stores the customer phone number entered for "payment" items on the sale.
begin;

alter table public.sales add column if not exists customer_phone text;

-- The cashier who rang up the sale can attach the phone right after checkout.
create or replace function public.set_sale_phone(p_sale_id uuid, p_phone text)
returns void
language plpgsql security definer
set search_path=public
as $$
begin
  if p_phone is null or length(p_phone) > 200 then
    raise exception 'Invalid phone';
  end if;
  update public.sales set customer_phone = p_phone
  where id = p_sale_id
    and cashier_id = auth.uid()
    and created_at > now() - interval '15 minutes';
  if not found then
    raise exception 'Sale not found or not editable';
  end if;
end $$;

revoke all on function public.set_sale_phone(uuid, text) from public, anon;
grant execute on function public.set_sale_phone(uuid, text) to authenticated;

commit;
