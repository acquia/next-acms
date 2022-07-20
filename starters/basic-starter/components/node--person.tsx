import Link from 'next/link';

import { MediaImage } from 'components/media--image';
import { FormattedText } from 'components/formatted-text';

export function NodePerson({ node, ...props }) {
  return (
    <article className="max-w-2xl px-6 py-10 mx-auto" {...props}>
      <div className="grid items-center justify-center gap-4 text-center md:text-left md:grid-cols-2">
        {node.field_person_image && (
          <div className="block w-48 h-48 overflow-hidden no-underline rounded-full">
            <MediaImage
              media={node.field_person_image}
              priority
              sizes="192px"
            />
          </div>
        )}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{node.title}</h1>
          {node.field_job_title && (
            <p className="text-xl text-gray-600">{node.field_job_title}</p>
          )}
        </div>
      </div>
      {node.body?.processed && (
        <div className="py-10 prose">
          <FormattedText processed={node.body.processed} />
        </div>
      )}
    </article>
  );
}

export function NodePersonTeaser({ node, ...props }) {
  return (
    <article
      className="flex flex-col items-center space-y-4 text-center"
      {...props}
    >
      {node.field_person_image && (
        <Link href={node.path.alias} passHref>
          <a className="block w-32 h-32 overflow-hidden no-underline rounded-full">
            <MediaImage
              media={node.field_person_image}
              priority
              sizes="128px"
            />
          </a>
        </Link>
      )}
      <div className="space-y-2">
        <Link href={node.path.alias} passHref>
          <a className="no-underline hover:text-blue-600">
            <h2 className="text-xl">{node.title}</h2>
          </a>
        </Link>
        {node.field_job_title && (
          <p className="text-gray-600">{node.field_job_title}</p>
        )}
      </div>
    </article>
  );
}
