"use client";

import { Eye } from "lucide-react";

type PictureStatsProps = {
  total_views: number;
};

export default function PictureStats({ total_views }: PictureStatsProps) {
  return (
    <div className="flex items-center gap-2 mb-6 text-sm text-zinc-600">
      <Eye size={16} />
      <span>{total_views.toLocaleString()} views</span>
    </div>
  );
}

