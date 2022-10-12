// This is a catch-all route.
// It is the entry point for handling entity routes from Drupal.
import * as React from 'react';
import { GetStaticPathsResult, GetStaticPropsResult } from 'next';
import { DrupalNode, DrupalTaxonomyTerm } from 'next-drupal';
import { DrupalJsonApiParams } from 'drupal-jsonapi-params';

import { getMenus } from '../lib/get-menus';
import { Layout, LayoutProps } from '../components/layout';
import { NodeArticle } from '../components/node--article';
import { NodeEvent } from '../components/node--event';
import { NodePerson } from '../components/node--person';
import { NodePlace } from '../components/node--place';
import { NodeBasicPage } from '../components/node--page';
import { drupal } from '../lib/drupal';
import { TaxonomyArticle } from '../components/taxonomy/taxonomy--article_type';
import { TaxonomyPerson } from '../components/taxonomy/taxonomy--person_type';
import { TaxonomyEvent } from '../components/taxonomy/taxonomy--event_type';
import { TaxonomyPlace } from '../components/taxonomy/taxonomy--place_type';
import { getPrioritizedStaticPathsFromContext } from '../lib/get-prioritized-static-paths';
import { GetStaticPathsContext } from 'next/types';

// List of all the entity types handled by this route.
export const ENTITY_TYPES = [
  'node--page',
  'node--article',
  'node--event',
  'node--person',
  'node--place',
  'taxonomy_term--article_type',
  'taxonomy_term--event_type',
  'taxonomy_term--person_type',
  'taxonomy_term--place_type',
];

interface EntityPageProps extends LayoutProps {
  entity: DrupalNode | DrupalTaxonomyTerm;
  additionalContent?: {
    nodes?: DrupalNode[];
  };
}

export default function EntityPage({
  entity,
  additionalContent,
  menus,
}: EntityPageProps) {
  return (
    <Layout title={entity.title || entity.name} menus={menus}>
      {entity.type === 'node--page' && (
        <NodeBasicPage node={entity as DrupalNode} />
      )}
      {entity.type === 'node--article' && (
        <NodeArticle node={entity as DrupalNode} />
      )}
      {entity.type === 'node--event' && (
        <NodeEvent node={entity as DrupalNode} />
      )}
      {entity.type === 'node--person' && (
        <NodePerson node={entity as DrupalNode} />
      )}
      {entity.type === 'node--place' && (
        <NodePlace node={entity as DrupalNode} />
      )}
      {entity.type === 'taxonomy_term--article_type' && (
        <TaxonomyArticle
          additionalContent={additionalContent as { nodes: DrupalNode[] }}
          taxonomy_term={entity as DrupalTaxonomyTerm}
        />
      )}
      {entity.type === 'taxonomy_term--person_type' && (
        <TaxonomyPerson
          additionalContent={additionalContent as { nodes: DrupalNode[] }}
          taxonomy_term={entity as DrupalTaxonomyTerm}
        />
      )}
      {entity.type === 'taxonomy_term--event_type' && (
        <TaxonomyEvent
          additionalContent={additionalContent as { nodes: DrupalNode[] }}
          taxonomy_term={entity as DrupalTaxonomyTerm}
        />
      )}
      {entity.type === 'taxonomy_term--place_type' && (
        <TaxonomyPlace
          additionalContent={additionalContent as { nodes: DrupalNode[] }}
          taxonomy_term={entity as DrupalTaxonomyTerm}
        />
      )}
    </Layout>
  );
}

// Generates static paths for the first 200 pages to pre-render.
// The default implementation prioritizes menu links. This can be customized
// depending on requirements. For example, for a blog, it could make sense
// to prioritize based on creation time.
// See https://nextjs.org/docs/basic-features/data-fetching/get-static-paths.
export async function getStaticPaths(
  context: GetStaticPathsContext,
): Promise<GetStaticPathsResult> {
  // By limiting the number of static paths, larger sites can keep build times
  // within a reasonable timeframe.
  const limit = 200;
  const paths = await getPrioritizedStaticPathsFromContext(
    context,
    ENTITY_TYPES,
  );

  return {
    paths: paths.slice(0, limit),
    fallback: 'blocking',
  };
}

