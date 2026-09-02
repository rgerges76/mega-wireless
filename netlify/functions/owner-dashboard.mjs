import { getStore } from "@netlify/blobs";
import { chicagoDate, json, readEvents, recommendations, requireOwner, summarize } from "./_shared/marketing.mjs";
import { loadTokens } from "./_shared/oauth.mjs";

export async function handler(event, context) {
  if (event.httpMethod !== "GET") return json(405, { error: "Method not allowed" });
  try { requireOwner(context); } catch { return json(401, { error: "Owner authentication required" }); }
  const dates = Array.from({ length: 30 }, (_, index) => chicagoDate(-index));
  const events = await readEvents(dates);
  const byDate = Object.fromEntries(dates.map((date) => [date, summarize(events.filter((item) => item.occurred_at.slice(0, 10) === date))]));
  const today = byDate[dates[0]];
  const sevenDayEvents = events.filter((item) => dates.slice(0, 7).includes(item.occurred_at.slice(0, 10)));
  const providerStore = getStore("marketing-provider-snapshots");
  const providers = await providerStore.get(`${dates[0]}.json`, { type: "json" });
  const [googleConnection, metaConnection] = await Promise.all([loadTokens("google").catch(() => null), loadTokens("meta").catch(() => null)]);
  return json(200, {
    generated_at: new Date().toISOString(),
    today,
    yesterday: byDate[dates[1]],
    seven_day: summarize(sevenDayEvents),
    thirty_day: summarize(events),
    daily: dates.slice(0, 30).reverse().map((date) => ({ date, ...byDate[date].funnel })),
    recommendations: recommendations(today),
    integrations: {
      google: Boolean(googleConnection),
      meta: Boolean(metaConnection),
      google_configured: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
      meta_configured: Boolean(process.env.META_APP_ID && process.env.META_APP_SECRET),
    },
    providers,
  });
}
