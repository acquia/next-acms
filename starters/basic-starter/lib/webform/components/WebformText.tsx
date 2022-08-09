import WebformElementWrapper from './WebformElementWrapper';
import { styles } from '../utils';

export const WebformText = ({ element, error }) => {
  return (
    <WebformElementWrapper
      labelFor={element['#title']}
      labelClassName={element['#required']}
      settings={null}
      error={error}
    >
      <input
        placeholder={element['#title']}
        id={element['#webform_key']}
        name={element['#webform_key']}
        style={styles.textArea}
      />
    </WebformElementWrapper>
  );
};

export default WebformText;
