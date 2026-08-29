# Mega Wireless — Desktop Finish Runbook

## Current state — 2026-08-29
- Botpress AI Agent is published and live on the website.
- Website Webchat is live.
- WhatsApp is connected to Botpress and a real Arabic inbound test passed.
- Facebook Messenger is connected and Meta configuration completed.
- Instagram is connected in Botpress.
- Gmail is connected in Botpress; controlled behavior testing is still recommended before relying on autonomous email handling.
- The approved Botpress knowledge source remains `https://megawirelessusa.com/ai-knowledge.html` and Web Search remains OFF.
- Make custom webhook `Mega Wireless AI Leads` has been created.
- Make captured the Mega Wireless v2 test payload successfully (`data structure captured`).
- The Make scenario is NOT activated yet.
- Google Sheet `Mega Wireless Automation Hub` already exists and is configured.
- Google Sheets headers/configuration and Automation Status have been verified/updated.
- Website repair copy and fallback pricing were aligned with the approved repair rules and `public/repairs.json`.
- Do not change Botpress pricing, knowledge, webchat appearance, language rules, or published behavior while finishing the Make integration.

## Only remaining production work
The remaining work is inside the authenticated Make UI and then one Botpress Ask Vibe lead-delivery action. Do not recreate any existing channel, webhook, spreadsheet, or bot.

## Finish order on desktop

### 1. Open the existing Make scenario
Open the scenario created for `Mega Wireless AI Leads`.
Do not create a second webhook unless the existing webhook is missing.

### 2. Configure Google Sheets connection
Authorize the Google account in Make when prompted.
Select spreadsheet:
- `Mega Wireless Automation Hub`
- Spreadsheet ID: `1-7UeqTO9DaUDjp1VNkI3k1GKCEjXFcC_t39J52HVTns`

### 3. Build router by event_type
Create three branches:
- `sales_lead`
- `repair_lead`
- `human_handoff`

Filters must compare the incoming webhook field `event_type` exactly.

### 4. Map Leads row
Sheet: `Leads`
Columns:
1. Timestamp = `timestamp`
2. Lead ID = generated `MW-YYYYMMDD-HHmmss-<short suffix>`
3. Customer Name = `customer.name`
4. Phone = `customer.phone`
5. Language = `language`
6. Source = `source_channel`
7. Device = `request.device_brand` + `request.device_model`
8. Service / Issue = prefer `request.service`, otherwise `request.issue`
9. Exact Price = `request.exact_price`
10. Status = `New` (or `Human Handoff` on handoff branch)
11. Consent to Contact = `customer.consent_to_contact`
12. Follow-up Due = `follow_up.due_at`
13. Assigned To = blank
14. Conversation Summary = `request.summary`
15. Notes = agent confidence / routing note only

### 5. Map Repair Intake branch
Only for `repair_lead`.
Sheet: `Repair Intake`
Columns:
1. Timestamp = `timestamp`
2. Ticket ID = generated `REP-YYYYMMDD-HHmmss-<short suffix>`
3. Lead ID = same Lead ID generated for Leads row
4. Customer = `customer.name`
5. Phone = `customer.phone`
6. Device = brand + model
7. Service = `request.service`
8. Problem Summary = `request.issue` or `request.summary`
9. Diagnostic Fee = `FREE`
10. Quoted Price = `request.exact_price`
11. Warranty = `30 days` only for approved standard screen replacement; otherwise blank
12. Status = `Pending Diagnostic`
13. Technician = blank
14. Notes = `request.summary`

### 6. Map Follow-up rows
Create a Follow-up row only when:
- `follow_up.required = true`
- AND `customer.consent_to_contact = Yes`

Sheet: `Follow-up`
Columns:
1. Lead ID
2. Customer
3. Phone
4. Device
5. Reason
6. Due
7. Channel
8. Status = `Pending`
9. Last Contact = blank
10. Next Action = `Staff review and contact customer`
11. Notes = request summary

For `human_handoff`, use `agent.handoff_reason` as the Reason.

### 7. Privacy guardrail
Never map or store:
- passwords
- PINs
- OTP / one-time codes
- Apple ID or Google passwords
- card numbers / CVV
- OAuth or access tokens
- account secrets

### 8. Run three tests before activation
Run each as a real webhook test and verify exact Sheet rows:
1. `repair_lead` — iPhone 13 screen, $69.99
2. `sales_lead` — device purchase inquiry
3. `human_handoff` — complaint/refund/warranty exception

Required pass conditions:
- correct branch selected
- correct Google Sheet row created
- no duplicate rows
- same Lead ID reused where required
- no follow-up when consent is No or Not Asked
- no sensitive data stored
- Make execution shows success

### 9. Copy production webhook URL
After Make passes the tests, copy the existing Custom Webhook URL.
Do not post this URL publicly or commit it to GitHub.

### 10. Add Botpress lead-delivery action
Use `automation/botpress-lead-tool-prompt.md` in Ask Vibe, replacing `{{MAKE_WEBHOOK_URL}}` with the production Make webhook URL.
Do not publish immediately.

### 11. Botpress end-to-end tests
In new preview sessions test:
- repair intent
- sales intent
- human handoff
- ordinary FAQ that should NOT become a lead
- customer refusing contact info

Verify Make receives only qualified lead events.

### 12. Production activation
Only after all tests pass:
- save Make scenario
- set schedule to `Immediately as data arrives`
- activate Make scenario
- publish Botpress change once

## Stop conditions
Do not activate/publish if any of these occur:
- wrong repair price
- duplicate lead rows
- follow-up created without consent
- ordinary FAQ converted into a lead
- Botpress asks for phone/name just to answer a question
- sensitive credentials appear in payload or Sheets
- Make reports failed Google Sheets writes
