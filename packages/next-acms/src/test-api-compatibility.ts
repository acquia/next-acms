import { DrupalClient } from 'next-drupal';

export async function testApiCompatibility(
  contentTypes: Array<string>,
  drupal: DrupalClient,
) {
  let index;
  try {
    index = await drupal.getIndex();
  } catch (e) {
    throw new Error(
      e.message +
        '\n\n' +
        'Failed to connect to the backend. See here for documentation about common reasons: \nhttps://github.com/acquia/next-acms/wiki/Debugging-common-errors-with-Next.js-and-Drupal-integration#incompatible-web-server-setup-or-incorrect-environment-variables-generated',
    );
  }
  for (const type of contentTypes) {
    if (!Object.keys(index.links).includes(type)) {
      throw new Error(
        `Content type ${type} does not exist in the backend. \nSee here for documentation on content model mismatch: https://github.com/acquia/next-acms/wiki/Debugging-common-errors-with-Next.js-and-Drupal-integration#content-model-mismatch`,
      );
    }
  }
}
