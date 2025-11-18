'use client'

import Masonry from 'react-masonry-css'
import Image from 'next/image'

const breakpointColumns = {
  default: 5,
  1280: 4,
  1024: 3,
  768: 2,
  480: 1,
}

interface MasonryGalleryProps {
  images: string[];
}

export default function MasonryGalleryProfile({images} : MasonryGalleryProps) {
  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="flex -ml-4"
      columnClassName="pl-4 space-y-4"
    >
      {images.map((item, idx) => (
          <Image
            key={idx}
            src={item}
            alt={`photo-${idx}`}
            width={600}
            height={600}
            className="w-full h-auto object-cover rounded-xl"
            sizes="(min-width:1024px) 20vw, (min-width:768px) 33vw, 50vw"
            priority={idx < 5}
          />
      ))}
    </Masonry>
  )
}
