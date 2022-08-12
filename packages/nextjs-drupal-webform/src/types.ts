import React from 'react';

export const DEFAULT_SUBMIT_LABEL = 'Submit';

export type WebformCustomComponentProps = {
  element: WebformElement;
  error?: string;
};

/**
 * Custom component for webform element
 */
export type WebformCustomComponent = React.FC<WebformCustomComponentProps>;

export type CustomComponentLibrary = {
  // name should be the webform element type.
  [name: string]: WebformCustomComponent;
};

export type WebformProps = {
  id?: string;
  webformObject: WebformObject;
  customComponents?: CustomComponentLibrary;
};

export type WebformObject = {
  drupal_internal__id: string;
  description: string;
  status: string;
  elements: WebformElement[];
};

export type WebformElement = {
  // might need more later
  '#title': string;
  '#type': string;
  '#webform_key': string;
  '#submit__label'?: string;
  '#options'?: object;
  '#description': string;
  '#required'?: boolean;
  // checkbox or radio
  type: string;
};
