import { GetStaticPropsResult } from 'next';
import { DrupalNode, getResourceCollectionFromContext } from 'next-drupal';
import { DrupalJsonApiParams } from 'drupal-jsonapi-params';

import { getMenus } from 'lib/get-menus';
import { Layout, LayoutProps } from 'components/layout';
import { NodePlaceTeaser } from 'components/node--place';
import { PageHeader } from 'components/page-header';

interface PlacesPageProps extends LayoutProps {
  places: DrupalNode[];
}

export default function PlacesPage({ menus, places }: PlacesPageProps) {
  return (
    <Layout title="Places" menus={menus}>
      <PageHeader heading="Places" text="Our Offices" />
      <div className="container px-6 pb-10 mx-auto">
        {places?.length ? (
          <div className="grid gap-14">
            {places.map((place) => (
              <NodePlaceTeaser key={place.id} node={place} />
            ))}
          </div>
        ) : (
          <p>No content found.</p>
        )}
      </div>
    </Layout>
  );
}

export async function getStaticProps(
  context,
): Promise<GetStaticPropsResult<PlacesPageProps>> {
  const places = await getResourceCollectionFromContext<DrupalNode[]>(
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
      menus: await getMenus(),
    },
  };
}
