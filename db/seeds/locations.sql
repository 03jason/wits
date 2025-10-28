/* =========================================================
   SEED — LOCATIONS (emplacements)
   ========================================================= */
SET NAMES utf8mb4; SET FOREIGN_KEY_CHECKS=0;

INSERT INTO locations (location_name, location_description) VALUES
    ('Entrepôt Central A',         'Plateforme principale de stockage – zone A'),
    ('Entrepôt Nord B',            'Annexe logistique – zone B (électronique)'),
    ('Fournisseur Primeur SA',     'Point de réception produits frais – primeurs'),
    ('Fournisseur Électronique NV','Point de réception matériel électronique');

SET FOREIGN_KEY_CHECKS=1;
