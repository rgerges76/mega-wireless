# Mega Wireless — Operations Automation Runbook

Last updated: 2026-08-30

## Goal
Build a professional, owner-controlled automation layer that reduces manual work without allowing AI or automations to make irreversible financial, customer-facing, security, or inventory decisions without the required safety gates.

## Core systems
- Google Sheet: `Mega Wireless Automation Hub`
- Gmail: `ramyook@gmail.com`
- Make: staging scenario `Mega Wireless AI Leads - TEST`
- Botpress: customer-facing agent/channels
- POS: remains the cashier/repair operational front end; Google Sheets is the backend/control center

## Google Sheet control center
The Hub now contains the following operational areas:
- Leads
- Repair Intake
- Follow-up
- Daily Report
- Config
- Automation Status
- Make Blueprint
- Prompts
- Test Payloads
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
- Email Safety Review

## Automation governance
### Irreversible actions require owner approval
Automation may prepare or stage, but must not automatically:
- submit or pay a purchase order
- pay a supplier invoice
- issue a refund
- send chargeback/dispute evidence
- send an external repair-status message until outbound routing is verified
- change a selling price
- make sensitive account/security changes

Use `Approval Queue` for these decisions.

### Audit trail
Every state-changing automation action should create an `Automation Log` row with:
- timestamp
- automation name
- object/reference
- action
- before/after state when relevant
- result
- exception

## Supplier invoice workflow
1. Monitor connected Gmail for genuine inventory/parts supplier invoices.
2. Exclude personal transfers, unrelated bills, newsletters, and personal receipts.
3. De-duplicate by supplier + invoice number + SKU/line key.
4. Extract:
   - supplier
   - invoice number/date
   - SKU
   - description
   - quantity
   - unit cost
   - shipping
   - tax
   - invoice total
   - payment status
   - balance due
5. Stage invoice in `Invoice Review` and line items in `Purchases`.
6. Create/update Inventory item master only on clear SKU match.
7. Never change Selling Price.
8. Do not increase Qty On Hand unless:
   - `Count Status = Counted`
   - `Counted At` is present
   - invoice was received after the baseline count
   - invoice has not already been applied
9. Record every approved inventory increase in `Inventory Movements`.

Current historical invoices are intentionally staged without changing current stock because prior purchased quantities may already have been consumed.

## Inventory baseline
A one-time physical count is required before automatic quantity movement can be trusted.

For every seeded SKU, owner/store staff should set:
- Qty On Hand
- Min Stock
- Location
- Count Status = Counted
- Counted At = timestamp of physical count

After this baseline, future invoice additions and repair deductions can be automated safely.

## Repair part deduction
For a Repair Intake row:
1. Status must be `Ready` or `Completed`.
2. Exact `Part SKU Used` must be present.
3. `Qty Used` must be positive.
4. Inventory item must be Counted.
5. The movement must not already have been applied.
6. Deduction may not make stock negative.

Then:
- subtract exact quantity
- add unique `Inventory Movements` record tied to Ticket ID
- set `Inventory Deducted = Yes`
- save Deduction Movement ID

Block and require review when:
- multiple possible screen grades exist
- exact SKU is missing
- inventory is uncounted
- stock would become negative
- a duplicate movement exists

## Low-stock and purchase orders
`Stock Alerts` identifies counted active items at/below minimum.

Automation may create one `Purchase Orders` Draft per SKU when no open Draft/Approved/Ordered row already exists.

Use:
- Suggested Reorder
- latest Unit Cost
- Supplier

Never submit or pay the order automatically. Approval defaults to `No`.

## RMA / supplier credits
`RMA Tracker` holds defective part returns and expected credits.

Track:
- supplier
- invoice
- SKU/part
- quantity
- expected amount
- return tracking
- date shipped
- status
- credit memo
- credit received/date
- days open
- overdue flag

Overdue or materially aging credits should create/refresh an owner action in Approval Queue.

## Repair status notifications
For statuses:
- Waiting for Approval
- Waiting for Part
- Ready
- Completed

