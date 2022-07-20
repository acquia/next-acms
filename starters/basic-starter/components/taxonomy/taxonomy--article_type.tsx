import { PageHeader } from '../page-header';
import { NodeArticleTeaser } from '../node--article';
import { DrupalNode, DrupalTaxonomyTerm } from 'next-drupal';

export function TaxonomyArticle({
  additionalContent,
  taxonomy_term,
}: {
  additionalContent: { nodes: DrupalNode[] };
  taxonomy_term: DrupalTaxonomyTerm;
}) {
  return (
    <div>
      <PageHeader heading={taxonomy_term.name} text="" />
      <div className="container px-6 pb-10 mx-auto">
        {additionalContent.nodes.length ? (
          <div className="grid gap-14 md:grid-cols-2">
            {additionalContent.nodes.map((node) => (
              <NodeArticleTeaser key={node.id} node={node} />
            ))}
          </div>
        ) : (
          <p>No content found.</p>
        )}
      </div>
    </div>
  );
}
