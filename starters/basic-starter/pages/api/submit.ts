import { NextApiRequest, NextApiResponse } from 'next';
import { submit } from 'next-acms';
import { drupal } from '../../lib/drupal';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const url = drupal.buildUrl(request.query.endpoint.toString());
  return submit(request, response, url);
}
