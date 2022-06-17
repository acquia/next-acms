import { DrupalMenuLinkContent, getMenu } from 'next-drupal';

export async function getMenus(): Promise<{
  main: DrupalMenuLinkContent[];
  footer: DrupalMenuLinkContent[];
}> {
  const { tree: mainMenu } = await getMenu('main');
  const { tree: footerMenu } = await getMenu('footer');

  return {
    main: mainMenu,
    footer: footerMenu,
  };
}
