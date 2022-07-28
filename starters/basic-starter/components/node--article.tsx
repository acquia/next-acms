import Link from 'next/link';

import { formatDate } from 'lib/format-date';
import { MediaImage } from 'components/media--image';
import { FormattedText } from 'components/formatted-text';

const styles = {
  btn: {
    backgroundColor: 'rgb(14 165 233)',
    color: 'white',
    border: 'none',
    padding: '12px 16px',
    textDecoration: 'none',
    display: 'inlineBlock',
    fontSize: '16px',
    borderRadius: '8px',
  },
};

function renderWebformElement(el) {
  switch (el['#type']) {
    case 'textfield':
    case 'tel':
    case 'number':
    case 'email':
    case 'hidden':
      return (
        <input
          placeholder={el['#title']}
          id={el['#webform_key']}
          name={el['#webform_key']}
        />
      );
    case 'textarea':
      return (
        <textarea
          placeholder={el['#title']}
          id={el['#webform_key']}
          name={el['#webform_key']}
        />
      );
    case 'checkbox':
      return (
        <div>
          <input
            type="checkbox"
            id={el['#webform_key']}
            name={el['#webform_key']}
          />
          <label className="form-check-label">{el['#description']}</label>
        </div>
      );
    case 'radio':
      return (
        <input type="radio" id={el['#webform_key']} name={el['#webform_key']} />
      );
    case 'checkboxes':
      return (
        <div id={el['#webform_key']}>
          {el['#options'] &&
            Object.keys(el['#options']).map((option) => (
              <>
                <input
                  type="checkbox"
                  name={el['#webform_key']}
                  id={option}
                  value={option}
                />
                <label className="form-check-label">{option}</label>
              </>
            ))}
        </div>
      );
    case 'radios':
      console.log(el['#options']);
      return (
        el['#options'] &&
        Object.keys(el['#options']).map((option) => (
          <div className="form-check" key={option}>
            <input
              type="radio"
              name={el['#webform_key']}
              id={option}
              value={option}
            />
            <label className="form-check-label">{option}</label>
          </div>
        ))
      );
    case 'select':
      return '';
    case 'webform_markup':
    case 'processed_text':
      return '';
    case 'webform_actions':
      return (
        <button type="submit" style={styles.btn}>
          {el['#submit__label']}
        </button>
      );
    default:
      return;
  }
}

export function NodeArticle({ node, additionalContent, ...props }) {
  console.log('additionalContent', additionalContent);
  async function handleSubmit(event, webform_id) {
    console.log('e', event.target);
    const body = {};
    // JSON format for checkboxes, checkbox, radio buttons
    // {
    //   "webform_id": "application",
    //   "checkbox_test": false,
    //   "food": "banana",
    //   "checkboxes": ["cat", "dog"]
    // }
    //todo: Create formToJSON(event.target.elements) function;
    body['webform_id'] = webform_id;
    for (const el of event.target) {
      body[el.name] = el.value;
      // console.log('el', el);
      // if (el.checked) {
      //   body[el.name] = 1;
      // } else if (el.checked === false) {
      //   body[el.name] = 0;
      // } else {
      //   body[el.name] = el.value;
      // }
    }
    event.preventDefault();
    console.log(body);
    const response = await fetch('/api/submit-form', {
      method: 'POST',
      body: JSON.stringify(body),
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
      {additionalContent.webform
        ? Object.keys(additionalContent.webform).map((key) => {
            return (
              <form key={key} onSubmit={(e) => handleSubmit(e, key)}>
                {Object.values(additionalContent.webform[key]).map((el) =>
                  renderWebformElement(el),
                )}
                <br></br>
                <br></br>
              </form>
            );
          })
        : null}
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
