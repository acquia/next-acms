import { NextApiRequest, NextApiResponse } from 'next';
import { drupal } from '../../../src/drupal';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  try {
    const url = drupal.buildUrl(
      `/webform_rest/${request.query.id}/fields?_format=json`,
    );
    const result = await fetch(url.toString());
    const webform = await result.json();
    response.status(200).json(webform);
  } catch (e) {
    console.log(e.message);
  }
}
