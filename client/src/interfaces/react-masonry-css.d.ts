declare module 'react-masonry-css' {
  import * as React from 'react';

  export interface MasonryProps {
    breakpointCols?: number | { [key: string]: number };
    className?: string;
    columnClassName?: string;
    children?: React.ReactNode;
  }

  const Masonry: React.ComponentType<MasonryProps>;
  export default Masonry;
}
