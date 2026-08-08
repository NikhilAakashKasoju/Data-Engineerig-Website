<?php
declare(strict_types=1);

require __DIR__ . '/lib.php';
require_login();

/* ----------------------------------------------------------- actions -- */

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
    csrf_check($_POST['csrf'] ?? null);

    $id     = (int) ($_POST['id'] ?? 0);
    $action = (string) ($_POST['action'] ?? '');

    if ($id > 0) {
        if ($action === 'delete') {
            db()->prepare('DELETE FROM leads WHERE id = ?')->execute([$id]);
        } elseif (in_array($action, ['new', 'contacted', 'archived'], true)) {
            db()->prepare('UPDATE leads SET status = ? WHERE id = ?')->execute([$action, $id]);
        }
    }

    // Redirect after POST so a refresh doesn't repeat the action.
    header('Location: admin.php?' . http_build_query([
        'q'      => $_GET['q'] ?? '',
        'status' => $_GET['status'] ?? '',
        'page'   => $_GET['page'] ?? 1,
    ]));
    exit;
}

/* ------------------------------------------------------------ query -- */

$q       = trim((string) ($_GET['q'] ?? ''));
$status  = (string) ($_GET['status'] ?? '');
$page    = max(1, (int) ($_GET['page'] ?? 1));
$perPage = 25;

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

$countStmt = db()->prepare("SELECT COUNT(*) FROM leads $clause");
$countStmt->execute($params);
$total = (int) $countStmt->fetchColumn();

$pages  = max(1, (int) ceil($total / $perPage));
$page   = min($page, $pages);
$offset = ($page - 1) * $perPage;

// LIMIT/OFFSET are cast to int above, so interpolating them is safe — MySQL
// won't accept them as bound parameters in prepared statements.
$rowsStmt = db()->prepare(
    "SELECT * FROM leads $clause ORDER BY created_at DESC LIMIT $perPage OFFSET $offset"
);
$rowsStmt->execute($params);
$rows = $rowsStmt->fetchAll();

$stats = db()->query(
    "SELECT
       COUNT(*)                                          AS total,
       SUM(status = 'new')                               AS fresh,
       SUM(created_at > (NOW() - INTERVAL 7 DAY))        AS week,
       SUM(notified = 0)                                 AS unnotified
     FROM leads"
)->fetch();

