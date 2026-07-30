MEGA REWARDS FINAL FIX
======================

Files updated:
- index.html
- public/index.html
- _redirects
- public/_redirects

What changed:
- Rewards form no longer posts directly to the success page.
- JavaScript submits the form to Netlify first.
- Only after a successful response does the browser open /rewards-success.html.
- Both possible publish directories (root and public) are covered.

Important:
Confirm Netlify is connected to the same GitHub repository and check its Publish directory.
If Publish directory is public, Netlify uses public/index.html.
If Publish directory is blank or ., Netlify uses index.html.
