import { components } from 'nextjs-drupal-webform';
import classNames from 'classnames';

const buttonDecorator = (DecoratedComponent) => {
  return function WebformCustomTable(props) {
    const fieldProps = props.fieldProps ?? {};
    const additionalClasses = [];
    if (props.element['#button_type'] === 'primary') {
      additionalClasses.push('bg-sky-500 hover:bg-sky-700 text-white');
    }
    fieldProps.className = classNames(fieldProps.className, additionalClasses);

    return <DecoratedComponent {...props} fieldProps={fieldProps} />;
  };
};

export default buttonDecorator(components.button);
