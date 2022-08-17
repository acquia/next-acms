#!/bin/sh
#
# Starts the Acquia CMS site in an ephemeral container and confirms that it's
# serving JSON:API data.
#
docker run --detach --publish 8080:80 --name drupal --rm phenaproxima/acquia_cms:headless
sleep 2
curl --fail --silent http://127.0.0.1:8080/jsonapi
docker stop drupal
