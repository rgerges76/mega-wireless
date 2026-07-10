# Mega Wireless Production Foundation V1

This package starts the production Website + POS architecture.

## Included
- Approved public website visual baseline
- Supabase PostgreSQL schema
- Row Level Security
- Owner / Manager / Cashier / Technician roles
- Inventory with cost, price, minimum price, quantity and low-stock threshold
- POS cash/card checkout
- Card last 4 digits only
- Tax toggle
- Cashier price-floor enforcement
- Receipt number generation
- Sales and sale items
- Profit-ready data model
- Repair tickets
- Rewards customers
- Clock in
- Audit log
- Production Admin inventory editor

## Required before it can run
1. Create a Supabase project.
2. Run `supabase/001_schema.sql` in the SQL Editor.
3. Copy `public/config.example.js` to `public/config.js` and fill in:
   - SUPABASE_URL
   - SUPABASE_ANON_KEY
4. Create the owner user in Supabase Authentication.
5. Insert the owner profile row using that user's UUID:
   `insert into public.profiles(id,full_name,role) values ('USER_UUID','Ramy Gerges','owner');`
6. Deploy the `public` folder to Netlify.

## URLs
- Website: `/`
- Admin: `/admin.html`
- POS: `/pos.html`

## Security
- No customer or POS data is stored in localStorage.
- All sensitive records are protected by Supabase Auth + PostgreSQL RLS.
- Never place the Supabase service-role key in browser files.
- Change the password previously shared in chat before production use.

## Current limitation
This is a production foundation, not a fully deployed live system. Deployment requires access to your Supabase and Netlify projects.
