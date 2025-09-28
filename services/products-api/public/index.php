<?php
declare(strict_types=1);

use DI\Container;
use Slim\Factory\AppFactory;
use Illuminate\Database\Capsule\Manager as Capsule;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Tuupola\Middleware\JwtAuthentication;
use Firebase\JWT\JWT;
use Respect\Validation\Validator as v;

require __DIR__ . '/../vendor/autoload.php';

// --- App & middlewares de base
$container = new Container();
AppFactory::setContainer($container);
$app = AppFactory::create();
$app->addBodyParsingMiddleware();
$app->addErrorMiddleware(true, true, true);

// --- CORS DEV (localhost:5173)
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
    'driver'   => $_ENV['DB_DRIVER']   ?? 'mysql',
    'host'     => $_ENV['DB_HOST']     ?? 'db',
    'port'     => (int)($_ENV['DB_PORT'] ?? 3306),
    'database' => $_ENV['DB_DATABASE'] ?? 'wits',
    'username' => $_ENV['DB_USERNAME'] ?? 'wits',
    'password' => $_ENV['DB_PASSWORD'] ?? 'wits',
    'charset'  => 'utf8mb4',
    'collation'=> 'utf8mb4_unicode_ci',
]);
$capsule->setAsGlobal(); $capsule->bootEloquent();

// --- Helper JSON
function json(Response $res, array $data, int $status=200): Response {
    $res->getBody()->write(json_encode($data, JSON_UNESCAPED_UNICODE));
    return $res->withHeader('Content-Type','application/json')->withStatus($status);
}

// --- JWT middleware (prêt, mais activable via feature-flag)
$jwtMiddleware = new JwtAuthentication([
    "secret" => $_ENV["JWT_SECRET"] ?? "dev",
    "algorithm" => ["HS256"],
    "attribute" => "token",
    "error" => function ($response) {
        $response->getBody()->write(json_encode(["error"=>"unauthorized"], JSON_UNESCAPED_UNICODE));
        return $response->withHeader("Content-Type","application/json")->withStatus(401);
    }
]);

// --- Feature-flag d’auth
$AUTH_ENABLED = (($_ENV['AUTH_ENABLED'] ?? '0') === '1');
$protect = fn($route) => $AUTH_ENABLED ? $route->add($jwtMiddleware) : $route;

// --- Routes
$app->get('/api/health', function(Request $r, Response $s) {
    return json($s, ['ok'=>true,'service'=>'products-api']);
});

$app->get('/api/products', [Wits\Controllers\ProductController::class, 'list']);
$app->get('/api/products/enriched', [Wits\Controllers\ProductController::class, 'listEnriched']);

// Login (génère un JWT)
$app->post('/api/login', function(Request $req, Response $res) {
    $b = (array)$req->getParsedBody();
    $email = (string)($b['email'] ?? '');
    $pass  = (string)($b['password'] ?? '');

    $adminEmail = $_ENV['ADMIN_EMAIL'] ?? '';
    $hash = $_ENV['ADMIN_PASSWORD_HASH'] ?? '';
    if ($email !== $adminEmail || !$hash || !password_verify($pass, $hash)) {
        return json($res, ['error'=>'invalid_credentials'], 401);
    }

    $now = time();
    $exp = $now + (int)(($_ENV['JWT_TTL_MIN'] ?? 30) * 60);
    $payload = [
        'iss'=> $_ENV['JWT_ISSUER'] ?? 'wits',
        'aud'=> $_ENV['JWT_AUDIENCE'] ?? 'wits',
        'iat'=> $now, 'nbf'=> $now, 'exp'=> $exp,
        'sub'=> $email, 'role'=> 'admin'
    ];
    $token = JWT::encode($payload, $_ENV['JWT_SECRET'] ?? 'dev', 'HS256');
    return json($res, ['token'=>$token, 'exp'=>$exp], 200);
});

// Écriture protégée (ou non, selon AUTH_ENABLED)
$protect($app->post('/api/products', [Wits\Controllers\ProductController::class, 'create']));

$protect($app->put('/api/products/{id}', [Wits\Controllers\ProductController::class, 'update']));
$protect($app->delete('/api/products/{id}', [Wits\Controllers\ProductController::class, 'delete']));


$app->get('/api/version', fn($q,$s)=>json($s,[
    'service'=>'products-api', // adapter
    'version'=>$_ENV['APP_VERSION'] ?? 'dev'
]));

$app->get('/api/version', fn($req,$res)=>json($res, [
    'service' => 'products-api',
    'version' => $_ENV['APP_VERSION'] ?? 'dev',
]));



$app->run();
