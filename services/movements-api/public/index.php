<?php
declare(strict_types=1);

use Slim\Factory\AppFactory;
use Illuminate\Database\Capsule\Manager as Capsule;

require __DIR__ . '/../vendor/autoload.php';

/**
 * Mini chargeur .env (zéro dépendance) — charge seulement si les variables
 * ne sont pas déjà présentes dans l'environnement du conteneur.
 */
$envFile = __DIR__ . '/../.env';
if (is_readable($envFile)) {
    foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#' || !str_contains($line, '=')) continue;
        [$k, $v] = explode('=', $line, 2);
        $k = trim($k); $v = trim($v);
        if (getenv($k) === false) {
            putenv("$k=$v");
            $_ENV[$k] = $_SERVER[$k] = $v;
        }
    }
}

/** Boot Eloquent */
$capsule = new Capsule();
$capsule->addConnection([
    'driver'    => getenv('DB_DRIVER')   ?: 'mysql',
    'host'      => getenv('DB_HOST')     ?: 'db',
    'database'  => getenv('DB_DATABASE') ?: 'wits',
    'username'  => getenv('DB_USERNAME') ?: 'root',
    'password'  => getenv('DB_PASSWORD') ?: 'root',
    'charset'   => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
    'prefix'    => '',
]);
$capsule->setAsGlobal();
$capsule->bootEloquent();

$app = AppFactory::create();

/** Erreurs + traces en dev */
$app->addErrorMiddleware(true, true, true);

/** CORS minimal pour Vite/localhost */
$app->add(function ($request, $handler) {
    $response = $handler->handle($request);
    $origin = $request->getHeaderLine('Origin') ?: '*';
    $response = $response
        ->withHeader('Access-Control-Allow-Origin', $origin)
        ->withHeader('Vary', 'Origin')
        ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        ->withHeader('Access-Control-Allow-Credentials', 'true');

    if ($request->getMethod() === 'OPTIONS') {
        return $response->withStatus(204);
    }
    return $response;
});

/** Healthcheck */
$app->get('/health', function ($req, $res) {
    $res->getBody()->write(json_encode(['status' => 'ok']));
    return $res->withHeader('Content-Type', 'application/json');
});

/** Routes applicatives */
(require __DIR__ . '/../src/routes.php')($app);

$app->run();
