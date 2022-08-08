FROM drupal:9-apache

# Install additional system dependencies needed to install Composer
# dependencies and compile the intl PHP extension, which is required
# by one of Acquia CMS's indirect dependencies.
RUN apt-get update
RUN apt-get install -y git libicu-dev unzip
RUN docker-php-ext-install intl

# Destroy the Drupal installation that ships with the base image.
RUN rm -rf /opt/drupal

# Adjust PHP settings as needed to install Acquia CMS.
COPY drupal.ini /usr/local/etc/php/conf.d

# Everything we're about to do should be owned by the Apache user
# and group.
USER www-data:www-data

# There's no home directory for www-data in which Composer can store
# its cache data and whatnot, so use the system temporary directory
# instead.
ENV COMPOSER_HOME=/tmp/.composer

# Don't install Composer dependencies yet; we need to make a few
# adjustments first.
RUN composer create-project --no-install acquia/drupal-recommended-project /opt/drupal

WORKDIR /opt/drupal

# The drupal:9-apache base container uses `web` as its document root.
RUN sed -i -e 's!docroot!web!g' composer.json

# Require specific constraints for certain dependencies to prevent
# Composer from installing known broken versions.
RUN composer require drupal/acquia_cms_common:^1.4 drupal/acquia_cms_starter drupal/acquia_cms_article:^1.3.5 drupal/acquia_cms_event:^1.3.5 drupal/acquia_cms_place:^1.3.5 drupal/acquia_cms_person:^1.3.5 drupal/acquia_cms_page:^1.3.5

# This CACHE_DATE argument disables the Docker build cache from here on
# out. Since we need to regenerate the database dump, we always want to 
# reinstall Acquia CMS and its demo content.
ARG CACHE_DATE=not_a_date
RUN DRUSH_COMMAND_SITE_INSTALL_OPTIONS_DB_URL=mysql://drupal:drupal@host.docker.internal:3306/drupal DRUSH_COMMAND_SITE_INSTALL_OPTIONS_ACCOUNT_PASS=admin ./vendor/bin/acms acms:install --no-interaction acquia_cms_headless
RUN drush pm:enable --yes acquia_cms_starter

# Ensure that consumers can override Drupal settings to suit their needs.
RUN chmod +w ./web/sites/default
RUN chmod +w ./web/sites/default/settings.php
RUN echo '@include __DIR__ . "/settings.local.php";' >> ./web/sites/default/settings.php
