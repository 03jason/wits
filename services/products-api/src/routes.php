<?php
declare(strict_types=1);

use Slim\App;
use App\Controllers\ProductController;

return static function (App $app): void {
    $app->get('/health', function ($req, $res) {
        $res->getBody()->write(json_encode(['status' => 'ok']));
        return $res->withHeader('Content-Type', 'application/json');
    });
    $app->get('/products', [ProductController::class, 'index']);
};
