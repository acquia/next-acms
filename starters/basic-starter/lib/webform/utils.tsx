const styles = {
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
};

export function renderWebformElement(el) {
  switch (el['#type']) {
    case 'textfield':
    case 'tel':
    case 'number':
    case 'email':
    case 'hidden':
      return (
        <input
          placeholder={el['#title']}
          id={el['#webform_key']}
          name={el['#webform_key']}
          style={styles.textArea}
        />
      );
    case 'textarea':
      return (
        <textarea
          placeholder={el['#title']}
          id={el['#webform_key']}
          name={el['#webform_key']}
          style={styles.textArea}
        />
      );
    case 'checkbox':
      return (
        <div>
          <input
            type="checkbox"
            id={el['#webform_key']}
            name={el['#webform_key']}
            style={styles.checkbox}
          />
          <label className="form-check-label">{el['#description']}</label>
        </div>
      );
    case 'radio':
      return (
        <input
          type="radio"
          id={el['#webform_key']}
          name={el['#webform_key']}
          style={styles.checkbox}
        />
      );
    case 'checkboxes':
      return (
        el['#options'] &&
        Object.keys(el['#options']).map((option) => (
          <div id={el['#webform_key']} key={option}>
            <input
              type="checkbox"
              name={el['#webform_key']}
              id={option}
              value={option}
              style={styles.checkbox}
            />
            <label className="form-check-label">{option}</label>
          </div>
        ))
      );
    case 'radios':
      return (
        el['#options'] &&
        Object.keys(el['#options']).map((option) => (
          <div className="form-check" key={option}>
            <input
              type="radio"
              name={el['#webform_key']}
              id={option}
              value={option}
              style={styles.checkbox}
            />
            <label className="form-check-label">{option}</label>
          </div>
        ))
      );
    case 'select':
      return '';
    case 'webform_markup':
    case 'processed_text':
      return '';
    case 'webform_actions':
      return (
        <button type="submit" style={styles.btn}>
          {el['#submit__label']}
        </button>
      );
    default:
      return;
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
  for (const element in Object.keys(webform)) {
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
  if (response.ok) {
    // Show success.
  }
  // Handle error.
}

export async function getWebform(id) {
  const response = await fetch(`http://localhost:3000/api/webform/${id}`);
  return response.json();
}
