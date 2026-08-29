# Make End-to-End Test Payloads

Use these only after the Make webhook and Botpress lead tool are connected. These are synthetic test records; do not use real customer data.

## Test 1 — Repair lead
Expected result: one row in `Leads` and one row in `Repair Intake`; no Follow-up because consent is Not Asked.

```json
{
  "version": "2.0",
  "event_type": "repair_lead",
  "timestamp": "2026-08-29T15:00:00Z",
  "source_channel": "webchat",
  "language": "English",
  "customer": {
    "name": "TEST REPAIR",
    "phone": null,
    "consent_to_contact": "Not Asked",
    "preferred_contact_method": null
  },
  "request": {
    "category": "repair",
    "device_brand": "Apple",
    "device_model": "iPhone 13",
    "service": "Screen replacement",
    "issue": "Cracked screen",
    "exact_price": 69.99,
    "summary": "Synthetic test repair lead for iPhone 13 screen replacement."
  },
  "agent": {
    "needs_human": false,
    "handoff_reason": null,
    "confidence": "high"
  },
  "follow_up": {
    "required": false,
    "due_at": null,
    "reason": null
  }
}
```

## Test 2 — Sales lead with consent
Expected result: one row in `Leads` and one Pending row in `Follow-up`.

```json
{
  "version": "2.0",
  "event_type": "sales_lead",
  "timestamp": "2026-08-29T15:05:00Z",
  "source_channel": "webchat",
  "language": "Spanish",
  "customer": {
    "name": "TEST SALES",
    "phone": "615-555-0100",
    "consent_to_contact": "Yes",
    "preferred_contact_method": "sms"
  },
  "request": {
    "category": "sales",
    "device_brand": "Samsung",
    "device_model": "Galaxy S23 Ultra",
    "service": "Phone purchase inquiry",
    "issue": null,
    "exact_price": null,
    "summary": "Synthetic Spanish sales lead asking about Galaxy S23 Ultra availability."
  },
  "agent": {
    "needs_human": false,
    "handoff_reason": null,
    "confidence": "high"
  },
  "follow_up": {
    "required": true,
    "due_at": "2026-08-29T16:00:00Z",
    "reason": "Customer requested availability callback"
  }
}
```

## Test 3 — Human handoff
Expected result: one `Leads` row with Status `Human Handoff` and one Pending `Follow-up` row because consent is Yes.

```json
{
  "version": "2.0",
  "event_type": "human_handoff",
  "timestamp": "2026-08-29T15:10:00Z",
  "source_channel": "webchat",
  "language": "Arabic",
  "customer": {
    "name": "TEST HANDOFF",
    "phone": "615-555-0101",
    "consent_to_contact": "Yes",
    "preferred_contact_method": "phone"
  },
  "request": {
    "category": "warranty",
    "device_brand": "Apple",
    "device_model": "iPhone 14",
    "service": "Warranty review",
    "issue": "Customer requests staff review of a warranty exception",
    "exact_price": null,
    "summary": "Synthetic human-handoff test. No decision should be made automatically."
  },
  "agent": {
    "needs_human": true,
    "handoff_reason": "Warranty exception requires staff approval",
    "confidence": "high"
  },
  "follow_up": {
    "required": true,
    "due_at": "2026-08-29T15:10:00Z",
    "reason": "Immediate staff review"
  }
}
```

## Pass criteria
- No passwords, PINs, OTPs, card data, or credentials appear in any row.
- Exact repair price is preserved only for the approved iPhone 13 test.
- Galaxy S23 Ultra test does not invent a price.
- Follow-up rows are created only where consent is `Yes`.
- Human handoff does not automatically approve/refuse the warranty request.
