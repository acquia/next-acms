FROM drupal:9-apache

RUN apt-get update
RUN apt-get install -y git libicu-dev unzip
RUN docker-php-ext-install intl

RUN rm -rf /opt/drupal
COPY drupal.ini /usr/local/etc/php/conf.d

USER www-data:www-data
ENV COMPOSER_HOME=/tmp/.composer
RUN composer create-project --no-install acquia/drupal-recommended-project /opt/drupal
WORKDIR /opt/drupal
RUN sed -i -e 's!docroot!web!g' composer.json
RUN composer require drupal/acquia_cms_common:^1.4 drupal/acquia_cms_starter
RUN DRUSH_COMMAND_SITE_INSTALL_OPTIONS_DB_URL=mysql://drupal:drupal@host.docker.internal:3306/drupal DRUSH_COMMAND_SITE_INSTALL_OPTIONS_ACCOUNT_PASS=admin ./vendor/bin/acms acms:install --no-interaction acquia_cms_headless
RUN drush pm:enable --yes acquia_cms_starter

RUN chmod +w ./web/sites/default
RUN chmod +w ./web/sites/default/settings.php
RUN echo '@include __DIR__ . "/settings.local.php";' > ./web/sites/default/settings.php
