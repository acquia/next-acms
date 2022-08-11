import WebformElementWrapper from './WebformElementWrapper';
import { styles } from '../utils';

export const WebformAddress = ({ element, error }) => {
  const compositeElements = element['#webform_composite_elements'];
  return (
    <WebformElementWrapper
      labelFor={element['#title']}
      labelClassName={element['#required']}
      settings={null}
      error={error}
    >
      {Object.keys(compositeElements).map((name) => {
        {
          console.log('comp elements.name', compositeElements[name]);
          console.log('key', name);
        }
        // return null;
        return (
          <input
            key={compositeElements[name]['#title']}
            placeholder={compositeElements[name]['#title']}
            name={name}
            style={styles.textArea}
          />
        );
      })}
    </WebformElementWrapper>
  );
};

export default WebformAddress;
