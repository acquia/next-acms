import { NextApiResponse } from 'next';

// API route for clearing preview mode cookies.
// See https://nextjs.org/docs/advanced-features/preview-mode#clear-the-preview-mode-cookies.
export default async function exit(_, response: NextApiResponse) {
  response.clearPreviewData();
  response.writeHead(307, { Location: '/' });
  response.end();
}
