import { GetStaticPropsResult } from 'next';
import { DrupalNode } from 'next-drupal';
import { DrupalJsonApiParams } from 'drupal-jsonapi-params';

import { getMenus } from 'lib/get-menus';
import { Layout, LayoutProps } from 'components/layout';
import { PageHeader } from 'components/page-header';
import { NodePersonTeaser } from 'components/node--person';
import { drupal } from '../lib/drupal';

interface PeoplePageProps extends LayoutProps {
  people: DrupalNode[];
}

export default function PeoplePage({ menus, people }: PeoplePageProps) {
  return (
    <Layout title="People" menus={menus}>
      <PageHeader heading="People" text="Our Team" className="text-center" />
      <div className="container px-6 pb-10 mx-auto">
        {people?.length ? (
          <div className="grid gap-20 md:grid-cols-3">
            {people.map((person) => (
              <NodePersonTeaser key={person.id} node={person} />
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
): Promise<GetStaticPropsResult<PeoplePageProps>> {
  const people = await drupal.getResourceCollectionFromContext<DrupalNode[]>(
    'node--person',
    context,
    {
      params: new DrupalJsonApiParams()
        .addFilter('status', '1')
        .addSort('title', 'ASC')
        .addInclude(['field_person_image.image'])
        .addFields('node--person', [
          'id',
          'title',
          'path',
          'field_job_title',
          'field_person_image',
        ])
        .getQueryObject(),
    },
  );

  return {
    props: {
      people,
      menus: await getMenus(context),
    },
    revalidate: 60,
  };
}
