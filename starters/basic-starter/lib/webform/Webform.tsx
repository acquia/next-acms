import React, { useState } from 'react';
import { WebformProps } from './types';
import {formToJSON, renderWebformElement, styles} from './utils';

export class WebformError extends Error {
  response: any;

  constructor(response: any) {
    super();

    this.response = response;
  }
}

/**
 * Errors returned by Drupal.
 */
type WebformErrors = {
  [name: string]: string;
};

export const Webform = ({
  webformObject,
  id,
  customComponents,
}: WebformProps) => {
  const [errors, setErrors] = useState<WebformErrors>({});
  console.log('webform object', webformObject);
  const submitHandler = async (event) => {
    event.preventDefault();
    const data = formToJSON(event.target.elements);
    // Post process serialized data:
    // Some webform elements require specialized data formatting.
    for (const element in webformObject.elements) {
      if (data[element]) {
        switch (webformObject.elements[element]['#type']) {
          case 'checkbox':
            data[element] = 1;
            break;
        }
      }
    }
    const body = { ...(data as object), ...{ webform_id: id } };
    console.log('request body', body);
    const response = await fetch('/api/webform/submit', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      // Show success
    }
    const message = await response.json();
    setErrors(message.message.error);
    console.log('API response', message.message.error);
  };

  return (
    <form style={styles.form} onSubmit={(e) => submitHandler(e)}>
      {Object.values(webformObject.elements).map((el) =>
        renderWebformElement(el, customComponents, errors[el['#webform_key']]),
      )}
    </form>
  );
};
