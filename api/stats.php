<?php
// GET /api/stats.php  -> objek statistik untuk Dashboard & Statistik
require __DIR__ . '/db.php';

$pdo = db();
$row = $pdo->query("SELECT data FROM stats ORDER BY id LIMIT 1")->fetch();

if (!$row) { send_json(new stdClass()); }
echo $row['data']; // sudah berupa JSON valid di kolom
