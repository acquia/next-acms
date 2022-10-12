import { GetStaticPropsResult } from 'next';
import { DrupalNode } from 'next-drupal';
import { DrupalJsonApiParams } from 'drupal-jsonapi-params';
import { useTranslation, SSRConfig } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { getMenus } from 'lib/get-menus';
import { Layout, LayoutProps } from 'components/layout';
import { PageHeader } from 'components/page-header';
import { NodeArticleTeaser } from 'components/node--article';
import { drupal } from '../lib/drupal';

interface ArticlesPageProps extends LayoutProps, SSRConfig {
  articles: DrupalNode[];
}

export default function ArticlePage({ menus, articles }: ArticlesPageProps) {
  const { t } = useTranslation();
  return (
    <Layout title={t('Articles')} menus={menus}>
      <PageHeader heading={t('Articles')} text={t('List of latest articles')} />
      <div className="container px-6 pb-10 mx-auto">
        {articles?.length ? (
          <div className="grid gap-14 md:grid-cols-2">
            {articles.map((article) => (
              <NodeArticleTeaser key={article.id} node={article} />
            ))}
          </div>
        ) : (
          <p>{t('No content found')}</p>
        )}
      </div>
    </Layout>
  );
}

export async function getStaticProps(
  context,
): Promise<GetStaticPropsResult<ArticlesPageProps>> {
  const articles = await drupal.getResourceCollectionFromContext<DrupalNode[]>(
    'node--article',
    context,
    {
      params: new DrupalJsonApiParams()
        .addFilter('status', '1')
        .addSort('created', 'DESC')
        .addInclude(['field_article_image.image', 'field_display_author'])
        .addFields('node--article', [
          'id',
          'title',
          'body',
          'path',
          'created',
          'field_display_author',
          'field_article_image',
        ])
        .getQueryObject(),
    },
  );

  return {
    props: {
      articles,
      menus: await getMenus(context),
      ...(await serverSideTranslations(context.locale)),
    },
    revalidate: 60,
  };
}
