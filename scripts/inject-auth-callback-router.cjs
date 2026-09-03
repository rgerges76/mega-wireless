const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const publishDir = path.join(root, 'dist');
const indexPath = path.join(publishDir, 'index.html');
const headersPath = path.join(publishDir, '_headers');

let html = fs.readFileSync(indexPath, 'utf8');
const marker = 'mw-auth-callback-router';

if (!html.includes(marker)) {
  const router = `\n<script id="${marker}">(function(){\n  var h=window.location.hash||'';\n  if(/recovery_token=/.test(h)){window.location.replace('/reset-password.html'+h);return;}\n  if(/invite_token=|confirmation_token=/.test(h)){window.location.replace('/admin/'+h);}\n})();<\/script>\n`;
  html = html.replace(/<head(.*?)>/i, (match) => match + router);
  fs.writeFileSync(indexPath, html, 'utf8');
}

let headers = fs.readFileSync(headersPath, 'utf8');
if (!headers.includes('/reset-password.html\n')) {
  headers += `\n/reset-password.html\n  Cache-Control: no-store, private, max-age=0\n  X-Robots-Tag: noindex, nofollow, noarchive\n  Referrer-Policy: no-referrer\n  Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self' 'unsafe-inline' https://identity.netlify.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self' https://identity.netlify.com https://*.netlify.com; frame-src https://identity.netlify.com; upgrade-insecure-requests\n`;
  fs.writeFileSync(headersPath, headers, 'utf8');
}

console.log('Auth callback router injected into Netlify publish output.');
