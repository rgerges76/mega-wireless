-- Apply as database owner after taking a production database backup.
-- Requires AAL2 (MFA) for sensitive Owner/Manager administration.
begin;

create or replace function public.current_session_aal2()
returns boolean
language sql stable
set search_path=public
as $$ select coalesce(auth.jwt()->>'aal','') = 'aal2' $$;

revoke all on function public.current_role() from anon;
revoke all on function public.current_session_aal2() from anon;
grant execute on function public.current_role(), public.current_session_aal2() to authenticated;

drop policy if exists "profiles owner manage" on public.profiles;
create policy "profiles owner manage with mfa" on public.profiles for all to authenticated
using (public.current_role()='owner' and public.current_session_aal2())
with check (public.current_role()='owner' and public.current_session_aal2());

drop policy if exists "products owner manager write" on public.products;
create policy "products owner manager write with mfa" on public.products for all to authenticated
using (public.current_role() in ('owner','manager') and public.current_session_aal2())
with check (public.current_role() in ('owner','manager') and public.current_session_aal2());

drop policy if exists "website owner manager write" on public.website_content;
create policy "website owner manager write with mfa" on public.website_content for all to authenticated
using (public.current_role() in ('owner','manager') and public.current_session_aal2())
with check (public.current_role() in ('owner','manager') and public.current_session_aal2());

drop policy if exists "audit owner read" on public.audit_logs;
create policy "audit owner read with mfa" on public.audit_logs for select to authenticated
using (public.current_role()='owner' and public.current_session_aal2());

revoke all on public.customers, public.sales, public.sale_items,
  public.repair_tickets, public.time_entries, public.audit_logs from anon;

commit;
