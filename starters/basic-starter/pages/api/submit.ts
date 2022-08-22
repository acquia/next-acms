import { NextApiRequest, NextApiResponse } from 'next';
import { drupal } from '../../lib/drupal';
import { submit } from 'next-acms';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  return submit(request, response, drupal);
}
