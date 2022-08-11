import Link from 'next/link';

import { MediaImage } from 'components/media--image';
import { FormattedText } from 'components/formatted-text';

export function NodePlace({ node, ...props }) {
  return (
    <article {...props}>
      <div className="grid items-start w-full max-w-4xl gap-10 px-6 pt-12 mx-auto md:grid-cols-2">
        {node.field_place_image && (
          <Link href={node.path.alias} passHref>
            <a className="block overflow-hidden no-underline rounded-md">
              <MediaImage
                media={node.field_place_image}
                priority
                sizes="(min-width: 968px) 405px, (min-width: 768px) 50vw, 100vw"
              />
            </a>
          </Link>
        )}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{node.title}</h1>
          {node.field_place_address && (
            <div>
              {node.field_place_address.address_line1}
              <br />
              {node.field_place_address.locality},{' '}
              {node.field_place_address.administrative_area}{' '}
              {node.field_place_address.postal_code}
            </div>
          )}
          {node.field_place_telephone && <p>{node.field_place_telephone}</p>}
        </div>
      </div>

      <div className="max-w-2xl px-6 py-10 mx-auto">
        {node.body?.processed && (
          <div className="prose">
            <FormattedText processed={node.body.processed} />
          </div>
        )}
      </div>
    </article>
  );
}

export function NodePlaceTeaser({ node, ...props }) {
  return (
    <article
      className="items-start w-full grid-cols-2 gap-10 mx-auto space-y-4 md:space-y-0 md:grid"
      {...props}
    >
      {node.field_place_image && (
        <Link href={node.path.alias} passHref>
          <a className="block overflow-hidden no-underline rounded-md">
            <MediaImage
              media={node.field_place_image}
              priority
              sizes="(min-width: 968px) 425px, (min-width: 768px) 50vw, 100vw"
            />
          </a>
        </Link>
      )}
      <div className="space-y-4">
        <Link href={node.path.alias} passHref>
          <a className="no-underline hover:text-blue-600">
            <h2 className="text-3xl font-bold">{node.title}</h2>
          </a>
        </Link>
        {node.field_place_address && (
          <div>
            {node.field_place_address.address_line1}
            <br />
            {node.field_place_address.locality},{' '}
            {node.field_place_address.administrative_area}{' '}
            {node.field_place_address.postal_code}
          </div>
        )}
        {node.field_place_telephone && <p>{node.field_place_telephone}</p>}
      </div>
    </article>
  );
}
