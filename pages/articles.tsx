import { Layout, LayoutProps } from "components/layout"
import { NodeArticleTeaser } from "components/node--article"
import { PageHeader } from "components/page-header"
import { DrupalJsonApiParams } from "drupal-jsonapi-params"
import { getMenus } from "lib/get-menus"
import { GetStaticPropsResult } from "next"
import { DrupalNode, getResourceCollectionFromContext } from "next-drupal"

interface ArticlesPageProps extends LayoutProps {
  articles: DrupalNode[]
}

export default function ArticlePage({ menus, articles }: ArticlesPageProps) {
  return (
    <Layout title="Articles" menus={menus}>
      <PageHeader heading="Articles" text="List of latest articles." />
      <div className="container px-6 pb-10 mx-auto">
        {articles?.length ? (
          <div className="grid gap-14 md:grid-cols-2">
            {articles.map((article) => (
              <NodeArticleTeaser key={article.id} node={article} />
            ))}
          </div>
        ) : (
          <p>No articles found.</p>
        )}
      </div>
    </Layout>
  )
}

export async function getStaticProps(
  context
): Promise<GetStaticPropsResult<ArticlesPageProps>> {
  const params = new DrupalJsonApiParams()
    .addFilter("status", "1")
    .addSort("created", "DESC")
    .addPageLimit(6)
    .addInclude(["field_article_image.image", "field_display_author"])
    .addFields("node--article", [
      "id",
      "title",
      "body",
      "path",
      "created",
      "field_display_author",
      "field_article_image",
    ])

  const articles = await getResourceCollectionFromContext<DrupalNode[]>(
    "node--article",
    context,
    {
      params: params.getQueryObject(),
    }
  )

  return {
    props: {
      articles,
      menus: await getMenus(),
    },
  }
}
