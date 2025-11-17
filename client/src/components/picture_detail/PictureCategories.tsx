"use client";

import Link from "next/link";
import type { PictureData } from "./types";

type PictureCategoriesProps = {
  categories?: string[];
};

export default function PictureCategories({
  categories,
}: PictureCategoriesProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        {categories.map((category, index) => (
          <Link
            key={index}
            href={`/discover?category=${encodeURIComponent(category)}`}
            className="px-3 py-1.5 rounded-full bg-zinc-300 text-zinc-700 text-sm font-medium hover:bg-zinc-400 transition-colors"
          >
            {category}
          </Link>
        ))}
      </div>
    </div>
  );
}

