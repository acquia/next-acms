import Link from 'next/link';

import { formatDate } from 'lib/format-date';
import { MediaImage } from 'components/media--image';
import { FormattedText } from 'components/formatted-text';

export function NodeArticle({ node, additionalContent, ...props }) {
  async function handleSubmit(event) {
    event.preventDefault();
    const response = await fetch('/api/submit-form', {
      method: 'POST',
      body: JSON.stringify({
        name: event.target.name.value,
        email: event.target.email.value,
        subject: event.target.subject.value,
        message: event.target.message.value,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      // Show success.
    }
    // Handle error.
  }
  return (
    <article className="max-w-2xl px-6 py-10 mx-auto" {...props}>
      <h1 className="mb-4 text-3xl font-black leading-tight md:text-4xl">
        {node.title}
      </h1>
      <h2>Contact</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder={additionalContent.webform.name['#title']}
          name={additionalContent.webform.name['#webform_key']}
        />
        <input
          placeholder={additionalContent.webform.email['#title']}
          name={additionalContent.webform.email['#webform_key']}
        />
        <input
          placeholder={additionalContent.webform.subject['#title']}
          name={additionalContent.webform.subject['#webform_key']}
        />
        <textarea
          placeholder={additionalContent.webform.message['#title']}
          name={additionalContent.webform.message['#webform_key']}
        />
        <button type="submit">
          {additionalContent.webform.actions['#submit__label']}
        </button>
      </form>
      <p className="mb-4 text-gray-600">
        {node.field_display_author?.title ? (
          <span>
            Posted by{' '}
            <span className="font-semibold">
              {node.field_display_author?.title}
            </span>
          </span>
        ) : null}
        {node.created && <span> on {formatDate(node.created)}</span>}
      </p>
      {node.field_article_image && (
        <div className="my-6 overflow-hidden rounded-md">
          <MediaImage
            media={node.field_article_image}
            priority
            sizes="(min-width: 768px) 625px, 100vw"
          />
        </div>
      )}
      {node.field_article_media?.length ? (
        <div className="mb-6">
          {node.field_article_media.map((media) => (
            <div key={media.id} className="overflow-hidden rounded-md">
              <MediaImage
                media={media}
                priority
                sizes="(min-width: 768px) 625px, 100vw"
              />
            </div>
          ))}
        </div>
      ) : null}
      {node.body?.processed && (
        <div className="prose">
          <FormattedText processed={node.body.processed} />
        </div>
      )}
    </article>
  );
}

export function NodeArticleTeaser({ node, ...props }) {
  return (
    <article className="flex flex-col space-y-4" {...props}>
      {node.field_article_image && (
        <Link href={node.path.alias} passHref>
          <a className="block overflow-hidden no-underline rounded-md">
            <MediaImage
              media={node.field_article_image}
              priority
              sizes="(min-width: 968px) 420px, (min-width: 768px) 50vw, 100vw"
            />
          </a>
        </Link>
      )}
      <div>
        <p className="mb-4 text-sm text-gray-500">
          {node.field_display_author?.title ? (
            <span>
              Posted by{' '}
              <span className="font-semibold">
                {node.field_display_author?.title}
              </span>
            </span>
          ) : null}
          {node.created && <span> on {formatDate(node.created)}</span>}
        </p>
        <Link href={node.path.alias} passHref>
          <a className="no-underline hover:text-blue-600">
            <h2 className="mb-4 text-xl font-bold">{node.title}</h2>
          </a>
        </Link>
        {node.body?.summary && (
          <p className="text-gray-500" data-cy="summary">
            {node.body.summary}
          </p>
        )}
      </div>
    </article>
  );
}
