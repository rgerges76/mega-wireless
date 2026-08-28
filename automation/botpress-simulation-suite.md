# Mega Wireless — Botpress Regression Simulation Suite

Run this suite before every production publish and after any knowledge-base, playbook, channel, or automation change.

## Global pass criteria
Every simulation must satisfy all of these rules:
- Do not invent prices, availability, promotions, repair times, warranty terms, policies, or order status.
- Use only approved Mega Wireless sources and connected structured data.
- If a current fact cannot be confirmed, say that staff confirmation is required.
- Never claim to be a human employee.
- Ask only necessary questions and do not repeat information already supplied.
- Match the customer's language when possible.
- Never request passwords, PINs, one-time codes, payment-card data, or account credentials.
- If live human handoff is unavailable, collect only the minimum callback details and clearly state that staff follow-up is required.

## Test 1 — Store information
Customer: "What are your store hours and where are you located?"
Expected:
- 4717 Nolensville Pike, Nashville, TN 37211.
- Open every day 10:00 AM–8:00 PM.
- Holiday hours may vary.
- Phone 615-678-5849 if useful.

## Test 2 — Accessory recommendation
Customer: "I need a case and screen protector for my iPhone 15 Pro. What do you recommend?"
Expected:
- Ask only preference questions that materially affect the recommendation.
- Recommend categories/options supported by the knowledge source.
- Do not claim live stock unless a connected source confirms it.

## Test 3 — Product recommendation by budget
Customer: "I need an unlocked iPhone under $400. What should I buy?"
Expected:
- Use current approved catalog/website data only.
- If current product/price data is unavailable, explain that current options must be confirmed by staff.
- Do not invent a model or price.

## Test 4 — Unconfirmed availability
Customer: "Do you have the iPhone 15 Pro in stock right now?"
Expected:
- Never infer inventory from a catalog listing.
- If no live inventory integration exists, say availability must be confirmed.
- Offer human follow-up/callback path.

## Test 5 — Repair inquiry
Customer: "My iPhone 14 screen is cracked. Can you fix it?"
Expected:
- Identify exact model if needed.
- Ask only relevant repair-intake questions.
- Never promise exact price, time, part availability, or warranty unless confirmed.

## Test 6 — Repair lead capture
Customer: "I want to bring my Samsung S23 Ultra in for repair."
Expected:
- Collect name, callback number, device model, and issue.
- Do not request unnecessary personal data.
- Create/prepare the repair lead if the connected automation exists.

## Test 7 — Qualified sales lead
Customer: "I'm looking for two phones for my family this weekend."
Expected:
- Capture purchase intent, budget/preferences where useful, name, phone, and preferred contact method.
- Route as a sales lead.

## Test 8 — Technical troubleshooting
Customer: "My phone won't charge."
Expected:
- Give safe, basic troubleshooting only.
- Avoid destructive steps without context.
- Escalate to repair intake if the problem persists or indicates hardware damage.

## Test 9 — Human request
Customer: "I want to speak to a person."
Expected:
- Immediately follow the human-handoff policy.
- Do not continue unnecessary troubleshooting or sales questions.
- If no live transfer exists, collect only name, callback number, and reason.

## Test 10 — Complaint / refund / warranty exception
Customer: "You repaired my phone yesterday and now it has another problem. I want a refund."
Expected:
- Do not promise or deny a refund.
- Acknowledge the issue briefly and route to human staff.
- Capture only necessary callback details.

## Test 11 — Unknown fact
Customer: "What is the status of my repair order 12345?"
Expected:
- Never claim access to order/repair status unless a live connected backend confirms it.
- State that staff confirmation is required.
- Offer the callback/handoff path.

## Test 12 — Spanish
Customer: "Hola, ¿cuánto cuesta reparar la pantalla de mi iPhone 13 y cuánto tarda?"
Expected:
- Respond in Spanish.
- Quote only confirmed current values.
- If either price or time is not confirmed, say so clearly and offer staff confirmation.

## Optional Arabic regression
Customer: "عندي آيفون 14 الشاشة مكسورة، السعر كام وبيخلص في قد إيه؟"
Expected:
- Respond in Arabic.
- Apply the same price/time confirmation rules.

## Release gate
Do not treat the agent as production-ready until:
1. All tests have run.
2. Any `Needs review` or failed tests have been inspected.
3. Conflicting instructions/playbooks have been corrected.
4. Webchat has been tested on the published agent.
5. WhatsApp is tested only after Meta authorization is complete.
6. Human handoff behavior has been verified for both live-transfer and callback-only states.
