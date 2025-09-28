<?php
return [
    'paths' => [
        'migrations' => __DIR__ . '/migrations',
        'seeds'      => __DIR__ . '/seeds',
    ],
    'environments' => [
        'default_environment' => 'dev',
        'dev' => [
            'adapter' => getenv('DB_DRIVER') ?: 'mysql',
            'host' => getenv('DB_HOST') ?: 'db',
            'name' => getenv('DB_DATABASE') ?: 'wits',
            'user' => getenv('DB_USERNAME') ?: 'wits',
            'pass' => getenv('DB_PASSWORD') ?: 'wits',
            'port' => (int)(getenv('DB_PORT') ?: 3306),
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
        ],
    ],
    'version_order' => 'creation'
];
