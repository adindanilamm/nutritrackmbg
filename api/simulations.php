<?php
// /api/simulations.php
//   GET  -> daftar simulasi tersimpan
//   POST -> simpan simulasi baru (body JSON: {name, items, total_calories, total_protein})
require __DIR__ . '/db.php';

$pdo = db();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $rows = $pdo->query("SELECT id,name,items,total_calories,total_protein,created_at FROM simulations ORDER BY id DESC")->fetchAll();
    $out = array_map(function ($r) {
        return [
            'id'             => (int)$r['id'],
            'name'           => $r['name'],
            'items'          => json_decode($r['items'], true),
            'total_calories' => (float)$r['total_calories'],
            'total_protein'  => (float)$r['total_protein'],
            'created_at'     => $r['created_at'],
        ];
    }, $rows);
    send_json($out);
}

if ($method === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true);
    if (!$body || empty($body['items'])) {
        http_response_code(400);
        send_json(['error' => 'Data simulasi kosong / tidak valid.']);
    }
    $stmt = $pdo->prepare(
        "INSERT INTO simulations (name, items, total_calories, total_protein)
         VALUES (:name, :items, :cal, :pro)"
    );
    $stmt->execute([
        ':name'  => $body['name'] ?? 'Menu Simulasi',
        ':items' => json_encode($body['items'], JSON_UNESCAPED_UNICODE),
        ':cal'   => $body['total_calories'] ?? 0,
        ':pro'   => $body['total_protein'] ?? 0,
    ]);
    send_json(['ok' => true, 'id' => (int)$pdo->lastInsertId()]);
}

http_response_code(405);
send_json(['error' => 'Metode tidak didukung.']);
