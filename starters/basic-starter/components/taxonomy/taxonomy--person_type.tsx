import { PageHeader } from '../page-header';
import { NodePersonTeaser } from '../node--person';

export function TaxonomyPerson({ nodes, taxonomy_term }) {
  return (
    <div>
      <PageHeader heading={taxonomy_term} text="" />
      <div className="container px-6 pb-10 mx-auto">
        {nodes?.length ? (
          <div className="grid gap-14 md:grid-cols-2">
            {nodes.map((node) => (
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
