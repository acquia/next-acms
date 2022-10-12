import { GetStaticPropsResult } from 'next';
import { DrupalNode } from 'next-drupal';
import { DrupalJsonApiParams } from 'drupal-jsonapi-params';
import { useTranslation, SSRConfig } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { getMenus } from 'lib/get-menus';
import { Layout, LayoutProps } from 'components/layout';
import { NodePlaceTeaser } from 'components/node--place';
import { PageHeader } from 'components/page-header';
import { drupal } from '../lib/drupal';

interface PlacesPageProps extends LayoutProps, SSRConfig {
  places: DrupalNode[];
}

export default function PlacesPage({ menus, places }: PlacesPageProps) {
  const { t } = useTranslation();
  return (
    <Layout title={t('Places')} menus={menus}>
      <PageHeader heading={t('Places')} text="Our Offices" />
      <div className="container px-6 pb-10 mx-auto">
        {places?.length ? (
          <div className="grid gap-14">
            {places.map((place) => (
              <NodePlaceTeaser key={place.id} node={place} />
            ))}
          </div>
        ) : (
          <p>{t('No content found')}</p>
        )}
      </div>
    </Layout>
  );
}

export async function getStaticProps(
  context,
): Promise<GetStaticPropsResult<PlacesPageProps>> {
  const places = await drupal.getResourceCollectionFromContext<DrupalNode[]>(
    'node--place',
    context,
    {
      params: new DrupalJsonApiParams()
        .addFilter('status', '1')
        .addSort('title', 'ASC')
        .addInclude(['field_place_image.image'])
        .addFields('node--place', [
          'id',
          'title',
          'path',
          'field_place_image',
          'field_place_address',
          'field_place_telephone',
        ])
        .getQueryObject(),
    },
  );

  return {
    props: {
      places,
      menus: await getMenus(context),
      ...(await serverSideTranslations(context.locale)),
    },
    revalidate: 60,
  };
}
