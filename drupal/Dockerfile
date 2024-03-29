FROM drupal:9-apache

###
#
# This will build an Acquia CMS Headless image, including a dump of the
# Next.js environment variables and the database (which are tightly
# coupled together.)
#
# The build requires that a MySQL server be available. By default, it tries
# to connect to `host.docker.internal:3306` as `root`, with no password,
# and access an empty database called `drupal`. You can pass the MYSQL_HOST,
# MYSQL_USER, MYSQL_PASSWORD, and MYSQL_DATABASE arguments to override this.
#
# An example command to build the image without tagging it:
#
# docker build --network host --build-arg CACHE_DATE=$(date +%Y-%m-%d:%H:%M:%S) .
#
# You can see the built image listed by `docker image ls`.
#
# To build it and tag it as `phenaproxima/acquia_cms:headless` so you can push
# it to Docker Hub:
#
# docker build --network host --build-arg CACHE_DATE=$(date +%Y-%m-%d:%H:%M:%S) --tag phenaproxima/acquia_cms:headless .
#
# To start the container and make it listen on port 8080:
#
# docker run -d -p 8080:80 --name drupal IMAGE_TAG_OR_ID
#
# You can replace the name `drupal` with any name you want, or let Docker
# automatically generate one (use `docker ps` to get the generated name). If
# you want the container to automatically remove itself when you stop it
# (useful for testing), add the `--rm` flag before the image tag or ID.
# `docker stop CONTAINER_NAME_OR_ID` will stop the container.
#
# By default, the container will use SQLite as its database backend. You can
# override that by defining its credentials in a `settings.local.php` file,
# copying it into the running container, and re-importing the database dump
# like so:
#
# docker cp settings.local.php CONTAINER_NAME_OR_ID:/opt/drupal/web/sites/default
# docker exec -it CONTAINER_NAME_OR_ID ./import-db
#
# Once this is done, you should be able to visit http://127.0.0.1:8080 and see
# the running Drupal site!
#
# To retrieve the .env file containing the Next.js environment variables, use
# this command:
#
# docker cp CONTAINER_NAME_OR_ID:/opt/drupal/.env .
###

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
RUN composer create-project --no-install acquia/drupal-recommended-project /opt/drupal --no-cache

WORKDIR /opt/drupal
COPY import-db settings.php.cat /opt/drupal

# The drupal:9-apache base container uses `web` as its document root.
RUN sed -i -e 's!docroot!web!g' composer.json

# This can be also used for requiring specific constraints for dependencies that
# have incompatible releases.
RUN composer require drupal/acquia_cms_starter

# Allow the caller to specify MySQL connection information. This will be
# written to settings.php, but can overridden at runtime by providing a
# `sites/default/settings.local.php`.
ARG CACHE_DATE=not_a_date
ARG MYSQL_HOST=host.docker.internal:3306
ARG MYSQL_USER=root
ARG MYSQL_PASSWORD
ARG MYSQL_DATABASE=drupal
# This CACHE_DATE argument disables the Docker build cache from here on
# out. Since we need to regenerate the database dump, we always want to
# reinstall Acquia CMS and its demo content.
RUN DRUSH_COMMAND_SITE_INSTALL_OPTIONS_DB_URL=mysql://$MYSQL_USER:$MYSQL_PASSWORD@$MYSQL_HOST/$MYSQL_DATABASE DRUSH_COMMAND_SITE_INSTALL_OPTIONS_ACCOUNT_PASS=admin acms acms:install --no-interaction acquia_cms_headless
RUN drush pm:enable --yes acquia_cms_starter

# Ensure that consumers can override Drupal settings to suit their needs.
RUN chmod +w ./web/sites/default
RUN chmod +w ./web/sites/default/settings.php

# Initialize the Next.js site and dump the generated credentials into a .env file.
COPY init-env.php /opt/drupal
RUN drush php:script init-env.php > .env

# Dump the database.
RUN php ./web/core/scripts/db-tools.php dump-database-d8-mysql > database.php
RUN gzip database.php

# Switch the database backend to SQLite and re-import the database.
RUN cat settings.php.cat >> ./web/sites/default/settings.php
RUN ./import-db
