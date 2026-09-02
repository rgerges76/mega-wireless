import { consumeState, exchangeCode, storeTokens } from "./_shared/oauth.mjs";

const page = (title, message, ok) => ({ statusCode: ok ? 200 : 400, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store, private", "x-content-type-options": "nosniff", "content-security-policy": "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'" }, body: `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${title}</title><style>body{background:#07102d;color:#fff;font:16px Arial;display:grid;place-items:center;min-height:100vh;margin:0}.box{max-width:520px;padding:28px;border:1px solid #00e5ff;border-radius:18px;background:#10194a}a{color:#7dffc4}</style><div class="box"><h1>${title}</h1><p>${message}</p><a href="/owner/">Return to Owner Dashboard</a></div>` });

export async function handler(event) {
  try {
    const provider = String(event.queryStringParameters?.provider || ""), code = String(event.queryStringParameters?.code || ""), state = String(event.queryStringParameters?.state || "");
    if (!code || !state) throw new Error("Authorization was not completed");
    const owner = await consumeState(state, provider), token = await exchangeCode(provider, code);
    await storeTokens(provider, token, owner.owner);
    return page("Account connected", `${provider === "google" ? "Google" : "Facebook and Instagram"} reporting is securely connected.`, true);
  } catch (error) { return page("Connection incomplete", String(error instanceof Error ? error.message : "Authorization failed").replace(/[<>]/g, ""), false); }
}
