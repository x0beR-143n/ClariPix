// components/home/GallerySkeleton.tsx
'use client'

import { Skeleton } from "@/components/ui/skeleton"

type Props = {
  count?: number
}

export default function GallerySkeleton({ count = 16 }: Props) {
  // tạo độ cao khác nhau để giống masonry
  const heights = [160, 220, 280, 200, 180, 240, 260, 210]

  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="break-inside-avoid">
          <Skeleton
            className="w-full rounded-xl"
            style={{ height: heights[i % heights.length] }}
          />
        </div>
      ))}
    </div>
  )
}
