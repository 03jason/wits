<?php
declare(strict_types=1);

use Slim\App;
use App\Controllers\MovementController;

return function (App $app): void {
    $app->get('/api/movements', [MovementController::class, 'index']);
};
