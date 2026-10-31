# CLAUDE.md — Mega Wireless website

Read this first in every session. It is the persistent memory for this repo.

## About the owner
- Runs Mega Wireless: wireless retail + phone repair (Nashville area).
- Works mostly from the phone (Claude app cloud sessions) — sessions are ephemeral, so anything worth remembering must be written in this file and committed.
- May write in Egyptian Arabic; reply in the same language. Business-facing text (customers, permits, pricing, emails) in clear professional English.

## How to respond
- Concise and practical, no long intros, no long reports unless asked.
- Troubleshooting / technical tasks: ONE step at a time, then wait for the result or screenshot.
- Say exactly where to click and what should appear.
- Inspect screenshots carefully. If unsure, say so — don't guess.
- Don't repeat info the owner already gave.

## Project
- Public website + admin, React/Vite/TypeScript/Tailwind (`src/`), plus static HTML pages (`index.html`, `admin.html`, `pos.html`, `inventory.html`, `leadgen.html`, ...).
- Hosted on Netlify: build `npm run build`, publishes `dist/`. Functions in `netlify/functions/` (`daily-report` and `provider-sync` run hourly).
- Backend: Supabase (schema + RLS in `supabase/00*.sql`). Never put the service-role key in browser files.
- Lead automation (Make, Botpress, SMS/WhatsApp tracking) is documented in `automation/`.
- Related repo: `rgerges76/mega-wireless-pos` (the in-store POS).

## Memory log
Add short dated notes here for decisions, fixes and preferences worth keeping (newest first).
- 2026-10-31: Homepage conversion update from combined AI site reviews: hero CTAs (text/call/directions), "how it works", repair prices (prerendered from public/repairs.json by scripts/prerender.cjs at build), Netlify form "repair-request" (#book), Visit us + map, FAQ + LocalBusiness/FAQ schema, sticky mobile call/text/directions bar. Removed localStorage-only offer box. New static service pages: battery-, water-damage-, camera-, charging-port-repair-nashville.html. Phones page grid + "from $X" prerendered from phones.json. Address standardized to "4717 Nolensville Pike" (no "B") — confirm it matches Google Business Profile. Source of truth for prices/warranty/claims: public/ai-knowledge.html (30-day warranty on standard screens, no repair-time promises).
- 2026-10-31: Created this file as phone-friendly memory instead of claude-mem (claude-mem needs a persistent local machine).
