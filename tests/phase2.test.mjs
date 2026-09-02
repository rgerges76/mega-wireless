import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import { ALLOWED_EVENTS, normalizeEvent, recommendations, summarize } from "../netlify/functions/_shared/marketing.mjs";

const root = path.resolve(import.meta.dirname, "..");

test("meaningful conversion events are allowlisted", () => {
  for (const name of ["repair_quote_started", "repair_quote_completed", "call_clicked", "directions_clicked", "phone_viewed", "phone_interest", "ai_chat_started", "repair_tracking_used"]) {
    assert.equal(ALLOWED_EVENTS.has(name), true, name);
  }
  assert.equal(ALLOWED_EVENTS.has("password_submitted"), false);
});

test("analytics normalization strips sensitive fields", () => {
  const record = normalizeEvent({ event_id: "abcdefghijklmnop", name: "phone_interest", source: "instagram", properties: { phone: "iPhone 13", password: "never", imei: "never", token_value: "never" } });
  assert.equal(record.source, "instagram");
  assert.equal(record.properties.phone, "iPhone 13");
  assert.equal("password" in record.properties, false);
  assert.equal("imei" in record.properties, false);
  assert.equal("token_value" in record.properties, false);
});

test("funnel measures customer actions, not views alone", () => {
  const events = [
    { name: "page_view", source: "google", properties: {} },
    { name: "engaged_visitor", source: "google", properties: {} },
    { name: "repair_quote_completed", source: "google", properties: { repair: "iPhone 13 Cracked Screen" } },
    { name: "call_clicked", source: "google", properties: { repair: "iPhone 13 Cracked Screen" } },
    { name: "phone_interest", source: "instagram", properties: { phone: "iPhone 15 Plus" } },
  ];
  const result = summarize(events);
  assert.deepEqual(result.funnel, { visitors: 1, engaged: 1, interest: 2, contacts: 1, bookings: 0 });
  assert.equal(result.conversion_rate, 100);
  assert.equal(recommendations(result).some((item) => item.includes("iPhone 13")), true);
});

test("homepage includes quote flow, mobile actions and private owner dashboard", async () => {
  const page = await readFile(path.join(root, "public/index.html"), "utf8");
  const growth = await readFile(path.join(root, "public/assets/growth.js"), "utf8");
  const headers = await readFile(path.join(root, "public/_headers"), "utf8");
  assert.match(page, /id="repair-quote"/);
  assert.match(page, /class="mobile-actions"/);
  assert.match(growth, /Contact Mega Wireless for an exact quote/);
  assert.match(headers, /\/owner\/\*/);
  assert.match(headers, /no-store, private/);
});

test("tracking uses same-origin server endpoint and idempotent event ids", async () => {
  const client = await readFile(path.join(root, "public/assets/growth.js"), "utf8");
  const endpoint = await readFile(path.join(root, "netlify/functions/track-event.mjs"), "utf8");
  assert.match(client, /\/\.netlify\/functions\/track-event/);
  assert.match(client, /event_id/);
  assert.match(endpoint, /saveEvent/);
  assert.match(endpoint, /sameOrigin/);
});

test("daily report is Chicago-local and duplicate-safe", async () => {
  const source = await readFile(path.join(root, "netlify/functions/daily-report.mjs"), "utf8");
  const config = await readFile(path.join(root, "netlify.toml"), "utf8");
  assert.match(source, /America\/Chicago/);
  assert.match(source, /duplicate: true/);
  assert.match(config, /schedule = "@hourly"/);
});

test("SEO pages are useful and included in sitemap", async () => {
  const sitemap = await readFile(path.join(root, "public/sitemap.xml"), "utf8");
  for (const page of ["iphone-repair-nashville", "samsung-repair-nashville", "phone-screen-repair-nashville", "used-phones-nashville"]) {
    assert.match(sitemap, new RegExp(page));
    const source = await readFile(path.join(root, `public/${page}.html`), "utf8");
    assert.match(source, /canonical/);
    assert.match(source, /application\/ld\+json/);
    assert.match(source, /4717 Nolensville Pike/);
  }
});
