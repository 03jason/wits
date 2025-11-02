<?php
declare(strict_types=1);

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Exception\HttpInternalServerErrorException;

final class ProductController
{
    private \PDO $db;

    public function __construct()
    {
        $host = $_ENV['DB_HOST'] ?? 'db';
        $db   = $_ENV['DB_DATABASE'] ?? 'wits';
        $user = $_ENV['DB_USERNAME'] ?? 'root';
        $pass = $_ENV['DB_PASSWORD'] ?? 'root';
        $dsn  = "mysql:host={$host};dbname={$db};charset=utf8mb4";

        $this->db = new \PDO($dsn, $user, $pass, [
            \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
            \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
        ]);
    }

    public function index(Request $request, Response $response): Response
    {
        try {
            $stmt = $this->db->query("SELECT * FROM v_products_enriched ORDER BY product_id ASC");
            $products = $stmt->fetchAll();
            $response->getBody()->write(json_encode($products));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Throwable $e) {
            throw new HttpInternalServerErrorException($request, $e->getMessage());
        }
    }
}