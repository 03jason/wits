/* =========================================================
   WITS - INIT.SQL (SCHEMA SEUL, SANS SEEDS)
   ========================================================= */

/* -- Optionnel : préciser la base si nécessaire
USE wits;
*/

/* ---------------------------------------------------------
   0) OPTIONS GÉNÉRALES
   --------------------------------------------------------- */
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

/* ---------------------------------------------------------
   1) DROP VIEWS (ORDRE SÉCURISÉ)
   --------------------------------------------------------- */
DROP VIEW IF EXISTS v_products_enriched;
DROP VIEW IF EXISTS v_product_stock;

/* ---------------------------------------------------------
   2) DROP TABLES (ORDRE SÉCURISÉ)
   --------------------------------------------------------- */
DROP TABLE IF EXISTS movements;
DROP TABLE IF EXISTS movement_types;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS locations;
DROP TABLE IF EXISTS users;

/* ---------------------------------------------------------
   3) TABLE: categories — référentiel de catégories
   --------------------------------------------------------- */
CREATE TABLE categories (
                            category_id      CHAR(5)      PRIMARY KEY,
                            category_name    VARCHAR(120) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* ---------------------------------------------------------
   4) TABLE: locations — référentiel des emplacements
   --------------------------------------------------------- */
CREATE TABLE locations (
                           location_id          INT AUTO_INCREMENT PRIMARY KEY,
                           location_name        VARCHAR(100) NOT NULL,
                           location_description TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* ---------------------------------------------------------
   5) TABLE: products — entité centrale
   --------------------------------------------------------- */
