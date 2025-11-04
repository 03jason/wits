WITS – CHANGELOG
v1.2.0 — Version stable (APIs produits et mouvements fonctionnelles)

Date : novembre 2025
Tag GitHub : v1.2.0

Résumé global

Cette version marque la stabilisation complète du système WITS sur trois axes :

Base de données unifiée, propre et normalisée.

APIs PHP Slim 4 fonctionnelles, désormais basées sur Eloquent ORM.

Front React capable de récupérer et d’afficher les données en temps réel.

Changements majeurs
Base de données

Refonte complète des tables principales :
products, categories, movement_types, movements, users, locations.

Uniformisation des clés étrangères, ID auto-incrémentés et types SQL cohérents.

Suppression des anciennes données de test et réécriture des seeds.

Ajout des vues SQL :

v_product_stock : calcule le stock réel via la somme pondérée des mouvements.

v_products_enriched : jointure enrichie (produit, catégorie, localisation, stock).

v_movements_enriched : relie mouvements, produits, utilisateurs et types pour un affichage complet.

ORM & API

Passage complet à Eloquent ORM (abandon du PDO manuel).

Réécriture complète des contrôleurs :

ProductController et MovementController basés sur les modèles Eloquent.

Suppression des injections inutiles de PDO et Container.

Simplification de public/index.php :

Une seule route /health pour le monitoring.

Chargement unique des routes depuis src/routes.php.

Correction des erreurs connues :

BadRouteException /health

TypeError: Argument #1 ($db) must be PDO

405 Method Not Allowed

Résultat :

http://localhost:8081/api/products