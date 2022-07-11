<?php

/**
 * @file
 * Initializes a next.js app backend.
 *
 * This assumes that the acquia_cms_headless starter kit has been installed, but
 * not set up.
 */

use Drupal\consumers\Entity\Consumer;
use Drupal\Core\File\FileSystemInterface;
use Drupal\next\Entity\NextSite;
use Drupal\user\Entity\User;

// Create a user account to access Drupal data headlessly.
/** @var \Drupal\user\UserInterface $account */
$account = User::create()
  ->enforceIsNew()
  // Security is very important to us.
  ->setPassword('Password')
  ->setEmail('no-reply@example.com')
  ->setUsername('Headless')
  // We probably don't need any of this stuff.
  ->set('langcode', 'en')
  ->set('timezone', '')
  ->set('init', 'no-reply@example.com')
  ->set('preferred_langcode', 'en')
  ->activate();
$account->addRole('headless');
$account->save();

// Generate OAuth keys.
$dir = getcwd() . '/oauth_keys/sites/default';
Drupal::service('file_system')->prepareDirectory($dir, FileSystemInterface::CREATE_DIRECTORY);
Drupal::service('simple_oauth.key.generator')->generateKeys($dir);
Drupal::configFactory()
  ->getEditable('simple_oauth.settings')
  ->set('public_key', "$dir/public.key")
  ->set('private_key', "$dir/private.key")
  ->save();

// Find the default consumer and make it not-the-default.
/** @var \Drupal\consumers\Entity\Consumer[] $consumers */
$consumers = Drupal::entityTypeManager()
  ->getStorage('consumer')
  ->loadByProperties(['label' => 'Default Consumer']);

if (empty($consumers)) {
  throw new \Exception("The default consumer doesn't exist, bruh.");
}
reset($consumers)->set('is_default', FALSE)->save();

// Create the headless consumer.
$secret = Drupal::service('password_generator')->generate(21);

$consumer = Consumer::create();
$consumer->set('label', 'Headless Site 1');
$consumer->set('secret', $secret);
$consumer->set('description', 'This client was created for the next-acms CI process.');
$consumer->set('is_default', TRUE);
$consumer->set('redirect', 'http://localhost:3000');
$consumer->set('roles', 'headless');
$consumer->set('user_id', $account->id());
$consumer->save();

// Create the next.js site entity.
$site = NextSite::create([
  'id' => 'headless',
  'label' => 'Headless Site 1',
  'base_url' => 'http://localhost:3000/',
  'preview_url' => 'http://localhost:3000/api/preview/',
  'preview_secret' => Drupal::service('password_generator')->generate(21),
]);
$site->save();

Drupal::service('acquia_cms_headless.starterkit_nextjs')
  ->createHeadlessSiteEntities();

Drupal::configFactory()
  ->getEditable('acquia_cms_headless.settings')
  ->set('consumer_uuid', $consumer->uuid())
  ->set('user_uuid', $account->uuid())
  ->save();

// We have everything we need to write the contents of .env.local.
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
file_put_contents('.env.local', implode("\n", $env));
