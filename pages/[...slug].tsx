import * as React from "react"
import { GetStaticPathsResult, GetStaticPropsResult } from "next"
import {
  DrupalNode,
  getPathsFromContext,
  getResourceFromContext,
  translatePathFromContext,
} from "next-drupal"
import { DrupalJsonApiParams } from "drupal-jsonapi-params"

import { getMenus } from "lib/get-menus"
import { Layout, LayoutProps } from "components/layout"
import { NodeArticle } from "components/node--article"

const CONTENT_TYPES = ["node--article"]

interface NodePageProps extends LayoutProps {
  node: DrupalNode
}

export default function NodePage({ node, menus }: NodePageProps) {
  if (!node) return null

  return (
    <Layout title={node.title} menus={menus}>
      {node.type === "node--article" && <NodeArticle node={node} />}
    </Layout>
  )
}

export async function getStaticPaths(context): Promise<GetStaticPathsResult> {
  return {
    paths: await getPathsFromContext(CONTENT_TYPES, context),
    fallback: "blocking",
  }
}

export async function getStaticProps(
  context
): Promise<GetStaticPropsResult<NodePageProps>> {
  const path = await translatePathFromContext(context)

  if (!path) {
    return {
      notFound: true,
    }
  }

  if (path.redirect) {
    const [redirect] = path.redirect
    return {
      redirect: {
        destination: redirect.to,
        permanent: redirect.status === "301",
      },
    }
  }

  const type = path.jsonapi.resourceName

  if (!CONTENT_TYPES.includes(type)) {
    return {
      notFound: true,
    }
  }

  const params = new DrupalJsonApiParams()
  if (type === "node--article") {
    params.addInclude([
      "field_article_media.image",
      "field_article_image.image",
      "field_display_author",
    ])
  }

  const node = await getResourceFromContext<DrupalNode>(type, context, {
    params: params.getQueryObject(),
  })

  // If we're not in preview mode and the resource is not published,
  // Return page not found.
  if (!context.preview && node?.status === false) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      node,
      menus: await getMenus(),
    },
    revalidate: 900,
  }
}
