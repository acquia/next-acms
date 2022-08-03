import React from 'react';

export type WebformCustomComponentProps = {
  element: WebformElement;
  error?: string;
};

/**
 * Custom component for webform element
 */
export type WebformCustomComponent = React.FC<WebformCustomComponentProps>;

type CustomComponentLibrary = {
  [name: string]: WebformCustomComponent;
};

// @todo: Remove ID
export type WebformProps = {
  webformObject: WebformObject;
  id: string;
  customComponents: CustomComponentLibrary;
};

export type WebformObject = {
  drupal_internal__id: string;
  description: string;
  status: string;
  elements: WebformElement[];
};

export type WebformElement = {
  // might need more later
  title: string;
  type: string;
  webform_key: string;
  submit_label?: string;
  options?: object;
};
