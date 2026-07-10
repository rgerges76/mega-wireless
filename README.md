# Mega Wireless Secure Foundation

This package starts the secure production build.

## What is implemented
- Public website with the owner photo restored in the hero.
- Phones, speakers, carrier plans, services, hours and rewards sections.
- Secure admin login scaffold using Supabase Auth.
- PostgreSQL schema for products, customers, repair tickets, sales, employees and audit logs.
- Row Level Security policies by role: admin, manager, cashier and technician.
- No customer data is stored in browser localStorage.

## Setup
1. Create a Supabase project.
2. Open SQL Editor and run `supabase/001_schema.sql`.
3. Copy `config.example.js` to `config.js`.
4. Add the Supabase Project URL and public anon key to `config.js`.
5. Create the first employee in Supabase Authentication.
6. Insert a matching row in `public.profiles` with role `admin`.
7. Upload the entire folder to the GitHub repository connected to Netlify.

## Important
The public anon key is safe to expose only because RLS protects the database. Never expose the service-role key.
Do not enter real customer information until Supabase is connected and the RLS tests pass.
