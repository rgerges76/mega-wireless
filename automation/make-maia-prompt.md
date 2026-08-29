# Make Maia Prompt — Mega Wireless Lead Automation

Paste this into Make's Maia builder after the owner is signed in.

## Prompt

Create a production-safe Make scenario named **Mega Wireless AI Lead Router**.

Trigger:
- Use a **Custom Webhook** named `mega_wireless_ai_lead`.
- Accept JSON matching the Mega Wireless v2 lead contract.

Destination spreadsheet:
- Google Sheet: **Mega Wireless Automation Hub**
- Spreadsheet ID: `1-7UeqTO9DaUDjp1VNkI3k1GKCEjXFcC_t39J52HVTns`

Route by `event_type`.

### Route 1 — sales_lead
Add one row to sheet `Leads` using this mapping:
- Timestamp = `timestamp`
- Lead ID = generate a stable ID such as `MW-YYYYMMDD-HHmmss` plus a short random suffix
- Customer Name = `customer.name`
- Phone = `customer.phone`
- Language = `language`
- Source = `source_channel`
- Device = combine `request.device_brand` and `request.device_model`, omitting blanks
- Service / Issue = prefer `request.service`; otherwise use `request.issue`
- Exact Price = `request.exact_price`
- Status = `New`
- Consent to Contact = `customer.consent_to_contact`
- Follow-up Due = `follow_up.due_at`
- Assigned To = blank
- Conversation Summary = `request.summary`
- Notes = include `agent.confidence` only if useful

### Route 2 — repair_lead
First add the same lead row to `Leads`, with Status = `New`.
Then add one row to `Repair Intake`:
- Timestamp = `timestamp`
- Ticket ID = generate `REP-YYYYMMDD-HHmmss` plus short random suffix
- Lead ID = reuse the generated Lead ID
- Customer = `customer.name`
- Phone = `customer.phone`
- Device = brand + model
- Service = `request.service`
- Problem Summary = `request.issue` or `request.summary`
- Diagnostic Fee = `FREE`
- Quoted Price = `request.exact_price`
- Warranty = `30 days` only when the repair is a standard screen replacement; otherwise blank unless explicitly supplied by an approved source
- Status = `Pending Diagnostic`
- Technician = blank
- Notes = `request.summary`

### Route 3 — human_handoff
Add one row to `Leads` with Status = `Human Handoff`.
If contact consent is Yes and a phone number is present, also add a row to `Follow-up`:
- Lead ID = generated Lead ID
- Customer = `customer.name`
- Phone = `customer.phone`
- Device = brand + model
- Reason = `agent.handoff_reason`
- Due = use `follow_up.due_at`, otherwise set to current time
- Channel = prefer `customer.preferred_contact_method`; map unsupported values to Phone
- Status = `Pending`
- Last Contact = blank
- Next Action = `Staff review and contact customer`
- Notes = `request.summary`

### Follow-up rule
For sales_lead and repair_lead, only create a Follow-up row when BOTH are true:
1. `follow_up.required` is true
2. `customer.consent_to_contact` equals `Yes`

Never create automatic outreach when consent is No or Not Asked.

### Privacy and safety
Never store or map passwords, PINs, OTPs, Apple ID/Google passwords, payment card numbers, CVVs, OAuth tokens, access tokens, or other account secrets.
If any forbidden field appears in the incoming JSON, ignore it completely.

### Error handling
- If Google Sheets write fails, do not silently discard the webhook.
- Configure Make error handling so the failed execution is visible in scenario history.
- Do not send a success response implying delivery until required Sheet writes complete successfully.

### Final scenario
Webhook → Router → sales_lead / repair_lead / human_handoff branches → Google Sheets.

Do not add marketing messages, email, SMS, WhatsApp, Facebook, Instagram, or other paid modules yet. Build only this core lead-routing scenario first.
