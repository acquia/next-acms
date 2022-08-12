import {
  CustomComponentLibrary,
  DEFAULT_SUBMIT_LABEL,
  WebformElement,
} from './types';
import WebformCheckboxGroup from './components/WebformCheckboxGroup';
import WebformText from './components/WebformText';
import WebformTextArea from './components/WebformTextArea';
import WebformCheckbox from './components/WebformCheckbox';
import WebformDebug from './components/WebformDebug';
import WebformAddress from './components/WebformAddress';

export const styles = {
  btn: {
    backgroundColor: 'rgb(14 165 233)',
    color: 'white',
    border: 'none',
    padding: '12px 14px',
    textDecoration: 'none',
    display: 'inlineBlock',
    fontSize: '16px',
    borderRadius: '8px',
  },
  checkbox: {
    marginRight: '8px',
  },
  textArea: {
    border: '2px solid #e5e7eb',
    margin: '4px',
    borderRadius: '0.375rem',
  },
  elementLabel: {
    fontSize: '16px',
    color: 'darkViolet',
  },
  form: {
    padding: '20px',
    backgroundColor: 'lavender',
    borderRadius: '0.375rem',
  },
  formError: {
    backgroundColor: '#FEE2E2',
    color: 'red',
    padding: '10px',
    borderRadius: '0.375rem',
  },
  formSuccess: {
    backgroundColor: '#DCFCE7',
    color: 'green',
    padding: '10px',
    borderRadius: '0.375rem',
  },
};

export function renderWebformElement(
  element: WebformElement,
  customComponents: CustomComponentLibrary,
  error?: string,
) {
  const customComponentAPI = {
    error,
  };
  // Render using custom component if provided:
  if (customComponents && customComponents[element['#type']]) {
    const CustomComponent = customComponents[element['#type']];
    return <CustomComponent element={element} {...customComponentAPI} />;
  }
  switch (element['#type']) {
    case 'textfield':
    case 'tel':
    case 'number':
    case 'email':
    case 'hidden':
      return <WebformText element={element} error={error} />;
    case 'textarea':
      return <WebformTextArea element={element} error={error} />;
    case 'checkbox':
      return (
        <WebformCheckbox
          element={{ ...element, type: 'checkbox' }}
          error={error}
        />
      );
    case 'radio':
      return (
        <WebformCheckbox
          element={{ ...element, type: 'radio' }}
          error={error}
        />
      );
    case 'checkboxes':
      return (
        <WebformCheckboxGroup
          element={{ ...element, type: 'checkbox' }}
          {...customComponentAPI}
        />
      );
    case 'radios':
      return (
        <WebformCheckboxGroup
          element={{ ...element, type: 'radio' }}
          {...customComponentAPI}
        />
      );
    case 'select':
      return null;
    case 'webform_markup':
    case 'processed_text':
      return null;
    case 'webform_address':
      return <WebformAddress element={element} error={error} />;
    case 'webform_actions':
      return (
        <button type="submit" style={styles.btn}>
          {element['#submit__label'] || DEFAULT_SUBMIT_LABEL}
        </button>
      );
    // Render as JSON string if unknown.
    default:
      return <WebformDebug element={element} error={error} />;
  }
}

const isValidElement = (element: any) => {
  return !!(element.name && element.value);
};

const isValidValue = (element) => {
  return (
    !['checkbox', 'radio'].includes(element.type) ||
    (element as HTMLInputElement).checked
  );
};

const isCheckbox = (element): element is HTMLInputElement =>
  element.type === 'checkbox';

const isMultiSelect = (element: any): element is HTMLSelectElement =>
  element.options && (element as HTMLSelectElement).multiple;

const isCompositeElement = (element: any): element is any =>
  element['#webform_composite_elements'];

const getSelectValues = (options: HTMLOptionsCollection) =>
  [].reduce.call(
    options,
    (values, option) =>
      option.selected ? values.concat(option.value) : values,
    [],
  );

export const formToJSON = (elements: HTMLFormControlsCollection) =>
  [].reduce.call(
    elements,
    (data, element) => {
      // Make sure the element has the required properties and should be added.
      if (isValidElement(element) && isValidValue(element)) {
        if (isCheckbox(element)) {
          data[element.name] = (data[element.name] || []).concat(element.value);
        } else if (isMultiSelect(element)) {
          data[element.name] = getSelectValues(element.options);
          // } else if (isCompositeElement(element)) {
          //   data[element.name] = '';
        } else {
          data[element.name] = element.value;
        }
      }
      return data;
    },
    {},
  );

export async function getWebformFields(id) {
  const response = await fetch(`http://localhost:3000/api/webform/${id}`);
  return response.json();
}
