import { styles } from '../utils';

export const WebformElementWrapper = ({
  children,
  labelFor,
  labelClassName,
  error,
  ...props
}) => {
  const css = `
.required-field:after {
    content: ' *';
    color: red;
}
.invalid-feedback {
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
      {error && (
        <div className="form-text invalid-feedback" {...props}>
          {error}
        </div>
      )}
    </div>
  );
};

export default WebformElementWrapper;
