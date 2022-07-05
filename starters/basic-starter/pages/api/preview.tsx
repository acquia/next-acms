import { drupal } from 'lib/drupal';

// API route for handling preview mode.
// See https://nextjs.org/docs/advanced-features/preview-mode#step-1-create-and-access-a-preview-api-route.
export default async function handler(request, response) {
  return await drupal.preview(request, response);
}
