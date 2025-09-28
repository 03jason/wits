FROM php:8.3-cli-alpine
RUN docker-php-ext-install pdo pdo_mysql
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
WORKDIR /var/www
EXPOSE 8082
CMD ["php","-S","0.0.0.0:8082","-t","public"]
