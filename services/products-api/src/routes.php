<?php
declare(strict_types=1);

use Slim\App;
use App\Controllers\ProductController;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use PDO;

return static function (App $app): void {

    // Vérification de santé
    $app->get('/health', function (Request $req, Response $res) {
        $res->getBody()->write(json_encode(['status' => 'ok']));
        return $res->withHeader('Content-Type', 'application/json');
    });

    // Liste des produits
    $app->get('/products', [ProductController::class, 'index']);

    // ✅ Mise à jour d’un produit avec historisation (type DATA)
    $app->patch('/products/{id}', function (Request $request, Response $response, array $args) use ($app) {
        $id = (int)$args['id'];
        $userId = 1; // TODO : à remplacer par l’utilisateur authentifié
        $data = $request->getParsedBody();

        /** @var PDO $db */
        $db = $app->getContainer()->get('db');

        // 1️⃣ Récupération du produit avant modification
        $stmt = $db->prepare("SELECT * FROM products WHERE product_id = ?");
        $stmt->execute([$id]);
        $before = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$before) {
            $response->getBody()->write(json_encode(['error' => 'Produit introuvable']));
            return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
        }

        // 2️⃣ Déterminer les champs modifiés
        $metaBefore = [];
        $metaAfter = [];
        foreach ($data as $key => $value) {
            if (array_key_exists($key, $before) && $before[$key] != $value) {
                $metaBefore[$key] = $before[$key];
                $metaAfter[$key]  = $value;
            }
        }

        if (empty($metaBefore)) {
            $response->getBody()->write(json_encode(['message' => 'Aucun changement détecté']));
            return $response->withHeader('Content-Type', 'application/json');
        }

        // 3️⃣ Mise à jour du produit
        $setClause = implode(', ', array_map(fn($k) => "$k = :$k", array_keys($data)));
        $updateStmt = $db->prepare("UPDATE products SET $setClause WHERE product_id = :id");
        $updateStmt->execute(array_merge($data, ['id' => $id]));

        // 4️⃣ Enregistrement du mouvement DATA
        $insertMovement = $db->prepare("
            INSERT INTO movements (product_id, type_code, user_id, note, meta_before, meta_after)
            VALUES (:product_id, 'DATA', :user_id, :note, :meta_before, :meta_after)
        ");
        $insertMovement->execute([
            'product_id'  => $id,
            'user_id'     => $userId,
            'note'        => 'Modification des données produit',
            'meta_before' => json_encode($metaBefore, JSON_UNESCAPED_UNICODE),
            'meta_after'  => json_encode($metaAfter, JSON_UNESCAPED_UNICODE),
        ]);

        // 5️⃣ Réponse
        $payload = [
            'message' => 'Produit modifié avec succès',
            'changes' => [
                'before' => $metaBefore,
                'after'  => $metaAfter
            ]
        ];
        $response->getBody()->write(json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
        return $response->withHeader('Content-Type', 'application/json');
    });
};
