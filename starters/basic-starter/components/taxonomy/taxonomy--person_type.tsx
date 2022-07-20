import { PageHeader } from '../page-header';
import { NodePersonTeaser } from '../node--person';
import { DrupalNode, DrupalTaxonomyTerm } from 'next-drupal';

export function TaxonomyPerson({
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
              <NodePersonTeaser key={node.id} node={node} />
            ))}
          </div>
        ) : (
          <p>No content found.</p>
        )}
      </div>
    </div>
  );
}
