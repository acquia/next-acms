import { DrupalMenuLinkContent } from 'next-drupal';
import { drupal } from '../lib/drupal';

export async function getMenus(): Promise<{
  main: DrupalMenuLinkContent[];
  footer: DrupalMenuLinkContent[];
}> {
  const { tree: mainMenu } = await drupal.getMenu('main');
  const { tree: footerMenu } = await drupal.getMenu('footer');

  return {
    main: mainMenu,
    footer: footerMenu,
  };
}
