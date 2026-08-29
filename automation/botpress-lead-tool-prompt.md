# Botpress Ask Vibe Prompt — Lead Delivery Tool

Use only after Make creates the production Custom Webhook URL. Replace `{{MAKE_WEBHOOK_URL}}` before applying.

Create or update ONLY the Mega Wireless lead-delivery automation tool. Do not alter pricing, knowledge sources, language behavior, repair policies, webchat appearance, or unrelated playbooks.

Create a reusable tool/action named `sendLeadToAutomation` that sends an HTTPS POST to `{{MAKE_WEBHOOK_URL}}` with `Content-Type: application/json`.

Payload fields:
- version: `2.0`
- event_type: `sales_lead | repair_lead | human_handoff`
- timestamp: ISO-8601 UTC
- source_channel: webchat/whatsapp/facebook/instagram/other
- language: English/Arabic/Spanish/Other
- customer.name
- customer.phone
- customer.consent_to_contact: Yes/No/Not Asked
- customer.preferred_contact_method
- request.category
- request.device_brand
- request.device_model
- request.service
- request.issue
- request.exact_price
- request.summary
- agent.needs_human
- agent.handoff_reason
- agent.confidence
- follow_up.required
- follow_up.due_at
- follow_up.reason

Calling rules:
1. Do not send every chat message as a lead.
2. Call when the customer clearly wants to buy, repair, book, reserve, receive a callback/follow-up, or requires staff handoff.
3. Complaints, refunds, payment disputes, warranty exceptions, account-specific issues, uncertain staff approvals, and requests for a human use `human_handoff`.
4. Repair intent uses `repair_lead`.
5. Device/product purchase intent uses `sales_lead`.
6. Never require name or phone merely to answer a question.
7. Ask for contact information only for booking, callback, reservation, follow-up, or human handoff.
8. Ask permission before later outbound follow-up. Set consent_to_contact to Yes only when the customer clearly agrees; otherwise No or Not Asked.
9. Never send passwords, PINs, OTPs, Apple ID or Google passwords, card numbers, CVVs, authentication codes, OAuth/access tokens, or account secrets.
10. Populate exact_price only when approved Mega Wireless knowledge contains an exact model-specific price. Never guess.
11. If webhook delivery fails, do not tell the customer the lead was successfully delivered.
12. Keep customer replies concise and in the customer's current language.

Do not publish yet. Test one repair lead, one sales lead, and one human handoff in Preview first.
