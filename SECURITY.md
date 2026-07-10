# Security rules

1. Never place the Supabase service-role key in the website. Only the public anon key belongs in `config.js`.
2. Never store customer records, employee PINs, passwords, IMEI lists, or sales data in localStorage.
3. Keep Row Level Security enabled on every private table.
4. Use Supabase Auth accounts for employees. Passwords are handled by the authentication service, not by HTML files.
5. Do not store full card numbers, CVV, or magnetic-stripe data. Store only payment type and optional last four digits.
6. Admin is not linked from the public navigation. Use the private `/admin.html` URL.
7. Enable MFA for admin accounts and require strong passwords.
8. Review audit logs and revoke former employees immediately.
9. Use HTTPS only. Netlify and Supabase both provide HTTPS.
10. Back up the database before migrations.
