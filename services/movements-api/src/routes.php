<?php
declare(strict_types=1);

use Slim\App;
use App\Controllers\MovementController;

return static function (App $app): void {
    // ping rapide
    $app->get('/health', function ($req, $res) {
        $res->getBody()->write(json_encode(['status' => 'ok']));
        return $res->withHeader('Content-Type', 'application/json');
    });

    // vrai endpoint
    $app->get('/api/movements', [MovementController::class, 'index']);
};
