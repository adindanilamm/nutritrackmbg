<?php
// GET /api/sppg.php  -> daftar lokasi SPPG
require __DIR__ . '/db.php';

$pdo = db();
$rows = $pdo->query("SELECT id,name,province,city,district,village,address,status FROM sppg ORDER BY id")->fetchAll();

$out = array_map(function ($r) {
    return [
        'id'       => (int)$r['id'],
        'name'     => $r['name'],
        'province' => $r['province'],
        'city'     => $r['city'],
        'district' => $r['district'],
        'village'  => $r['village'],
        'address'  => $r['address'],
        'status'   => $r['status'],
    ];
}, $rows);

send_json($out);
