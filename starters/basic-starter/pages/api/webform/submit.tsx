import { NextApiRequest, NextApiResponse } from 'next';
import { drupal } from '../../../lib/drupal';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === 'POST') {
    const url = drupal.buildUrl('/webform_rest/submit?_format=json');
    // Submit to Drupal.
    const result = await fetch(url.toString(), {
      method: 'POST',
      body: JSON.stringify(request.body),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!result.ok) {
      const message = await result.json();
      // Send error to client.
      return response.status(result.status).json({ message });
    }
    return response.status(200);
  }
}
