import { PageHeader } from '../page-header';
import { NodePlaceTeaser } from '../node--place';

export function TaxonomyPlace({ nodes, label }) {
  return (
    <div>
      <PageHeader heading={label} text="" />
      <div className="container px-6 pb-10 mx-auto">
        {nodes?.length ? (
          <div className="grid gap-14">
            {nodes.map((node) => (
              <NodePlaceTeaser key={node.id} node={node} />
            ))}
          </div>
        ) : (
          <p>No content found.</p>
        )}
      </div>
    </div>
  );
}
