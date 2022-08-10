import Image, { ImageProps } from 'next/image';
import { DrupalMedia } from 'next-drupal';

import { absoluteURL } from 'lib/absolute-url';

interface MediaImageProps extends Partial<ImageProps> {
  media: DrupalMedia;
  imageStyle?: string;
}

MediaImage.type = 'media--image';

export function MediaImage({
  media,
  layout = 'responsive',
  objectFit,
  width,
  height,
  priority,
  sizes,
  imageStyle,
  ...props
}: MediaImageProps) {
  const image = media?.image;

  if (!image) {
    return null;
  }
  let sizeProps;
  let srcURL;

  // Use the image style to render an image if specified.
  if (imageStyle && image.links[imageStyle]) {
    const imageStyleSource = image.links[imageStyle];
    sizeProps = {
      width: width || imageStyleSource.meta.width,
      height: height || imageStyleSource.meta.height,
    };
    srcURL = imageStyleSource.href;
  } else {
    sizeProps =
      layout === 'fill'
        ? null
        : {
            width: width || image.resourceIdObjMeta.width,
            height: height || image.resourceIdObjMeta.height,
          };
    srcURL = absoluteURL(image.uri.url);
  }

  return (
    <div className="media__content image__wrapper" {...props}>
      <Image
        src={srcURL}
        layout={layout}
        objectFit={objectFit}
        alt={image.resourceIdObjMeta.alt || 'Image'}
        title={image.resourceIdObjMeta.title}
        priority={priority}
        sizes={sizes}
        {...sizeProps}
      />
    </div>
  );
}
