<?php

/**
 * @file
 * Initializes a next.js app backend.
 *
 * This assumes that the acquia_cms_headless starter kit has been installed, but
 * not set up. This script should be invoked with:
 * `drush php:script init-env.php`, and its output can be saved directly to a
 * `.env` file.
 */

use Drupal\consumers\Entity\Consumer;
use Drupal\pathauto\Entity\PathautoPattern;
use Drupal\pathauto\PathautoState;
use Drupal\taxonomy\Entity\Term;
use Drupal\taxonomy\Entity\Vocabulary;

// Ensure every taxonomy vocabulary has a Pathauto pattern, so that tests can
// have reliable URLs to visit.
$vocabularies = Vocabulary::loadMultiple();
// Article types already have a pattern.
unset($vocabularies['article_type']);
/** @var \Drupal\taxonomy\VocabularyInterface[] $vocabulary */
foreach ($vocabularies as $id => $vocabulary) {
  /** @var \Drupal\pathauto\PathautoPatternInterface $pattern */
  $pattern = PathautoPattern::create([
    'id' => $id,
    'label' => $vocabulary->label(),
    'type' => 'canonical_entities:taxonomy_term',
  ]);
  $pattern->addSelectionCondition([
    'id' => 'entity_bundle:taxonomy_term',
    'context_mapping' => [
      'taxonomy_term' => 'taxonomy_term',
    ],
    'bundles' => [
      $id => $id,
    ],
  ]);
  $pattern->setPattern("/$id/[term:name]")->save();
}
// Regenerate the URL aliases for all taxonomy terms.
foreach (Term::loadMultiple() as $term) {
  $term->path->pathauto = PathautoState::CREATE;
  $term->save();
}

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

$site = $starter_kit->createHeadlessSite('headless', [
  'site-name' => 'Headless Site 1',
  'site-url' => 'http://localhost:3000/',
]);
$starter_kit->createHeadlessSiteEntities();

// The starter kit service sets these values, but doesn't save them. SMH.
Drupal::configFactory()
  ->getEditable('acquia_cms_headless.settings')
  ->set('consumer_uuid', $consumer->uuid())
  ->set('user_uuid', $account->uuid())
  ->save();

// We have everything we need to generate the environment variables.
$env = [
  'NEXT_PUBLIC_DRUPAL_BASE_URL' => 'http://localhost',
  'NEXT_IMAGE_DOMAIN' => 'localhost',
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
