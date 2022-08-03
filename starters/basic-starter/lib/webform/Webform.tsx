import React from 'react';
import { WebformProps } from './types';
import { handleSubmit, renderWebformElement } from './utils';

export const Webform = ({
  webformObject,
  id,
  customComponents,
}: WebformProps) => {
  console.log('webform object', webformObject);
  return (
    <form onSubmit={(e) => handleSubmit(e, id, webformObject)}>
      {Object.values(webformObject.elements).map((el) =>
        renderWebformElement(el, customComponents),
      )}
    </form>
  );
};
