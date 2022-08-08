import { styles } from '../utils';
import WebformElementWrapper from './WebformElementWrapper';

export const WebformCheckboxGroup = ({ element, error }) => {
  return (
    <WebformElementWrapper
      labelFor={element['#title']}
      labelClassName={element['#required'] ? 'required-field' : ''}
      settings={null}
      error={null}
    >
      {element['#options'] &&
        Object.keys(element['#options']).map((option) => (
          <div className="form-check" key={option}>
            <input
              type="radio"
              name={element['#webform_key']}
              id={option}
              value={option}
              style={styles.checkbox}
            />
            <label className="form-check-label">{option}</label>
          </div>
        ))}
    </WebformElementWrapper>
  );
};

export default WebformCheckboxGroup;
