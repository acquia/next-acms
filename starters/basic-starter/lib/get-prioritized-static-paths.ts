import { drupal } from './drupal';
import { GetStaticPathsContext, GetStaticPathsResult } from 'next/types';

// Generates paths of pages to pre-render with prioritization of menu links.
export async function getPrioritizedStaticPathsFromContext(
  context: GetStaticPathsContext,
  types: Array<string>,
): Promise<GetStaticPathsResult<{ slug: string[] }>['paths']> {
  let pathsFromContext = await drupal.getStaticPathsFromContext(types, context);

  // Remove the path from page [...slug] because it conflicts with '/'.
  pathsFromContext = pathsFromContext.filter((item) => {
    return item['params']['slug'] != '';
  });

  const menu = await drupal.getMenu('main');

  // Generate paths from the menu links.
  const pathsFromMenuItems = menu.items.map((item) => ({
    params: { slug: item.url.split('/').slice(1) },
  }));

  // Move paths for menu items to the beginning of the array.
  for (const path of pathsFromContext) {
    if (containsPath(path, pathsFromMenuItems)) {
      const index = pathsFromContext.indexOf(path);
      if (index !== -1) {
        pathsFromContext.splice(index, 1);
        pathsFromContext.unshift(path);
      }
    }
  }
  return pathsFromContext;
}

// Check if a list of paths contains a path.
function containsPath(
  searchPath: string | { params: { slug: string[] }; locale?: string },
  sourcePaths: Array<{ params: { slug: string[] }; locale?: string }>,
): boolean {
  for (const p of sourcePaths) {
    if (JSON.stringify(p) === JSON.stringify(searchPath)) {
      return true;
    }
  }
  return false;
}
