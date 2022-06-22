import { NextApiRequest, NextApiResponse } from 'next';
import { revalidate } from 'next-acms';

// API route for on-demand revalidation.
// See https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration#on-demand-revalidation-beta.
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  return revalidate(request, response);
}
