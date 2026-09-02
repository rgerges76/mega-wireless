import { createAuthorization } from "./_shared/oauth.mjs";
import { json, requireOwner, sameOrigin } from "./_shared/marketing.mjs";

export async function handler(event, context) {
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });
  if (!sameOrigin(event)) return json(403, { error: "Request rejected" });
  let owner;
  try { owner = requireOwner(context); } catch { return json(401, { error: "Owner authentication required" }); }
  try {
    const provider = String(JSON.parse(event.body || "{}").provider || "");
    return json(200, { authorization_url: await createAuthorization(provider, owner) });
  } catch (error) { return json(503, { error: error instanceof Error ? error.message : "Authorization unavailable" }); }
}
