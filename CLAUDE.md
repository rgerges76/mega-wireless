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
- 2026-11-08: POS receipt (public/pos.html #receipt) now prints a Return & Warranty Policy block under "Thank you". Owner: do NOT change receipt size (80mm page / 72mm width) — it fits the store thermal printer exactly.
- 2026-11-01: Owner did NOT like the animated mascot hero or the cartoon SVG accessory illustrations. Hero visual restored to the original 3D AI image (cracked phone → "Like New", inside .hero2 .hero-art; mascot markup removed, its JS guarded with if(!m)return). /phones/ accessories section restored to plain text cards. Prefer realistic 3D/photo visuals over cartoon/flat illustrations.
- 2026-10-31 (launch): Campaign #1 = 'Worst Cracked Screen in Nashville' contest. Page public/contest.html (EN/ES/AR, Netlify form 'cracked-screen-contest' with photo upload, rules: Nov 1–30 2026, winner picked by Mega team, announced Dec 2 on FB/IG, prize free standard screen replacement up to $130, claim by Dec 31). Homepage has animated announcement bar to it. Print QR short links in public/_redirects: /win (flyer → contest), /window (window poster → home), /scan (counter). analytics.js path allowlist extended to new pages.
- 2026-10-31 (night): Hero visual is now an original animated mascot (pure SVG/CSS in index.html #mascot): cracked phone crying under a rain cloud -> Mega tool sweep + flash -> repaired phone ties a coin hip-scarf and belly-dances with confetti/music notes; loops (sad 3.4s / fix 1.4s / happy 5.2s), 'Fix me!' button, pauses offscreen, static happy for reduced-motion. Shown first on mobile. Replaced the drag-to-repair phone.
- 2026-10-31 (evening): Signature redesign — owner wants a distinctive, non-template, engaging site. Concept "Your phone deserves a comeback" (crack → signal pulse). Homepage hero is now an interactive drag-to-repair phone (pure CSS/SVG, old AI hero image with baked "10 MINUTES" removed), live Open/Closed badge (America/Chicago, 10–20), service ticker, 60-second quote picker (#start; prices from /repairs.json, fills the #book form), crack dividers that heal into a pulse on scroll, scroll reveals. /phones/ accessories cards now have custom SVG illustrations in public/images/accessories/ (cases, screen protectors, chargers & cables USB-C/USB-A, audio, prepaid, pickup).
- 2026-10-31: Homepage conversion update from combined AI site reviews: hero CTAs (text/call/directions), "how it works", repair prices (prerendered from public/repairs.json by scripts/prerender.cjs at build), Netlify form "repair-request" (#book), Visit us + map, FAQ + LocalBusiness/FAQ schema, sticky mobile call/text/directions bar. Removed localStorage-only offer box. New static service pages: battery-, water-damage-, camera-, charging-port-repair-nashville.html. Phones page grid + "from $X" prerendered from phones.json. Address standardized to "4717 B Nolensville Pike" (owner confirmed the B, 2026-10-31). Real store photos in public/images/store/ shown in the Visit us section. Google review link https://g.page/r/CfDfDLKtcJSREBM/review in Visit us + footer. Netlify email notification for all forms -> megawireless4717@gmail.com (tested OK 2026-10-31). Source of truth for prices/warranty/claims: public/ai-knowledge.html (30-day warranty on standard screens, no repair-time promises).
- 2026-10-31: Created this file as phone-friendly memory instead of claude-mem (claude-mem needs a persistent local machine).