Create one de-duplicated `Customer Notifications` row per Ticket ID + status.

Prepare a concise customer-facing message in the known language when possible.

Do not send externally until the Make/Botpress outbound path is verified. Until then:
- `Ready to Send` only when a valid phone/contact route exists
- otherwise `Blocked` with reason

## Expenses
Stage clear Mega Wireless business bills/receipts in `Expenses`, such as:
- hosting/software
- advertising
- telecom/internet
- merchant processing
- utilities
- store supplies

Exclude personal transfers and personal purchases.

Do not double-count inventory supplier invoices as operating expenses because Purchases already tracks inventory acquisition.

Default uncertain business-purpose rows to:
- Business Confirmed = Unclear
- Review Status = Needs Review

## Profit summary
`Profit Summary` may show only supported metrics.

Do not claim full-store profit until POS sales are connected.

It may safely show known repair contribution, parts cost, approved expenses, purchases, RMA credits, and other directly supported values.

## Chargebacks / disputes
Search for real processor cases, not keyword-only marketing emails.

A valid dispute/risk case should create a `Disputes` row with:
- processor
- case/reference
- transaction details when available
- deadline
- amount
- evidence available/missing
- status

Never reply to processor automatically.
Create owner approval/action instead.

## Gmail safety incident
On 2026-08-29, autonomous Gmail behavior sent Mega Wireless AI/support replies to multiple non-customer automated senders, including examples involving:
- Google security alerts
- bank transaction/balance alerts
- insurance/payment notices
- alarm/security notifications
- newsletters/promotions
- mail delivery notifications

These messages were labeled in Gmail with:
`Mega Wireless/Automation Review`

The Hub includes `Email Safety Review` for this incident class.

### Gmail outbound rule
Until the Botpress Gmail channel is corrected and verified:
- no autonomous replies to newsletters
- no autonomous replies to banks/financial alerts
- no autonomous replies to security/account alerts
- no autonomous replies to insurance/payment notices
- no autonomous replies to no-reply/mailer-daemon addresses
- no autonomous replies to personal/unrelated mail
- no autonomous replies to government/legal mail

Non-customer business mail should be Draft or Ignore unless the owner explicitly authorizes sending.

Customer-only verified routing must be tested before re-enabling autonomous Gmail outbound.

## Active automation tasks
### Mega Wireless Ops Watch
Hourly safe operational check covering:
- supplier invoices
- inventory updates after baseline
- repair deductions
- repair-status queue
- low-stock PO drafts
- RMA exceptions
- business expenses
- real chargebacks/disputes
- Gmail safety monitoring
- approval governance

### Mega Wireless Manager Briefs
Runs morning and evening.
Uses the Hub and prioritizes owner actions rather than dumping raw metrics.

Morning: top 3–5 priorities for the day.
Evening: unresolved items + top actions for next work period.

## Make/Botpress remaining work
The current safe staging path is `Mega Wireless AI Leads - TEST`.

Before production cutover:
1. confirm/recapture webhook v2 fields
2. build exact event_type router:
   - sales_lead
   - repair_lead
   - human_handoff
3. map Leads / Repair Intake / Follow-up
4. run all three real webhook tests
5. verify no duplicates and consent rules
6. only then perform controlled production cutover
7. add production webhook URL to Botpress lead action
8. Preview-test customer flows
9. publish only after all tests pass

Do not activate a TEST scenario blindly if it may share production webhook behavior. Avoid duplicate delivery during cutover.

## Non-negotiable privacy rules
Never store or expose:
- passwords
- PINs
- OTP/one-time codes
- Apple ID or Google passwords
- card numbers
- CVV
- OAuth/access tokens
- account secrets

## Owner operating model
The target operating model is:
- employee/cashier works in POS
- repair intake happens in POS/form UI
- Hub runs behind the scenes
- owner primarily reviews approvals, exceptions, priorities, and reports
- automation handles repetitive admin and tracking
- irreversible money/customer/security actions remain owner-controlled
