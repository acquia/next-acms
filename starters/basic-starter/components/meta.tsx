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
  const origin = typeof window !== 'undefined' && window.location.origin
  ? window.location.origin : '';
  return (
    <Head>
      <link rel="canonical" href={`${origin}${router.asPath !== '/' ? router.asPath : ''}`} />
      {tags?.length ? (
        tags.map((tag, index) => {
          if (tag.attributes.rel === 'canonical') {
            return null;
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
              <meta key={index} name={tag.attributes.name} content={tag.attributes.content.name} />
            );
          }
          // If page metadata consists of image.
          // Due to nested object, we have to set the tag explicitly.
          if (tag.attributes.name === 'image') {
            return (
              <meta key={index} name={tag.attributes.name} content={tag.attributes.content.url} />
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
