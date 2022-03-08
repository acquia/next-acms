import Head from "next/head"
import { GetStaticPropsResult } from "next"
import { Layout, LayoutProps } from "components/layout"
import { getMenus } from "lib/get-menus"
import { PageHeader } from "components/page-header"

interface IndexPageProps extends LayoutProps {}

export default function IndexPage({ menus }: IndexPageProps) {
  return (
    <Layout title="Home" menus={menus}>
      <PageHeader
        heading="Acquia CMS: Headless"
        text="A Next.js site powered by Acquia CMS."
      />
      <div className="container px-6 mx-auto">
        <p>Landing page</p>
      </div>
    </Layout>
  )
}

export async function getStaticProps(): Promise<
  GetStaticPropsResult<IndexPageProps>
> {
  return {
    props: {
      menus: await getMenus(),
    },
  }
}
