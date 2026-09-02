import { getStore } from "@netlify/blobs";

export const ALLOWED_EVENTS = new Set([
  "page_view", "engaged_visitor", "repair_quote_started", "repair_quote_completed",
  "repair_booking_started", "repair_booking_completed", "call_clicked", "directions_clicked",
  "contact_clicked", "phone_viewed", "phone_interest", "call_about_phone",
  "availability_request", "repair_model_viewed", "promotion_clicked", "ai_chat_started",
  "human_help_requested", "repair_tracking_used", "review_clicked", "review_request_sent",
]);

const safeText = (value, max = 120) => String(value ?? "")
  .replace(/[<>\u0000-\u001f]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);

export function json(statusCode, body, extraHeaders = {}) {
  return {
    statusCode,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store, private, max-age=0",
      "x-content-type-options": "nosniff",
      ...extraHeaders,
    },
    body: JSON.stringify(body),
  };
}

export function sameOrigin(event) {
  const origin = event.headers?.origin || event.headers?.Origin;
  if (!origin) return true;
  return origin === "https://megawirelessusa.com" || origin === "https://www.megawirelessusa.com" || origin.startsWith("http://localhost:");
}

export function normalizeEvent(input) {
  const name = safeText(input?.name, 64);
  if (!ALLOWED_EVENTS.has(name)) throw new Error("Unsupported event");
  const eventId = safeText(input?.event_id, 90);
  if (!/^[a-zA-Z0-9_-]{12,90}$/.test(eventId)) throw new Error("Invalid event id");
  const properties = input?.properties && typeof input.properties === "object" ? input.properties : {};
  const normalized = {};
  for (const [key, value] of Object.entries(properties).slice(0, 24)) {
    const cleanKey = safeText(key, 48).replace(/[^a-zA-Z0-9_]/g, "_");
    if (!cleanKey || /email|phone_number|customer_phone|customer_name|address|imei|serial|token|password|secret/i.test(cleanKey)) continue;
    normalized[cleanKey] = typeof value === "number" ? value : safeText(value, 160);
  }
  return {
    event_id: eventId,
    name,
    occurred_at: new Date().toISOString(),
    source: safeText(input?.source, 80) || "direct",
    medium: safeText(input?.medium, 80) || "none",
    campaign: safeText(input?.campaign, 120),
    landing_page: safeText(input?.landing_page, 180),
    properties: normalized,
  };
}

export async function saveEvent(record) {
  const store = getStore("marketing-events");
  const date = record.occurred_at.slice(0, 10);
  const key = `${date}/${record.event_id}.json`;
  if (await store.get(key, { type: "text" })) return { duplicate: true };
  await store.setJSON(key, record, { metadata: { event: record.name, date } });
  return { duplicate: false };
}

export function requireOwner(context) {
  const user = context?.clientContext?.user;
  const email = String(user?.email || "").toLowerCase();
  const allowed = String(process.env.OWNER_EMAIL || "").toLowerCase();
  if (!user || !email || !allowed || email !== allowed) throw new Error("UNAUTHORIZED");
  return { id: user.sub, email };
}

export function chicagoDate(offsetDays = 0) {
  const date = new Date(Date.now() + offsetDays * 86400000);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(date);
}

export async function readEvents(dates) {
  const store = getStore("marketing-events");
  const output = [];
  for (const date of dates) {
    const listing = await store.list({ prefix: `${date}/` });
    for (const blob of listing.blobs) {
      const record = await store.get(blob.key, { type: "json" });
      if (record) output.push(record);
    }
  }
  return output;
}

export function summarize(events) {
  const counts = {};
  const sources = {};
  const repairs = {};
  const phones = {};
  const campaigns = {};
  for (const event of events) {
    counts[event.name] = (counts[event.name] || 0) + 1;
    sources[event.source || "direct"] = (sources[event.source || "direct"] || 0) + 1;
    if (event.properties?.repair) repairs[event.properties.repair] = (repairs[event.properties.repair] || 0) + 1;
    if (event.properties?.phone) phones[event.properties.phone] = (phones[event.properties.phone] || 0) + 1;
    if (event.campaign) campaigns[event.campaign] = (campaigns[event.campaign] || 0) + 1;
  }
  const top = (object) => Object.entries(object).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, value]) => ({ name, value }));
  const visitors = counts.page_view || 0;
  const leads = (counts.repair_quote_completed || 0) + (counts.phone_interest || 0) + (counts.human_help_requested || 0);
  const contacts = (counts.call_clicked || 0) + (counts.directions_clicked || 0) + (counts.contact_clicked || 0);
  return {
    counts, sources: top(sources), repairs: top(repairs), phones: top(phones), campaigns: top(campaigns),
    funnel: { visitors, engaged: counts.engaged_visitor || 0, interest: leads, contacts, bookings: counts.repair_booking_completed || 0 },
    conversion_rate: visitors ? Number(((contacts / visitors) * 100).toFixed(1)) : 0,
  };
}

export function recommendations(summary) {
  const items = [];
  if (summary.repairs[0]) items.push(`Feature ${summary.repairs[0].name} tomorrow; it produced the most repair interest today (${summary.repairs[0].value}).`);
  if (summary.phones[0]) items.push(`Follow up the ${summary.phones[0].name} listing; it received the strongest phone interest (${summary.phones[0].value}).`);
  if (summary.sources[0]) items.push(`Repeat the best-performing source, ${summary.sources[0].name}, which generated ${summary.sources[0].value} tracked actions.`);
  if ((summary.counts.repair_quote_completed || 0) > (summary.counts.call_clicked || 0)) items.push("Review completed quotes that did not become calls and strengthen the call-to-action on the quote result.");
  if (summary.funnel.visitors && summary.funnel.contacts === 0) items.push("Check the call, directions and message actions tomorrow morning because today recorded visitors but no contact action.");
  return items.slice(0, 5);
}
