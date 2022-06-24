import { GetStaticPropsResult } from "next"
import { Layout, LayoutProps } from "components/layout"
import { getMenus } from "lib/get-menus"
import { PageHeader } from "components/page-header"
import {DrupalNode, getResourceCollectionFromContext} from "next-drupal";
import {NodeEventTeaser} from "../components/node--event";
import {DrupalJsonApiParams} from "drupal-jsonapi-params";

interface IndexPageProps extends LayoutProps {
    events: DrupalNode[];
}

export default function IndexPage({ menus, events }: IndexPageProps) {
    return (
        <Layout title="Home" menus={menus}>
            <PageHeader
                heading="My Headless Site"
                text="A Next.js site powered by Acquia CMS."
                className="text-center"
            />
            <div className="container px-6 pb-10 mx-auto">
                Featured Event
                {events?.length ? (
                    <div className="grid gap-14">
                        {/*{events.map((event) => (*/}
                            <NodeEventTeaser key={events[0].id} node={events[0]} />
                        {/*))}*/}
                    </div>
                ) : (
                    <p>No content found.</p>
                )}
            </div>
        </Layout>
    )
}

export async function getStaticProps(context): Promise<
    GetStaticPropsResult<IndexPageProps>
    > {
    const events = await getResourceCollectionFromContext<DrupalNode[]>(
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
                    'path',
                    'field_event_start',
                    'field_event_image',
                    'field_event_place',
                ])
                .addFields('node--place', ['title', 'path'])
                .getQueryObject(),
        },
    );
    return {
        props: {
            menus: await getMenus(),
            events,
        },
        revalidate: 60,
    }
}