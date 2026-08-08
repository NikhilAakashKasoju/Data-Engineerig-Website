<?php
/**
 * TEMPLATE — commit this file, never config.php.
 *
 * Copy it to config.php and fill in. On Windows, turn on File Explorer's
 * "File name extensions" first: with them hidden, typing "config.php" into the
 * rename box produces config.php.php and PHP will never find it.
 *
 * config.php holds live credentials and is gitignored. It is not served as text
 * because PHP executes it, and .htaccess denies it as well — belt and braces,
 * in case PHP is ever mis-configured on the host.
 */

return [
    // ---- Database (hPanel → Databases → MySQL) -------------------------
    // Hostinger prefixes both names, e.g. u881542689_leads_azure. Use the
    // prefixed values, and note the database and user may differ.
    'db_host' => 'localhost',
    'db_name' => '',
    'db_user' => '',
    'db_pass' => '',

    // ---- Admin login ----------------------------------------------------
    'admin_user' => 'admin',

    // A bcrypt hash, never a plaintext password. Generate it by visiting
    // make-hash.php?p=YourPassword on the server, then DELETE that file.
    'admin_password_hash' => '',

    // ---- Lead notification ---------------------------------------------
    // Where the "new lead" ping goes.
    'notify_to' => 'edufulness@gmail.com',

    // Must be an address ON THIS DOMAIN. Sending as @gmail.com from a
    // Hostinger server fails SPF and lands in spam.
    'notify_from' => 'no-reply@edufulness.com',
    'notify_name' => 'EduFulness Masterclass',

    // ---- Security -------------------------------------------------------
    // Origin allowed to POST to contact.php. Leave as null when the form is
    // served from the same domain — then no CORS header is sent at all, which
    // is the safest setting. Only set it if the site moves to a subdomain.
    'allowed_origin' => null,   // e.g. 'https://masterclass.edufulness.com'

    // Max form submissions per IP per hour.
    'max_submissions_per_hour' => 5,

    // Max failed logins per IP per 15 minutes.
    'max_login_attempts' => 8,

    // Minimum seconds between the form rendering and submitting. Humans take
    // longer than this; most bots do not.
    'min_fill_seconds' => 3,
];
