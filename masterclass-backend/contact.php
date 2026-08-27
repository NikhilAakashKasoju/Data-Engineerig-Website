<?php
/**
 * Lead capture endpoint. Stores the submission, then fires a notification.
 *
 * Storage is the source of truth and the email is best-effort: if the ping
 * fails the lead is already saved and `notified` stays 0, so nothing is lost
 * and the dashboard can show which ones didn't send.
 */

declare(strict_types=1);

require __DIR__ . '/lib.php';

/* ------------------------------------------------------------- CORS -- */

// Only sent when the form lives on a different origin. Same-domain deploys
// leave allowed_origin null and send no CORS header at all, which is safest.
if (!empty($CONFIG['allowed_origin'])) {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if (hash_equals((string) $CONFIG['allowed_origin'], $origin)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Vary: Origin');
        header('Access-Control-Allow-Methods: POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
    }
}

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    json_out(['ok' => false, 'error' => 'Method not allowed.'], 405);
}

/* ------------------------------------------------------------ input -- */

$raw  = file_get_contents('php://input') ?: '';
$body = json_decode($raw, true);

// Fall back to form-encoded so the endpoint still works without JavaScript.
if (!is_array($body)) {
    $body = $_POST;
}

$name    = trim((string) ($body['name'] ?? ''));
$email   = trim((string) ($body['email'] ?? ''));
$message = trim((string) ($body['message'] ?? ''));
// `course` is the slug from the posting site's config. `source` is the old
// field name, accepted so an un-redeployed site keeps working.
$slug    = trim((string) ($body['course'] ?? $body['source'] ?? ''));
$hp      = trim((string) ($body['company'] ?? ''));      // honeypot
$started = (int) ($body['started'] ?? 0);                 // ms timestamp

/* ------------------------------------------------------------- bots -- */

// Honeypot: a field hidden from humans via CSS. Anything that fills it is
// automated. Returns success so the bot doesn't learn it was caught.
if ($hp !== '') {
    json_out(['ok' => true]);
}

// Nobody reads a form, types a name, an email and a message in under a few
// seconds. Same silent-success response.
$elapsed = $started > 0 ? (time() - (int) floor($started / 1000)) : PHP_INT_MAX;
if ($elapsed < (int) $CONFIG['min_fill_seconds']) {
    json_out(['ok' => true]);
}

if (!rate_ok('contact', (int) $CONFIG['max_submissions_per_hour'], 3600)) {
    json_out(['ok' => false, 'error' => 'Too many submissions. Please try again later.'], 429);
}

/* ------------------------------------------------------- validation -- */

// Repeated server-side even though the browser checks too: the client is not a
// trust boundary and anyone can POST here directly.
if (mb_strlen($name) < 2 || mb_strlen($name) > 120) {
    json_out(['ok' => false, 'error' => 'Please enter your name.'], 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 190) {
    json_out(['ok' => false, 'error' => 'Please enter a valid email address.'], 400);
}

if (mb_strlen($message) > 2000) {
    json_out(['ok' => false, 'error' => 'That message is too long.'], 400);
}

/**
 * The course must exist in the registry and be active.
 *
 * Previously this was a regex, so a typo in a site's config silently created a
 * phantom source and the leads were effectively lost. Validating against the
 * registry makes a misconfigured site fail loudly at the first submission
 * instead of quietly for weeks.
 */
$course = course_by_slug($slug);

if (!$course) {
    error_log('[contact] unknown course slug: ' . $slug);
    json_out(['ok' => false, 'error' => 'This form is not configured correctly.'], 400);
}

if (!(int) $course['active']) {
    json_out(['ok' => false, 'error' => 'This course is no longer accepting enquiries.'], 410);
}

/* ----------------------------------------------------------- store -- */

try {
    $stmt = db()->prepare(
        'INSERT INTO leads (name, email, message, course_id, source, ip, user_agent)
         VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        $name,
        $email,
        $message !== '' ? $message : null,
        $course['id'],
        // Denormalised copy, kept while `source` still exists on the table.
        // Drop this argument and the column together.
        $course['slug'],
        client_ip(),
        mb_substr((string) ($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 255),
    ]);
    $leadId = (int) db()->lastInsertId();
} catch (Throwable $err) {
    // Never leak SQL detail to the browser.
    error_log('[contact] insert failed: ' . $err->getMessage());
    json_out(['ok' => false, 'error' => 'Something went wrong. Please try again.'], 500);
}

/* ------------------------------------------------------------ ping -- */

// Course name, not slug — with several sites feeding one inbox, the subject
// line is how you tell at a glance which course an enquiry is for.
$subject = sprintf('New lead: %s — %s', $course['name'], $name);

$lines = [
    'A new enquiry came in from the ' . $course['name'] . ' page.',
    '',
    'Name:    ' . $name,
    'Email:   ' . $email,
    'Message: ' . ($message !== '' ? $message : '(none)'),
    '',
    'Received: ' . date('d M Y, H:i'),
    'Dashboard: https://' . ($_SERVER['HTTP_HOST'] ?? 'edufulness.com') . dirname($_SERVER['REQUEST_URI'] ?? '') . '/admin.php',
];

// From must be on this domain or SPF fails and the mail is filtered.
// Reply-To is the lead, so replying from the inbox reaches them directly.
$headers = implode("\r\n", [
    'From: ' . $CONFIG['notify_name'] . ' <' . $CONFIG['notify_from'] . '>',
    'Reply-To: ' . $name . ' <' . $email . '>',
    'Content-Type: text/plain; charset=utf-8',
    'X-Mailer: PHP/' . PHP_VERSION,
]);

$sent = @mail(
    (string) $CONFIG['notify_to'],
    $subject,
    implode("\n", $lines),
    $headers,
    '-f' . $CONFIG['notify_from']
);

if ($sent) {
    $mark = db()->prepare('UPDATE leads SET notified = 1 WHERE id = ?');
    $mark->execute([$leadId]);
} else {
    error_log('[contact] notification mail failed for lead ' . $leadId);
}

// The lead is saved either way, so the visitor always sees success.
json_out(['ok' => true]);
