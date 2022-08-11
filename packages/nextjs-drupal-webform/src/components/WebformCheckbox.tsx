import WebformElementWrapper from './WebformElementWrapper';
import { styles } from '../utils';
import { WebformCustomComponent } from '../types';

export const WebformCheckbox: WebformCustomComponent = ({ element, error }) => {
  return (
    <WebformElementWrapper
      labelFor={element['#title']}
      labelClassName={element['#required']}
      settings={null}
      error={error}
    >
      <div>
        <input
          type={element.type}
          id={element['#webform_key']}
          name={element['#webform_key']}
          style={styles.checkbox}
        />
        <label className="form-check-label">{element['#description']}</label>
      </div>
    </WebformElementWrapper>
  );
};

export default WebformCheckbox;
