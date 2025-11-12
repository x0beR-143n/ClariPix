"use client";

import Image from "next/image";
import type { PictureData } from "./types";

type PictureAuthorInfoProps = {
  uploader: PictureData["uploader"];
};

export default function PictureAuthorInfo({ uploader }: PictureAuthorInfoProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="relative w-12 h-12 rounded-full overflow-hidden hover:opacity-90 transition-opacity">
        <Image
          src={uploader.avatar_url}
          alt={uploader.display_name}
          fill
          className="object-cover"
        />
      </div>
      <div>
        <div className="block font-semibold text-zinc-900">
          {uploader.display_name}
        </div>
        <p className="text-sm text-zinc-600">@{uploader.username}</p>
      </div>
    </div>
  );
}

