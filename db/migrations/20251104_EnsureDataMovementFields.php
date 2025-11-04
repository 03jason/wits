<?php
declare(strict_types=1);

use Phinx\Migration\AbstractMigration;

final class EnsureDataMovementFields extends AbstractMigration
{
    public function change(): void
    {
        if (!$this->hasTable('movements')) {
            throw new \RuntimeException('Table "movements" manquante.');
        }

        $table = $this->table('movements');

        if (!$table->hasColumn('meta_before')) {
            $table->addColumn('meta_before', 'json', ['null' => true, 'after' => 'resulting_stock']);
        }
        if (!$table->hasColumn('meta_after')) {
            $table->addColumn('meta_after', 'json', ['null' => true, 'after' => 'meta_before']);
        }

        $table->update();
    }
}
