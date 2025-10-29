# -------------------------------
# PRODUCTS API - Dockerfile
# -------------------------------
FROM php:8.3-cli

WORKDIR /var/www

COPY ./products-api/ .

# Installer les dépendances système nécessaires avant d'ajouter les extensions PHP
RUN apt-get update && \
    apt-get install -y libzip-dev unzip git zlib1g-dev default-mysql-client build-essential && \
    docker-php-ext-install pdo pdo_mysql && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Installer Composer globalement
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/bin --filename=composer

# Installer les dépendances du projet PHP
RUN composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader --ignore-platform-reqs

EXPOSE 8081

CMD ["php", "-S", "0.0.0.0:8081", "-t", "public"]
