# Acquia CMS: Headless

This is a starter template for building a headless site powered by [Acquia CMS](https://www.acquia.com/products/drupal-cloud/acquia-cms) and [Next.js](https://nextjs.org).

This project is built on the following technologies:

- Drupal core
- [Acquia CMS](https://github.com/acquia/acquia_cms) (Drupal distribution)
- [Next.js](https://nextjs.org) (React front-end framework)
- [Tailwind CSS](https://taiwindcss.com) (Styling library)
- [TypeScript](http://typescriptlang.org)

## Installation (Acquia CMS)

### 1. Create Acquia CMS project

Start by creating a new Acquia CMS project:

_(If you have an existing Acquia CMS project, you can skip this step)_

```
composer create-project --no-interaction acquia/drupal-recommended-project
```

Once you've created the project, proceed with the Drupal installation.

### 2. Add and enable modules

```
composer require drupal/next drupal/jsonapi_menu_items
```

Then click on **Extend** and enable the following modules: **Next.js**, **Next.js JSON:API** and **JSON:API Menu Items**.

### 3. Create Role and User

To pull data from the Drupal back-end, the Next.js front-end requires authorization. To handle this, we are going to create a role.

1. Create a role (example _Headless Site_) at `/admin/people/roles` with the following permissions:

- Bypass content access control
- Issue subrequests
- View user information

2. Add a new user at `/admin/people/create` and assign it the role we created above.

### 4. Configure OAuth Client

1. Visit `/admin/config/people/simple_oauth`
2. Click Generate keys to generate encryption keys for tokens
3. Fill in Directory for the keys.
4. Click Generate.

### 5. Create OAuth Client

1. Visit `/admin/config/services/consumer/add`
2. Fill in the following values:

- Label: `Headless site`
- User: `Select the user we created`
- Secret: `Your secret`
- Scopes: `Select the role we created`

3. Click Save

### 6. Create Next.js site

1. Visit `/admin/config/services/next`
2. Click **Add Next.js site**
3. Fill in the following values:

- Label: `Blog`
- Base URL: `http://localhost:3000`
- Preview URL: `http://localhost:3000/api/preview`
- Preview Secret: `preview-secret-here`

4. Click **Save**

## Installation (Next.js)

Run the following command to create a new Next.js project:

```
npx create-next-app -e https://github.com/chapter-three/next-acquia-cms
```

This will create a new starter project. [See project structure](#project-structure).

### Connect Drupal

To connect the Next.js site to Drupal, we use [environment variables](https://next-drupal.org/docs/environment-variables).

1. Copy `.env.example` to `.env.local`.
2. On the **Drupal site**, visit _/admin/config/services/next_.
3. Click **Environment variables**.
4. Copy and paste the values into the `.env.local` file created above.

_Remember to fill in the `DRUPAL_CLIENT_ID` and the `DRUPAL_CLIENT_SECRET`._

### Start Development Server

To start the Next.js development server, run `yarn dev`. This starts the development server on `http://localhost:3000`.

Visit [http://localhost:3000](http://localhost:3000) to view the headless site.

## Project Structure

```
.
├── components
│   ├── layout.tsx
│   ├── media--image.tsx
│   ├── menu--footer.tsx
│   ├── menu--main.tsx
│   ├── node--article.tsx
│   └── node--page.tsx
├── lib
│   └── format-date.ts
├── pages
│   ├── api
│   │   ├── exit-preview.tsx
│   │   ├── preview.tsx
│   │   └── revalidate.ts
│   ├── _app.tsx
│   ├── [...slug].tsx
│   ├── articles.tsx
│   └── index.tsx
├── public
│   ├── favicon.ico
│   ├── logo.png
│   └── robots.txt
├── styles
│   └── globals.css
├── .env.local
├── next.config.js
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

| Path                 | Description                                                                                          |
| -------------------- | ---------------------------------------------------------------------------------------------------- |
| `components`         | Place your React components here.                                                                    |
| `lib`                | For utility or helper functions.                                                                     |
| `pages`              | Learn more about the pages directory [here](https://nextjs.org/docs/basic-features/pages)            |
| `public`             | For [static files](https://nextjs.org/docs/basic-features/static-file-serving).                      |
| `styles`             | Directory for CSS files.                                                                             |
| `.env.local`         | File for local environment variables.                                                                |
| `next.config.js`     | [Configuration](https://nextjs.org/docs/api-reference/next.config.js/introduction) file for Next.js. |
| `tailwind.config.js` | [Configuration](https://tailwindcss.com/docs/configuration) file for Tailwind CSS.                   |

## Preview Mode

Document preview mode and how to enable it for entity types.

## Data Fetching

Document basic data fetching or point to docs page on https://next-drupal.org/docs/data-fetching

## Data
