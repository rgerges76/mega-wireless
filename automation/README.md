# Mega Wireless AI Automation

## Target architecture

Customer channels:
- Website chat
- WhatsApp Business
- Facebook Messenger
- Instagram
- Gmail

AI layer:
- Botpress agent as the customer-facing assistant

Automation layer:
- Make for lead routing, logging, notifications, and future POS/repair-system integrations

Operational data layer:
- Google Sheet: **Mega Wireless Automation Hub**
- Spreadsheet ID: `1-7UeqTO9DaUDjp1VNkI3k1GKCEjXFcC_t39J52HVTns`
- Tabs: Leads, Repair Intake, Follow-up, Daily Report, Config, Automation Status

Approved AI business source of truth:
- `https://megawirelessusa.com/ai-knowledge.html`
- Botpress Web Search must remain OFF for business facts.

## Current rollout status — 2026-08-29

### Botpress agent — LIVE
The **Mega Wireless** Botpress agent is published.

Verified behavior:
- Same-language replies tested in Arabic, English, and Spanish.
- Unknown-device-problem flow offers the free initial diagnostic instead of forcing troubleshooting questions.
- Customer is not required to give name/phone just to receive an answer.
- Exact model-specific prices come only from approved knowledge.
- Standard screen policy: high-quality aftermarket parts and 30-day warranty.
- Human-handoff guardrails exist for complaints, refunds, disputes, payment, warranty exceptions, account-specific issues, staff approvals, and uncertainty.

### Website Webchat — LIVE
Botpress Webchat is installed in the production `public/index.html` used by Netlify and is visible on `megawirelessusa.com`.

### WhatsApp — CONNECTED / TESTED
- Existing WhatsApp Business number was disconnected from Gabster and connected to Botpress using Meta OAuth / Business Platform.
- Meta configuration completed successfully.
- Botpress shows WhatsApp Connected.
- Real inbound Arabic customer-style test message was received and the AI reply was verified.
- Keep the WhatsApp Business app active and preserve the current Botpress guardrails.

### Facebook Messenger — CONNECTED
- Meta authorization completed.
- Botpress configuration completed for the selected Facebook page.
- Preserve current bot guardrails and approved knowledge behavior.

### Instagram — CONNECTED
- Botpress channel is connected.
- Preserve current bot guardrails and approved knowledge behavior.

### Gmail — CONNECTED
- Botpress channel is connected.
- Do not rely on autonomous email handling until real channel behavior is verified with controlled tests.

### Knowledge — LIVE
Botpress Website Knowledge contains only the approved public AI knowledge page:
- `https://megawirelessusa.com/ai-knowledge.html`

Whole-site legacy knowledge was removed and Web Search was disabled to prevent stale claims such as incorrect hours, generic `and up` pricing, unsupported timing promises, promotions, or 90-day warranty wording.

### Google Sheets automation hub — READY
Created and configured:
- Leads
- Repair Intake
- Follow-up
- Daily Report
- Config
- Automation Status

Validation lists and owner reporting formulas are configured. Follow-up reporting counts only Pending follow-ups.
The Automation Status sheet was updated on 2026-08-29 to reflect the connected WhatsApp, Instagram, Messenger, and Gmail channels.

### Make automation — WEBHOOK CREATED / MAPPING PENDING
Completed:
- Existing Make scenario opened/created for Mega Wireless AI leads.
- Custom Webhook named **Mega Wireless AI Leads** created.
- Mega Wireless v2 repair-lead test payload sent.
- Make confirmed: **data structure captured**.
- Scenario remains inactive, which is correct until mapping and end-to-end tests pass.

Prepared files:
- `automation/lead-payload-v2.json`
- `automation/make-maia-prompt.md`
- `automation/make-test-payloads.md`
- `automation/botpress-lead-tool-prompt.md`
- `automation/desktop-finish-runbook.md`
- legacy contract: `automation/make-lead-contract.json`

Remaining account-UI work:
1. Authorize/configure Google Sheets in the existing Make scenario.
2. Map webhook fields to `Mega Wireless Automation Hub`.
3. Route `sales_lead`, `repair_lead`, and `human_handoff` by exact `event_type`.
4. Run repair, sales, and human-handoff webhook tests.
5. Confirm no duplicate rows and no follow-up without consent.
6. Copy the private production Make webhook URL.
7. Use `automation/botpress-lead-tool-prompt.md` to create the Botpress lead-delivery action.
8. Test Botpress → Make → Sheets before publishing the lead-delivery change.
9. Activate Make with **Immediately as data arrives** only after all tests pass.

## Core lead routing

### sales_lead
Botpress → Make Webhook → Leads

### repair_lead
Botpress → Make Webhook → Leads + Repair Intake

### human_handoff
Botpress → Make Webhook → Leads (Human Handoff) + Follow-up only when contact consent is Yes

## Consent rule
Never create automatic outbound follow-up unless the customer clearly agrees to later contact. Store consent as Yes, No, or Not Asked.

## Production release gate for Make
Do not consider the Make integration production-ready until:
1. Custom Webhook receives the v2 payload.
2. Google Sheets rows map correctly.
3. Repair leads create both Leads and Repair Intake rows.
4. Human handoff creates a Follow-up row only when consent is Yes.
5. A failed Sheets write remains visible as a failed Make execution.
6. Botpress never claims a lead was delivered when the webhook fails.
7. Ordinary FAQ chats do not create leads.
8. Sensitive credentials are never stored.

## POS / repairs backend
Do not claim live inventory, repair status, order status, or completed POS actions until a controlled cloud backend exists. Browser-local POS data is not a reliable multi-device source of truth.

## Security rule
Credentials, access codes, OAuth codes/tokens, API keys, passwords, PINs, OTPs, payment information, CVVs, and one-time verification codes must never be committed to GitHub, placed in customer-facing knowledge, or sent in automation lead payloads.
