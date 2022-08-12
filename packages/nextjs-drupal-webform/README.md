# Next.js Drupal Webform

Plugin for integrating the [Webform](https://www.drupal.org/project/webform) module with Next.js applications.

## Setup 
1. Install the [Webform](https://www.drupal.org/project/webform) and [Webform REST](https://www.drupal.org/project/webform_rest) modules.
2. Enable REST resources: "Webform Submit", "Webform Elements", "Webform Submission" on /admin/config/services/rest.
3. Set Webform permissions on RESTful Web Services  `/admin/people/permissions#module-rest` for Anonymous Users.
4. Create your webform. 
5. @todo add how to get the field_webform from entity?

## Example
```
<Webform
webformObject={additionalContent.webform}
id={additionalContent.webform.drupal_internal__id}
key={additionalContent.webform.drupal_internal__id}
/>
```


## Using custom components
1. Create your custom component
```
// Example custom component
export const WebformDate = ({ element, error }) => {
  return (
    <WebformElementWrapper
      labelFor={element['#title']}
      labelClassName={element['#required']}
      settings={null}
      error={error}
    >
      <input
        type={element['#type']}
        name={element['#webform_key']}
        min="2022-01-01"
        max="2022-12-31"
      />
    </WebformElementWrapper>
  );
};
```
2. Pass in your component(s) to the `customComponents` property. The key in `customComponents` should match the webform element's type.
```
   <Webform
   webformObject={additionalContent.webform}
   id={additionalContent.webform.drupal_internal__id}
   key={additionalContent.webform.drupal_internal__id}
   customComponents={{ date: WebformDate }}
   />
```
