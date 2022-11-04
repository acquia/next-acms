import { DrupalMenuLinkContent } from 'next-drupal';
import { drupal } from '../lib/drupal';
import { JsonApiWithLocaleOptions } from 'next-drupal/dist/types';
import { GetStaticPropsContext } from 'next';

export async function getMenus(context?: GetStaticPropsContext): Promise<{
  main: DrupalMenuLinkContent[];
  footer: DrupalMenuLinkContent[];
}> {
  let options: JsonApiWithLocaleOptions = {};
  if (context) {
    options = { defaultLocale: context.defaultLocale, locale: context.locale };
  }

  const { tree: mainMenu } = await drupal.getMenu('main', options);
  const { tree: footerMenu } = await drupal.getMenu('footer', options);

  return {
    main: mainMenu,
    footer: footerMenu,
  };
}
