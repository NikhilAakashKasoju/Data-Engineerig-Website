<?php
/**
 * One-time helper to generate the bcrypt hash for config.php.
 *
 *   https://edufulness.com/masterclass/make-hash.php?p=YourPasswordHere
 *
 * DELETE THIS FILE IMMEDIATELY AFTERWARDS.
 *
 * As a safety net it refuses to run once admin_password_hash is set, so it
 * can't be used to fish for a working hash after setup. That is a backstop,
 * not a substitute for deleting it.
 */

declare(strict_types=1);

$config = is_file(__DIR__ . '/config.php') ? require __DIR__ . '/config.php' : [];

header('Content-Type: text/plain; charset=utf-8');

if (!empty($config['admin_password_hash'])) {
    http_response_code(410);
    exit("Already configured. Delete this file.\n");
}

$password = (string) ($_GET['p'] ?? '');

if (strlen($password) < 12) {
    exit("Pass ?p=<password>. Use at least 12 characters.\n");
}

echo "Paste this into config.php as admin_password_hash:\n\n";
echo password_hash($password, PASSWORD_DEFAULT), "\n\n";
echo "Then DELETE make-hash.php from the server.\n";
