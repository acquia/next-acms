# Next.js for Acquia CMS

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

(If you have an existing Acquia CMS project, you can skip this step)

`composer create-project acquia/drupal-recommended-project acms-demo`

Once you've created the project, proceed with the Drupal installation.

_Note that Acquia CMS is currently not compatible with PHP 8._


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
npx create-next-app -e https://github.com/acquia/next-acms/tree/main/starters/basic-starter
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
This project is a monorepo structure using yarn workspaces. This project has a `packages` directory for next-acms and a `starters` directory for next-acms starter kits.

`starters/basic-starter` has a dependency on `packages/next-acms` which currently has a dependency on `next-drupal`.

```
.
|── node_modules
|── packages
  |── next-acms
  |  |── node_modules
  |  |── package.json
|── starters
  |── basic-starter
    ├── components
    │   ├── layout.tsx
    │   ├── media--image.tsx
    │   ├── menu--footer.tsx
    │   ├── menu--main.tsx
    │   ├── node--article.tsx
    │   └── node--page.tsx
    ├── lib
    │   └── format-date.ts
    ├── node_modules
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
|── .gitignore
|── package.json
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

## Routing

The starter ships with static routes for building collection of content: `pages/articles` and an entry point, `[[slug]].tsx`, for entity routes.

The `[[slug]].tsx` route is called a catch-all route.

When you create an entity on Drupal, and visit the route on your headless site, this is the file that handles data fetching and rendering for the entity.

You can read more about routing in Next.js on the [official docs](https://nextjs.org/docs/routing/introduction).

## Preview Mode

To enable the inline content preview inside Drupal, we need to configure a site resolver for the content type.

_A *site resolver* tells Drupal how to resolve the preview URL for an entity._

### Configure preview mode for article

1. Visit _/admin/config/services/next/entity-types_
2. Click **Configure entity type**
3. Select **Article** from the the entity type list
4. Select **Site selector** as the **Site resolver**
5. Select the Next.js site under **Next.js sites**
6. Click **Save**

If you visit an article from the Drupal administration, you should now see an inline preview inside an iframe.

Repeat the same steps for other content types.

## Data Fetching

To build pages from Drupal content, data is fetch in `getStaticProps` and passed to the component.

See the [documentation](https://next-drupal.org/docs/data-fetching) on data fetching in next-drupal.

### Adding a new entity type.

To create headless pages for a new content type:

1. Start by creating the content type, say `News`, on Drupal.
   - Define the fields: `title`, `field_teaser` and `body`.
   - Add a path alias for the content type: `news/[node:title]`.
2. On the Next.js site, edit `[[slug]].tsx` to fetch news from Drupal.
3. Add `node--news` to `CONTENT_TYPES`:

```diff
// List of all the entity types handled by this route.
const CONTENT_TYPES = [
  "node--page",
  "node--article",
  "node--event",
  "node--person",
  "node--place",
+ "node--news",
]
```

4. In `getStaticProps`, build the query for fetching the `node--news` with the fields:

```diff
+ if (type === "node--news") {
+ 	params
+ 		.addFields("node--news", ["title", "path", "field_teaser", "body])
+ }
```

5. Add a news on Drupal and visit the path on your Next.js site: `http://localhost:3000/news/title-of-news`.
6. If you add a `console.log(node)` in the `NodePage` component you should see the `node--news` data.

```diff
export default function NodePage({ node, menus }: NodePageProps) {
  if (!node) return null

+ console.log(node)
```

7. You can now use this `node--news` object to create the `<NodeNews />` component.

```diff
export default function NodePage({ node, menus }: NodePageProps) {
  if (!node) return null

  return (
    <Layout title={node.title} menus={menus}>
      {node.type === "node--page" && <NodeBasicPage node={node} />}
      {node.type === "node--article" && <NodeArticle node={node} />}
      {node.type === "node--event" && <NodeEvent node={node} />}
      {node.type === "node--person" && <NodePerson node={node} />}
      {node.type === "node--place" && <NodePlace node={node} />}
+     {node.type === "node--news" && <NodeNews node={node} />}
    </Layout>
  )
}
