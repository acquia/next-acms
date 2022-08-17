<?php

// These settings are copied to `settings.local.php` in the Acquia CMS
// container used in our CI workflow.

// This information needs to match the `database` service defined in our CI
// configuration. See `.github/workflows/ci.yml`.
$databases['default']['default'] = [
  'driver' => 'mysql',
  'host' => 'database',
  'username' => 'drupal',
  'password' => 'drupal',
  'database' => 'drupal',
  'port' => 3306,
];
