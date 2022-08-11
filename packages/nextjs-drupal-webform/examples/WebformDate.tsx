import React from 'react';
import WebformElementWrapper from '../src/components/WebformElementWrapper';

// Example custom component
export const WebformDate = ({ element, error }) => {
  return (
    <WebformElementWrapper
      labelFor={element['#title']}
      labelClassName={element['#required']}
      settings={null}
      error={error}
    >
      <input type="date" name="date" min="2022-01-01" max="2022-12-31" />
    </WebformElementWrapper>
  );
};
