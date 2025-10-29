# -------------------------------
# MOVEMENTS API - Dockerfile
# -------------------------------
FROM php:8.3-cli

WORKDIR /var/www

COPY ./movements-api/ .

RUN apt-get update && \
    docker-php-ext-install pdo pdo_mysql && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/bin --filename=composer

RUN composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader --ignore-platform-reqs

EXPOSE 8082

CMD ["php", "-S", "0.0.0.0:8082", "-t", "public"]