export async function getStaticProps(
  context,
): Promise<GetStaticPropsResult<EntityPageProps>> {
  // Find a matching path from Drupal from context.
  const path = await drupal.translatePathFromContext(context);

  if (!path) {
    return {
      notFound: true,
    };
  }

  // Handle redirects.
  if (path.redirect) {
    const [redirect] = path.redirect;
    return {
      redirect: {
        destination: redirect.to,
        permanent: redirect.status === '301',
      },
    };
  }

  const type = path.jsonapi.resourceName;

  if (!ENTITY_TYPES.includes(type)) {
    return {
      notFound: true,
    };
  }

  const additionalContent = {};
  const params = new DrupalJsonApiParams();

  if (type === 'node--page') {
    params.addInclude(['field_page_image.image']);
  }

  if (type === 'node--article') {
    params.addInclude([
      'field_article_media.image',
      'field_article_image.image',
      'field_display_author',
    ]);
  }

  if (type === 'node--event') {
    params
      .addInclude(['field_event_image.image', 'field_event_place'])
      .addFields('node--place', ['title', 'path']);
  }

  if (type === 'node--person') {
    params.addInclude(['field_person_image.image']);
  }

  if (type === 'node--place') {
    params.addInclude(['field_place_image.image']);
  }

  const entity = await drupal.getResourceFromContext<
    DrupalNode | DrupalTaxonomyTerm
  >(type, context, {
    params: params.getQueryObject(),
  });

  // At this point, we know the path exists and it points to a resource. If we
  // receive an error, it means something went wrong on Drupal. We throw an
  // error to tell revalidation to skip this for now. Revalidation can try again
  // on next request.
  if (!entity) {
    throw new Error(`Failed to fetch resource: ${path.jsonapi.individual}`);
  }

  // If we're not in preview mode and the resource is not published,
  // Return page not found.
  if (!context.preview && entity?.status === false) {
    return {
      notFound: true,
    };
  }

  // Fetch additional content for rendering taxonomy term pages.
  if (type === 'taxonomy_term--person_type') {
    additionalContent['nodes'] = await drupal.getResourceCollectionFromContext<
      DrupalNode[]
    >('node--person', context, {
      params: new DrupalJsonApiParams()
        .addInclude(['field_person_image.image', 'field_person_type'])
        .addFilter('field_person_type.id', entity.id)
        .addSort('created', 'ASC')
        .getQueryObject(),
    });
  }
  if (type === 'taxonomy_term--article_type') {
    additionalContent['nodes'] = await drupal.getResourceCollectionFromContext<
      DrupalNode[]
    >('node--article', context, {
      params: new DrupalJsonApiParams()
        .addInclude([
          'field_article_media.image',
          'field_article_image.image',
          'field_display_author',
          'field_article_type',
        ])
        .addFilter('field_article_type.id', entity.id)
        .addSort('created', 'ASC')
        .getQueryObject(),
    });
  }
  if (type === 'taxonomy_term--event_type') {
    additionalContent['nodes'] = await drupal.getResourceCollectionFromContext<
      DrupalNode[]
    >('node--event', context, {
      params: new DrupalJsonApiParams()
        .addInclude([
          'field_event_image.image',
          'field_event_place',
          'field_event_type',
        ])
        .addFilter('field_event_type.id', entity.id)
        .addSort('created', 'ASC')
        .getQueryObject(),
    });
  }
  if (type === 'taxonomy_term--place_type') {
    additionalContent['nodes'] = await drupal.getResourceCollectionFromContext<
      DrupalNode[]
    >('node--place', context, {
      params: new DrupalJsonApiParams()
        .addInclude(['field_place_image.image', 'field_place_type'])
        .addFilter('field_place_type.id', entity.id)
        .addSort('created', 'ASC')
        .getQueryObject(),
    });
  }

  return {
    props: {
      entity: entity,
      additionalContent: additionalContent,
      menus: await getMenus(context),
    },
    revalidate: 60,
  };
}
