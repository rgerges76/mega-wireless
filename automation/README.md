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

## Initial rollout

### Phase 1 — Agent
- Create one Botpress agent for Mega Wireless.
- Load `automation/agent-instructions.md` as the behavioral policy.
- Load `automation/knowledge-base.md` and the public website as knowledge sources.
- Publish the agent.

### Phase 2 — Website
- Enable Botpress Webchat.
- Add the published Botpress Webchat embed code to `index.html`.
- Configure the launcher for concise bilingual customer support.

### Phase 3 — WhatsApp
- Install Botpress's official WhatsApp integration.
- Authorize the Mega Wireless WhatsApp Business account through Meta.
- Test inbound messages, human escalation, and media handling.

### Phase 4 — Automation
- Connect Botpress to Make by webhook.
- Create lead workflow with fields: name, phone, request type, device/model, issue, preferred contact method, summary, timestamp, source channel.
- Route repair leads and sales leads separately.
- Add staff notification.
- Keep payment and account secrets out of automation payloads.

### Phase 5 — POS / repairs
- Add a controlled backend integration before allowing the assistant to claim live inventory, repair status, order status, or completed actions.
- Browser-local POS data is not a reliable multi-device source of truth and must not be exposed as live cloud data without a backend.

## Current implementation state

Completed in repository:
- Master agent operating instructions.
- Master AI knowledge-base source.
- Architecture and rollout source of truth.

External authorization still required:
- Botpress account/workspace creation or login.
- Meta/WhatsApp authorization.
- Make account/workspace creation or login.

These authorizations must be performed by the account owner; credentials, access codes, and OAuth tokens must not be posted in source control or chat.

## Deployment rule
Do not add a Botpress embed snippet to production until the agent is published and the exact current Webchat embed code is available. This avoids broken or stale chat code on the live site.
