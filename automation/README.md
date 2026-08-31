# Mega Wireless AI Automation

## Production architecture

Customer channels:
- Website Webchat
- WhatsApp Business
- Facebook Messenger
- Instagram
- Gmail (connected, but autonomous outbound is NOT approved for production)

AI layer:
- Botpress agent as the customer-facing assistant

Automation layer:
- Make for qualified lead routing, logging, notifications, supplier intake and future POS/repair integrations

Operational data layer:
- Google Sheet: **Mega Wireless Automation Hub**
- Spreadsheet ID: `1-7UeqTO9DaUDjp1VNkI3k1GKCEjXFcC_t39J52HVTns`
- Main tabs include Leads, Repair Intake, Follow-up, Daily Report, Config, Automation Status, Make Blueprint, Prompts, Test Payloads, Inventory, Purchases, Invoice Review, RMA Tracker, Repair Parts Map, Suppliers, Owner Dashboard, Stock Alerts, Ops Checklist, Inventory Movements, Customer Notifications, Purchase Orders, Expenses, Profit Summary, Disputes, Approval Queue, Automation Log, Email Safety Review, Bot Response Policy, Bot QA Tests and Price Gaps.

Approved AI business source of truth:
- `https://megawirelessusa.com/ai-knowledge.html`
- Botpress Web Search must remain OFF for business facts.

## Current rollout status — 2026-08-30

### Botpress agent — LIVE
The **Mega Wireless** Botpress agent is published.

Verified behavior:
- Same-language replies tested in Arabic, English and Spanish.
- Unknown-device-problem flow offers the free initial diagnostic instead of forcing troubleshooting questions.
- Customer is not required to give name/phone just to receive an answer.
- Exact model-specific prices come only from approved knowledge.
- Standard approved screen policy uses high-quality aftermarket parts and a 30-day warranty where explicitly approved.
- Human-handoff guardrails exist for complaints, refunds, disputes, payment, warranty exceptions, account-specific issues, staff approvals and uncertainty.

### Website Webchat — LIVE
Botpress Webchat is installed in the production `public/index.html` used by Netlify and is visible on `megawirelessusa.com`.

### WhatsApp — CONNECTED / TESTED
- Existing WhatsApp Business number was disconnected from Gabster and connected to Botpress using Meta OAuth / Business Platform.
- Meta configuration completed successfully.
- Botpress shows WhatsApp Connected.
- Real inbound Arabic customer-style test message was received and the AI reply was verified.

### Facebook Messenger — CONNECTED
- Meta authorization completed.
- Botpress configuration completed for the selected Facebook page.
- Meta native Instant Reply / Away / FAQ / Contact / Location / Hours automations were disabled to prevent duplicate or conflicting replies.

### Instagram — CONNECTED
- Botpress channel is connected.
- Preserve current bot guardrails and approved knowledge behavior.

### Gmail — CONNECTED BUT AUTONOMOUS OUTBOUND IS UNSAFE
A Gmail safety audit found AI support replies sent to non-customer automated recipients, including bank alerts, Google security alerts, mailer-daemon notices, newsletters, supplier broadcasts and other automated senders.

Current safety state:
- Label `Mega Wireless/Automation Review` contains 111 messages as of the 2026-08-30 review.
- No autonomous Gmail outbound should be considered production-safe until the Botpress Gmail channel is disabled or restricted to verified customer-only routing.
- Non-customer email should be ignored or handled draft-first for owner review.
- Never auto-reply to banks, financial alerts, account/security alerts, OTP/verification emails, mailer-daemon, no-reply senders, marketing/newsletters or supplier broadcasts.

### Bot response quality — PATCH PREPARED
The Automation Hub contains `Bot Response Policy` and `Bot QA Tests`.
Required production behavior:
- Answer the actual question in the first sentence.
- Default to 2–4 short sentences.
- Do not push free diagnostic when the customer only asks for a straightforward known price.
- Never guess an exact price.
- Do not ask for contact information merely to answer a question.
- One relevant next step maximum.
- 30-day warranty only when explicitly approved for the exact standard screen service.

The prepared prompt is in the `Prompts` sheet and must be applied inside Botpress before final QA/publish.

## Inventory / purchasing operations hub — CORE BUILT
Created and configured:
- Inventory
- Purchases
- Invoice Review
- RMA Tracker
- Repair Parts Map
- Suppliers
- Owner Dashboard
- Stock Alerts
- Ops Checklist
- Inventory Movements
- Customer Notifications
- Purchase Orders
- Expenses
- Profit Summary
- Disputes
- Approval Queue
- Automation Log

