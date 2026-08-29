# Mega Wireless AI Automation

## Target architecture

Customer channels:
- Website chat
- WhatsApp Business
- Facebook Messenger (later)
- Instagram (later)

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

## Current rollout status — 2026-08-28

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

### Make automation — PREPARED / OWNER AUTH REQUIRED
Prepared files:
- `automation/lead-payload-v2.json`
- `automation/make-maia-prompt.md`
- `automation/botpress-lead-tool-prompt.md`
- legacy contract: `automation/make-lead-contract.json`

Required next owner-authorized actions:
1. In Make, create/authorize the Google Sheets connection.
2. Use `automation/make-maia-prompt.md` to build **Mega Wireless AI Lead Router**.
3. Copy the generated Make Custom Webhook URL.
4. In Botpress, use `automation/botpress-lead-tool-prompt.md` after replacing `{{MAKE_WEBHOOK_URL}}`.
5. Test one sales lead, one repair lead, and one human handoff end-to-end.
6. Publish the Botpress automation change only after those tests pass.

### WhatsApp — OWNER AUTH REQUIRED
Connect only after the website lead pipeline passes. Meta/WhatsApp authorization requires the account owner. Test inbound messages, multilingual replies, and human handoff before relying on it for production support.

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

## POS / repairs backend
Do not claim live inventory, repair status, order status, or completed POS actions until a controlled cloud backend exists. Browser-local POS data is not a reliable multi-device source of truth.

## Security rule
Credentials, access codes, OAuth codes/tokens, API keys, passwords, PINs, OTPs, payment information, CVVs, and one-time verification codes must never be committed to GitHub, placed in customer-facing knowledge, or sent in automation lead payloads.
