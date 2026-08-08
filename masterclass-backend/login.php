<?php
declare(strict_types=1);

require __DIR__ . '/lib.php';

if (is_logged_in()) {
    header('Location: admin.php');
    exit;
}

$error = '';

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
    csrf_check($_POST['csrf'] ?? null);

    // Throttle before checking credentials, so brute force is limited
    // regardless of whether the username happens to be right.
    if (!rate_ok('login', (int) $CONFIG['max_login_attempts'], 900)) {
        $error = 'Too many attempts. Try again in 15 minutes.';
    } elseif (login(trim((string) ($_POST['user'] ?? '')), (string) ($_POST['pass'] ?? ''))) {
        header('Location: admin.php');
        exit;
    } else {
        // Deliberately vague: naming which field was wrong tells an attacker
        // when they've found a valid username.
        $error = 'Incorrect username or password.';
    }
}
?>
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Admin · EduFulness Masterclass</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body {
    margin: 0; min-height: 100vh; display: grid; place-items: center;
    background: #0d0714; color: #f4f4f6; padding: 24px;
    font: 15px/1.5 system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  }
  form {
    width: 100%; max-width: 360px; padding: 32px;
    border: 1px solid rgba(255,255,255,.09); border-radius: 16px;
    background: rgba(255,255,255,.02);
  }
  h1 { margin: 0 0 4px; font-size: 20px; }
  p.sub { margin: 0 0 24px; color: #8a8a96; font-size: 13.5px; }
  label { display: block; margin-bottom: 6px; font-size: 12px; letter-spacing: .08em;
          text-transform: uppercase; color: #8a8a96; }
  input {
    width: 100%; margin-bottom: 16px; padding: 12px 14px; font-size: 15px;
    color: #f4f4f6; background: rgba(255,255,255,.04);
    border: 1px solid rgba(255,255,255,.1); border-radius: 10px;
  }
  input:focus { outline: 2px solid #4b85ff; outline-offset: 2px; border-color: transparent; }
  button {
    width: 100%; padding: 13px; font-size: 15px; font-weight: 600; color: #fff;
    background: linear-gradient(135deg, #0b4fdb, #2f74f0);
    border: 0; border-radius: 10px; cursor: pointer;
  }
  .err {
    margin: 0 0 16px; padding: 10px 12px; border-radius: 8px; font-size: 13.5px;
    background: rgba(220,60,60,.12); border: 1px solid rgba(220,60,60,.35); color: #ffb4b4;
  }
</style>
</head>
<body>
  <form method="post" autocomplete="off">
    <h1>Masterclass admin</h1>
    <p class="sub">Course enquiries</p>

    <?php if ($error !== ''): ?>
      <p class="err"><?= e($error) ?></p>
    <?php endif; ?>

    <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">

    <label for="user">Username</label>
    <input id="user" name="user" type="text" required autofocus>

    <label for="pass">Password</label>
    <input id="pass" name="pass" type="password" required>

    <button type="submit">Sign in</button>
  </form>
</body>
</html>
