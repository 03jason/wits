<?php
namespace Wits\Controllers;

use Wits\Models\Product;
use Wits\Models\ProductEnriched;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Illuminate\Database\Capsule\Manager as DB;
use Respect\Validation\Validator as v;


final class ProductController
{
    /** GET /api/products?page=&size=&q= */
    public function list(Request $req, Response $res): Response
    {


        $p = $req->getQueryParams();
        $page = max(1, (int)($p['page'] ?? 1));
        $size = max(1, min(100, (int)($p['size'] ?? 10)));
        $q    = trim((string)($p['q'] ?? ''));

        $query = Product::query();
        $query = Product::query()->where('product_active', true);

        if ($q !== '') {
            $query->where(function ($w) use ($q) {
                $w->where('product_name', 'LIKE', "%$q%")
                    ->orWhere('product_sku', 'LIKE', "%$q%");
            });
        }

        $total = (clone $query)->count();
        $items = $query->orderByDesc('product_id')
            ->offset(($page - 1) * $size)
            ->limit($size)
            ->get();

        $payload = ['page' => $page, 'size' => $size, 'total' => $total, 'items' => $items];
        $res->getBody()->write(json_encode($payload, JSON_UNESCAPED_UNICODE));
        return $res->withHeader('Content-Type', 'application/json');
    }

    /** GET /api/products/enriched?page=&size=&q=  (vue SQL: stock + badge seuil) */
    public function listEnriched(Request $req, Response $res): Response
    {
        $p = $req->getQueryParams();
        $page = max(1, (int)($p['page'] ?? 1));
        $size = max(1, min(100, (int)($p['size'] ?? 10)));
        $q    = trim((string)($p['q'] ?? ''));

        $query = ProductEnriched::query();
        if ($q !== '') {
            $query->where(function ($w) use ($q) {
                $w->where('product_name', 'LIKE', "%$q%")
                    ->orWhere('product_sku', 'LIKE', "%$q%");
            });
        }

        $total = (clone $query)->count();
        $items = $query->orderByDesc('product_id')
            ->offset(($page - 1) * $size)
            ->limit($size)
            ->get();

        $payload = ['page'=>$page,'size'=>$size,'total'=>$total,'items'=>$items];
        $res->getBody()->write(json_encode($payload, JSON_UNESCAPED_UNICODE));
        return $res->withHeader('Content-Type','application/json');
    }

    /** POST /api/products { name, sku?, brand?, price?, category?, location?, min_threshold?, description?, initial_qty? } */

    public function create(Request $req, Response $res): Response
    {
        $b = (array)($req->getParsedBody() ?? []);

        // --- validation simple & explicite ---
        $name = trim((string)($b['name'] ?? ''));
        if ($name === '') {
            return json($res, ['error' => 'validation_failed', 'details' => ['name required']], 422);
        }
        $sku = isset($b['sku']) ? strtoupper(trim((string)$b['sku'])) : null;
        if ($sku !== null && !preg_match('/^[A-Z0-9-]{1,64}$/', $sku)) {
            return json($res, ['error' => 'validation_failed', 'details' => ['sku invalid']], 422);
        }

        $initialQty   = isset($b['initial_qty'])   ? max(0, (int)$b['initial_qty'])   : 0;
        $minThreshold = isset($b['min_threshold']) ? (int)$b['min_threshold']          : null;
        $price        = isset($b['price'])         ? (float)$b['price']                : null;

        $data = [
            'product_sku'           => $sku,
            'product_name'          => $name,
            'product_brand'         => $b['brand']        ?? null,
            'product_price'         => $price,
            'product_category'      => $b['category']     ?? null,
            'product_description'   => $b['description']  ?? null,
            'product_location'      => $b['location']     ?? null,
            'product_min_threshold' => $minThreshold,
            'product_active'        => true,
        ];

        try {
            $created = DB::transaction(function () use ($data, $initialQty) {
                $p = Product::create($data);
                if ($initialQty > 0) {
                    DB::table('movements')->insert([
                        'product_id'        => $p->product_id,
                        'movement_type'     => 'IN',
                        'movement_quantity' => $initialQty,
                        'movement_note'     => 'Initial stock',
                    ]);
                }
                return $p->fresh();
            });

            if ($sku && \Wits\Models\Product::where('product_sku', $sku)->exists()) {
                return json($res, ['error'=>'sku_exists','details'=>"SKU '{$sku}' déjà utilisé"], 409);
            }


            return json($res, $created, 201);

        } catch (\Throwable $e) {
            return json($res, ['error' => 'server_error', 'details' => $e->getMessage()], 500);
        }
    }




