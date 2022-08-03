import React from 'react';
import { WebformProps } from './types';
import { handleSubmit, renderWebformElement } from './utils';

export const Webform = ({ webform, id }: WebformProps) => {
  console.log('webform object', webform);
  return (
    <form onSubmit={(e) => handleSubmit(e, id, webform)}>
      {Object.values(webform).map((el) => renderWebformElement(el))}
    </form>
  );
};
