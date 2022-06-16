import Image, { ImageProps } from "next/image"
import { DrupalMedia } from "next-drupal"

import { absoluteURL } from "lib/absolute-url"

interface MediaImageProps extends Partial<ImageProps> {
  media: DrupalMedia
}

MediaImage.type = "media--image"

export function MediaImage({
  media,
  layout = "responsive",
  objectFit,
  width,
  height,
  priority,
  ...props
}: MediaImageProps) {
  const image = media?.image

  if (!image) {
    return null
  }

  const sizeProps =
    layout === "fill"
      ? null
      : {
          width: width || image.resourceIdObjMeta.width,
          height: height || image.resourceIdObjMeta.height,
        }

  return (
    <div className="media__content image__wrapper" {...props}>
      <Image
        src={absoluteURL(image.uri.url)}
        layout={layout}
        objectFit={objectFit}
        alt={image.resourceIdObjMeta.alt || "Image"}
        title={image.resourceIdObjMeta.title}
        priority={priority}
        {...sizeProps}
      />
    </div>
  )
}
