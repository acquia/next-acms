import { NextApiRequest, NextApiResponse } from 'next';

export async function submit(
  request: NextApiRequest,
  response: NextApiResponse,
  url: URL,
) {
  if (request.method === 'POST') {
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
