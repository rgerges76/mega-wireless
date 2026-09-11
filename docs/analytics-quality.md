# Analytics release — 2026-09-11

GA4 property 541628759; existing measurement ID G-LR9H4N0S98 retained.

- Shared loader on the homepage, phones landing page and four SEO pages. Only production domains and known public paths load GA4. Unknown SPA fallback paths, admin, owner and previews do not.
- GA config owns the initial page view; legacy growth.js keeps its separate server-side page-view record but does not send a second GA view. Language selection no longer rewrites history or deletes campaign parameters. This does not disable GA's Enhanced Measurement history option in the property.
- All contact anchors use one delegated handler: phone_call_click, whatsapp_click, directions_click. Plan and tablet context is in offer/placement. Old event names are normalized and rapid duplicate contact events suppressed for 1 second. No full contact links or message bodies are sent as custom analytics parameters.
- repair_quote_viewed means a displayed quote, not a submitted request. Historical repair_quote_completed records were also display events; never report them as confirmed leads/bookings. WhatsApp/call clicks are intentions, not completed conversations or sales.
- Staff opt-out is per browser at /staff-analytics.html and reversible. No IP address was guessed; unmarked staff devices can still count. Existing GA4 data is not deleted or rewritten.
- New public entry is not blocked by the repair animation. The showcase remains available by button. Mobile users get persistent call and repair-inquiry links.
- Organic profile links: https://megawirelessusa.com/go/facebook and https://megawirelessusa.com/go/instagram. For individual posts use distinct utm_content values; paid ads must use utm_medium=paid_social. These links were created; no social profile or existing campaign was changed.

## Verification
node --test tests/analytics.test.cjs
npm run build
node scripts/inject-auth-callback-router.cjs

## Remaining account-level limitations
The analytics connector exposes reports, not GA4 admin writes for data filters/key events/timezone. GA4 timezone remains America/Los_Angeles. No conversion was made a bidding goal and no budget changed. Old stats include internal use and potentially repeated views. Verify ingestion after real customer activity; code and browser checks alone are not historical or realtime GA4 proof.
