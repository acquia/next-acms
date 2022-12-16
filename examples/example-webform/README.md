## Getting Started

This is an example that uses Next.js Webform library for rendering forms built
using Drupal Webform module. The framework can render simple Webforms
out-of-the-box. The functionality can be extended to support advanced features
in Webform.

For an easy setup, we recommend using Drupal [Webform REST module](https://www.drupal.org/project/webform_rest).

- Download the Webform and Webform REST modules

- Apply patch from this issue on Webform REST to add Webform Autocomplete Options endpoint (not needed if you are not using autocomplete fields)

- Enable REST resources "Webform Submit", "Webform Autocomplete Options", "Webform Elements", "Webform Submission" on /admin/config/services/rest

- Set permissions /admin/people/permissions#module-rest for RESTful Web Services. Note: you may want to use an authorized client instead of exposing the Webform data for anonymous users.

- Create a new `contact` webform if you do not have this form yet /admin/structure/webform

- Run the development server:

  ```bash
  npm run dev
  # or
  yarn dev
  ```

- Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

- You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js Webform and Next.js for Acquia CMS, take a look at the following resources:

- [Next.js Webform](https://www.drupal.org/project/next_webform) (Framework for rendering Drupal Webform forms in Next.js)
- [Acquia CMS](https://github.com/acquia/acquia_cms) (Drupal distribution)
- [Next.js](https://nextjs.org) (React front-end framework)
- [Next.js for Acquia CMS](https://github.com/acquia/next-acms) (Tools for integrating Next.js with Acquia CMS)
- [Next.js for Drupal](https://next-drupal.org) (Tools for integrating Next.js with Drupal)
- [Drupal JSON-API Params](https://github.com/d34dman/drupal-jsonapi-params) (Tools for generating JSON:API queries)
- [Tailwind CSS](https://taiwindcss.com) (Styling library)
- [TypeScript](http://typescriptlang.org)
