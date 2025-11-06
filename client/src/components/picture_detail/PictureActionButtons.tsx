"use client";

import { Heart, Share2, Download, MoreHorizontal, Bookmark } from "lucide-react";

type PictureActionButtonsProps = {
  isLiked: boolean;
  isSaved: boolean;
  likeCount: number;
  onLike: () => void;
  onSave: () => void;
};

export default function PictureActionButtons({
  isLiked,
  isSaved,
  likeCount,
  onLike,
  onSave,
}: PictureActionButtonsProps) {
  return (
    <div className="flex items-center gap-3 mb-6 flex-wrap">
      <button
        onClick={onSave}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm transition-colors ${
          isSaved
            ? "bg-zinc-900 text-white hover:bg-zinc-800"
            : "bg-red-600 text-white hover:bg-red-700"
        }`}
      >
        <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
        {isSaved ? "Saved" : "Save"}
      </button>

      <button
        onClick={onLike}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm transition-colors ${
          isLiked
            ? "bg-zinc-200 text-zinc-900 hover:bg-zinc-300"
            : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
        }`}
      >
        <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
        {likeCount}
      </button>

      <button className="flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm bg-zinc-100 text-zinc-900 hover:bg-zinc-200 transition-colors">
        <Share2 size={18} />
        Share
      </button>

      <button
        className="flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm bg-zinc-100 text-zinc-900 hover:bg-zinc-200 transition-colors"
        aria-label="Download image"
      >
        <Download size={18} />
      </button>

      <button
        className="flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm bg-zinc-100 text-zinc-900 hover:bg-zinc-200 transition-colors"
        aria-label="More options"
      >
        <MoreHorizontal size={18} />
      </button>
    </div>
  );
}

