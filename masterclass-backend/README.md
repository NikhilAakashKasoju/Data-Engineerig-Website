# Masterclass backend — lead capture + admin

Self-contained. **Nothing in the client's existing site is modified.** Upload
this whole folder to `public_html/masterclass/` and their `index.html`,
`api.php`, `courses.json` and admin dashboard keep working untouched.

Runs on the current **Premium** plan — PHP + MySQL, no Node, no upgrade.

## Setup

**1. Create the database**

hPanel → Databases → MySQL. Note the database name, user and password
(Hostinger prefixes them, e.g. `u123456789_leads`).

**2. Create the tables**

hPanel → phpMyAdmin → select the database → SQL tab → paste `schema.sql` → Go.

**3. Configure**

Copy `config.example.php` to `config.php` and fill in the database credentials
and `notify_to`.

Leave `allowed_origin` as `null` if the site is a subfolder of the same domain.
Only set it if the site ends up on a subdomain.

**4. Set the admin password**

Upload the folder, then visit:

```
https://edufulness.com/masterclass/make-hash.php?p=YourLongPassword
```

Paste the hash into `config.php` as `admin_password_hash`, then **delete
`make-hash.php` from the server**. It refuses to run once a hash is set, but
delete it anyway.

**5. Test**

- `https://edufulness.com/masterclass/login.php` — sign in
- Submit the form on the course page
- Confirm the lead appears and the notification email arrives

## Files

| File | Purpose |
|---|---|
| `contact.php` | Public endpoint. Validates, throttles, stores, pings. |
| `live-class.php` | Public read-only JSON for the Live Classes section. |
| `live-admin.php` | Form to edit the upcoming session. |
| `admin.php` | Dashboard — list, search, filter, status, delete. |
| `login.php` / `logout.php` | Session auth. |
| `export.php` | CSV download. |
| `lib.php` | DB, sessions, auth, CSRF, rate limiting. |
| `schema.sql` | Table definitions. |
| `make-hash.php` | One-time password hasher. **Delete after use.** |

## Security notes

Deliberate choices, in case they look unusual later:

- **Passwords are bcrypt hashes**, never plaintext in a constant. `password_verify`
  is constant-time.
- **Sessions, not a static token.** A fixed secret derived from a known string
  is the same value for everyone forever and can be recomputed by anyone who
  reads the file.
- `session_regenerate_id(true)` on login prevents session fixation.
- **CSRF tokens** on every state-changing POST; cookies are `SameSite=Strict`,
  `HttpOnly`, and `Secure` over HTTPS.
- **Prepared statements everywhere**, with `EMULATE_PREPARES` off.
- **Rate limiting** on both submissions and logins, keyed by IP.
- **Honeypot + timing check.** Both return success so bots don't learn they
  were caught.
- **CSV injection guarded** — values starting `=`, `+`, `-` or `@` are prefixed
  with a tab so Excel doesn't execute them.
- Login errors never say which field was wrong.
- `.htaccess` denies `schema.sql` and `config.*` over HTTP.

## Known limits

- **`mail()` deliverability.** Fine to an address on the same domain; Gmail may
  filter it. If pings go missing, switch to SMTP via a Hostinger mailbox
  (PHPMailer) — the lead is stored regardless, and the dashboard shows a "ping
  failed" flag.
- **No email verification** — addresses are validated for format only.
- Leads are personal data. Delete what's no longer needed, and keep the privacy
  line under the form accurate.
