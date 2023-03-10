import * as React from 'react';
import {
  components,
  resolveWebformContent,
  Webform,
} from 'nextjs-drupal-webform';
import { drupal } from '../lib/drupal';
import withCustomStyles from '../components/withCustomStyles';
import classNames from 'classnames';
import WebformButton from '../components/WebformButton';

const labelProps = {
  className: classNames([
    'block',
    'text-gray-700',
    'text-sm',
    'font-bold',
    'mb-2',
  ]),
};
const fieldProps = {
  className: classNames([
    'form-input',
    'shadow',
    'appearance-none',
    'border',
    'rounded',
    'w-full',
    'py-2',
    'px-3',
    'text-gray-700',
    'leading-tight',
    'focus:outline-none',
    'focus:shadow-outline',
  ]),
};
const wrapperProps = {
  className: classNames(['space-y-3']),
};

export default function WebformExample({ webform, id }) {
  return (
    <div className="container px-6 pb-10 mx-auto">
      <title>Webform Example</title>
      <div className="container max-w-2xl px-6 py-10 mx-auto">
        <article className="prose lg:prose-xl">
          <h1 className="text-sky-500">Next.js for Acquia CMS</h1>
          <h2 className="text-gray-600">Webform Example</h2>
          <p>
            This example uses the{' '}
            <a href="https://www.drupal.org/project/next_webform">
              Next.js Webform
            </a>{' '}
            library to render and submit forms built using the Drupal Webform
            module.
          </p>
        </article>
        <Webform
          id={id}
          data={webform}
          className="space-y-6"
          customComponents={{
            textfield: withCustomStyles(
              components.textfield,
              fieldProps,
              labelProps,
              wrapperProps,
            ),
            select: withCustomStyles(
              components.select,
              fieldProps,
              labelProps,
              wrapperProps,
            ),
            textarea: withCustomStyles(
              components.textarea,
              fieldProps,
              labelProps,
              wrapperProps,
            ),
            webform_actions: withCustomStyles(
              components.webform_actions,
              {},
              {},
              { className: classNames('my-4', 'space-x-4') },
            ),
            button: withCustomStyles(WebformButton, {
              className: classNames(
                'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow',
              ),
            }),
            email: withCustomStyles(
              components.email,
              fieldProps,
              labelProps,
              wrapperProps,
            ),
          }}
        />
      </div>
    </div>
  );
}

export async function getStaticProps(context) {
  const webform = await resolveWebformContent('contact', drupal);

  return {
    props: {
      webform,
      id: 'contact',
    },
    revalidate: 1,
  };
}
