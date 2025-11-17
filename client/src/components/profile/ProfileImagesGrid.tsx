"use client";

import Masonry from "react-masonry-css";
import Image from "next/image";
import Link from "next/link";

const breakpointColumns = {
  default: 5,
  1280: 4,
  1024: 3,
  768: 2,
  480: 1,
};

type ProfileImagesGridProps = {
  images: string[];
};

export default function ProfileImagesGrid({ images }: ProfileImagesGridProps) {
  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-500 text-lg">No images yet</p>
      </div>
    );
  }

  // Extract ID from S3 URL or use index as fallback
  const uniqueImages = Array.from(new Map(images.map(url => [url, url])).values());
  const imagesWithIds = uniqueImages.map((url, idx) => {
    const uuidMatch = url.match(/images\/([a-f0-9-]+)/);
    return {
      id: uuidMatch ? uuidMatch[1] : `img-${idx}`,
      image_url: url,
    };
  });

  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="flex -ml-4"
      columnClassName="pl-4 space-y-4"
    >
      {imagesWithIds.map((item, idx) => (
        <Link
          key={`${item.id}-${idx}`}
          href={`/picture_detail/${item.id}`}
          className="block overflow-hidden rounded-xl hover:opacity-90 transition cursor-pointer"
        >
          <Image
            src={item.image_url}
            alt={`photo-${idx}`}
            width={600}
            height={600}
            className="w-full h-auto object-cover rounded-xl"
            sizes="(max-width:1024px) 20vw, (min-width:768px) 33vw, 50vw"
            priority={idx < 5}
          />
        </Link>
      ))}
    </Masonry>
  );
}

