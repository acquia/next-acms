import { styles } from '../utils';

export const WebformElementWrapper = ({
  children,
  labelFor,
  labelClassName,
  ...props
}) => {
  const css = `
.required-field:after {
    content: ' *';
    color: red;
}
        `;
  return (
    <div {...props}>
      <style>{css}</style>
      <label
        style={styles.elementLabel}
        htmlFor={labelFor}
        className={labelClassName}
      >
        {labelFor}
      </label>
      {children}
    </div>
  );
};

export default WebformElementWrapper;
