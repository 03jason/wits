-- WITS init.sql (MySQL 8)
CREATE DATABASE IF NOT EXISTS wits
    CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE wits;

-- PRODUCTS
CREATE TABLE IF NOT EXISTS products (
                                        product_id            INT AUTO_INCREMENT PRIMARY KEY,
                                        product_sku           VARCHAR(64)      NULL UNIQUE,      -- code interne
                                        product_name          VARCHAR(255)     NOT NULL,
                                        product_brand         VARCHAR(100)     NULL,
                                        product_price         DECIMAL(10,2)    NULL,
                                        product_category      VARCHAR(100)     NULL,
                                        product_description   TEXT             NULL,
                                        product_location      VARCHAR(120)     NULL,
                                        product_min_threshold INT              NULL,             -- seuil pour badge UI
                                        product_active        TINYINT(1)       NOT NULL DEFAULT 1,
                                        created_at            TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                        updated_at            TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                        INDEX idx_products_name  (product_name),
                                        INDEX idx_products_brand (product_brand)
) ENGINE=InnoDB;

-- MOVEMENTS
CREATE TABLE IF NOT EXISTS movements (
                                         movement_id       INT AUTO_INCREMENT PRIMARY KEY,
                                         product_id        INT            NOT NULL,
                                         movement_type     VARCHAR(3)     NOT NULL,              -- 'IN' | 'OUT'
                                         movement_quantity INT            NOT NULL,
                                         movement_at       TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                         movement_note     VARCHAR(255)   NULL,
                                         CONSTRAINT chk_movement_type CHECK (movement_type IN ('IN','OUT')),
                                         CONSTRAINT chk_movement_qty  CHECK (movement_quantity > 0),
                                         CONSTRAINT fk_mov_product
                                             FOREIGN KEY (product_id) REFERENCES products(product_id)
                                                 ON UPDATE CASCADE
                                                 ON DELETE RESTRICT,
                                         INDEX idx_movements_product_time (product_id, movement_at)
) ENGINE=InnoDB;

-- VIEW: stock courant par produit (source d'autorité = movements)
CREATE OR REPLACE VIEW v_product_stock AS
SELECT
    p.product_id,
    COALESCE(SUM(CASE
                     WHEN m.movement_type='IN'  THEN m.movement_quantity
                     WHEN m.movement_type='OUT' THEN -m.movement_quantity
                     ELSE 0 END), 0) AS current_stock
FROM products p
         LEFT JOIN movements m ON m.product_id = p.product_id
GROUP BY p.product_id;

-- VIEW: produit enrichi (stock + alerte)
CREATE OR REPLACE VIEW v_products_enriched AS
SELECT
    p.*,
    s.current_stock,
    CASE
        WHEN p.product_min_threshold IS NULL THEN 0
        WHEN s.current_stock < p.product_min_threshold THEN 1
        ELSE 0
        END AS is_below_threshold
FROM products p
         LEFT JOIN v_product_stock s ON s.product_id = p.product_id;

-- SEEDS (démo)
INSERT INTO products (product_sku, product_name, product_brand, product_price, product_category, product_description, product_location, product_min_threshold)
VALUES
    ('SKU-COOKIE','Hazelnut cookie',NULL,NULL,'food',      NULL,'A1',5),
    ('SKU-SOCK',  'Socks',          NULL,NULL,'clothes',   NULL,'B3',3),
    ('SKU-CHAIR', 'Chair',          NULL,NULL,'furniture', NULL,'C2',1);

INSERT INTO movements (product_id, movement_type, movement_quantity, movement_at, movement_note) VALUES
                                                                                                     (1,'IN', 12,'2025-09-04 11:28:00','seed'),


ALTER TABLE movements
    ADD CONSTRAINT chk_mtype CHECK (movement_type IN ('IN','OUT')),
    ADD CONSTRAINT chk_qty_positive CHECK (movement_quantity > 0);

CREATE INDEX IF NOT EXISTS idx_movements_product_at ON movements (product_id, movement_at);
CREATE INDEX IF NOT EXISTS idx_products_name ON products (product_name);
