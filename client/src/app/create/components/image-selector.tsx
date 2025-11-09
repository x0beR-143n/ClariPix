"use client"

import { useMemo } from "react"
import { Check } from "lucide-react"

interface ImageSelectorProps {
  images: File[]
  selectedImages: number[]
  onSelectionChange: (indexes: number[]) => void
}

export default function ImageSelector({ images, selectedImages, onSelectionChange }: ImageSelectorProps) {
  const previews = useMemo(() => images.map((f) => URL.createObjectURL(f)), [images])

  const toggle = (index: number) => {
    const exists = selectedImages.includes(index)
    const next = exists ? selectedImages.filter((i) => i !== index) : [...selectedImages, index]
    onSelectionChange(next)
  }

  if (!images || images.length === 0) {
    return <p className="text-sm text-muted-foreground">No images available.</p>
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {images.map((_, idx) => {
        const isSelected = selectedImages.includes(idx)
        return (
          <button
            key={idx}
            type="button"
            onClick={() => toggle(idx)}
            className={`relative aspect-square rounded-lg overflow-hidden border transition-shadow ${
              isSelected ? "border-primary ring-2 ring-primary/40" : "border-border hover:shadow"
            }`}
            aria-pressed={isSelected}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previews[idx]} alt={`Image ${idx + 1}`} className="w-full h-full object-cover" />
            {isSelected && (
              <span className="absolute top-2 right-2 inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground">
                <Check className="h-4 w-4" />
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
