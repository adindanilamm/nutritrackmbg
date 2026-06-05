<?php
/**
 * Koneksi database (PDO) — NutriTrack MBG
 *
 * Pengaturan default Laragon:
 *   host: 127.0.0.1   user: root   password: (kosong)   db: nutritrackmbg
 * Ubah di bawah ini jika konfigurasi MySQL kamu berbeda.
 */

$DB_HOST = '127.0.0.1';
$DB_PORT = '3306';
$DB_NAME = 'nutritrackmbg';
$DB_USER = 'root';
$DB_PASS = '';

// Header umum untuk semua endpoint API (mengembalikan JSON)
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Tangani preflight CORS (untuk POST)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function db() {
    global $DB_HOST, $DB_PORT, $DB_NAME, $DB_USER, $DB_PASS;
    $dsn = "mysql:host=$DB_HOST;port=$DB_PORT;dbname=$DB_NAME;charset=utf8mb4";
    try {
        $pdo = new PDO($dsn, $DB_USER, $DB_PASS, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
        return $pdo;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'error'   => 'Gagal terhubung ke database.',
            'detail'  => $e->getMessage(),
            'hint'    => 'Pastikan MySQL Laragon menyala & database "nutritrackmbg" sudah diimpor.'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
}

/** Kirim data sebagai JSON lalu berhenti. */
function send_json($data) {
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
