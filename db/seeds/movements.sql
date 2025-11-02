/* =========================================================
   SEED — MOVEMENTS (50 entrées, sept–oct 2025)
   ========================================================= */
SET NAMES utf8mb4; SET FOREIGN_KEY_CHECKS=0;

/* Repère produits (extraits base init) :
1 Chaise (INDE)             2 Écran 24" (MEDIA)       3 Rubik’s (JOUET)
4 Eau 50cl (NOUR)           5 Crème avocat (COSM)     6 Perceuse (BRICO)
7 Robot cuisine (MEDIA)     8 Faux cactus (INDE)      9 Chaise ext. (EXJA)
10 Corbeille (BREAU)        11 Cravate (VETEM)        12 Baffle (MEDIA)
13 Dreft 450ml (NETOY)      14 Sac toile (BAZAR)      15 Prince (NOUR)
16 Balance 5 kg (CUISI)     17 Rose jardin (EXJA)     18 Parfum (COSM)
19 Bic 4C (BREAU)           20 Plumeau (NETOY)        21 Exfoliant coco (COSM)
22 Déodorant (HYGI)         23 Parapluie (BAZAR)      24 Pastilles LV (NETOY)
25 Café 250g (NOUR)         26 Lessive 2L (NETOY)     27 Sirop toux (PHARM)
28 Poêle 28cm (CUISI)       29 Brosse à dents (HYGI)  30 Housse (BAZAR)
31 Machine café (CUISI)     32 Éponge (NETOY)         33 Balai (NETOY)
34 Cuiseur riz (CUISI)
*/

INSERT INTO movements (product_id, type_code, quantity, note, user_id, created_at) VALUES

-- 0) stocks négatifs → on compense + marge pour atteindre ~50 max
(1,  'IN', 22, 'reset seed', 2,'2025-09-01 07:00:00'),
(3,  'IN', 27, 'reset seed', 3,'2025-09-01 07:00:00'),
(5,  'IN', 30, 'reset seed', 2,'2025-09-01 07:00:00'),
(7,  'IN', 19, 'reset seed', 3,'2025-09-01 07:00:00'),
(8,  'IN', 34, 'reset seed', 3,'2025-09-01 07:00:00'),
(9,  'IN', 28, 'reset seed', 2,'2025-09-01 07:00:00'),
(10, 'IN', 23, 'reset seed', 1,'2025-09-01 07:00:00'),
(11, 'IN', 26, 'reset seed', 1,'2025-09-01 07:00:00'),
(13, 'IN', 37, 'reset seed', 1,'2025-09-01 07:00:00'),
(14, 'IN', 33, 'reset seed', 1,'2025-09-01 07:00:00'),
(16, 'IN', 41, 'reset seed', 2,'2025-09-01 07:00:00'),
(17, 'IN', 25, 'reset seed', 3,'2025-09-01 07:00:00'),
(18, 'IN', 38, 'reset seed', 2,'2025-09-01 07:00:00'),

(19, 'IN', 45, 'init seed', 1,'2025-09-01 07:00:00'),  -- -25 → +45
(20, 'IN', 42, 'ini seed', 2,'2025-09-01 07:00:00'),  -- -7  → +42
(21, 'IN', 47, 'init seed', 3,'2025-09-01 07:00:00'),  -- -15 → +47
(22, 'IN', 39, 'init seed', 3,'2025-09-01 07:00:00'),  -- -12 → +39
(23, 'IN', 50, 'init seed', 3,'2025-09-01 07:00:00'),  -- -6  → +50
(27, 'IN', 24, 'init seed', 3,'2025-09-01 07:00:00'),  -- 0   → +24
(32, 'IN', 44, 'init seed', 2,'2025-09-01 07:00:00'),  -- -10 → +44
(33, 'IN', 36, 'init seed', 3,'2025-09-01 07:00:00'),  -- -5  → +36

-- 1) Appro initial (début septembre)
(2,'PURCHASE',20,'Appro écrans FHD',1,'2025-09-01 09:05:00'),
(12,'PURCHASE',15,'Appro enceintes Bluetooth',1,'2025-09-01 09:10:00'),
(6,'PURCHASE',10,'Appro perceuses',2,'2025-09-01 09:20:00'),
(25,'PURCHASE',50,'Appro café',2,'2025-09-01 09:30:00'),
(26,'PURCHASE',20,'Appro lessive',2,'2025-09-01 09:35:00'),
(24,'PURCHASE',30,'Appro pastilles LV',3,'2025-09-01 09:45:00'),
(4,'PURCHASE',200,'Appro eau 50cl',3,'2025-09-01 10:00:00'),
(15,'PURCHASE',120,'Appro biscuits Prince',1,'2025-09-01 10:10:00'),

-- 2) Premières ventes & sorties
(2,'SALE',3,'Vente écrans',1,'2025-09-03 14:00:00'),
(12,'SALE',2,'Vente enceintes',1,'2025-09-03 14:05:00'),
(25,'SALE',8,'Vente café',2,'2025-09-03 14:15:00'),
(19,'SALE',25,'Vente Bic 4C',2,'2025-09-03 14:20:00'),
(24,'OUT',5,'Sortie interne démo LV',3,'2025-09-04 09:00:00'),

