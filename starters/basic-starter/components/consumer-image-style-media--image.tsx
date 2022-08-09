import Image from 'next/image';

import { MediaImageProps } from './media--image';

export function ConsumerImageStyleMediaImage({
  media,
  layout = 'responsive',
  objectFit,
  priority,
  width,
  height,
  ...props
}: MediaImageProps) {
  const image = media?.image;

  if (!image) {
    return null;
  }

  const consumerImageStyle = image.links['coh_medium'];
  const sizeProps =
    layout === 'fill'
      ? null
      : {
          width: width || consumerImageStyle.meta.width,
          height: height || consumerImageStyle.meta.height,
        };

  return (
    <div className="media__content image__wrapper" {...props}>
      <Image
        src={consumerImageStyle.href}
        layout={layout}
        objectFit={objectFit}
        alt={image.resourceIdObjMeta.alt || 'Image'}
        title={image.resourceIdObjMeta.title}
        priority={priority}
        {...sizeProps}
      />
    </div>
  );
}
