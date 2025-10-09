import type { DetailedHTMLProps, HTMLAttributes } from 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'lottie-player': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        autoplay?: boolean;
        background?: string;
        controls?: boolean;
        loop?: boolean;
        mode?: string;
        renderer?: string;
        speed?: string | number;
        src?: string;
        [key: string]: unknown;
      };
    }
  }
}

export {};
