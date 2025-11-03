<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Models\MovementEnriched;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class MovementController
{
    // AUCUN constructeur ici (pas de PDO, Eloquent est déjà booté dans public/index.php)

    /** GET /api/movements */
    public function index(Request $req, Response $res): Response
    {
        try {
            $items = MovementEnriched::orderByDesc('created_at')->get();
            $res->getBody()->write($items->toJson(JSON_UNESCAPED_UNICODE));
            return $res->withHeader('Content-Type', 'application/json')->withStatus(200);
        } catch (\Throwable $e) {
            $res->getBody()->write(json_encode([
                'error'   => 'Erreur lors de la récupération des mouvements',
                'details' => $e->getMessage(),
            ], JSON_UNESCAPED_UNICODE));
            return $res->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }
}
