import { CustomComponentLibrary, WebformElement } from './types';
import WebformCheckboxGroup from './components/WebformCheckboxGroup';

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
    borderRadius: '4px',
  },
  elementLabel: {
    fontSize: '16px',
    color: 'darkViolet',
  },
};

export function renderWebformElement(
  element: WebformElement,
  customComponents: CustomComponentLibrary,
) {
  // Render using custom component if provided:
  if (customComponents && customComponents[element['#type']]) {
    const CustomComponent = customComponents[element['#type']];
    return <CustomComponent element={element} />;
  }
  switch (element['#type']) {
    case 'textfield':
    case 'tel':
    case 'number':
    case 'email':
    case 'hidden':
      return (
        <input
          placeholder={element['#title']}
          id={element['#webform_key']}
          name={element['#webform_key']}
          style={styles.textArea}
        />
      );
    case 'textarea':
      return (
        <textarea
          placeholder={element['#title']}
          id={element['#webform_key']}
          name={element['#webform_key']}
          style={styles.textArea}
        />
      );
    case 'checkbox':
      return (
        <div>
          <input
            type="checkbox"
            id={element['#webform_key']}
            name={element['#webform_key']}
            style={styles.checkbox}
          />
          <label className="form-check-label">{element['#description']}</label>
        </div>
      );
    case 'radio':
      return (
        <input
          type="radio"
          id={element['#webform_key']}
          name={element['#webform_key']}
          style={styles.checkbox}
        />
      );
    case 'checkboxes':
      return (
        element['#options'] &&
        Object.keys(element['#options']).map((option) => (
          <div id={element['#webform_key']} key={option}>
            <input
              type="checkbox"
              name={element['#webform_key']}
              id={option}
              value={option}
              style={styles.checkbox}
            />
            <label className="form-check-label">{option}</label>
          </div>
        ))
      );
    case 'radios':
      return <WebformCheckboxGroup element={element} error={null} />;
    case 'select':
      return null;
    case 'webform_markup':
    case 'processed_text':
      return null;
    case 'webform_actions':
      return (
        <button type="submit" style={styles.btn}>
          {element['#submit__label']}
        </button>
      );
    default:
      // @todo: add better default
      return 'Element not supported';
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

const getSelectValues = (options: HTMLOptionsCollection) =>
  [].reduce.call(
    options,
    (values, option) =>
      option.selected ? values.concat(option.value) : values,
    [],
  );

const formToJSON = (elements: HTMLFormControlsCollection) =>
  [].reduce.call(
    elements,
    (data, element) => {
      // Make sure the element has the required properties and should be added.
      if (isValidElement(element) && isValidValue(element)) {
        if (isCheckbox(element)) {
          data[element.name] = (data[element.name] || []).concat(element.value);
        } else if (isMultiSelect(element)) {
          data[element.name] = getSelectValues(element.options);
        } else {
          data[element.name] = element.value;
        }
      }
      return data;
    },
    {},
  );

export async function handleSubmit(event, webform_id, webform) {
  event.preventDefault();
  const data = formToJSON(event.target.elements);
  // Post process serialized data:
  // Some webform elements require specialized data formatting.
  for (const element in Object.keys(webform.elements)) {
    if (data[element] && data[element].name) {
      switch (webform.element.type) {
        case 'checkbox':
          data[webform.element] = 1;
          break;
      }
    }
  }
  const body = { ...(data as object), ...{ webform_id: webform_id } };
  const response = await fetch('/api/webform/submit', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    // Show success.
  }
  const message = await response.json();
  console.log('API response', message);
  // Handle error.
}

export async function getWebformFields(id) {
  const response = await fetch(`http://localhost:3000/api/webform/${id}`);
  return response.json();
}
