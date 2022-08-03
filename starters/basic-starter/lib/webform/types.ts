export type WebformProps = {
  webformObject: WebformObject;
  id: string;
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
