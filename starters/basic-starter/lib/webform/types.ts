export type WebformProps = {
  webform: object;
  id: string;
};

export type WebformElementProps = {
  // probably will need to break this up
  el: object;
};

// Create WebformObject type

// Create WebformElement type
export type WebformElement = {
  // might need more later
  title: string;
  type: string;
  webform_key: string;
  submit_label?: string;
  options?: object;
};
