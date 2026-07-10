# Mega Wireless Approved V3.6

## Corrections in this release
- Fixed the Admin email/password login.
- Changed browser storage version so old broken settings cannot interfere.
- Offer buttons now open the correct website section instead of a blank destination.
- Added a customer Mega Rewards registration form using Netlify Forms.
- Rewards customer details are not stored in browser localStorage.
- Admin can edit offer button text and destination.

## Admin
URL: `/admin.html`

Use the email and password already configured for the owner.
Email matching is case-insensitive.

After uploading:
1. Replace every old file with the complete V3.3 package.
2. Confirm `data.json`, `assets/admin.js`, `assets/app.js`, and `admin.html` were replaced.
3. Open the website in a private/incognito window for the first test.
4. Use Ctrl+F5 once after deployment.

## Rewards form
The rewards form uses Netlify Forms.
After deployment, registrations appear under:
Netlify project → Forms → mega-rewards

## Security
This public-content Admin still runs in the browser and is for prices/offers/content only.
Do not put customer lists, IMEI records, payment data, POS transactions, repair tickets, or employee records in the Admin/localStorage.


## V3.4 Rewards correction
- The top navigation Rewards link now opens the customer registration form directly.
- Added a large visible JOIN MEGA REWARDS heading.
- Registration fields: name, phone number, optional email, and consent.
- The form remains connected to Netlify Forms under `mega-rewards`.


## V3.5 New Owner announcement
- Added a professional public banner directly below the hero.
- Message: New Owner. New Look. Same Trusted Service.
- Banner can be enabled, disabled, and edited from:
  Admin → New Owner Banner
- Button text and destination are editable.


## V3.6 HDMI Repair
- Added a dedicated public HDMI repair section.
- Price displayed: $70.
- Supports PlayStation and Xbox.
- Uses the supplied bilingual promotional artwork.
- Editable from Admin → HDMI Repair Promo.
