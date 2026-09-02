# Phase 2 secure authorization checklist

The website code is complete without provider credentials. Production account data remains disconnected until the Owner authorizes it.

## Required server-only Netlify environment variables

- `OWNER_EMAIL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GA4_PROPERTY_ID`
- `GOOGLE_SEARCH_CONSOLE_SITE`
- `META_APP_ID`
- `META_APP_SECRET`
- `MARKETING_TOKEN_ENCRYPTION_KEY`
- Optional delivery target: `OWNER_REPORT_WEBHOOK_URL`

Never place these values in `public/`, browser JavaScript, GitHub issues, chat, screenshots, or source maps.

## Official read-only scopes

Google:

- `https://www.googleapis.com/auth/analytics.readonly`
- `https://www.googleapis.com/auth/webmasters.readonly`
- `https://www.googleapis.com/auth/business.manage`

Meta:

- `pages_show_list`
- `pages_read_engagement`
- `read_insights`
- `instagram_basic`
- `instagram_manage_insights`

The Google and Meta consent screens must use the production callback URLs under `https://megawirelessusa.com/.netlify/functions/` and the minimum read-only permissions required for reporting.
