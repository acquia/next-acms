import { DrupalClient } from 'next-drupal';

export const drupal = new DrupalClient(
  process.env.NEXT_PUBLIC_DRUPAL_BASE_URL,
  {
    previewSecret: process.env.DRUPAL_PREVIEW_SECRET,
    auth: {
      clientId: process.env.DRUPAL_CLIENT_ID,
      clientSecret: process.env.DRUPAL_CLIENT_SECRET,
    },
    withAuth: true,
  },
);
