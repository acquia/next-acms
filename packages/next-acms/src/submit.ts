import { NextApiRequest, NextApiResponse } from 'next';
import { DrupalClient } from 'next-drupal';

export async function submit(
  request: NextApiRequest,
  response: NextApiResponse,
  drupal: DrupalClient,
) {
  if (request.method === 'POST') {
    const url = drupal.buildUrl(request.query.endpoint.toString());
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
    response.end(JSON.stringify(result));
    response.status(200);
  }
}
