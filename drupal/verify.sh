#!/bin/sh

docker run --detach --publish 8080:80 --name drupal --rm phenaproxima/acquia_cms:headless
if [ -f settings.local.php ]; then
  docker cp settings.local.php drupal:/opt/drupal/web/sites/default
fi

# Check if the database is connected, and if not, import the database
# dump.
docker exec --interactive --tty drupal drush status | grep -i Connected
if [ $? != 0 ]; then
  docker exec --interactive --tty --workdir /opt/drupal/web drupal php ./core/scripts/db-tools.php import ../database.php.gz
fi

if [ ! -f .env ]; then
  docker cp drupal:/opt/drupal/.env .
fi

curl --fail --silent http://127.0.0.1:8080/jsonapi
docker stop drupal
