<?php
declare(strict_types=1);

use Phinx\Migration\AbstractMigration;

final class InitSchema extends AbstractMigration
{
    public function up(): void
    {
        // Tables (IF NOT EXISTS pour tolérer la base actuelle)
        $this->execute("
          CREATE TABLE IF NOT EXISTS products (
            product_id INT AUTO_INCREMENT PRIMARY KEY,
            product_sku VARCHAR(64) UNIQUE NULL,
            product_name VARCHAR(255) NOT NULL,
            product_brand VARCHAR(255) NULL,
            product_price DECIMAL(10,2) NULL,
            product_category VARCHAR(64) NULL,
            product_description TEXT NULL,
            product_location VARCHAR(64) NULL,
            product_min_threshold INT NULL,
            product_active TINYINT(1) DEFAULT 1,
            created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ");

        $this->execute("
          CREATE TABLE IF NOT EXISTS movements (
            movement_id INT AUTO_INCREMENT PRIMARY KEY,
            product_id INT NOT NULL,
            movement_type ENUM('IN','OUT') NOT NULL,
            movement_quantity INT NOT NULL,
            movement_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            movement_note VARCHAR(255) NULL,
            CONSTRAINT fk_mov_product FOREIGN KEY (product_id) REFERENCES products(product_id)
              ON UPDATE CASCADE ON DELETE RESTRICT,
            INDEX idx_mov_prod_at (product_id, movement_at)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ");
// --- (re)création idempotente des contraintes CHECK (compatible MySQL) ---

// DROP si existent
        $cnt = $this->fetchRow("
  SELECT COUNT(*) AS c
  FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
  WHERE CONSTRAINT_SCHEMA = DATABASE()
    AND TABLE_NAME = 'movements'
    AND CONSTRAINT_NAME = 'chk_mtype'
");
        if ((int)$cnt['c'] > 0) {
            $this->execute("ALTER TABLE movements DROP CHECK chk_mtype");
        }

        $cnt = $this->fetchRow("
  SELECT COUNT(*) AS c
  FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
  WHERE CONSTRAINT_SCHEMA = DATABASE()
    AND TABLE_NAME = 'movements'
    AND CONSTRAINT_NAME = 'chk_qty_positive'
");
        if ((int)$cnt['c'] > 0) {
            $this->execute("ALTER TABLE movements DROP CHECK chk_qty_positive");
        }

// ADD si absentes
        $cnt = $this->fetchRow("
  SELECT COUNT(*) AS c
  FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
  WHERE CONSTRAINT_SCHEMA = DATABASE()
    AND TABLE_NAME = 'movements'
    AND CONSTRAINT_NAME = 'chk_mtype'
");
        if ((int)$cnt['c'] === 0) {
            $this->execute("ALTER TABLE movements
      ADD CONSTRAINT chk_mtype CHECK (movement_type IN ('IN','OUT'))");
        }

        $cnt = $this->fetchRow("
  SELECT COUNT(*) AS c
  FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
  WHERE CONSTRAINT_SCHEMA = DATABASE()
    AND TABLE_NAME = 'movements'
    AND CONSTRAINT_NAME = 'chk_qty_positive'
");
        if ((int)$cnt['c'] === 0) {
            $this->execute("ALTER TABLE movements
      ADD CONSTRAINT chk_qty_positive CHECK (movement_quantity > 0)");
        }

        // Vues
        $this->execute("
          CREATE OR REPLACE VIEW v_product_stock AS
          SELECT m.product_id,
                 COALESCE(SUM(CASE WHEN m.movement_type='IN' THEN m.movement_quantity
                                   WHEN m.movement_type='OUT' THEN -m.movement_quantity
                                   ELSE 0 END),0) AS current_stock
          FROM movements m
          GROUP BY m.product_id;
        ");

        $this->execute("
          CREATE OR REPLACE VIEW v_products_enriched AS
          SELECT p.*,
                 COALESCE(s.current_stock,0) AS current_stock,
                 CASE WHEN p.product_min_threshold IS NOT NULL
                           AND COALESCE(s.current_stock,0) < p.product_min_threshold
                      THEN 1 ELSE 0 END AS is_below_threshold
          FROM products p
          LEFT JOIN v_product_stock s ON s.product_id = p.product_id;
        ");
    }

    public function down(): void
    {
        $this->execute("DROP VIEW IF EXISTS v_products_enriched");
        $this->execute("DROP VIEW IF EXISTS v_product_stock");
        // On ne droppe pas les tables en down pour éviter la perte de données en dev
        // $this->table('movements')->drop()->save();
        // $this->table('products')->drop()->save();
    }
}
