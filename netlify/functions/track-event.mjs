import { json, normalizeEvent, sameOrigin, saveEvent } from "./_shared/marketing.mjs";

export async function handler(event) {
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" }, { allow: "POST" });
  if (!sameOrigin(event)) return json(403, { error: "Request rejected" });
  if (!String(event.headers?.["content-type"] || "").toLowerCase().startsWith("application/json")) return json(415, { error: "JSON required" });
  if ((event.body || "").length > 12000) return json(413, { error: "Payload too large" });
  try {
    const record = normalizeEvent(JSON.parse(event.body || "{}"));
    const result = await saveEvent(record);
    return json(result.duplicate ? 200 : 202, { accepted: true, duplicate: result.duplicate });
  } catch {
    return json(400, { error: "Invalid analytics event" });
  }
}
