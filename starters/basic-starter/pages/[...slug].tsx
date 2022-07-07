// This is a catch-all route.
// It is the entry point for handling entity routes from Drupal.
import * as React from 'react';
import { GetStaticPathsResult, GetStaticPropsResult } from 'next';
import { DrupalNode } from 'next-drupal';
import { DrupalJsonApiParams } from 'drupal-jsonapi-params';

import { getMenus } from 'lib/get-menus';
import { Layout, LayoutProps } from 'components/layout';
import { NodeArticle } from 'components/node--article';
import { NodeEvent } from 'components/node--event';
import { NodePerson } from 'components/node--person';
import { NodePlace } from 'components/node--place';
import { NodeBasicPage } from 'components/node--page';
import { drupal } from '../lib/drupal';
import {TaxonomyPerson} from "../components/taxonomy--person_type";

// List of all the entity types handled by this route.
const CONTENT_TYPES = [
  'node--page',
  'node--article',
  'node--event',
  'node--person',
  'node--place',
  'taxonomy_term--article_type',
  'taxonomy_term--categories',
  'taxonomy_term--event_type',
  'taxonomy_term--person_type',
  'taxonomy_term--place_type',
  'taxonomy_term--tags',
];

interface NodePageProps extends LayoutProps {
  node: DrupalNode;
  label?: string;
}

export default function NodePage({node, menus, label}: NodePageProps) {
  if (!node) return null;

  return (
    <Layout title={node.title} menus={menus}>
      {console.log(node, node.name)}
      {node.every(p => p.field_person_type.type  === 'taxonomy_term--person_type') && <TaxonomyPerson nodes={node} label={label}/>}
      {node.type === 'node--page' && <NodeBasicPage node={node}/>}
      {node.type === 'node--article' && <NodeArticle node={node}/>}
      {node.type === 'node--event' && <NodeEvent node={node}/>}
      {node.type === 'node--person' && <NodePerson node={node}/>}
      {node.type === 'node--place' && <NodePlace node={node}/>}
    </Layout>
  );
}

// Use the 'paths' key to specify wanted paths to be pre-rendered at build time.
// See https://nextjs.org/docs/basic-features/data-fetching/get-static-paths.
export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  return {
    // By default, individual entity pages are not pre-rendered at build time to
    // optimize for faster build time.
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps(
  context,
): Promise<GetStaticPropsResult<NodePageProps>> {
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

  let label;
  if (path.label) {
    // Taxonomy term
    label = path.label;
  }

  if (!CONTENT_TYPES.includes(type)) {
    return {
      notFound: true,
    };
  }

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

  // Fetch the node/resource from Drupal.
  let node;
  if (type === 'taxonomy_term--person_type') {
    node = await drupal.getResourceCollectionFromContext<DrupalNode[]>(
        'node--person',
        context,
        {
          params: new DrupalJsonApiParams()
            .addInclude(['field_person_image.image'])
            .addFilter('field_person_type.name', label)
            .getQueryObject(),
        },
      );
      console.log('people', node);
  } else {
    node = await drupal.getResourceFromContext<DrupalNode>(type, context, {
      params: params.getQueryObject(),
    });
  }

  // At this point, we know the path exists and it points to a resource. If we
  // receive an error, it means something went wrong on Drupal. We throw an
  // error to tell revalidation to skip this for now. Revalidation can try again
  // on next request.
  if (!node) {
    throw new Error(`Failed to fetch resource: ${path.jsonapi.individual}`);
  }

  // If we're not in preview mode and the resource is not published,
  // Return page not found.
  if (!context.preview && node?.status === false) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      node,
      menus: await getMenus(),
      label,
    },
    revalidate: 60,
  };
}
