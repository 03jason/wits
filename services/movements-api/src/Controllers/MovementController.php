<?php
// I/O HTTP : liste + création mouvement (IN/OUT)
namespace Wits\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Illuminate\Database\Capsule\Manager as DB;
use Wits\Services\MovementService;
use Respect\Validation\Validator as v;


final class MovementController
{
    /** GET /api/movements?product_id=&limit=50 */
    public function list(Request $req, Response $res): Response
    {
        $p = $req->getQueryParams();
        $productId = isset($p['product_id']) ? (int)$p['product_id'] : null;
        $limit = max(1, min(200, (int)($p['limit'] ?? 50)));

        $q = DB::table('movements')->orderByDesc('movement_id')->limit($limit);
        if ($productId) $q->where('product_id', $productId);
        $items = $q->get();

        $res->getBody()->write(json_encode(['items'=>$items], JSON_UNESCAPED_UNICODE));
        return $res->withHeader('Content-Type','application/json');
    }

    /** POST /api/movements { product_id, type, quantity, note? } */
    public function create(Request $req, Response $res): Response
    {
        $b = (array)$req->getParsedBody();

        // Normalisation I/O (tolérante aux strings)
        $payload = [
            'product_id' => isset($b['product_id']) ? (int)$b['product_id'] : 0,
            'type'       => strtoupper(trim((string)($b['type'] ?? ''))),
            'quantity'   => isset($b['quantity']) ? (int)$b['quantity'] : 0,
            'note'       => isset($b['note']) ? (string)$b['note'] : null,
        ];

        // Validation tolérante (intVal accepte "1" et 1)
        $schema = \Respect\Validation\Validator::key('product_id', \Respect\Validation\Validator::intVal()->min(1))
            ->key('type', \Respect\Validation\Validator::in(['IN','OUT']))
            ->key('quantity', \Respect\Validation\Validator::intVal()->min(1))
            ->key('note', \Respect\Validation\Validator::optional(\Respect\Validation\Validator::stringType()->length(0,255)));

        try { $schema->assert($payload); }
        catch (\Throwable $e) { return j($res, ['error'=>'validation_failed','details'=>$e->getMessage()], 422); }

        try {
            $svc = new \Wits\Services\MovementService();
            $result = $svc->record($payload['type'], $payload['product_id'], $payload['quantity'], $payload['note']);
            $res->getBody()->write(json_encode($result, JSON_UNESCAPED_UNICODE));
            return $res->withHeader('Content-Type','application/json')->withStatus(201);
        } catch (\DomainException $e) {
            $res->getBody()->write(json_encode(['error'=>$e->getMessage()], JSON_UNESCAPED_UNICODE));
            return $res->withHeader('Content-Type','application/json')->withStatus(400);
        } catch (\Throwable $e) {
            $res->getBody()->write(json_encode(['error'=>'create_failed','message'=>$e->getMessage()], JSON_UNESCAPED_UNICODE));
            return $res->withHeader('Content-Type','application/json')->withStatus(500);
        }
    }
}
