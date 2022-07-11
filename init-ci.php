<?php

/**
 * @file
 * Initializes a next.js app backend.
 *
 * This assumes that the acquia_cms_headless starter kit has been installed, but
 * not set up.
 */

use Drupal\consumers\Entity\Consumer;

/** @var \Drupal\acquia_cms_headless\Service\StarterkitNextjsService $starter_kit */
$starter_kit = Drupal::service('acquia_cms_headless.starterkit_nextjs');

// Ensure we have a user account that can access Drupal data headlessly.
$starter_kit->createHeadlessUser();
$accounts = Drupal::entityTypeManager()
  ->getStorage('user')
  ->loadByProperties(['name' => 'Headless']);

if (empty($accounts)) {
  throw new \Exception("The Headless user does not appear to exist.");
}
$account = reset($accounts);

$starter_kit->generateOauthKeys();

// Find the default consumer and make it not-the-default.
$starter_kit->updateDefaultConsumer(FALSE);

// Create the headless consumer.
$secret = $starter_kit->createHeadlessSecret();
$consumer = Consumer::create();
$consumer->set('label', 'Headless Site 1');
$consumer->set('secret', $secret);
$consumer->set('description', 'This client was created for the next-acms CI process.');
$consumer->set('is_default', TRUE);
$consumer->set('redirect', 'http://localhost:3000');
$consumer->set('roles', 'headless');
$consumer->set('user_id', $account->id());
$consumer->save();

$site = $starter_kit->createHeadlessSite();
$starter_kit->createHeadlessSiteEntities();

// The starter kit service sets these values, but doesn't save them. SMH.
Drupal::configFactory()
  ->getEditable('acquia_cms_headless.settings')
  ->set('consumer_uuid', $consumer->uuid())
  ->set('user_uuid', $account->uuid())
  ->save();

// We have everything we need to generate the environment variables.
$env = [
  'NEXT_PUBLIC_DRUPAL_BASE_URL' => 'http://127.0.0.1:8080',
  'NEXT_IMAGE_DOMAIN' => '127.0.0.1:8080',
  'DRUPAL_SITE_ID' => $site->id(),
  'DRUPAL_FRONT_PAGE' => Drupal::config('system.site')->get('page.front'),
  'DRUPAL_PREVIEW_SECRET' => $site->getPreviewSecret(),
  'DRUPAL_CLIENT_ID' => $consumer->uuid(),
  'DRUPAL_CLIENT_SECRET' => $secret,
];
foreach ($env as $key => $value) {
  $env[$key] = "$key=$value";
}
echo implode("\n", $env);
