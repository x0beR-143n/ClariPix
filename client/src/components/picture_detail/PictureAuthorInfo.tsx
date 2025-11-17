"use client";

import type { PictureData } from "./types";

type PictureAuthorInfoProps = {
  uploader_name?: string;
};

export default function PictureAuthorInfo({ uploader_name }: PictureAuthorInfoProps) {
  const displayName = uploader_name || "User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-zinc-200 flex items-center justify-center">
        <span className="text-lg font-bold text-zinc-600">{initial}</span>
      </div>
      <div>
        <div className="block font-semibold text-zinc-900">
          {displayName}
        </div>
      </div>
    </div>
  );
}

