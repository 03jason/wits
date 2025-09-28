<?php
declare(strict_types=1);

use DI\Container;
use Slim\Factory\AppFactory;
use Illuminate\Database\Capsule\Manager as Capsule;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Tuupola\Middleware\JwtAuthentication;

require __DIR__ . '/../vendor/autoload.php';

// --- App
$container = new Container();
AppFactory::setContainer($container);
$app = AppFactory::create();
$app->addBodyParsingMiddleware();
$app->addErrorMiddleware(true, true, true);

// --- CORS DEV
$app->options('/{routes:.+}', function ($req, $res) {
    return $res
        ->withHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
        ->withHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
        ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        ->withHeader('Access-Control-Allow-Credentials', 'true');
});
$app->add(function ($req, $handler) {
    $res = $handler->handle($req);
    return $res
        ->withHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
        ->withHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
        ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        ->withHeader('Access-Control-Allow-Credentials', 'true');
});

// --- Env + Eloquent
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../'); $dotenv->safeLoad();
$capsule = new Capsule();
$capsule->addConnection([
    'driver'=>$_ENV['DB_DRIVER']??'mysql','host'=>$_ENV['DB_HOST']??'db',
    'port'=>(int)($_ENV['DB_PORT']??3306),'database'=>$_ENV['DB_DATABASE']??'wits',
    'username'=>$_ENV['DB_USERNAME']??'wits','password'=>$_ENV['DB_PASSWORD']??'wits',
    'charset'=>'utf8mb4','collation'=>'utf8mb4_unicode_ci',
]); $capsule->setAsGlobal(); $capsule->bootEloquent();

// --- Helper JSON
function j(Response $r, array $p, int $s=200): Response {
    $r->getBody()->write(json_encode($p, JSON_UNESCAPED_UNICODE));
    return $r->withHeader('Content-Type','application/json')->withStatus($s);
}

// --- JWT prêt (feature-flag)
$jwtMiddleware = new JwtAuthentication([
    "secret" => $_ENV["JWT_SECRET"] ?? "dev",
    "algorithm" => ["HS256"],
    "attribute" => "token",
    "error" => function ($response) {
        $response->getBody()->write(json_encode(["error"=>"unauthorized"], JSON_UNESCAPED_UNICODE));
        return $response->withHeader("Content-Type","application/json")->withStatus(401);
    }
]);
$AUTH_ENABLED = (($_ENV['AUTH_ENABLED'] ?? '0') === '1');
$protect = fn($route) => $AUTH_ENABLED ? $route->add($jwtMiddleware) : $route;

// --- Routes
$app->get('/api/health', fn(Request $q, Response $r) => j($r, ['ok'=>true,'service'=>'movements-api']));
$app->get('/api/movements', [Wits\Controllers\MovementController::class, 'list']);
$protect($app->post('/api/movements', [Wits\Controllers\MovementController::class, 'create']));

$app->get('/api/version', fn($q,$s)=>json($s,[
    'service'=>'products-api', // adapter
    'version'=>$_ENV['APP_VERSION'] ?? 'dev'
]));

$app->get('/api/version', fn($req,$res)=>json($res, [
    'service' => 'movements-api',
    'version' => $_ENV['APP_VERSION'] ?? 'dev',
]));


$app->run();
