<?php

// These settings are copied to `settings.local.php` in the Acquia CMS
// container used in our CI workflow.

$database = &$databases['default']['default'];
// This information needs to match the `database` service defined in our CI
// configuration. See `.github/workflows/ci.yml`.
$database['host'] = 'database';
$database['user'] = 'drupal';
$database['password'] = 'drupal';
$database['database'] = 'drupal';
$database['port'] = 3306;
