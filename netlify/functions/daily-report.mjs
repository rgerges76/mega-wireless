import { getStore } from "@netlify/blobs";
import { chicagoDate, json, readEvents, recommendations, summarize } from "./_shared/marketing.mjs";

export async function handler() {
  const localHour = Number(new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", hour: "2-digit", hour12: false }).format(new Date()));
  if (localHour !== 20) return json(200, { skipped: true, reason: "Outside report hour" });
  const date = chicagoDate();
  const reportStore = getStore("marketing-reports");
  const reportKey = `${date}.json`;
  if (await reportStore.get(reportKey, { type: "text" })) return json(200, { duplicate: true, date });
  const dates = Array.from({ length: 8 }, (_, index) => chicagoDate(-index));
  const events = await readEvents(dates);
  const today = summarize(events.filter((item) => item.occurred_at.slice(0, 10) === dates[0]));
  const yesterday = summarize(events.filter((item) => item.occurred_at.slice(0, 10) === dates[1]));
  const sevenDay = summarize(events.filter((item) => dates.slice(1, 8).includes(item.occurred_at.slice(0, 10))));
  const report = { id: `daily-${date}`, date, timezone: "America/Chicago", today, yesterday, seven_day: sevenDay, recommendations: recommendations(today), created_at: new Date().toISOString() };
  const providerStore = getStore("marketing-provider-snapshots");
  report.providers = await providerStore.get(`${date}.json`, { type: "json" }) || { google: { connected: false }, meta: { connected: false } };
  await reportStore.setJSON(reportKey, report, { metadata: { date, type: "daily-owner-report" } });
  if (process.env.OWNER_REPORT_WEBHOOK_URL) {
    await fetch(process.env.OWNER_REPORT_WEBHOOK_URL, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(report), signal: AbortSignal.timeout(8000) }).catch(() => null);
  }
  return json(200, { created: true, date });
}
