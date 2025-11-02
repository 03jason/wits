<?php
declare(strict_types=1);

use Phinx\Seed\AbstractSeed;

final class AllSeedLoader extends AbstractSeed
{
    public function run(): void
    {
        $seedFiles = [
            'categories.sql',
            'locations.sql',
            'movement_types.sql',
            'movements.sql',
            'products.sql',
            'users.sql',
        ];

        foreach ($seedFiles as $file) {
            $path = __DIR__ . '/' . $file;
            if (file_exists($path)) {
                echo "Importing seed file: {$file}\n";
                $sql = file_get_contents($path);
                $this->execute($sql);
            } else {
                echo "⚠️ Missing seed file: {$file}\n";
            }
        }
    }
}
