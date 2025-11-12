"use client";

import type { ProfileData } from "./types";

type ProfileStatsProps = {
  stats: ProfileData["stats"];
};

export default function ProfileStats({ stats }: ProfileStatsProps) {
  return (
    <div className="flex items-center gap-8 mb-8 pb-6 border-b border-zinc-200">
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-zinc-900">
          {stats.total_images.toLocaleString()}
        </span>
        <span className="text-sm text-zinc-600">Images</span>
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-zinc-900">
          {stats.total_likes.toLocaleString()}
        </span>
        <span className="text-sm text-zinc-600">Likes</span>
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-zinc-900">
          {stats.total_collections}
        </span>
        <span className="text-sm text-zinc-600">Collections</span>
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-zinc-900">
          {stats.total_followers.toLocaleString()}
        </span>
        <span className="text-sm text-zinc-600">Followers</span>
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-zinc-900">
          {stats.total_following.toLocaleString()}
        </span>
        <span className="text-sm text-zinc-600">Following</span>
      </div>
    </div>
  );
}