Safety gates:
- Historical supplier invoices never increase current stock automatically.
- Seeded supplier SKUs require a physical baseline count first.
- Repair-parts deduction must use the exact SKU actually installed; never infer when multiple grades exist.
- Purchasing, payments, banking/vendor onboarding and other money-risk actions remain owner-approved.

### Supplier invoice intake — STAGED
Three Mobilenzo invoices were extracted and staged.
- `INV/2026/22731`: source PDF verified on 2026-08-30. Invoice dated 08/17/2026 is Open; Total $301.58; Paid $186.31; Balance Due $115.27. No automatic payment is allowed.
- `INV/2026/20782`: historical / paid; quantities must not change current stock until physical count.
- `INV/2026/20077`: historical / paid; quantities must not change current stock until physical count.

### Price gaps
Approved exact model prices remain authoritative. Missing prices are intentionally left blank.
Current high-priority gap:
- iPhone 13 Pro Max Screen Replacement — no approved exact selling price. Bot must not guess or derive retail price from supplier part cost.

## Make automation — TEST PROTOTYPE EXISTS / DO NOT ACTIVATE
A safe inactive clone exists:
- **Mega Wireless AI Leads - TEST**

Actual TEST state reached on 2026-08-30:
- Webhook: `mega-wireless-leads-test`
- Captured fields: `customer_name`, `phone`, `email`, `message`, `source`
- Router with three keyword-filter branches:
  - sales-like messages
  - repair-like messages
  - human-handoff-like messages
- Sales branch contains OpenAI `Create a Completion`
  - Connection: `OpenAI account`
  - Model: `gpt-4o-mini`
  - Temperature: `0.2`
  - Max Tokens: `250`

This current keyword prototype is **NOT production-compatible** with the approved contract v2 and must remain inactive.

### Required Make cutover
Before activation, convert the TEST scenario to the documented contract v2:
1. Webhook must capture the structured v2 payload.
2. Router must compare `event_type` exactly:
   - `sales_lead`
   - `repair_lead`
   - `human_handoff`
3. Map exact v2 fields to `Mega Wireless Automation Hub`.
4. Repair leads create Leads + Repair Intake rows.
5. Human handoff creates Follow-up only when consent rules pass.
6. Run the three payloads in the `Test Payloads` sheet.
7. Confirm no duplicates, no unconsented follow-up and no failed Sheet writes.
8. Only then copy the private production webhook URL.
9. Apply the Botpress lead-delivery prompt from the `Prompts` sheet.
10. Test Botpress → Make → Sheets end to end.
11. Activate Make only after every release gate passes.

## Consent rule
Never create automatic outbound follow-up unless the customer clearly agrees to later contact. Store consent as Yes, No or Not Asked.

## Production release gate for Make
Do not consider the Make integration production-ready until:
1. Custom Webhook receives the v2 payload.
2. Router uses exact `event_type` values, not keyword matching.
3. Google Sheets rows map correctly.
4. Repair leads create both Leads and Repair Intake rows.
5. Human handoff creates a Follow-up row only when consent is Yes.
6. A failed Sheets write remains visible as a failed Make execution.
7. Botpress never claims a lead was delivered when the webhook fails.
8. Ordinary FAQ chats do not create leads.
9. Sensitive credentials are never stored.
10. All three TEST payloads pass without duplicates.

## Owner / account-UI gates still open
These cannot be auto-approved:
- Physical inventory baseline count for seeded SKUs.
- Make TEST conversion/mapping/testing inside authenticated Make UI.
- Botpress Response Quality Patch + Bot QA Tests inside authenticated Botpress UI.
- Botpress lead-delivery action after Make v2 tests pass.
- Disable/restrict Botpress Gmail autonomous outbound.
- Confirm whether Mobilenzo balance $115.27 is still unpaid before any payment.
- Set an exact iPhone 13 Pro Max screen selling price only if the owner chooses to approve one.
- Wireless Masters ACH/vendor onboarding remains manual because it involves banking data.

## POS / repairs backend
Do not claim live inventory, repair status, order status or completed POS actions until a controlled cloud backend exists. Browser-local POS data is not a reliable multi-device source of truth.

## Security rule
Credentials, access codes, OAuth codes/tokens, API keys, passwords, PINs, OTPs, payment information, CVVs and one-time verification codes must never be committed to GitHub, placed in customer-facing knowledge or sent in automation lead payloads.
