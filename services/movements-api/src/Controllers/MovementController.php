<?php
declare(strict_types=1);

namespace App\Controllers;

use PDO;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class MovementController
{
    private PDO $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    /**
     * GET /api/movements
     * Retourne les mouvements déjà enrichis par la vue SQL.
     */
    public function index(Request $request, Response $response): Response
    {
        // si la vue existe comme tu l’as créée :
        // CREATE OR REPLACE VIEW v_movements_enriched AS ...
        $sql = <<<SQL
SELECT
    movement_id,
    product_name,
    quantity,
    user_name,
    created_at,
    note,
    type_code
FROM v_movements_enriched
ORDER BY created_at DESC
SQL;

        $stmt = $this->db->query($sql);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $response->getBody()->write(json_encode($rows, JSON_UNESCAPED_UNICODE));
        return $response->withHeader('Content-Type', 'application/json');
    }
}
