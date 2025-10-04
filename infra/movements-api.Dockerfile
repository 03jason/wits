FROM php:8.3-cli-alpine
RUN docker-php-ext-install pdo pdo_mysql
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
WORKDIR /var/www
EXPOSE 8082
# Mis en commentaire car utilisé dans test en bas
# CMD ["php","-S","0.0.0.0:8081","-t","public"]


# Dépendances optimisées
RUN php -v >/dev/null 2>&1 || true
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/bin --filename=composer
RUN composer install --no-dev --prefer-dist --no-interaction \
    --optimize-autoloader --classmap-authoritative

# OPcache
RUN printf "opcache.enable=1\nopcache.enable_cli=1\nopcache.validate_timestamps=0\n" \
  > /usr/local/etc/php/conf.d/opcache.ini

ENV APP_ENV=prod

# adapte le port pour movements-api
CMD ["php","-S","0.0.0.0:8081","-t","public"]
