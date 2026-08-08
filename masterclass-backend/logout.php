<?php
declare(strict_types=1);

require __DIR__ . '/lib.php';

logout();

header('Location: login.php');
exit;
