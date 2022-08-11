export const WebformDebug = ({ element, error }) => {
  return (
    <code>
      {error}
      <pre>{JSON.stringify(element, null, 2)}</pre>
    </code>
  );
};

export default WebformDebug;