-- 3) Retours / remboursements / données / pertes
(2,'RETURN',1,'Retour écran pixels morts',2,'2025-09-05 11:30:00'),
(12,'RETURN',1,'Retour grésillement',2,'2025-09-05 11:35:00'),
(26,'BURN',2,'Destruction bidons abîmés',3,'2025-09-06 16:10:00'),
(4,'BURN',10,'Palette percée (eau)',3,'2025-09-06 16:20:00'),
(31,'DATA',0,'MAJ libellé technique',1,'2025-09-07 10:00:00'),

-- 4) Réassorts ciblés & ventes
(2,'IN',5,'Réception complémentaire',1,'2025-09-10 09:15:00'),
(12,'IN',5,'Réception complémentaire',1,'2025-09-10 09:20:00'),
(25,'IN',30,'Réception café promo',2,'2025-09-10 09:30:00'),
(15,'SALE',40,'Promo Prince',2,'2025-09-11 15:00:00'),
(4,'SALE',60,'Vente eau (événement)',3,'2025-09-12 18:00:00'),

-- 5) Flux variés mi-septembre
(6,'SALE',3,'Vente perceuses',1,'2025-09-15 10:10:00'),
(33,'SALE',5,'Vente balais',2,'2025-09-15 10:20:00'),
(23,'SALE',6,'Vente parapluies',2,'2025-09-16 08:40:00'),
(21,'SALE',12,'Vente exfoliant',2,'2025-09-16 08:45:00'),
(22,'SALE',10,'Vente déo',2,'2025-09-16 08:50:00'),
(20,'OUT',4,'Sortie nettoyage locaux',3,'2025-09-16 09:10:00'),
(32,'OUT',10,'Sortie éponge ménage',3,'2025-09-16 09:15:00'),

-- 6) Retours & avoirs (cohérence types)
(2,'REFUND',1,'Avoir fournisseur écran',1,'2025-09-18 11:00:00'),
(12,'REFUND',1,'Avoir fournisseur enceinte',1,'2025-09-18 11:05:00'),
(25,'REFUND',5,'Avoir café livraison incomplète',2,'2025-09-18 11:10:00'),
(4,'REFUND',20,'Avoir palette eau abîmée',3,'2025-09-18 11:20:00'),

-- 7) Fin septembre : achats/retours/data
(31,'PURCHASE',5,'Appro machines café',1,'2025-09-25 10:00:00'),
(34,'PURCHASE',10,'Appro cuiseurs riz',1,'2025-09-25 10:05:00'),
(28,'PURCHASE',12,'Appro poêles',2,'2025-09-25 10:10:00'),
(29,'PURCHASE',60,'Appro brosses dents',2,'2025-09-25 10:15:00'),
(30,'PURCHASE',20,'Appro housses',3,'2025-09-25 10:20:00'),
(31,'DATA',0,'Ajout champs spec interne',1,'2025-09-26 09:00:00'),

-- 8) Début octobre : ventes soutenues
(31,'SALE',2,'Vente machines café',2,'2025-10-02 14:00:00'),
(34,'SALE',3,'Vente cuiseurs riz',2,'2025-10-02 14:05:00'),
(28,'SALE',4,'Vente poêles',2,'2025-10-02 14:10:00'),
(29,'SALE',20,'Vente brosses dents',2,'2025-10-02 14:15:00'),
(30,'SALE',6,'Vente housses',3,'2025-10-02 14:20:00'),

-- 9) Incidents & retours début octobre
(21,'RETURN',3,'Retour exfoliant (réaction)',1,'2025-10-05 12:30:00'),
(22,'RETURN',2,'Retour déo (odeur)',1,'2025-10-05 12:35:00'),
(24,'BURN',3,'Tablettes endommagées',3,'2025-10-06 08:50:00'),
(25,'BURN',2,'Sachets café ouverts',3,'2025-10-06 08:55:00'),

-- 10) Réceptions complémentaires mi-octobre
(2,'IN',10,'Réception écrans Q4',1,'2025-10-12 09:40:00'),
(12,'IN',8,'Réception enceintes Q4',1,'2025-10-12 09:45:00'),
(31,'IN',3,'Réception machines café',1,'2025-10-12 09:50:00'),
(34,'IN',5,'Réception cuiseurs riz',1,'2025-10-12 09:55:00'),

-- 11) Fin octobre : ventes et sorties
(2,'SALE',5,'Vente écrans',2,'2025-10-20 16:10:00'),
(12,'SALE',4,'Vente enceintes',2,'2025-10-20 16:15:00'),
(31,'SALE',1,'Vente machine café',2,'2025-10-21 10:00:00'),
(34,'SALE',2,'Vente cuiseurs riz',2,'2025-10-21 10:05:00'),
(20,'OUT',3,'Sortie entretien',3,'2025-10-22 08:30:00');

SET FOREIGN_KEY_CHECKS=1;
