import { drupal } from './drupal';

// Generates paths of pages to pre-render with prioritization of menu links.
export async function getPrioritizedStaticPathsFromContext(
  context,
  ENTITY_TYPES,
) {
  const pathsFromContext = await drupal.getStaticPathsFromContext(
    ENTITY_TYPES,
    context,
  );
  const menu = await drupal.getMenu('main');

  // Remove the '/' path from the menu items because it conflicts with [...slug].
  const filteredMenuItems = menu.items.filter((item) => item.url !== '/');

  // Generate paths from the menu links.
  const pathsFromMenuItems = filteredMenuItems.map((item) => ({
    params: { slug: item.url.split('/').slice(1) },
  }));

  // Remove the menu item then add it to the beginning of the array.
  for (const path of pathsFromContext) {
    if (containsPath(pathsFromMenuItems, path)) {
      const index = pathsFromContext.indexOf(path);
      if (index !== -1) {
        pathsFromContext.splice(index, 1);
        pathsFromContext.unshift(path);
      }
    }
  }
  return pathsFromContext;
}

// Shallow equality check to see if a list of paths contains the given path.
function containsPath(arr, path) {
  for (const i of arr) {
    if (JSON.stringify(i) === JSON.stringify(path)) {
      return true;
    }
  }
  return false;
}
