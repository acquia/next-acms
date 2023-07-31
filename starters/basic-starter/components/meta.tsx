import Head from 'next/head';
import { useRouter } from 'next/router';
import { DrupalMetatag } from 'types/drupal';

interface MetaProps {
  title?: string;
  path?: string;
  tags?: DrupalMetatag[];
}

export function Meta({ tags }: MetaProps) {
  const router = useRouter();
  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : '';
  const currentUrl = `${origin}${router.asPath !== '/' ? router.asPath : ''}`;
  // Initialize imageUrl variable with default value.
  const imageUrl = `${origin}/_next/image?url=`;
  // Initialize schemaMetatag variable with empty object.
  const schemaMetatag = {};
  // Initialize schemaMetatagData variable with empty object.
  const schemaMetatagData = {};
  // Check whether the tags is an array list.
  if (Array.isArray(tags)) {
    tags = tags.filter((obj) => {
      // Prepare image url and set to the attributes content.
      if (
        obj.attributes.property === 'og:image' ||
        obj.attributes.name === 'twitter:image' ||
        obj.attributes.name === 'image'
      ) {
        obj.attributes.content = `${imageUrl}${encodeURIComponent(
          obj.attributes.content,
        )}&w=1200&q=75`;
      }
      // Set og:url to page url.
      if (obj.attributes.property === 'og:url') {
        obj.attributes.content = currentUrl;
      }
      // Return null if keywords is empty.
      if (obj.attributes.name === 'keywords') {
        obj.attributes.content = obj.attributes.content.replace(/,\s*$/, '');
      }
      // Prepare schema metatag object.
      if (obj.attributes.schema_metatag) {
        schemaMetatag[obj.attributes.name] = obj.attributes.content;
      }
      // Canonical and schem_metatag both needs to render inside link and
      // script tag respectively and if any attributes having no content then,
      // we are returning null from here.
      if (
        obj.attributes.rel === 'canonical' ||
        obj.attributes.schema_metatag ||
        obj.attributes.content.length == 0
      ) {
        return null;
      }

      return obj;
    });

    // Prepare schema metatag data object.
    schemaMetatagData['@context'] = 'https://schema.org';
    schemaMetatagData['@graph'] = [schemaMetatag];
  }

  return (
    <Head>
      <script type="application/ld+json">
        {JSON.stringify(schemaMetatagData)}
      </script>
      <link rel="canonical" href={currentUrl} />
      {tags?.length ? (
        tags.map((tag, index) => {
          if (tag.attributes.name === 'title') {
            return (
              <title key={tag.attributes.name}>{tag.attributes.content}</title>
            );
          }
          const Tag = tag.tag as keyof JSX.IntrinsicElements;
          return <Tag key={index} {...tag.attributes}></Tag>;
        })
      ) : (
        <>
          <meta name="MobileOptimized" content="width" />
          <meta name="HandheldFriendly" content="true" />
        </>
      )}
    </Head>
  );
}
