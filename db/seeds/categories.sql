/* =========================================================
   SEED — CATEGORIES (référentiel mis à jour)
   ========================================================= */
SET NAMES utf8mb4; SET FOREIGN_KEY_CHECKS=0;

INSERT INTO categories (category_id, category_name) VALUES
    ('NOUR',  'Nourriture'),
    ('BRICO', 'Bricolage'),
    ('LIBR',  'Librairie'),
    ('MEDIA', 'Tech et Multimédia'),
    ('JOUET', 'Jeux et Loisirs'),
    ('VETEM', 'Vêtements et Accessoires'),
    ('INDE',  'Intérieur & Déco'),
    ('EXJA',  'Extérieur & Jardin'),
    ('HYGI',  'Hygiène'),
    ('COSM',  'Beauté & Cosmétiques'),
    ('CUISI', 'Cuisine'),
    ('BAZAR', 'Bazar / Divers'),
    ('BREAU', 'Bureau & Papeterie'),
    ('NETOY', 'Nettoyage & Entretien'),
    ('PHARM', 'Pharmacie & Médecine'),
    ('LIT',   'Literie');

SET FOREIGN_KEY_CHECKS=1;
