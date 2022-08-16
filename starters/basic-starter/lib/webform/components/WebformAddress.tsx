import WebformElementWrapper from './WebformElementWrapper';
import { styles } from '../utils';

// @todo: add functionality for options dropdown
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
          // console.log('comp elements.name', compositeElements[name]);
          // console.log('key', name);
        }
        // return null;
        return (
          <input
            key={compositeElements[name]['#title']}
            id={name}
            className="composite"
            placeholder={compositeElements[name]['#title']}
            name={compositeElements[name]['#webform_composite_parent_key']}
            style={styles.textArea}
          />
        );
      })}
    </WebformElementWrapper>
  );
};

export default WebformAddress;
