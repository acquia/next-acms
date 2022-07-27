import { NextApiRequest, NextApiResponse } from 'next';
import { drupal } from '../../lib/drupal';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  try {
    if (request.method === 'POST') {
      const url = drupal.buildUrl('/webform_rest/submit?_format=json');
      console.log('received body', request.body);
      // Submit to Drupal.
      const result = await fetch(url.toString(), {
        method: 'POST',
        body: JSON.stringify({
          webform_id: 'contact',
          name: request.body.name,
          email: request.body.email,
          subject: request.body.subject,
          message: request.body.message,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!result.ok) {
        console.error(result.json());
        throw new Error();
      }

      response.status(200).end();
    }
  } catch (error) {
    return response.status(400).json(error.message);
  }
}
