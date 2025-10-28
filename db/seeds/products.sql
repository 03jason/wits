/* =========================================================
   SEED — PRODUCTS (mis à jour pour le nouveau schéma)
   ========================================================= */
SET NAMES utf8mb4; SET FOREIGN_KEY_CHECKS=0;

INSERT INTO products
(product_sku, product_name, product_brand, product_price, category_id, location_id, product_description, product_min_threshold, product_active)
VALUES
    ('SKU-CHAISE',        'Chaise',                        'IKEA',       29.90, 'INDE',  1, 'Chaise intérieur, structure métal',                  5, 1),
    ('SKU-ECRANPC',       'Écran PC 24"',                  'Samsung',   149.00, 'MEDIA', 2, 'Écran 24 pouces FHD',                                2, 1),
    ('SKU-RUBIKS-3',      'Rubik’s Cube 3x3',              'Rubik’s',    12.90, 'JOUET', 1, 'Cube 3x3 officiel',                                  5, 1),
    ('SKU-EAU-50',        'Eau 50cl',                      'Evian',      0.60,  'NOUR',  1, 'Bouteille 50cl',                                      20,1),
    ('SKU-CREME-AVOCAT',  'Crème corps avocat',            'Nivea',      5.90,  'COSM',  1, 'Hydratant corps à l’avocat',                          4, 1),
    ('SKU-PERCEUSE',      'Perceuse',                      'Bosch',      79.00, 'BRICO', 1, 'Perceuse filaire 600W',                              1, 1),
    ('SKU-ROBOT-CUIS',    'Robot cuisine (tech)',          'Moulinex',  129.00, 'MEDIA', 2, 'Robot multifonction (tech)',                         1, 1),
    ('SKU-CACTUS-FAUX',   'Mini faux cactus',              'DecoHome',   4.50,  'INDE',  1, 'Petit cactus déco artificiel',                       6, 1),
    ('SKU-CHAISE-EXT',    'Chaise extérieur',              'IKEA',       34.90, 'EXJA',  1, 'Chaise d’extérieur empilable',                       3, 1),
    ('SKU-CORBEILLE',     'Corbeille de bureau',           'Maped',       6.90, 'BREAU', 1, 'Corbeille plastique 15L',                            4, 1),
    ('SKU-CRAVATE-R',     'Cravate rouge',                 'Celio',      14.90, 'VETEM', 1, 'Cravate unie rouge',                                 3, 1),
    ('SKU-JBL-BAFFLE',    'Baffle stéréo',                 'JBL',        89.00, 'MEDIA', 2, 'Enceinte Bluetooth stéréo',                          2, 1),
    ('SKU-DREFT-450',     'Dreft citron 450ml',            'Dreft',       2.90, 'NETOY', 1, 'Liquide vaisselle citron 450ml',                     8, 1),
    ('SKU-SAC-TOILE',     'Sac course toile',              'EcoBag',      3.50, 'BAZAR', 1, 'Sac cabas toile réutilisable',                       5, 1),
    ('SKU-PRINCE-LU',        'Prince de LU',                  'LU',          1.99, 'NOUR',  1, 'Biscuits Prince de LU',                              10,1),
    ('SKU-BAL-ALIM',      'Balance cuisine 5 kg',          'Tefal',      19.90, 'CUISI', 1, 'Balance cuisine 5 kg',                              2, 1),
    ('SKU-ROSE-JARDIN',   'Rose de jardin',                'JardiPro',    7.90, 'EXJA',  1, 'Rosier jeune plant',                                 3, 1),
    ('SKU-PARFUM-BERLIN', 'Parfum - Le Berlin',            'Zara',       22.90, 'COSM',  1, 'Eau de parfum “Le Berlin”',                          2, 1),
    ('SKU-BIC-4C',        'Bic 4 couleurs',                'BIC',         2.80, 'BREAU', 1, 'Stylo 4 couleurs',                                   8, 1),
    ('SKU-SWIFFER-PLUM',  'Plumeau poussière',             'Swiffer',     4.20, 'NETOY', 1, 'Plumeau dépoussiérant',                              6, 1),
    ('SKU-EXFO-COCO',     'Exfoliant visage coco',         'Garnier',     6.90, 'COSM',  1, 'Gommage visage à la noix de coco',                   4, 1),
    ('SKU-DEO-SANS',      'Déodorant peau sensible',       'Sanex',       3.90, 'HYGI',  1, 'Déodorant peau sensible',                            6, 1),
    ('SKU-PARAPLUIE',     'Parapluie pliant',              'Knirps',     14.90, 'BAZAR', 1, 'Parapluie pliant',                                  3, 1),
    ('SKU-TABLET-LLV',    'Tablettes lave-vaisselle x30',  'Finish',      5.90, 'NETOY', 1, 'Tablettes lave-vaisselle x30',                       6, 1),
    ('SKU-CAFE-GRAIND',   'Café moulu 250g',               'Graindor',    4.50, 'NOUR',  1, 'Café moulu 250g',                                   8, 1),
    ('SKU-LESSIVE-PERS',  'Lessive liquide 2L',            'Persil',      9.90, 'NETOY', 1, 'Lessive liquide 2L',                                4, 1),
    ('SKU-SIROP-TOUX',    'Sirop contre la toux 150ml',    'Vicks',       6.50, 'PHARM', 1, 'Sirop contre la toux 150ml',                        2, 1),
    ('SKU-POELE-TEFAL',   'Poêle antiadhésive 28cm',       'Tefal',      24.90, 'CUISI', 1, 'Poêle antiadhésive 28cm',                           3, 1),
    ('SKU-BROSSE-OB',     'Brosse à dents souple',         'Oral-B',      2.90, 'HYGI',  1, 'Brosse à dents souple',                             8, 1),
    ('SKU-HOUSSE',        'Housse de protection',          'Generic',     7.90, 'BAZAR', 1, 'Housse multi-usage',                               3, 1),
    ('SKU-MAC-CAFE',      'Machine à café expresso',       'Delonghi',  199.00, 'CUISI', 1, 'Machine expresso',                                  1, 1),
    ('SKU-EPONGE',        'Éponge grattante',              'Spontex',     1.20, 'NETOY', 1, 'Éponge grattante',                                  10,1),
    ('SKU-BALAI',         'Balai fibres mixtes',           'Vileda',      8.90, 'NETOY', 1, 'Balai fibres mixtes',                               3, 1),
    ('SKU-RICE-COOK',     'Cuiseur à riz 1.8L',            'Tefal',      49.00, 'CUISI', 1, 'Cuiseur 1.8L',                                      2, 1);

SET FOREIGN_KEY_CHECKS=1;
