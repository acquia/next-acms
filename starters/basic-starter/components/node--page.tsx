import { FormattedText } from 'components/formatted-text';
import { MediaImage } from 'components/media--image';

export function NodeBasicPage({ node, ...props }) {
  return (
    <article className="max-w-2xl px-6 py-10 mx-auto" {...props}>
      {node.field_page_image && (
        <div className="my-6 overflow-hidden rounded-md">
          <MediaImage
            media={node.field_page_image}
            priority
            sizes="(min-width: 768px) 625px, 100vw"
          />
        </div>
      )}
      <h1 className="mb-4 text-3xl font-black leading-tight md:text-4xl">
        {node.title}
      </h1>
      {node.body?.processed && (
        <div className="prose">
          <FormattedText processed={node.body.processed} />
        </div>
      )}
    </article>
  );
}
