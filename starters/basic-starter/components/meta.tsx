import Head from 'next/head';
import { unstable_getImgProps } from 'next/image';
import { DrupalMetatag } from 'types/drupal';

interface MetaProps {
  path?: string;
  tags?: DrupalMetatag[];
}

export function Meta({ path, tags }: MetaProps) {
  const baseUrl = absoluteSiteUrl();
  const absoluteUrl = `${baseUrl}${path !== '/' ? path : ''}`.split('?')[0];
  const schemaMetatag = {};
  const schemaMetatagData = {};
  if (Array.isArray(tags)) {
    tags = tags.filter((obj) => {
      // Set og:url to page url.
      if (obj.attributes.property === 'og:url') {
        obj.attributes.content = absoluteUrl;
      }
      // Keyword format in comma separated if single word is there then
      // trim the extra white space and exclude the comma.
      if (obj.attributes.name === 'keywords') {
        obj.attributes.content = obj.attributes.content.replace(/,\s*$/, '');
      }

      // Prepare schema metatag object.
      if (obj.attributes.schema_metatag) {
        schemaMetatag[obj.attributes.name] =
          obj.attributes.name === 'image'
            ? imageAbsoluteUrl(obj.attributes.content.url)
            : obj.attributes.content;
      }
      // Canonical and schema_metatag both needs to render inside link and
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
        {JSON.stringify(schemaMetatagData, null, 2)}
      </script>
      <link rel="canonical" href={absoluteUrl} />
      {tags?.length ? (
        tags.map((tag, index) => {
          if (tag.attributes.name === 'title') {
            return <title key={index}>{tag.attributes.content}</title>;
          }
          if (tag.attributes.property === 'og:image') {
            return (
              <meta
                key={index}
                property={tag.attributes.property}
                content={imageAbsoluteUrl(tag.attributes.content)}
              />
            );
          }
          if (tag.attributes.name === 'twitter:image') {
            return (
              <meta
                key={index}
                name={tag.attributes.name}
                content={imageAbsoluteUrl(tag.attributes.content)}
              />
            );
          }

          const Tag = tag.tag as keyof JSX.IntrinsicElements;
          return <Tag key={index} {...tag.attributes}></Tag>;
        })
      ) : (
        <></>
      )}
    </Head>
  );
}

export function imageAbsoluteUrl(content: string) {
  const imageProps = unstable_getImgProps({
    src: content,
    alt: '',
    quality: 75,
    width: 1200,
    height: 630,
  });

  // Convert relative image path into absolute URL because this is expected by
  // the Open Graph Protocol.
  // @see https://ogp.me/#data_types
  let absoluteUrl = imageProps.props.src;
  if (absoluteUrl.startsWith('/')) {
    absoluteUrl = absoluteSiteUrl() + absoluteUrl;
  }

  return absoluteUrl;
}

export function absoluteSiteUrl() {
  const clientSideUrl =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : '';
  const siteBaseUrl = process.env.NEXT_PUBLIC_SITE_BASE_URL;

  return siteBaseUrl ? siteBaseUrl : clientSideUrl;
}
