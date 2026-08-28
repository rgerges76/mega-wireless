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

Business source of truth:
- https://megawirelessusa.com/
- `automation/knowledge-base.md`
- `automation/agent-instructions.md`
- Current structured business data connected explicitly to the agent

## Current rollout status — 2026-08-28

### Botpress agent
Created in Botpress Vibe as **Mega Wireless**.

Draft capabilities created by Vibe:
- FAQ / knowledge answers
- Product recommendations
- Lead qualification
- Repair intake
- Technical troubleshooting
- Human-handoff intent/fallback logic

Known test status:
- Store locations / business hours simulation: created; currently requires review.
- Accessory Recommendation simulation: created; did not run automatically.
- Remaining regression scenarios were not created/run automatically by Vibe.

The agent must not be treated as production-verified until the full regression suite in `automation/botpress-simulation-suite.md` has been completed.

### Website deployment
Do not add a guessed Botpress snippet to production.

Botpress requires the exact current Webchat embed snippet from the published agent. Current Botpress documentation places it under the agent's Webchat/Deploy settings. Once that exact snippet is available, it should be inserted into the public site's `index.html` immediately before the closing `</body>` tag.

### WhatsApp
Meta/WhatsApp authorization requires the account owner. After authorization, test inbound customer messages and handoff behavior before relying on the channel for production support.

### Make automation
The webhook data contract is prepared in:
- `automation/make-lead-contract.json`

Use it for:
- sales leads
- repair leads
- human follow-up requests

No passwords, PINs, OTPs, payment-card data, OAuth tokens, or account credentials may be sent through the automation payload.

## Rollout phases

### Phase 1 — Agent
- Create Botpress agent. **Done.**
- Load/align behavioral policy with `automation/agent-instructions.md`. **Prepared.**
- Use `automation/knowledge-base.md` and the public website as approved knowledge sources. **Prepared.**
- Complete regression simulations. **In progress / blocked by Botpress simulation runner behavior.**

### Phase 2 — Website
- Confirm latest working Botpress publish.
- Copy exact Webchat embed code from Botpress.
- Add exact snippet to `index.html` before `</body>`.
- Test desktop and mobile launcher behavior.

### Phase 3 — WhatsApp
- Install Botpress official WhatsApp integration.
- Authorize Mega Wireless WhatsApp Business through Meta.
- Test inbound messages, multilingual replies, human escalation, and media handling.

### Phase 4 — Automation
- Connect Botpress to Make by webhook.
- Implement `automation/make-lead-contract.json`.
- Route repair leads and sales leads separately.
- Add staff notification.
- Confirm webhook delivery before the agent claims any lead/handoff was submitted.

### Phase 5 — POS / repairs
- Add a controlled backend integration before allowing the assistant to claim live inventory, repair status, order status, or completed actions.
- Browser-local POS data is not a reliable multi-device source of truth and must not be exposed as live cloud data without a backend.

## Production release gate
Do not consider the automation production-ready until:
1. Botpress regression simulations pass or have been manually reviewed.
2. Human-handoff fallback behavior is verified.
3. The exact Botpress Webchat snippet is installed and tested on megawirelessusa.com.
4. WhatsApp is tested after Meta authorization if WhatsApp will be used.
5. Make webhook routing confirms successful lead delivery.
6. No agent response claims live inventory/order/repair status without a connected backend.

## Security rule
Credentials, access codes, OAuth codes/tokens, API keys, passwords, payment information, and one-time verification codes must never be committed to GitHub or pasted into public source files.
