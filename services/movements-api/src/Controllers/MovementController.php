<?php
namespace App\Controllers;

use PDO;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

class MovementController
{
    private $db;

    public function __construct()
    {
        // Lecture du fichier .env
        $envPath = __DIR__ . '/../../.env';
        if (file_exists($envPath)) {
            $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                if (strpos(trim($line), '=') !== false) {
                    [$name, $value] = explode('=', trim($line), 2);
                    $_ENV[$name] = $value;
                }
            }
        }

        // Connexion PDO manuelle
        $host = $_ENV['DB_HOST'] ?? 'db';
        $port = $_ENV['DB_PORT'] ?? '3306';
        $dbname = $_ENV['DB_DATABASE'] ?? 'wits';
        $user = $_ENV['DB_USERNAME'] ?? 'root';
        $pass = $_ENV['DB_PASSWORD'] ?? 'root';

        try {
            $this->db = new PDO("mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4", $user, $pass);
            $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (\PDOException $e) {
            die("DB connection failed: " . $e->getMessage());
        }
    }

    // === Liste des mouvements enrichis ===
    public function index(Request $request, Response $response): Response
    {
        try {
            $query = $this->db->query("SELECT * FROM v_movements_enriched ORDER BY movement_id DESC");
            $rows = $query->fetchAll(PDO::FETCH_ASSOC);

            $response->getBody()->write(json_encode($rows));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Throwable $e) {
            $error = ['error' => 'Erreur lors de la récupération des mouvements', 'details' => $e->getMessage()];
            $response->getBody()->write(json_encode($error));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }
}
