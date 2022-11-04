import Link from 'next/link';

import { formatDate } from 'lib/format-date';
import { MediaImage } from 'components/media--image';
import { FormattedText } from 'components/formatted-text';

export function NodeEvent({ node, ...props }) {
  return (
    <article className="container px-6 py-10 mx-auto" {...props}>
      <div className="grid-cols-2 gap-10 p-4 mx-auto border rounded-md md:grid">
        {node.field_event_image && (
          <Link href={node.path.alias} passHref>
            <a className="block overflow-hidden no-underline rounded-md">
              <MediaImage
                media={node.field_event_image}
                priority
                sizes="(min-width: 968px) 410px, (min-width: 768px) 50vw, 100vw"
                imageStyle="coh_medium"
              />
            </a>
          </Link>
        )}
        <div className="mt-8">
          <div className="mb-2 space-x-2 text-sm">
            {node.field_event_duration && (
              <span className="font-medium text-gray-600">
                {formatDate(node.field_event_start)}
              </span>
            )}
            {node.field_event_duration && (
              <span className="text-gray-500">
                &middot; {node.field_event_duration}
              </span>
            )}
            {node.field_event_place && (
              <span className="text-gray-500">
                &middot; {node.field_event_place.title}
              </span>
            )}
          </div>
          <h1 className="mb-4 text-3xl font-bold">{node.title}</h1>
          {node.body?.summary && (
            <p className="text-sm text-gray-500">{node.body.summary}</p>
          )}
        </div>
      </div>
      <div className="max-w-2xl py-10 mx-auto ">
        {node.body?.processed && (
          <div className="prose">
            <FormattedText processed={node.body.processed} />
          </div>
        )}
      </div>
    </article>
  );
}

export function NodeEventTeaser({ node, ...props }) {
  return (
    <article
      className="items-start gap-10 p-4 mx-auto space-y-4 border rounded-md md:space-y-0 md:grid md:grid-cols-3"
      {...props}
    >
      {node.field_event_image && (
        <Link href={node.path.alias} passHref>
          <a className="block overflow-hidden no-underline rounded-md">
            <MediaImage
              media={node.field_event_image}
              priority
              sizes="(min-width: 768px) 140px, 100wh"
            />
          </a>
        </Link>
      )}
      <div className="col-span-2">
        <div className="mb-2 space-x-2 text-sm">
          {node.field_event_start && (
            <span className="font-medium text-gray-600">
              {formatDate(node.field_event_start)}
            </span>
          )}
          {node.field_event_duration && (
            <span className="text-gray-500">
              &middot; {node.field_event_duration}
            </span>
          )}
          {node.field_event_place && (
            <span className="text-gray-500">
              &middot; {node.field_event_place.title}
            </span>
          )}
        </div>
        <Link href={node.path.alias} passHref>
          <a className="no-underline hover:text-blue-600">
            <h2 className="mb-4 text-3xl font-bold">{node.title}</h2>
          </a>
        </Link>
        {node.body?.summary && (
          <p className="text-sm text-gray-500">{node.body.summary}</p>
        )}
      </div>
    </article>
  );
}
