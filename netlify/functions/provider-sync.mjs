import { getStore } from "@netlify/blobs";
import { chicagoDate, json } from "./_shared/marketing.mjs";
import { googleAccessToken, loadTokens } from "./_shared/oauth.mjs";

async function googleSnapshot(date) {
  const token = await googleAccessToken(); if (!token) return { connected: false };
  const headers = { authorization: `Bearer ${token}`, "content-type": "application/json" };
  const output = { connected: true, analytics: null, search: null, business: null };
  if (process.env.GA4_PROPERTY_ID) {
    const response = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${encodeURIComponent(process.env.GA4_PROPERTY_ID)}:runReport`, { method: "POST", headers, body: JSON.stringify({ dateRanges: [{ startDate: date, endDate: date }], dimensions: [{ name: "eventName" }, { name: "sessionSource" }], metrics: [{ name: "eventCount" }, { name: "activeUsers" }] }) });
    if (response.ok) output.analytics = await response.json(); else output.analytics = { error_status: response.status };
  }
  if (process.env.GOOGLE_SEARCH_CONSOLE_SITE) {
    const site = encodeURIComponent(process.env.GOOGLE_SEARCH_CONSOLE_SITE);
    const response = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${site}/searchAnalytics/query`, { method: "POST", headers, body: JSON.stringify({ startDate: date, endDate: date, dimensions: ["query", "page", "device"], rowLimit: 100 }) });
    if (response.ok) output.search = await response.json(); else output.search = { error_status: response.status };
  }
  if (process.env.GOOGLE_BUSINESS_LOCATION_ID) {
    const location = encodeURIComponent(process.env.GOOGLE_BUSINESS_LOCATION_ID);
    const response = await fetch(`https://businessprofileperformance.googleapis.com/v1/locations/${location}:fetchMultiDailyMetricsTimeSeries?dailyMetrics=BUSINESS_IMPRESSIONS_DESKTOP_MAPS&dailyMetrics=BUSINESS_IMPRESSIONS_MOBILE_MAPS&dailyMetrics=CALL_CLICKS&dailyMetrics=WEBSITE_CLICKS&dailyMetrics=BUSINESS_DIRECTION_REQUESTS&dailyRange.startDate.year=${date.slice(0,4)}&dailyRange.startDate.month=${Number(date.slice(5,7))}&dailyRange.startDate.day=${Number(date.slice(8,10))}&dailyRange.endDate.year=${date.slice(0,4)}&dailyRange.endDate.month=${Number(date.slice(5,7))}&dailyRange.endDate.day=${Number(date.slice(8,10))}`, { headers });
    if (response.ok) output.business = await response.json(); else output.business = { error_status: response.status };
  }
  return output;
}

async function metaSnapshot(date) {
  const record = await loadTokens("meta"); if (!record) return { connected: false };
  const version = process.env.META_GRAPH_VERSION || "v24.0", token = record.token.access_token, output = { connected: true, facebook: null, instagram: null };
  if (process.env.META_PAGE_ID) {
    const metrics = "page_impressions_unique,page_post_engagements,page_views_total,page_video_views";
    const response = await fetch(`https://graph.facebook.com/${version}/${process.env.META_PAGE_ID}/insights?${new URLSearchParams({ metric: metrics, period: "day", since: date, until: date, access_token: token })}`);
    output.facebook = response.ok ? await response.json() : { error_status: response.status };
  }
  if (process.env.META_INSTAGRAM_ACCOUNT_ID) {
    const response = await fetch(`https://graph.facebook.com/${version}/${process.env.META_INSTAGRAM_ACCOUNT_ID}/insights?${new URLSearchParams({ metric: "reach,profile_views,website_clicks,accounts_engaged", period: "day", since: date, until: date, access_token: token })}`);
    output.instagram = response.ok ? await response.json() : { error_status: response.status };
  }
  return output;
}

export async function handler() {
  const localHour = Number(new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", hour: "2-digit", hour12: false }).format(new Date()));
  if (localHour !== 19) return json(200, { skipped: true, reason: "Outside provider sync hour" });
  const date = chicagoDate(), store = getStore("marketing-provider-snapshots"), key = `${date}.json`;
  if (await store.get(key, { type: "text" })) return json(200, { duplicate: true, date });
  const snapshot = { date, created_at: new Date().toISOString(), google: await googleSnapshot(date).catch((error) => ({ connected: true, error: error.message })), meta: await metaSnapshot(date).catch((error) => ({ connected: true, error: error.message })) };
  await store.setJSON(key, snapshot, { metadata: { date, type: "provider-snapshot" } });
  return json(200, { created: true, date, connected: { google: snapshot.google.connected, meta: snapshot.meta.connected } });
}
