FROM php:8.3-cli

WORKDIR /var/www

COPY ./movements-api/ .

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/bin --filename=composer
RUN composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader

CMD ["php", "-S", "0.0.0.0:8082", "-t", "public"]
