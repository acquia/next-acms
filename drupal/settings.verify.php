<?php

// This file is only used by `verify.sh` to import the database and confirm
// that the container is running correctly.

$databases['default']['default'] = [
  'driver' => 'sqlite',
  'database' => 'db.sqlite',
];
