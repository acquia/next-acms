import { NextApiRequest, NextApiResponse } from 'next';

export async function get(
  request: NextApiRequest,
  response: NextApiResponse,
  url: URL,
) {
  try {
    // Fetch from Drupal.
    const result = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    response.status(200);
    return response.end(JSON.stringify(result));
    // return result;
    // response.end();
    // console.log('RESULT', await result.json());
    // const json = await result.json();
    // console.log('RESPONSE', response.end.toString());
    // return result;
  } catch (error) {
    response.json(error);
    response.status(405).end();
  }
}