CREATE TABLE products (
                          product_id            INT AUTO_INCREMENT PRIMARY KEY,
                          product_sku           VARCHAR(64)  NOT NULL UNIQUE,
                          product_name          VARCHAR(200) NOT NULL,
                          product_brand         VARCHAR(120) NULL,
                          product_price         DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                          category_id           CHAR(5) NULL,
                          location_id           INT NULL,
                          product_description   TEXT NULL,
                          product_min_threshold INT NOT NULL DEFAULT 0,
                          product_active        TINYINT(1) NOT NULL DEFAULT 1,

                          CONSTRAINT fk_products_category
                              FOREIGN KEY (category_id)
                                  REFERENCES categories(category_id)
                                  ON UPDATE CASCADE
                                  ON DELETE SET NULL,

                          CONSTRAINT fk_products_location
                              FOREIGN KEY (location_id)
                                  REFERENCES locations(location_id)
                                  ON UPDATE CASCADE
                                  ON DELETE SET NULL,

                          INDEX idx_products_category (category_id),
                          INDEX idx_products_active   (product_active),
                          INDEX idx_products_name     (product_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* ---------------------------------------------------------
   6) TABLE: movement_types — référentiel des types de mouvements
   --------------------------------------------------------- */
CREATE TABLE movement_types (
                                type_code      CHAR(10)     PRIMARY KEY,   -- ex: IN, OUT, SALE, REFUND, DATA
                                type_label     VARCHAR(64)  NOT NULL,      -- ex: "Entrée", "Sortie", ...
                                direction_sign TINYINT      NOT NULL,      -- +1 / -1 / 0
                                affects_stock  TINYINT(1)   NOT NULL       -- 1 si impacte le stock, 0 sinon
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* ---------------------------------------------------------
   7) TABLE: users — acteurs (schéma mis à jour)
   --------------------------------------------------------- */
CREATE TABLE users (
                       user_id       INT AUTO_INCREMENT PRIMARY KEY,
                       email         VARCHAR(190) NOT NULL UNIQUE,
                       user_pseudo   VARCHAR(190) NOT NULL UNIQUE,
                       password_hash VARCHAR(255) NOT NULL,
                       first_name    VARCHAR(120) NULL,
                       last_name     VARCHAR(120) NOT NULL,
                       role          VARCHAR(32)  NULL            -- ex: admin, staff
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


/* ---------------------------------------------------------
   8) TABLE: movements — historique & traçabilité
   --------------------------------------------------------- */
CREATE TABLE movements (
                           movement_id     BIGINT AUTO_INCREMENT PRIMARY KEY,
                           product_id      INT      NOT NULL,
                           type_code       CHAR(10) NOT NULL,
                           quantity        INT      NOT NULL DEFAULT 0,
                           note            TEXT NULL,
                           user_id         INT NULL,
                           resulting_stock INT NULL,          -- snapshot (optionnel)
                           meta_before     JSON NULL,
                           meta_after      JSON NULL,
                           created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

                           CONSTRAINT fk_movements_product
                               FOREIGN KEY (product_id)
                                   REFERENCES products(product_id)
                                   ON UPDATE CASCADE
                                   ON DELETE CASCADE,

                           CONSTRAINT fk_movements_type
                               FOREIGN KEY (type_code)
                                   REFERENCES movement_types(type_code)
                                   ON UPDATE CASCADE
                                   ON DELETE RESTRICT,

                           CONSTRAINT fk_movements_user
                               FOREIGN KEY (user_id)
                                   REFERENCES users(user_id)
                                   ON UPDATE CASCADE
                                   ON DELETE SET NULL,

                           INDEX idx_movements_product (product_id),
                           INDEX idx_movements_type    (type_code),
                           INDEX idx_movements_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* ---------------------------------------------------------
   9) VUE: v_product_stock — stock courant par produit
   --------------------------------------------------------- */
CREATE VIEW v_product_stock AS
SELECT
    p.product_id,
    p.product_sku,
    p.product_name,
    COALESCE(
            SUM(
                    CASE
                        WHEN mt.affects_stock = 1 THEN m.quantity * mt.direction_sign
                        ELSE 0
                        END
            ),
            0
    ) AS current_stock
FROM products p
         LEFT JOIN movements m    ON m.product_id = p.product_id
         LEFT JOIN movement_types mt ON mt.type_code = m.type_code
GROUP BY p.product_id, p.product_sku, p.product_name;

/* ---------------------------------------------------------
   10) VUE: v_products_enriched — vue front/report
   --------------------------------------------------------- */
CREATE VIEW v_products_enriched AS
SELECT
    p.product_id,
    p.product_sku,
    p.product_name,
    p.product_brand,
    p.product_description,
    p.product_price,
    p.category_id,
    c.category_name,
    p.location_id,
    l.location_name,
    s.current_stock,
    p.product_min_threshold,
    p.product_active,
    (
        SELECT MAX(m.created_at)
        FROM movements m
        WHERE m.product_id = p.product_id
    ) AS last_movement_at,
    (
        SELECT m2.type_code
        FROM movements m2
        WHERE m2.product_id = p.product_id
        ORDER BY m2.created_at DESC, m2.movement_id DESC
        LIMIT 1
    ) AS last_movement_type
FROM products p
         LEFT JOIN categories c    ON c.category_id  = p.category_id
         LEFT JOIN locations  l    ON l.location_id  = p.location_id
         LEFT JOIN v_product_stock s ON s.product_id = p.product_id;


/* ---------------------------------------------------------
   11) VUE: v_movements_enriched — vue front/report
   --------------------------------------------------------- */
CREATE OR REPLACE VIEW v_movements_enriched AS
SELECT
    m.movement_id,
    m.product_id,
    p.product_name,
    m.quantity,
    u.user_id,
    CONCAT(u.first_name, ' ', u.last_name) AS username,
    u.user_pseudo,
    m.type_code,
    mt.type_label AS type_label,
    m.note AS movement_note,
    m.created_at AS movement_date
FROM movements m
         LEFT JOIN products p ON p.product_id = m.product_id
         LEFT JOIN users u ON u.user_id = m.user_id
         LEFT JOIN movement_types mt ON mt.type_code = m.type_code
ORDER BY m.created_at DESC;

/* ---------------------------------------------------------
   11) FIN & RÉACTIVATION DES CLEFS
   --------------------------------------------------------- */
SET FOREIGN_KEY_CHECKS = 1;



/* ---------------------------------------------------------
   INFO - si une view dois être changer,
   utiliser ce code et adapater au truc qu'on modif.
   A utiliser dans localhost 8080 dans la db docker
   --------------------------------------------------------- */
/*

CREATE OR REPLACE VIEW v_products_enriched AS
SELECT
    p.product_id,
    p.product_sku,
    p.product_name,
    p.product_brand,
    p.product_description,
    p.product_price,
    p.category_id,
    c.category_name,
    p.location_id,
    l.location_name,
    s.current_stock,
    p.product_min_threshold,
    p.product_active
FROM products p
LEFT JOIN categories c ON c.category_id = p.category_id
LEFT JOIN locations  l ON l.location_id = p.location_id
LEFT JOIN v_product_stock s ON s.product_id = p.product_id;

 */