import Document, { DocumentContext, DocumentInitialProps } from 'next/document';
import { ENTITY_TYPES } from './[...slug]';
import { drupal } from '../lib/drupal';
import { testApiCompatibility } from 'next-acms';

class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext,
  ): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx);
    await testApiCompatibility(ENTITY_TYPES, drupal);
    return initialProps;
  }
}

export default MyDocument;
