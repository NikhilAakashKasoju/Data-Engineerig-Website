<?php
declare(strict_types=1);

require __DIR__ . '/lib.php';
require_login();

$q      = trim((string) ($_GET['q'] ?? ''));
$status = (string) ($_GET['status'] ?? '');

$where  = [];
$params = [];

if ($q !== '') {
    $where[] = '(name LIKE ? OR email LIKE ? OR message LIKE ?)';
    $like    = '%' . $q . '%';
    array_push($params, $like, $like, $like);
}

if (in_array($status, ['new', 'contacted', 'archived'], true)) {
    $where[]  = 'status = ?';
    $params[] = $status;
}

$clause = $where ? ('WHERE ' . implode(' AND ', $where)) : '';

$stmt = db()->prepare("SELECT created_at, name, email, message, source, status FROM leads $clause ORDER BY created_at DESC");
$stmt->execute($params);

header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="leads-' . date('Y-m-d') . '.csv"');

$out = fopen('php://output', 'w');

// BOM so Excel opens UTF-8 correctly instead of mangling accented characters.
fwrite($out, "\xEF\xBB\xBF");

fputcsv($out, ['Received', 'Name', 'Email', 'Message', 'Source', 'Status']);

while ($row = $stmt->fetch()) {
    /**
     * Spreadsheet formula injection: a value beginning = + - or @ is executed
     * as a formula when the CSV is opened. Prefixing a tab neutralises it
     * without visibly changing the text.
     */
    $safe = array_map(static function ($value): string {
        $value = (string) $value;
        return preg_match('/^[=+\-@]/', $value) ? "\t" . $value : $value;
    }, array_values($row));

    fputcsv($out, $safe);
}

fclose($out);
