<?php
declare(strict_types=1);

use Phinx\Seed\AbstractSeed;

/**
 * Seeder démo idempotent.
 * - Insère 3 produits si absents (clé = SKU)
 * - Ajoute un IN initial si aucun mouvement pour ces produits
 */
final class DemoSeeder extends AbstractSeed
{
    public function run(): void
    {
        $pdo = $this->getAdapter()->getConnection();

        $products = [
            ['product_sku'=>'SKU-COOKIE','product_name'=>'Hazelnut cookie','product_min_threshold'=>5,'product_price'=>1.99,'product_active'=>1],
            ['product_sku'=>'SKU-SOCK','product_name'=>'Socks','product_min_threshold'=>3,'product_price'=>4.99,'product_active'=>1],
            ['product_sku'=>'SKU-CHAIR','product_name'=>'Chair','product_min_threshold'=>1,'product_price'=>39.90,'product_active'=>1],
        ];

        // Insert si absent (par SKU)
        foreach ($products as $p) {
            $sku = $p['product_sku'];
            $skuQ = $pdo->quote($sku); // IMPORTANT: quoter, pas de '?'

            $exists = $this->fetchRow("SELECT product_id FROM products WHERE product_sku = {$skuQ}");
            if (!$exists) {
                // insert via Table (ok ici car première insertion)
                $this->table('products')->insert($p)->saveData();
            } else {
                // option: sync champs de démo (facultatif)
                $pid = (int)$exists['product_id'];
                $nameQ = $pdo->quote($p['product_name']);
                $price = $p['product_price'];
                $minT  = (int)$p['product_min_threshold'];
                $this->execute("UPDATE products
                                SET product_name={$nameQ}, product_price={$price}, product_min_threshold={$minT}, product_active=1
                                WHERE product_id={$pid}");
            }
        }

        // IN initial si aucun mouvement pour ces produits
        $ids = $this->fetchAll("SELECT product_id, product_sku FROM products WHERE product_sku IN ('SKU-COOKIE','SKU-SOCK','SKU-CHAIR')");
        foreach ($ids as $row) {
            // fetchAll renvoie des clés numériques et/ou associatives selon PDO::ATTR_CASE; on gère les deux
            $pid = (int)($row['product_id'] ?? $row[0]);
            $hasMov = $this->fetchRow("SELECT 1 FROM movements WHERE product_id = {$pid} LIMIT 1");
            if (!$hasMov) {
                $this->table('movements')->insert([
                    ['product_id'=>$pid,'movement_type'=>'IN','movement_quantity'=>12,'movement_note'=>'seed']
                ])->saveData();
            }
        }
    }
}
