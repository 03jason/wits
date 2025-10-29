# -------------------------------
# PRODUCTS API - Dockerfile
# -------------------------------
FROM php:8.3-cli

# Définir le dossier de travail
WORKDIR /var/www

# Copier le contenu du dossier API (et non tout le projet)
COPY ./products-api/ .

# Installer les extensions PHP nécessaires à Slim + Eloquent
RUN apt-get update && \
    docker-php-ext-install pdo pdo_mysql && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Installer Composer globalement
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/bin --filename=composer

# Installer les dépendances du projet
RUN composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader --ignore-platform-reqs

# Port exposé (utile si tu veux tester directement l’API)
EXPOSE 8081

# Lancer le serveur PHP intégré (mode dev)
CMD ["php", "-S", "0.0.0.0:8081", "-t", "public"]
