<?php
declare(strict_types=1);

use Phinx\Migration\AbstractMigration;

final class CreateProductsTable extends AbstractMigration
{
    public function change(): void
    {
        $table = $this->table('products', ['id' => 'product_id']);
        $table
            ->addColumn('product_sku', 'string', ['limit' => 64])
            ->addColumn('product_name', 'string', ['limit' => 200])
            ->addColumn('product_brand', 'string', ['limit' => 120, 'null' => true])
            ->addColumn('product_price', 'decimal', ['precision' => 10, 'scale' => 2, 'default' => 0.00])
            ->addColumn('category_id', 'string', ['limit' => 5, 'null' => true])
            ->addColumn('product_description', 'text', ['null' => true])
            ->addColumn('location_id', 'integer', ['null' => true])
            ->addColumn('product_min_threshold', 'integer', ['default' => 0])
            ->addColumn('product_active', 'boolean', ['default' => 1])
            ->create();
    }
}
