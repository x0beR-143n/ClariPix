"use client";

import { Eye, MessageCircle } from "lucide-react";
import type { PictureData } from "./types";

type PictureStatsProps = {
  total_views: number;
  total_comments: number;
};

export default function PictureStats({
  total_views,
  total_comments,
}: PictureStatsProps) {
  return (
    <div className="flex items-center gap-6 mb-6 text-sm text-zinc-600">
      <div className="flex items-center gap-2">
        <Eye size={16} />
        <span>{total_views.toLocaleString()} views</span>
      </div>
      <div className="flex items-center gap-2">
        <MessageCircle size={16} />
        <span>{total_comments} comments</span>
      </div>
    </div>
  );
}

