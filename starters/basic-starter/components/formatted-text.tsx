import Image from 'next/image';
import Link from 'next/link';
import parse, { HTMLReactParserOptions, domToReact } from 'html-react-parser';
import { Element } from 'domhandler/lib/node';
import { absoluteURL } from '../lib/absolute-url';

import { isRelative } from 'lib/is-relative';

const options: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (domNode instanceof Element) {
      // Replace inline images with `Image` component.
      if (domNode.name === 'img') {
        const {
          src,
          alt,
          class: className,
          width = '100px',
          height = '100px',
        } = domNode.attribs;

        if (isRelative(src)) {
          return (
            <div className={className}>
              <Image
                src={absoluteURL(`/${src}`)}
                width={`${width}px`}
                height={`${height}px`}
                alt={alt}
                layout="intrinsic"
                objectFit="cover"
              />
            </div>
          );
        }
      }

      // Replace inline links with `Link` component.
      if (domNode.name === 'a') {
        const { href, class: className } = domNode.attribs;

        if (href && isRelative(href)) {
          return (
            <Link href={href} passHref>
              <a className={className}>{domToReact(domNode.children)}</a>
            </Link>
          );
        }
      }
    }
  },
};

interface FormattedTextProps {
  format?: string;
  processed: string;
  value?: string;
}

export function FormattedText({ processed }: FormattedTextProps) {
  return <>{parse(processed, options)}</>;
}
