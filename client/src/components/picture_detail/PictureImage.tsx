"use client";

import Image from "next/image";
import type { PictureData } from "./types";

type PictureImageProps = {
  pictureData: PictureData;
};

export default function PictureImage({ pictureData }: PictureImageProps) {
  return (
    <div className="flex-shrink-0">
      <div className="sticky top-6">
        <div className="relative w-full rounded-2xl overflow-hidden bg-zinc-100 aspect-auto">
          <Image
            src={pictureData.image_url}
            alt={pictureData.title}
            width={800}
            height={1200}
            className="w-full h-auto object-contain rounded-2xl"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
    </div>
  );
}