    /** PUT /api/products/{id} : mise à jour partielle des champs principaux */
    public function update(Request $req, Response $res, array $args): Response
    {
        $id = (int)($args['id'] ?? 0);
        $b  = (array)$req->getParsedBody();

        // Validation minimale (patch)
        $rules = [
            'name'          => fn($v) => is_null($v) || (is_string($v) && mb_strlen($v) >= 2),
            'sku'           => fn($v) => is_null($v) || (is_string($v) && mb_strlen($v) >= 1 && mb_strlen($v) <= 64),
            'price'         => fn($v) => is_null($v) || is_numeric($v) && $v >= 0,
            'category'      => fn($v) => is_null($v) || (is_string($v) && mb_strlen($v) <= 64),
            'location'      => fn($v) => is_null($v) || (is_string($v) && mb_strlen($v) <= 64),
            'min_threshold' => fn($v) => is_null($v) || (is_numeric($v) && (int)$v >= 0),
            'description'   => fn($v) => is_null($v) || is_string($v),
            'brand'         => fn($v) => is_null($v) || is_string($v),
            'active'        => fn($v) => is_null($v) || in_array((int)$v, [0,1], true),
        ];
        foreach ($rules as $k => $rule) {
            if (array_key_exists($k, $b) && !$rule($b[$k])) {
                return json($res, ['error'=>'validation_failed','details'=>"invalid_$k"], 422);
            }
        }

        $p = \Wits\Models\Product::find($id);
        if (!$p) return json($res, ['error'=>'not_found'], 404);

        $p->fill([
            'product_name'         => $b['name']          ?? $p->product_name,
            'product_sku'          => $b['sku']           ?? $p->product_sku,
            'product_price'        => isset($b['price']) ? (float)$b['price'] : $p->product_price,
            'product_category'     => $b['category']      ?? $p->product_category,
            'product_location'     => $b['location']      ?? $p->product_location,
            'product_min_threshold'=> isset($b['min_threshold']) ? (int)$b['min_threshold'] : $p->product_min_threshold,
            'product_description'  => $b['description']   ?? $p->product_description,
            'product_brand'        => $b['brand']         ?? $p->product_brand,
            'product_active'       => isset($b['active']) ? (bool)$b['active'] : $p->product_active,
        ])->save();

        //return json($res, $p->fresh(), 200);
        return json($res, $p->toArray(), 200);

    }

    /** DELETE /api/products/{id} : soft delete (active=0) + refuse si stock > 0 */
    public function delete(Request $req, Response $res, array $args): Response
    {
        $id = (int)($args['id'] ?? 0);
        $p = \Wits\Models\Product::find($id);
        if (!$p) return json($res, ['error'=>'not_found'], 404);

        // Refus si stock courant > 0 (sécurité métier)
        $row = \Illuminate\Support\Facades\DB::table('v_product_stock')->where('product_id', $id)->first();
        $stock = (int)($row->current_stock ?? 0);
        if ($stock > 0) {
            return json($res, ['error'=>'cannot_delete_non_empty','stock'=>$stock], 409);
        }

        $p->product_active = 0;
        $p->save();

        return $res->withStatus(204);
    }




/** Réponse JSON robuste pour arrays, modèles Eloquent, collections, etc. */
function json(Response $res, $data, int $status = 200): Response
{
    if ($data instanceof Arrayable) {
        $data = $data->toArray();
    } elseif ($data instanceof Jsonable) {
        $res->getBody()->write($data->toJson(JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES));
        return $res->withHeader('Content-Type', 'application/json')->withStatus($status);
    } elseif ($data instanceof \JsonSerializable) {
        $data = $data->jsonSerialize();
    } elseif (is_object($data)) {
        // fallback simple
        $data = (array) $data;
    }

    $res->getBody()->write(json_encode($data, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES));
    return $res->withHeader('Content-Type', 'application/json')->withStatus($status);
}







}