$token = csrf_token();
?>
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Leads · EduFulness Masterclass</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body { margin: 0; background: #0d0714; color: #f4f4f6; padding: 28px 20px 64px;
         font: 15px/1.55 system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
  .wrap { max-width: 1180px; margin: 0 auto; }
  header { display: flex; flex-wrap: wrap; gap: 16px; align-items: center;
           justify-content: space-between; margin-bottom: 26px; }
  h1 { margin: 0; font-size: 21px; }
  a { color: #4b85ff; }
  .btn { display: inline-block; padding: 9px 16px; border-radius: 999px; font-size: 13.5px;
         font-weight: 600; text-decoration: none; color: #fff;
         background: linear-gradient(135deg, #0b4fdb, #2f74f0); border: 0; cursor: pointer; }
  .btn.ghost { background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.12); }
  .stats { display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
           margin-bottom: 22px; }
  .stat { padding: 16px 18px; border: 1px solid rgba(255,255,255,.08); border-radius: 12px;
          background: rgba(255,255,255,.02); }
  .stat b { display: block; font-size: 26px; line-height: 1; }
  .stat span { display: block; margin-top: 6px; font-size: 11px; letter-spacing: .08em;
               text-transform: uppercase; color: #8a8a96; }
  form.filters { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 18px; }
  input[type=search], select {
    padding: 10px 13px; font-size: 14px; color: #f4f4f6; background: rgba(255,255,255,.04);
    border: 1px solid rgba(255,255,255,.1); border-radius: 9px; }
  input[type=search] { flex: 1; min-width: 200px; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; }
  th, td { padding: 13px 12px; text-align: left; vertical-align: top;
           border-bottom: 1px solid rgba(255,255,255,.07); }
  th { font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: #8a8a96;
       font-weight: 500; }
  td.msg { max-width: 360px; color: #c3c3cd; white-space: pre-wrap; word-break: break-word; }
  .pill { display: inline-block; padding: 3px 9px; border-radius: 999px; font-size: 11px;
          letter-spacing: .06em; text-transform: uppercase; }
  .new { background: rgba(212,255,92,.12); color: #d4ff5c; }
  .contacted { background: rgba(94,234,212,.12); color: #5eead4; }
  .archived { background: rgba(255,255,255,.07); color: #8a8a96; }
  .warn { color: #ffb4b4; font-size: 11px; }
  .row-actions { display: flex; gap: 6px; flex-wrap: wrap; }
  .row-actions button { padding: 5px 10px; font-size: 11.5px; border-radius: 7px;
    background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.12);
    color: #f4f4f6; cursor: pointer; }
  .row-actions button.danger { color: #ffb4b4; border-color: rgba(220,60,60,.3); }
  .pager { display: flex; gap: 8px; align-items: center; margin-top: 22px; color: #8a8a96;
           font-size: 13.5px; }
  .empty { padding: 48px 0; text-align: center; color: #8a8a96; }
</style>
</head>
<body>
<div class="wrap">

  <header>
    <h1>Course enquiries</h1>
    <div style="display:flex;gap:10px;flex-wrap:wrap;">
      <a class="btn ghost" href="live-admin.php">Live class</a>
      <a class="btn ghost" href="export.php?<?= e(http_build_query(['q' => $q, 'status' => $status])) ?>">Export CSV</a>
      <a class="btn ghost" href="logout.php">Sign out</a>
    </div>
  </header>

  <div class="stats">
    <div class="stat"><b><?= (int) $stats['total'] ?></b><span>Total leads</span></div>
    <div class="stat"><b><?= (int) $stats['fresh'] ?></b><span>Not yet contacted</span></div>
    <div class="stat"><b><?= (int) $stats['week'] ?></b><span>Last 7 days</span></div>
    <div class="stat"><b><?= (int) $stats['unnotified'] ?></b><span>Ping failed</span></div>
  </div>

  <form class="filters" method="get">
    <input type="search" name="q" value="<?= e($q) ?>" placeholder="Search name, email or message…">
    <select name="status">
      <option value="">All statuses</option>
      <?php foreach (['new' => 'New', 'contacted' => 'Contacted', 'archived' => 'Archived'] as $k => $label): ?>
        <option value="<?= $k ?>" <?= $status === $k ? 'selected' : '' ?>><?= $label ?></option>
      <?php endforeach; ?>
    </select>
    <button class="btn" type="submit">Filter</button>
  </form>

  <?php if (!$rows): ?>
    <p class="empty">No leads yet.</p>
  <?php else: ?>
    <table>
      <thead>
        <tr>
          <th>Received</th><th>Name</th><th>Email</th><th>Message</th>
          <th>Source</th><th>Status</th><th></th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($rows as $r): ?>
          <tr>
            <td>
              <?= e(date('d M Y', strtotime((string) $r['created_at']))) ?><br>
              <span style="color:#8a8a96;font-size:12px;"><?= e(date('H:i', strtotime((string) $r['created_at']))) ?></span>
              <?php if (!(int) $r['notified']): ?><br><span class="warn">ping failed</span><?php endif; ?>
            </td>
            <td><?= e($r['name']) ?></td>
            <td><a href="mailto:<?= e($r['email']) ?>"><?= e($r['email']) ?></a></td>
            <td class="msg"><?= $r['message'] ? e($r['message']) : '<span style="color:#8a8a96">—</span>' ?></td>
            <td><?= e($r['source']) ?></td>
            <td><span class="pill <?= e($r['status']) ?>"><?= e($r['status']) ?></span></td>
            <td>
              <form method="post" class="row-actions">
                <input type="hidden" name="csrf" value="<?= e($token) ?>">
                <input type="hidden" name="id" value="<?= (int) $r['id'] ?>">
                <?php if ($r['status'] !== 'contacted'): ?>
                  <button name="action" value="contacted">Contacted</button>
                <?php endif; ?>
                <?php if ($r['status'] !== 'archived'): ?>
                  <button name="action" value="archived">Archive</button>
                <?php endif; ?>
                <button name="action" value="delete" class="danger"
                        onclick="return confirm('Delete this lead permanently?')">Delete</button>
              </form>
            </td>
          </tr>
        <?php endforeach; ?>
      </tbody>
    </table>

    <div class="pager">
      <?php if ($page > 1): ?>
        <a class="btn ghost" href="?<?= e(http_build_query(['q' => $q, 'status' => $status, 'page' => $page - 1])) ?>">Previous</a>
      <?php endif; ?>
      <span>Page <?= $page ?> of <?= $pages ?> · <?= $total ?> total</span>
      <?php if ($page < $pages): ?>
        <a class="btn ghost" href="?<?= e(http_build_query(['q' => $q, 'status' => $status, 'page' => $page + 1])) ?>">Next</a>
      <?php endif; ?>
    </div>
  <?php endif; ?>

</div>
</body>
</html>
