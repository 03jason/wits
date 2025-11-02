# -------------------------------
# MOVEMENTS API - Dockerfile
# -------------------------------
FROM php:8.3-cli

WORKDIR /var/www


COPY ../services/movements-api/ .

# Installer les dépendances système nécessaires à PDO, Composer et MySQL
RUN apt-get update && \
    apt-get install -y libzip-dev unzip git zlib1g-dev default-mysql-client build-essential && \
    docker-php-ext-install pdo pdo_mysql && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Installer Composer globalement
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/bin --filename=composer

# Installer les dépendances PHP du projet
RUN composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader --ignore-platform-reqs

EXPOSE 8082

CMD ["php", "-S", "0.0.0.0:8082", "-t", "public"]
