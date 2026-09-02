import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { getStore } from "@netlify/blobs";

const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/analytics.readonly",
  "https://www.googleapis.com/auth/webmasters.readonly",
  "https://www.googleapis.com/auth/business.manage",
];
const META_SCOPES = ["pages_show_list", "pages_read_engagement", "read_insights", "instagram_basic", "instagram_manage_insights"];

function encryptionKey() {
  const raw = Buffer.from(process.env.MARKETING_TOKEN_ENCRYPTION_KEY || "", "base64");
  if (raw.length !== 32) throw new Error("Token encryption is not configured");
  return raw;
}

export function encrypt(value) {
  const iv = randomBytes(12), cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(value), "utf8"), cipher.final()]);
  return { version: 1, iv: iv.toString("base64"), tag: cipher.getAuthTag().toString("base64"), ciphertext: ciphertext.toString("base64") };
}

export function decrypt(value) {
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), Buffer.from(value.iv, "base64"));
  decipher.setAuthTag(Buffer.from(value.tag, "base64"));
  return JSON.parse(Buffer.concat([decipher.update(Buffer.from(value.ciphertext, "base64")), decipher.final()]).toString("utf8"));
}

export function providerConfig(provider) {
  const callback = `https://megawirelessusa.com/.netlify/functions/oauth-callback?provider=${provider}`;
  if (provider === "google") {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) throw new Error("Google authorization is not configured");
    return { provider, clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET, callback, scopes: GOOGLE_SCOPES };
  }
  if (provider === "meta") {
    if (!process.env.META_APP_ID || !process.env.META_APP_SECRET) throw new Error("Meta authorization is not configured");
    return { provider, clientId: process.env.META_APP_ID, clientSecret: process.env.META_APP_SECRET, callback, scopes: META_SCOPES };
  }
  throw new Error("Unsupported provider");
}

export async function createAuthorization(provider, owner) {
  const config = providerConfig(provider), state = randomBytes(32).toString("base64url");
  const store = getStore("marketing-oauth-state");
  await store.setJSON(state, { provider, owner: owner.email, expires_at: Date.now() + 10 * 60 * 1000 });
  const endpoint = provider === "google" ? "https://accounts.google.com/o/oauth2/v2/auth" : `https://www.facebook.com/${process.env.META_GRAPH_VERSION || "v24.0"}/dialog/oauth`;
  const query = new URLSearchParams({ client_id: config.clientId, redirect_uri: config.callback, response_type: "code", scope: config.scopes.join(provider === "google" ? " " : ","), state });
  if (provider === "google") { query.set("access_type", "offline"); query.set("prompt", "consent"); query.set("include_granted_scopes", "true"); }
  return `${endpoint}?${query}`;
}

export async function consumeState(state, provider) {
  const store = getStore("marketing-oauth-state"), record = await store.get(state, { type: "json" });
  if (!record || record.provider !== provider || record.expires_at < Date.now()) throw new Error("Authorization state expired");
  await store.delete(state);
  return record;
}

export async function exchangeCode(provider, code) {
  const config = providerConfig(provider);
  if (provider === "google") {
    const response = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ code, client_id: config.clientId, client_secret: config.clientSecret, redirect_uri: config.callback, grant_type: "authorization_code" }) });
    if (!response.ok) throw new Error(`Google authorization failed (${response.status})`);
    return response.json();
  }
  const version = process.env.META_GRAPH_VERSION || "v24.0";
  const response = await fetch(`https://graph.facebook.com/${version}/oauth/access_token?${new URLSearchParams({ client_id: config.clientId, client_secret: config.clientSecret, redirect_uri: config.callback, code })}`);
  if (!response.ok) throw new Error(`Meta authorization failed (${response.status})`);
  const shortToken = await response.json();
  const longResponse = await fetch(`https://graph.facebook.com/${version}/oauth/access_token?${new URLSearchParams({ grant_type: "fb_exchange_token", client_id: config.clientId, client_secret: config.clientSecret, fb_exchange_token: shortToken.access_token })}`);
  return longResponse.ok ? longResponse.json() : shortToken;
}

export async function storeTokens(provider, token, owner) {
  const store = getStore("marketing-integrations");
  await store.setJSON(`${provider}.json`, { provider, encrypted: encrypt(token), authorized_by: owner, authorized_at: new Date().toISOString() });
}

export async function loadTokens(provider) {
  const store = getStore("marketing-integrations"), record = await store.get(`${provider}.json`, { type: "json" });
  return record ? { ...record, token: decrypt(record.encrypted) } : null;
}

export async function googleAccessToken() {
  const record = await loadTokens("google");
  if (!record) return null;
  if (!record.token.refresh_token) return record.token.access_token;
  const config = providerConfig("google");
  const response = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ client_id: config.clientId, client_secret: config.clientSecret, refresh_token: record.token.refresh_token, grant_type: "refresh_token" }) });
  if (!response.ok) throw new Error(`Google refresh failed (${response.status})`);
  return (await response.json()).access_token;
}
