#!/bin/bash

# Builds a container image with a fully installed Acquia CMS Headless site. The
# Next.js site is initialized and its environment variables are exported to
# .env, and the database (without any cache data) is dumped as a compressed,
# backend-agnostic PHP file to database.php.gz.

# Start an ephemeral MySQL container to install the Drupal database, since only
# MySQL databases can be dumped in a backend-agnostic format.
docker run --publish 3306:3306 --detach --name build_database --env MYSQL_ROOT_PASSWORD=root --env MYSQL_DATABASE=drupal --env MYSQL_PASSWORD=drupal --env MYSQL_USER=drupal --rm mysql:5.7

# Build the image, which will install Acquia CMS Headless. Allow access to the
# host networking stack so that the MySQL container can be contacted.
docker build --no-cache --tag phenaproxima/acquia_cms:headless --network host .

# Run the built image in an ephemeral container to extract the .env file and
# database dump.
docker run --detach --name build_drupal --rm phenaproxima/acquia_cms:headless

docker cp init-env.php build_drupal:/opt/drupal
docker exec build_drupal drush php:script init-env.php > .env
docker exec build_drupal php ./web/core/scripts/db-tools.php dump-database-d8-mysql | gzip -9 > database.php.gz

# Stop the ephemeral containers, which will also destroy them.
docker stop build_database build_drupal
