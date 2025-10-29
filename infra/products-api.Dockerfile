FROM php:8.3-cli

# Dossier de travail dans le conteneur
WORKDIR /var/www

# Copie uniquement le dossier products-api (pas tout le projet)
COPY ./products-api/ .

# Installation de Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/bin --filename=composer

# Installation des dépendances PHP
RUN composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader

CMD ["php", "-S", "0.0.0.0:8081", "-t", "public"]
