import { Layout } from '../layout';
import { TaxonomyArticle } from './taxonomy--article_type';
import { TaxonomyPerson } from './taxonomy--person_type';
import { TaxonomyEvent } from './taxonomy--event_type';
import { TaxonomyPlace } from './taxonomy--place_type';
import * as React from 'react';

export function TaxonomyTerm({ node_list, menus, taxonomy_term, type }) {
  return (
    <Layout title={taxonomy_term} menus={menus}>
      {type === 'taxonomy_term--article_type' &&
        node_list.every(
          (n) =>
            n.field_article_type &&
            n.field_article_type.type === 'taxonomy_term--article_type',
        ) && <TaxonomyArticle nodes={node_list} label={taxonomy_term} />}
      {type === 'taxonomy_term--categories' &&
        node_list.every(
          (n) =>
            n.field_categories &&
            n.field_categories[0].type === 'taxonomy_term--categories',
        ) && <TaxonomyArticle nodes={node_list} label={taxonomy_term} />}
      {type === 'taxonomy_term--person_type' &&
        node_list.every(
          (n) =>
            n.field_person_type &&
            n.field_person_type.type === 'taxonomy_term--person_type',
        ) && <TaxonomyPerson nodes={node_list} label={taxonomy_term} />}
      {type === 'taxonomy_term--event_type' &&
        node_list.every(
          (n) =>
            n.field_event_type &&
            n.field_event_type.type === 'taxonomy_term--event_type',
        ) && <TaxonomyEvent nodes={node_list} label={taxonomy_term} />}
      {type === 'taxonomy_term--place_type' &&
        node_list.every(
          (n) =>
            n.field_place_type &&
            n.field_place_type.type === 'taxonomy_term--place_type',
        ) && <TaxonomyPlace nodes={node_list} label={taxonomy_term} />}
    </Layout>
  );
}
