import { DrupalClient } from 'next-drupal';

export const drupalNoAuth = new DrupalClient(
  process.env.NEXT_PUBLIC_DRUPAL_BASE_URL,
  {
    previewSecret: process.env.DRUPAL_PREVIEW_SECRET,
    withAuth: false,
  },
);
