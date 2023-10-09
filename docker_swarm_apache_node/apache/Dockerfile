FROM php:apache-bullseye

RUN docker-php-ext-install mysqli

COPY index.php /var/www/html/

EXPOSE 80

CMD [ "apache2-foreground"]


