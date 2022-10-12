import { GetStaticPropsResult } from 'next';
import { DrupalNode } from 'next-drupal';
import { DrupalJsonApiParams } from 'drupal-jsonapi-params';

import { getMenus } from 'lib/get-menus';
import { Layout, LayoutProps } from 'components/layout';
import { PageHeader } from 'components/page-header';
import { NodeEventTeaser } from 'components/node--event';
import { drupal } from '../lib/drupal';

interface EventsPageProps extends LayoutProps {
  events: DrupalNode[];
}

export default function EventPage({ menus, events }: EventsPageProps) {
  return (
    <Layout title="Events" menus={menus}>
      <PageHeader heading="Events" text="Upcoming Events." />
      <div className="container px-6 pb-10 mx-auto">
        {events?.length ? (
          <div className="grid gap-14">
            {events.map((event) => (
              <NodeEventTeaser key={event.id} node={event} />
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
): Promise<GetStaticPropsResult<EventsPageProps>> {
  const events = await drupal.getResourceCollectionFromContext<DrupalNode[]>(
    'node--event',
    context,
    {
      params: new DrupalJsonApiParams()
        .addFilter('status', '1')
        .addSort('field_event_start', 'ASC')
        .addFilter('field_event_start', new Date().toISOString(), '>=')
        .addInclude(['field_event_image.image', 'field_event_place'])
        .addFields('node--event', [
          'id',
          'title',
          'body',
          'path',
          'field_event_start',
          'field_event_image',
          'field_event_duration',
          'field_event_place',
        ])
        .addFields('node--place', ['title', 'path'])
        .getQueryObject(),
    },
  );

  return {
    props: {
      events,
      menus: await getMenus(context),
    },
    revalidate: 60,
  };
}
