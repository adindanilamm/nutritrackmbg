<?php
// GET /api/foods.php  -> daftar semua makanan (format sesuai frontend)
require __DIR__ . '/db.php';

$pdo = db();
$rows = $pdo->query("SELECT id,name,category,calories,protein,fat,carbs,sodium,sugar,serving_size,image,tags FROM foods ORDER BY id")->fetchAll();

$out = array_map(function ($r) {
    return [
        'id'          => (int)$r['id'],
        'name'        => $r['name'],
        'category'    => $r['category'],
        'calories'    => (float)$r['calories'],
        'protein'     => (float)$r['protein'],
        'fat'         => (float)$r['fat'],
        'carbs'       => (float)$r['carbs'],
        'sodium'      => (float)$r['sodium'],
        'sugar'       => (float)$r['sugar'],
        'servingSize' => $r['serving_size'],
        'image'       => $r['image'],
        'tags'        => $r['tags'] ? json_decode($r['tags'], true) : [],
    ];
}, $rows);

send_json($out);
