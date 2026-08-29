# Make Desktop Continuation Prompt — Existing Mega Wireless Webhook

Use this in the existing Make scenario. Do NOT create a second webhook.

## Prompt for Maia

Continue configuring the EXISTING scenario that already contains the Custom Webhook named **Mega Wireless AI Leads**.

Important current state:
- The webhook already exists.
- A Mega Wireless v2 `repair_lead` test payload has already been sent.
- Make already confirmed `data structure captured`.
- Do not replace or duplicate the webhook.
- Do not activate the scenario yet.

Connect Google Sheets and use this spreadsheet:
- Name: **Mega Wireless Automation Hub**
- Spreadsheet ID: `1-7UeqTO9DaUDjp1VNkI3k1GKCEjXFcC_t39J52HVTns`

Build a Router immediately after the existing webhook with three exact filters based on `event_type`:
1. `sales_lead`
2. `repair_lead`
3. `human_handoff`

## Shared Leads mapping
For every valid event, write to sheet `Leads`:
- Timestamp = `timestamp`
- Lead ID = generate `MW-YYYYMMDD-HHmmss-<short suffix>` once per event
- Customer Name = `customer.name`
- Phone = `customer.phone`
- Language = `language`
- Source = `source_channel`
- Device = concatenate `request.device_brand` and `request.device_model`, omitting blanks
- Service / Issue = `request.service` if present, otherwise `request.issue`
- Exact Price = `request.exact_price`
- Status = `Human Handoff` only for `human_handoff`; otherwise `New`
- Consent to Contact = `customer.consent_to_contact`
- Follow-up Due = `follow_up.due_at`
- Assigned To = blank
- Conversation Summary = `request.summary`
- Notes = `agent.confidence` and routing note only

## Repair branch
For `repair_lead`, after writing Leads, also write to `Repair Intake`:
- Timestamp = `timestamp`
- Ticket ID = generate `REP-YYYYMMDD-HHmmss-<short suffix>`
- Lead ID = reuse the same generated Lead ID
- Customer = `customer.name`
- Phone = `customer.phone`
- Device = brand + model
- Service = `request.service`
- Problem Summary = `request.issue` if present, otherwise `request.summary`
- Diagnostic Fee = `FREE`
- Quoted Price = `request.exact_price`
- Warranty = `30 days` only when this event is explicitly a standard screen replacement; otherwise blank
- Status = `Pending Diagnostic`
- Technician = blank
- Notes = `request.summary`

## Follow-up rule
Create a row in `Follow-up` only when BOTH conditions are true:
- `follow_up.required = true`
- `customer.consent_to_contact = Yes`

For `human_handoff`, if contact consent is Yes and a phone number exists, create a Follow-up row even when `follow_up.required` is missing; use `agent.handoff_reason` as Reason and current time if `follow_up.due_at` is empty.

Follow-up mapping:
- Lead ID = same Lead ID
- Customer = `customer.name`
- Phone = `customer.phone`
- Device = brand + model
- Reason = `agent.handoff_reason` for handoff, otherwise `follow_up.reason`
- Due = `follow_up.due_at`, or current time for consented human handoff when blank
- Channel = `customer.preferred_contact_method`; map unsupported values to Phone
- Status = `Pending`
- Last Contact = blank
- Next Action = `Staff review and contact customer`
- Notes = `request.summary`

## Privacy
Ignore completely and never store any incoming fields containing passwords, PINs, OTPs, one-time codes, payment card numbers, CVVs, Apple ID/Google passwords, OAuth tokens, access tokens, or account secrets.

## Error handling
Keep failed Google Sheets writes visible in scenario history. Do not return or imply success until all required Sheet writes for the event finish successfully.

## Finish state
Do not activate automatically. Leave the scenario ready for manual testing with `Immediately as data arrives` selected.
