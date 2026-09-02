import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const publicRoot = path.join(root, "public");
const files = [];
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(full);
    else if (/\.(?:html|js|json|xml|txt|webmanifest)$/.test(entry.name)) files.push(full);
  }
}
await walk(publicRoot);
for (const file of files) {
  const source = await readFile(file, "utf8");
  const relative = path.relative(root, file);
  if (/SUPABASE_SERVICE_ROLE|GOOGLE_CLIENT_SECRET|META_APP_SECRET|PRIVATE KEY|MARKETING_TOKEN_ENCRYPTION_KEY/.test(source)) throw new Error(`Server secret name found in public file ${relative}`);
  if (/"cost"\s*:|unit_cost|profit_margin|serial_or_imei/i.test(source)) throw new Error(`Private inventory field found in public file ${relative}`);
}
console.log(`Checked ${files.length} public files: no server secrets or private inventory fields.`);
