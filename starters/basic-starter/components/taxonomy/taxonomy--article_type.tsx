import {PageHeader} from "../page-header";
import {NodeArticleTeaser} from "../node--article";

export function TaxonomyArticle({ nodes, label, ...props }) {
  return (
    <div>
      <PageHeader heading={label} text="" />
      <div className="container px-6 pb-10 mx-auto">
        {nodes?.length ? (
          <div className="grid gap-14 md:grid-cols-2">
            {nodes.map((node) => (
              <NodeArticleTeaser key={node.id} node={node} />
            ))}
          </div>
        ) : (
          <p>No content found.</p>
        )}
      </div>
    </div>
  )};