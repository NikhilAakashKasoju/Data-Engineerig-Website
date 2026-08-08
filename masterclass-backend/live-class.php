<?php
/**
 * Public read endpoint for the Live Classes section.
 *
 * Returns pre-formatted strings rather than raw values, so the browser does no
 * date maths. Formatting on the server means one implementation, and no risk of
 * a visitor's locale or timezone rendering "22 August" as something else.
 *
 * Read-only. Editing happens in live-admin.php behind a session.
 */

declare(strict_types=1);

require __DIR__ . '/lib.php';

header('Content-Type: application/json; charset=utf-8');

// Short cache: the page fetches this on every load, and a session date changes
// at most a few times a week. 60s keeps it fresh without hammering MySQL.
header('Cache-Control: public, max-age=60');

if (!empty($CONFIG['allowed_origin'])) {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if (hash_equals((string) $CONFIG['allowed_origin'], $origin)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Vary: Origin');
    }
}

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

try {
    $row = db()->query('SELECT * FROM live_class WHERE id = 1')->fetch();
} catch (Throwable $err) {
    error_log('[live-class] read failed: ' . $err->getMessage());
    // 200 with enabled:null so the front end quietly keeps its built-in values
    // instead of showing an error to a visitor about a CMS they don't know about.
    echo json_encode(['enabled' => null]);
    exit;
}

if (!$row) {
    echo json_encode(['enabled' => null]);
    exit;
}

if (!(int) $row['enabled']) {
    echo json_encode(['enabled' => false]);
    exit;
}

$ts = strtotime((string) $row['starts_at']);

$highlights = array_values(array_filter(
    array_map('trim', preg_split('/\r\n|\r|\n/', (string) $row['highlights']) ?: []),
    static fn(string $line): bool => $line !== '',
));

echo json_encode([
    'enabled'      => true,
    'topic'        => $row['topic'],
    'month'        => date('M', $ts),
    'day'          => date('j', $ts),
    'dateText'     => date('l, j F Y', $ts),
    'timeText'     => date('g:i A', $ts) . ' IST · ' . $row['duration'],
    'modeText'     => $row['mode_text'],
    'blurb'        => $row['blurb'],
    'highlights'   => $highlights,
    'registerUrl'  => $row['register_url'],
    'registerNote' => $row['register_note'],
], JSON_UNESCAPED_UNICODE);
