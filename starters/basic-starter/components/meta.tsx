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
  let imageUrl = `${origin}/_next/image?url=`;
  // Check whether the tags is an array list.
  if (Array.isArray(tags)) {
    // Filter out image property from og:image
    const filterImage = tags.filter((obj) => {
      return obj.attributes.property === 'og:image';
    });
    // Prepare image url.
    const imageSrc = filterImage[0].attributes.content;
    imageUrl = `${imageUrl}${encodeURIComponent(imageSrc)}&w=1200&q=75`;
  }

  return (
    <Head>
      <link rel="canonical" href={currentUrl} />
      {tags?.length ? (
        tags.map((tag, index) => {
          if (tag.attributes.rel === 'canonical') {
            return null;
          }
          if (tag.attributes.property === 'og:url') {
            return (
              <meta
                key={index}
                property={tag.attributes.property}
                content={currentUrl}
              />
            );
          }
          if (tag.attributes.property === 'og:image') {
            return (
              <meta
                key={index}
                property={tag.attributes.property}
                content={imageUrl}
              />
            );
          }
          if (tag.attributes.name === 'title') {
            return (
              <title key={tag.attributes.name}>{tag.attributes.content}</title>
            );
          }
          // If page metadata consists of author.
          // Due to nested object, we have to set the tag explicitly.
          if (tag.attributes.name === 'author') {
            return (
              <meta
                key={index}
                name={tag.attributes.name}
                content={tag.attributes.content.name}
              />
            );
          }
          // If page metadata consists of image.
          // Due to nested object, we have to set the tag explicitly.
          if (
            tag.attributes.name === 'image' ||
            tag.attributes.name === 'twitter:image'
          ) {
            return (
              <meta key={index} name={tag.attributes.name} content={imageUrl} />
            );
          }
          const Tag = tag.tag as keyof JSX.IntrinsicElements;
          return <Tag key={index} {...tag.attributes}></Tag>;
        })
      ) : (
        <>
          <meta property="og:image:width" content="800" />
          <meta property="og:image:height" content="600" />
        </>
      )}
    </Head>
  );
}
