/* =========================================================
   SEED — MOVEMENT_TYPES
   ========================================================= */
SET NAMES utf8mb4; SET FOREIGN_KEY_CHECKS=0;

INSERT INTO movement_types (type_code, type_label, direction_sign, affects_stock) VALUES
    ('IN',       'Entrée',        +1, 1),
    ('OUT',      'Sortie',        -1, 1),
    ('SALE',     'Vente',         -1, 1),
    ('REFUND',   'Remboursement', +1, 1),
    ('PURCHASE', 'Achat',         +1, 1),
    ('RETURN',   'Retour',        -1, 1),
    ('DATA',     'Donnée',         0, 0),
    ('BURN',     'Périmé/Destruction', -1, 1);

SET FOREIGN_KEY_CHECKS=1;
