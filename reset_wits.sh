#!/bin/bash

# le fichier devrait s'appeller normalement : reset_wits.sh




# =====================================================================
# 🔄 SCRIPT DE RÉINITIALISATION COMPLÈTE DU PROJET WITS
# Version stable : v1.1.3  (produits OK / mouvements cassés)
# Auteur : Jason Oyono (avec copilote technique)
# =====================================================================

# 💡 Objectif :
#   - Restaurer le code au tag v1.1.3
#   - Reconstruire tous les conteneurs Docker
#   - Réimporter la base de données initiale
#   - Réinsérer les seeds si nécessaire

# =====================================================================
# 1️⃣  RESTAURER LE CODE SOURCE AU TAG v1.1.3
# =====================================================================

echo "📦 [1/5] Restauration du code source (v1.1.3)..."
cd /c/wamp64/www/WITS || exit 1

git fetch --all --tags
git checkout v1.1.3
git reset --hard v1.1.3

# (Optionnel) créer une branche de correction basée sur le tag
git checkout -B fix-movements-from-v1.1.3

echo "✅ Code restauré sur la base du tag v1.1.3"
echo "-------------------------------------------------------------"
sleep 2


# =====================================================================
# 2️⃣  RECONSTRUIRE DOCKER DEPUIS CETTE VERSION
# =====================================================================

echo "🐳 [2/5] Reconstruction complète des conteneurs Docker..."

cd infra || exit 1

# Supprime les conteneurs + volumes (⚠️ supprime la DB)
docker compose down -v

# Reconstruit TOUT sans cache
docker compose build --no-cache

# Redémarre tous les services
docker compose up -d

# Vérifie que tout tourne
docker compose ps

echo "✅ Docker reconstruit et relancé."
echo "-------------------------------------------------------------"
sleep 3


# =====================================================================
# 3️⃣  RÉIMPORTER LA BASE DE DONNÉES INITIALE
# =====================================================================

echo "🗃️ [3/5] Réimportation de la base de données initiale..."
cd /c/wamp64/www/WITS || exit 1

# Vérifie le nom du conteneur DB
DB_CONTAINER=$(docker ps --format '{{.Names}}' | grep 'db' | head -n 1)

if [ -z "$DB_CONTAINER" ]; then
  echo "❌ Erreur : conteneur MySQL non trouvé. Vérifie avec 'docker ps'."
  exit 1
fi

echo "➡️  Conteneur détecté : $DB_CONTAINER"
echo "➡️  Importation du script init.sql..."

docker exec -i "$DB_CONTAINER" mysql -u root -proot wits < db/init.sql

echo "✅ Base de données restaurée."
echo "-------------------------------------------------------------"
sleep 2


# =====================================================================
# 4️⃣  TESTS RAPIDES D’INTÉGRITÉ
# =====================================================================

echo "🧪 [4/5] Tests d’intégrité rapide :"

echo "➡️ Test API produits..."
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8081/products

echo "➡️ Test API mouvements..."
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8082/movements

echo "✅ Si 'products' = 200 et 'movements' ≠ 200 → tout est normal."
echo "-------------------------------------------------------------"
sleep 2


# =====================================================================
# 5️⃣  RÉINSÉRER LES SEEDS SI NÉCESSAIRE
# =====================================================================

echo "🌱 [5/5] Réinsertion manuelle des seeds (si DB vide)..."

echo "💡 Pour exécuter les seeds individuellement, copie-colle ceci :"
cat <<'EOF'
docker exec -i infra-db-1 mysql -u root -proot wits < db/seeds/categories.sql
docker exec -i infra-db-1 mysql -u root -proot wits < db/seeds/locations.sql
docker exec -i infra-db-1 mysql -u root -proot wits < db/seeds/products.sql
docker exec -i infra-db-1 mysql -u root -proot wits < db/seeds/movement_types.sql
docker exec -i infra-db-1 mysql -u root -proot wits < db/seeds/users.sql
docker exec -i infra-db-1 mysql -u root -proot wits < db/seeds/movements.sql
EOF

echo "-------------------------------------------------------------"
echo "✅ RÉINITIALISATION COMPLÈTE TERMINÉE"
echo "📍 Version courante : v1.1.3 (produits stables / mouvements cassés)"
echo "-------------------------------------------------------------"
