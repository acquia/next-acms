import { NextApiRequest, NextApiResponse } from 'next';
import { drupal } from '../../lib/drupal';
import { get } from 'next-acms';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  console.log('REACH?');
  console.log(request.query);
  const url = drupal.buildUrl(request.query.endpoint.toString());
  return await get(request, response, url);
}
