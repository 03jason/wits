# WITS – Gestion de stock (MVP)

Application académique **clean & démontrable** : deux APIs Slim 4 (PHP 8.3 + Eloquent) + front React (Vite).  
Objectif : **CRUD produits**, **mouvements IN/OUT** (règle **OUT ≤ stock**), **stock calculé** via vues SQL, **déploiement containerisé**.

---

## ✅ Fonctionnalités
- Produits : CRUD (create/update/delete soft), pagination, recherche (nom/SKU), seuil d’alerte.
- Mouvements : IN/OUT, **refus d’un OUT si stock insuffisant**.
- Stock dérivé (jamais stocké) via vues `v_product_stock` & `v_products_enriched`.
- Auth **JWT** prête (feature-flag `AUTH_ENABLED`), **validation serveur (422)**, CORS.
- Migrations **Phinx** + **seeds** (données de démo).
- **Tests PHPUnit** (mouvements), **CI GitHub Actions** (build APIs + front).

---

## 🧱 Architecture
- **Back**: PHP 8.3, Slim 4, Eloquent (Illuminate\Database)
- **DB**: MySQL 8 (portable PostgreSQL)
- **Front**: React 18 + Vite
- **Infra**: Docker Compose (db, adminer, products-api, movements-api, web en dev)
- **Séparation en couches**
    - Controllers = I/O HTTP
    - Services = règles métier + transactions
    - Repositories/Models = Eloquent (mapping DB)  

