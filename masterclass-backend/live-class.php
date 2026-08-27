<?php
/**
 * Public read endpoint for a course's Live Classes section.
 *
 *   GET live-class.php?course=data-engineering
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
    // allowed_origin may be a single string or a list, since several course
    // sites can share this backend.
    $allowed = (array) $CONFIG['allowed_origin'];
    if (in_array($origin, $allowed, true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Vary: Origin');
    }
}

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

/**
 * Every failure below returns 200 with enabled:null.
 *
 * The consumer is a marketing page that already has real content baked in and
 * only *replaces* it on a successful response. Returning an error status would
 * make the browser log a console error about a CMS the visitor doesn't know
 * exists, for no benefit — the page looks identical either way.
 */
$fallback = static function (): never {
    echo json_encode(['enabled' => null]);
    exit;
};

$slug = trim((string) ($_GET['course'] ?? ''));

try {
    $course = course_by_slug($slug);
    if (!$course) {
        error_log('[live-class] unknown course slug: ' . $slug);
        $fallback();
    }

    $stmt = db()->prepare('SELECT * FROM live_class WHERE course_id = ? LIMIT 1');
    $stmt->execute([$course['id']]);
    $row = $stmt->fetch();
} catch (Throwable $err) {
    error_log('[live-class] read failed: ' . $err->getMessage());
    $fallback();
}

// A course with no row yet is normal — a new site can go live before anyone
// has configured its live class. Treated as "nothing scheduled" rather than an
// error, so the section shows its TBA state.
if (!$row) {
    echo json_encode(['enabled' => false]);
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
