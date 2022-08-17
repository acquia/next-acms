#!/bin/sh

set -e

docker run --detach --publish 8080:80 --name drupal --rm phenaproxima/acquia_cms:headless
docker cp settings.verify.php drupal:/opt/drupal/web/sites/default/settings.local.php
docker exec --interactive --tty --workdir /opt/drupal/web drupal php ./core/scripts/db-tools.php import ../database.php.gz
curl --fail --silent http://127.0.0.1:8080/jsonapi
docker stop drupal
