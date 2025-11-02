<?php
declare(strict_types=1);

use DI\Container;
use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';

// charge .env s'il existe
if (file_exists(__DIR__ . '/../.env')) {
    (Dotenv\Dotenv::createImmutable(__DIR__ . '/..'))->load();
}

$container = new Container();

/**
 * Enregistre le PDO dans le container.
 * C'EST ÇA QUI MANQUAIT : sans ça, $this->db est null dans le controller.
 */
$container->set(PDO::class, function () {
    $host = $_ENV['DB_HOST'] ?? 'db';
    $port = (int)($_ENV['DB_PORT'] ?? 3306);
    $db   = $_ENV['DB_DATABASE'] ?? 'wits';
    $user = $_ENV['DB_USERNAME'] ?? 'root';
    $pass = $_ENV['DB_PASSWORD'] ?? 'root';

    $dsn = "mysql:host={$host};port={$port};dbname={$db};charset=utf8mb4";

    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    return $pdo;
});

AppFactory::setContainer($container);
$app = AppFactory::create();

// middleware de base
$app->addBodyParsingMiddleware();
$app->addRoutingMiddleware();
$app->addErrorMiddleware(true, true, true);

// charge les routes
$routes = require __DIR__ . '/../src/routes.php';
$routes($app);

$app->run();
