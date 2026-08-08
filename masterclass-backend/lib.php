<?php
/**
 * Shared plumbing: config, database, sessions, auth, CSRF, throttling.
 * Not directly reachable — .htaccess denies it and it produces no output.
 */

declare(strict_types=1);

if (!is_file(__DIR__ . '/config.php')) {
    http_response_code(500);
    exit('config.php missing. Copy config.example.php and fill it in.');
}

/** @var array<string,mixed> $CONFIG */
$CONFIG = require __DIR__ . '/config.php';

/* ----------------------------------------------------------- database -- */

function db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    global $CONFIG;

    $dsn = sprintf(
        'mysql:host=%s;dbname=%s;charset=utf8mb4',
        $CONFIG['db_host'],
        $CONFIG['db_name']
    );

    // ERRMODE_EXCEPTION so a failed query throws instead of returning false and
    // silently continuing. EMULATE_PREPARES off so prepared statements are
    // genuinely prepared server-side rather than string-interpolated.
    $pdo = new PDO($dsn, $CONFIG['db_user'], $CONFIG['db_pass'], [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);

    return $pdo;
}

/* ------------------------------------------------------------ helpers -- */

function json_out(array $data, int $code = 200): never
{
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function client_ip(): string
{
    // On shared hosting the app sits behind a proxy, so REMOTE_ADDR is the
    // proxy. X-Forwarded-For is spoofable, so it is only ever used for
    // throttling and diagnostics — never for access control.
    $forwarded = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
    if ($forwarded !== '') {
        $first = trim(explode(',', $forwarded)[0]);
        if (filter_var($first, FILTER_VALIDATE_IP)) {
            return $first;
        }
    }
    return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}

/** True when the caller is still under the limit; records the attempt. */
function rate_ok(string $bucket, int $limit, int $windowSeconds): bool
{
    $ip = client_ip();

    // Prune first so the table stays small without a cron job.
    $prune = db()->prepare(
        'DELETE FROM rate_limit WHERE created_at < (NOW() - INTERVAL 1 DAY)'
    );
    $prune->execute();

    $count = db()->prepare(
        'SELECT COUNT(*) FROM rate_limit
         WHERE bucket = ? AND ip = ? AND created_at > (NOW() - INTERVAL ? SECOND)'
    );
    $count->execute([$bucket, $ip, $windowSeconds]);

    if ((int) $count->fetchColumn() >= $limit) {
        return false;
    }

    $insert = db()->prepare('INSERT INTO rate_limit (bucket, ip) VALUES (?, ?)');
    $insert->execute([$bucket, $ip]);

    return true;
}

/* ------------------------------------------------- sessions and auth -- */

function start_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https';

    session_set_cookie_params([
        'lifetime' => 0,
        'path'     => '/',
        'secure'   => $https,   // cookie never travels over plain HTTP
        'httponly' => true,     // unreadable from JavaScript, so XSS can't steal it
        'samesite' => 'Strict', // not sent on cross-site requests → CSRF baseline
    ]);

    session_name('efn_admin');
    session_start();
}

function is_logged_in(): bool
{
    start_session();

    if (empty($_SESSION['admin'])) {
        return false;
    }

    // Idle timeout — an unattended open tab shouldn't stay authenticated.
    if (time() - ($_SESSION['seen'] ?? 0) > 7200) {
        logout();
        return false;
    }

    $_SESSION['seen'] = time();
    return true;
}

function require_login(): void
{
    if (!is_logged_in()) {
        header('Location: login.php');
        exit;
    }
}

function login(string $user, string $pass): bool
{
    global $CONFIG;

    $hash = (string) $CONFIG['admin_password_hash'];
    if ($hash === '') {
        return false;
    }

    // hash_equals for the username so the comparison time doesn't leak whether
    // the username was right. password_verify is already constant-time.
    $userOk = hash_equals((string) $CONFIG['admin_user'], $user);
    $passOk = password_verify($pass, $hash);

    if (!$userOk || !$passOk) {
        return false;
    }

    start_session();
    // Rotate the session ID on privilege change, otherwise an ID an attacker
    // planted before login stays valid afterwards (session fixation).
    session_regenerate_id(true);
    $_SESSION['admin'] = true;
    $_SESSION['seen']  = time();

    return true;
}

function logout(): void
{
    start_session();
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $p = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'], $p['secure'], $p['httponly']);
    }
    session_destroy();
}

/* ---------------------------------------------------------------- CSRF -- */

function csrf_token(): string
{
    start_session();
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf'];
}

function csrf_check(?string $token): void
{
    start_session();
    if (!$token || empty($_SESSION['csrf']) || !hash_equals($_SESSION['csrf'], $token)) {
        http_response_code(403);
        exit('Invalid request token.');
    }
}

/** Escape for HTML output. Every value from the DB goes through this. */
function e(?string $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}
