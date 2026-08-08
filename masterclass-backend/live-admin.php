<?php
declare(strict_types=1);

require __DIR__ . '/lib.php';
require_login();

$saved = false;
$error = '';

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
    csrf_check($_POST['csrf'] ?? null);

    $topic     = trim((string) ($_POST['topic'] ?? ''));
    $startsAt  = trim((string) ($_POST['starts_at'] ?? ''));
    $duration  = trim((string) ($_POST['duration'] ?? ''));
    $modeText  = trim((string) ($_POST['mode_text'] ?? ''));
    $blurb     = trim((string) ($_POST['blurb'] ?? ''));
    $highlights = trim((string) ($_POST['highlights'] ?? ''));
    $registerUrl = trim((string) ($_POST['register_url'] ?? ''));
    $registerNote = trim((string) ($_POST['register_note'] ?? ''));
    $enabled   = isset($_POST['enabled']) ? 1 : 0;

    // datetime-local posts as "2026-08-22T10:00" — MySQL wants a space.
    $startsAt = str_replace('T', ' ', $startsAt);
    if (strlen($startsAt) === 16) {
        $startsAt .= ':00';
    }

    if ($topic === '') {
        $error = 'Topic is required.';
    } elseif (!strtotime($startsAt)) {
        $error = 'Enter a valid date and time.';
    } elseif (!filter_var($registerUrl, FILTER_VALIDATE_URL)) {
        $error = 'Registration link must be a full URL starting with https://';
    } else {
        try {
            db()->prepare(
                'UPDATE live_class SET
                   enabled = ?, topic = ?, starts_at = ?, duration = ?, mode_text = ?,
                   blurb = ?, highlights = ?, register_url = ?, register_note = ?
                 WHERE id = 1'
            )->execute([
                $enabled, $topic, $startsAt, $duration, $modeText,
                $blurb, $highlights, $registerUrl, $registerNote,
            ]);
            $saved = true;
        } catch (Throwable $err) {
            error_log('[live-admin] save failed: ' . $err->getMessage());
            $error = 'Could not save. Please try again.';
        }
    }
}

$row = db()->query('SELECT * FROM live_class WHERE id = 1')->fetch();

// datetime-local needs the "T" separator back.
$startsAtInput = $row ? str_replace(' ', 'T', substr((string) $row['starts_at'], 0, 16)) : '';
$token = csrf_token();
?>
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Live class · EduFulness Masterclass</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body { margin:0; background:#0d0714; color:#f4f4f6; padding:28px 20px 64px;
         font:15px/1.55 system-ui,-apple-system,Segoe UI,Roboto,sans-serif; }
  .wrap { max-width:760px; margin:0 auto; }
  header { display:flex; flex-wrap:wrap; gap:14px; align-items:center;
           justify-content:space-between; margin-bottom:26px; }
  h1 { margin:0; font-size:21px; }
  a { color:#4b85ff; }
  .btn { display:inline-block; padding:10px 18px; border-radius:999px; font-size:13.5px;
         font-weight:600; text-decoration:none; color:#fff; border:0; cursor:pointer;
         background:linear-gradient(135deg,#0b4fdb,#2f74f0); }
  .btn.ghost { background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.12); }
  label { display:block; margin:18px 0 6px; font-size:11px; letter-spacing:.08em;
          text-transform:uppercase; color:#8a8a96; }
  input[type=text], input[type=url], input[type=datetime-local], textarea {
    width:100%; padding:12px 14px; font:inherit; font-size:14.5px; color:#f4f4f6;
    background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.1);
    border-radius:10px; }
  input:focus, textarea:focus { outline:2px solid #4b85ff; outline-offset:2px;
    border-color:transparent; }
  textarea { resize:vertical; }
  .hint { margin-top:6px; font-size:12.5px; color:#8a8a96; }
  .row { display:grid; gap:16px; grid-template-columns:1fr 1fr; }
  .toggle { display:flex; align-items:center; gap:10px; margin:22px 0 4px;
            padding:14px 16px; border:1px solid rgba(255,255,255,.1);
            border-radius:12px; background:rgba(255,255,255,.02); }
  .toggle input { width:18px; height:18px; accent-color:#0b4fdb; }
  .msg { margin-bottom:18px; padding:11px 14px; border-radius:9px; font-size:13.5px; }
  .ok { background:rgba(94,234,212,.1); border:1px solid rgba(94,234,212,.35); color:#5eead4; }
  .err { background:rgba(220,60,60,.12); border:1px solid rgba(220,60,60,.35); color:#ffb4b4; }
  @media (max-width:640px){ .row{grid-template-columns:1fr} }
</style>
</head>
<body>
<div class="wrap">

  <header>
    <h1>Live class</h1>
    <div style="display:flex;gap:10px;">
      <a class="btn ghost" href="admin.php">Leads</a>
      <a class="btn ghost" href="logout.php">Sign out</a>
    </div>
  </header>

  <?php if ($saved): ?>
    <p class="msg ok">Saved. The live page updates within a minute.</p>
  <?php endif; ?>
  <?php if ($error !== ''): ?>
    <p class="msg err"><?= e($error) ?></p>
  <?php endif; ?>

  <form method="post">
    <input type="hidden" name="csrf" value="<?= e($token) ?>">

    <div class="toggle">
      <input type="checkbox" id="enabled" name="enabled" value="1"
             <?= $row && (int) $row['enabled'] ? 'checked' : '' ?>>
      <label for="enabled" style="margin:0;text-transform:none;letter-spacing:0;font-size:14.5px;color:#f4f4f6">
        Show the upcoming session on the website
      </label>
    </div>
    <p class="hint">Untick when nothing is scheduled. The section stays on the page
      but points visitors at the WhatsApp channel instead of showing a stale date.</p>

    <label for="topic">Topic</label>
    <input type="text" id="topic" name="topic" maxlength="200" required
           value="<?= e($row['topic'] ?? '') ?>">

    <div class="row">
      <div>
        <label for="starts_at">Date &amp; time (IST)</label>
        <input type="datetime-local" id="starts_at" name="starts_at" required
               value="<?= e($startsAtInput) ?>">
      </div>
      <div>
        <label for="duration">Duration</label>
        <input type="text" id="duration" name="duration" maxlength="60"
               value="<?= e($row['duration'] ?? '90 minutes') ?>">
      </div>
    </div>
    <p class="hint">The calendar tile and the long date on the page are both generated
      from this — they can't disagree.</p>

    <label for="mode_text">Format line</label>
    <input type="text" id="mode_text" name="mode_text" maxlength="80"
           value="<?= e($row['mode_text'] ?? 'Online · free to attend') ?>">

    <label for="blurb">Description</label>
    <textarea id="blurb" name="blurb" rows="4"><?= e($row['blurb'] ?? '') ?></textarea>

    <label for="highlights">What's covered — one per line</label>
    <textarea id="highlights" name="highlights" rows="4"><?= e($row['highlights'] ?? '') ?></textarea>
    <p class="hint">Three lines works best. Blank lines are ignored.</p>

    <div class="row">
      <div>
        <label for="register_url">Registration link</label>
        <input type="url" id="register_url" name="register_url" required
               value="<?= e($row['register_url'] ?? '') ?>">
      </div>
      <div>
        <label for="register_note">Note under the button</label>
        <input type="text" id="register_note" name="register_note" maxlength="80"
               value="<?= e($row['register_note'] ?? 'No payment required') ?>">
      </div>
    </div>

    <p style="margin-top:26px"><button class="btn" type="submit">Save changes</button></p>
  </form>

</div>
</body>
</html>
