MEGA REWARDS FIX
================

Modified files:
- index.html
- public/index.html
- _redirects
- public/_redirects

The rewards form now:
1. Uses a new Netlify form name: mega-rewards-v3
2. Submits with JavaScript as URL-encoded form data
3. Redirects only after Netlify returns a successful response
4. Keeps the customer on the form and shows an error if submission fails
5. Includes redirects for the rewards success page

Upload the COMPLETE contents of this folder to GitHub, replacing the existing files.
