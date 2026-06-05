<?php
// GET /api/akg.php  -> tabel Angka Kecukupan Gizi (AKG)
require __DIR__ . '/db.php';

$pdo = db();
$rows = $pdo->query("SELECT id,group_name,gender,age_range,calories,protein,fat,carbohydrate,fiber FROM akg ORDER BY id")->fetchAll();

$out = array_map(function ($r) {
    return [
        'id'           => (int)$r['id'],
        'group'        => $r['group_name'],
        'gender'       => $r['gender'],
        'ageRange'     => $r['age_range'],
        'calories'     => (int)$r['calories'],
        'protein'      => (int)$r['protein'],
        'fat'          => (int)$r['fat'],
        'carbohydrate' => (int)$r['carbohydrate'],
        'fiber'        => (int)$r['fiber'],
    ];
}, $rows);

send_json($out);
