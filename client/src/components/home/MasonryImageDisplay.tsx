'use client'

import Masonry from 'react-masonry-css'
import Image from 'next/image'
import Link from 'next/link'

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

export default function MasonryGallery({images} : MasonryGalleryProps) {
  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="flex -ml-4"
      columnClassName="pl-4 space-y-4"
    >
      {images.map((src, idx) => {
        // Encode the image URL to use as route parameter
        const encodedUrl = encodeURIComponent(src);
        return (
          <Link 
            key={idx} 
            href={`/picture_detail/${encodedUrl}`}
            className="block overflow-hidden rounded-xl hover:opacity-90 transition cursor-pointer"
          >
            <Image
              src={src}
              alt={`photo-${idx}`}
              width={600}
              height={600}
              className="w-full h-auto object-cover rounded-xl"
              sizes="(min-width:1024px) 20vw, (min-width:768px) 33vw, 50vw"
              priority={idx < 5}
            />
          </Link>
        );
      })}
    </Masonry>
  )
}
